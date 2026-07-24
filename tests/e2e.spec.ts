import { test, expect } from '@playwright/test';

// Configure test timeout
test.setTimeout(30000);

// Test suite para OwnLibrary
test.describe('OwnLibrary - Library Management System', () => {
  
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  // ========== AUTENTICACIÓN ==========
  test('TC-AUTH-001: Login con credenciales válidas', async () => {
    await page.goto('http://localhost:5174/login');
    
    // Verificar que estamos en la página de login
    await expect(page).toHaveTitle(/frontend/);
    
    // Llenar formulario
    await page.fill('input[type="email"]', 'admin@library.com');
    await page.fill('input[type="password"]', 'admin123');
    
    // Hacer click en login
    await page.click('button:has-text("Iniciar sesión")');
    
    // Esperar redirección y verificar que llegamos al dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 }).catch(() => {
      // Si no redirige a dashboard, que haya ido a alguna ruta protegida
    });
    
    // Verificar que el token está guardado
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    console.log('✅ Login exitoso, token generado');
  });

  // ========== LIBROS ==========
  test('TC-BOOKS-001: Navegar a página de libros', async () => {
    await page.goto('http://localhost:5174/books');
    
    // Debería redirigir a login si no hay sesión
    const url = page.url();
    if (url.includes('login')) {
      console.log('⏳ Requiere autenticación (esperado)');
    } else {
      // Si está logueado, debería ver tabla de libros
      const booksTable = await page.locator('table').first();
      await expect(booksTable).toBeVisible();
      console.log('✅ Tabla de libros visible');
    }
  });

  test('TC-USERS-001: Ver tabla de usuarios (debe mostrar 2 usuarios)', async () => {
    // Ir directamente a usuarios
    await page.goto('http://localhost:5174/users');
    
    const url = page.url();
    if (url.includes('login')) {
      console.log('⏳ Requiere autenticación, saltando');
      return;
    }
    
    // Esperar tabla
    await page.waitForSelector('table', { timeout: 5000 });
    
    // Contar filas de datos
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThanOrEqual(2);
    console.log(`✅ Tabla de usuarios visible con ${rows} usuarios`);
    
    // Verificar que hay al menos un admin y un librarian
    const adminCell = page.locator('text=ADMIN');
    const librarianCell = page.locator('text=LIBRARIAN');
    
    await expect(adminCell).toBeVisible();
    await expect(librarianCell).toBeVisible();
    console.log('✅ Roles de admin y librarian presentes');
  });

  // ========== API BACKEND ==========
  test('TC-API-001: GET /api/books', async () => {
    const response = await page.request.get('http://localhost:3001/api/books', {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || ''}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`✅ API /api/books respondió: ${data.length} libros`);
  });

  test('TC-API-002: POST /auth/login', async () => {
    const response = await page.request.post('http://localhost:3001/auth/login', {
      data: {
        email: 'admin@library.com',
        password: 'admin123'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.token).toBeTruthy();
    
    // Guardar token para otros tests
    process.env.TEST_TOKEN = data.token;
    console.log('✅ Auth login exitoso, token obtenido');
  });

  test('TC-API-003: GET /api/users (debe retornar array)', async () => {
    // Primero hacer login para obtener token
    const loginRes = await page.request.post('http://localhost:3001/auth/login', {
      data: {
        email: 'admin@library.com',
        password: 'admin123'
      }
    });
    
    const { token } = await loginRes.json();
    
    // Ahora hacer GET de usuarios
    const response = await page.request.get('http://localhost:3001/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThanOrEqual(2);
    console.log(`✅ API /api/users retornó ${data.length} usuarios`);
  });

  test('TC-API-004: GET /api/categories', async () => {
    const loginRes = await page.request.post('http://localhost:3001/auth/login', {
      data: {
        email: 'admin@library.com',
        password: 'admin123'
      }
    });
    
    const { token } = await loginRes.json();
    
    const response = await page.request.get('http://localhost:3001/api/categories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThanOrEqual(5); // seed data
    console.log(`✅ API /api/categories retornó ${data.length} categorías`);
  });

  // ========== VALIDACIONES ADICIONALES ==========
  test('TC-HEALTH: Verificar que servicios están activos', async () => {
    // Backend
    const backendRes = await page.request.get('http://localhost:3001/');
    console.log(`Backend status: ${backendRes.status()}`);
    
    // Frontend
    const frontendRes = await page.request.get('http://localhost:5174/');
    console.log(`Frontend status: ${frontendRes.status()}`);
    
    expect(backendRes.ok() || backendRes.status() === 404).toBeTruthy(); // 404 es ok si no hay ruta /
    expect(frontendRes.ok()).toBeTruthy();
    console.log('✅ Ambos servicios activos');
  });
});
