# Multi-Agent Design Workshop Protocol — Implementation Plan

> **For Claude:** If implementing, task-by-task execution recommended.

**Goal:** Package the design document and prompt templates into a usable, versioned protocol artifact with documentation, examples, and a validation checklist.

**Architecture:** Two markdown specs (protocol + templates) form the core. A README provides quick-start, an example workshop transcript demonstrates real usage, and a checklist validator helps facilitators verify design doc completeness.

**Tech Stack:** Markdown, shell (for validator script), git (for versioning).

---

## Task 1: Validate Design Documents

**Files:**
- Verify: `docs/plans/2026-05-17-multi-agent-design-workshop-protocol.md`
- Verify: `docs/plans/2026-05-17-multi-agent-design-workshop-prompts.md`

**Step 1: Verify internal consistency**
- Confirm all 8 phases defined in protocol match prompts in template library
- Confirm all role cards referenced exist in the role bank
- Confirm variable substitution table covers all `{{VARIABLES}}` in templates

**Step 2: Render a sample prompt**
- Pick any template (e.g., P1)
- Replace `{{VARIABLES}}` with dummy values
- Verify the output is a valid, self-contained prompt an agent could act on

**Step 3: Commit**
```bash
git add docs/plans/2026-05-17-multi-agent-design-workshop-protocol.md
git add docs/plans/2026-05-17-multi-agent-design-workshop-prompts.md
git commit -m "feat: multi-agent design workshop protocol design docs"
```

---

## Task 2: Write Project README

**Files:**
- Create: `README.md`

**Step 1: Draft README**
Content:
- What this is (one paragraph)
- Who it's for (facilitators running multi-agent design workshops)
- How to use (copy templates, assign roles, run 8 phases)
- File structure (protocol.md, prompts.md, examples/)
- Quick start example (inline mini walkthrough of P1-P3)

**Step 2: Review and commit**
```bash
git add README.md
git commit -m "docs: add project readme with quick-start"
```

---

## Task 3: Create Example Workshop Transcript

**Files:**
- Create: `examples/todo-app-workshop.md`

**Step 1: Pick a simple, well-known example**
- A collaborative todo app with real-time sync

**Step 2: Mock a full workshop transcript**
For each phase P1-P8:
- Facilitator prompt (abbreviated)
- Agent responses (mocked but realistic)
- Synthesized artifact
- Facilitator approval or BLOCK resolution

**Step 3: Verify the final design doc is implementable**
- Does a developer reading it know what to build?
- Are tests derivable from the testing strategy section?

**Step 4: Commit**
```bash
git add examples/todo-app-workshop.md
git commit -m "docs: add example workshop transcript for todo app"
```

---

## Task 4: Build Readiness Checklist Validator

**Files:**
- Create: `scripts/check-readiness.sh`

**Step 1: Write shell script**
The script checks a design document for required sections and signals:

```bash
#!/bin/bash
# Usage: ./scripts/check-readiness.sh path/to/design-doc.md

DOC="$1"
ERRORS=0

check_section() {
    local title="$1"
    if ! grep -q "^## $title" "$DOC"; then
        echo "MISSING: Section '$title'"
        ERRORS=$((ERRORS + 1))
    fi
}

echo "Checking design document: $DOC"
echo ""

check_section "0. Workshop Metadata"
check_section "1. Problem Statement"
check_section "2. Requirements"
check_section "3. Selected Approach"
check_section "4. System Architecture"
check_section "5. Component Design"
check_section "6. Error Handling & Edge Cases"
check_section "7. Testing & Validation Strategy"
check_section "8. Consensus Record"

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ All required sections present."
else
    echo "❌ $ERRORS missing section(s)."
    exit 1
fi
```

**Step 2: Mark executable and test**
```bash
chmod +x scripts/check-readiness.sh
./scripts/check-readiness.sh docs/plans/2026-05-17-multi-agent-design-workshop-protocol.md
```
Expected: PASS (all sections present)

**Step 3: Commit**
```bash
git add scripts/check-readiness.sh
git commit -m "feat: add design doc readiness checker script"
```

---

## Task 5: Add Facilitator Quick Reference Card

**Files:**
- Create: `FACILITATOR-CARD.md`

**Step 1: Write one-page cheat sheet**
- Phase list (1-8) with mode and duration estimate
- BLOCK / CONSENT / CONCERN definitions
- Role assignment table for quick reference
- Common facilitator mistakes (e.g., skipping synthesis step)

**Step 2: Commit**
```bash
git add FACILITATOR-CARD.md
git commit -m "docs: add facilitator quick reference card"
```

---

## Task 6: Version and Tag the Protocol

**Files:**
- Modify: Git tag

**Step 1: Tag this version**
```bash
git tag -a v1.0.0 -m "Multi-Agent Design Workshop Protocol v1.0.0"
```

**Step 2: Verify tag**
```bash
git tag -l
```
Expected: `v1.0.0`

---

## Implementation Complete

All tasks complete. The protocol is packaged and ready for cross-agent use.

**To use this protocol:**
1. Copy `docs/plans/2026-05-17-multi-agent-design-workshop-prompts.md` into your agent's context
2. Assign roles to agents (or play them yourself)
3. Start at P1 and advance only on explicit approval
4. Assemble outputs into the design doc structure from `2026-05-17-multi-agent-design-workshop-protocol.md`
5. Run `./scripts/check-readiness.sh` on the final document before implementation
