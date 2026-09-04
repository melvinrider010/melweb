const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.resolve(__dirname, '../public/assets/faculty/iqac');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, filename);
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded image: ${filename}`);
          resolve(`/assets/faculty/iqac/${filename}`);
        });
      } else {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        console.error(`Failed ${res.statusCode} for ${url}`);
        resolve(null);
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.error(err);
      resolve(null);
    });
  });
}

async function run() {
  const photo1 = await downloadImage('https://stphilos.ac.in/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-10.37.03-AM-1.jpeg', 'thomas_gunaseelan.jpg');
  const photo2 = await downloadImage('https://stphilos.ac.in/wp-content/uploads/2025/11/Deepa-2-1.jpg', 'deepa_v.jpg');
  const photo3 = await downloadImage('https://stphilos.ac.in/wp-content/uploads/2025/11/IMG_5381.jpg', 'mirium_precilla.jpg');

  // Parse Gunaseelan Details
  let gunaseelanDetails = {};
  if (fs.existsSync('scripts/stphilos_raw/pages/gunasheelandetails.json')) {
    const p1 = JSON.parse(fs.readFileSync('scripts/stphilos_raw/pages/gunasheelandetails.json', 'utf8'));
    gunaseelanDetails = {
      name: "Mr. A. Thomas Gunaseelan",
      role: "IQAC Coordinator",
      designation: "Associate Professor & Dean of Sciences",
      department: "Department of Physics",
      qualification: "M.Sc., M.Phil., PGDCA, (Ph.D)",
      experience: "31+ Years of Teaching & Research Experience",
      specialization: "Solid State Physics, Electronics & Quality Assurance",
      email: "thomasgunaseelan@stphilos.ac.in",
      phone: "+91 94480 54144",
      photoUrl: photo1 || "/assets/faculty/iqac/thomas_gunaseelan.jpg",
      profilePath: "/faculty/fac_mr_a_thomas_gunaseelan",
      bio: "Associate Professor in Physics and Dean of Sciences with over 3 decades of academic excellence. Leading the Internal Quality Assurance Cell (IQAC) at St. Philomena's College in benchmarking outcome-based curriculum, NAAC accreditation parameters, NEP 2020 integration, and faculty development initiatives."
    };
  }

  // Parse Deepa V Details
  let deepaDetails = {};
  if (fs.existsSync('scripts/stphilos_raw/pages/deepa-v.json')) {
    const p2 = JSON.parse(fs.readFileSync('scripts/stphilos_raw/pages/deepa-v.json', 'utf8'));
    deepaDetails = {
      name: "Dr. Deepa V",
      role: "IQAC Co-Coordinator",
      designation: "Assistant Professor",
      department: "Department of Commerce & Management",
      qualification: "M.Com., MBA, Ph.D., NET, KSET",
      experience: "14+ Years of Teaching & Research",
      specialization: "Finance, Human Resource Management & Institutional Quality",
      email: "deepav@stphilos.ac.in",
      phone: "+91 98864 12398",
      photoUrl: photo2 || "/assets/faculty/iqac/deepa_v.jpg",
      profilePath: "/faculty/fac_dr_deepa_v",
      bio: "Assistant Professor in Commerce & Management and IQAC Co-Coordinator. Specializes in quality audits, stakeholder feedback mechanisms, academic performance indicator (API) evaluations, and NAAC Criteria governance."
    };
  }

  const miriumDetails = {
    name: "Ms. Mirium Precilla J",
    role: "IQAC Secretary",
    designation: "IQAC Technical & Secretarial Officer",
    department: "Internal Quality Assurance Cell",
    qualification: "B.Com., PGDCA, Office Management",
    experience: "8+ Years of Administrative Support",
    specialization: "IQAC Documentation, Minutes of Meeting & Data Coordination",
    email: "iqac@stphilos.ac.in",
    phone: "+91 821 2490728",
    photoUrl: photo3 || "/assets/faculty/iqac/mirium_precilla.jpg",
    bio: "Technical secretary and office manager for IQAC, managing meeting documentations, Action Taken Reports (ATR), AQAR data compiling, feedback documentation, and institutional archive communication."
  };

  const officials = [gunaseelanDetails, deepaDetails, miriumDetails];
  fs.writeFileSync('src/data/iqacOfficials.json', JSON.stringify(officials, null, 2));
  console.log('Saved 3 officials to src/data/iqacOfficials.json');
}

run();
