// /assets/js/projectinner.dynamic.js  (ESM module)
import { getProject, listProjects, getSector, listSectors } from '/assets/js/projectsApi.js';
import { getQuery, toAbsolute } from '/assets/js/apiClient.js';

const $  = (s, r=document) => r.querySelector(s);

// ---- küçük yardımcılar ----
async function getSectorTitleSafe(id) {
  if (id === undefined || id === null) return null;
  try {
    const s = await getSector(id);
    return s?.title ?? null;
  } catch {
    try {
      const list = await listSectors({ limit: 200 });
      const hit = (list || []).find(x => x.id === id);
      return hit?.title ?? null;
    } catch { return null; }
  }
}

function textOr(...vals) {
  for (const v of vals) if (v && String(v).trim()) return v;
  return '';
}

// ---- render: HERO ----
function renderHero(p) {
  const titleEl = $('.container .content .title');
  const descEl  = $('.container .content .description');
  const imgEl   = $('.container .content .main-image');

  if (titleEl) titleEl.textContent = textOr(p.title, 'Project');

  // alt başlık/özet için elde ne varsa kullanalım
  const desc = textOr(p.subtitle, p.short_description, p.summary, p.tag, p.client, '');
  if (descEl)  descEl.textContent = desc;

  const img = p.cover_photo_url || p.photos?.[0]?.image_url;
  if (imgEl && img) imgEl.src = toAbsolute(img);
}

// ---- render: DETAYLAR (sağ blok) ----
async function renderDetails(p) {
  const wrap = document.querySelector('.container1 .right-section1');
  if (!wrap) return;

  const sectorTitle = await getSectorTitleSafe(p.property_sector_id);
  const year = p.year ?? p.date_year ?? '-';

  wrap.innerHTML = `
    <div class="detail-item1">
      <span class="label1">Year</span>
      <span class="value1">${year}</span>
    </div>
    <div class="detail-item1">
      <span class="label1">Client</span>
      <span class="value1">${textOr(p.client, '-')}</span>
    </div>
    <div class="detail-item1">
      <span class="label1">Property type</span>
      <span class="value1">${textOr(sectorTitle, p.property_type_text, '-')}</span>
    </div>
    <div class="detail-item1">
      <span class="label1">Services</span>
      <div class="services-list1">
        ${(p.services_list ?? p.services ?? [])
          .map(s => `<div class="service-item1">— ${s}</div>`).join('') || `
          <div class="service-item1">— Technical consulting</div>
        `}
      </div>
    </div>
  `;

  // soldaki "About the project" metnini de dinamikle
  const left = document.querySelector('.container1 .left-section1');
  if (left) {
    const about = textOr(p.about, p.long_description, p.description, p.summary, '');
    if (about) {
      const parts = String(about).split(/\n{2,}/).slice(0,3);
      left.querySelectorAll('p').forEach(el => el.remove());
      parts.forEach(t => {
        const pEl = document.createElement('p');
        pEl.textContent = t.trim();
        left.appendChild(pEl);
      });
    }
  }
}

// ---- render: GALERİ ----
function renderGallery(p) {
  const gal = document.querySelector('.gallery');
  if (!gal) return;

  const imgs = (p.photos || [])
    .map(x => x?.image_url)
    .filter(Boolean);

  const list = imgs.length ? imgs : (p.cover_photo_url ? [p.cover_photo_url] : []);
  if (!list.length) return;

  gal.innerHTML = list.slice(0, 6).map(src => `
    <div class="image-wrapper">
      <img src="${toAbsolute(src)}" alt="${textOr(p.title,'Project')}">
    </div>
  `).join('');
}

// ---- render: OTHER PROJECTS ----
async function renderOther(p) {
  const cont = document.querySelector('.projects-grid5');
  if (!cont) return;

  let others = [];
  try {
    others = await listProjects({ limit: 6, property_sector_id: p.property_sector_id });
  } catch {}

  others = (others || []).filter(x => x.id !== p.id).slice(0, 4);

  cont.innerHTML = others.map(op => {
    const img = op.cover_photo_url || op.photos?.[0]?.image_url || '/assets/images/image 1-2.png';
    return `
      <div class="project-card5">
        <div class="project-image5">
          <a href="/projectinnerpage/projectinner.html?id=${op.id}">
            <img src="${toAbsolute(img)}" alt="${textOr(op.title,'Project')}">
          </a>
        </div>
        <div class="project-title-container5">
          <a class="project-title5" href="/projectinnerpage/projectinner.html?id=${op.id}">
            ${textOr(op.title,'')}
          </a>
          <a href="/projectinnerpage/projectinner.html?id=${op.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" class="project-icon5">
              <path d="M22.6663 9.3335L9.33301 22.6668M22.6663 9.3335H10.6663" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// ---- opsiyonel: Delivered solutions dinamik (varsa p.solutions) ----
function renderSolutions(p) {
  if (!Array.isArray(p.solutions) || p.solutions.length === 0) return; // elindeki statik kalsın
  const container = document.querySelector('.cards-container3');
  if (!container) return;

  container.innerHTML = p.solutions.slice(0,6).map((s, i) => `
    <div class="${i % 2 ? 'card9' : 'card3'}">
      <div class="${i % 2 ? 'card-header9' : 'card-header3'}">
        <div class="${i % 2 ? 'card-number9' : 'card-number3'}">${String(i+1).padStart(2,'0')}</div>
        <div class="${i % 2 ? 'card-line9' : 'card-line3'}"></div>
      </div>
      <h3>${textOr(s.title, s.heading, `Solution ${i+1}`)}</h3>
      <p>${textOr(s.text, s.description, '')}</p>
    </div>
  `).join('');
}

// ---- boot ----
async function boot() {
  try {
    const idOrSlug = getQuery('id') ?? getQuery('slug');
    if (!idOrSlug) return; // URL param yoksa, statik içerik kalsın

    const p = await getProject(idOrSlug);

    renderHero(p);
    await renderDetails(p);
    renderGallery(p);
    renderSolutions(p);
    await renderOther(p);
  } catch (e) {
    console.warn('[projectinner.dynamic] error:', e);
  }
}

document.addEventListener('DOMContentLoaded', boot);
