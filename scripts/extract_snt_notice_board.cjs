const fs = require('fs');

const html = fs.readFileSync('scripts/live_home.html', 'utf8');

const sntPos = html.indexOf('class="snt-wrapper"');
if (sntPos === -1) {
  console.log('snt-wrapper not found');
  process.exit(1);
}

const sntChunk = html.substring(sntPos, sntPos + 150000);
const endPos = sntChunk.indexOf('<!-- end snt-wrapper') !== -1 ? sntChunk.indexOf('<!-- end snt-wrapper') : sntChunk.indexOf('</div>\n</div>\n</div>');

// Let's parse panels
const panels = [];
const panelRegex = /<div class="snt-panel[^"]*"\s*data-idx="(\d+)">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;

// Alternatively regex match all snt-row
const rowRegex = /<a\s+href="([^"]+)"\s+class="snt-row">[\s\S]*?<span class="snt-day">([^<]+)<\/span><span class="snt-mon">([^<]+)<\/span>[\s\S]*?(?:<span class="snt-new">([^<]+)<\/span>)?([\s\S]*?)<\/div><\/div><\/a>/gi;

let match;
let count = 0;
const allRows = [];

// Split sntChunk by snt-panel
const rawPanels = sntChunk.split(/<div class="snt-panel/);

const tabNames = ['Notices', 'Examination', 'Events'];

for (let pIdx = 1; pIdx < rawPanels.length; pIdx++) {
  const panelHtml = rawPanels[pIdx];
  const tabName = tabNames[pIdx - 1] || `Tab ${pIdx - 1}`;
  console.log(`\n=== PANEL ${pIdx - 1}: ${tabName} ===`);

  const pRowRegex = /<a\s+href="([^"]+)"\s+class="snt-row">[\s\S]*?<span class="snt-day">([^<]+)<\/span><span class="snt-mon">([^<]+)<\/span>[\s\S]*?(?:<span class="snt-new">([^<]+)<\/span>)?([^<]+)<\/div>/gi;
  let pMatch;
  let pCount = 0;
  while ((pMatch = pRowRegex.exec(panelHtml)) !== null) {
    pCount++;
    const url = pMatch[1];
    const day = pMatch[2].trim();
    const mon = pMatch[3].trim();
    const isNew = Boolean(pMatch[4]);
    const rawTitle = pMatch[5].replace(/&amp;/g, '&').replace(/&#8211;/g, '–').replace(/&#8217;/g, "'").trim();
    console.log(`  [${day} ${mon}] ${isNew ? '[NEW] ' : ''}${rawTitle} => ${url}`);
    allRows.push({ tab: tabName, day, mon, isNew, title: rawTitle, url });
  }
  console.log(`Total rows in ${tabName}: ${pCount}`);
}

fs.writeFileSync('scripts/live_snt_notice_board.json', JSON.stringify(allRows, null, 2));
console.log(`\nSaved ${allRows.length} total live Notice Board items to scripts/live_snt_notice_board.json`);
