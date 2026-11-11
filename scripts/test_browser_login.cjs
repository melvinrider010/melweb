const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Test 1: Manual form fill and submit...');
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' });
  
  await page.fill('#admin-email', '');
  await page.fill('#admin-password', '');
  await page.fill('#admin-email', 'admin@stphilos.ac.in');
  await page.fill('#admin-password', 'SPC_Admin!946#Sec');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  console.log('URL after form submit:', page.url());

  const alert = await page.$('[role="alert"]');
  if (alert) {
    console.log('Alert text:', await alert.innerText());
  } else {
    console.log('Manual login SUCCESS -> Redirected to /admin');
  }

  await browser.close();
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
