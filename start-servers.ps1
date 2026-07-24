# Start all servers for E2E testing
Write-Host "Starting Backend & Frontend Servers..." -ForegroundColor Cyan

# Start Backend (Dev Mode)
Write-Host "Starting Backend on port 3001..."
Start-Job -Name "backend" -ScriptBlock {
  cd "d:\GIT-DEVOPS\vscode\web\ownlibrary\backend"
  npm run dev
}

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend on port 5174..."
Start-Job -Name "frontend" -ScriptBlock {
  cd "d:\GIT-DEVOPS\vscode\web\ownlibrary\frontend"
  npm run dev
}

Write-Host "Waiting for servers to become ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 8

# Test connectivity
$testBackend = Test-Connection localhost -Port 3001 -TcpOnly -ErrorAction SilentlyContinue
$testFrontend = Test-Connection localhost -Port 5174 -TcpOnly -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Backend (3001): $(if ($testBackend) {'READY'} else {'NOT READY'})" -ForegroundColor $(if ($testBackend) {'Green'} else {'Red'})
Write-Host "Frontend (5174): $(if ($testFrontend) {'READY'} else {'NOT READY'})" -ForegroundColor $(if ($testFrontend) {'Green'} else {'Red'})
Write-Host ""
Write-Host "Jobs running:"
Get-Job | Select Name, State
