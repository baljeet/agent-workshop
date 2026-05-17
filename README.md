# Agent Workshop

> **Turn "I want to build X" into a production-ready design document — without copy-pasting prompts or managing phases manually.**
>
> An 8-phase structured design protocol that runs *inside* your coding agent. The AI reads the manifest, adopts multiple expert roles, debates trade-offs, and produces a design doc any developer can implement from.

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## The Problem

You have an idea. You ask your AI to design it. You get one perspective, miss security holes, overlook scalability limits, and end up with a half-baked plan that breaks in production.

**Agent Workshop fixes this** by making your AI *run a structured design workshop with itself* — adopting 5-7 specialized roles (security, scalability, product, QA) across 8 rigorously gated phases. Every phase requires critique. Every objection gets resolved before you proceed.

**You say:** "Design a real-time collaborative todo app."

**The AI does:**
1. P1: Frames the problem with constraints and anti-requirements
2. P2: Extracts requirements with MoSCoW prioritization
3. P3: Debates 2-3 architectures, picks one with justification
4. P4: Designs system architecture with reviewer challenges
5. P5: Designs every component's interface, state, dependencies
6. P6: Maps every failure mode and recovery path
7. P7: Builds the testing pyramid and CI gates
8. P8: Locks the design with signed consensus (or documented dissent)

**You get:** A single markdown document a developer with zero context can implement — tested and validated.

---

## Quick Start

```bash
# 1. Install
curl -fsSL https://raw.githubusercontent.com/baljeet/agent-workshop/main/install.sh | bash

# 2. In your project, tell your agent how to run workshops
agent-workshop init claude    # or: cursor, pi, generic

# 3. Say: "Run a workshop for building a real-time collaborative todo app"
# The AI does P1-P8. You approve each phase. Done.
```

---

## How It Works

### For You (The Human)

| You say | You get |
|---------|---------|
| "Run a workshop for building X" | AI loads the protocol and starts P1 |
| "Looks good, approved" | AI proceeds to P2 |
| "Wait, we need auth" | AI backtracks, updates P1, re-presents |
| (repeat for 8 phases) | A validated design document |

Your job: **Provide intent, approve phases, catch anything the AI misses.**

### For The AI

The AI reads `workshop-manifest.json`, discovers 8 phases and 7 roles, then executes:

```
For each phase:
  Load prompt → Substitute variables → Generate 5-7 role responses
  → Synthesize into artifact → Present to you → Wait for APPROVED
```

Every role response must include a critique and a safety signal:
- **BLOCK** — showstopper, halt and resolve
- **CONCERN** — risk, log and continue  
- **CONSENT** — explicit endorsement, required from all reviewers

### The Output

A single file: `docs/plans/2024-01-15-todo-app-design.md`

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

Validated by `scripts/check-readiness.sh` before you ever write code.

---

## Per-Agent Setup

Different agents load instructions differently. `agent-workshop init` auto-detects and creates the right file.

| Agent | Setup | Trigger |
|-------|-------|---------|
| **Pi** | `git clone` to `~/.agents/skills/` | Auto-loads `SKILL.md` |
| **Claude Code** | `agent-workshop init claude` → `.claude/CLAUDE.md` | Say "run a workshop" |
| **Cursor** | `agent-workshop init cursor` → `.cursor/rules.md` | Say "design workshop" |
| **Generic** | `agent-workshop init generic` → `WORKSHOP.md` | Paste into context |

```bash
# Pi
cd ~/.agents/skills/
git clone https://github.com/baljeet/agent-workshop.git
# Then: "Run a multi-agent design workshop for..."

# Claude Code (in project dir)
agent-workshop init claude
# Then: "run a workshop for building X"

# Cursor (in project dir)
agent-workshop init cursor
# Then: "run a design workshop for..."
```

---

## The 8 Phases

| Phase | What Happens | Duration | Mode |
|-------|-------------|----------|------|
| **P1** | Frame the problem: constraints, success criteria, anti-requirements | 5–10 min | Roundtable |
| **P2** | Extract requirements: functional, non-functional, edge cases, MoSCoW | 10–15 min | Roundtable |
| **P3** | Debate 2–3 architectures, trade-offs, pick one | 15–20 min | Roundtable |
| **P4** | Design system architecture: components, data flow, APIs | 20–30 min | Author + Reviewers |
| **P5** | Design every component: interfaces, state, dependencies | 30–45 min | Author + Reviewers |
| **P6** | Map failure modes: recovery, observability, edge cases | 15–20 min | Author + Reviewers |
| **P7** | Build testing strategy: pyramid, CI gates, coverage | 15–20 min | Author + Reviewers |
| **P8** | Lock the design: all roles sign off (CONSENT or DISSENT) | 10–15 min | Roundtable |

**Total: ~2 hours for medium complexity.**

### Agent Roles

The AI adopts these roles per phase, forcing multi-perspective critique:

| Role | Forces The AI To Think About | Active |
|------|------------------------------|--------|
| **Design Author** | Architecture, interfaces, data flow | P4-P7 |
| **Product Critic** | User needs, scope creep, missing UX | All |
| **Security Engineer** | Threat surfaces, auth gaps, data exposure | All |
| **Scalability Engineer** | Bottlenecks, resource limits, SPOFs | All |
| **QA/Testing Lead** | Testability, observability, coverage | All |
| **Integration Specialist** | API consistency, migration paths, third-party fails | P3-P5 |
| **DevEx Advocate** | Build/debug experience, onboarding, docs | P4-P5, P7 |

---

## Safety Protocol

Every role response ends with a signal. No "looks good to me" without at least one concern.

```
BLOCK [section] — [specific showstopper, halt and resolve]
CONCERN [section] — [risk, log it, keep moving]
CONSENT [section] — [role name, explicit endorsement]
```

- **BLOCK** → Phase stops. Fix it or document why you're overriding.
- **CONCERN** → Logged in the design doc. Doesn't block, but visible.
- **CONSENT** → Required from every reviewer before you can say "APPROVED, next phase."

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
├── SKILL.md                    # Pi instruction manual (auto-loaded)
├── CLAUDE.md                   # Claude Code instructions
├── workshop-manifest.json      # Phase/role/prompt metadata (the AI reads this)
├── bin/
│   ├── agent-workshop          # Human inspection CLI
│   └── agent-workshop-init     # Agent setup helper
├── docs/
│   ├── protocol.md             # Full protocol specification
│   ├── phase-9-retrospective.md
│   ├── prompts/                  # Phase-specific prompt templates
│   │   ├── workshop-charter.md
│   │   ├── phase-1-problem-framing.md
│   │   ├── phase-4-architecture-author.md
│   │   ├── phase-8-consensus.md
│   │   └── template-library.md
│   └── examples/
│       └── todo-app-workshop.md
├── scripts/
│   └── check-readiness.sh      # Validates design docs
├── install.sh                  # One-line global install
├── FACILITATOR-CARD.md         # One-page quick reference
└── README.md                   # This file
```

---

## Why This Works

| Before Agent Workshop | After Agent Workshop |
|----------------------|---------------------|
| One AI perspective | 5-7 specialized perspectives |
| "Looks good to me" | Every role must find at least one concern |
| Security holes found in prod | Security Engineer blocks them in P1 |
| Scale limits discovered at 10k users | Scalability Engineer flags them in P3 |
| No test strategy | QA Lead defines pyramid in P7 |
| Design doc is vague hand-waving | Standardized 9-section implementable doc |
| You copy-paste prompts | AI reads manifest, executes automatically |

---

## Version

**v1.3.0** — Cross-agent support (Pi, Claude Code, Cursor, generic). Auto-execution via `workshop-manifest.json` + agent-specific instruction files.

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## Roadmap

- [x] v1.1.0: Retrospective Phase (P9), Pi skill manifest
- [ ] v1.2.0: Enhanced validator (requirement traceability, contradiction detection)
- [x] v1.3.0: Cross-agent auto-execution (Claude, Cursor, generic)
- [ ] v1.4.0: Component-level iterative refinement (P5 sub-phases)
- [ ] v2.0.0: Save/resume workshop state across sessions

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
