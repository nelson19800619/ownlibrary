const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });

  // Login page
  await p.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await p.screenshot({ path: 'screenshot-login.png' });

  // Dashboard
  await p.fill('input[type=email]', 'admin@library.com');
  await p.fill('input[type=password]', 'admin123');
  await p.click('button:has-text("Entrar")');
  await p.waitForTimeout(3000);
  await p.screenshot({ path: 'screenshot-dashboard.png' });

  // Books
  await p.goto('http://localhost:5173/books', { waitUntil: 'networkidle' });
  await p.screenshot({ path: 'screenshot-books.png' });

  await b.close();
  console.log('Screenshots taken successfully');
})();
