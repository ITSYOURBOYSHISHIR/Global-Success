/** Hari Dai — four tiered settlement packages */

function plainLabel(text) {
  if (typeof fixAmpersandText === 'function') return fixAmpersandText(text);
  return String(text)
    .replace(/&amp;/gi, ' and ')
    .replace(/\s*&\s*/g, ' and ');
}

const IMG = {
  airport: 'assets/images/packages/airport.jpg',
  renting: 'assets/images/packages/renting.jpg',
  jobs: 'assets/images/packages/jobs.jpg',
  coaching: 'assets/images/packages/coaching.jpg',
  heroStudents: 'assets/images/heroes/students-australia.jpg',
  heroSydney: 'assets/images/heroes/sydney-opera.jpg',
  transport: 'assets/images/packages/transport.jpg',
  bank: 'assets/images/packages/bank.jpg'
};

const PACKAGES = [
  {
    slug: 'arrival-starter',
    tier: 1,
    name: 'Arrival Starter Package',
    shortName: 'Arrival Starter',
    tagline: 'Everything for a confident first week.',
    desc: 'Pre-departure orientation, airport pickup, SIM, and 7 days of settlement support.',
    supportDays: 7,
    consultations: 0,
    popular: false,
    includesPrevious: null,
    features: [
      'Pre-departure orientation',
      'Arrival checklist',
      'Free SIM — 1 month',
      'Airport pickup',
      'Myki / transport guide',
      'Basic settlement info',
      '7 days support'
    ],
    image: IMG.airport,
    australia: IMG.airport
  },
  {
    slug: 'student-settlement',
    tier: 2,
    name: 'Student Settlement Package',
    shortName: 'Student Settlement',
    tagline: 'Bank, TFN, housing, and budgeting.',
    desc: 'Everything in Arrival Starter plus 30 days of support and rental guidance.',
    supportDays: 30,
    consultations: 2,
    popular: true,
    includesPrevious: 'arrival-starter',
    features: [
      '+ Arrival Starter',
      'Bank account setup',
      'TFN application',
      'Accommodation search',
      'Rental and bond guide',
      'Scam awareness',
      'Budgeting help',
      '30 days support',
      '2 consultations'
    ],
    image: IMG.renting,
    australia: IMG.renting
  },
  {
    slug: 'career-settlement',
    tier: 3,
    name: 'Career and Settlement Package',
    shortName: 'Career & Settlement',
    tagline: 'Resume, jobs, interviews, and networking.',
    desc: 'Full settlement support plus job search, interviews, and 60 days of guidance.',
    supportDays: 60,
    consultations: 3,
    popular: false,
    includesPrevious: 'student-settlement',
    features: [
      '+ Student Settlement',
      'Australian resume',
      'Job search help',
      'Interview prep',
      'Part-time job guide',
      'Workplace info',
      'Networking',
      '60 days support',
      '3 consultations'
    ],
    image: IMG.jobs,
    australia: IMG.jobs
  },
  {
    slug: 'premium-90-day',
    tier: 4,
    name: 'Premium 90-Day Support Package',
    shortName: 'Premium 90-Day',
    tagline: 'Priority WhatsApp and full first-quarter support.',
    desc: 'Our most complete package — priority WhatsApp, check-ins, and 5 consultations.',
    supportDays: 90,
    consultations: 5,
    popular: false,
    includesPrevious: 'career-settlement',
    features: [
      '+ Career & Settlement',
      '90 days support',
      'Priority WhatsApp',
      'Regular check-ins',
      'Accommodation help',
      'Job and career support',
      'Networking',
      '5 consultations',
      '90-day settlement plan',
      'Professional referrals'
    ],
    image: IMG.coaching,
    australia: IMG.coaching
  }
];

/** Legacy alias — optional extras at enrolment */
const ADDONS = [
  { slug: 'linkedin-profile', name: 'LinkedIn Profile', desc: 'Setup and optimisation for Australian job search.' },
  { slug: 'professional-resume', name: 'Professional Resume', desc: 'Premium review and feedback from a career guide.' },
  { slug: 'bond-lease-review', name: 'Bond and Lease Review', desc: 'Review your rental application or lease before you sign.' },
  { slug: 'career-coaching', name: 'One-on-One Career Coaching', desc: 'Personal session with a career guide.' },
  { slug: 'it-cert-coaching', name: 'IT Certification Coaching', desc: 'Guidance on IT certifications for tech roles.' },
  { slug: 'airport-pickup-plus', name: 'Airport Pickup Plus', desc: 'Extended pickup with accommodation orientation.' }
];

const FREE_PERKS = [
  'Guidance only — we prepare you; we do not guarantee jobs, housing, or licences',
  'Airport pickup included in Arrival Starter and above',
  'Free SIM for 1 month in Arrival Starter and above',
  'Personal consultations scale with your package tier'
];

const ENROL_GOALS = [
  { value: 'Just arrived or arriving soon', label: 'Arriving soon', hint: 'Airport, SIM, first week', icon: '✈️', packageSlug: 'arrival-starter' },
  { value: 'Need housing and daily setup', label: 'Housing and setup', hint: 'Bank, TFN, renting', icon: '🏠', packageSlug: 'student-settlement' },
  { value: 'Looking for part-time work', label: 'Find part-time work', hint: 'Resume, jobs, interviews', icon: '💼', packageSlug: 'career-settlement' },
  { value: 'Want full 90-day support', label: 'Full 90-day support', hint: 'Priority WhatsApp', icon: '⭐', packageSlug: 'premium-90-day' },
  { value: 'Not sure yet — help me choose', label: 'Not sure yet', hint: 'We will recommend a tier', icon: '💬', packageSlug: '' }
];

function packageTitle(pkg) {
  return plainLabel(pkg.shortName || pkg.name);
}

function getPackage(slug) {
  return PACKAGES.find(p => p.slug === slug) || null;
}

function getPackageSelectOptions() {
  let html = '<option value="">Select a package</option>';
  PACKAGES.forEach(p => {
    html += `<option value="${p.slug}">${plainLabel(p.name)}</option>`;
  });
  return html;
}

if (typeof module !== 'undefined') module.exports = { PACKAGES, ADDONS, getPackage, getPackageSelectOptions };
