# Facilitator Quick Reference Card

> One-page cheat sheet for running Multi-Agent Design Workshop Protocol v1.0.0

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MULTI-AGENT DESIGN WORKSHOP                                │
│                         Facilitator Quick Card                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## The 8 Phases (in order, never skip)

| # | Phase | Mode | Your Job | ~Time |
|---|-------|------|----------|-------|
| 1 | Problem Framing | Roundtable | Load charter, send P1 prompt to all agents | 5-10m |
| 2 | Requirements | Roundtable | Synthesize requirements from agent responses | 10-15m |
| 3 | Approach Debate | Roundtable | Facilitate debate, select one approach | 15-20m |
| 4 | Architecture | Author/Reviewers | Dispatch P4 to Design Author, then to reviewers | 20-30m |
| 5 | Components | Author/Reviewers | Dispatch P5 to Design Author, then to reviewers | 30-45m |
| 6 | Error Handling | Author/Reviewers | Dispatch P6 to Design Author, then to reviewers | 15-20m |
| 7 | Testing | Author/Reviewers | Dispatch P7 to QA Lead, then to reviewers | 15-20m |
| 8 | Consensus | Roundtable | Assemble full doc, run final BLOCK check | 10-15m |

**Total: ~2.5 hours for medium complexity**

---

## Role Assignment Quick Guide

| Agent | Best At | Assign To |
|-------|---------|-----------|
| Design Author | Architecture, interfaces, data flow | Your strongest architectural agent |
| Product Critic | User needs, scope control | Agent with product sense |
| Security Engineer | Threat modeling, auth | Security-focused agent |
| Scalability Engineer | Performance, capacity | Systems-focused agent |
| Integration Specialist | APIs, migrations | Agent with broad tool knowledge |
| QA Lead | Test strategy, observability | Testing-focused agent |
| DevEx Advocate | Developer workflow, docs | Agent focused on ergonomics |

**Solo mode:** Play all roles yourself, one at a time.

---

## BLOCK / CONSENT / CONCERN Protocol

```
┌─────────┐  ┌──────────┐  ┌──────────┐
│  BLOCK  │  │ CONCERN  │  │ CONSENT  │
│  🔴     │  │  🟡      │  │  🟢      │
└────┬────┘  └────┬─────┘  └────┬─────┘
     │            │             │
   HALTS        RECORDS       TRACKS
  PROGRESS       ONLY        APPROVAL
     │            │             │
     ▼            ▼             ▼
 Backtrack    Document in    Count for
 to previous   design doc     consensus
```

- **BLOCK:** Must fix before proceeding. Facilitator decides: valid (backtrack), invalid (override).
- **CONCERN:** Non-blocking risk. Log it, move on.
- **CONSENT:** Explicit endorsement. Required from all reviewers before phase gate opens.

---

## Phase Transition Mechanics

```
[Agents submit] → [You synthesize] → [Publish artifact] → [BLOCK check] → [APPROVED] → [Next phase]
                          ▲                                              │
                          └─────────[BLOCK valid]←───────────────────────┘
```

**Exact facilitator phrase:**
- To advance: **"APPROVED, proceed to Phase N+1."**
- To backtrack: **"BLOCK VALIDATED. Backtracking to Phase N."**
- To override: **"BLOCK OVERRIDDEN. Rationale: [reason]. Proceeding."**

---

## Common Facilitator Mistakes

| ❌ Don't | ✅ Do Instead |
|----------|--------------|
| "Looks good, let's move on" | "APPROVED, proceed to Phase 3" |
| Skip synthesis step | Write the artifact — agents don't do this |
| Let agents skip output format | Reject off-format responses, re-prompt |
| Accept rubber-stamp reviews | Re-prompt: "You must find at least one issue" |
| Ignore CONCERNs | Log them in the design doc — they matter |
| Rush through phases | A 2-min shortcut now = 2 hours debugging later |
| Forget prior artifacts | Include P1-P(N-1) summary in every prompt |

---

## Escape Hatches

| Situation | Action |
|-----------|--------|
| Agent goes silent | Proceed with remaining agents; flag in metadata |
| Circular BLOCKs (deadlock) | Override after 2 cycles with documented rationale |
| Chat history too long | Re-send artifact summary, not full history |
| Agent hallucinates solution in P1/P2 | Reject: "P1 is problem framing only. No solutions." |
| Scope creep detected | Invoke anti-requirements from P1. BLOCK if needed. |

---

## Artifact Checklist (per phase)

Before saying "APPROVED", verify:
- [ ] All agent responses are in correct format
- [ ] Synthesized artifact is written (not just mentally noted)
- [ ] BLOCKs are resolved or documented as overruled
- [ ] CONCERNs are logged in the design doc
- [ ] At least one agent has raised a question or issue (never perfect on first pass)

## Final Checklist (before P8 lock)

- [ ] Run `./scripts/check-readiness.sh design-doc.md` → PASS
- [ ] Every Must requirement has a design section and a test assignment
- [ ] Every component has interface + state + dependencies + errors
- [ ] All agents have CONSENTed or documented dissent
- [ ] You would give this doc to a stranger and trust them to build it

---

## Template URLs (copy these)
- Workshop Charter: `docs/prompts/workshop-charter.md`
- P1 Problem Framing: `docs/prompts/phase-1.md`
- P2 Requirements: `docs/prompts/phase-2.md`
- ... (see full library in `docs/prompts/`)

**Version:** v1.0.0  |  **Protocol spec:** `docs/protocol.md`
