# Pi Multi-Agent Design Workshop Skill

> A **Pi skill** for facilitating structured design discussions between multiple AI agents to produce production-ready technical design documents. Works with Pi, Claude Code, Codex, Cursor, or any LLM that reads markdown.

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## What This Skill Does

Install this skill in your Pi environment to run **systematic 8-phase design workshops** where multiple AI assistants (or one assistant wearing multiple hats) collaborate to produce rigorously reviewed technical designs.

**The output:** A standardized markdown document that a developer with **zero context** can implement from — with tests that validate the implementation.

**Cross-agent compatible.** Works with Pi, Claude Code, Codex, Cursor, or any LLM-based coding tool. No code execution required.

## Installation

### As a Pi Skill

1. **Clone into your Pi skills directory:**
   ```bash
   cd ~/.agents/skills/
   git clone https://github.com/baljeet/pi-multi-agent-design-workshop.git
   ```

2. **Activate in Pi:** The `SKILL.md` manifest is auto-detected. Start any conversation with:
   > "Run a multi-agent design workshop for [your project idea]"

3. **Pi loads the skill** and guides you through the 8-phase protocol.

### As a Standalone Repo

```bash
git clone https://github.com/baljeet/pi-multi-agent-design-workshop.git
cd pi-multi-agent-design-workshop
```

### Download Individual Files

All artifacts are plain markdown. Copy only what you need:

```bash
# Core protocol
curl -O https://raw.githubusercontent.com/baljeet/pi-multi-agent-design-workshop/main/docs/protocol.md

# Prompt templates
curl -O https://raw.githubusercontent.com/baljeet/pi-multi-agent-design-workshop/main/docs/prompts/template-library.md

# Quick reference
curl -O https://raw.githubusercontent.com/baljeet/pi-multi-agent-design-workshop/main/FACILITATOR-CARD.md
```

---

## Quick Start

```bash
# 1. Install the skill (see above)

# 2. Start a workshop in Pi:
#    "Run a multi-agent design workshop for building a real-time todo app"

# 3. Pi loads the Workshop Charter and guides you through P1-P8

# 4. At each phase, Pi synthesizes agent responses and asks for your approval

# 5. After P8 consensus, Pi assembles the final design document

# 6. Validate before implementation
chmod +x scripts/check-readiness.sh
./scripts/check-readiness.sh my-design-doc.md
```

---

## File Structure

```
.
├── SKILL.md                         # Pi skill manifest (auto-loaded)
├── docs/
│   ├── protocol.md                  # 8-phase protocol specification
│   ├── phase-9-retrospective.md    # Post-implementation retrospective
│   ├── prompts/                     # Render-ready prompt templates
│   │   ├── workshop-charter.md
│   │   ├── phase-1-problem-framing.md
│   │   ├── phase-4-architecture-author.md
│   │   ├── phase-8-consensus.md
│   │   └── template-library.md     # Complete library (all phases × roles)
│   └── examples/
│       └── todo-app-workshop.md    # Full P1-P8 mock transcript
├── scripts/
│   └── check-readiness.sh          # Design doc validation
├── FACILITATOR-CARD.md             # One-page quick reference
├── CHANGELOG.md                    # Version history
├── LICENSE                         # MIT
└── README.md                       # This file
```

---

## The 8 Phases

| Phase | Mode | Purpose | Duration |
|-------|------|---------|----------|
| **P1** | Roundtable | Problem Framing — intent, constraints, success criteria | 5-10 min |
| **P2** | Roundtable | Requirements — functional, NFRs, edge cases | 10-15 min |
| **P3** | Roundtable | Approach Debate — 2-3 architectures, trade-offs | 15-20 min |
| **P4** | Author/Reviewers | System Architecture — components, data flow, APIs | 20-30 min |
| **P5** | Author/Reviewers | Component Design — interfaces, state, dependencies | 30-45 min |
| **P6** | Author/Reviewers | Error Handling — failure modes, recovery, observability | 15-20 min |
| **P7** | Author/Reviewers | Testing Strategy — pyramid, CI gates, coverage | 15-20 min |
| **P8** | Roundtable | Consensus — final review, objections, lock | 10-15 min |

**Total:** ~2.5 hours for medium complexity

---

## Safety Protocol: BLOCK / CONSENT / CONCERN

Any agent can raise flags at any time:

| Signal | Meaning | Action |
|--------|---------|--------|
| **BLOCK** | Critical issue, halts progress | Facilitator resolves or backtracks |
| **CONCERN** | Non-blocking risk | Log it, move on |
| **CONSENT** | Explicit endorsement | Required before phase gate |

---

## Key Rules

1. **Never skip phases.** P1 through P8 in order.
2. **Facilitator gates every transition.** Must say "APPROVED" explicitly.
3. **Synthesize between phases.** The facilitator produces one artifact per phase.
4. **Force critique.** Reviewers must find at least one issue.
5. **Backtrack on BLOCK.** Valid objections are safety features.

---

## Example Workshop

**You (Facilitator):** "Build a real-time collaborative document editor."

**You → Agent A (Design Author):** [P1 prompt + user intent]  
**You → Agent B (Product Critic):** [Same prompt]  
**You → Agent C (Security Engineer):** [Same prompt]

**Agent A:** Problem analysis + 3 questions + CONSENT  
**Agent B:** Problem analysis + flags UX gap + CONSENT with note  
**Agent C:** Problem analysis + flags data exposure + CONCERN

**You (synthesize):** Write P1 artifact, resolve CONCERN by adding constraint.

**You:** "P1 COMPLETE. BLOCK check?" → No blocks. **"APPROVED, proceed to Phase 2."**

See `docs/examples/todo-app-workshop.md` for the complete transcript with BLOCK resolution and backtracking.

---

## Version

**v1.1.0** — Protocol + P9 Retrospective, example transcript, validator script, facilitator card, Pi skill manifest.

See [CHANGELOG.md](CHANGELOG.md).

---

## Roadmap

- [x] v1.1.0: Retrospective Phase (P9), Pi skill manifest
- [ ] v1.2.0: Enhanced validator (requirement traceability, contradiction detection)
- [ ] v1.3.0: CLI helper for prompt rendering
- [ ] v2.0.0: Multi-session support (save/resume state)

---

## Contributing

This is a protocol specification. Contributions:
- Domain-specific prompt templates (ML, embedded, mobile)
- Additional agent roles
- Example workshop transcripts
- Validator enhancements

Open an issue or PR.

---

## License

MIT — Use freely, attribute when sharing modified versions.
