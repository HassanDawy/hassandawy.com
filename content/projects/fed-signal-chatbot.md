---
title: "Fed Signal Chatbot"
summary: "A RAG system that reads Federal Reserve statements and calls each FOMC meeting hawkish, dovish or neutral, grounded in the source text."
start: "2026-03"
end: "2026-05"
featured: true
repo: "HassanDawy/fed-signal-chatbot"
metrics: ["91.7% post-cutoff accuracy with BM25", "175 FOMC statements indexed"]
skills: ["Python", "OpenAI API", "Web scraping"]
methods: ["RAG", "Hybrid retrieval (BM25 + dense)", "Reciprocal Rank Fusion", "Chain-of-thought prompting", "Few-shot prompting", "Retrieval evaluation (Hit@k)"]
---

[CONFIRM: exact dates. The resume says March–May 2026; you first said April 2026.]

## The problem

Ask an LLM whether a Fed meeting was hawkish and it may just recite what it
memorized during training. I wanted answers grounded in the actual Fed
communications, and an evaluation that could tell the two apart.

## What I built

- Scraped 175 FOMC statements (2006 to today) into 572 chunks.
- Hybrid retrieval: BM25 (lexical) and dense embeddings (semantic), fused with
  Reciprocal Rank Fusion.
- A generator using chain-of-thought and few-shot prompting on GPT-4o-mini.
- An evaluation split at the generator's training cutoff (2023-10-01), so
  retrieval-grounded reasoning can't hide behind memorized text.

## The hard part

The "best of both worlds" hybrid lost. Queries here are mostly just a date, and
the dense retriever's similar-but-wrong matches pushed the correct statement out
of the fused ranking. **BM25 alone reached 91.7% post-cutoff accuracy, against
75.0%** for semantic-only and hybrid.

I report Hit@5 as the main retrieval metric. With an imbalanced label split,
accuracy can look fine while retrieval silently fails.

## Results

- BM25-only retrieval: 91.7% post-cutoff accuracy.
- Headline accuracy with prompting on GPT-4o-mini: 92%.

## Credits

Claude helped as a coding and writing assistant. The design decisions, labeling
and evaluation protocol are mine.
