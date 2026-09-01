# GeetaDrishti 📜

A GPU-accelerated semantic search and translation application built on a comprehensive Bhagavad Gita dataset, featuring a FastAPI Python backend and a modern React/Vite frontend.

---

## 🚀 Quick Start (Automated Setup)

Choose your operating system below to set up the entire project automatically with a single command.

### Option A: Windows (PowerShell / Command Prompt)
Double-click `setup.bat` or run it from your terminal:
setup.bat

### Option B: Linux / WSL (Ubuntu)
Open your terminal in the project directory and run:
chmod +x setup.sh
./setup.sh

---

## 🛠️ Manual Installation Guide

If you prefer to set up the environment step-by-step manually, follow the instructions below based on your system.

### Prerequisites
* Python 3.12+
* Node.js (v18+) and pnpm
* NVIDIA GPU with CUDA 12.1 (Recommended for backend tensor acceleration)

---

### 1. Backend Setup (FastAPI & PyTorch)

Navigate to the project root and set up the Python virtual environment:

**On Windows (PowerShell):**
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
python -m pip install transformers==4.49.0 sentence-transformers

**On Linux / WSL:**
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
python -m pip install transformers==4.49.0 sentence-transformers

**Run the Backend Server:**
uvicorn main:app --reload
*(The API will be live at http://localhost:8000)*

---

### 2. Frontend Setup (React / Vite)

Open a second terminal window in the project root directory:

pnpm install
pnpm dev
*(The web interface will be live at http://localhost:5173)*

---

## 📂 Project Architecture

* **Backend (main.py, database.py, models.py)**: FastAPI application managing database interactions, embeddings, and semantic query routing.
* **ML Pipelines (embed_commentaries.py, transliterate.py)**: PyTorch and transformer-based pipelines for text embedding generation and verse transliteration.
* **Frontend (src/)**: Modern reactive interface built with Vite, Tailwind CSS, and pnpm.