"""
UltraSearch — Search Index (BM25 + Inverted Index)
Own searchable index backed by SQLite (scale up to Elasticsearch/Meilisearch later).

Components:
  1. Document Store       — stores full text, metadata, per doc
  2. Inverted Index       — term → posting list (doc_id, tf, positions)
  3. BM25 Ranker          — industry-standard relevance scoring
  4. PageRank scores      — link-graph authority signal
  5. Freshness decay      — newer pages rank higher on recency queries
  6. Query → Results      — tokenize, lookup, score, rank, return

BM25 formula:
  score(D, Q) = Σ IDF(qi) * (tf(qi,D) * (k1+1)) / (tf(qi,D) + k1*(1-b+b*|D|/avgdl))
  where k1=1.5, b=0.75 (standard values)
"""

from __future__ import annotations

import json
import math
import re
import sqlite3
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Optional


# ─── Tokenizer ────────────────────────────────────────────────────────────────

# English stop words (very common words that don't help ranking)
_STOP_WORDS = {
    "a","an","the","and","or","but","in","on","at","to","for","of","with",
    "by","from","up","about","into","through","during","is","are","was","were",
    "be","been","being","have","has","had","do","does","did","will","would",
    "could","should","may","might","must","shall","can","this","that","these",
    "those","it","its","i","you","he","she","we","they","what","which","who",
    "not","no","nor","so","yet","both","either","neither","than","as","if",
}

def tokenize(text: str, remove_stopwords: bool = True) -> list[str]:
    """
    Normalize text to lowercase tokens, remove stop words & punctuation.
    Also generates bigrams for phrase-proximity matching.
    """
    words = re.findall(r"\b[a-z0-9]+\b", text.lower())
    if remove_stopwords:
        words = [w for w in words if w not in _STOP_WORDS and len(w) > 1]
    # Add bigrams
    bigrams = [f"{words[i]}_{words[i+1]}" for i in range(len(words) - 1)]
    return words + bigrams


# ─── Data Models ─────────────────────────────────────────────────────────────

@dataclass
class IndexedDoc:
    doc_id: str         # MD5(url)
    url: str
    title: str
    description: str
    snippet: str        # first 300 chars of text
    word_count: int
    crawled_at: float
    pagerank: float = 0.5
    simhash: int = 0


@dataclass
class SearchHit:
    url: str
    title: str
    snippet: str
    description: str
    score: float
    crawled_at: float
    word_count: int


# ─── BM25 Scorer ─────────────────────────────────────────────────────────────

class BM25:
    """
    BM25 ranking parameters.
    k1=1.5 (term frequency saturation), b=0.75 (length normalization).
    """
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b

    def score(
        self,
        tf: int,           # term frequency in document
        doc_len: int,      # document length in words
        avg_doc_len: float,# average doc length in corpus
        df: int,           # number of docs containing term
        n_docs: int,       # total docs in corpus
    ) -> float:
        """Compute BM25 score for one term in one document."""
        idf = math.log((n_docs - df + 0.5) / (df + 0.5) + 1)
        tf_norm = (tf * (self.k1 + 1)) / (
            tf + self.k1 * (1 - self.b + self.b * doc_len / max(avg_doc_len, 1))
        )
        return idf * tf_norm


# ─── UltraSearch Index ────────────────────────────────────────────────────────

class UltraSearchIndex:
    """
    Full-text search index with BM25 ranking.
    SQLite backend — swap for Elasticsearch/Meilisearch at 10M+ docs.
    """

    def __init__(self, db_path: str = "data/index.db"):
        self.db_path = db_path
        self.bm25 = BM25()
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self) -> None:
        conn = self._conn()
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS documents (
                doc_id      TEXT PRIMARY KEY,
                url         TEXT UNIQUE NOT NULL,
                title       TEXT NOT NULL DEFAULT '',
                description TEXT NOT NULL DEFAULT '',
                snippet     TEXT NOT NULL DEFAULT '',
                word_count  INTEGER NOT NULL DEFAULT 0,
                crawled_at  REAL NOT NULL,
                pagerank    REAL NOT NULL DEFAULT 0.5,
                simhash     INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS postings (
                term        TEXT NOT NULL,
                doc_id      TEXT NOT NULL,
                tf          INTEGER NOT NULL DEFAULT 1,
                title_match INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY (term, doc_id)
            );

            CREATE INDEX IF NOT EXISTS idx_postings_term ON postings(term);
            CREATE INDEX IF NOT EXISTS idx_docs_crawled  ON documents(crawled_at DESC);

            CREATE TABLE IF NOT EXISTS meta (
                key   TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            INSERT OR IGNORE INTO meta VALUES ('n_docs', '0');
            INSERT OR IGNORE INTO meta VALUES ('total_words', '0');
        """)
        conn.close()

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.execute("PRAGMA journal_mode=WAL")   # Write-ahead log for concurrency
        conn.execute("PRAGMA synchronous=NORMAL") # Fast writes, safe enough
        conn.execute("PRAGMA cache_size=-64000")  # 64MB page cache
        return conn

    # ─── Indexing ─────────────────────────────────────────────────────────

    def add_document(self, doc) -> str:
        """
        Index a CrawledDoc (or any object with url, title, text, description).
        Returns doc_id. Thread-safe.
        """
        import hashlib
        doc_id = hashlib.md5(doc.url.encode()).hexdigest()
        text = getattr(doc, "text", "")
        title = getattr(doc, "title", "") or ""
        description = getattr(doc, "description", "") or ""
        snippet = text[:300].strip()
        word_count = getattr(doc, "word_count", len(text.split()))
        crawled_at = getattr(doc, "crawled_at", time.time())
        simhash_val = getattr(doc, "simhash", 0)

        # Tokenize
        body_tokens = tokenize(text)
        title_tokens = set(tokenize(title, remove_stopwords=False))

        # Term frequency
        from collections import Counter
        tf_map = Counter(body_tokens)
        # Title matches get a 3x boost in TF
        for term in title_tokens:
            if term in tf_map:
                tf_map[term] = tf_map[term] + 5  # strong title signal
            else:
                tf_map[term] = 5

        conn = self._conn()
        try:
            # Upsert document
            conn.execute("""
                INSERT OR REPLACE INTO documents
                (doc_id, url, title, description, snippet, word_count, crawled_at, simhash)
                VALUES (?,?,?,?,?,?,?,?)
            """, (doc_id, doc.url, title, description, snippet,
                  word_count, crawled_at, simhash_val))

            # Upsert postings
            conn.executemany("""
                INSERT OR REPLACE INTO postings (term, doc_id, tf, title_match)
                VALUES (?,?,?,?)
            """, [
                (term, doc_id, tf, 1 if term in title_tokens else 0)
                for term, tf in tf_map.items()
                if len(term) <= 50  # skip excessively long tokens
            ])

            # Update stats
            conn.execute("""
                UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT)
                WHERE key = 'n_docs'
            """)
            conn.execute("""
                UPDATE meta SET value = CAST(CAST(value AS INTEGER) + ? AS TEXT)
                WHERE key = 'total_words'
            """, (word_count,))
            conn.commit()
        finally:
            conn.close()

        return doc_id

    # ─── Searching ────────────────────────────────────────────────────────

    def search(
        self,
        query: str,
        num_results: int = 10,
        freshness_boost: bool = False,
    ) -> list[SearchHit]:
        """
        Search the index. Returns BM25-ranked results.
        """
        tokens = tokenize(query, remove_stopwords=False)
        if not tokens:
            return []

        # Separate stop words so we always search them in title
        query_terms = list(set(tokens))

        conn = self._conn()
        try:
            # Get corpus stats
            meta = dict(conn.execute("SELECT key, value FROM meta").fetchall())
            n_docs = int(meta.get("n_docs", 1))
            total_words = int(meta.get("total_words", 1))
            avg_doc_len = total_words / max(n_docs, 1)

            # Get postings for all query terms
            placeholders = ",".join("?" * len(query_terms))
            postings = conn.execute(f"""
                SELECT term, doc_id, tf, title_match
                FROM postings
                WHERE term IN ({placeholders})
            """, query_terms).fetchall()

            if not postings:
                return []

            # Group postings by doc
            from collections import defaultdict
            doc_terms: dict[str, dict[str, tuple[int, int]]] = defaultdict(dict)
            for term, doc_id, tf, title_match in postings:
                doc_terms[doc_id][term] = (tf, title_match)

            # Get DF (document frequency) per term
            df_map = {}
            df_rows = conn.execute(f"""
                SELECT term, COUNT(DISTINCT doc_id) as df
                FROM postings WHERE term IN ({placeholders})
                GROUP BY term
            """, query_terms).fetchall()
            for term, df in df_rows:
                df_map[term] = df

            # Fetch document metadata for candidate docs
            doc_ids = list(doc_terms.keys())
            id_placeholders = ",".join("?" * len(doc_ids))
            docs = {
                row[0]: row
                for row in conn.execute(f"""
                    SELECT doc_id, url, title, description, snippet,
                           word_count, crawled_at, pagerank
                    FROM documents
                    WHERE doc_id IN ({id_placeholders})
                """, doc_ids).fetchall()
            }

            # Score each document
            scored: list[tuple[float, str]] = []
            for doc_id, terms in doc_terms.items():
                if doc_id not in docs:
                    continue
                _, url, title, desc, snippet, word_count, crawled_at, pagerank = docs[doc_id]

                # BM25 score across all matched terms
                bm25_score = 0.0
                for term in query_terms:
                    if term in terms:
                        tf, title_match = terms[term]
                        df = df_map.get(term, 1)
                        term_score = self.bm25.score(tf, word_count, avg_doc_len, df, n_docs)
                        # Title match multiplier
                        if title_match:
                            term_score *= 2.5
                        bm25_score += term_score

                # PageRank signal (log-normalized)
                pr_score = math.log(1 + pagerank) * 0.2

                # Freshness (optional boost for recent pages)
                age_days = (time.time() - crawled_at) / 86400
                freshness = (1.0 / (1 + age_days * 0.01)) if freshness_boost else 0.0

                total = bm25_score + pr_score + freshness
                scored.append((total, doc_id))

            # Sort descending
            scored.sort(key=lambda x: x[0], reverse=True)

            # Fetch top results
            results = []
            for score, doc_id in scored[:num_results]:
                if doc_id not in docs:
                    continue
                _, url, title, desc, snippet, word_count, crawled_at, _ = docs[doc_id]
                results.append(SearchHit(
                    url=url,
                    title=title or url,
                    snippet=self._highlight(snippet, query_terms),
                    description=desc,
                    score=round(score, 4),
                    crawled_at=crawled_at,
                    word_count=word_count,
                ))

            return results

        finally:
            conn.close()

    def _highlight(self, text: str, terms: list[str]) -> str:
        """Bold query terms in snippet (markdown **term**)."""
        for term in terms[:5]:  # only highlight top 5 terms
            if "_" in term:
                continue  # skip bigrams
            pattern = re.compile(rf"\b({re.escape(term)})\b", re.IGNORECASE)
            text = pattern.sub(r"**\1**", text)
        return text

    # ─── Stats ────────────────────────────────────────────────────────────

    def stats(self) -> dict:
        conn = self._conn()
        try:
            meta = dict(conn.execute("SELECT key, value FROM meta").fetchall())
            term_count = conn.execute("SELECT COUNT(DISTINCT term) FROM postings").fetchone()[0]
            return {
                "total_documents": int(meta.get("n_docs", 0)),
                "total_terms": term_count,
                "avg_doc_length": int(meta.get("total_words", 0)) // max(int(meta.get("n_docs", 1)), 1),
                "db_path": self.db_path,
            }
        finally:
            conn.close()

    # ─── PageRank Updater ─────────────────────────────────────────────────

    def update_pagerank(self, scores: dict[str, float]) -> None:
        """Batch update PageRank scores. scores = {url: rank}"""
        import hashlib
        conn = self._conn()
        try:
            conn.executemany(
                "UPDATE documents SET pagerank=? WHERE doc_id=?",
                [
                    (score, hashlib.md5(url.encode()).hexdigest())
                    for url, score in scores.items()
                ]
            )
            conn.commit()
        finally:
            conn.close()

