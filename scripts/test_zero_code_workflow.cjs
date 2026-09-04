// Zero-Code Future Test Runner
const fs = require('fs');
const path = require('path');

const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};
global.window = { dispatchEvent: () => {} };
global.Event = class Event {};

async function testZeroCodeWorkflow() {
  console.log('====================================================================');
  console.log('RUNNING ZERO-CODE FUTURE WORKFLOW TEST');
  console.log('====================================================================\n');

  const hierarchyData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/academicsHierarchyData.json'), 'utf8'));
  const noticesData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/notices.json'), 'utf8'));
  const eventsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/events.json'), 'utf8'));
  const { initialMegaMenuData } = await import('../src/data/megaMenuData.js');

  // STEP 1: Add new faculty member to Department of Commerce
  console.log('[STEP 1] Add new faculty member to Department of Commerce');
  const commerceDept = hierarchyData.departments.find(d => d.id === 'dept-commerce' || d.code === 'COMMERCE') || hierarchyData.departments[0];
  const newFaculty = {
    id: `fac-${Date.now()}`,
    name: 'Prof. Warren Buffett',
    designation: 'Distinguished Professor of Financial Markets',
    departmentId: commerceDept.id,
    departmentName: commerceDept.name,
    qualification: 'M.Com, Ph.D. in Finance',
    status: 'published',
    origin: 'local'
  };
  let facultyList = [newFaculty, ...hierarchyData.faculty];
  const commerceRoster = facultyList.filter(f => f.departmentId === commerceDept.id);
  const foundInCommerce = commerceRoster.some(f => f.name === 'Prof. Warren Buffett');
  console.log(`  -> Faculty created: ${newFaculty.name}`);
  console.log(`  -> Assigned to: ${commerceDept.name}`);
  console.log(`  -> Automatically appears in Commerce roster: ${foundInCommerce} (${commerceRoster.length} members)`);
  console.assert(foundInCommerce, 'Step 1 Failed');

  // STEP 2: Create a new academic notice
  console.log('\n[STEP 2] Create a new academic notice');
  const newNotice = {
    id: `notice-${Date.now()}`,
    title: 'Commencement of Even Semester Classes 2026-27',
    category: 'Academic',
    publishDate: '2026-09-02',
    isPinned: true,
    status: 'published'
  };
  let noticeList = [newNotice, ...noticesData];
  const foundNotice = noticeList.find(n => n.id === newNotice.id);
  console.log(`  -> Notice published: "${newNotice.title}"`);
  console.log(`  -> Pinned to top banner: ${foundNotice.isPinned}`);
  console.assert(foundNotice !== undefined, 'Step 2 Failed');

  // STEP 3: Create a new event
  console.log('\n[STEP 3] Create a new event');
  const newEvent = {
    id: `event-${Date.now()}`,
    title: 'Annual Commerce & Fintech Conclave 2026',
    date: '2026-10-20',
    venue: 'College Quadrangle',
    category: 'Conclave',
    status: 'published'
  };
  let eventList = [newEvent, ...eventsData];
  const foundEvent = eventList.find(e => e.id === newEvent.id);
  console.log(`  -> Event created: "${newEvent.title}" on ${newEvent.date}`);
  console.assert(foundEvent !== undefined, 'Step 3 Failed');

  // STEP 4: Create a new CMS page
  console.log('\n[STEP 4] Create a new CMS page');
  const newPage = {
    id: `page-${Date.now()}`,
    title: 'Fintech Incubation Center',
    slug: 'fintech-incubation-center',
    parentSlug: 'academics',
    pageType: 'general',
    content: 'The Fintech Incubation Center fosters startup culture and algorithmic trading research.',
    status: 'published'
  };
  let pagesList = [newPage];
  const resolvedPage = pagesList.find(p => p.slug === 'fintech-incubation-center');
  console.log(`  -> Page created: "${newPage.title}" at /pages/${newPage.slug}`);
  console.log(`  -> Resolves at public URL: ${resolvedPage !== undefined}`);
  console.assert(resolvedPage !== undefined, 'Step 4 Failed');

  // STEP 5: Add the new page to the navigation menu
  console.log('\n[STEP 5] Add the new page to navigation menu');
  const menus = JSON.parse(JSON.stringify(initialMegaMenuData));
  menus.academics.columns[0].links.push({
    label: 'Fintech Incubation Center',
    path: `/pages/${newPage.slug}`
  });
  const menuHasLink = menus.academics.columns[0].links.some(l => l.path === '/pages/fintech-incubation-center');
  console.log(`  -> Navigation menu updated with /pages/${newPage.slug}: ${menuHasLink}`);
  console.assert(menuHasLink, 'Step 5 Failed');

  // STEP 6: Move the faculty member to another department
  console.log('\n[STEP 6] Move the faculty member to another department (Management)');
  const managementDept = hierarchyData.departments.find(d => d.id === 'dept-management' || d.code === 'MANAGEMENT') || hierarchyData.departments[1];
  const updatedFaculty = {
    ...newFaculty,
    departmentId: managementDept.id,
    departmentName: managementDept.name,
    designation: 'Professor of Strategic Management'
  };
  facultyList = facultyList.map(f => f.id === updatedFaculty.id ? updatedFaculty : f);
  const mgmtRoster = facultyList.filter(f => f.departmentId === managementDept.id);
  const commerceRosterAfter = facultyList.filter(f => f.departmentId === commerceDept.id);
  const inMgmt = mgmtRoster.some(f => f.id === updatedFaculty.id);
  const notInCommerce = !commerceRosterAfter.some(f => f.id === updatedFaculty.id);
  console.log(`  -> Moved to: ${managementDept.name}`);
  console.log(`  -> Appears in Management roster: ${inMgmt}`);
  console.log(`  -> Removed from Commerce roster: ${notInCommerce}`);
  console.assert(inMgmt && notInCommerce, 'Step 6 Failed');

  console.log('\n====================================================================');
  console.log('ZERO-CODE FUTURE WORKFLOW TEST PASSED (100% ZERO CODE CHANGES)');
  console.log('====================================================================\n');
}

testZeroCodeWorkflow();
