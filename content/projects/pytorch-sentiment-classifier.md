---
title: "PyTorch Sentiment Classifier"
summary: "An end-to-end sentiment classifier on 50K IMDB reviews, reaching 87.6% test accuracy."
start: "2026-02"
end: "2026-02"
repo: "HassanDawy/pytorch-sentiment-classifier"
metrics: ["87.6% test accuracy"]
skills: ["Python", "PyTorch"]
methods: ["Text features (BoW, TF-IDF)"]
---

A sentiment classifier built from scratch in PyTorch on the IMDB 50K reviews
dataset. It uses custom Datasets and DataLoaders, Bag-of-Words features (top
2,000 words), and a 3-layer network (1000 → 64 → 1) with Dropout(0.2). It reaches
**87.6% test accuracy**.
