# Phase 9: Retrospective (Post-Implementation)

> **Protocol Extension v1.1.0** — Optional phase for learning and evolving the workshop protocol itself.

## Purpose

After the design has been implemented and tested, the workshop reconvenes to review:
- What worked well in the design process
- What was missed or underestimated
- How the design held up during implementation
- What to change in future workshops

**P9 is NOT a design phase.** It is a meta-phase that improves the protocol itself.

## When to Run P9

| Trigger | Timing |
|---------|--------|
| Implementation complete | 1-2 weeks after code freeze |
| Significant design change during implementation | As soon as deviation is discovered |
| Production incident related to design gap | Within 1 week of incident resolution |
| Quarterly protocol review | Every 3 months for teams using the protocol regularly |

## Participants

All original workshop agents plus:
- **Implementation Lead:** The engineer(s) who built from the design doc
- **Operations/On-Call** (if applicable): Did the design hold up in production?

## Retrospective Prompt Template

```markdown
WORKSHOP CHARTER (RETROSPECTIVE)
=================================
We are conducting a post-implementation retrospective for:

PROJECT: {{PROJECT_NAME}}
DESIGN DOC: {{DESIGN_DOC_LINK}}
IMPLEMENTATION PERIOD: {{START_DATE}} to {{END_DATE}}

ORIGINAL WORKSHOP AGENTS: {{AGENT_NAMES_AND_ROLES}}
IMPLEMENTATION TEAM: {{IMPLEMENTER_NAMES}}

PROTOCOL RULES:
1. We review the design doc against what was actually built.
2. We identify gaps: what was missed, underestimated, or wrong.
3. We capture learnings: what worked, what didn't, what to change.
4. We propose protocol improvements: template changes, new roles, phase adjustments.
5. No blame. Focus on systemic improvement.

PHASE 9: RETROSPECTIVE
======================
**Mode:** Roundtable (all participants)
**Objective:** Learn from implementation experience and evolve the protocol
**Prior Approved Artifacts:** P1-P8 design doc, implementation code, test results, incident logs (if any)
**Output Artifact:** P9 Retrospective Report
```

## Retrospective Structure

### Section 1: Design Fidelity Review

Compare the design doc against the implementation:

```markdown
### Design Fidelity Scorecard

| Design Section | Implemented As-Designed? | Deviation | Impact |
|----------------|-------------------------|-----------|--------|
| P4 Architecture | Yes / No / Partial | [description] | Low/Med/High |
| P5 Components | Yes / No / Partial | [description] | Low/Med/High |
| P6 Error Handling | Yes / No / Partial | [description] | Low/Med/High |
| P7 Testing Strategy | Yes / No / Partial | [description] | Low/Med/High |

### Deviation Analysis
For each deviation:
- Why did it happen? (design gap, constraint change, new information)
- Was the deviation caught by the design doc's safety nets? (BLOCK, testing, etc.)
- What would have prevented it?
```

### Section 2: Gap Analysis

What was missed in the design phases:

```markdown
### Missed Requirements
| Requirement | Discovered When | Severity | Should Have Been Caught In |
|-------------|----------------|----------|---------------------------|
| [description] | Implementation week 3 | High | P2 Requirements |

### Underestimated Complexity
| Area | Estimated Effort | Actual Effort | Root Cause |
|------|-----------------|---------------|------------|
| [component] | 3 days | 2 weeks | [why] |

### Undiscovered Edge Cases
| Scenario | Impact | Design Phase Gap |
|----------|--------|-----------------|
| [description] | [severity] | P2/P6 missed this because... |
```

### Section 3: Process Review

How the workshop itself performed:

```markdown
### Phase Effectiveness

| Phase | Time Spent | Value Delivered | Suggested Change |
|-------|------------|----------------|-----------------|
| P1 Problem | [time] | High/Med/Low | [keep/extend/shorten] |
| P2 Requirements | [time] | High/Med/Low | [keep/extend/shorten] |
| ... | | | |

### Agent Role Effectiveness
| Role | Contribution | Would Use Again? |
|------|-------------|------------------|
| Design Author | [assessment] | Yes / No / Modified |
| Security Engineer | [assessment] | Yes / No / Modified |
| ... | | |

### BLOCK / Backtrack Analysis
| Phase | BLOCKs Raised | Valid? | Time Lost | Prevention |
|-------|--------------|--------|-----------|------------|
| P4 | 2 | Yes | 20 min | Better P3 approach selection |
```

### Section 4: Protocol Improvements

Specific changes to propose for the protocol:

```markdown
### Proposed Template Changes
| Template | Change | Rationale |
|----------|--------|-----------|
| P2 Requirements | Add "device switching" edge case | Missed in todo app workshop |

### Proposed Phase Changes
| Change | Description | Version Target |
|--------|-------------|---------------|
| New phase: P3.5 | "Feasibility Spike" — 30-min prototype validation between P3 and P4 | v1.2.0 |
| Merge P6+P7 | Error handling and testing are tightly coupled, combine | v2.0.0 |

### New Role Proposals
| Role | Responsibility | When Needed |
|------|---------------|-------------|
| Accessibility Advocate | a11y requirements, screen readers | Consumer-facing apps |
| Compliance Officer | GDPR, HIPAA, SOC2 | Regulated industries |
```

### Section 5: Action Items

```markdown
### Action Items
| # | Action | Owner | Due Date | Protocol Version |
|---|--------|-------|----------|-----------------|
| 1 | Add device-switching edge case to P2 template | Protocol maintainer | +1 week | v1.1.1 |
| 2 | Update example workshop with revised P5 | Protocol maintainer | +2 weeks | v1.1.1 |
| 3 | Test new "Feasibility Spike" sub-phase | Workshop facilitator | Next workshop | v1.2.0-beta |
```

## Retrospective Output

The final P9 artifact is appended to the original design document:

```markdown
## 9. Retrospective (Post-Implementation)

### Design Fidelity: 85%
- P4-P5 implemented as designed
- P6 error handling: 2 gaps discovered (documented below)
- P7 testing: E2E tests caught auth race condition not in design

### Key Learnings
1. [Learning 1]
2. [Learning 2]
3. [Learning 3]

### Protocol Improvements Accepted
- Change X → included in protocol v1.1.1
- Change Y → deferred to v1.2.0

### Action Items
[table]
```

## Integration with Main Protocol

P9 is **optional** and **non-blocking**. The design doc is locked at P8. P9 is additive.

To include P9 in your workshop:
1. Schedule the retrospective 1-2 weeks after implementation
2. Invite original agents + implementation team
3. Run the retrospective prompt
4. Append the P9 artifact to the design doc
5. Submit protocol improvements as issues/PRs to the protocol repository

## Example Retro Notes

From the Todo App workshop (hypothetical P9):

> **Design Fidelity:** 90%
> - P4 architecture held up well
> - P5 component design missed "device switching" (EC3 from P2 was vague)
> - P7 testing strategy caught the auth race condition — good validation
>
> **Biggest Miss:** Device switching (phone → laptop) was harder than expected.
> Yjs doesn't automatically merge across browsers. Needed custom sync on login.
>
> **Process Improvement:** P2 should explicitly ask "How does this work across
> multiple devices for the same user?" Add to template.
>
> **Accepted Change:** Update P2 template to include multi-device edge case (v1.1.1)
