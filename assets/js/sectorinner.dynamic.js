// /assets/js/sectorinner.dynamic.js
import { listProjects, listSectors } from '/assets/js/projectsApi.js';
import { request, getQuery, toAbsolute } from '/assets/js/apiClient.js';

const $ = (s, r=document) => r.querySelector(s);

// URL'den sektör kimliği/slug'ı çöz
async function resolveSectorId() {
  const id = Number(getQuery('sector_id'));
  if (id) return id;

  const slug = (getQuery('sector') || getQuery('slug') || '').trim();
  if (slug) {
    // backend slug'ı aynı endpointten çözüyorsa:
    try {
      const sec = await request(`/api/v1/property-sectors/${encodeURIComponent(slug)}`);
      if (sec?.id) return sec.id;
    } catch {}
  }

  // hiçbir şey yoksa ilk sektöre düş
  const all = await listSectors({ limit: 200 });
  return all?.[0]?.id ?? null;
}

function projectCard(p) {
  const img = p.cover_photo_url || p?.photos?.[0]?.image_url || '/assets/images/image 1-2.png';
  return `
    <div class="insight-card1">
      <div class="card-image1">
        <a href="/projectinnerpage/projectinner.html?id=${p.id}">
          <img src="${toAbsolute(img)}" alt="${p.title || 'Project'}">
        </a>
      </div>
      <div class="card-header1">
        <a class="card-title1" href="/projectinnerpage/projectinner.html?id=${p.id}">
          ${p.title ?? ''}
        </a>
        <a class="read-more-link1" href="/projectinnerpage/projectinner.html?id=${p.id}" aria-label="View project">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 33 33" fill="none">
            <path d="M23.3333 10.241L10 23.5743M23.3333 10.241H11.3333" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </div>`;
}

async function boot() {
  try {
    const sectorId = await resolveSectorId();
    if (!sectorId) return;

    // başlığa sektör adını yaz (isteğe bağlı)
    try {
      const sec = await request(`/api/v1/property-sectors/${encodeURIComponent(sectorId)}`);
      if (sec?.title) {
        const h1 = document.querySelector('.section-header h1');
        if (h1) h1.innerHTML = `<span class="highlight">${sec.title}</span><br>projects`;
      }
    } catch {}

    // grid’i doldur
    const grid = document.querySelector('.insights-grid1');
    if (grid) grid.innerHTML = '';

    const items = await listProjects({ property_sector_id: sectorId, limit: 12 });
    if (grid) grid.innerHTML = (items || []).map(projectCard).join('');

    // “See all” linkini o sektöre filtreli projects sayfasına yönlendir
    const seeAll = document.querySelector('.section-header .see-all5');
    if (seeAll) {
      seeAll.href = `/project bolumu/project/index.html?property_sector_id=${encodeURIComponent(sectorId)}`;
    }
  } catch (e) {
    console.warn('[sectorinner.dynamic] error:', e);
  }
}

document.addEventListener('DOMContentLoaded', boot);
