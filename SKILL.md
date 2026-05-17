---
name: multi-agent-design-workshop
description: >
  Turn "I want to build X" into a production-ready design document.
  Run an 8-phase structured design workshop fully autonomously inside the agent:
  the AI adopts 5-7 specialized roles, debates trade-offs, resolves objections internally,
  assembles a final design doc, then spawns fresh review agents to critique it.
  The user sees the complete result once, with all questions collected.
  Read workshop-manifest.json for phase/role/prompt metadata and execute automatically.
  design documents. You are the facilitator AND the agents. Use the workshop-manifest.json
  for phase/role metadata, docs/prompts/ for phase-specific prompts, and docs/protocol.md
  for detailed protocol rules.
---

# Multi-Agent Design Workshop — Agent Facilitation Guide

## Overview

You are the **Facilitator** AND the **entire agent team**.

When the user says something like "run a workshop for [idea]," you autonomously execute an 8-phase design protocol THEN spawn review agents. For each phase, you adopt multiple agent roles (Design Author, Product Critic, Security Engineer, etc.), generate responses for each role, synthesize them into a single phase artifact, and proceed immediately to the next phase. No per-phase user gates. The user sees the final design doc + review feedback + all collected questions at the very end.

**Output:** A standardized markdown design document that a developer with zero context can implement from.

## Quick Start Protocol

```
[User request] → [Load manifest] → [Review protocol] → [Autonomous P1-P8 + save checkpoints at P2/P4/P5] → [Review Agents] → [Present to user ONCE]
```

### Step 1: Load Resources

On workshop start, read these files in this repo (they're in `{{WORKSHOP_DIR}}`):

1. **`workshop-manifest.json`** — Phase list, roles, variables, prompt file paths
2. **`docs/protocol.md`** — Detailed protocol rules, BLOCK/CONSENT/CONCERN/QUESTION mechanics
3. **`docs/prompts/workshop-charter.md`** — Charter to prepend to every agent turn

### Step 2: Determine Phase Strategy

Read the manifest's `phases` array. The general flow:

| Phase | Mode | You Generate |
|-------|------|-------------|
| **P1-P3** | Roundtable | N role responses → synthesize → proceed |
| **P4-P7** | Author + Reviewers | Author draft + reviewer responses → synthesize → proceed |
| **P8** | Roundtable | N sign-offs + objections → synthesize → proceed |
| **REVIEW** | Review Agents | Fresh agents critique complete doc → synthesize → present |

**Default role selection** (adjust per project complexity):
- Agent A: Design Author
- Agent B: Product Critic
- Agent C: Security Engineer
- Agent D: Scalability Engineer
- Agent E: QA/Testing Lead

### Step 3: Execute Phases Autonomously (P1-P8)

For each phase, run WITHOUT pausing for the user:

1. **Load the prompt**: Read the file from `prompt` field in the manifest for this phase. If `prompt_source` is `template_section`, the prompt is in `docs/prompts/template-library.md` under a heading for that phase.

2. **Render the prompt per role**: Substitute `{{VARIABLES}}` with context from prior phases. See "Variable Substitution" below.

3. **Generate agent responses**: For each active role this phase, generate what that role would say. Use the role's `id` from the manifest's `roles` array. Each response must include:
   - Role-specific analysis
   - At least one concern, question, or critique
   - BLOCK, CONCERN, CONSENT, or QUESTION signal

4. **Resolve BLOCKs internally**: If any agent raises BLOCK, the other agents debate and resolve it. If a BLOCK truly cannot be resolved without user input, convert it to a QUESTION, document the assumption being made, and proceed.

5. **Collect QUESTIONS**: If any agent raises QUESTION, add it to a running list. Do NOT pause the workshop. Present all QUESTIONS at the end.

6. **Synthesize**: Write a single phase artifact that resolves conflicts, incorporates valid critiques, and documents dissent.

7. **Proceed immediately** to the next phase. No gate. No approval wait.
8. **Save checkpoint artifacts** at key milestones (see Step 3b below)

### Step 3b: Save Review Checkpoints

At key milestones, save standalone artifact files for human review. The workshop keeps running — these let stakeholders verify direction without blocking progress.

| Checkpoint | After Phase | File Path | Content |
|------------|-------------|-----------|---------|
| **User Stories & Requirements** | P2 | `docs/artifacts/{slug}-requirements.md` | Functional + NFR requirements with MoSCoW, user stories, edge cases |
| **High-Level Architecture** | P4 | `docs/artifacts/{slug}-architecture-hld.md` | System diagram, component overview, data flow, API surface, technology choices |
| **Low-Level Design** | P5 | `docs/artifacts/{slug}-architecture-lld.md` | Per-component interfaces, state machines, data schemas, dependency graph |
| **Error Handling & Failure Matrix** | P6 | `docs/artifacts/{slug}-error-handling.md` | Failure modes, recovery strategies, observability plan, retry/fallback logic |
| **Test Strategy & Cases** | P7 | `docs/artifacts/{slug}-test-strategy.md` | Test pyramid, CI gates, coverage matrix, sample test cases per critical path |
| **Security Review** | REVIEW | `docs/artifacts/{slug}-security-review.md` | Threat surfaces, auth/data gaps, compliance risks, mitigation recommendations (synthesized by Risk Reviewer + Security Engineer findings across all phases) |

**Rules:**
- Use the project slug (kebab-case) in filenames, e.g. `real-time-collab-requirements.md`
- Create the `docs/artifacts/` directory if it doesn't exist
- Each checkpoint file includes a header with: project name, date, phase source, and a note that this is an intermediate artifact subject to later phases
- Save immediately after synthesizing the phase — do NOT wait for later phases
- Include the file paths in the final presentation so reviewers know exactly where to look

### Step 4: Spawn Review Agents

After P8 consensus and the final design doc is assembled, spawn a **fresh set of review agents** to critique the complete document:

**Review Agent Roles** (pick 3-5):
- **Architecture Reviewer** — Does the architecture hold together? Are there gaps or contradictions?
- **Implementation Reviewer** — Can a developer actually build from this? What's unclear or underspecified?
- **Risk Reviewer** — What could go wrong in production? What failure modes were missed? Also produces the Security Review checkpoint.
- **Product Reviewer** — Does this actually solve the user's stated problem?
- **Simplicity Reviewer (YAGNI)** — What can be removed? Are there unnecessary abstractions, future-proofing, or features that trace to no requirement?

**Review Process:**
1. Give each review agent the **complete** design doc (all 8 sections)
2. Each produces: BLOCKs, CONCERNs, QUESTIONS, and an overall verdict (READY / NEEDS WORK / BLOCKED)
3. The Risk Reviewer also synthesizes all security findings from across P1-P8 into a standalone Security Review checkpoint
4. Synthesize review feedback. Resolve BLOCKs among review agents if possible.
5. Save the Security Review to `docs/artifacts/{slug}-security-review.md`
6. Append the review synthesis to the final presentation

### Step 5: Assemble Final Document

Assemble all 8 phase artifacts into one markdown document with this structure:

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

### Step 6: Validate

Run `scripts/check-readiness.sh` against the final document if available:
```bash
bash scripts/check-readiness.sh docs/plans/YYYY-MM-DD-[slug]-design.md
```

Report results to the user.

### Step 7: Present to User (ONCE)

Present everything together at the very end:

1. **Executive summary** (3-5 sentences — what was designed, key decisions, open questions)
2. **Review checkpoint file paths** — so people know where to find the standalone artifacts:
   - `docs/artifacts/{slug}-requirements.md` (user stories + requirements)
   - `docs/artifacts/{slug}-architecture-hld.md` (high-level architecture)
   - `docs/artifacts/{slug}-architecture-lld.md` (low-level component design)
   - `docs/artifacts/{slug}-error-handling.md` (failure modes + recovery)
   - `docs/artifacts/{slug}-test-strategy.md` (test pyramid + cases)
   - `docs/artifacts/{slug}-security-review.md` (threat review + mitigations)
3. **The full design doc** (in scannable, structured sections — not a prose wall)
4. **Review agent feedback** — what each reviewer flagged:
   - BLOCKs (if any were unresolvable)
   - CONCERNs (risks worth watching)
   - Overall verdict (READY / NEEDS WORK / BLOCKED)
5. **Questions for you** — all collected QUESTIONS from all phases + review agents
6. **Action menu:**
   ```
   You can: (a) review the checkpoint files above, (b) answer the questions,
   (c) request changes to specific sections, (d) approve as-is,
   (e) refine/iterate/loop to improve the design, or (f) request a deeper dive on any area
   ```

**Iteration:** If the user requests changes, apply them to the affected sections and re-run only the review agents (not the entire workshop).

### Step 7b: Optional — Generate Implementation Task List

If the user asks for **implementation tasks** after approving the design:

- Extract components and interfaces from P4 (architecture) and P5 (component design)
- Generate tasks in dependency order: shared types → core services → integrations → UI
- Use the `writing-plans` skill pattern: each task has exact file paths, test-first steps, commit points
- Save to `docs/plans/YYYY-MM-DD-[slug]-tasks.md`
- This bridges Workshop output directly into `executing-plans` or `subagent-driven-development`

### Step 7c: Iterative Refinement Loop (Autoresearch Mode)

When the user says **"refine the design"**, **"iterate"**, **"loop"**, **"improve the doc"**, or **"run the loop"**, enter an iterative autoresearch cycle.

**How it works:** The REVIEW agents act as the quality test suite. Each iteration fixes the BLOCKs they find, re-runs REVIEW, and measures whether quality improved. The loop auto-stops when the design converges.

**Metrics:**
| Metric | Direction | Meaning |
|--------|-----------|---------|
| **BLOCK count** | lower ↓ | Primary — showstopper defects in the design |
| **CONCERN count** | lower ↓ | Secondary — non-blocking risks |
| **QUESTION count** | lower ↓ | Secondary — unresolved user questions |

**Per-Iteration Flow:**
1. Run REVIEW agents on the current design doc → collect BLOCKs, CONCERNs, QUESTIONS
2. **If 0 BLOCKs** → design is READY, stop the loop
3. For each BLOCK: identify which phase(s) need fixing → re-run just those phases with BLOCK as context
4. Update the design doc with fixes
5. Re-run REVIEW agents on the updated doc
6. **Compare BLOCK count:**
   - Decreased → **keep** the change, continue looping
   - Same or increased → **discard** the change, revert doc
7. **Stop conditions:**
   - 0 BLOCKs reached → READY
   - 3 consecutive discards → converged
   - BLOCK count unchanged for 2 cycles → converged

**Tracking:** Append an iteration log to the end of the design doc:

```markdown
## Iteration History

| Iteration | BLOCKs | CONCERNs | QUESTIONs | Status |
|-----------|--------|----------|-----------|--------|
| 0 (initial) | 7 | 12 | 5 | baseline |
| 1 | 3 | 8 | 4 | keep (↓4 BLOCKs) |
| 2 | 1 | 5 | 2 | keep (↓2 BLOCKs) |
| 3 | 0 | 2 | 1 | READY |
```

**Rules:**
- Never re-run the entire workshop — only affected phases per BLOCK
- If a BLOCK traces to P1/P2/P3 (problem understanding was wrong), flag as QUESTION instead of looping
- If CONCERN count spikes while BLOCKs drop, log the trade-off but don't discard
- Stop presenting per-iteration; just show the final design doc + iteration log

## Variable Substitution

When rendering prompts, substitute these variable patterns:

| Variable | Source |
|----------|--------|
| `{{PROJECT_SCAN}}` | Summary of existing codebase: directory structure, manifests, docs, recent commits |
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

## The Safety Protocol: BLOCK / CONCERN / CONSENT / QUESTION

Every agent response must end with one signal:

| Signal | Format | When Used |
|--------|--------|-----------|
| **BLOCK** | `BLOCK [section] — [reason]` | Critical flaw, showstopper. Resolve internally among agents. |
| **CONCERN** | `CONCERN [section] — [reason]` | Risk that should be logged but doesn't halt |
| **CONSENT** | `CONSENT [section] — [agent-name]` | Explicit endorsement, no blocking issues |
| **QUESTION** | `QUESTION [section] — [specific question]` | Needs user/customer input. Collect, don't pause. |

**Rules:**
- If ANY agent raises BLOCK, the other agents MUST debate and attempt to resolve it internally
- If a BLOCK is truly unresolvable without user input, convert it to QUESTION, document the assumption, and proceed
- Every reviewer must provide CONSENT before synthesizing the phase artifact
- "Looks good to me" does NOT count — force at least one critique or concern
- QUESTIONs are collected across all phases and presented once at the end
- **When resolving BLOCKs:** explicitly reason through alternatives, fix paths, and why the chosen resolution is correct

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
- If the user's intent is vague, make reasonable assumptions and flag them as QUESTIONS at the end
- Do NOT propose solutions in P1 — pure problem understanding only
- Use only 3 roles max (Product Critic, Security Engineer, QA/Testing Lead) — not all 5-7
- Output: Problem Summary, Constraints, Success Criteria, Anti-Requirements

### P2: Requirements
- Use MoSCoW (Must have / Should have / Could have / Won't have)
- **Each requirement may include a User Story** ("As a [role], I want [feature], so that [benefit]")
- **Acceptance criteria may use EARS format** (unambiguous, testable)
- Identify functional requirements as R1, R2, ...
- Identify non-function requirements as NFR1, NFR2, ...
- List edge cases explicitly

### P3: Approach Debate
- You (as Design Author) propose 2-3 architectures
- **Before proposing, research:** existing solutions, patterns, and constraints. Cite sources.
- Each other role critiques and votes
- **Before selecting:** explicitly reason through trade-offs, risks, and why the selected approach dominates
- You synthesize and SELECT one approach with justification

### P4-P7: Author/Reviewers
- Design Author writes the full artifact first
- Each reviewer role responds independently
- You synthesize author draft + reviewer feedback into one polished artifact
- Resolve BLOCKs internally; if unresolvable, convert to QUESTION

### P8: Consensus
- Each role either CONSENTS or registers DISSENT
- Document any dissent with rationale
- Lock the design document — no changes after P8 without a new workshop cycle
- **Optional:** Generate an implementation task list if the output warrants it

### REVIEW: Post-Workshop Critique
- Use 3-4 fresh review agents (Architecture Reviewer, Implementation Reviewer, Risk Reviewer, Product Reviewer)
- Give each the FULL design doc
- Synthesize their feedback into: overall verdict + BLOCKs + CONCERNs + QUESTIONS
- Present alongside the design doc

## Output Requirements

The final design document must be implementable by someone with:
- Zero knowledge of the original conversation
- Only the document in front of them

Every section must be self-contained. Reference prior sections by name, not by conversation context.

## Related Skills

- `brainstorming` — Use BEFORE this workshop if the user's idea is not yet well-defined
- `writing-plans` — Invoke AFTER user approves the final doc to create implementation tasks
- `executing-plans` — Use after writing-plans to implement
- `test-driven-development` — Use during implementation if available

## Anti-Patterns

| Anti-Pattern | Why Wrong |
|-------------|-----------|
| "I'll just write a design directly" | Misses multi-perspective review, catches fewer issues |
| "P1 is clear, let's skip to P4" | Violates protocol; assumptions in P4 compound |
| Pausing mid-workshop to ask the user | Collect QUESTIONS, present at the end |
| "Let me show you P1 before continuing" | User sees everything once; per-phase gates are removed |
| Presenting a wall of unreadable text | Use scannable sections, tables, bullet points |
| "All agents say CONSENT, no issues found" | Force at least one CONCERN or QUESTION per role |
