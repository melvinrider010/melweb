const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('request', req => {
    if (req.url().includes('/api/')) console.log('API REQUEST:', req.method(), req.url());
  });
  page.on('response', res => {
    if (res.url().includes('/api/')) console.log('API RESPONSE:', res.status(), res.url());
  });

  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'domcontentloaded' });
  await page.fill('#admin-email', 'admin@stphilos.ac.in');
  await page.fill('#admin-password', 'SPC_Admin!946#Sec');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin');

  console.log('Navigating to header-footer...');
  await page.goto('http://localhost:5173/admin/header-footer', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const input = page.locator('input[placeholder*="Admissions Open"]').first();
  await input.fill('TEST ANNOUNCEMENT LIVE 123');

  console.log('Clicking Save Changes...');
  const saveBtn = page.locator('button:has-text("Save Changes")').first();
  await saveBtn.click();
  await page.waitForTimeout(2000);

  await browser.close();
})().catch(console.error);
