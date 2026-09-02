const fs = require('fs');
const https = require('https');
const path = require('path');

const docsDir = path.join(__dirname, '../public/assets/documents/nirf');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const downloads = [
  { 
    url: 'https://stphilos.ac.in/wp-content/uploads/2022/03/St.-Philominas-College-Bannimantap20220218-.pdf', 
    dest: path.join(docsDir, 'St-Philomenas-College-NIRF-2022.pdf'),
    name: 'NIRF-2022.pdf'
  },
  { 
    url: 'https://stphilos.ac.in/wp-content/uploads/2021/03/St.-Philominas-College-Bannimantap20210305-1.pdf', 
    dest: path.join(docsDir, 'St-Philomenas-College-NIRF-2021.pdf'),
    name: 'NIRF-2021.pdf'
  }
];

downloads.forEach(item => {
  const file = fs.createWriteStream(item.dest);
  https.get(item.url, res => {
    if (res.statusCode === 200) {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${item.name} (${fs.statSync(item.dest).size} bytes)`);
      });
    } else {
      console.error(`Failed ${item.url} -> ${res.statusCode}`);
    }
  }).on('error', err => console.error(err.message));
});
