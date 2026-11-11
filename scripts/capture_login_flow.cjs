const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'scripts/login_page_verified.png' });
  console.log('Saved screenshot to scripts/login_page_verified.png');

  // Click Google SSO button
  const ssoBtn = await page.getByRole('button', { name: /Institutional Google Workspace SSO/i });
  await ssoBtn.click();
  await page.waitForTimeout(2000);
  
  console.log('After SSO URL:', page.url());
  await page.screenshot({ path: 'scripts/admin_dashboard_verified.png' });
  console.log('Saved dashboard screenshot to scripts/admin_dashboard_verified.png');

  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
