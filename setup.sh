#!/bin/bash
set -e

echo "=========================================="
echo "   Setting up GeetaDrishti (Linux/WSL)"
echo "=========================================="

echo "[1/3] Creating Python virtual environment..."
python3 -m venv venv

echo "[2/3] Activating venv and installing Python dependencies..."
source venv/bin/activate
python -m pip install --upgrade pip

# Install requirements (handles PyTorch and all backend dependencies cleanly)
python -m pip install -r requirements.txt

echo "[3/3] Checking and installing frontend dependencies..."
npm config delete prefix || true

# Remove accidental workspace file if it exists, so pnpm doesn't throw a packages field error
rm -f pnpm-workspace.yaml

# Force pnpm v9 because your Node.js version is 18 (latest pnpm requires Node 22)
npx --yes pnpm@9 install

echo ""
echo "=========================================="
echo "   Setup Complete!"
echo "=========================================="
echo "To run the project:"
echo "  Terminal 1: source venv/bin/activate && uvicorn main:app --reload"
echo "  Terminal 2: npx pnpm@9 dev"
echo "=========================================="