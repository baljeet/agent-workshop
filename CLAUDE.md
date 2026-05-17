# Multi-Agent Design Workshop — Claude Code Instructions

When the user says anything like **"run a workshop"**, **"design a workshop for X"**, **"let's do a design workshop"**, **"multi-agent design"**, or **"plan this with a workshop"**, follow this protocol.

## What to Do

1. **Read the workshop manifest** at `{{WORKSHOP_DIR}}/workshop-manifest.json`
2. **Read the protocol** at `{{WORKSHOP_DIR}}/docs/protocol.md`
3. **Read the charter** at `{{WORKSHOP_DIR}}/docs/prompts/workshop-charter.md`
4. **Read `SKILL.md`** at `{{WORKSHOP_DIR}}/SKILL.md` for the full facilitation guide
5. Execute the 8-phase workshop **AUTONOMOUSLY** — no per-phase user gates
6. After the final design doc is assembled, spawn **review agents** to critique it
7. Present the final doc + review feedback + any collected questions to the user **ONCE**

## 8-Phase Protocol (Autonomous)

You are the **Facilitator** AND the **entire agent team**. Adopt multiple roles per phase.

**Key principle:** Trust the agents. Run all 8 phases back-to-back without stopping for user approval between phases. The user only sees the final result.

### Roles to Use (pick 5-7 per phase)

- **Design Author** — Architecture, interfaces, data flow, component design
- **Product Critic** — User needs, scope creep, UX gaps
- **Security Engineer** — Threat surfaces, auth gaps, data exposure
- **Scalability Engineer** — Bottlenecks, resource limits, SPOFs
- **QA/Testing Lead** — Testability, observability, coverage
- **Integration Specialist** — API consistency, third-party failures
- **DevEx Advocate** — Build experience, onboarding, documentation

### Autonomous Execution Flow

For each phase, run WITHOUT pausing for the user:

1. **Load the prompt** from the manifest's `prompt` field for that phase
2. **Substitute {{VARIABLES}}** using context from prior phases (see Variable Substitution below)
3. **Generate N role responses** — write what each role would say
   - Each response MUST include at least one critique or concern
   - Each response MUST end with BLOCK, CONCERN, CONSENT, or QUESTION
4. **Resolve BLOCKs internally** — agents debate and resolve among themselves. If a BLOCK cannot be resolved without user input, convert it to a QUESTION and proceed with a documented assumption.
5. **Synthesize** all responses into one phase artifact
6. **Log any QUESTIONS** for the user — collect them in a running list, do NOT pause
7. **Proceed immediately** to the next phase — no gate, no approval wait

### Review Checkpoints (Key Artifacts)

At three critical milestones, save a standalone artifact file for human review. The workshop continues running autonomously — these files let stakeholders verify direction without blocking progress.

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

### Phase Summary

| Phase | Mode | Your Task |
|-------|------|-----------|
| P1 | Roundtable | Understand problem, constraints, success criteria, anti-requirements |
| P2 | Roundtable | Extract functional/NFR requirements with MoSCoW |
| P3 | Roundtable | Propose 2-3 architectures, debate trade-offs, select one |
| P4 | Author+Reviewers | Design Author drafts architecture; reviewers challenge with BLOCK/CONSENT/CONCERN |
| P5 | Author+Reviewers | Component-level design: interfaces, state, dependencies |
| P6 | Author+Reviewers | Failure modes, recovery, observability |
| P7 | Author+Reviewers | Test pyramid, CI gates, coverage matrix |
| P8 | Roundtable | Final review, agent sign-offs (CONSENT or documented DISSENT) |
| REVIEW | Review Agents | Fresh agents critique the complete doc; surface gaps and questions |

### Variable Substitution

Replace `{{KEY}}` patterns in prompts with actual values:

- `{{PROJECT_NAME}}` → User's project name
- `{{USER_INTENT_TEXT}}` → User's original request
- `{{ASSIGNED_ROLE}}` → Current role name
- `{{P1_ARTIFACT}}` → Full synthesized P1 artifact
- `{{P1_ARTIFACT_SUMMARY}}` → 2-3 sentence summary
- `{{P2_REQUIREMENTS}}` → Full P2 requirements
- `{{P3_SELECTED_APPROACH}}` → The approach selected in P3
- `{{P4_ARCHITECTURE}}` → Full P4 architecture
- `{{P5_COMPONENTS}}` → Full P5 component design
- `{{P6_ERRORS}}` → Full P6 error handling
- `{{COMPONENT_NAME}}` → Current component being designed (P5 iterates)
- `{{FULL_DESIGN_DOC}}` → All prior artifacts concatenated

**RULE:** Never leave raw `{{VARIABLES}}` in generated prompts.

### Safety Protocol (Internal)

Every agent response must end with exactly one of:

```
BLOCK [section] — [specific reason this is a showstopper]
CONCERN [section] — [risk that should be logged but doesn't halt]
CONSENT [section] — [role name]
QUESTION [section] — [specific question only the user/customer can answer]
```

**RULES:**
- BLOCK = internal showstopper. Agents debate and resolve among themselves. If unresolvable without user input, convert to QUESTION, document the assumption made, and proceed.
- Force critique: if a role says "looks good," re-prompt internally to find at least one concern.
- Silence is NOT consent. Every reviewer must explicitly CONSENT.
- QUESTION = needs user input. Collect it, do NOT pause. Present all QUESTIONS at the end.

**P1 exception:** P1 uses only 3 roles (Product Critic, Security Engineer, QA/Testing Lead).

### Post-Workshop: Review Agents

After P8 and the final design doc is assembled, spawn a **fresh set of review agents** to critique the complete document. These are separate from the design-phase agents — they see the doc with fresh eyes.

**Review Agent Roles (pick 3-4):**
- **Architecture Reviewer** — Does the architecture hold together? Are there gaps?
- **Implementation Reviewer** — Can a developer actually build from this? What's unclear?
- **Risk Reviewer** — What could go wrong in production? What was missed? Also produces the Security Review checkpoint.
- **Product Reviewer** — Does this actually solve the user's problem?

**Review Process:**
1. Give each review agent the FULL design doc
2. Each produces: BLOCKs (showstoppers), CONCERNs (risks), QUESTIONS (for user), and an overall assessment
3. The Risk Reviewer also synthesizes all security findings from across P1-P8 into a standalone Security Review checkpoint
4. Synthesize review feedback — resolve BLOCKs among review agents if possible
5. Save the Security Review to `docs/artifacts/{slug}-security-review.md`

### Final Presentation to User

Present **ONCE** at the very end:

1. **Executive summary** (3-5 sentences)
2. **Review checkpoint file paths** — so people know where to find the standalone artifacts:
   - `docs/artifacts/{slug}-requirements.md` (user stories + requirements)
   - `docs/artifacts/{slug}-architecture-hld.md` (high-level architecture)
   - `docs/artifacts/{slug}-architecture-lld.md` (low-level component design)
   - `docs/artifacts/{slug}-error-handling.md` (failure modes + recovery)
   - `docs/artifacts/{slug}-test-strategy.md` (test pyramid + cases)
   - `docs/artifacts/{slug}-security-review.md` (threat review + mitigations)
3. **The full design doc** (collapsible/scannable sections)
4. **Review agent feedback** (what they flagged, what they liked, overall verdict)
5. **Questions for you** (all collected QUESTIONS from all phases + review agents)
6. **Action menu:**
   ```
   You can: (a) review the checkpoint files above, (b) answer the questions,
   (c) request changes to specific sections, (d) approve as-is,
   or (e) request a deeper dive on any area
   ```

**Iteration:** If the user requests changes, apply them to the affected sections and re-run the review agents on just those sections. Do NOT re-run the entire workshop.

### Output Format

After the REVIEW phase, assemble this document:

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

Save to `{{WORKSHOP_DIR}}/docs/plans/YYYY-MM-DD-[slug]-design.md`.

Then validate with:
```bash
bash {{WORKSHOP_DIR}}/scripts/check-readiness.sh docs/plans/YYYY-MM-DD-[slug]-design.md
```

## Anti-Patterns to Avoid

- ❌ Skipping phases (P1 → P4)
- ❌ "This is clear" without finding at least one ambiguity
- ❌ "Looks good to me" without any critique
- ❌ Pausing mid-workshop to ask the user a question (collect QUESTIONS, ask at the end)
- ❌ Leaving `{{VARIABLES}}` unsubstantiated in prompts
- ❌ Generating solutions in P1 (P1 is pure problem understanding)
- ❌ Presenting each phase individually to the user (synthesize everything, present once)

## Cross-Agent Notes

This protocol reads from a local workshop repo. The `WORKSHOP_DIR` is auto-detected.
If you cannot find the workshop files, ask the user to install them via:
```bash
curl -fsSL https://raw.githubusercontent.com/baljeet/agent-workshop/main/install.sh | bash
```
