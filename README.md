# Multi-Agent Design Workshop

> A **protocol + tooling** for running structured 8-phase design workshops inside coding agents (Pi, Claude Code, Cursor, Codex, or any LLM that reads files). The AI reads the manifest, adopts multiple agent roles, and produces production-ready design documents.

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## What This Does

When the user says **"run a workshop for building X,"** the AI:

1. **Reads** `workshop-manifest.json` — discovers 8 phases, 7 roles, prompt file paths
2. **Reads** `docs/protocol.md` — learns BLOCK/CONSENT/CONCERN rules
3. **Reads** `docs/prompts/workshop-charter.md` — loads charter context
4. **Reads** role-specific prompts — loads the phase prompt for each role
5. **Executes P1-P8** — generates multi-role responses, synthesizes, gates with user
6. **Outputs** a `docs/plans/YYYY-MM-DD-<slug>-design.md`

Zero copy-paste. The AI orchestrates the entire workshop.

---

## Quick Start

### 1. Install the Toolkit

```bash
curl -fsSL https://raw.githubusercontent.com/baljeet/pi-multi-agent-design-workshop/main/install.sh | bash
```

This adds:
- `agent-workshop` — CLI for inspecting prompts, validating documents, checking manifests
- `agent-workshop-init` — Sets up agent-specific instruction files in your projects
- The workshop repo at `~/.agent-workshop/`

### 2. Initialize Your Project

In any project where you want to run workshops:

```bash
# Auto-detect your agent and create the right instruction file
agent-workshop init

# Or specify explicitly
agent-workshop init claude     # → creates .claude/CLAUDE.md
agent-workshop init cursor     # → creates .cursor/rules.md
agent-workshop init pi         # → links to ~/.agents/skills/
```

### 3. Run a Workshop

Just say:

> **"Run a workshop for building a real-time collaborative todo app"**

Your agent reads the instructions file, loads the manifest, and executes all 8 phases. You'll approve each phase before it proceeds to the next.

---

## Per-Agent Setup

| Agent | File | Auto-Loaded? | Setup |
|-------|------|-------------|-------|
| **Pi** | `~/.agents/skills/pi-multi-agent-design-workshop/SKILL.md` | ✅ Yes | Clone to skills dir |
| **Claude Code** | `.claude/CLAUDE.md` | ✅ Yes, per project | `agent-workshop init claude` |
| **Cursor** | `.cursor/rules.md` | ✅ Yes, per project | `agent-workshop init cursor` |
| **Generic** | `WORKSHOP.md` | ❌ Paste into context | `agent-workshop init generic` |

### Pi

```bash
cd ~/.agents/skills/
git clone https://github.com/baljeet/pi-multi-agent-design-workshop.git
```

Pi auto-detects `SKILL.md`. Just say: "Run a multi-agent design workshop for..."

### Claude Code

```bash
# In your project directory
agent-workshop init claude
# Creates .claude/CLAUDE.md — Claude auto-loads it
# Then say: "run a workshop for building X"
```

### Cursor

```bash
# In your project directory
agent-workshop init cursor
# Creates .cursor/rules.md — Cursor loads it
# Then say: "run a design workshop for..."
```

### Any Other Agent

```bash
agent-workshop init generic
# Creates WORKSHOP.md — paste into agent context
# Or keep it in repo so agent sees it while exploring files
```

---

## Human CLI Toolkit

The `agent-workshop` command is a **read-only inspection tool** for when you want to peek behind the curtain:

```bash
agent-workshop init [claude|cursor|pi|generic]   # set up agent instructions

agent-workshop list                # list phases, roles, prompts
agent-workshop manifest            # dump JSON manifest
agent-workshop charter             # print workshop charter
agent-workshop prompt p1           # render Phase 1 prompt
agent-workshop render p4 --vars vars.json   # render with variable substitution
agent-workshop validate design.md  # validate final document
agent-workshop serve 8080          # serve all resources over HTTP
```

---

## File Structure

```
.
├── SKILL.md                          # Pi agent instruction manual
├── CLAUDE.md                         # Claude Code agent instructions
├── workshop-manifest.json            # Phase/role/prompt metadata (read by AI)
├── bin/
│   ├── agent-workshop                   # CLI toolkit
│   └── agent-workshop-init              # Agent setup helper
├── docs/
│   ├── protocol.md                   # Detailed protocol rules
│   ├── phase-9-retrospective.md     # Post-implementation retro
│   ├── prompts/
│   │   ├── workshop-charter.md      # Loaded into every agent turn
│   │   ├── phase-1-problem-framing.md
│   │   ├── phase-4-architecture-author.md
│   │   ├── phase-8-consensus.md
│   │   └── template-library.md      # P2,P3,P5,P6,P7 prompt sections
│   └── examples/
│       └── todo-app-workshop.md     # Full P1-P8 transcript
├── scripts/
│   └── check-readiness.sh           # Design doc validation
├── install.sh                        # One-line global install
├── FACILITATOR-CARD.md              # Human quick reference
├── CHANGELOG.md
└── README.md                         # This file
```

---

## The 8 Phases

| Phase | Name | Mode | Duration | What It Produces |
|-------|------|------|----------|-----------------|
| **P1** | Problem Framing | Roundtable | 5–10 min | Problem, constraints, success criteria, anti-requirements |
| **P2** | Requirements | Roundtable | 10–15 min | MoSCoW requirements (R*, NFR*), edge cases |
| **P3** | Approach Debate | Roundtable | 15–20 min | 2–3 architectures with trade-offs, selected approach |
| **P4** | System Architecture | Author/Reviewers | 20–30 min | Components, data flow, APIs |
| **P5** | Component Design | Author/Reviewers | 30–45 min | Per-component: interfaces, state, dependencies |
| **P6** | Error Handling | Author/Reviewers | 15–20 min | Failure matrix, recovery, observability |
| **P7** | Testing Strategy | Author/Reviewers | 15–20 min | Test pyramid, CI gates, coverage |
| **P8** | Consensus | Roundtable | 10–15 min | Agent sign-offs (CONSENT or documented DISSENT) |

---

## Agent Roles

The AI adopts these roles per phase:

| Role | Focus | Active In |
|------|-------|-----------|
| **Design Author** | Architecture, interfaces, data flow | P4-P7 |
| **Product Critic** | User needs, scope creep, UX gaps | All |
| **Security Engineer** | Threat surfaces, auth, data exposure | All |
| **Scalability Engineer** | Bottlenecks, resource limits, SPOFs | All |
| **QA/Testing Lead** | Testability, observability, coverage | All |
| **Integration Specialist** | APIs, migration paths, third-party | P3-P5 |
| **DevEx Advocate** | Build experience, onboarding, docs | P4-P5, P7 |

---

## Safety Protocol: BLOCK / CONSENT / CONCERN

Every generated agent response must end with one signal:

```
BLOCK [section] — [showstopper, halt and resolve]
CONCERN [section] — [risk, log and continue]
CONSENT [section] — [explicit endorsement, required from all reviewers]
```

- **BLOCK** → halt the phase, resolve or backtrack
- **CONCERN** → non-blocking risk, logged, doesn't stop progress
- **CONSENT** → required from every reviewer before phase gate
- **Force critique** — "looks good" is not enough; every role must find at least one concern

---

## Design Document Output

After P8, the AI assembles:

```markdown
# Design Document — [Project]

## 0. Workshop Metadata
## 1. Problem Statement
## 2. Requirements (functional + NFRs + edge cases)
## 3. Selected Approach (with rejected alternatives)
## 4. System Architecture (diagrams, data flow, APIs)
## 5. Component Design (interfaces, state, dependencies)
## 6. Error Handling & Edge Cases (failure matrix, recovery)
## 7. Testing & Validation Strategy (pyramid, CI gates, coverage)
## 8. Consensus Record (agent sign-offs or documented dissent)
```

Saved to `docs/plans/YYYY-MM-DD-<slug>-design.md`, then validated with `scripts/check-readiness.sh`.

---

## Version

**v1.3.0** — Cross-agent support (Pi, Claude Code, Cursor, generic), `agent-workshop init` for per-agent setup.

See [CHANGELOG.md](CHANGELOG.md).

---

## Roadmap

- [x] v1.1.0: Retrospective Phase (P9), Pi skill manifest
- [ ] v1.2.0: Enhanced validator (requirement traceability, contradiction detection)
- [x] v1.3.0: Cross-agent support (Claude, Cursor, generic), `agent-workshop init`
- [ ] v1.4.0: Component-level iterative refinement (P5 sub-phases)
- [ ] v2.0.0: Save/resume workshop state across sessions

---

## Contributing

Contributions welcome:
- Domain-specific prompt templates (ML, embedded, mobile)
- Additional agent roles in the manifest
- Example workshop transcripts
- Validator enhancements

Open an issue or PR.

---

## License

MIT — Use freely, attribute when sharing modified versions.
