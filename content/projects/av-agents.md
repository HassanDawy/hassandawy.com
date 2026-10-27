---
title: "av-agents & Anchor Vision"
summary: "A multi-agent pipeline that plans, writes, reviews and merges code on its own, and built most of a real trading app."
start: "2026-08"
end: "2026-09"
featured: true
links:
  - { label: "Walkthrough on request", href: "mailto:hdawy@bu.edu" }
collaborators: ["Noah Arnut", "teajammin"]
metrics: ["57 tasks merged in 13 days", "$9.03 median cost per merged task", "592 LLM calls traced"]
skills: ["TypeScript", "Anthropic API", "OpenAI API", "GitHub Actions", "AWS", "AWS CDK", "Fastify", "React"]
methods: ["Multi-agent orchestration", "Finite-state machines", "Tool-calling (ReAct) agents", "Cross-vendor LLM review", "LLM cost and token tracing", "Context compaction", "Human-in-the-loop design"]
---

## The problem

Anchor Vision is a pre-launch app that alerts prop-firm traders when their chart
markup drifts from the strategy they wrote down. I wanted to see how much of it
a team of LLM agents could build on its own, with me steering instead of typing.

## What I built

A TypeScript orchestrator written as a finite-state machine:
**Planner → Coder → build gate → two parallel reviewers → merge on double approval**,
with escalation states that hand design questions back to a human.

- **Planner:** Claude Opus.
- **Coder:** a ReAct-style tool-calling agent with file, shell and web tools, sandboxed to the repo.
- **Reviewers:** Claude Opus and GPT-5.6 see identical payloads independently. A failed reviewer call counts as a reject.

It ran on GitHub Actions ticks and built a Fastify/React app of about 80k lines.
Its backend is deployed on AWS with AWS CDK (ECS Fargate, Aurora, SQS FIFO,
Cognito, cdk-nag).

## The hard part

**Cost.** I traced every one of the 592 LLM calls ($1,013 total). The Coder drove
76% of spend, and 59% of that was cache reads, because the tool loop re-sent the
full context on every step. So I built context compaction, gated on a cost
rule: compact only when the expected savings exceed twice the cache-write cost.

**Convergence.** Reviewer B rejected about 52% of rounds, and one task cost about
$37 re-raising the same defects. Each reviewer now sees only its own prior
issues, verdicts persist across ticks, and there is a stopping rule.

**Accountability.** One token-scope fault cost $29.50 and blocked 4 tasks. After
it, I added an infrastructure-vs-task failure classifier, a dry-run push
preflight, a "done means pushed" rule, and per-task, per-tick and rolling
24-hour spend caps backed by a per-call ledger.

## Results

- 63 GitHub Actions ticks, 57 tasks merged in 13 days, median $9.03 per merged task.
- 50 agent-escalated design questions answered by me.
- Local benchmark: ingest-to-alert p95 of 24 ms.

## Credits

Built with Noah Arnut and teajammin. Their work (the verify performance split, CI
install, true task cost fix, git-failure classification, Playwright install and
T059 rebuild) is not claimed here. Claude was my pair programmer. The repos are
private; I can give a walkthrough on request.
