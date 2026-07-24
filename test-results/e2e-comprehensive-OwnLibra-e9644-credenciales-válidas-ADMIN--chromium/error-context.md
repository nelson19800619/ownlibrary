# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-comprehensive.spec.ts >> OwnLibrary - Comprehensive E2E Tests >> TC-AUTH-001: Login con credenciales válidas (ADMIN)
- Location: tests\e2e-comprehensive.spec.ts:20:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:5173/login", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect, Browser, Page } from '@playwright/test';
  2   | 
  3   | // Extended timeout for all tests
  4   | test.setTimeout(60000);
  5   | 
  6   | test.describe('OwnLibrary - Comprehensive E2E Tests', () => {
  7   |   let page: Page;
  8   |   let authToken: string;
  9   | 
  10  |   test.beforeEach(async ({ browser }) => {
  11  |     page = await browser.newPage();
  12  |   });
  13  | 
  14  |   test.afterEach(async () => {
  15  |     await page.close();
  16  |   });
  17  | 
  18  |   // ========== AUTENTICACIÓN ==========
  19  |   
  20  |   test('TC-AUTH-001: Login con credenciales válidas (ADMIN)', async () => {
> 21  |   await page.goto('http://localhost:5173/login');
      |              ^ Error: page.goto: Target page, context or browser has been closed
  22  |     // Verificar que estamos en página de login
  23  |     await expect(page.locator('input[type="email"]')).toBeVisible();
  24  |     await expect(page.locator('input[type="password"]')).toBeVisible();
  25  |     
  26  |     // Llenar y enviar
  27  |     await page.fill('input[type="email"]', 'admin@library.com');
  28  |     await page.fill('input[type="password"]', 'admin123');
  29  |     await page.click('button:has-text("Entrar")');
  30  |     
  31  |     // Esperar a que redirija
  32  |     await page.waitForTimeout(2000);
  33  |     
  34  |     // Verificar que está autenticado (token guardado)
  35  |     const token = await page.evaluate(() => localStorage.getItem('token'));
  36  |     expect(token).toBeTruthy();
  37  |     authToken = token || '';
  38  |     
  39  |     console.log('✅ TC-AUTH-001: Login exitoso');
  40  |   });
  41  | 
  42  |   test('TC-AUTH-002: Login con credenciales inválidas (debe fallar)', async () => {
  43  |   await page.goto('http://localhost:5173/login');
  44  |     // Intentar login con credenciales incorrectas
  45  |     await page.fill('input[type="email"]', 'admin@library.com');
  46  |     await page.fill('input[type="password"]', 'wrongpassword');
  47  |     await page.click('button:has-text("Entrar")');
  48  |     
  49  |     // Debe permanecer en login o mostrar error
  50  |     await page.waitForTimeout(1000);
  51  |     const url = page.url();
  52  |     expect(url).toContain('login');
  53  |     
  54  |     console.log('✅ TC-AUTH-002: Login rechazado correctamente');
  55  |   });
  56  | 
  57  |   test('TC-AUTH-003: Logout (Salida del sitio)', async () => {
  58  |     // Login primero
  59  |     await page.goto('http://localhost:5173/login');
  60  |     await page.fill('input[type="email"]', 'admin@library.com');
  61  |     await page.fill('input[type="password"]', 'admin123');
  62  |     await page.click('button:has-text("Entrar")');
  63  |     await page.waitForTimeout(2000);
  64  |     
  65  |     // Esperar a que el layout cargue y buscar el botón de logout
  66  |     const logoutBtn = page.locator('button[title="Cerrar sesión"]');
  67  |     await logoutBtn.waitFor({ timeout: 5000 });
  68  |     await logoutBtn.click();
  69  | 
  70  |     // Esperar a que aparezca el modal de confirmación
  71  |     const confirmBtn = page.locator('button:has-text("Salir")').last();
  72  |     await confirmBtn.waitFor({ timeout: 3000 });
  73  |     await confirmBtn.click();
  74  | 
  75  |     // Esperar a que se redirija a login
  76  |     await page.waitForURL('**/login', { timeout: 5000 });
  77  |     
  78  |     // Verificar que token fue eliminado
  79  |     const token = await page.evaluate(() => localStorage.getItem('token'));
  80  |     expect(token).toBeFalsy();
  81  |     
  82  |     console.log('✅ TC-AUTH-003: Logout exitoso');
  83  |   });
  84  | 
  85  |   // ========== LIBROS - CRUD ==========
  86  | 
  87  |   test('TC-BOOKS-001: Navegar a página de libros', async () => {
  88  |     // Login primero
  89  |     const loginRes = await page.request.post('http://localhost:3001/auth/login', {
  90  |       data: {
  91  |         email: 'admin@library.com',
  92  |         password: 'admin123'
  93  |       }
  94  |     });
  95  |     const { token } = await loginRes.json();
  96  |     
  97  |     // Ir a libros
  98  |     await page.goto('http://localhost:5173/books', {
  99  |       waitUntil: 'networkidle'
  100 |     });
  101 |     
  102 |     // Esperar a que cargue la tabla
  103 |     await page.waitForSelector('table', { timeout: 5000 }).catch(() => {
  104 |       // Si no hay tabla, es ok
  105 |     });
  106 |     
  107 |     console.log('✅ TC-BOOKS-001: Página de libros cargada');
  108 |   });
  109 | 
  110 |   test('TC-BOOKS-002: CREAR nuevo libro', async () => {
  111 |     // Setup: obtener token
  112 |     const loginRes = await page.request.post('http://localhost:3001/auth/login', {
  113 |       data: {
  114 |         email: 'admin@library.com',
  115 |         password: 'admin123'
  116 |       }
  117 |     });
  118 |     const { token } = await loginRes.json();
  119 |     
  120 |     // Crear libro vía API
  121 |     const createRes = await page.request.post('http://localhost:3001/api/books', {
```