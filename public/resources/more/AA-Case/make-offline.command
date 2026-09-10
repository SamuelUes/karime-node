#!/bin/bash
cd "$(dirname "$0")"

if ! command -v node &> /dev/null; then
    echo ""
    echo "========================================"
    echo "  Node.js is not installed!"
    echo "========================================"
    echo ""
    echo "To use this script, please install Node.js:"
    echo ""
    echo "  Mac:   brew install node"
    echo "         Or download from https://nodejs.org"
    echo ""
    echo "  Linux: sudo apt install nodejs  (Ubuntu/Debian)"
    echo "         sudo yum install nodejs  (RHEL/CentOS)"
    echo ""
    echo "========================================"
    echo ""
    read -p "Press Enter to close..."
    exit 1
fi

node make-offline.js
if [ $? -ne 0 ]; then
    echo ""
    read -p "Press Enter to close..."
    exit 1
fi

echo ""
read -p "Remove offline conversion scripts? (y/n): " CLEANUP
if [ "$CLEANUP" = "y" ] || [ "$CLEANUP" = "Y" ]; then
    rm -f "make-offline.js" "make-offline.bat" "README.txt"
    echo "[OK] Cleanup complete."
    rm -f "$0"
fi
echo ""
read -p "Press Enter to close..."
