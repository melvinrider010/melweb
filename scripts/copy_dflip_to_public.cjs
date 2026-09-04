const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../node_modules/@dearhive/dearflip-jquery-flipbook/dflip');
const destDir = path.resolve(__dirname, '../public/dflip');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`Copying DearFlip from ${srcDir} to ${destDir}...`);
copyRecursiveSync(srcDir, destDir);
console.log('DearFlip assets successfully copied to public/dflip/');
