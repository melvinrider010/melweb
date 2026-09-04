const http = require('http');

function fetchModule(urlPath) {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:5173' + urlPath, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path: urlPath, status: res.statusCode, length: data.length, body: data.slice(0, 300) });
      });
    }).on('error', (err) => {
      resolve({ path: urlPath, status: 'ERROR', error: err.message });
    });
  });
}

async function testImports() {
  const modules = [
    '/',
    '/src/main.jsx',
    '/src/App.jsx',
    '/src/pages/HomePage.jsx',
    '/src/lib/cmsStore.js',
    '/src/lib/api.js',
    '/src/context/FlipbookContext.jsx',
    '/src/components/common/Header.jsx',
    '/src/components/common/Layout.jsx',
    '/src/components/common/AnnouncementTicker.jsx',
    '/src/components/home/HeroSlider.jsx',
    '/src/components/home/NoticesHubSection.jsx',
    '/src/components/home/CourseHoneycombSection.jsx',
    '/src/components/home/CampusBlocksSection.jsx',
    '/src/components/home/ManagementSection.jsx',
    '/src/components/home/GallerySection.jsx',
    '/src/data/academicsHierarchyData.js',
    '/src/data/megaMenuData.js',
    '/src/admin/pages/AdminDashboardPage.jsx',
    '/src/admin/pages/AdminFacultyManagerPage.jsx',
    '/src/admin/pages/AdminDepartmentManagerPage.jsx',
    '/src/admin/pages/AdminProgrammeManagerPage.jsx',
    '/src/admin/pages/AdminPagesManagerPage.jsx',
    '/src/admin/pages/AdminNoticesManagerPage.jsx',
    '/src/admin/pages/AdminMenuManagerPage.jsx',
    '/src/pages/DynamicCmsPage.jsx'
  ];

  console.log('--- TESTING VITE DEV SERVER MODULES ---');
  let hasError = false;
  for (const mod of modules) {
    const res = await fetchModule(mod);
    console.log(`[HTTP ${res.status}] ${res.path} (${res.length || 0} bytes)`);
    if (res.status === 500 || res.status === 404 || res.status === 'ERROR') {
      console.error('ERROR RESPONSE:', res.body || res.error);
      hasError = true;
    }
  }

  if (!hasError) {
    console.log('\n--> ALL VITE MODULES COMPILED AND SERVED WITH HTTP 200 OK!');
  } else {
    console.error('\n--> ERRORS DETECTED!');
  }
}

testImports();
