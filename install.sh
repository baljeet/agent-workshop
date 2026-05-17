#!/usr/bin/env bash
#
# Install pi-workshop CLI globally
# Usage: curl -fsSL https://raw.githubusercontent.com/baljeet/pi-workshop/main/install.sh | bash
#    OR: ./install.sh

set -euo pipefail

REPO_URL="https://github.com/baljeet/pi-multi-agent-design-workshop"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.pi-workshop}"
BIN_DIR="${BIN_DIR:-$HOME/.local/bin}"
VERSION="1.3.0"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${BLUE}ℹ${NC}  $1"; }
success() { echo -e "${GREEN}✓${NC}  $1"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $1"; }
error()   { echo -e "${RED}✗${NC}  $1"; }

header() {
    echo ""
    echo -e "${BOLD}$1${NC}"
    echo "──────────────────────────────────────────────────────"
}

# Detect shell profile
shell_profile() {
    case "$(basename "$SHELL")" in
        bash)
            if [[ -f "$HOME/.bashrc" ]]; then echo "$HOME/.bashrc"
            elif [[ -f "$HOME/.bash_profile" ]]; then echo "$HOME/.bash_profile"
            else echo "$HOME/.profile"
            fi
            ;;
        zsh)
            if [[ -f "$HOME/.zshrc" ]]; then echo "$HOME/.zshrc"
            elif [[ -f "$HOME/.zprofile" ]]; then echo "$HOME/.zprofile"
            else echo "$HOME/.profile"
            fi
            ;;
        fish)
            echo "$HOME/.config/fish/config.fish"
            ;;
        *)
            echo "$HOME/.profile"
            ;;
    esac
}

# Check if a directory is in PATH
in_path() {
    case ":${PATH}:" in
        *":$1:"*) return 0 ;;
        *) return 1 ;;
    esac
}

header "Installing pi-workshop v$VERSION"
echo ""

# Check dependencies
if ! command -v git &>/dev/null; then
    error "git is required but not installed."
    exit 1
fi

# Clone or update
if [[ -d "$INSTALL_DIR/.git" ]]; then
    info "Updating existing installation at $INSTALL_DIR"
    cd "$INSTALL_DIR"
    git pull --quiet
else
    info "Cloning to $INSTALL_DIR"
    git clone --depth 1 --quiet "$REPO_URL" "$INSTALL_DIR"
fi

# Ensure bin directory exists
mkdir -p "$BIN_DIR"

# Create symlinks
ln -sf "$INSTALL_DIR/bin/pi-workshop" "$BIN_DIR/pi-workshop"
success "Linked pi-workshop → $BIN_DIR/pi-workshop"

ln -sf "$INSTALL_DIR/bin/pi-workshop-init" "$BIN_DIR/pi-workshop-init"
success "Linked pi-workshop-init → $BIN_DIR/pi-workshop-init"

# Check PATH
if ! in_path "$BIN_DIR"; then
    warn "$BIN_DIR is not in your PATH."
    local profile
    profile=$(shell_profile)
    info "Adding to $profile..."
    
    case "$(basename "$SHELL")" in
        fish)
            echo "fish_add_path $BIN_DIR" >> "$profile"
            ;;
        *)
            echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "$profile"
            ;;
    esac
    
    success "Added $BIN_DIR to PATH in $profile"
    echo ""
    warn "Restart your terminal or run: source $profile"
fi

# Verify installation
echo ""
if command -v pi-workshop &>/dev/null; then
    success "pi-workshop is installed and ready!"
    echo ""
    echo -e "${BOLD}Quick Start:${NC}"
    echo ""
    echo "   # Initialize workshop in your project"
    echo "   cd your-project"
    echo "   pi-workshop init claude    # or: cursor, pi, generic"
    echo ""
    echo "   # Then say: 'run a workshop for building X'"
    echo ""
    echo "   # Or inspect prompts manually:"
    echo "   pi-workshop prompt p1            # render Phase 1"
    echo "   pi-workshop validate design.md   # check design doc"
    echo "   pi-workshop manifest             # dump JSON metadata"
    echo ""
else
    warn "pi-workshop installed but not found in PATH."
    echo "   Add $BIN_DIR to your PATH, then run: pi-workshop help"
fi

success "Done!"
