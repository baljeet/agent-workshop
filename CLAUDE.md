# Multi-Agent Design Workshop — Claude Code Instructions

When the user says anything like **"run a workshop"**, **"design a workshop for X"**, **"let's do a design workshop"**, **"multi-agent design"**, or **"plan this with a workshop"**, follow this protocol.

## What to Do

1. **Read the workshop manifest** at `{{WORKSHOP_DIR}}/workshop-manifest.json`
2. **Read the protocol** at `{{WORKSHOP_DIR}}/docs/protocol.md`
3. **Read the charter** at `{{WORKSHOP_DIR}}/docs/prompts/workshop-charter.md`
4. **Read `SKILL.md`** at `{{WORKSHOP_DIR}}/SKILL.md` for the full facilitation guide
5. Execute the 8-phase workshop as described below

## 8-Phase Protocol

You are the **Facilitator** AND the **entire agent team**. Adopt multiple roles per phase.

### Roles to Use (pick 5-7 per phase)

- **Design Author** — Architecture, interfaces, data flow, component design
- **Product Critic** — User needs, scope creep, UX gaps
- **Security Engineer** — Threat surfaces, auth gaps, data exposure
- **Scalability Engineer** — Bottlenecks, resource limits, SPOFs
- **QA/Testing Lead** — Testability, observability, coverage
- **Integration Specialist** — API consistency, third-party failures
- **DevEx Advocate** — Build experience, onboarding, documentation

### Execution Flow

For each phase:

1. **Load the prompt** from the manifest's `prompt` field for that phase
2. **Substitute {{VARIABLES}}** using context from prior phases (see Variable Substitution below)
3. **Generate N role responses** — write what each role would say
   - Each response MUST include at least one critique or concern
   - Each response MUST end with BLOCK, CONCERN, or CONSENT
4. **Synthesize** all responses into one phase artifact
5. **Present to user** and ask for explicit approval: "P[N] COMPLETE. BLOCK check? Does this look right? APPROVED to proceed?"
6. **Wait for approval** — do NOT proceed to next phase until user says "approved", "yes", "looks good", etc.

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

### Safety Protocol

Every agent response must end with exactly one of:

```
BLOCK [section] — [specific reason why this is a showstopper]
CONCERN [section] — [risk that should be logged but doesn't halt]
CONSENT [section] — [role name]
```

**RULES:**
- Block = halt. Resolve before proceeding.
- Force critique: if a role says "looks good," re-prompt internally to find at least one concern.
- Silence is NOT consent. Every reviewer must explicitly CONSENT.

### Output Format

After P8, assemble this document:

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
- ❌ Proceeding to next phase without user approval
- ❌ Leaving `{{VARIABLES}}` unsubstantiated in prompts
- ❌ Generating solutions in P1 (P1 is pure problem understanding)

## Cross-Agent Notes

This protocol reads from a local workshop repo. The `WORKSHOP_DIR` is auto-detected.
If you cannot find the workshop files, ask the user to install them via:
```bash
curl -fsSL https://raw.githubusercontent.com/baljeet/pi-multi-agent-design-workshop/main/install.sh | bash
```
