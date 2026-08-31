const fs = require('fs');
let content = fs.readFileSync('src/data/facultyData.js', 'utf8');
content = content.replace(/\.jpg'/g, ".svg'");
fs.writeFileSync('src/data/facultyData.js', content, 'utf8');
console.log('Updated faculty image paths in facultyData.js to .svg');
