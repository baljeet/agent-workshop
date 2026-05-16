#!/bin/bash
# Design Document Readiness Checker
# Usage: ./scripts/check-readiness.sh path/to/design-doc.md

set -e

DOC="${1:-}"
ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

usage() {
    echo "Usage: $0 path/to/design-doc.md"
    exit 1
}

if [ -z "$DOC" ]; then
    usage
fi

if [ ! -f "$DOC" ]; then
    echo -e "${RED}ERROR: File not found: $DOC${NC}"
    exit 1
fi

echo "========================================"
echo "  Design Document Readiness Check"
echo "  $DOC"
echo "========================================"
echo ""

# Check 1: Required sections exist
echo "Checking required sections..."

required_sections=(
    "0. Workshop Metadata"
    "1. Problem Statement"
    "2. Requirements"
    "3. Selected Approach"
    "4. System Architecture"
    "5. Component Design"
    "6. Error Handling"
    "7. Testing"
    "8. Consensus"
)

for section in "${required_sections[@]}"; do
    if grep -q "^## $section" "$DOC" || grep -q "^## ${section%% *}" "$DOC"; then
        echo -e "  ${GREEN}✓${NC} Section found: $section"
    else
        echo -e "  ${RED}✗${NC} MISSING section: $section"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Check 2: Has requirements table or list
echo "Checking requirements documentation..."
if grep -qE "^\| *R[0-9]+ *\||^\* +R[0-9]+" "$DOC"; then
    echo -e "  ${GREEN}✓${NC} Functional requirements identified (R*)"
else
    echo -e "  ${YELLOW}⚠${NC} No functional requirements (R*) found"
    WARNINGS=$((WARNINGS + 1))
fi

if grep -qE "^\| *NFR[0-9]+ *\||^\* +NFR[0-9]+" "$DOC"; then
    echo -e "  ${GREEN}✓${NC} Non-functional requirements identified (NFR*)"
else
    echo -e "  ${YELLOW}⚠${NC} No non-functional requirements (NFR*) found"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check 3: Has test strategy
echo "Checking test strategy..."
if grep -qi "test pyramid\|unit test\|integration test\|e2e\|coverage" "$DOC"; then
    echo -e "  ${GREEN}✓${NC} Testing strategy referenced"
else
    echo -e "  ${YELLOW}⚠${NC} No testing strategy found"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check 4: Has consensus record
echo "Checking consensus record..."
if grep -qi "consent\|dissent\|sign-off" "$DOC"; then
    echo -e "  ${GREEN}✓${NC} Consensus mechanism referenced"
else
    echo -e "  ${YELLOW}⚠${NC} No consensus record found"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check 5: Has anti-requirements or out-of-scope
echo "Checking scope boundaries..."
if grep -qi "anti-requirement\|out of scope\|not building\|won't" "$DOC"; then
    echo -e "  ${GREEN}✓${NC} Anti-requirements / out-of-scope documented"
else
    echo -e "  ${YELLOW}⚠${NC} No anti-requirements found — scope may creep"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check 6: Document length (heuristic)
echo "Checking document completeness..."
LINE_COUNT=$(wc -l < "$DOC")
if [ "$LINE_COUNT" -lt 100 ]; then
    echo -e "  ${YELLOW}⚠${NC} Document seems short ($LINE_COUNT lines). Is it complete?"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "  ${GREEN}✓${NC} Document length: $LINE_COUNT lines"
fi

echo ""
echo "========================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
    echo "Design document is ready for implementation."
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  PASSED WITH WARNINGS${NC}"
    echo "Warnings: $WARNINGS (non-blocking, but review recommended)"
    exit 0
else
    echo -e "${RED}❌ CHECK FAILED${NC}"
    echo "Errors: $ERRORS | Warnings: $WARNINGS"
    echo "Fix errors before implementation."
    exit 1
fi
