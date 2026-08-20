/** Replace & and &amp; with plain "and" in all visible page text */

function fixAmpersandText(text) {
  if (text == null || text === '') return text;
  return String(text)
    .replace(/&amp;/gi, ' and ')
    .replace(/\uFF06/g, ' and ')
    .replace(/\s*&\s*/g, ' and ')
    .replace(/\s+and\s+and\s+/gi, ' and ');
}

function sanitizeAmpersands(root) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.textContent.includes('&')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const updates = [];
  while (walker.nextNode()) {
    updates.push(walker.currentNode);
  }

  updates.forEach(node => {
    const next = fixAmpersandText(node.textContent);
    if (next !== node.textContent) node.textContent = next;
  });

  root.querySelectorAll?.('[placeholder*="&"],[title*="&"],[aria-label*="&"]').forEach(el => {
    ['placeholder', 'title', 'aria-label'].forEach(attr => {
      const val = el.getAttribute(attr);
      if (val && val.includes('&')) {
        el.setAttribute(attr, fixAmpersandText(val));
      }
    });
  });
}

(function initAmpersandSanitize() {
  let debounce;

  function run() {
    sanitizeAmpersands(document.body);
  }

  function schedule() {
    clearTimeout(debounce);
    debounce = setTimeout(run, 40);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      run();
      schedule();
    });
  } else {
    run();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(run, 0);
    setTimeout(run, 250);
    setTimeout(run, 800);
  });

  if (typeof MutationObserver !== 'undefined' && document.body) {
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.body) {
        const observer = new MutationObserver(schedule);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    });
  }

  window.sanitizeAmpersands = run;
  window.fixAmpersandText = fixAmpersandText;
})();
