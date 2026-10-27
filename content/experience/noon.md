---
title: "Machine Learning Engineer Intern"
org: "noon"
location: "UAE"
summary: "Built noon's seller revenue forecaster from scratch, powering financing decisions worth about $200M."
start: "2026-06"
end: "2026-08"
featured: true
metrics: ["28,000+ sellers forecast", "15% lower WAPE than the best baseline", "~$200M in financing decisions"]
skills: ["Python", "SQL", "BigQuery", "scikit-learn", "FastAPI", "PostgreSQL"]
methods: ["Quantile forecasting", "Gradient boosting", "Out-of-time backtesting", "Leakage-safe feature engineering", "Rules-based screening"]
---

## The problem

noon's fintech arm wanted to offer financing to its sellers, and needed to know
what each seller was likely to earn over the next year, with honest uncertainty.

## What I built

- A leakage-safe training table of **4.9M rows and 46 features**, built from
  BigQuery with parameterized SQL.
- Pooled gradient-boosting quantile models (scikit-learn) that give 12-month
  revenue forecasts with uncertainty bands for **28,000+ sellers**.
- A rules-based prequalification engine that screened sellers down to a pool of
  **750** for a bank-backed financing pilot.
- A self-serve FastAPI tool with event-driven batch workers, Postgres caching and
  role-based access control.

## Results

An out-of-time backtest over 8 quarters (890K+ forecasts) cut WAPE (weighted
absolute percentage error) by **15%** against the strongest baseline. The system
powers financing decisions worth about **$200M**.

[ADD MORE DETAIL: this write-up is still the thinnest on the site.]
