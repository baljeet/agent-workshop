# Agent Workshop

> **Turn "I want to build X" into a production-ready design document — plus 6 standalone review artifacts. One command. One result.**
>
> An 8-phase structured design protocol that runs *inside* any coding agent. The AI adopts 5-7 expert roles, debates trade-offs, resolves objections internally, spawns fresh review agents, and saves checkpoints along the way. No copy-paste. No per-phase approval gates.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## The Problem

You have an idea. You ask your AI to design it. You get one perspective, miss security holes, overlook scalability limits, and end up with a half-baked plan that breaks in production. Or, you use a structured process — but spend hours copy-pasting prompts and manually approving every phase.

**Agent Workshop fixes this** by making your AI *run a structured design workshop autonomously* — adopting 5-7 specialized roles across 8 phases, resolving objections internally, then spawning fresh review agents to critique the final result. You say one thing, you get everything back at once.

**You say:** "Design a real-time collaborative todo app."

**The AI does:**
1. P1-P8: Runs all 8 phases autonomously — problem framing, requirements, architecture debate, system design, component design, error handling, testing strategy, consensus
2. REVIEW: Spawns 4 fresh review agents to critique the complete document
3. Saves 6 standalone checkpoint artifacts along the way for human review

**You get:**
- A complete design document any developer can implement from
- 6 standalone review artifacts: requirements, HLD, LLD, error handling, test strategy, security review
- Review agent feedback with verdict (READY / NEEDS WORK / BLOCKED)
- All collected questions in one place

---

## Quick Start

```bash
# 1. Install
curl -fsSL https://raw.githubusercontent.com/baljeet/agent-workshop/main/install.sh | bash

# 2. In your project, tell your agent how to run workshops
agent-workshop init claude    # or: cursor, pi, generic

# 3. Say: "Run a workshop for building a real-time collaborative todo app"
# The AI runs P1-P8 + REVIEW autonomously. You review the result once.
```

---

## How It Works

### For You (The Human)

| You say | You get |
|---------|---------|
| "Run a workshop for building X" | AI runs the full workshop autonomously |
| (grab coffee, go to a meeting) | P1-P8 execute back-to-back, REVIEW agents fire |
| AI presents results | Full design doc + 6 checkpoints + review feedback + questions |

Your job: **Provide intent. Review the results once. Answer collected questions.**

### For The AI

The AI reads `workshop-manifest.json`, discovers the phases, roles, and checkpoints, then executes:

```
[Scan project] → P1 → P2 → save requirements checkpoint → P3 → P4 → save HLD checkpoint
→ P5 → save LLD checkpoint → P6 → save error handling checkpoint
→ P7 → save test strategy checkpoint → P8 → REVIEW agents
→ save security review checkpoint → present everything to user ONCE
→ [optional: generate task list if user asks]
```

Every role response must include a critique and a safety signal:
- **BLOCK** — showstopper, agents resolve internally; if unresolvable, convert to QUESTION
- **CONCERN** — risk, log and continue
- **CONSENT** — explicit endorsement, required from all reviewers
- **QUESTION** — needs user input, collect and present at the end

### Review Checkpoints (6 Standalone Artifacts)

| # | File | After | Content | Target Reviewer |
|---|------|-------|---------|-----------------|
| 1 | `{slug}-requirements.md` | P2 | MoSCoW requirements, user stories, edge cases | PM, stakeholder |
| 2 | `{slug}-architecture-hld.md` | P4 | System diagram, components, data flow, APIs | Architect, tech lead |
| 3 | `{slug}-architecture-lld.md` | P5 | Interfaces, state machines, schemas, dependencies | Senior devs |
| 4 | `{slug}-error-handling.md` | P6 | Failure modes, recovery, observability | SRE, ops |
| 5 | `{slug}-test-strategy.md` | P7 | Test pyramid, CI gates, sample test cases | QA |
| 6 | `{slug}-security-review.md` | REVIEW | Threats, auth gaps, compliance, mitigations | Security team |

### The Output

One master document + 6 checkpoints:

```
docs/plans/2024-01-15-todo-app-design.md
docs/artifacts/todo-app-requirements.md
docs/artifacts/todo-app-architecture-hld.md
docs/artifacts/todo-app-architecture-lld.md
docs/artifacts/todo-app-error-handling.md
docs/artifacts/todo-app-test-strategy.md
docs/artifacts/todo-app-security-review.md
```

```markdown
# Design Document — Real-Time Collaborative Todo App

## 1. Problem Statement
## 2. Requirements (R1-R12, NFR1-NFR5, MoSCoW)
## 3. Selected Approach (with rejected alternatives)
## 4. System Architecture (diagrams, data flow, APIs)
## 5. Component Design (interfaces, state, dependencies)
## 6. Error Handling & Edge Cases (failure matrix, recovery)
## 7. Testing & Validation Strategy (pyramid, CI gates, coverage)
## 8. Consensus Record (who signed off, who dissented, why)
```

Validated by `scripts/check-readiness.sh`.

---

## Per-Agent Setup

Different agents load instructions differently. `agent-workshop init` auto-detects and creates the right file.

| Agent | Setup | Trigger |
|-------|-------|---------|
| **Claude Code** | `agent-workshop init claude` → `CLAUDE.md` | Say "run a workshop" |
| **Cursor** | `agent-workshop init cursor` → `.cursor/rules.md` | Say "design workshop" |
| **Pi** | `git clone` to `~/.agents/skills/` | Auto-loads `SKILL.md` |
| **Generic** | `agent-workshop init generic` → `WORKSHOP.md` | Paste into context |

```bash
# Claude Code (in project dir)
agent-workshop init claude
# Then: "run a workshop for building X"

# Cursor (in project dir)
agent-workshop init cursor
# Then: "run a design workshop for..."

# Pi
cd ~/.agents/skills/
git clone https://github.com/baljeet/agent-workshop.git
# Then: "Run a multi-agent design workshop for..."
```

---

## The Phases

| Phase | What Happens | Mode |
|-------|-------------|------|
| **P1** | Frame the problem: constraints, success criteria, anti-requirements | Roundtable |
| **P2** | Extract requirements: functional, non-functional, edge cases, MoSCoW | Roundtable |
| **P3** | Debate 2-3 architectures, trade-offs, pick one | Roundtable |
| **P4** | Design system architecture: components, data flow, APIs | Author + Reviewers |
| **P5** | Design every component: interfaces, state, dependencies | Author + Reviewers |
| **P6** | Map failure modes: recovery, observability, edge cases | Author + Reviewers |
| **P7** | Build testing strategy: pyramid, CI gates, coverage | Author + Reviewers |
| **P8** | Lock the design: all roles sign off (CONSENT or DISSENT) | Roundtable |
| **REVIEW** | Fresh agents critique the complete document | Review Agents |

### Agent Roles (Design Phases)

The AI adopts these roles, forcing multi-perspective critique:

| Role | Forces The AI To Think About | Active |
|------|------------------------------|--------|
| **Design Author** | Architecture, interfaces, data flow | P4-P7 |
| **Product Critic** | User needs, scope creep, missing UX | All |
| **Security Engineer** | Threat surfaces, auth gaps, data exposure | All |
| **Scalability Engineer** | Bottlenecks, resource limits, SPOFs | All |
| **QA/Testing Lead** | Testability, observability, coverage | All |
| **Integration Specialist** | API consistency, migration paths, third-party fails | P3-P5 |
| **DevEx Advocate** | Build/debug experience, onboarding, docs | P4-P5, P7 |

### Review Agents (Post-Workshop)

Fresh eyes critique the complete document:

| Role | Focus |
|------|-------|
| **Architecture Reviewer** | Structural integrity, gaps, contradictions |
| **Implementation Reviewer** | Buildability, clarity, missing details |
| **Risk Reviewer** | Production failures, security gaps, operational risks |
| **Product Reviewer** | Problem-solution fit, scope alignment |

---

## Safety Protocol

Every role response ends with a signal. No "looks good to me" without at least one concern.

```
BLOCK [section] — [showstopper, agents resolve internally]
CONCERN [section] — [risk, log it, keep moving]
CONSENT [section] — [role name, explicit endorsement]
QUESTION [section] — [needs user input, collect and ask at the end]
```

- **BLOCK** → Agents debate and resolve. If unresolvable, converted to QUESTION.
- **CONCERN** → Logged in the design doc. Doesn't block, but visible.
- **CONSENT** → Required from every reviewer before synthesizing the phase.
- **QUESTION** → Collected across all phases. Presented once at the end.

---

## CLI Toolkit (For Humans)

`agent-workshop` is a read-only inspector. The AI does the work; you use this to peek behind the curtain.

```bash
agent-workshop init [claude|cursor|pi|generic]   # set up agent instructions

agent-workshop list                # phases, roles, prompts
agent-workshop manifest            # dump JSON metadata the AI reads
agent-workshop charter             # print workshop charter
agent-workshop prompt p1           # render Phase 1 prompt
agent-workshop render p4 --vars vars.json   # render with variables
agent-workshop validate design.md  # validate final document
agent-workshop serve 8080          # browse all resources via HTTP
```

---

## File Structure

```
.
├── SKILL.md                       # Agent instruction manual
├── CLAUDE.md                      # Claude Code instructions
├── workshop-manifest.json         # Phase/role/checkpoint metadata (the AI reads this)
├── bin/
│   ├── agent-workshop             # Human inspection CLI
│   └── agent-workshop-init        # Agent setup helper
├── docs/
│   ├── protocol.md                # Full protocol specification
│   ├── prompts/                   # Phase-specific prompt templates
│   │   ├── workshop-charter.md
│   │   ├── phase-1-problem-framing.md
│   │   ├── phase-4-architecture-author.md
│   │   ├── phase-8-consensus.md
│   │   ├── review-agents.md
│   │   └── template-library.md
│   ├── plans/                     # Generated design documents
│   └── examples/
│       └── todo-app-workshop.md
├── scripts/
│   └── check-readiness.sh         # Validates design docs
├── install.sh                     # One-line global install
└── README.md                      # This file
```

---

## Why This Works

| Before Agent Workshop | After Agent Workshop |
|----------------------|---------------------|
| One AI perspective | 5-7 specialized perspectives + 4 review agents |
| "Looks good to me" | Every role must find at least one concern |
| Security holes found in prod | Security Engineer blocks them + Security Review checkpoint |
| Scale limits discovered at 10k users | Scalability Engineer flags them in P3 |
| No test strategy | QA Lead defines pyramid in P7 → test-strategy.md |
| Design doc is vague hand-waving | Standardized 9-section doc + 6 reviewable artifacts |
| You copy-paste prompts and approve every phase | AI reads manifest, executes autonomously, presents once |

---

## Integration with Superpowers

Agent Workshop fits into the [Superpowers](https://github.com/baljeet/superpowers) workflow as the **design phase**:

```
brainstorming (explore what to build interactively)
    ↓
Agent Workshop (autonomous multi-agent design + review + 6 artifacts)
    ↓
writing-plans (bite-sized implementation tasks from the design)
    ↓
executing-plans / subagent-driven (implement task-by-task with TDD)
    ↓
requesting-code-review (verify implementation against design doc)
    ↓
verification-before-completion (confirm P1 success criteria are met)
```

| Superpowers Skill | How Workshop Connects |
|-------------------|----------------------|
| **brainstorming** | Use before Workshop for interactive exploration. Workshop picks up where brainstorming's design doc leaves off. |
| **writing-plans** | Workshop's optional task generation (Step 7b) feeds directly into writing-plans with exact file paths from P4/P5. |
| **executing-plans** | The task list from writing-plans drives implementation of Workshop's design. |
| **TDD** | P7's test strategy + sample test cases feed into the test-first cycle. |
| **requesting-code-review** | Review implementation against Workshop's design doc and checkpoint artifacts. |
| **verification-before-completion** | Verify the built system against P1 success criteria before declaring done. |

Workshop excels at what Superpowers doesn't: multi-perspective design critique, autonomous execution, and standalone reviewable artifacts for different stakeholders.

---

## Version

**v2.0.0** — Autonomous execution (no per-phase gates), REVIEW agents, QUESTION signal, 6 checkpoint artifacts. Agent-agnostic protocol for any coding agent.

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## Roadmap

- [x] v1.0.0: 8-phase protocol, BLOCK/CONSENT/CONCERN
- [x] v1.3.0: Cross-agent auto-execution (Claude, Cursor, Pi, generic)
- [x] v2.0.0: Autonomous workshop, REVIEW agents, 6 checkpoints, QUESTION signal
- [ ] v2.1.0: Save/resume workshop state across sessions
- [ ] v2.2.0: Enhanced validator (requirement traceability, contradiction detection)
- [ ] v3.0.0: Domain-specific prompt packs (ML, embedded, mobile, finance)

---

## Contributing

- Domain-specific prompt templates (ML, embedded, mobile, finance)
- Additional agent roles
- Example workshop transcripts
- Validator enhancements (contradiction detection, requirement traceability)

Open an issue or PR.

---

## License

MIT — Use freely, attribute when sharing modified versions.
