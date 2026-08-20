/** Thuldai — shared site contact details */
window.THULDAI = {
  name: 'Thuldai',
  tagline: 'Guide for Australia',
  logo: 'assets/thuldai-logo.png?v=1',
  email: 'info@globalsucess.com.np',
  whatsapp: {
    number: '61416206568',
    display: '0416 206 568',
    message: 'Hi Thuldai, I have a question about your packages.'
  },
  team: [
    {
      id: 'melbourne',
      city: 'Melbourne',
      region: 'australia',
      name: 'Shishir Chandra Poudel',
      phone: '+61 416 206 568',
      tel: '+61416206568',
      whatsapp: '61416206568',
      emoji: '👨‍💼',
      role: 'Student support and arrival guidance — free airport pickup available.'
    },
    {
      id: 'sydney',
      city: 'Sydney',
      region: 'australia',
      name: 'Suraz Regmi',
      phone: '+61 423 248 465',
      tel: '+61423248465',
      whatsapp: '61423248465',
      emoji: '🌊',
      role: 'Student support and arrival guidance — free airport pickup available.'
    },
    {
      id: 'kathmandu',
      city: 'Kathmandu',
      region: 'nepal',
      name: 'Dinesh Mahatara',
      phone: '+977 976 142 6281',
      tel: '+9779761426281',
      whatsapp: '9779761426281',
      emoji: '🏛️',
      role: 'Enrolment, online classes, and pre-departure preparation.'
    },
    {
      id: 'butwal',
      city: 'Butwal',
      region: 'nepal',
      name: 'Kshitiz Kunwar',
      phone: '+61 449 544 889',
      tel: '+61449544889',
      whatsapp: '61449544889',
      emoji: '🎓',
      role: 'Enrolment, online classes, and pre-departure preparation.'
    },
    {
      id: 'chitwan',
      city: 'Chitwan',
      region: 'nepal',
      name: 'Sushant Kandel',
      phone: '+977 984 573 6616',
      tel: '+9779845736616',
      whatsapp: '9779845736616',
      emoji: '🏔️',
      role: 'Enrolment, online classes, and pre-departure preparation.'
    }
  ]
};

window.HARI_DAI = window.THULDAI;
window.GLOBAL_SUCCESS = window.THULDAI;

/** Pick guide by destination city; defaults to Kathmandu for pre-departure */
window.getGuideForEnrolment = function getGuideForEnrolment(city, travelWhen) {
  const team = window.HARI_DAI?.team || [];
  const normalized = (city || '').trim().toLowerCase();

  if (normalized === 'melbourne') return team.find(t => t.id === 'melbourne');
  if (normalized === 'sydney') return team.find(t => t.id === 'sydney');
  if (normalized === 'brisbane' || normalized === 'perth' || normalized === 'adelaide' || normalized === 'gold coast') {
    return team.find(t => t.id === 'melbourne');
  }
  if (travelWhen === 'Already in Australia') {
    return team.find(t => t.id === 'melbourne') || team[0];
  }
  if (normalized === 'chitwan') return team.find(t => t.id === 'chitwan');
  if (normalized === 'butwal') return team.find(t => t.id === 'butwal');

  return team.find(t => t.id === 'kathmandu') || team[0];
};

window.buildWhatsAppUrl = function buildWhatsAppUrl(whatsappNumber, message) {
  const digits = String(whatsappNumber || '').replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

window.buildEnrolWhatsAppMessage = function buildEnrolWhatsAppMessage(data) {
  const lines = [
    'Hi Thuldai, I just submitted an enrolment request.',
    '',
    `Name: ${data.firstName || ''} ${data.lastName || ''}`.trim(),
    `Package: ${data.packageName || 'Not selected'}`,
    `City: ${data.city || 'Not sure yet'}`,
    `Travel: ${data.travelWhen || ''}`,
    `Phone: ${data.phone || ''}`,
    data.whatsapp ? `WhatsApp: ${data.whatsapp}` : '',
    data.email ? `Email: ${data.email}` : '',
    data.message ? `\nNote: ${data.message}` : ''
  ].filter(Boolean);

  return lines.join('\n');
};
