# Multi-Agent Design Workshop Protocol

> A cross-agent framework for systematic AI-led design discussions that produce production-ready technical design documents.

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## What This Is

A **protocol specification** that enables multiple AI assistants (Pi, Claude Code, Codex, Cursor, etc.) to collaboratively brainstorm, debate, and document solid technical designs. 

**The output:** A standardized markdown document that a developer with **zero context** can implement from — with tests that validate the implementation.

**No code execution required.** Any agent that reads markdown can participate.

## Who It's For

- **Facilitators** — humans or meta-agents running multi-agent design workshops
- **Teams** who want structured, repeatable design processes across different AI tools
- **Solo developers** who want to play multiple agent roles themselves and still produce rigorous designs

---

## Installation

### Option 1: Clone the Repository

```bash
git clone https://github.com/baljeet/multi-agent-design-workshop.git
cd multi-agent-design-workshop
```

### Option 2: Download Release

```bash
# Download latest release
curl -L https://github.com/baljeet/multi-agent-design-workshop/archive/refs/tags/v1.1.0.tar.gz | tar xz
cd multi-agent-design-workshop-1.1.0
```

### Option 3: Copy Individual Files

All artifacts are plain markdown. Copy only what you need:

```bash
# Core protocol (required)
curl -O https://raw.githubusercontent.com/baljeet/multi-agent-design-workshop/main/docs/protocol.md

# Prompt template library (required)
curl -O https://raw.githubusercontent.com/baljeet/multi-agent-design-workshop/main/docs/prompts/template-library.md

# Facilitator quick reference (recommended)
curl -O https://raw.githubusercontent.com/baljeet/multi-agent-design-workshop/main/FACILITATOR-CARD.md
```

---

## Quick Start

```bash
# 1. Clone or download this repo
git clone https://github.com/baljeet/multi-agent-design-workshop.git
cd multi-agent-design-workshop

# 2. Pick a project idea
#    Example: "Build a real-time collaborative todo app"

# 3. Assign roles to your agents (or play all roles yourself)
#    Roles: Design Author, Product Critic, Security Engineer,
#           Scalability Engineer, Integration Specialist, QA Lead, DevEx Advocate

# 4. Load the Workshop Charter template into each agent
#    Copy from: docs/prompts/workshop-charter.md

# 5. Run Phase 1 (Problem Framing) through Phase 8 (Consensus)
#    Advance ONLY when facilitator says: "APPROVED, proceed to Phase N+1."

# 6. Assemble all phase outputs into the design doc structure

# 7. Validate before implementation
chmod +x scripts/check-readiness.sh
./scripts/check-readiness.sh my-design-doc.md
```

---

## File Structure

```
.
├── docs/
│   ├── protocol.md              # The 8-phase protocol specification
│   ├── phase-9-retrospective.md # Post-implementation retrospective (v1.1.0)
│   ├── prompts/                 # Render-ready prompt templates
│   │   ├── workshop-charter.md         # Kickoff template
│   │   ├── phase-1-problem-framing.md  # P1: Problem Framing
│   │   ├── phase-4-architecture-author.md # P4: Architecture (Author)
│   │   ├── phase-8-consensus.md        # P8: Consensus & Finalization
│   │   └── template-library.md         # Complete library (all phases × roles)
│   └── examples/
│       └── todo-app-workshop.md # Full P1-P8 mock run with realistic agent dialogue
├── scripts/
│   └── check-readiness.sh      # Design doc validation script
├── FACILITATOR-CARD.md         # One-page quick reference cheat sheet
├── CHANGELOG.md                # Version history
└── README.md                   # This file
```

---

## The 8 Phases

| Phase | Mode | Purpose | Duration (estimate) |
|-------|------|---------|---------------------|
| **P1** | Roundtable | Problem Framing — intent, constraints, success criteria | 5-10 min |
| **P2** | Roundtable | Requirements Elicitation — functional, NFRs, edge cases | 10-15 min |
| **P3** | Roundtable | Approach Debate — 2-3 architectures, trade-offs | 15-20 min |
| **P4** | Author/Reviewer | System Architecture — components, data flow, APIs | 20-30 min |
| **P5** | Author/Reviewer | Component Design — interfaces, state, dependencies | 30-45 min |
| **P6** | Author/Reviewer | Error Handling — failure modes, recovery, observability | 15-20 min |
| **P7** | Author/Reviewer | Testing Strategy — pyramid, CI gates, coverage | 15-20 min |
| **P8** | Roundtable | Consensus — final review, objections, lock | 10-15 min |

**Total:** ~2.5 hours for a medium-complexity system

---

## The BLOCK / CONSENT / CONCERN Protocol

Any agent can raise flags at any time:

| Signal | Meaning | Action |
|--------|---------|--------|
| **BLOCK** `[section] — [reason]` | Critical issue, halts progress | Facilitator decides: valid (backtrack), invalid (override), partial (fix subsection) |
| **CONCERN** `[section] — [reason]` | Non-blocking risk | Log it in design doc, move on |
| **CONSENT** `[section] — [agent name]` | Explicit endorsement | Count toward consensus tally |

---

## Key Rules

1. **Never skip phases.** P1 through P8 in order.
2. **Facilitator gates every transition.** "Looks good" is not enough — must say "APPROVED."
3. **Synthesize between phases.** The facilitator produces a single artifact per phase before advancing.
4. **Force critique.** Reviewers must find at least one issue. Rubber-stamping is forbidden.
5. **Backtrack on BLOCK.** Valid objections force return to the previous phase.

---

## Example: Running a Workshop

**You (Facilitator):** "Build a real-time collaborative document editor."

**You → Agent A (Design Author):** [P1 Problem Framing prompt with user intent]  
**You → Agent B (Product Critic):** [Same prompt]  
**You → Agent C (Security Engineer):** [Same prompt]

**Agent A:** Returns problem analysis + 3 questions + CONSENT  
**Agent B:** Returns problem analysis + flags UX ambiguity + CONSENT with note  
**Agent C:** Returns problem analysis + flags data exposure risk + CONCERN

**You (synthesize):** Write P1 Problem Statement artifact, resolve CONCERN by adding constraint.

**You (to all):** "P1 COMPLETE. BLOCK check?" → No blocks.

**You:** **"APPROVED, proceed to Phase 2."** ...and so on.

See `docs/examples/todo-app-workshop.md` for a complete realistic transcript with BLOCK resolution and backtracking.

---

## Version

**v1.1.0** — Protocol + Retrospective Phase (P9), example transcript, validator script, facilitator card.

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## Roadmap

- [x] v1.1.0: Retrospective Phase (P9) for post-implementation learning
- [ ] v1.2.0: Enhanced readiness validator (requirement traceability, contradiction detection)
- [ ] v1.3.0: CLI tool for prompt rendering and workshop orchestration
- [ ] v2.0.0: Multi-session workshops (save/resume state across days)

---

## Contributing

This is a protocol specification, not code. Contributions welcome as:

- New prompt templates for specialized domains (ML systems, embedded, mobile)
- Additional role definitions
- Example workshop transcripts
- Validator enhancements

Open an issue or PR with your proposal.

---

## License

MIT — Use freely, attribute when sharing modified versions.
