"""
UltraSearch — Near-Duplicate & Spam Detector
Uses SimHash (64-bit fingerprint) for near-duplicate detection.
Detects spam via heuristic signals.

SimHash algorithm:
  1. Tokenize document into n-grams
  2. Hash each token → 64-bit integer
  3. For each bit position: +1 if set, -1 if not (weighted by TF)
  4. Final hash: bit[i] = 1 if sum[i] > 0
  5. Hamming distance ≤ 3 → near-duplicate
"""

import hashlib
import math
import re
import struct
from collections import Counter
from typing import Optional


# ─── SimHash ──────────────────────────────────────────────────────────────────

def _hash64(token: str) -> int:
    """Fast 64-bit hash of a token."""
    digest = hashlib.md5(token.encode(), usedforsecurity=False).digest()
    return struct.unpack("<Q", digest[:8])[0]


def _tokenize(text: str, ngram: int = 2) -> list[str]:
    """Tokenize text into word n-grams."""
    words = re.findall(r"\b\w+\b", text.lower())
    tokens = words[:]
    for i in range(len(words) - ngram + 1):
        tokens.append(" ".join(words[i:i + ngram]))
    return tokens


def simhash(text: str) -> int:
    """
    Compute a 64-bit SimHash fingerprint for text.
    Documents with Hamming distance ≤ 3 are considered near-duplicates.
    """
    tokens = _tokenize(text)
    freq = Counter(tokens)
    v = [0] * 64

    for token, count in freq.items():
        h = _hash64(token)
        weight = 1 + math.log(count)
        for i in range(64):
            if h & (1 << i):
                v[i] += weight
            else:
                v[i] -= weight

    fingerprint = 0
    for i in range(64):
        if v[i] > 0:
            fingerprint |= (1 << i)
    return fingerprint


def hamming_distance(h1: int, h2: int) -> int:
    """Count differing bits between two 64-bit integers."""
    xor = h1 ^ h2
    return bin(xor).count("1")


def is_near_duplicate(fp1: int, fp2: int, threshold: int = 3) -> bool:
    """Returns True if two SimHash fingerprints represent near-duplicate documents."""
    return hamming_distance(fp1, fp2) <= threshold


# ─── SimHash Index for fast lookup ───────────────────────────────────────────

class SimHashIndex:
    """
    Stores SimHash fingerprints and detects near-duplicates efficiently.
    Uses banding technique: split 64 bits into 8 bands of 8 bits each.
    Two documents share a band iff Hamming distance is small → candidate pair.
    """

    def __init__(self, bands: int = 8, threshold: int = 3):
        self.bands = bands
        self.band_size = 64 // bands
        self.threshold = threshold
        # band_index[band_num][band_value] = list of (fingerprint, doc_id)
        self._index: list[dict[int, list[tuple[int, str]]]] = [
            {} for _ in range(bands)
        ]
        self._all: dict[str, int] = {}  # doc_id → fingerprint

    def add(self, doc_id: str, fingerprint: int) -> Optional[str]:
        """
        Add a fingerprint. Returns the ID of a near-duplicate if found, else None.
        """
        # Check for duplicates via banding
        dup = self.find_duplicate(fingerprint)
        if dup:
            return dup

        # Index the new fingerprint
        self._all[doc_id] = fingerprint
        for band in range(self.bands):
            shift = band * self.band_size
            mask = (1 << self.band_size) - 1
            band_val = (fingerprint >> shift) & mask
            self._index[band].setdefault(band_val, []).append((fingerprint, doc_id))

        return None

    def find_duplicate(self, fingerprint: int) -> Optional[str]:
        """Find a near-duplicate of a fingerprint."""
        candidates: set[str] = set()
        for band in range(self.bands):
            shift = band * self.band_size
            mask = (1 << self.band_size) - 1
            band_val = (fingerprint >> shift) & mask
            for stored_fp, doc_id in self._index[band].get(band_val, []):
                candidates.add(doc_id)

        for doc_id in candidates:
            stored_fp = self._all.get(doc_id, 0)
            if is_near_duplicate(fingerprint, stored_fp, self.threshold):
                return doc_id
        return None

    def __len__(self) -> int:
        return len(self._all)


# ─── Spam Detector ───────────────────────────────────────────────────────────

# Patterns that strongly suggest spam/low-quality pages
_SPAM_PATTERNS = [
    r"buy\s+(cheap|best|discount)\s+\w+\s+online",
    r"click\s+here\s+to\s+(buy|order|download)",
    r"free\s+(iphone|ipad|gift\s+card)",
    r"\b(casino|poker|slots|gambling)\b.*\b(bonus|free|win)\b",
    r"(viagra|cialis|levitra|xanax|valium)",
    r"lose\s+\d+\s+pounds?\s+in\s+\d+\s+(days?|weeks?)",
    r"make\s+\$\d+[\d,]*\s+(per\s+day|a\s+day|daily)",
    r"\b(seo|backlink|link\s+building)\s+service",
]
_SPAM_RE = [re.compile(p, re.IGNORECASE) for p in _SPAM_PATTERNS]


def spam_score(text: str, url: str = "") -> float:
    """
    Returns a spam probability (0.0 = clean, 1.0 = spam).
    Uses heuristic signals — not ML (add a classifier for production).
    """
    score = 0.0
    text_lower = text.lower()

    # Pattern matching
    for pattern in _SPAM_RE:
        if pattern.search(text_lower):
            score += 0.3

    # Very short content
    words = text.split()
    if len(words) < 50:
        score += 0.2

    # Excessive repetition
    unique_words = set(words)
    if words and len(unique_words) / len(words) < 0.3:
        score += 0.4

    # Keyword stuffing (same word > 5% of total)
    if words:
        freq = Counter(words)
        most_common_pct = freq.most_common(1)[0][1] / len(words)
        if most_common_pct > 0.05:
            score += 0.3

    # Suspicious URL patterns
    if url:
        url_lower = url.lower()
        suspicious_tlds = [".xyz", ".tk", ".pw", ".top", ".club", ".work"]
        if any(url_lower.endswith(tld) or f"{tld}/" in url_lower for tld in suspicious_tlds):
            score += 0.2

    return min(1.0, score)


def is_spam(text: str, url: str = "", threshold: float = 0.5) -> bool:
    return spam_score(text, url) >= threshold

