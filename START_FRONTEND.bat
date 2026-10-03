@echo off
echo ============================================================
echo  CITYGRID AI - Starting Frontend Dev Server
echo ============================================================
echo.
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
)
echo Starting Vite frontend on http://localhost:5173 ...
echo.
npm run dev
pause
