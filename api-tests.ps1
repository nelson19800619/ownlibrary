#!/usr/bin/env pwsh

<#
.SYNOPSIS
  Script de pruebas completas para API de OwnLibrary

.DESCRIPTION
  Testea todos los endpoints: auth, books, articles, users, categories, loans
#>

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:3001"
$passCount = 0
$failCount = 0
$token = ""

Write-Host "🧪 OwnLibrary - API Test Suite" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl`n" -ForegroundColor Yellow

function Test-Endpoint {
  param(
    [string]$name,
    [string]$method,
    [string]$endpoint,
    [object]$body = $null,
    [string]$token = "",
    [int]$expectedStatus = 200
  )

  $uri = "$baseUrl$endpoint"
  $headers = @{
    "Content-Type" = "application/json"
  }
  
  if ($token) {
    $headers["Authorization"] = "Bearer $token"
  }

  try {
    if ($body) {
      $bodyJson = $body | ConvertTo-Json
      $response = Invoke-WebRequest -Uri $uri -Method $method -Body $bodyJson -Headers $headers -UseBasicParsing
    } else {
      $response = Invoke-WebRequest -Uri $uri -Method $method -Headers $headers -UseBasicParsing
    }

    if ($response.StatusCode -eq $expectedStatus) {
      Write-Host "✅ $name" -ForegroundColor Green
      Write-Host "   Status: $($response.StatusCode) $expectedStatus" -ForegroundColor DarkGray
      $script:passCount++
      return $response.Content | ConvertFrom-Json
    } else {
      Write-Host "❌ $name" -ForegroundColor Red
      Write-Host "   Expected: $expectedStatus, Got: $($response.StatusCode)" -ForegroundColor Red
      $script:failCount++
      return $null
    }
  } catch {
    Write-Host "❌ $name" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $script:failCount++
    return $null
  }
}

# ========== AUTENTICACIÓN ==========
Write-Host "`n🔐 AUTHENTICATION TESTS" -ForegroundColor Cyan
Write-Host "━" * 50

$loginRes = Test-Endpoint `
  -name "TC-AUTH-001: POST /auth/login" `
  -method "POST" `
  -endpoint "/auth/login" `
  -body @{email="admin@library.com"; password="admin123"} `
  -expectedStatus 200

if ($loginRes.token) {
  $token = $loginRes.token
  Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor DarkGray
}

$meRes = Test-Endpoint `
  -name "TC-AUTH-002: GET /auth/me" `
  -method "GET" `
  -endpoint "/auth/me" `
  -token $token `
  -expectedStatus 200

if ($meRes) {
  Write-Host "   User: $($meRes.email) ($($meRes.role))" -ForegroundColor DarkGray
}

# ========== LIBROS ==========
Write-Host "`n📚 BOOKS TESTS" -ForegroundColor Cyan
Write-Host "━" * 50

$booksRes = Test-Endpoint `
  -name "TC-BOOKS-001: GET /api/books" `
  -method "GET" `
  -endpoint "/api/books" `
  -token $token `
  -expectedStatus 200

if ($booksRes) {
  Write-Host "   Total books: $(($booksRes | Measure-Object).Count)" -ForegroundColor DarkGray
}

$newBook = @{
  title = "Test Book $(Get-Random)"
  author = "Test Author"
  description = "Test description"
  quantity = 3
  available = 3
}

$createBookRes = Test-Endpoint `
  -name "TC-BOOKS-002: POST /api/books (Create)" `
  -method "POST" `
  -endpoint "/api/books" `
  -body $newBook `
  -token $token `
  -expectedStatus 201

$bookId = $createBookRes.id

if ($bookId) {
  Write-Host "   Created ID: $bookId" -ForegroundColor DarkGray
  
  # Update book
  $updateBook = @{
    title = "Updated Book $(Get-Random)"
    author = "Updated Author"
    description = "Updated description"
    quantity = 5
    available = 4
  }

  Test-Endpoint `
    -name "TC-BOOKS-003: PUT /api/books/:id (Update)" `
    -method "PUT" `
    -endpoint "/api/books/$bookId" `
    -body $updateBook `
    -token $token `
    -expectedStatus 200 | Out-Null
}

# ========== ARTÍCULOS ==========
Write-Host "`n📄 ARTICLES TESTS" -ForegroundColor Cyan
Write-Host "━" * 50

$articlesRes = Test-Endpoint `
  -name "TC-ARTICLES-001: GET /api/articles" `
  -method "GET" `
  -endpoint "/api/articles" `
  -token $token `
  -expectedStatus 200

if ($articlesRes) {
  Write-Host "   Total articles: $(($articlesRes | Measure-Object).Count)" -ForegroundColor DarkGray
}

# ========== CATEGORÍAS ==========
Write-Host "`n🏷️ CATEGORIES TESTS" -ForegroundColor Cyan
Write-Host "━" * 50

$categoriesRes = Test-Endpoint `
  -name "TC-CATEGORIES-001: GET /api/categories" `
  -method "GET" `
  -endpoint "/api/categories" `
  -token $token `
  -expectedStatus 200

if ($categoriesRes) {
  Write-Host "   Total categories: $(($categoriesRes | Measure-Object).Count)" -ForegroundColor DarkGray
}

# ========== PRÉSTAMOS ==========
Write-Host "`n🔖 LOANS TESTS" -ForegroundColor Cyan
Write-Host "━" * 50

$loansRes = Test-Endpoint `
  -name "TC-LOANS-001: GET /api/loans" `
  -method "GET" `
  -endpoint "/api/loans" `
  -token $token `
  -expectedStatus 200

if ($loansRes) {
  Write-Host "   Total loans: $(($loansRes | Measure-Object).Count)" -ForegroundColor DarkGray
}

# ========== USUARIOS ==========
Write-Host "`n👥 USERS TESTS" -ForegroundColor Cyan
Write-Host "━" * 50

$usersRes = Test-Endpoint `
  -name "TC-USERS-001: GET /api/users" `
  -method "GET" `
  -endpoint "/api/users" `
  -token $token `
  -expectedStatus 200

if ($usersRes) {
  Write-Host "   Total users: $(($usersRes | Measure-Object).Count)" -ForegroundColor DarkGray
  foreach ($user in $usersRes) {
    Write-Host "   - $($user.name) ($($user.email)) - $($user.role)" -ForegroundColor DarkGray
  }
}

# ========== RESUMEN ==========
Write-Host "`n" 
Write-Host "━" * 50 -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "━" * 50
Write-Host "✅ Passed: $passCount" -ForegroundColor Green
Write-Host "❌ Failed: $failCount" -ForegroundColor Red
Write-Host "📈 Total: $($passCount + $failCount)" -ForegroundColor Cyan

if ($failCount -eq 0) {
  Write-Host "`n[SUCCESS] ALL TESTS PASSED!" -ForegroundColor Green
  exit 0
} else {
  Write-Host "`n[WARNING] SOME TESTS FAILED" -ForegroundColor Yellow
  exit 1
}
