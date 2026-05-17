# Multi-Agent Design Workshop

> A **Pi skill** and **CLI toolkit** for running structured 8-phase design workshops that produce production-ready technical design documents. The AI reads `SKILL.md` and executes the protocol for you. The human uses `pi-workshop` to inspect prompts, validate results, or run workshops manually.

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## What This Does

When the user says "run a workshop for building X," the AI:

1. **Reads** `SKILL.md` — learns it is facilitator + all agent roles
2. **Reads** `workshop-manifest.json` — discovers phases, roles, prompts
3. **Reads** `docs/protocol.md` — learns BLOCK/CONSENT/CONCERN rules
4. **Reads** `docs/prompts/workshop-charter.md` — loads charter context
5. **Executes P1-P8** — generates multi-role responses, synthesizes, gates with user
6. **Outputs** a `docs/plans/YYYY-MM-DD-<slug>-design.md` ready for implementation

No copy-paste. No manual prompt management. The AI orchestrates everything from the manifest.

**Cross-agent compatible.** Works with Pi, Claude Code, Codex, Cursor, or any LLM that reads files.

## How to Use

### Option 1: Pi Skill (Recommended — Fully Automated)

Clone into your Pi skills directory:

```bash
# For Pi
cd ~/.agents/skills/
git clone https://github.com/baljeet/pi-multi-agent-design-workshop.git
```

Start any conversation with:

> **"Run a multi-agent design workshop for [your project]"**

Pi loads `SKILL.md` automatically. It:
- Reads the manifest and protocol
- Runs all 8 phases as the facilitator
- Adopts multiple agent roles per phase
- Synthesizes outputs and gates with you for approval
- Assembles the final design document
- Validates it with `scripts/check-readiness.sh`

### Option 2: CLI Toolkit (Human-Driven)

For humans who want to inspect prompts, copy them to clipboard, or run workshops manually:

```bash
# Install globally
curl -fsSL https://raw.githubusercontent.com/baljeet/pi-multi-agent-design-workshop/main/install.sh | bash

# Then use from any terminal
pi-workshop list                # list phases, roles, prompts
pi-workshop charter             # print charter
pi-workshop prompt p1           # render Phase 1 prompt
pi-workshop render p4 --vars vars.json   # render with variable substitution
pi-workshop validate design.md  # validate final document
pi-workshop manifest            # dump the JSON manifest
```

The CLI is a **read-only toolkit** for inspecting the protocol. The AI does the actual workshop execution.

## File Structure

```
.
├── SKILL.md                          # Agent instruction manual (read by AI)
├── workshop-manifest.json            # Phase/role/prompt metadata (read by AI)
├── bin/
│   └── pi-workshop                   # CLI for human-driven workflows
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

## The AI Workflow (What Happens Internally)

When the user triggers a workshop, the AI follows **`SKILL.md`'s Agent Facilitation Guide**:

### Step 1: Load Resources

The AI reads (from this repo):
1. `workshop-manifest.json` — phases, roles, variables, prompt file paths
2. `docs/protocol.md` — BLOCK/CONSENT/CONCENR protocol
3. `docs/prompts/workshop-charter.md` — charter to prepend to every agent turn

### Step 2: Execute Phases

The AI iterates through the manifest's `phases` array:

| Phase | Mode | The AI Does |
|-------|------|------------|
| **P1** | Roundtable | Generates 5-7 role responses → synthesizes → asks user |
| **P2** | Roundtable | Generates role responses with MoSCoW → synthesizes → gates |
| **P3** | Roundtable | Design Author proposes 2-3 architectures → roles vote → AI selects |
| **P4** | Author+Reviewers | Design Author drafts → each reviewer critiques → AI resolves |
| **P5** | Author+Reviewers | Per-component design with reviewer feedback |
| **P6** | Author+Reviewers | Failure matrix + recovery with reviewer review |
| **P7** | Author+Reviewers | Test pyramid strategy with reviewer challenges |
| **P8** | Roundtable | All roles sign off (CONSENT or documented DISSENT) |

### Step 3: Variable Substitution

The AI reads the `variables` array from the manifest for each phase and substitutes `{{KEY}}` patterns in prompts with context from prior phases. No raw variables left behind.

Example variables: `{{PROJECT_NAME}}`, `{{USER_INTENT_TEXT}}`, `{{P1_ARTIFACT}}`, `{{P2_REQUIREMENTS}}`, etc.

### Step 4: Safety Protocol

Every generated agent response ends with a signal:

| Signal | Used When | Action |
|--------|-----------|--------|
| **BLOCK** | Critical flaw, showstopper | Facilitator (AI) resolves or backtracks |
| **CONCERN** | Risk, but non-blocking | Log and continue |
| **CONSENT** | Full endorsement | Required from all reviewers before phase gate |

The AI enforces: "If an agent says 'looks good,' re-prompt them to find at least one concern."

### Step 5: Assemble & Validate

After P8, the AI assembles the final design document:

```markdown
# Design Document — [Project]

## 0. Workshop Metadata
## 1. Problem Statement
## 2. Requirements
## 3. Selected Approach
## 4. System Architecture
## 5. Component Design
## 6. Error Handling & Edge Cases
## 7. Testing & Validation Strategy
## 8. Consensus Record
```

Saves to `docs/plans/YYYY-MM-DD-<project-slug>-design.md`, then runs `scripts/check-readiness.sh`.

## The 8 Phases

| Phase | Name | Mode | Duration |
|-------|------|------|----------|
| **P1** | Problem Framing | Roundtable | 5–10 min |
| **P2** | Requirements | Roundtable | 10–15 min |
| **P3** | Approach Debate | Roundtable | 15–20 min |
| **P4** | System Architecture | Author/Reviewers | 20–30 min |
| **P5** | Component Design | Author/Reviewers | 30–45 min |
| **P6** | Error Handling | Author/Reviewers | 15–20 min |
| **P7** | Testing Strategy | Author/Reviewers | 15–20 min |
| **P8** | Consensus | Roundtable | 10–15 min |

## Agent Roles

The AI can adopt any of these roles per phase:

| Role | What They Watch For | Active In |
|------|---------------------|-----------|
| **Design Author** | Architecture, interfaces, data flow, components | P4-P7 |
| **Product Critic** | User needs, scope creep, UX gaps | All phases |
| **Security Engineer** | Threat surfaces, auth gaps, data exposure | All phases |
| **Scalability Engineer** | Bottlenecks, resource limits, SPOFs | All phases |
| **Integration Specialist** | API consistency, migration paths, third-party failures | P3-P5 |
| **QA/Testing Lead** | Testability, observability, coverage | All phases |
| **DevEx Advocate** | Build/debug experience, onboarding, docs | P4-P5, P7 |

## Why No Manual Copy-Paste?

The old workflow (before v1.3.0) required the user to:
1. Open markdown files
2. Copy prompts manually
3. Paste into agent conversations one by one
4. Track which phase they were on
5. Remember to validate the output

Now the AI reads the manifest and executes the protocol automatically. The user's only interactions are:
- **Providing the initial intent** ("design a real-time todo app")
- **Approving each phase artifact** ("Yes, proceed to Phase 2")
- **Reviewing the final design document**

The CLI exists for:
- **Humans who want to peek** at what prompts the AI is using
- **Debugging** — `pi-workshop render p1` shows the raw prompt
- **Custom tooling** — `pi-workshop manifest | jq ...` for external integrations
- **Validation** — `pi-workshop validate design.md` after workshop completion

## Version

**v1.3.0** — AI-driven workshop execution via `SKILL.md` + `workshop-manifest.json`, CLI toolkit for inspection.

See [CHANGELOG.md](CHANGELOG.md).

## Roadmap

- [x] v1.1.0: Retrospective Phase (P9), Pi skill manifest
- [ ] v1.2.0: Enhanced validator (requirement traceability, contradiction detection)
- [x] v1.3.0: Auto-execution via `SKILL.md` + manifest, CLI toolkit
- [ ] v1.4.0: Component-level iterative refinement (P5 sub-phases)
- [ ] v2.0.0: Save/resume workshop state across sessions

## Contributing

Contributions welcome:
- Domain-specific prompt templates (ML, embedded, mobile)
- Additional agent roles in the manifest
- Example workshop transcripts
- Validator enhancements

Open an issue or PR.

## License

MIT — Use freely, attribute when sharing modified versions.
