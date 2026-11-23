#!/bin/bash
set -e

echo "making the script executable" 
chmod +x mylogger

# Move to user binaries directory
echo "Installing to ~/.local/bin..."
mkdir -p ~/.local/bin
cp mylogger ~/.local/bin/mylogger

# Path check
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo 'WARNING: ~/.local/bin is not in your PATH.'
    echo 'Add this to your ~/.bashrc or ~/.zshrc:'
    echo 'export PATH="$HOME/.local/bin:$PATH"'
fi

echo "Installation complete. Run by typing: mylogger"
