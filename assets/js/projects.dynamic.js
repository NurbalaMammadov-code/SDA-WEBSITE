// /assets/js/projects.dynamic.js
(function () {
  const API = "http://153.92.223.91:8000";

  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function toQuery(obj={}) {
    const q = new URLSearchParams();
    Object.entries(obj).forEach(([k,v])=>{
      if (v===undefined || v===null || v==="") return;
      q.set(k, v);
    });
    const s = q.toString();
    return s ? `?${s}` : "";
  }

  // API
  async function listSectors({skip=0, limit=100}={}) {
    const url = `${API}/api/v1/property-sectors${toQuery({skip,limit})}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("sectors failed");
    return res.json();
  }
  async function listProjects({skip=0, limit=6, property_sector_id=null}={}) {
    const url = `${API}/api/v1/projects${toQuery({skip,limit, property_sector_id})}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("projects failed");
    return res.json();
  }

  // UI
  const grid      = $('.insights-grid1');          // kartların olduğu grid
  const loadMore  = $('.load-more-btn');           // "Load more" butonu (var)
  const filterBtns= $$('.filter-btn');             // üstteki filtre butonları

  let sectors = [];
  let currentSectorId = null;
  let skip = 0;
  const PAGE = 6;

  function normalize(s='') { return (s||'').toLowerCase().replace(/\s+/g, ' ').trim(); }

  // data-filter -> sector id eşlemesi (başlık üzerinden)
  function sectorIdForFilterKey(key) {
    const k = normalize(key);
    // "Shopping malls", "Residential buildings" ... gibi başlıklarda geçen kelimeyi arayalım
    const hit = sectors.find(sec => normalize(sec.title).includes(k));
    return hit ? hit.id : null;
  }

  function projectCard(p) {
    const img = p.cover_photo_url || (p.photos && p.photos[0]?.image_url) || "/assets/images/image 1-2.png";
    return `
      <div class="insight-card1">
        <div class="card-image1">
          <a href="/projectinnerpage/projectinner.html?id=${p.id}">
            <img src="${img}" alt="${p.title || 'Project'}">
          </a>
        </div>
        <div class="card-header1">
          <h3 class="card-title1">${p.title ?? ''}</h3>
          <a href="/projectinnerpage/projectinner.html?id=${p.id}" class="read-more-link1" aria-label="View project">
            <!-- ok ikonu sayfanda mevcut -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 33 33" fill="none">
              <path d="M23.3333 10.241L10 23.5743M23.3333 10.241H11.3333" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    `;
  }

  function renderProjects(items, {append=false}={}) {
    if (!grid) return;
    if (!append) grid.innerHTML = "";
    grid.insertAdjacentHTML('beforeend', items.map(projectCard).join(""));
  }

  async function loadNext() {
    const list = await listProjects({skip, limit: PAGE, property_sector_id: currentSectorId});
    renderProjects(list, {append: skip>0});
    skip += list.length;
    // gelen sayfa 6'dan azsa "Load more" gizle
    if (!loadMore) return;
    if (list.length < PAGE) loadMore.style.display = 'none';
    else loadMore.style.display = '';
  }

  async function handleFilter(btn) {
    const key = btn.getAttribute('data-filter');
    if (!key || key === 'all') {
      currentSectorId = null;
    } else {
      currentSectorId = sectorIdForFilterKey(key) || null;
    }
    skip = 0;
    if (loadMore) loadMore.style.display = '';
    await loadNext();
  }

  async function boot() {
    try {
      sectors = await listSectors();
    } catch(e) { console.warn('sectors err', e); }

    // URL'den ?property_sector_id varsa onu kullan
    const url = new URL(location.href);
    const pre = url.searchParams.get('property_sector_id');
    currentSectorId = pre ? Number(pre) : null;

    // filtre butonları
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => handleFilter(btn));
    });

    await loadNext();

    if (loadMore) {
      loadMore.addEventListener('click', loadNext);
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
