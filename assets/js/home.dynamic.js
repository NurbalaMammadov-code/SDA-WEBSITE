import { listServices } from '/assets/js/servicesApi.js';
import { listProjects } from '/assets/js/projectsApi.js';
import { listNews }     from '/assets/js/newsApi.js';
import { toAbsolute, formatDate } from '/assets/js/apiClient.js';

const q = (sel) => document.querySelector(sel);

// ---- Services (üstteki “Services Section”) ----
async function renderHomeServices() {
  const wrap = q('.services-cards');
  if (!wrap) return;
  const items = await listServices({ limit: 6, order_by: 'order', direction: 'asc' });
  wrap.innerHTML = (items || []).map((s, i) => `
    <div class="service-card">
      <div class="card-number">/${String(i+1).padStart(2,'0')}/</div>
      <h3 class="card-title">${s.name ?? ''}</h3>
      <p class="card-description">${s.description ?? ''}</p>
    </div>
  `).join('');
}

// ---- Projects (orta kısımdaki “insights-grid1”) ----
async function renderHomeProjects() {
  const grid = q('.insights-grid1');
  if (!grid) return;
  const projects = await listProjects({ limit: 6, order_by: 'created_at', direction: 'desc' });
  grid.innerHTML = (projects || []).map(p => {
    const href = `/projectinnerpage/projectinner.html?id=${p.id}`;
    const img  = p.cover_photo_url ? toAbsolute(p.cover_photo_url) : '/assets/images/sevincmall.png';
    return `
      <div class="insight-card1">
        <div class="card-image1">
          <a href="${href}"><img src="${img}" alt="${p.title ?? ''}"></a>
        </div>
        <h3 class="card-title1">${p.title ?? ''}</h3>
        <a href="${href}" class="read-more-link1" aria-label="View project">
          <!-- ikon aynı kalsın -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
            <path d="M17 7.9L7 17.9M17 7.9H8M17 7.9V16.9" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </a>
      </div>
    `;
  }).join('');
}

// ---- News (sayfanın altındaki “insights-grid”) ----
async function renderHomeNews() {
  const grid = q('.insights-grid');
  if (!grid) return;
  const news = await listNews({ limit: 3, order_by: 'created_at', direction: 'desc' });
  grid.innerHTML = (news || []).map(n => {
    const href = `/news inner page/newsinner.html?id=${n.id}`;
    const img  = n.photo_url ? toAbsolute(n.photo_url) : '/assets/images/image 4.png';
    const tag  = (n.tags && n.tags[0]) || 'News';
    return `
      <div class="insight-card">
        <div class="card-image">
          <a href="${href}"><img src="${img}" alt="${n.title ?? ''}"></a>
        </div>
        <div class="card-meta">
          <span class="card-category1"><span class="ara"> ${tag} </span></span>
          <span class="card-date">${formatDate(n.created_at || n.updated_at)}</span>
        </div>
        <h3 class="card-title">${n.title ?? ''}</h3>
        <a href="${href}" class="read-more-link">Read more
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 25" fill="none">
            <path d="M17 7.9L7 17.9M17 7.9H8M17 7.9V16.9" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </a>
      </div>
    `;
  }).join('');
}

async function init() {
  try {
    await Promise.all([
      renderHomeServices(),
      renderHomeProjects(),
      renderHomeNews(),
    ]);
  } catch (e) {
    console.error('home.dynamic error:', e);
  }
}

document.addEventListener('DOMContentLoaded', init);
