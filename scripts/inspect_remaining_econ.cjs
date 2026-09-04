const fs = require('fs');
const list = JSON.parse(fs.readFileSync('src/data/faculty.json', 'utf8'));

const econ = list.filter(f => f.departmentId === 'dept-economics');
console.log('Total in dept-economics:', econ.length);
econ.forEach((f, i) => {
  console.log(`[${i+1}] ${f.name.padEnd(28)} | Desig: ${f.designation.padEnd(35)} | Qual: ${f.qualification || f.specialization || ''}`);
});
