---
title: "Machine Learning Engineer & Project Manager"
org: "Benevolent Bandwidth Foundation"
summary: "Leading a team of 6 building Second Look, a second-read breast cancer screening tool that runs on the device to keep patient data private."
start: "2026-02"
end: "present"
featured: true
repo: "benevolentbandwidth/secondlook"
metrics: ["0.83 AUROC", "82% sensitivity", "75K+ mammograms"]
skills: ["Python", "TensorFlow/Keras", "pandas", "OpenCV", "scikit-learn", "GCP", "Vertex AI", "Docker", "pytest"]
methods: ["Transfer learning", "Model calibration", "Patient-grouped splits", "Class-weighted loss", "On-device inference", "Project management"]
---

## The problem

A second reader for mammograms can catch what a first read misses, but patient
images shouldn't leave the device. So the model has to be small enough to run
locally.

## What I built

- A reproducible data pipeline (pandas, OpenCV, scikit-learn) over **75K+
  mammograms** from 3 datasets (CBIS-DDSM, RSNA, VinDr) on Google Cloud Storage.
  Splits are 70/15/15 and grouped by patient, so no patient leaks across splits.
- A MobileNetV2 model (2.3M parameters) trained with transfer learning, tf.data
  and a class-weighted loss.
- Containerized training jobs on Vertex AI (NVIDIA T4 GPUs), with GCS
  checkpointing and pytest CI.

I also run the team: weekly sprints, task delegation, and GCP permissions and
budget with our cloud architect.

## The hard part

I traced and fixed a BatchNorm failure mode, then deliberately optimized for
calibration over raw accuracy. I also benchmarked input sizes: 288px gave +0.012
AUROC for 15% more training time.

## Results

**0.83 AUROC and 82% sensitivity** on a held-out test set.
