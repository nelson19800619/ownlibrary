# API Tests for OwnLibrary
$baseUrl = "http://localhost:3001"
$passed = 0
$failed = 0
$token = ""

Write-Host "API Test Suite - OwnLibrary"
Write-Host "Base: $baseUrl"
Write-Host ""

# Test 1: Login
Write-Host "[1] Testing POST /auth/login..."
try {
  $body = @{email="admin@library.com"; password="admin123"} | ConvertTo-Json
  $res = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
  if ($res.StatusCode -eq 200) {
    $data = $res.Content | ConvertFrom-Json
    $token = $data.token
    Write-Host "PASS: Got token" -ForegroundColor Green
    $passed++
  } else {
    Write-Host "FAIL: Status $($res.StatusCode)" -ForegroundColor Red
    $failed++
  }
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  $failed++
}

# Test 2: Get Me
Write-Host "[2] Testing GET /auth/me..."
try {
  $headers = @{"Authorization" = "Bearer $token"}
  $res = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method GET -Headers $headers -UseBasicParsing
  if ($res.StatusCode -eq 200) {
    Write-Host "PASS: Got user profile" -ForegroundColor Green
    $passed++
  } else {
    Write-Host "FAIL: Status $($res.StatusCode)" -ForegroundColor Red
    $failed++
  }
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  $failed++
}

# Test 3: Get Books
Write-Host "[3] Testing GET /api/books..."
try {
  $headers = @{"Authorization" = "Bearer $token"}
  $res = Invoke-WebRequest -Uri "$baseUrl/api/books" -Method GET -Headers $headers -UseBasicParsing
  if ($res.StatusCode -eq 200) {
    $books = $res.Content | ConvertFrom-Json
    Write-Host "PASS: Found books" -ForegroundColor Green
    $passed++
  } else {
    Write-Host "FAIL: Status $($res.StatusCode)" -ForegroundColor Red
    $failed++
  }
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  $failed++
}

# Test 4: Get Articles
Write-Host "[4] Testing GET /api/articles..."
try {
  $headers = @{"Authorization" = "Bearer $token"}
  $res = Invoke-WebRequest -Uri "$baseUrl/api/articles" -Method GET -Headers $headers -UseBasicParsing
  if ($res.StatusCode -eq 200) {
    Write-Host "PASS: Found articles" -ForegroundColor Green
    $passed++
  } else {
    Write-Host "FAIL: Status $($res.StatusCode)" -ForegroundColor Red
    $failed++
  }
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  $failed++
}

# Test 5: Get Categories
Write-Host "[5] Testing GET /api/categories..."
try {
  $headers = @{"Authorization" = "Bearer $token"}
  $res = Invoke-WebRequest -Uri "$baseUrl/api/categories" -Method GET -Headers $headers -UseBasicParsing
  if ($res.StatusCode -eq 200) {
    Write-Host "PASS: Found categories" -ForegroundColor Green
    $passed++
  } else {
    Write-Host "FAIL: Status $($res.StatusCode)" -ForegroundColor Red
    $failed++
  }
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  $failed++
}

# Test 6: Get Loans
Write-Host "[6] Testing GET /api/loans..."
try {
  $headers = @{"Authorization" = "Bearer $token"}
  $res = Invoke-WebRequest -Uri "$baseUrl/api/loans" -Method GET -Headers $headers -UseBasicParsing
  if ($res.StatusCode -eq 200) {
    Write-Host "PASS: Found loans" -ForegroundColor Green
    $passed++
  } else {
    Write-Host "FAIL: Status $($res.StatusCode)" -ForegroundColor Red
    $failed++
  }
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  $failed++
}

# Test 7: Get Users
Write-Host "[7] Testing GET /api/users..."
try {
  $headers = @{"Authorization" = "Bearer $token"}
  $res = Invoke-WebRequest -Uri "$baseUrl/api/users" -Method GET -Headers $headers -UseBasicParsing
  if ($res.StatusCode -eq 200) {
    $users = $res.Content | ConvertFrom-Json
    Write-Host "PASS: Found $($users.Count) users" -ForegroundColor Green
    $passed++
  } else {
    Write-Host "FAIL: Status $($res.StatusCode)" -ForegroundColor Red
    $failed++
  }
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  $failed++
}

# Summary
Write-Host ""
Write-Host "RESULTS: Passed=$passed Failed=$failed Total=$($passed + $failed)"
