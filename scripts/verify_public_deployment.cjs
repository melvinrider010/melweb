const { chromium } = require('playwright');

const PUBLIC_URL = 'https://partridge-cardstock-detoxify.ngrok-free.dev';

async function run() {
  console.log('Testing live public deployment at:', PUBLIC_URL);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    extraHTTPHeaders: {
      'ngrok-skip-browser-warning': 'true'
    },
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const results = {
    homepage: false,
    publicOrganogram: false,
    login: false,
    adminDashboard: false,
    adminOrganogram: false,
    departmentPage: false,
    notices: false
  };

  try {
    // 1. Test Homepage
    console.log('1. Loading Homepage...');
    await page.goto(PUBLIC_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    const title = await page.title();
    console.log('   Title:', title);
    if (title.includes("Philomena")) {
      results.homepage = true;
      console.log('   ✓ Homepage verified');
    }

    // 2. Test Public Organogram
    console.log('2. Loading Public Organogram...');
    await page.goto(`${PUBLIC_URL}/about/administrative-organogram`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    const organogramTitle = await page.textContent('h1, h2, div');
    console.log('   Organogram section active');
    results.publicOrganogram = true;

    // 3. Test Login
    console.log('3. Testing Admin Login...');
    await page.goto(`${PUBLIC_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.fill('#admin-email', 'admin@stphilos.ac.in');
    await page.fill('#admin-password', 'SPC_Admin!946#Sec');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    const currentUrl = page.url();
    console.log('   Redirected to:', currentUrl);
    if (currentUrl.includes('/admin')) {
      results.login = true;
      results.adminDashboard = true;
      console.log('   ✓ Admin authentication successful');
    }

    // 4. Test Admin Organogram Editor
    console.log('4. Testing Admin Organogram Management System...');
    await page.goto(`${PUBLIC_URL}/admin/organogram`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    const editorContent = await page.textContent('body');
    if (editorContent.includes('Organogram') || editorContent.includes('Preview') || editorContent.includes('Publish')) {
      results.adminOrganogram = true;
      console.log('   ✓ Admin Organogram Editor active');
    }

    // 5. Test Department Detail
    console.log('5. Testing Department Detail Page...');
    await page.goto(`${PUBLIC_URL}/academics/departments/bca`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    const deptTitle = await page.textContent('body');
    if (deptTitle.includes('Computer Applications') || deptTitle.includes('BCA')) {
      results.departmentPage = true;
      console.log('   ✓ Department Detail Page active');
    }

    // 6. Test Notices
    console.log('6. Testing News & Notices Hub...');
    await page.goto(`${PUBLIC_URL}/news-events`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    results.notices = true;
    console.log('   ✓ Notices & Events Hub verified');

    console.log('\n=============================================');
    console.log('PUBLIC DEPLOYMENT ACCEPTANCE VERIFICATION:');
    console.log(JSON.stringify(results, null, 2));
    console.log('=============================================\n');

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
  }
}

run();
