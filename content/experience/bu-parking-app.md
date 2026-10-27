---
title: "Full Stack Developer"
org: "Boston University CDS Clinic"
location: "Boston, MA"
summary: "Built BU's live parking app, from an S3 data pipeline to a map that shows real-time garage availability."
start: "2026-01"
end: "2026-05"
featured: true
collaborators: ["Professor Scott Ladenheim", "Leonidas"]
metrics: ["2,500+ potential users", "Minute-level data"]
skills: ["Python", "FastAPI", "SQLite", "AWS S3", "React", "TypeScript", "Google Maps API"]
methods: ["ETL pipelines", "Cron scheduling", "Progressive Web Apps", "Stakeholder demos"]
---

## The problem

BU drivers had no live view of which garages had space. The data existed as
minute-level reports in AWS S3, but nothing turned it into something a driver
could use.

## What I built

- A real-time ETL pipeline: cron jobs load the minute-level S3 reports into
  normalized SQLite schemas, served through a FastAPI backend.
- A React/TypeScript Progressive Web App on Google Maps, with color-coded markers
  that show each garage's availability in real time.

Every two weeks I demoed to BU IS&T to agree on data schemas, data contracts and
feature priorities.

## Results

A full-stack platform ready for a campus-wide rollout to **2,500+ potential
users**.

## Credits

Built with Professor Scott Ladenheim and Leonidas.
