"""
UltraSearch — Query Complexity Classifier
Automatically selects Mode 1 / 2 / 3 for every incoming query.

Mode 1 (Instant, 50–150ms):
  Simple factual lookups, definitions, single-entity questions.
  Examples: "What is Python?", "Capital of Japan", "Who is Elon Musk?"

Mode 2 (Standard, 200–500ms):
  Moderate complexity — comparisons, explanations, recent events.
  Examples: "Compare Python vs JavaScript", "History of AI", "Latest React version"

Mode 3 (Deep Research, 1–5s+):
  Complex multi-faceted research, reports, cross-source analysis.
  Examples: "Write a historical analysis of quantum computing",
            "Compare 20 AI companies", "Investigate climate change data"

Classification uses:
  1. Rule-based heuristics (fastest, no ML needed)
  2. Query length + complexity signals
  3. Trigger word detection
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from enum import IntEnum


class SearchMode(IntEnum):
    INSTANT  = 1   # 50–150ms
    STANDARD = 2   # 200–500ms
    DEEP     = 3   # 1–5s+


@dataclass
class ClassificationResult:
    mode: SearchMode
    confidence: float      # 0–1
    reason: str
    estimated_ms: str


# ─── Trigger words / patterns ────────────────────────────────────────────────

# Mode 1: Instant — simple factual
_INSTANT_TRIGGERS = [
    r"\bwhat is\b",
    r"\bwho is\b",
    r"\bwho was\b",
    r"\bwhen (is|was|did)\b",
    r"\bwhere is\b",
    r"\bhow (tall|old|many|much|far)\b",
    r"\bdefine\b",
    r"\bdefinition of\b",
    r"\bcapital (of|city)\b",
    r"\bfounded\b.*\bwhen\b",
    r"\bborn (in|on)\b",
    r"\b(ceo|founder|president|prime minister) of\b",
    r"\bconvert\b.*\bto\b",
    r"\bcurrency\b",
    r"\bweather\b",
    r"\btime (in|at)\b",
]

# Mode 2: Standard — moderate complexity
_STANDARD_TRIGGERS = [
    r"\bcompare\b",
    r"\bvs\.?\b",
    r"\bversus\b",
    r"\bdifference between\b",
    r"\bexplain\b",
    r"\bhow (does|do|to)\b",
    r"\bhistory of\b",
    r"\brecent (news|updates?|developments?)\b",
    r"\bbest\b.*\bfor\b",
    r"\btop \d+\b",
    r"\breview of\b",
    r"\badvantages?\b",
    r"\bdisadvantages?\b",
    r"\bpros and cons\b",
    r"\bsummary of\b",
    r"\boverview of\b",
    r"\bhow (it )?works?\b",
    r"\blatest\b",
    r"\btrending\b",
]

# Mode 3: Deep — complex research
_DEEP_TRIGGERS = [
    r"\banalysis\b",
    r"\banalyze\b",
    r"\bresearch\b",
    r"\breport\b",
    r"\binvestigat\w+\b",
    r"\bcomprehensive\b",
    r"\bdetailed\b",
    r"\bin-depth\b",
    r"\bwrite\b.{0,30}\b(article|report|essay|paper|analysis|post)\b",
    r"\bcompare \d+ \w+\b",      # "compare 20 companies"
    r"\blist (all|every|top \d{2,})\b",
    r"\bsynthesi[sz]e\b",
    r"\bcross-?reference\b",
    r"\bmultiple sources?\b",
    r"\bfull (report|analysis|breakdown)\b",
    r"\bcomprehensive guide\b",
    r"\bscientific (research|study|paper)\b",
    r"\bmarket analysis\b",
    r"\bcompetitor analysis\b",
    r"\bdue diligence\b",
]

_INSTANT_RE  = [re.compile(p, re.IGNORECASE) for p in _INSTANT_TRIGGERS]
_STANDARD_RE = [re.compile(p, re.IGNORECASE) for p in _STANDARD_TRIGGERS]
_DEEP_RE     = [re.compile(p, re.IGNORECASE) for p in _DEEP_TRIGGERS]


# ─── Classifier ──────────────────────────────────────────────────────────────

def classify_query(query: str) -> ClassificationResult:
    """
    Classify a search query into Mode 1, 2, or 3.
    Uses rule-based heuristics — runs in < 1ms.
    """
    q = query.strip()
    words = q.split()
    word_count = len(words)

    # ── Score each mode ───────────────────────────────────────────────────
    deep_score     = sum(1 for p in _DEEP_RE     if p.search(q))
    standard_score = sum(1 for p in _STANDARD_RE if p.search(q))
    instant_score  = sum(1 for p in _INSTANT_RE  if p.search(q))

    # ── Length heuristics ────────────────────────────────────────────────
    if word_count <= 4:
        instant_score += 2
    elif word_count <= 10:
        standard_score += 1
    elif word_count <= 20:
        standard_score += 2
    else:
        deep_score += 2

    # ── Sentence count (multi-sentence = research intent) ─────────────────
    sentences = re.split(r"[.!?]+", q)
    if len(sentences) > 2:
        deep_score += 2

    # ── Number of entities (many entities = comparison = deeper) ─────────
    # Rough proxy: count commas and "and"s
    entity_count = q.count(",") + len(re.findall(r"\band\b", q, re.I))
    if entity_count >= 3:
        deep_score += 1
        standard_score += 0.5

    # ── Decision ──────────────────────────────────────────────────────────
    if deep_score > standard_score and deep_score > instant_score:
        mode = SearchMode.DEEP
        confidence = min(1.0, deep_score / (deep_score + standard_score + instant_score + 0.1))
        reason = f"Detected deep research signals ({deep_score} triggers)"
        est = "1–5s+"
    elif instant_score > standard_score and instant_score > 0 and deep_score == 0:
        mode = SearchMode.INSTANT
        confidence = min(1.0, instant_score / (instant_score + standard_score + 0.1))
        reason = f"Simple factual query ({instant_score} instant signals, {word_count} words)"
        est = "50–150ms"
    else:
        mode = SearchMode.STANDARD
        confidence = min(1.0, (standard_score + 0.5) / (deep_score + standard_score + instant_score + 1))
        reason = f"Moderate complexity ({standard_score} standard signals, {word_count} words)"
        est = "200–500ms"

    return ClassificationResult(
        mode=mode,
        confidence=round(confidence, 2),
        reason=reason,
        estimated_ms=est,
    )


# ─── Quick tests ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    test_queries = [
        ("What is Python?",                                          SearchMode.INSTANT),
        ("Capital of Japan",                                         SearchMode.INSTANT),
        ("Who founded Microsoft?",                                   SearchMode.INSTANT),
        ("Compare Python vs JavaScript for web development",         SearchMode.STANDARD),
        ("Explain the history of artificial intelligence",           SearchMode.STANDARD),
        ("Latest developments in quantum computing 2025",            SearchMode.STANDARD),
        ("Write a comprehensive historical analysis of quantum computing covering all major breakthroughs", SearchMode.DEEP),
        ("Compare 20 AI companies and produce a detailed investment report", SearchMode.DEEP),
        ("Investigate the scientific research on climate change impact on biodiversity", SearchMode.DEEP),
    ]

    print("Query Classifier Tests\n" + "="*60)
    all_pass = True
    for query, expected in test_queries:
        result = classify_query(query)
        status = "✅" if result.mode == expected else "❌"
        if result.mode != expected:
            all_pass = False
        print(f"{status} Mode {result.mode.value} ({result.estimated_ms}) | {query[:55]}")
        print(f"   Reason: {result.reason}\n")

    print("="*60)
    print("All tests passed ✅" if all_pass else "⚠️  Some tests failed")

