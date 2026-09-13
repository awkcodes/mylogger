#!/bin/bash
set -e

# 1. Install Bun if missing (fastest TS compiler)
if ! command -v bun &> /dev/null; then
    echo "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

# 2. Compile to standalone binary
echo "Compiling logger.ts to binary..."
bun build ./logger.ts --compile --outfile mylogger

# 3. Move to user binaries directory
echo "Installing to ~/.local/bin..."
mkdir -p ~/.local/bin
mv mylogger ~/.local/bin/mylogger

# 4. Path check
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo 'WARNING: ~/.local/bin is not in your PATH.'
    echo 'Add this to your ~/.bashrc or ~/.zshrc:'
    echo 'export PATH="$HOME/.local/bin:$PATH"'
fi

echo "Installation complete. Run by typing: mylogger"
