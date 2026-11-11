const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('response', res => {
    if (res.status() >= 400) console.log('FAILED RESPONSE:', res.status(), res.url());
  });

  await page.goto('http://localhost:5173/admin/login');
  await page.waitForTimeout(2000);
  await browser.close();
})().catch(console.error);
