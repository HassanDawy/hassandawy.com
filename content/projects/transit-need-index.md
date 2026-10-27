---
title: "Transit Need Index"
summary: "An open-source index of which NYC neighborhoods would gain the most from free buses."
start: "2026-02"
end: "2026-03"
featured: true
repo: "BU-Data-Science-Association/buses"
links:
  - { label: "Live map", href: "https://busneedmap.netlify.app/" }
  - { label: "Blog post: Mapping Transit Equity in NYC", href: "https://www.lesswrong.com/posts/P2kFeCt4bkKyzt2HS/mapping-transit-equity-in-nyc" }
metrics: ["6 datasets merged", "Presented at NYC School of Data"]
skills: ["Python", "pandas", "GeoPandas", "SciPy", "Matplotlib", "Leaflet.js"]
methods: ["Spatial joins", "Composite index design", "Correlation testing", "Geospatial visualization"]
---

## The problem

If New York makes buses free, which neighborhoods benefit most? The answer
depends on many datasets that don't share a common shape.

## What I built

- Merged 6 datasets with pandas and GeoPandas spatial joins.
- Combined them into a double-normalized, weighted "Transit Need Index".
- Checked the index with SciPy correlation tests.
- Published the results as Matplotlib charts and an interactive Leaflet.js heatmap.

Everything is open: the code and data are on GitHub, and the method is written
up in a blog post.

## Results

I presented the index at the **NYC School of Data Conference**, after winning a
popular vote among attendees.
