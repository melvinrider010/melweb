import json
import os

with open('src/data/studentSupportData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Supplementary data for any items that need extra richness
enrichments = {
    "placement-cell": {
        "tagline": "Bridging Academic Excellence & Corporate Opportunities",
        "coordinator": "Mr. Madan Shaiva (PRO & Placement Officer)",
        "contact": "+91 6364118983 | placement@stphilos.ac.in",
        "highlights": [
            "Consistent annual placement drives with Tier-1 recruiters (Infosys, Wipro, TCS, Tech Mahindra, HDFC)",
            "100 Hours Thomson Reuters Financial Markets Training & CSR Certification",
            "Pre-placement training in Soft Skills, Aptitude, Group Discussions, and Technical Interviews",
            "Active Corporate Action Plan bridging industry-academia gaps"
        ]
    },
    "student-grievance-redressal-committee": {
        "tagline": "Statutory Redressal Mechanism as per UGC Regulations 2023",
        "coordinator": "Prof. Britto Dominic Rayan (Associate Professor, Dept. of Chemistry)",
        "contact": "sgrc@stphilos.ac.in",
        "portalUrl": "https://forms.gle/S9dcqYyAAqHbEjRe7",
        "objectives": [
            "Develop a responsive, transparent, and accountable atmosphere among students",
            "Ensure a strife-free campus through promoting cordial student-faculty-peer relationships",
            "Encourage students to express grievances freely without fear of victimization",
            "Provide impartial inquiry and swift redressal for student academic and welfare concerns"
        ]
    },
    "anti-ragging": {
        "tagline": "Zero Tolerance Campus Under UGC Anti-Ragging Regulations",
        "coordinator": "Mr. Mathew C (Asst. Professor, Dept. of Social Work)",
        "contact": "antiragging@stphilos.ac.in | 1800-180-5522 (National Helpline)",
        "objectives": [
            "Total prohibition of ragging in all forms across campus and hostels",
            "Mandatory anti-ragging undertakings from all enrolled students and parents",
            "Regular flying squad patrols across campus quadrangle, canteens, and sports grounds",
            "Strict disciplinary action and legal compliance as per UGC & Supreme Court directives"
        ]
    },
    "womens-cell": {
        "tagline": "Empowering Women Scholars · Gender Sensitization · Safety & Dignity",
        "coordinator": "Women's Empowerment & Gender Sensitization Committee",
        "contact": "womenscell@stphilos.ac.in",
        "objectives": [
            "Sensitizing students on gender equality and women's rights",
            "Organizing self-defense workshops, health awareness camps, and leadership seminars",
            "Providing a safe, supportive grievance forum for female students and staff",
            "Promoting academic, entrepreneurial, and cultural excellence among women"
        ]
    },
    "student-welfare-cell": {
        "tagline": "Nurturing Holistic Student Development & Welfare",
        "coordinator": "Student Welfare Officer & Committee",
        "contact": "studentwelfare@stphilos.ac.in",
        "objectives": [
            "Facilitating government and institutional scholarships for deserving students",
            "Overseeing student council activities, clubs, and co-curricular enrichment",
            "Coordinating medical aid, health check-ups, and student insurance schemes",
            "Supporting outstation and differently-abled students with tailored campus assistance"
        ]
    },
    "counselling-centre": {
        "tagline": "Confidential Psychological Counselling & Emotional Well-being",
        "coordinator": "Professional Campus Counsellor & Mental Health Wing",
        "contact": "counselling@stphilos.ac.in",
        "objectives": [
            "One-on-one confidential counseling for stress, anxiety, and academic pressures",
            "Personal growth, emotional resilience, and mindfulness workshops",
            "Peer counseling initiatives and mental health awareness programs",
            "Career choice guidance and emotional adaptation for first-year scholars"
        ]
    },
    "human-values-professional-ethics": {
        "tagline": "Caritas et Scientia · Moral Character · Ethical Leadership",
        "coordinator": "Values & Ethics Directorate",
        "contact": "ethics@stphilos.ac.in",
        "objectives": [
            "Inculcating core human values of compassion, integrity, and social justice",
            "Mandatory professional ethics modules across all UG and PG curricula",
            "Community outreach, inter-religious harmony, and environmental stewardship",
            "Code of conduct implementation for students, faculty, and administrative staff"
        ]
    },
    "youth-red-cross-yrc": {
        "tagline": "Humanitarian Service · Disaster Relief · Health & Life Protection",
        "coordinator": "YRC Program Officer",
        "contact": "yrc@stphilos.ac.in",
        "objectives": [
            "Promoting health, hygiene, and emergency first-aid awareness",
            "Organizing mega voluntary blood donation camps in collaboration with Red Cross",
            "Disaster preparedness training, community relief drives, and rural medical camps",
            "Instilling civic responsibility and selfless humanitarian service"
        ]
    },
    "library": {
        "tagline": "50,000+ Volumes · INFLIBNET N-LIST · E-Journals · OPAC Digital Hub",
        "coordinator": "Chief Librarian & Library Advisory Committee",
        "contact": "library@stphilos.ac.in",
        "highlights": [
            "Extensive collection of 50,000+ textbooks, reference treatises, and rare manuscripts",
            "Subscribed to INFLIBNET N-LIST, DELNET, and peer-reviewed international e-journals",
            "Air-conditioned spacious reading halls, research carrels, and digital browsing section",
            "Automated circulation with barcode scanning, OPAC search kiosks, and reprographic desk"
        ]
    },
    "facilities": {
        "tagline": "State-of-the-Art Infrastructure Across 26-Acre Green Campus",
        "coordinator": "Infrastructure & Estate Management",
        "contact": "facilities@stphilos.ac.in",
        "highlights": [
            "Iconic Gothic-heritage campus buildings with smart interactive classrooms",
            "Cutting-edge science, biotechnology, computer, and language laboratories",
            "Central indoor sports stadium, full-size football turf, and synthetic athletic tracks",
            "High-speed campus fiber Wi-Fi, solar power installations, and rainwater harvesting"
        ]
    },
    "business-lab": {
        "tagline": "Live Stock Trading Feeds · Financial Modeling · Corporate Case Studies",
        "coordinator": "Dept. of Commerce & Management",
        "contact": "commerce@stphilos.ac.in",
        "highlights": [
            "Hands-on training in live stock market feeds, commodity trading, and portfolio analysis",
            "Simulation software for GST filing, Income Tax e-returns, and corporate accounting",
            "Tally ERP 9, Advanced Excel for Financial Analytics, and SPSS statistical packages",
            "Interactive boardroom simulation setup for mock corporate presentations"
        ]
    },
    "computer-science-lab": {
        "tagline": "High-End Workstations · Dedicated Gigabit Leased Line · AI & Cloud Labs",
        "coordinator": "Dept. of Computer Science & Applications (BCA / MCA)",
        "contact": "computerscience@stphilos.ac.in",
        "highlights": [
            "300+ high-performance networked desktop workstations with Dual-OS (Linux & Windows)",
            "Dedicated high-speed 1 Gbps symmetric fiber leased line with campus-wide Wi-Fi",
            "Specialized development stacks for AI/ML, Cloud Computing, Full-Stack Web, and IoT",
            "Licensed developer platforms, database servers (Oracle, MySQL, MongoDB), and IDE suites"
        ]
    },
    "girls-hostel": {
        "tagline": "Safe, Secure & Homely Residential Facility for Women Scholars",
        "coordinator": "Resident Warden & Hostel Management Committee",
        "contact": "girlshostel@stphilos.ac.in",
        "highlights": [
            "24/7 security surveillance with biometric entry and CCTV perimeter monitoring",
            "Hygienic dining hall serving balanced, nutritious multi-cuisine vegetarian and non-veg meals",
            "Solar water heaters, continuous power backup, and high-speed Wi-Fi connectivity",
            "Spacious furnished rooms, dedicated study rooms, and recreational common areas"
        ]
    },
    "boys-hostel": {
        "tagline": "Comfortable On-Campus Living with Dedicated Sports & Dining Amenities",
        "coordinator": "Resident Warden & Hostel Committee",
        "contact": "boyshostel@stphilos.ac.in",
        "highlights": [
            "Well-ventilated, furnished quad and twin sharing accommodations",
            "Nutritious mess facilities supervised by dietary and hygiene committee",
            "Direct access to campus football turf, gym, badminton courts, and library",
            "Round-the-clock security, medical first-aid on call, and study halls"
        ]
    },
    "auditorium": {
        "tagline": "Acoustically Treated 1000+ Seater Hall & Conference Complex",
        "coordinator": "Cultural Affairs & Event Management",
        "contact": "auditorium@stphilos.ac.in",
        "highlights": [
            "1,000+ seating capacity with comfortable ergonomic theatre seating",
            "State-of-the-art surround sound acoustics, high-lumen digital projectors & LED video walls",
            "Fully air-conditioned green rooms, stage lighting consoles, and backstage facilities",
            "Venue for national seminars, convocation, cultural fests, and international symposiums"
        ]
    },
    "e-journal": {
        "tagline": "Philo's Bulletin & Peer-Reviewed Academic Research Journals",
        "coordinator": "Research Publication Directorate",
        "contact": "ejournal@stphilos.ac.in",
        "highlights": [
            "Open-access digital publication hub for faculty, researchers, and student scholars",
            "Biannual peer-reviewed journal publishing multidisciplinary scholarly articles",
            "Monthly Philo's Bulletin covering institutional milestones, awards, and innovations",
            "Indexed research archives with downloadable full-text PDFs and citation metrics"
        ]
    },
    "bank-atm": {
        "tagline": "On-Campus Full-Fledged Nationalized Bank Branch & 24/7 ATM",
        "coordinator": "Campus Amenities & Banking Services Desk",
        "contact": "banking@stphilos.ac.in",
        "highlights": [
            "Full-service bank branch on campus for tuition fee payments and student accounts",
            "24/7 automated teller machine (ATM) ensuring safe on-campus cash accessibility",
            "Direct processing for scholarship disbursements, education loans, and fee challans",
            "Dedicated student counter for instant zero-balance savings account opening"
        ]
    },
    "chapel-hall-3": {
        "tagline": "Historic 1946 Chapel · Spiritual Solace & Peace in Campus Quadrangle",
        "coordinator": "Campus Ministry & Spiritual Solace Wing",
        "contact": "chapel@stphilos.ac.in",
        "highlights": [
            "Architectural centerpiece of the heritage quadrangle established in 1946",
            "Serene sanctuary open daily for prayer, meditation, and quiet contemplation",
            "Daily morning prayers and holy mass services for resident and day scholars",
            "Promoting inter-faith harmony, moral grounding, and inner tranquility"
        ]
    },
    "ranger-and-rovers": {
        "tagline": "Bharat Scouts and Guides · Leadership · Outdoor Adventure · Community Service",
        "coordinator": "Rover Scout Leader & Ranger Leader",
        "contact": "rovers.rangers@stphilos.ac.in",
        "highlights": [
            "Active affiliated units of the Bharat Scouts and Guides Karnataka",
            "Regular trekking expeditions, nature conservation camps, and survival skill training",
            "Active participation in state and national jamborees and Rashtrapati Award pathways",
            "Campus traffic coordination, blood donation drives, and community outreach"
        ]
    },
    "ncc": {
        "tagline": "National Cadet Corps · Army & Naval Wings · Unity and Discipline",
        "coordinator": "Associate NCC Officers (ANO)",
        "contact": "ncc@stphilos.ac.in",
        "highlights": [
            "Active 13 Kar Bn NCC (Army Wing) and 2 Kar Naval Unit NCC on campus",
            "Rigorous military drill, weapon handling, map reading, and firing range practice",
            "Cadets selected annually for prestigious Republic Day Parade (RDC) in New Delhi",
            "Direct career pathways and bonus marks for Defence Services (CDS, AFCAT, NDA)"
        ]
    },
    "nss": {
        "tagline": "National Service Scheme · Not Me But You · Social Transformation",
        "coordinator": "NSS Program Officers",
        "contact": "nss@stphilos.ac.in",
        "highlights": [
            "Two active NSS units comprising 200+ dedicated student volunteers",
            "Annual 7-day Special Rural Camping programs focusing on village development",
            "Swachh Bharat drives, tree plantation campaigns, and health hygiene awareness",
            "Blood donation camps, literacy missions, and national integration camps"
        ]
    },
    "indoor-stadium": {
        "tagline": "Multi-Court Indoor Sports Arena & Modern Fitness Gymnasium",
        "coordinator": "Dept. of Physical Education & Sports",
        "contact": "sports@stphilos.ac.in",
        "highlights": [
            "International standard wooden badminton courts with competition-grade LED illumination",
            "Table Tennis arena, chess boards, carrom arena, and multi-gym fitness center",
            "Training and coaching for university, state, and national sports tournaments",
            "Regular inter-collegiate tournaments and sports scholarship opportunities"
        ]
    }
}

for slug, extra in enrichments.items():
    if slug in data:
        for k, v in extra.items():
            data[slug][k] = v

with open('src/data/studentSupportData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Enriched studentSupportData.json with rich structured data successfully!")
