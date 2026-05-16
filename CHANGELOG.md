# Changelog

All notable changes to the Multi-Agent Design Workshop Protocol will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-05-17

### Added
- **Phase 9 (P9): Retrospective** — Post-implementation review for learning and protocol evolution
- **Facilitator quick reference card** (`FACILITATOR-CARD.md`) — One-page cheat sheet for running workshops
- **Example workshop transcript** (`docs/examples/todo-app-workshop.md`) — Full P1-P8 mock run with realistic agent dialogue, BLOCK resolution, and facilitator synthesis
- **`check-readiness.sh` validator** — Automated design document validation script
- **Individual prompt files** — Extracted quick-load templates for P1, P4, P8
- **CHANGELOG.md** — Version history and roadmap
- **Implementation plan** (`docs/implementation-plan.md`) — Task-by-task packaging guide

---

## [1.0.0] — 2026-05-17

### Added
- **8-phase workshop protocol** (P1 Problem Framing through P8 Consensus)
- **Hybrid diverge-converge model**: Roundtable for P1-P3 and P8, Author/Reviewer for P4-P7
- **BLOCK / CONSENT / CONCERN objection protocol** with facilitator arbitration
- **Agent role bank**: Design Author, Product Critic, Security Engineer, Scalability Engineer, Integration Specialist, QA Lead, DevEx Advocate
- **Prompt template library**: Ready-to-render templates for every phase × every role
- **Design document structure**: Standardized 9-section markdown output
- **Facilitation state machine**: Phase gates, backtracking, override authority
- **Readiness checklist**: Section 7 validation criteria

### Protocol Design Decisions
- Cross-agent compatibility: All prompts are plain markdown, no code execution required
- Human-gated transitions: Facilitator must explicitly approve each phase
- Deterministic output: Same input → same phase structure → same artifact format
- Template-based dispatch: `{{VARIABLES}}` rendered per-phase for consistent agent context
