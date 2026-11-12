const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    extraHTTPHeaders: { 'ngrok-skip-browser-warning': 'true' },
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  console.log('Navigating to login...');
  await page.goto('https://partridge-cardstock-detoxify.ngrok-free.dev/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  // Click quick fill
  await page.click('button:has-text("Click to Fill Admin Credentials")');
  await page.waitForTimeout(500);
  
  // Click Sign In
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => window.location.pathname.startsWith('/admin'), { timeout: 10000 });
  console.log('✓ Successfully authenticated! Current URL:', page.url());
  
  // Navigate to Organogram editor
  console.log('Navigating to Admin Organogram Editor...');
  await page.goto('https://partridge-cardstock-detoxify.ngrok-free.dev/admin/organogram', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  
  const title = await page.title();
  const text = await page.textContent('body');
  console.log('✓ Page title:', title);
  console.log('✓ Editor body contains "Organogram":', text.includes('Organogram'));
  console.log('✓ Editor body contains "Publish":', text.includes('Publish'));
  console.log('✓ Editor body contains "Preview":', text.includes('Preview'));
  
  // Take screenshot for verification evidence
  await page.screenshot({ path: 'scripts/public_admin_organogram_verified.png' });
  console.log('✓ Verification screenshot captured at scripts/public_admin_organogram_verified.png');

  await browser.close();
})();
