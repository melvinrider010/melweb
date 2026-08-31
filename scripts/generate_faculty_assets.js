const fs = require('fs');
const path = require('path');

const facultyImages = [
  // Economics
  { dept: 'economics', name: 'praveen-saldanha', initials: 'PS', color: '#1C5496', nameText: 'Dr. Praveen Saldanha' },
  { dept: 'economics', name: 'sowmyashree-m', initials: 'SM', color: '#0F766E', nameText: 'Mrs. Sowmyashree M' },
  { dept: 'economics', name: 'dr-nandeesha-hk', initials: 'NH', color: '#7C2D12', nameText: 'Dr. Nandeesha H K' },
  { dept: 'economics', name: 'dr-ashwini-kj', initials: 'AK', color: '#831843', nameText: 'Dr. Ashwini K J' },
  { dept: 'economics', name: 'namitha-jois', initials: 'NJ', color: '#1E3A8A', nameText: 'Ms. Namitha Jois K S' },
  { dept: 'economics', name: 'francis-xavier', initials: 'FX', color: '#064E3B', nameText: 'Dr. Francis Xavier' },

  // Computer Science & Applications
  { dept: 'computer-science', name: 'gloriya-priyadarshini', initials: 'GP', color: '#1E40AF', nameText: 'Mrs. E Gloriya Priyadarshini' },
  { dept: 'computer-science', name: 'syeda-masarath', initials: 'SM', color: '#047857', nameText: 'Mrs. Syeda Masarath' },
  { dept: 'computer-science', name: 'archana-a', initials: 'AA', color: '#6D28D9', nameText: 'Ms. Archana A' },
  { dept: 'computer-science', name: 'sandra-agnes', initials: 'SA', color: '#B91C1C', nameText: 'Ms. J. Sandra Agnes' },
  { dept: 'computer-science', name: 'lydia-anjali', initials: 'LA', color: '#4338CA', nameText: 'Ms. Lydia Anjali A' },
  { dept: 'computer-science', name: 'harshitha-m', initials: 'HM', color: '#0E7490', nameText: 'Ms. Harshitha M' },
  { dept: 'computer-science', name: 'ajay-anthony', initials: 'AA', color: '#1D4ED8', nameText: 'Mr. Ajay Anthony G' },
  { dept: 'computer-science', name: 'priyanka-mk', initials: 'PM', color: '#BE185D', nameText: 'Ms. Priyanka MK' },
  { dept: 'computer-science', name: 'lenard-p', initials: 'LP', color: '#374151', nameText: 'Mr. Lenard P' },
  { dept: 'computer-science', name: 'judith', initials: 'JU', color: '#7E22CE', nameText: 'Ms. Judith' },
  { dept: 'computer-science', name: 'ayesha-siddiqa', initials: 'AS', color: '#059669', nameText: 'Ms. Ayesha Siddiqa' },
  { dept: 'computer-science', name: 'prakruthi-v', initials: 'PV', color: '#C026D3', nameText: 'Ms. Prakruthi V' },
  { dept: 'computer-science', name: 'kusuma-mv', initials: 'KM', color: '#9333EA', nameText: 'Ms. Kusuma MV' },
  { dept: 'computer-science', name: 'anarghya-theoder', initials: 'AT', color: '#2563EB', nameText: 'Mr. Anarghya Theoder' },
  { dept: 'computer-science', name: 'hanock-a', initials: 'HA', color: '#475569', nameText: 'Mr. Hanock A' },
  { dept: 'computer-science', name: 'hencieta-fernandes', initials: 'HF', color: '#D97706', nameText: 'Ms. Hencieta Fernandes' },
  { dept: 'computer-science', name: 'amrutha-nair', initials: 'AN', color: '#0284C7', nameText: 'Ms. Amrutha Nair' },
  { dept: 'computer-science', name: 'sunil-dsouza', initials: 'SD', color: '#1E3A8A', nameText: "Prof. Sunil D'Souza" },

  // Business Administration
  { dept: 'business-administration', name: 'chandan-nandihal', initials: 'CN', color: '#1C5496', nameText: 'Mr. Chandan Nandihal S' },
  { dept: 'business-administration', name: 'dr-deepa-v', initials: 'DV', color: '#831843', nameText: 'Dr. Deepa V' },
  { dept: 'business-administration', name: 'arshiya-khanum', initials: 'AK', color: '#047857', nameText: 'Ms. Arshiya Khanum' },
  { dept: 'business-administration', name: 'priyanka-olivera', initials: 'PO', color: '#6D28D9', nameText: 'Ms. Priyanka Olivera' },
  { dept: 'business-administration', name: 'sanjay-dsouza', initials: 'SD', color: '#1E3A8A', nameText: "Prof. Sanjay D'Souza" },
  { dept: 'business-administration', name: 'bs-joseph', initials: 'BJ', color: '#0F766E', nameText: 'Mr. B.S. Joseph' },
  { dept: 'business-administration', name: 'reena-dsouza', initials: 'RD', color: '#B91C1C', nameText: "Ms. Reena D'Souza" },

  // Commerce
  { dept: 'commerce', name: 'ronald-prakash-cutinha', initials: 'RC', color: '#1C5496', nameText: 'Prof. Ronald Prakash Cutinha' },
  { dept: 'commerce', name: 'dr-bp-revanasiddappa', initials: 'BR', color: '#065F46', nameText: 'Dr. B.P. Revanasiddappa' },
  { dept: 'commerce', name: 'maria-priya', initials: 'MP', color: '#BE185D', nameText: 'Mrs. Maria Priya' },
  { dept: 'commerce', name: 'stephen-anthony', initials: 'SA', color: '#1E40AF', nameText: 'Mr. Stephen Anthony' },
  { dept: 'commerce', name: 'shilpa-r', initials: 'SR', color: '#7E22CE', nameText: 'Ms. Shilpa R' },
  { dept: 'commerce', name: 'karthik-m', initials: 'KM', color: '#047857', nameText: 'Mr. Karthik M' },
  { dept: 'commerce', name: 'anthony-rose', initials: 'AR', color: '#7C2D12', nameText: 'Dr. Anthony Rose' },

  // Social Work
  { dept: 'social-work', name: 'mary-joseph', initials: 'MJ', color: '#1E3A8A', nameText: 'Prof. Mary Joseph' },
  { dept: 'social-work', name: 'matthew-c', initials: 'MC', color: '#1C5496', nameText: 'Mr. Matthew C' },
  { dept: 'social-work', name: 'dr-noor-mubasheer', initials: 'NM', color: '#047857', nameText: 'Dr. Noor Mubasheer C A' },
  { dept: 'social-work', name: 'p-nandana', initials: 'PN', color: '#BE185D', nameText: 'Ms. P Nandana' },
  { dept: 'social-work', name: 'dr-robin-kj', initials: 'RK', color: '#7C2D12', nameText: 'Dr. Robin K J' },
  { dept: 'social-work', name: 'shirley-cynthia-anthony', initials: 'SA', color: '#6D28D9', nameText: 'Mrs. Shirley Cynthia Anthony' },

  // English & Languages
  { dept: 'english', name: 'dr-ravi-saldanha', initials: 'RS', color: '#1C5496', nameText: "Dr. Ravi J.D. Saldanha" },
  { dept: 'english', name: 'suhan-poovaiah', initials: 'SP', color: '#831843', nameText: 'Ms. Suhan Poovaiah' },
  { dept: 'english', name: 'william-joseph', initials: 'WJ', color: '#1E40AF', nameText: 'Mr. William Joseph J' },
  { dept: 'english', name: 'arvind-kispotta', initials: 'AK', color: '#065F46', nameText: 'Mr. Arvind Kispotta' },
  { dept: 'english', name: 'jenifer-priya', initials: 'JP', color: '#9333EA', nameText: 'Ms. Jenifer Priya M' },
  { dept: 'english', name: 'johnson-arulraj', initials: 'JA', color: '#B91C1C', nameText: 'Mr. Johnson Arulraj' },
  { dept: 'english', name: 'roopa-selveria', initials: 'RS', color: '#0F766E', nameText: 'Ms. Roopa Selveria J' },
  { dept: 'english', name: 'mahesh-nayak', initials: 'MN', color: '#4338CA', nameText: 'Mr. Mahesh Nayak M' },
  { dept: 'english', name: 'danila-jessic', initials: 'DJ', color: '#BE185D', nameText: 'Ms. Danila Jessic O' },

  // Physics
  { dept: 'physics', name: 'thomas-va', initials: 'TV', color: '#1C5496', nameText: 'Prof. Thomas V.A.' },
  { dept: 'physics', name: 'dr-bs-prathibha', initials: 'BP', color: '#831843', nameText: 'Dr. B.S. Prathibha' },
  { dept: 'physics', name: 'dr-ravikumar-m', initials: 'RM', color: '#0F766E', nameText: 'Dr. Ravikumar M' },
  { dept: 'physics', name: 'janet-dsouza', initials: 'JD', color: '#6D28D9', nameText: "Mrs. Janet D'Souza" },
  { dept: 'physics', name: 'david-raj', initials: 'DR', color: '#1E40AF', nameText: 'Mr. David Raj' },

  // Chemistry
  { dept: 'chemistry', name: 'dr-alphonse-p', initials: 'AP', color: '#1C5496', nameText: 'Dr. Alphonse P' },
  { dept: 'chemistry', name: 'dr-ns-lingaraju', initials: 'NL', color: '#047857', nameText: 'Dr. N.S. Lingaraju' },
  { dept: 'chemistry', name: 'dr-ks-manjula', initials: 'KM', color: '#BE185D', nameText: 'Dr. K.S. Manjula' },
  { dept: 'chemistry', name: 'elizabeth-margaret', initials: 'EM', color: '#7E22CE', nameText: 'Mrs. Elizabeth Margaret' },
  { dept: 'chemistry', name: 'dr-vinay-kumar', initials: 'VK', color: '#B91C1C', nameText: 'Dr. Vinay Kumar' },

  // Mathematics
  { dept: 'mathematics', name: 'dr-suresh-kumar-n', initials: 'SK', color: '#1C5496', nameText: 'Dr. Suresh Kumar N' },
  { dept: 'mathematics', name: 'philomena-dsouza', initials: 'PD', color: '#831843', nameText: "Mrs. Philomena D'Souza" },
  { dept: 'mathematics', name: 'lokesh-b', initials: 'LB', color: '#0F766E', nameText: 'Mr. Lokesh B' },
  { dept: 'mathematics', name: 'divya-bharathi', initials: 'DB', color: '#6D28D9', nameText: 'Ms. Divya Bharathi' },

  // Biotech & Biochemistry
  { dept: 'biotech', name: 'poornima-m', initials: 'PM', color: '#047857', nameText: 'Prof. Poornima M' },
  { dept: 'biotech', name: 'dr-shailaja-m', initials: 'SM', color: '#831843', nameText: 'Dr. Shailaja M' },
  { dept: 'biotech', name: 'dr-kiran-kumar', initials: 'KK', color: '#1E40AF', nameText: 'Dr. Kiran Kumar' },
  { dept: 'biotech', name: 'archana-mohan', initials: 'AM', color: '#BE185D', nameText: 'Ms. Archana Mohan' },

  // Journalism
  { dept: 'journalism', name: 'dr-kavitha-nair', initials: 'KN', color: '#1C5496', nameText: 'Dr. Kavitha S. Nair' },
  { dept: 'journalism', name: 'pradeep-kumar', initials: 'PK', color: '#0F766E', nameText: 'Mr. Pradeep Kumar' },
  { dept: 'journalism', name: 'sneha-george', initials: 'SG', color: '#6D28D9', nameText: 'Ms. Sneha George' },

  // Psychology
  { dept: 'psychology', name: 'dr-ramesh-chandra', initials: 'RC', color: '#1C5496', nameText: 'Dr. Ramesh Chandra' },
  { dept: 'psychology', name: 'anitha-verghese', initials: 'AV', color: '#831843', nameText: 'Ms. Anitha Verghese' },
  { dept: 'psychology', name: 'rohit-paul', initials: 'RP', color: '#1E40AF', nameText: 'Mr. Rohit Paul' },

  // Criminology
  { dept: 'criminology', name: 'benedict-fernandez', initials: 'BF', color: '#1C5496', nameText: 'Prof. Benedict Fernandez' },
  { dept: 'criminology', name: 'dr-rajeshwari-s', initials: 'RS', color: '#831843', nameText: 'Dr. Rajeshwari S' },
  { dept: 'criminology', name: 'naveen-joseph', initials: 'NJ', color: '#0F766E', nameText: 'Mr. Naveen Joseph' },

  // Food Science
  { dept: 'food-science', name: 'dr-shalini-menon', initials: 'SM', color: '#047857', nameText: 'Dr. Shalini Menon' },
  { dept: 'food-science', name: 'geetha-kumari', initials: 'GK', color: '#BE185D', nameText: 'Mrs. Geetha Kumari' },
  { dept: 'food-science', name: 'varsha-r', initials: 'VR', color: '#6D28D9', nameText: 'Ms. Varsha R' },

  // Kannada & Languages
  { dept: 'kannada', name: 'rajeshwari-k', initials: 'RK', color: '#B91C1C', nameText: 'Prof. Rajeshwari K' },
  { dept: 'kannada', name: 'dr-manjunatha-swamy', initials: 'MS', color: '#1C5496', nameText: 'Dr. Manjunatha Swamy' },
  { dept: 'kannada', name: 'fatima-begum', initials: 'FB', color: '#047857', nameText: 'Mrs. Fatima Begum' },
  { dept: 'kannada', name: 'jean-pierre', initials: 'JP', color: '#4338CA', nameText: 'Mr. Jean Pierre' },

  // Humanities (Pol Sci, Sociology, History)
  { dept: 'humanities', name: 'dr-anthony-joseph', initials: 'AJ', color: '#1C5496', nameText: 'Dr. Anthony Joseph' },
  { dept: 'humanities', name: 'dr-savitha-rani', initials: 'SR', color: '#831843', nameText: 'Dr. Savitha Rani' },
  { dept: 'humanities', name: 'chethan-kumar', initials: 'CK', color: '#0F766E', nameText: 'Mr. Chethan Kumar' },
  { dept: 'humanities', name: 'paul-mg', initials: 'PM', color: '#1E40AF', nameText: 'Prof. Paul M.G.' },
  { dept: 'humanities', name: 'dr-rekha-b', initials: 'RB', color: '#7E22CE', nameText: 'Dr. Rekha B' }
];

facultyImages.forEach(fac => {
  const dir = path.join('public', 'assets', 'faculty', fac.dept);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="grad-${fac.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${fac.color}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#071A33" stop-opacity="1" />
    </linearGradient>
    <radialGradient id="glow-${fac.name}" cx="50%" cy="35%" r="50%">
      <stop offset="0%" stop-color="#FFD84A" stop-opacity="0.25" />
      <stop offset="100%" stop-color="transparent" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${fac.name})" />
  <circle cx="200" cy="150" r="100" fill="url(#glow-${fac.name})" />
  
  <!-- Academic Silhouette -->
  <circle cx="200" cy="150" r="65" fill="#FFFFFF" fill-opacity="0.15" stroke="#FFD84A" stroke-width="3" stroke-opacity="0.7" />
  <path d="M 90 360 C 90 270, 150 240, 200 240 C 250 240, 310 270, 310 360 Z" fill="#FFFFFF" fill-opacity="0.12" />
  
  <!-- Initials Monogram -->
  <text x="200" y="168" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${fac.initials}</text>
  
  <!-- Tag Strip -->
  <rect x="20" y="335" width="360" height="45" rx="8" fill="#071A33" fill-opacity="0.9" stroke="#FFD84A" stroke-width="1.5" stroke-opacity="0.5" />
  <text x="200" y="363" font-family="sans-serif" font-size="13.5" font-weight="bold" fill="#FFD84A" text-anchor="middle">${fac.nameText}</text>
</svg>`;

  const svgPath = path.join('public', 'assets', 'faculty', fac.dept, `${fac.name}.svg`);
  const jpgPath = path.join('public', 'assets', 'faculty', fac.dept, `${fac.name}.jpg`);
  const pngPath = path.join('public', 'assets', 'faculty', fac.dept, `${fac.name}.png`);
  fs.writeFileSync(svgPath, svg, 'utf8');
  fs.writeFileSync(jpgPath, svg, 'utf8');
  fs.writeFileSync(pngPath, svg, 'utf8');
});

console.log(`Generated ${facultyImages.length} local faculty portrait files.`);
