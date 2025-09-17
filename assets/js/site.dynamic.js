// /assets/js/site.dynamic.js
import { API_CONFIG } from '/assets/js/apiClient.js';
import { getNavigation, listLocales } from '/assets/js/siteApi.js';


const IS_PROD = /sdaconsulting\.az$/i.test(location.hostname);


const DEV_LANGS = [
  { code: 'EN', label: 'English' },
  { code: 'AZ', label: 'Azerbaijani' },
  { code: 'RU', label: 'Russian' },
];


// ── Locale helpers ─────────────────────────────────────────
const LS_LOCALE_KEY = 'locale';
const getStoredLocale = () => localStorage.getItem(LS_LOCALE_KEY) || 'EN';
const setStoredLocale = (code) => localStorage.setItem(LS_LOCALE_KEY, code);
function applyLocale(code) {
  API_CONFIG.DEFAULT_LOCALE = code;
  const el  = document.getElementById('selected-language');
  const mel = document.getElementById('mobile-selected-language');
  if (el)  el.textContent  = code;
  if (mel) mel.textContent = code;
}

// ── DOM helpers ───────────────────────────────────────────
const el = (tag, attrs = {}, children = []) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') n.className = v;
    else if (k === 'dataset') Object.entries(v).forEach(([dk, dv]) => (n.dataset[dk] = dv));
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else if (k === 'html') n.innerHTML = v;
    else n.setAttribute(k, v);
  });
  ([]).concat(children).forEach((c) => n.append(c?.nodeType ? c : document.createTextNode(c)));
  return n;
};
const qs = (s) => document.querySelector(s);


const MENU_CLASS = document.querySelector('.dropdown-menu1') ? 'dropdown-menu1' : 'dropdown-menu';
const ITEM_CLASS = MENU_CLASS === 'dropdown-menu1' ? 'dropdown-item1' : 'dropdown-item';

// ── Dropdown kontrolü ─────────────────────────────────────
function closeAllDropdowns() {
  document.querySelectorAll(`.${MENU_CLASS}.open`).forEach((m) => m.classList.remove('open'));
  document.querySelectorAll('.dropdown-arrow, .dropdown-arrow1').forEach((a) => a.classList.remove('open'));
}
function toggleDropdownDataset(id) {
  const menu  = document.querySelector(`.${MENU_CLASS}[data-dd-menu="${id}"]`);
  const arrow = document.querySelector(`.nav-link[data-dd="${id}"] .dropdown-arrow, .nav-link[data-dd="${id}"] .dropdown-arrow1`);
  if (!menu) return;
  const willOpen = !menu.classList.contains('open');
  closeAllDropdowns();
  if (willOpen) {
    menu.classList.add('open');
    if (arrow) arrow.classList.add('open');
  }
}

// ── Header render ─────────────────────────────────────────
function renderHeaderMenu(header) {
  const list = qs('.nav-center');
  if (!list || !header) return;

  list.innerHTML = '';
  (header.items || []).forEach((item) => {
    const li = el('li', { class: 'nav-item' });
    const hasChildren = Array.isArray(item.children) && item.children.length;

    if (!hasChildren) {
      li.append(el('a', { class: 'nav-link', href: item.href || '#' }, [item.label || '']));
    } else {
      const id  = (item.label || 'menu').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const btn = el('button', { class: 'nav-link', dataset: { dd: id } }, [
        item.label || 'Menu',
        (() => {
          const svg = el('svg', { class: 'dropdown-arrow', viewBox: '0 0 24 24' });
          svg.innerHTML = '<polyline points="6,9 12,15 18,9"></polyline>';
          return svg;
        })(),
      ]);
      const dd = el('div', { class: MENU_CLASS, dataset: { ddMenu: id } });
      dd.innerHTML = (item.children || [])
        .map((ch) => `<a href="${ch.href || '#'}" class="${ITEM_CLASS}">${ch.label || ''}</a>`)
        .join('');

      btn.addEventListener('click', () => toggleDropdownDataset(id));
      li.append(btn, dd);
    }

    list.append(li);
  });
}

// ── Footer render ─────────────────────────────────────────
function renderFooter(footer, socials) {
  const wrap = qs('.footer-links');
  if (wrap && footer) {
    wrap.innerHTML = '';
    (footer.columns || []).forEach((col, idx) => {
      const colDiv = el('div', { class: idx === 0 ? 'footer-column1' : 'footer-column' });
      colDiv.append(el('h4', {}, [col.title || '']));
      const ul = el('ul');
      (col.items || []).forEach((it) => ul.append(el('li', {}, [el('a', { href: it.href || '#' }, [it.label || ''])])));
      colDiv.append(ul);
      wrap.append(colDiv);
    });
  }

 
  const socialWrap = qs('.social-links2');
  if (socialWrap && socials) {
    const add = (href, text) => {
      if (!href) return;
      const a = el('a', { class: 'social-link', href, target: '_blank', rel: 'noopener' }, [text]);
      socialWrap.append(a);
    };
    socialWrap.innerHTML = '';
    add(socials.instagram, 'IG');
    add(socials.facebook,  'FB');
    add(socials.linkedin,  'IN');
    add(socials.twitter,   'TW');
  }
}

// ── Languages render ─────────────────────────────────────
function renderLanguages(list) {
  const dd  = document.getElementById('language-dropdown');
  const mdd = document.getElementById('mobile-language-dropdown');
  const langs = Array.isArray(list) && list.length ? list : [
    { code: 'EN', label: 'English' },
    { code: 'AZ', label: 'Azerbaijani' },
    { code: 'RU', label: 'Russian' },
  ]; 
  const build = (container) => {
    if (!container) return;
    container.innerHTML = '';
    langs.forEach(({ code }) => {
      const a = el('a', { href: '#', class: ITEM_CLASS.replace('1', '') || 'dropdown-item' }, [code]);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        setStoredLocale(code);
        applyLocale(code);
        location.reload();  
      });
      container.append(a);
    });
  };
  build(dd);
  build(mdd);
}

// ── Init ─────────────────────────────────────────────────
async function initSite() {
  const code = getStoredLocale();
  applyLocale(code);



  if (!IS_PROD) {
    try {
      
      renderLanguages(DEV_LANGS);
    } catch {}
   
    return;
  }

  try {
    const nav = await getNavigation({});
    renderHeaderMenu(nav.header);
    renderFooter(nav.footer, nav.socials);

    const langs = Array.isArray(nav.languages) ? nav.languages : await listLocales().catch(() => []);
    renderLanguages(langs);
  } catch (e) {
    console.error('site.dynamic navigation error:', e);
  }

  // Mobil menü dışına tıklayınca dropdownları kapat
  document.addEventListener('click', (evt) => {
    if (!evt.target.closest('.nav-item') && !evt.target.closest('.language-dropdown')) closeAllDropdowns();
  });
}

document.addEventListener('DOMContentLoaded', initSite);
