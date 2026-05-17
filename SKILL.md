---
name: multi-agent-design-workshop
description: >
  Run structured multi-agent design workshops (8 phases) where YOU (the AI) play
  multiple specialized agent roles sequentially to produce production-ready technical
  design documents. You are the facilitator AND the agents. Use the workshop-manifest.json
  for phase/role metadata, docs/prompts/ for phase-specific prompts, and docs/protocol.md
  for detailed protocol rules.
---

# Multi-Agent Design Workshop — Agent Facilitation Guide

## Overview

You are the **Facilitator** AND the **entire agent team**.

When the user says something like "run a workshop for [idea]," you systematically execute an 8-phase design protocol. For each phase, you adopt multiple agent roles (Design Author, Product Critic, Security Engineer, etc.), generate responses for each role, synthesize them into a single phase artifact, present it to the user for approval, and only proceed to the next phase after explicit "APPROVED" or similar consent.

**Output:** A standardized markdown design document that a developer with zero context can implement from.

## Quick Start Protocol

```
[User request] → [Load manifest] → [Review protocol] → [Execute P1-P8]
```

### Step 1: Load Resources

On workshop start, read these files in this repo (they're in `{{WORKSHOP_DIR}}`):

1. **`workshop-manifest.json`** — Phase list, roles, variables, prompt file paths
2. **`docs/protocol.md`** — Detailed protocol rules, BLOCK/CONSENT/CONCERN mechanics
3. **`docs/prompts/workshop-charter.md`** — Charter to prepend to every agent turn

### Step 2: Determine Phase Strategy

Read the manifest's `phases` array. The general flow:

| Phase | Mode | You Generate |
|-------|------|-------------|
| **P1-P3** | Roundtable | N role responses → synthesize |
| **P4-P7** | Author + Reviewers | Author draft + reviewer responses → synthesize |
| **P8** | Roundtable | N sign-offs + objections → synthesize |

**Default role selection** (adjust per project complexity):
- Agent A: Design Author
- Agent B: Product Critic
- Agent C: Security Engineer
- Agent D: Scalability Engineer
- Agent E: QA/Testing Lead

### Step 3: Execute One Phase

For each phase:

1. **Load the prompt**: Read the file from `prompt` field in the manifest for this phase. If `prompt_source` is `template_section`, the prompt is in `docs/prompts/template-library.md` under a heading for that phase.

2. **Render the prompt per role**: Substitute `{{VARIABLES}}` with context from prior phases. See "Variable Substitution" below.

3. **Generate agent responses**: For each active role this phase, generate what that role would say. Use the role's `id` from the manifest's `roles` array. Each response must include:
   - Role-specific analysis
   - At least one concern, question, or critique
   - BLOCK, CONCERN, or CONSENT signal

4. **Synthesize**: Write a single phase artifact that resolves conflicts, incorporates valid critiques, and documents dissent.

5. **Present to user**: Show the synthesized artifact. Ask: "Does this look right? APPROVED to proceed?"

6. **Gate**: Wait for explicit approval before proceeding to next phase.

### Step 4: Assemble Final Document

After P8 consensus, assemble all 8 phase artifacts into one markdown document with this structure:

```markdown
# Design Document — [Project Name]

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

Save as `docs/plans/YYYY-MM-DD-[project-slug]-design.md`.

### Step 5: Validate

Run `scripts/check-readiness.sh` against the final document if available:
```bash
bash scripts/check-readiness.sh docs/plans/YYYY-MM-DD-[slug]-design.md
```

Report results to the user.

## Variable Substitution

When rendering prompts, substitute these variable patterns:

| Variable | Source |
|----------|--------|
| `{{PROJECT_NAME}}` | User's project name or description |
| `{{USER_INTENT_TEXT}}` | The user's original request |
| `{{ASSIGNED_ROLE}}` | Current role being played (from manifest) |
| `{{P1_ARTIFACT}}` | Full text of P1 synthesized artifact |
| `{{P1_ARTIFACT_SUMMARY}}` | 2-3 sentence summary of P1 artifact |
| `{{P2_REQUIREMENTS}}` | Full P2 requirements text |
| `{{P2_REQUIREMENTS_SUMMARY}}` | Summary of P2 requirements |
| `{{P3_SELECTED_APPROACH}}` | The chosen approach from P3 |
| `{{P4_ARCHITECTURE}}` | Full P4 architecture document |
| `{{P5_COMPONENTS}}` | Full P5 component design |
| `{{P6_ERRORS}}` | Full P6 error handling doc |
| `{{COMPONENT_NAME}}` | Per-component (P5 iterates over components) |
| `{{FULL_DESIGN_DOC}}` | All prior artifacts concatenated |

**Rules:**
- Read the manifest's `variables` array for the current phase to know which variables are expected
- Always provide context from prior phases so the "agent" has the full picture
- Never leave raw `{{VARIABLES}}` in prompts you generate

## The Safety Protocol: BLOCK / CONSENT / CONCERN

Every agent response must end with one signal:

| Signal | Format | When Used |
|--------|--------|-----------|
| **BLOCK** | `BLOCK [section] — [reason]` | Critical flaw, showstopper, safety issue |
| **CONCERN** | `CONCERN [section] — [reason]` | Risk that should be logged but doesn't halt |
| **CONSENT** | `CONSENT [section] — [agent-name]` | Explicit endorsement, no issues found |

**Rules:**
- If ANY agent raises BLOCK, you (facilitator) must address it before proceeding
- You may resolve the BLOCK by fixing the issue, or you may OVERRIDE with documented rationale
- Every reviewer must provide CONSENT before you ask the user for phase approval
- "Looks good to me" does NOT count — force at least one critique or concern

## Agent Role Prompts

When generating an agent response, prepend the charter and include the role identity:

```markdown
{{WORKSHOP_CHARTER}}

---

# PHASE {{PHASE_NUMBER}}: {{PHASE_NAME}}
**Mode:** {{MODE}}
**Your Role:** {{ROLE_NAME}}
**Focus:** {{ROLE_FOCUS}}

{{PHASE_PROMPT_BODY}}
```

Load the charter from `docs/prompts/workshop-charter.md`, the prompt body from the phase's prompt file.

## Phase-Specific Notes

### P1: Problem Framing
- Ask the user clarifying questions if intent is vague
- Do NOT propose solutions in P1 — pure problem understanding only
- Output: Problem Summary, Constraints, Success Criteria, Anti-Requirements

### P2: Requirements
- Use MoSCoW (Must have / Should have / Could have / Won't have)
- Identify functional requirements as R1, R2, ...
- Identify non-function requirements as NFR1, NFR2, ...
- List edge cases explicitly

### P3: Approach Debate
- You (as Design Author) propose 2-3 architectures
- Each other role critiques and votes
- You synthesize and SELECT one approach with justification

### P4-P7: Author/Reviewers
- Design Author writes the full artifact first
- Each reviewer role responds independently
- You synthesize author draft + reviewer feedback into one polished artifact
- Iterate if BLOCKs exist

### P8: Consensus
- Each role either CONSENTS or registers DISSENT
- Document any dissent with rationale
- Lock the design document — no changes after P8 without new workshop cycle

## Output Requirements

The final design document must be implementable by someone with:
- Zero knowledge of the original conversation
- Only the document in front of them

Every section must be self-contained. Reference prior sections by name, not by conversation context.

## Related Skills

- `brainstorming` — Use BEFORE this workshop if the user's idea is not yet well-defined
- `writing-plans` — Invoke AFTER P8 consensus to create implementation tasks
- `executing-plans` — Use after writing-plans to implement
- `test-driven-development` — Use during implementation if available

## Anti-Patterns

| Anti-Pattern | Why Wrong |
|-------------|-----------|
| "I'll just write a design directly" | Misses multi-perspective review, catches fewer issues |
| "P1 is clear, let's skip to P4" | Violates protocol; assumptions in P4 compound |
| "All agents say CONCERN, no BLOCK, but I disagree" | You can override, but must document your rationale |
| "I'll ask the user what they think between every agent" | Too slow; synthesize first, then present |
