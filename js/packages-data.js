/** Global Success — package and add-on data with topic images */

function plainLabel(text) {
  if (typeof fixAmpersandText === 'function') return fixAmpersandText(text);
  return String(text)
    .replace(/&amp;/gi, ' and ')
    .replace(/\s*&\s*/g, ' and ');
}

const IMG = {
  driving: 'assets/images/packages/driving.jpg',
  naati: 'assets/images/packages/naati.jpg',
  jobs: 'assets/images/packages/jobs.jpg',
  renting: 'assets/images/packages/renting.jpg',
  hospitality: 'assets/images/packages/hospitality.jpg',
  cleaning: 'assets/images/packages/cleaning.jpg',
  ndis: 'assets/images/packages/ndis.jpg',
  tfn: 'assets/images/packages/tfn.jpg',
  food: 'assets/images/packages/food.jpg',
  safety: 'assets/images/packages/safety.jpg',
  bank: 'assets/images/packages/bank.jpg',
  linkedin: 'assets/images/packages/linkedin.jpg',
  resume: 'assets/images/packages/resume.jpg',
  transport: 'assets/images/packages/transport.jpg',
  coaching: 'assets/images/packages/coaching.jpg',
  airport: 'assets/images/packages/airport.jpg',
  heroStudents: 'assets/images/heroes/students-australia.jpg',
  heroSydney: 'assets/images/heroes/sydney-opera.jpg'
};

const PACKAGES = [
  {
    slug: 'learner-permit-quiz',
    name: 'Driving Class and Learner Licence Prep',
    phase: 'before',
    popular: false,
    desc: 'Learn Australian road rules and prepare for your learner licence theory test before or after arrival.',
    features: ['Driving class guidance', 'Road rules explained', 'Unlimited practice quizzes', 'Learner permit checklist'],
    image: IMG.driving,
    australia: IMG.driving
  },
  {
    slug: 'naati-ccl-prep',
    name: 'NAATI CCL Prep',
    phase: 'before',
    popular: false,
    desc: 'Visa points and interpreter pathway using Nepali language skills.',
    features: ['Test format mastery', 'Practice dialogues', 'Exam strategy', 'Vocabulary booklet'],
    image: IMG.naati,
    australia: IMG.naati
  },
  {
    slug: 'jobs-career-guide',
    name: 'Jobs and Career Guide',
    phase: 'before',
    popular: true,
    desc: 'Find work independently on Seek and other Australian platforms.',
    features: ['Seek and LinkedIn guide', 'Australian resume templates', 'Interview prep', 'Workplace slang'],
    image: IMG.jobs,
    australia: IMG.jobs
  },
  {
    slug: 'home-renting-guide',
    name: 'Home and Renting Guide',
    phase: 'before',
    popular: false,
    desc: 'Find rooms and rent safely in any Australian city.',
    features: ['Bonds and lease guide', 'Scam awareness', 'Nepalese community areas', 'Rental checklists'],
    image: IMG.renting,
    australia: IMG.renting
  },
  {
    slug: 'cookery-hospitality-fsa',
    name: 'Cookery, Hospitality and FSA',
    phase: 'before',
    popular: false,
    desc: 'Hospitality and kitchen roles — FSA prep can start in Nepal.',
    features: ['FSA certificate guidance', 'Kitchen job templates', 'Work environment guide', 'Job search tips'],
    image: IMG.hospitality,
    australia: IMG.hospitality
  },
  {
    slug: 'cleaning-jobs-guide',
    name: 'Cleaning Jobs Guide',
    phase: 'before',
    popular: false,
    desc: 'Reliable entry-level cleaning work guidance.',
    features: ['Work standards and PPE', 'Where to find jobs', 'Application walkthrough', 'Equipment checklist'],
    image: IMG.cleaning,
    australia: IMG.cleaning
  },
  {
    slug: 'ndis-community-work',
    name: 'NDIS and Community Work',
    phase: 'after',
    popular: false,
    desc: 'Disability support, aged care, and community services pathways.',
    features: ['NDIS screening walkthrough', 'Identity verification', 'Care job pathways', 'Document templates'],
    image: IMG.ndis,
    australia: IMG.ndis
  },
  {
    slug: 'work-rights-tfn-super',
    name: 'Work Rights, TFN and Super',
    phase: 'after',
    popular: false,
    desc: 'Understand wages, tax, contracts, and Fair Work rights.',
    features: ['TFN application guide', 'Super comparison sheet', 'Contract checklist', 'Fair Work rights card'],
    image: IMG.tfn,
    australia: IMG.tfn
  },
  {
    slug: 'budget-free-food-tips',
    name: 'Budget Living and Free Food Tips',
    phase: 'after',
    popular: true,
    desc: 'Salvation Army, Foodbank, community kitchens — eat well on a budget.',
    features: ['Free food provider map', 'Supermarket savings', 'Budget meal plans', 'First-month budgeting'],
    image: IMG.food,
    australia: IMG.food
  },
  {
    slug: 'navigate-stay-safe',
    name: 'Navigate Australia and Stay Safe',
    phase: 'after',
    popular: false,
    desc: 'Avoid scams and make smart decisions after arrival.',
    features: ['Scam red-flag guide', 'Second-hand car checklist', 'Safety awareness', 'Quiz tools'],
    image: IMG.safety,
    australia: IMG.safety
  },
  {
    slug: 'open-bank-account',
    name: 'Open a Bank Account Guide',
    phase: 'after',
    popular: false,
    desc: 'Step-by-step guidance to open an Australian bank account after arrival — we guide, not open it for you.',
    features: ['Choosing the right bank', 'Documents you need', 'Online vs branch setup', 'Student account tips'],
    image: IMG.bank,
    australia: IMG.bank
  }
];

const ADDONS = [
  { slug: 'linkedin-profile', name: 'LinkedIn Profile', desc: 'Setup and optimisation for Australian job search.', tag: 'Optional add-on', image: IMG.linkedin, australia: IMG.linkedin },
  { slug: 'professional-resume', name: 'Professional Resume', desc: 'Premium review and feedback from a career guide.', tag: 'Optional add-on', image: IMG.resume, australia: IMG.resume },
  { slug: 'bond-lease-review', name: 'Bond and Lease Review', desc: 'We review your rental application or lease before you sign.', tag: 'Optional add-on', image: IMG.renting, australia: IMG.renting },
  { slug: 'career-coaching', name: 'One-on-One Career Coaching', desc: 'Personal session with a career guide.', tag: 'Optional add-on', image: IMG.coaching, australia: IMG.coaching },
  { slug: 'it-certification-coaching', name: 'IT Certification Coaching', desc: 'Guidance on IT certifications that help you land tech and support roles in Australia.', tag: 'Optional add-on', image: IMG.jobs, australia: IMG.jobs },
  { slug: 'airport-pickup-plus', name: 'Airport Pickup Plus', desc: 'Extended pickup with accommodation orientation.', tag: 'Optional add-on', image: IMG.airport, australia: IMG.airport }
];

const FREE_PERKS = [
  'Free SIM card and activation help',
  'Free airport pickup in Melbourne or Sydney',
  'Free transport card top-up — any Australian city',
  'Practice quiz tools'
];

/** Practical main-goal options for enrolment forms */
const ENROL_GOALS = [
  { value: 'Find a job in Australia', label: 'Find a job', hint: 'Seek, resume, interviews', icon: '💼', packageSlug: 'jobs-career-guide', phase: 'before' },
  { value: 'Find a room or rent safely', label: 'Find a room to rent', hint: 'Bonds, leases, scams', icon: '🏠', packageSlug: 'home-renting-guide', phase: 'before' },
  { value: 'Prepare to drive in Australia', label: 'Get ready to drive', hint: 'Learner licence prep', icon: '🚗', packageSlug: 'learner-permit-quiz', phase: 'before' },
  { value: 'Hospitality or kitchen work', label: 'Hospitality work', hint: 'FSA and kitchen jobs', icon: '👨‍🍳', packageSlug: 'cookery-hospitality-fsa', phase: 'before' },
  { value: 'Cleaning job pathway', label: 'Cleaning jobs', hint: 'Entry-level work guide', icon: '🧹', packageSlug: 'cleaning-jobs-guide', phase: 'before' },
  { value: 'NAATI CCL or visa points', label: 'NAATI / visa points', hint: 'CCL test preparation', icon: '🗣️', packageSlug: 'naati-ccl-prep', phase: 'before' },
  { value: 'Settle in after arrival', label: 'Settle in after landing', hint: 'TFN, bank, daily life', icon: '✈️', packageSlug: 'work-rights-tfn-super', phase: 'after' },
  { value: 'Understand work rights and pay', label: 'Work rights and pay', hint: 'TFN, super, Fair Work', icon: '📋', packageSlug: 'work-rights-tfn-super', phase: 'after' },
  { value: 'Save money and find free food', label: 'Budget and free food', hint: 'Foodbank, Salvation Army', icon: '🍽️', packageSlug: 'budget-free-food-tips', phase: 'after' },
  { value: 'NDIS or care work', label: 'NDIS or care work', hint: 'Disability and aged care', icon: '🤝', packageSlug: 'ndis-community-work', phase: 'after' },
  { value: 'Avoid scams and stay safe', label: 'Stay safe from scams', hint: 'Rental, job, and car scams', icon: '🛡️', packageSlug: 'navigate-stay-safe', phase: 'after' },
  { value: 'Open a bank account', label: 'Open a bank account', hint: 'Step-by-step bank guide', icon: '🏦', packageSlug: 'open-bank-account', phase: 'after' },
  { value: 'Not sure yet — help me choose', label: 'Not sure yet', hint: 'We will recommend packages', icon: '💬', packageSlug: '', phase: 'any' }
];

function getPackage(slug) {
  return PACKAGES.find(p => p.slug === slug) || ADDONS.find(a => a.slug === slug) || null;
}

function getPackageSelectOptions() {
  let html = '<option value="">Select a package</option>';
  html += '<optgroup label="Main Packages — Before You Fly (Nepal)">';
  PACKAGES.filter(p => p.phase === 'before').forEach(p => {
    html += `<option value="${p.slug}">${plainLabel(p.name)}</option>`;
  });
  html += '</optgroup><optgroup label="Main Packages — After Arrival (Australia)">';
  PACKAGES.filter(p => p.phase === 'after').forEach(p => {
    html += `<option value="${p.slug}">${plainLabel(p.name)}</option>`;
  });
  html += '</optgroup><optgroup label="Optional Extra Add-Ons">';
  ADDONS.forEach(a => {
    html += `<option value="${a.slug}">${plainLabel(a.name)}</option>`;
  });
  html += '</optgroup>';
  return html;
}

if (typeof module !== 'undefined') module.exports = { PACKAGES, ADDONS, getPackage, getPackageSelectOptions };
