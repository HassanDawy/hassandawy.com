---
title: "NYT Connections Solver"
summary: "A model that plays the NYT Connections puzzle: a learned group scorer plus beam search over every possible group."
start: "2026-04"
end: "2026-04"
featured: true
collaborators: ["Ghaith Al Ramahi"]
metrics: ["9.9% full-puzzle wins", "16.2% group accuracy", "0% for both baselines"]
skills: ["Python", "PyTorch", "DeBERTa-v3"]
methods: ["Transfer learning", "Beam search", "Negative sampling", "Class-imbalance weighting", "Ablation studies"]
---

## The problem

Connections gives you 16 words and asks for four hidden groups of four. A
language model "knows" a lot of word associations, but the puzzle is designed
around red herrings.

## What I built

I framed it as binary classification: *is this set of four words a valid group?*
A DeBERTa-v3-small backbone stays frozen and a trained head scores each group.
Beam search runs over all C(16,4) = 1,820 candidate groups and decodes four
groups that don't overlap.

## The hard part

An early model reached a suspicious 75% accuracy. It was predicting every sample
as negative. I fixed it by tying the positive-class loss weight to the
negative-sampling ratio.

A structured ablation (sampling ratio, encoder unfreezing, learning rate, batch
size, beam width) showed two things:

- Partially unfreezing the encoder collapsed training entirely.
- Widening the beam past a point barely helped, so the **scorer, not the search,
  was the bottleneck**.

## Results

On 131 held-out puzzles under real game rules: **9.92% full-puzzle wins** and
**16.2% group accuracy**. A zero-shot cosine baseline and an untrained head both
scored 0%.

## Credits

Co-authored with Ghaith Al Ramahi.
