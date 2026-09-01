@echo off
echo ==========================================
echo    Setting up GeetaDrishti (Windows)
echo ==========================================

echo [1/3] Creating Python virtual environment...
python -m venv venv

echo [2/3] Activating venv and installing Python dependencies...
call venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
python -m pip install transformers==4.49.0 sentence-transformers

echo [3/3] Installing Frontend dependencies (pnpm)...
pnpm install

echo.
echo ==========================================
echo    Setup Complete! 
echo ==========================================
echo To run the project:
echo   Terminal 1: venv\Scripts\activate ^& uvicorn main:app --reload
echo   Terminal 2: pnpm dev
echo ==========================================
pause