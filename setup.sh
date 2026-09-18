#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Trap any error and print a failure message
trap 'echo -e "\n❌ Setup failed on line $LINENO. Please check the errors above." >&2; exit 1' ERR

echo "=========================================="
echo "   Setting up GeetaDrishti (Linux/WSL)"
echo "=========================================="

echo "[1/3] Creating Python virtual environment..."
python3 -m venv venv

echo "[2/3] Activating venv and installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "[3/3] Installing frontend dependencies..."
npm install

# Clear the error trap since we made it to the end successfully
trap - ERR

echo ""
echo "=========================================="
echo " ✅ Setup Complete!"
echo "=========================================="
echo "To run the project:"
echo "  Terminal 1: source venv/bin/activate && uvicorn main:app --reload"
echo "  Terminal 2: npm run dev"
echo "=========================================="