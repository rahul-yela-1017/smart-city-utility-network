@echo off
echo ============================================================
echo  CITYGRID AI - Starting Backend API Server
echo ============================================================
echo.
cd /d "%~dp0backend"
if not exist "venv\Scripts\python.exe" (
    echo Creating Python virtual environment...
    python -m venv venv
    echo Installing dependencies...
    venv\Scripts\pip install -r requirements.txt
)
echo Starting FastAPI backend on http://localhost:8000 ...
echo API Docs available at http://localhost:8000/docs
echo.
venv\Scripts\uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
