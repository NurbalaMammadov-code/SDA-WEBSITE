// /assets/js/sectorinner.dynamic.js
(function () {
  const API = "http://153.92.223.91:8000";
  const $  = (s, r=document) => r.querySelector(s);

  function toQuery(obj={}) {
    const q = new URLSearchParams();
    Object.entries(obj).forEach(([k,v])=>{ if(v!==undefined&&v!==null&&v!=="") q.set(k,v); });
    const s = q.toString();
    return s ? `?${s}` : "";
  }

  async function getSector(id) {
    const res = await fetch(`${API}/api/v1/property-sectors/${id}`);
    if (!res.ok) throw new Error('sector failed');
    return res.json();
  }

  async function listSectors() {
    const res = await fetch(`${API}/api/v1/property-sectors`);
    if (!res.ok) throw new Error('sectors failed');
    return res.json();
  }

  async function listProjects({property_sector_id=null, skip=0, limit=12}={}) {
    const url = `${API}/api/v1/projects${toQuery({property_sector_id, skip, limit})}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('projects failed');
    return res.json();
  }

  function card(p) {
    const img = p.cover_photo_url || (p.photos && p.photos[0]?.image_url) || "../assets/images/image 1-2.png";
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 33 33" fill="none">
              <path d="M23.3333 10.241L10 23.5743M23.3333 10.241H11.3333" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    `;
  }

  async function boot() {
    try {
      const url = new URL(location.href);
      let sectorId = Number(url.searchParams.get('sector_id'));

      // sector_id yoksa ilk sektöre düş
      if (!sectorId) {
        const all = await listSectors();
        sectorId = all?.[0]?.id;
      }
      if (!sectorId) return;

      // (İstersen başlığa sektör adını yaz)
      try {
        const sec = await getSector(sectorId);
        const headerH1 = document.querySelector('.section-header h1');
        if (headerH1 && sec?.title) {
          headerH1.innerHTML = `<span class="highlight">${sec.title}</span><br>projects`;
        }
      } catch {}

      const projects = await listProjects({property_sector_id: sectorId, limit: 12});
      const grid = document.querySelector('.insights-grid1');
      if (grid) grid.innerHTML = projects.map(card).join('');
    } catch (e) {
      console.warn('[sectorinner.dynamic] error:', e);
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
