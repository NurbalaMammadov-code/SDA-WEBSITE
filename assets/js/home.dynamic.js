
import { listServices } from '/assets/js/servicesApi.js';
import { listProjects } from '/assets/js/projectsApi.js';
import { listNewsPosts } from '/assets/js/newsApi.js';
import { listAbout } from '/assets/js/aboutApi.js';
import { getHomepage } from '/assets/js/homeApi.js';
import { listPropertySectors } from '/assets/js/propertySectorsApi.js';
import { toAbsolute, formatDate } from '/assets/js/apiClient.js';


const IS_PROD = /sdaconsulting\.az$/i.test(location.hostname);


const q = (sel) => document.querySelector(sel);


async function renderHero() {
  const heroRoot = q('.hero-section');
  if (!heroRoot) return;

  try {
    const hp = await getHomepage().catch(() => null);
    if (!hp || !hp.hero) return; // backend yoxdursa statik qalsın

    const titleEl = q('.hero-title');
    const descEl  = q('.hero-description');
    const btnEl   = q('.hero-button');

    if (hp.hero.background_image_url) {
      heroRoot.style.backgroundImage = `url("${toAbsolute(hp.hero.background_image_url)}")`;
      heroRoot.style.backgroundSize = 'cover';
      heroRoot.style.backgroundPosition = 'center';
    }
    if (typeof hp.hero.overlay_opacity === 'number') {
      const overlay = q('.hero-overlay');
      if (overlay) overlay.style.opacity = String(hp.hero.overlay_opacity);
    }
    if (titleEl && hp.hero.title) titleEl.innerHTML = hp.hero.title;
    if (descEl && hp.hero.description) descEl.innerHTML = hp.hero.description;
    if (btnEl) {
      if (hp.hero.button_label) btnEl.textContent = hp.hero.button_label;
      if (hp.hero.button_href)  btnEl.closest('a')?.setAttribute('href', hp.hero.button_href);
    }
  } catch (e) {
    console.error('home.hero error:', e);
  }
}


async function renderAboutTeaser() {
  const aboutRoot = q('#about');
  if (!aboutRoot) return;

  const titleEl = aboutRoot.querySelector('.mission-title');
  const descEl  = aboutRoot.querySelector('.description');
  const imgEl   = aboutRoot.querySelector('.building-image');
  const ctaEl   = aboutRoot.querySelector('.discover-button');

  try {
    
    const hp = await getHomepage().catch(() => null);
    if (hp && hp.about_teaser) {
      const a = hp.about_teaser;
      if (titleEl && a.title_html) titleEl.innerHTML = a.title_html;
      if (descEl && a.description_html) descEl.innerHTML = a.description_html;
      if (imgEl && a.image_url) imgEl.src = toAbsolute(a.image_url);
      if (ctaEl && a.cta_href) ctaEl.setAttribute('href', a.cta_href);
      return;
    }

    // 2) Fallback: 
    const aboutList = await listAbout({ limit: 1 }).catch(() => []);
    const about = aboutList && aboutList[0];
    if (about) {
      if (titleEl && about.strategy_title) titleEl.textContent = about.strategy_title;
      if (descEl && about.strategy_description) descEl.textContent = about.strategy_description;
      if (imgEl && about.hero_image_url) imgEl.src = toAbsolute(about.hero_image_url);
    }
  } catch (e) {
    console.error('home.aboutTeaser error:', e);
  }
}


async function renderHomeServices() {
  const wrap = q('.services-cards');
  if (!wrap) return;

  try {
   
    let items = null;
    const hp = await getHomepage().catch(() => null);
    if (hp && Array.isArray(hp.featured_services) && hp.featured_services.length) {
     
      items = hp.featured_services;
    }

    if (!items) {
      const data = await listServices({ limit: 4, order_by: 'order', direction: 'asc' }).catch(() => null);

      items = (data && (data.items || data)) || [];
    }

    wrap.innerHTML = (items || []).map((s, i) => {
      const href = `/services inner page/servicesinner.html?id=${encodeURIComponent(s.id)}`;
      return `
        <a href="${href}">
          <div class="service-card">
            <div class="card-number">/${String(i + 1).padStart(2, '0')}/</div>
           <h3 class="card-title">${s.name ?? ''}</h3>
<p class="card-description">${(s.description ?? '').toString().slice(0,140)}</p>
          </div>
        </a>
      `;
    }).join('');
  } catch (e) {
    console.error('home.services error:', e);
  }
}

// ───────────────── Property Sectors (Accordion) ────────
function bindAccordion(container) {
  container.querySelectorAll('.accordion-header').forEach(h => {
    h.addEventListener('click', () => {
      const item = h.closest('.accordion-item');
      item?.classList.toggle('open');
    });
  });
}

async function renderPropertySectors() {
  const box = q('.accordion-container');
  if (!box) return;

  try {
    const sectors = await listPropertySectors({ limit: 10, sort: 'order_asc' }).catch(() => null);
    if (!sectors || !sectors.length) return; 

    box.innerHTML = sectors.map(sec => `
      <div class="accordion-item">
        <div class="accordion-header">
          <span class="accordion-title">${sec.title ?? ''}</span>
          <div class="accordion-icon">
            <svg class="icon-minus" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M9 20H32" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg class="icon-plus" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 8.33337V31.6667M8.33331 20H31.6666" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="accordion-content">
          ${sec.body_html ? sec.body_html : ''}
          ${sec.learn_more_href ? `<a href="${sec.learn_more_href}" class="learn-more-link">Learn more</a>` : ''}
        </div>
      </div>
    `).join('');

    bindAccordion(box);
  } catch (e) {
    console.error('home.propertySectors error:', e);
  }
}


  


async function renderHomeProjects() {
  const grid = q('.insights-grid1');
  if (!grid) return;
  try {
    const data = await listProjects({ limit: 6, sort: 'created_desc' });
    const items = (data && (data.items || data)) || [];
    grid.innerHTML = items.map(p => {
      const href = `/projectinnerpage/projectinner.html?slug=${encodeURIComponent(p.slug)}`;
      const img  = p.cover_image_url ? toAbsolute(p.cover_image_url) : '/assets/images/sevincmall.png';
      return `
        <div class="insight-card1">
          <div class="card-image1">
            <a href="${href}"><img src="${img}" alt="${p.title ?? ''}"></a>
          </div>
          <a href="${href}" class="card-title1">${p.title ?? ''}</a>
          <a href="${href}" class="read-more-link1" aria-label="View project">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 33 33" fill="none">
              <path d="M23.3333 10.241L10 23.5743M23.3333 10.241H11.3333M23.3333 10.241V22.241" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.error('home.projects error:', e);
  }
}


async function renderHomeNews() {
  const grid = q('.insights-grid');
  if (!grid) return;
  try {
    
    const newsArr = await listNewsPosts({ skip: 0, limit: 3 }).catch(() => []);
    const items = Array.isArray(newsArr) ? newsArr.slice(0,3) : [];

    grid.innerHTML = items.map(post => {
      const img = toAbsolute(post.photo_url || '');
      const date = (post.created_at || '').slice(0,10);
      
      const href = `/news-inner/?id=${encodeURIComponent(post.id)}`;
      return `
        <a href="${href}" class="insight">
          <div class="insight-image" style="background-image:url('${img}')"></div>
          <div class="insight-content-wrap">
            <h3 class="insight-title">${post.title ?? ''}</h3>
            <div class="insight-date">${date}</div>
          </div>
        </a>`;
    }).join('');
  } catch (e) {
  }
}


async function init() {
  try {
    await Promise.all([
      renderHero(),
      renderAboutTeaser(),
      renderHomeServices(),
      renderPropertySectors(),
      renderHomeProjects(),
      renderHomeNews(),
    ]);
  } catch (e) {
    console.error('home.dynamic error:', e);
  }
}

document.addEventListener('DOMContentLoaded', init);
