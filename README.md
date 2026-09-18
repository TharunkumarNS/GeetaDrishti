# GeetaDrishti 📜

A GPU-accelerated semantic search and translation application built on a comprehensive Bhagavad Gita dataset, featuring a FastAPI Python backend and a modern React/Vite frontend.

---

## 🚀 Quick Start (Automated Setup)

**Windows Users:** This project requires a Linux environment for GPU acceleration. Please install and open WSL (Ubuntu) before running the setup.

Open your Linux/WSL terminal in the project directory and run:
```bash
chmod +x setup.sh
./setup.sh

```

---

## 🛠️ Manual Installation Guide

If you prefer to set up the environment step-by-step manually, follow the instructions below.

### Prerequisites

* Linux or Windows with WSL (Ubuntu) installed
* Python 3.12+
* Node.js (v18+) and npm
* NVIDIA GPU with CUDA 12.1 (Required for backend tensor acceleration)

---

### 1. Backend Setup (FastAPI & PyTorch)

Open your Linux/WSL terminal, navigate to the project root, and set up the Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

```

**Run the Backend Server:**

```bash
uvicorn main:app --reload

```

*(The API will be live at http://localhost:8000)*

---

### 2. Frontend Setup (React / Vite)

Open a **second Linux/WSL terminal window** in the project root directory:

```bash
npm install
npm run dev

```

*(The web interface will be live at http://localhost:5173)*

---

## 📂 Project Architecture

* **Backend (main.py, database.py, models.py)**: FastAPI application managing database interactions, embeddings, and semantic query routing.
* **ML Pipelines (embed_commentaries.py, transliterate.py)**: PyTorch and transformer-based pipelines for text embedding generation and verse transliteration.
* **Frontend (src/)**: Modern reactive interface built with Vite, Tailwind CSS, and npm.
