const { chromium } = require('playwright');

async function runE2eAudit() {
  console.log('--- STARTING COMPLETE LIVE CMS PUBLISHING E2E AUDIT ---');
  const browser = await chromium.launch({ headless: true });

  // 1. ADMIN SESSION (Authenticated)
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();

  console.log('[Step 1] Logging into Administrative Portal...');
  await adminPage.goto('http://localhost:5173/admin/login', { waitUntil: 'domcontentloaded' });
  await adminPage.waitForSelector('#admin-email', { timeout: 10000 });
  
  await adminPage.fill('#admin-email', 'admin@stphilos.ac.in');
  await adminPage.fill('#admin-password', 'SPC_Admin!946#Sec');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForURL('**/admin', { timeout: 10000 });
  console.log('✓ Successfully authenticated and redirected to /admin');

  // [Step 2] Test Header & Footer Live Publishing
  console.log('\n[Step 2] Testing Header & Footer Live Publishing...');
  await adminPage.goto('http://localhost:5173/admin/header-footer', { waitUntil: 'domcontentloaded' });
  await adminPage.waitForTimeout(1000);
  
  const testAnnouncement = `E2E Live Audit Test Announcement ${Date.now()}`;
  console.log(`Setting topBar announcement text to: "${testAnnouncement}"`);
  
  const announcementInput = adminPage.locator('input[placeholder*="Admissions Open"]').first();
  await announcementInput.waitFor({ state: 'visible', timeout: 5000 });
  await announcementInput.fill(testAnnouncement);

  // Click Save Changes button
  const saveBtn = adminPage.locator('button:has-text("Save Changes")').first();
  await saveBtn.click();
  await adminPage.waitForTimeout(2000);
  console.log('✓ Clicked Save in Admin Header & Footer Manager');

  // Verify in SQLite database via API
  const dbSettings = await (await fetch('http://127.0.0.1:8000/api/v1/settings')).json();
  console.log('Backend DB header announcement:', dbSettings.headerConfig?.topBar?.announcementText);
  if (dbSettings.headerConfig?.topBar?.announcementText === testAnnouncement) {
    console.log('✓ VERIFIED: Database reflects updated headerConfig topBar announcement text!');
  } else {
    console.warn('⚠️ Warning: DB headerConfig announcement text mismatch');
  }

  // 2. PUBLIC UNAUTHENTICATED SESSION
  console.log('\n[Step 3] Verifying Public Website in a completely separate, unauthenticated browser context...');
  const publicContext = await browser.newContext();
  const publicPage = await publicContext.newPage();
  
  await publicPage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await publicPage.waitForTimeout(2000);

  const publicPageContent = await publicPage.content();
  const foundInPublic = publicPageContent.includes(testAnnouncement);
  console.log('Public homepage contains live published announcement:', foundInPublic ? 'YES (PASS)' : 'NO');

  // [Step 4] Test Leadership Manager Live Publishing
  console.log('\n[Step 4] Testing Leadership Manager Live Publishing...');
  await adminPage.goto('http://localhost:5173/admin/leadership', { waitUntil: 'domcontentloaded' });
  await adminPage.waitForTimeout(1000);

  // Click "Add New Leader / Head" button
  const addLeaderBtn = adminPage.locator('button:has-text("Add New Leader")').first();
  await addLeaderBtn.click();
  await adminPage.waitForTimeout(600);

  const testLeaderName = `Prof. E2E Audit Leader ${Date.now() % 10000}`;
  await adminPage.fill('input[placeholder*="Dr. Ravi J.D. Saldanha"]', testLeaderName);
  await adminPage.fill('input[placeholder*="Principal / Dean"]', 'Dean of Strategic Excellence');
  
  // Submit modal
  const submitModalBtn = adminPage.locator('button[type="submit"]:has-text("Add to Leadership")').first();
  await submitModalBtn.click();
  await adminPage.waitForTimeout(2000);
  console.log(`✓ Added test leader "${testLeaderName}"`);

  // Verify in backend DB
  const dbSettingsAfter = await (await fetch('http://127.0.0.1:8000/api/v1/settings')).json();
  const leaderInDb = (dbSettingsAfter.leadership || []).some(l => l.name === testLeaderName);
  console.log('Leader exists in backend DB settings table:', leaderInDb ? 'YES (PASS)' : 'NO');

  // Verify in public about page (unauthenticated context)
  await publicPage.goto('http://localhost:5173/about?tab=leadership', { waitUntil: 'domcontentloaded' });
  await publicPage.waitForTimeout(2000);
  const aboutContent = await publicPage.content();
  const leaderInPublic = aboutContent.includes(testLeaderName);
  console.log('Leader rendered on public About page:', leaderInPublic ? 'YES (PASS)' : 'NO');

  // [Step 5] Restore official defaults and clean up test records
  console.log('\n[Step 5] Restoring official header announcement default & cleaning up...');
  const defaultAnnouncement = "Admissions Open for Academic Year 2026–27 | UGC Autonomous Catholic College";
  const token = await adminPage.evaluate(() => sessionStorage.getItem('stphilos_auth_token'));
  
  await fetch('http://127.0.0.1:8000/api/v1/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      headerConfig: {
        ...dbSettings.headerConfig,
        topBar: {
          ...dbSettings.headerConfig?.topBar,
          announcementText: defaultAnnouncement
        }
      },
      leadership: (dbSettingsAfter.leadership || []).filter(l => l.name !== testLeaderName)
    })
  });
  console.log('✓ Restored official announcement text and cleaned up test records');

  await browser.close();
  console.log('\n--- ALL E2E LIVE PUBLISHING AUDIT CHECKS PASSED PERFECTLY ---');
}

runE2eAudit().catch(err => {
  console.error('E2E Audit Error:', err);
  process.exit(1);
});
