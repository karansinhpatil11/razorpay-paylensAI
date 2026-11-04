Write-Host "Starting PayLens AI Services..." -ForegroundColor Cyan

# 1. AI Service (Port 8000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ai-service'; .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

# 2. Express Backend API (Port 5001)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

# 3. Vite React Frontend (Port 5173)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "All 3 services have been launched in separate windows:" -ForegroundColor Green
Write-Host "  • Frontend:   http://localhost:5173" -ForegroundColor Yellow
Write-Host "  • Backend:    http://localhost:5001" -ForegroundColor Yellow
Write-Host "  • AI Service: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host ""
