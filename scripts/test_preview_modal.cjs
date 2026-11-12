const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    extraHTTPHeaders: { 'ngrok-skip-browser-warning': 'true' },
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  await page.goto('https://partridge-cardstock-detoxify.ngrok-free.dev/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Click to Fill Admin Credentials")');
  await page.waitForTimeout(500);
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => window.location.pathname.startsWith('/admin'), { timeout: 10000 });
  
  await page.goto('https://partridge-cardstock-detoxify.ngrok-free.dev/admin/organogram', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Click Preview button
  await page.click('button:has-text("Preview")');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'scripts/public_admin_organogram_preview_verified.png' });
  console.log('✓ Organogram preview modal captured.');

  await browser.close();
})();
