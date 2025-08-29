// /assets/js/projectinner.dynamic.js
(function () {
  const API = "http://153.92.223.91:8000";
  const $  = (s, r=document) => r.querySelector(s);

  function toQuery(obj={}) {
    const q = new URLSearchParams();
    Object.entries(obj).forEach(([k,v])=>{ if(v!==undefined&&v!==null&&v!=="") q.set(k,v); });
    const s = q.toString();
    return s ? `?${s}` : "";
  }

  async function getProject(id) {
    const res = await fetch(`${API}/api/v1/projects/${id}`);
    if (!res.ok) throw new Error('project failed');
    return res.json();
  }
  async function listProjects({skip=0, limit=4, property_sector_id=null}={}) {
    const url = `${API}/api/v1/projects${toQuery({skip,limit,property_sector_id})}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('projects failed');
    return res.json();
  }
  async function getSectorTitle(id) {
    if (!id && id!==0) return null;
    const res = await fetch(`${API}/api/v1/property-sectors/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.title || null;
  }

  function renderHero(p) {
    const titleEl = $('.container .content .title');       // üstteki H1
    const descEl  = $('.container .content .description'); // kısa açıklama
    const imgEl   = $('.container .content .main-image');  // hero görsel

    if (titleEl) titleEl.textContent = p.title || 'Project';
    if (descEl)  descEl.textContent  = p.tag || p.client || '';
    const img = p.cover_photo_url || (p.photos && p.photos[0]?.image_url);
    if (imgEl && img) imgEl.src = img;
  }

  async function renderDetails(p) {
    const wrap = document.querySelector('.container1 .right-section1');
    if (!wrap) return;
    const sectorTitle = await getSectorTitle(p.property_sector_id);

    wrap.innerHTML = `
      <div class="detail-item1">
        <span class="label1">Year</span>
        <span class="value1">${p.year ?? '-'}</span>
      </div>
      <div class="detail-item1">
        <span class="label1">Client</span>
        <span class="value1">${p.client ?? '-'}</span>
      </div>
      <div class="detail-item1">
        <span class="label1">Sector</span>
        <span class="value1">${sectorTitle ?? '-'}</span>
      </div>
      <div class="detail-item1">
        <span class="label1">Tag</span>
        <span class="value1">${p.tag ?? '-'}</span>
      </div>
    `;
  }

  function renderGallery(p) {
    const gal = document.querySelector('.gallery');
    if (!gal) return;
    const imgs = (p.photos && p.photos.length ? p.photos.map(x=>x.image_url) : [])
                 .filter(Boolean);

    // fallback olarak kapak fotoğrafını da ekle
    const list = imgs.length ? imgs : (p.cover_photo_url ? [p.cover_photo_url] : []);
    if (!list.length) return;

    gal.innerHTML = list.slice(0,6).map(src => `
      <div class="image-wrapper"><img src="${src}" alt="${p.title || 'Project'}"></div>
    `).join('');
  }

  async function renderOther(p) {
    const cont = document.querySelector('.projects-grid5'); // "Other projects"
    if (!cont) return;
    const others = (await listProjects({limit: 6, property_sector_id: p.property_sector_id}))
      .filter(x => x.id !== p.id)
      .slice(0,4);

    cont.innerHTML = others.map(op => {
      const img = op.cover_photo_url || (op.photos && op.photos[0]?.image_url) || "/assets/images/image 1-2.png";
      return `
        <div class="project-card5">
          <div class="project-image5">
            <a href="/projectinnerpage/projectinner.html?id=${op.id}">
              <img src="${img}" alt="${op.title || 'Project'}">
            </a>
          </div>
          <div class="project-title-container5">
            <h3 class="project-title5">${op.title ?? ''}</h3>
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

  async function boot() {
    try {
      const id = Number(new URL(location.href).searchParams.get('id'));
      if (!id) return;
      const p = await getProject(id);
      renderHero(p);
      await renderDetails(p);
      renderGallery(p);
      await renderOther(p);
    } catch (e) {
      console.warn('[projectinner.dynamic] error:', e);
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
