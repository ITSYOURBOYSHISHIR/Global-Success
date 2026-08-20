/** Shared form submission — FormSubmit.co + WhatsApp handoff */
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/info@globalsucess.com.np';

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const ok = field.value !== '';
    const wrap = field.closest('.custom-select-wrap');
    if (wrap) {
      wrap.classList.toggle('field-error', !ok);
      if (!ok) valid = false;
    } else if (field.type === 'hidden') {
      const topicField = field.closest('.contact-topic-field, .goal-picker-field');
      if (topicField) topicField.classList.toggle('field-error', !ok);
      if (!ok) valid = false;
    }
  });

  if (form.id === 'registerForm') {
    const packages = form.querySelectorAll('input[name="packages"]');
    if (!packages.length) {
      valid = false;
      form.querySelector('#panelPackages')?.classList.add('field-error');
    }
    const validateEvent = new CustomEvent('register:validate', { cancelable: true });
    form.dispatchEvent(validateEvent);
    if (validateEvent.defaultPrevented) valid = false;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return valid;
}

function collectFormData(form) {
  const data = new FormData(form);

  const joinNamed = (name, label) => {
    const values = [...form.querySelectorAll(`input[name="${name}"]`)]
      .map(i => i.value)
      .filter(Boolean);
    data.delete(name);
    if (values.length) {
      const readable = values.map(slug => {
        const item = typeof getPackage === 'function' ? getPackage(slug) : null;
        return item ? (typeof plainLabel === 'function' ? plainLabel(item.name) : item.name) : slug;
      });
      data.set(label, readable.join(', '));
    }
  };

  joinNamed('packages', 'packages');
  joinNamed('addons', 'addons');
  joinNamed('goals', 'goals');

  if (!data.get('topic')) data.set('topic', 'General enquiry');
  if (!data.get('packages')) data.set('packages', 'None selected — guide will recommend');
  return data;
}

function getRegisterWhatsAppPayload(form, data) {
  const slug = form.querySelector('input[name="packages"]')?.value;
  const pkg = typeof getPackage === 'function' ? getPackage(slug) : null;
  const city = data.get('destinationCity') || '';
  const travelWhen = data.get('travelWhen') || '';

  return {
    firstName: data.get('firstName') || '',
    lastName: data.get('lastName') || '',
    phone: data.get('phone') || '',
    whatsapp: data.get('whatsapp') || data.get('phone') || '',
    email: data.get('email') || '',
    city,
    travelWhen,
    message: data.get('message') || '',
    packageName: pkg ? (typeof plainLabel === 'function' ? plainLabel(pkg.name) : pkg.name) : data.get('packages')
  };
}

function showRegisterWhatsAppSuccess(form, payload) {
  const guide = typeof getGuideForEnrolment === 'function'
    ? getGuideForEnrolment(payload.city, payload.travelWhen)
    : null;

  const message = typeof buildEnrolWhatsAppMessage === 'function'
    ? buildEnrolWhatsAppMessage(payload)
    : `Hi, I just enrolled for ${payload.packageName}. My name is ${payload.firstName} ${payload.lastName}.`;

  const waNumber = guide?.whatsapp || guide?.tel?.replace(/\D/g, '');
  const waUrl = typeof buildWhatsAppUrl === 'function'
    ? buildWhatsAppUrl(waNumber, message)
    : '';

  let block = document.getElementById('enrolWhatsAppSuccess');
  if (!block) {
    block = document.createElement('div');
    block.id = 'enrolWhatsAppSuccess';
    block.className = 'enrol-whatsapp-success';
    const success = document.getElementById('formSuccess');
    success?.appendChild(block);
  }

  block.innerHTML = `
    <p><strong>Faster reply on WhatsApp</strong> — message ${guide ? guide.name.split(' ')[0] : 'your guide'} directly with your enrolment details pre-filled.</p>
    ${waUrl ? `<a class="enrol-whatsapp-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a>` : '<p>Use the phone number we email you to reach your guide.</p>'}
  `;
  block.classList.add('show');
}

async function submitForm(form, options = {}) {
  if (!validateForm(form)) return false;

  const btn = form.querySelector('[type="submit"]');
  const originalText = btn?.textContent;
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending…';
  }

  const data = collectFormData(form);
  if (!data.get('packages')) data.set('packages', 'None selected');
  data.append('_subject', options.subject || 'Thuldai Website Enquiry');
  data.append('_captcha', 'false');
  data.append('_template', 'table');

  const registerPayload = form.id === 'registerForm' ? getRegisterWhatsAppPayload(form, data) : null;

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data
    });
    if (!res.ok) throw new Error('Network error');
    showFormSuccess(form);
    if (registerPayload) showRegisterWhatsAppSuccess(form, registerPayload);
    return true;
  } catch {
    const lines = [];
    for (const [k, v] of data.entries()) {
      if (!k.startsWith('_')) lines.push(`${k}: ${v}`);
    }
    window.location.href = `mailto:info@globalsucess.com.np?subject=${encodeURIComponent(options.subject || 'Thuldai Enquiry')}&body=${encodeURIComponent(lines.join('\n'))}`;
    showFormSuccess(form);
    if (registerPayload) showRegisterWhatsAppSuccess(form, registerPayload);
    return true;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}

function showFormSuccess(form) {
  const card = form.closest('.js-form-card, .sa-form-card, .dingoos-form-box, .contact-form-wrap, .aus-enquiry-card');
  card?.querySelector('.sa-form-card-head')?.style.setProperty('display', 'none');
  card?.querySelector('.aus-enquiry-card-head')?.style.setProperty('display', 'none');
  card?.querySelector('.aus-enquiry-steps')?.style.setProperty('display', 'none');
  const success = document.getElementById('contactFormSuccess')
    || card?.querySelector('.js-form-success, .form-success')
    || document.getElementById('formSuccess');
  if (success) {
    success.classList.add('show');
    form.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerForm')?.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(e.target, { subject: 'New Enrolment Request — Thuldai' });
  });

  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(e.target, { subject: 'Contact Form — Thuldai' });
  });
});
