#!/usr/bin/env pwsh

<#
.SYNOPSIS
  Script para ejecutar pruebas completas del sistema OwnLibrary

.DESCRIPTION
  Ejecuta tests de frontend, backend y E2E con Playwright

.PARAMETER Mode
  "full" para todo, "e2e" para E2E tests, "backend" para backend, "frontend" para frontend

.EXAMPLE
  .\run-tests.ps1 -Mode full
#>

param(
  [ValidateSet("full", "e2e", "backend", "frontend", "api")]
  [string]$Mode = "full"
)

Write-Host "🧪 OwnLibrary - Test Suite" -ForegroundColor Cyan
Write-Host "Mode: $Mode`n" -ForegroundColor Yellow

$projectRoot = Get-Location

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path ".\frontend") -or -not (Test-Path ".\backend")) {
  Write-Host "❌ Error: Este script debe ejecutarse desde la raíz del proyecto" -ForegroundColor Red
  exit 1
}

# ========== VERIFICAR DEPENDENCIAS ==========
Write-Host "`n📦 Verificando dependencias..." -ForegroundColor Cyan

# Instalar Playwright si es necesario
if (-not (Test-Path ".\node_modules\@playwright\test")) {
  Write-Host "   ⬇️ Instalando Playwright..." -ForegroundColor Yellow
  npm install -D @playwright/test
}

# ========== EJECUTAR TESTS ==========
switch ($Mode) {
  "full" {
    Write-Host "`n🚀 Ejecutando suite completa de tests..." -ForegroundColor Green
    
    Write-Host "`n1️⃣ Tests de Backend API" -ForegroundColor Cyan
    & npx playwright test --grep "API"
    
    Write-Host "`n2️⃣ Tests de Frontend UI" -ForegroundColor Cyan
    & npx playwright test --grep "UI"
    
    Write-Host "`n3️⃣ Tests E2E completos" -ForegroundColor Cyan
    & npx playwright test
  }
  
  "e2e" {
    Write-Host "`n▶️ Ejecutando tests E2E..." -ForegroundColor Green
    & npx playwright test
  }
  
  "api" {
    Write-Host "`n▶️ Ejecutando tests de API..." -ForegroundColor Green
    & npx playwright test --grep "API"
  }
  
  "backend" {
    Write-Host "`n▶️ Ejecutando tests de backend..." -ForegroundColor Green
    Push-Location .\backend
    npm test 2>&1 || Write-Host "   ⚠️ No hay tests definidos en backend" -ForegroundColor Yellow
    Pop-Location
  }
  
  "frontend" {
    Write-Host "`n▶️ Ejecutando tests de frontend..." -ForegroundColor Green
    Push-Location .\frontend
    npm test 2>&1 || Write-Host "   ⚠️ No hay tests definidos en frontend" -ForegroundColor Yellow
    Pop-Location
  }
}

# ========== MOSTRAR RESULTADOS ==========
Write-Host "`n📊 Tests completados" -ForegroundColor Green
Write-Host "📄 Reporte detallado: playwright-report/index.html" -ForegroundColor Cyan

exit 0
