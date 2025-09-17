
import { listProjects, listSectors, getProject } from '/assets/js/projectsApi.js';
import { toAbsolute, getQuery } from '/assets/js/apiClient.js';

console.log('projects.dynamic LOADED v3');

export async function initProjects() {
  const grid       = document.querySelector('.insights-grid1');
  const loadMore   = document.querySelector('.load-more-btn');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  let sectors = [];
  let currentSectorId = null;
  let offset = 0;
  const PAGE = 6;

  function normalize(s) { 
    return String(s || '').toLowerCase().replace(/\s+/g,' ').trim(); 
  }

  function sectorIdFromBtn(btn) {
    const key = normalize(btn.textContent);
    const hit = sectors.find(s => normalize(s.title || s.name).includes(key));
    return hit ? hit.id : null;
  }

  function cardHTML(p) {
    const img = p.cover_photo_url || (p.photos?.[0]?.image_url);
    const src = img ? toAbsolute(img) : '/assets/images/image 1-2.png';
    const href = `/projectinnerpage/projectinner.html?id=${encodeURIComponent(p.id ?? p.slug ?? '')}`;
    return `
      <div class="insight-card1">
        <div class="card-image1">
          <a href="${href}"><img src="${src}" alt="${p.title ?? 'Project'}"></a>
        </div>
        <div class="bb">
          <a href="${href}" class="card-title1">${p.title ?? ''}</a>
          <a href="${href}" class="read-more-link1" aria-label="View project">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 33 33" fill="none">
              <path d="M23.3333 10.241L10 23.5743M23.3333 10.241H11.3333M23.3333 10.241V22.241" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>`;
  }

  async function loadMoreProjects({ reset = false } = {}) {
    if (!grid) return;
    if (reset) { grid.innerHTML = ''; offset = 0; }

    try {
      const items = await listProjects({
        limit: PAGE,
        offset,
        property_sector_id: currentSectorId || undefined,
        sort: 'created_desc',
      });
      grid.insertAdjacentHTML('beforeend', items.map(cardHTML).join(''));
      offset += items.length;
      if (loadMore) loadMore.style.display = items.length < PAGE ? 'none' : '';
    } catch (e) {
      console.error('projects error (raw):', e);
      const hint = location.protocol === 'https:' ? ' (Sayfa HTTPS, API HTTP ise tarayıcı bloklar.)' : '';
      grid.innerHTML = `<p style="padding:1rem;color:red">Projects yüklenemedi: ${e.message}${hint}</p>`;
      if (loadMore) loadMore.style.display = 'none';
    }
  }

  try { 
    sectors = await listPropertySectors(); 
  } catch { 
    sectors = []; 
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      currentSectorId = sectorIdFromBtn(btn) || null;
      await loadMoreProjects({ reset: true });
    });
  });

  await loadMoreProjects({ reset: true });

  if (loadMore) loadMore.addEventListener('click', () => loadMoreProjects());

  // Project detail sayfası için
  const id   = getQuery('id');
  const slug = getQuery('slug');
  const key  = slug ?? id;
  if (key) {
    try {
      const data = await getProject(key);
    } catch (e) {
      console.error('project detail error:', e);
    }
  }
}
