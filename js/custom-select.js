/** Lightweight custom dropdowns — keeps native select for form submit */

function customSelectLabel(text) {
  const cleaned = String(text).replace(/\s*\*$/, '');
  if (typeof plainLabel === 'function') return plainLabel(cleaned);
  if (typeof fixAmpersandText === 'function') return fixAmpersandText(cleaned);
  return cleaned.replace(/\s*&\s*/g, ' and ');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('select.custom-select').forEach(initCustomSelect);
});

function initCustomSelect(select) {
  if (select.dataset.customized) return;
  select.dataset.customized = 'true';

  const wrap = document.createElement('div');
  wrap.className = 'custom-select-wrap';
  select.parentNode.insertBefore(wrap, select);
  wrap.appendChild(select);

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const list = document.createElement('ul');
  list.className = 'custom-select-list';
  list.setAttribute('role', 'listbox');
  list.hidden = true;

  function buildOptions() {
    list.innerHTML = '';
    function addOption(opt) {
      const li = document.createElement('li');
      li.className = 'custom-select-option';
      if (!opt.value) {
        li.classList.add('placeholder');
      }
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      li.textContent = customSelectLabel(opt.text);
      if (opt.selected && opt.value) li.classList.add('selected');
      if (opt.disabled) li.classList.add('disabled');
      list.appendChild(li);
    }
    [...select.children].forEach(child => {
      if (child.tagName === 'OPTION') addOption(child);
      else if (child.tagName === 'OPTGROUP') {
        const label = document.createElement('li');
        label.className = 'custom-select-group';
        label.textContent = customSelectLabel(child.label);
        list.appendChild(label);
        [...child.options].forEach(addOption);
      }
    });
    syncTrigger();
  }

  function syncTrigger() {
    const opt = select.options[select.selectedIndex];
    trigger.textContent = opt && opt.value
      ? customSelectLabel(opt.text)
      : customSelectLabel(select.options[0]?.text || 'Select…');
    list.querySelectorAll('.custom-select-option').forEach(li => {
      li.classList.toggle('selected', li.dataset.value === select.value);
    });
  }

  function open() {
    document.querySelectorAll('.custom-select-wrap').forEach(w => w.classList.remove('open'));
    document.querySelectorAll('.custom-select-list').forEach(el => { if (el !== list) el.hidden = true; });
    document.querySelectorAll('.custom-select-trigger').forEach(el => { if (el !== trigger) el.setAttribute('aria-expanded', 'false'); });
    wrap.classList.add('open');
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    wrap.classList.remove('open');
    list.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', e => {
    e.preventDefault();
    list.hidden ? open() : close();
  });

  list.addEventListener('click', e => {
    const li = e.target.closest('.custom-select-option');
    if (!li || li.classList.contains('disabled')) return;
    select.value = li.dataset.value || '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    syncTrigger();
    close();
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) close();
  });

  select.addEventListener('change', syncTrigger);
  select.classList.add('custom-select-native');

  wrap.appendChild(trigger);
  wrap.appendChild(list);
  buildOptions();

  new MutationObserver(buildOptions).observe(select, { childList: true, subtree: true });
}

window.initCustomSelect = initCustomSelect;
window.refreshCustomSelects = () => {
  document.querySelectorAll('select.custom-select').forEach(select => {
    const existing = select.closest('.custom-select-wrap');
    if (existing) {
      existing.parentNode.insertBefore(select, existing);
      existing.remove();
    }
    delete select.dataset.customized;
    initCustomSelect(select);
  });
};
