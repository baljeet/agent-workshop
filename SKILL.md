---
name: multi-agent-design-workshop
description: "Run structured multi-agent design workshops across any AI assistant (Pi, Claude Code, Codex, etc.) to produce production-ready technical design documents. 8-phase protocol with role-based prompts, BLOCK/CONSENT/CONCERN safety rails, and deterministic markdown output."
---

# Multi-Agent Design Workshop Skill

## Overview

Facilitate structured design discussions between multiple AI agents (or a single agent wearing multiple hats) to produce rigorously reviewed technical design documents. The output is a standardized markdown artifact that any developer can implement from directly — with tests that validate the implementation.

**Works with any LLM-based coding agent.** No code execution required. All prompts are plain markdown.

## When to Use

Use this skill when:
- Starting a new feature, product, system, or architectural change
- You want multiple perspectives (security, scalability, product, etc.) before committing to an approach
- You need a document that developers can implement from without further clarification
- You're working across multiple AI tools and need a portable process

**Do NOT use when:**
- The change is a one-line bugfix or config tweak (use brainstorming skill instead)
- The domain is already fully understood with no ambiguity (skip to writing-plans)

## Anti-Pattern: "I Can Just Ask One Agent"

A single agent produces one perspective. Security gaps, scalability bottlenecks, and UX oversights are missed until production. This skill forces structured critique from specialized viewpoints — catching issues before they become incidents.

## Prerequisites

Install this skill by copying the prompt templates into your agent's context. Requires:
- `docs/prompts/workshop-charter.md` — loaded into every participating agent
- `docs/prompts/template-library.md` — your prompt source for each phase
- `docs/protocol.md` — reference for the facilitator (you)

## The 8-Phase Workflow

Run in order. Never skip phases. Each phase ends with facilitator approval.

| Phase | Mode | Purpose | What You Do |
|-------|------|---------|-------------|
| **P1** | Roundtable | Problem Framing | Send charter + P1 prompt to all agents |
| **P2** | Roundtable | Requirements | Extract functional/NFRs with MoSCoW |
| **P3** | Roundtable | Approach Debate | Propose 2-3 architectures, pick one |
| **P4** | Author/Reviewers | System Architecture | Design Author drafts; reviewers challenge |
| **P5** | Author/Reviewers | Component Design | Interfaces, state, dependencies per component |
| **P6** | Author/Reviewers | Error Handling | Failure modes, recovery, observability |
| **P7** | Author/Reviewers | Testing Strategy | Test pyramid, CI gates, coverage matrix |
| **P8** | Roundtable | Consensus | Final review, lock the design document |

### Phase Transition Rule

```
[Agents respond] → [You synthesize] → [Publish artifact] → [BLOCK check] → ["APPROVED"] → [Next phase]
```

## Agent Role Bank

Assign one or more roles per agent. A single agent can play multiple roles sequentially.

| Role | What They Watch For |
|------|---------------------|
| **Design Author** | Architecture, interfaces, data flow, component design |
| **Product Critic** | User needs, scope creep, missing features, UX gaps |
| **Security Engineer** | Threat surfaces, auth gaps, data exposure, compliance |
| **Scalability Engineer** | Bottlenecks, resource limits, single points of failure |
| **Integration Specialist** | API consistency, migration paths, third-party failures |
| **QA/Testing Lead** | Testability, observability, coverage, flaky test detection |
| **DevEx Advocate** | Build/debug experience, onboarding, documentation |

## The Safety Protocol: BLOCK / CONSENT / CONCERN

Any agent can raise flags:

- **BLOCK** `[section] — [reason]` → Halts progress. You decide: valid (backtrack), invalid (override with rationale).
- **CONCERN** `[section] — [reason]` → Log it, move on. Non-blocking risk.
- **CONSENT** `[section] — [agent]` → Explicit endorsement. Required from all reviewers before phase gate.

## Quick-Start Facilitation

### Step 1: Load Charter

Send to every participating agent:

```markdown
{{ contents of docs/prompts/workshop-charter.md }}
```

### Step 2: Assign Roles

Tell each agent their role. Example with 3 agents:
- Agent A → Design Author (also plays DevEx in review phases)
- Agent B → Product Critic + Scalability Engineer
- Agent C → Security Engineer + QA Lead

### Step 3: Run P1

Send P1 prompt (from `docs/prompts/template-library.md`) with your project intent.

### Step 4: Synthesize

Read all responses. Write a single P1 artifact in this format:

```markdown
## P1 Problem Statement — {{Project Name}}

### Problem Summary
### Constraints
### Success Criteria
### Anti-Requirements
### Resolved Ambiguities
### Open Questions (deferred)
```

### Step 5: Gate

Say: "P1 COMPLETE. BLOCK check?"

Collect CONSENT from all agents. If BLOCK, resolve or backtrack.

Say: **"APPROVED, proceed to Phase 2."**

### Repeat for P2-P8

## Post-Workshop

After implementation, optionally run **P9 Retrospective** (see `docs/phase-9-retrospective.md`) to capture learnings and improve the protocol.

Validate the final design document:

```bash
chmod +x scripts/check-readiness.sh
./scripts/check-readiness.sh my-design-doc.md
```

## Example

See `docs/examples/todo-app-workshop.md` for a complete P1-P8 transcript showing:
- Real agent dialogue
- BLOCK resolution and backtracking
- Facilitator synthesis
- Consensus finalization

## Output Format

The final artifact is a markdown design document with 8 sections:

1. Problem Statement
2. Requirements (functional + NFRs + edge cases)
3. Selected Approach (with rejected alternatives)
4. System Architecture (diagrams, data flow, APIs)
5. Component Design (interfaces, state, dependencies)
6. Error Handling & Edge Cases (failure matrix, recovery)
7. Testing & Validation Strategy (pyramid, CI gates, coverage)
8. Consensus Record (agent sign-offs or documented dissent)

## Key Principles

- **Synthesize, don't collect.** You write the phase artifact. Agents provide raw input.
- **Force critique.** If an agent says "looks good," re-prompt: "Find at least one concern or question."
- **Backtrack on BLOCK.** Valid objections are features, not bugs — they prevent incidents.
- **Document dissent.** Override decisions are recorded. Silence is not consent.

## Related Skills

- `brainstorming` — Use for simpler ideation before invoking this workshop skill
- `writing-plans` — Use after P8 consensus to create implementation tasks from the design doc
- `executing-plans` — Use to implement the tasks from writing-plans
