// /assets/js/servicesinner.dynamic.js
import {
  getService,
  listServices,
  listServiceBenefits,
  listServiceFeatures,
  listProjects,
} from '/assets/js/servicesApi.js';

const $ = (s, r=document) => r.querySelector(s);

function getQuery(name){
  return new URL(location.href).searchParams.get(name);
}

function toAbsolute(url){
  if (!url) return '';
  try { return new URL(url, location.origin).href; } catch { return url; }
}

const els = {
  title:    $('#service-title'),
  desc:     $('#service-description'),
  heroImg:  $('#service-hero-image'),
  what:     $('#what-we-do'),
  benefits: $('#benefits-list'),
  featWrap: document.querySelector('.featured-projects .projects-container'),
};

async function ensureServiceId() {
  const fromQuery = getQuery('id');
  if (fromQuery) return Number(fromQuery);
  const list = await listServices({ limit: 1, order_by:'order', direction:'asc' });
  return (list && list[0]?.id) || null;
}

// ---- RENDERERS ----
function renderHero(service){
  const title = service.name ?? service.title ?? 'Service';
  const desc  = service.description ?? '';
  const hero  = service.hero_image_url ?? service.cover_photo_url ?? service.icon_url;

  if (els.title)   els.title.textContent = title;
  if (els.desc)    els.desc.textContent  = desc;
  if (els.heroImg && hero) els.heroImg.src = toAbsolute(hero);
}

function renderWhatWeDo(features=[]){
  if (!els.what) return;
  const items = [...features]
    .map(x => ({ title: x.title ?? x.name ?? '', description: x.description ?? '', order: x.order ?? 0 }))
    .sort((a,b)=>a.order-b.order)
    .slice(0,6);

  els.what.innerHTML = items.map(f => `
    <div class="service-card">
      <div class="card-icon"><span></span></div>
      <h3>${f.title}</h3>
      <p>${f.description}</p>
    </div>
  `).join('') || `<div style="opacity:.7">Not available.</div>`;
}

function renderBenefits(list=[]){
  if (!els.benefits) return;
  const items = [...list]
    .map(x => ({ title: x.title ?? x.name ?? '', description: x.description ?? '', order: x.order ?? 0 }))
    .sort((a,b)=>a.order-b.order);

  els.benefits.innerHTML = items.map(b => `
    <div class="benefit-item">
      <h3 class="benefit-title">${b.title}</h3>
      <p class="benefit-description">${b.description}</p>
    </div>
  `).join('') || `<div style="opacity:.7">Not available.</div>`;
}

function projectCard(p){
  const img = p.cover_photo_url || (p.photos && p.photos[0]?.image_url) || '/assets/images/image 1-2.png';
  const title = p.title ?? 'Project';
  return `
    <div class="project-card">
      <div class="project-image">
        <a href="/projectinnerpage/projectinner.html?id=${p.id}">
          <img src="${img}" alt="${title}">
        </a>
      </div>
      <div class="project-info">
        <a href="/projectinnerpage/projectinner.html?id=${p.id}" class="project-title">${title}</a>
        <div class="project-arrow">
          <a href="/projectinnerpage/projectinner.html?id=${p.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M22.6666 9.3335L9.33325 22.6668M22.6666 9.3335H10.6666" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProjects(list=[]){
  if (!els.featWrap) return;
  const items = list.slice(0,2);
  els.featWrap.innerHTML = items.map(projectCard).join('') ||
    els.featWrap.innerHTML; // veri yoksa statikleri bırak
}

// ---- BOOT ----
async function boot(){
  try{
    const serviceId = await ensureServiceId();
    if (!serviceId) return;

    const [service, features, benefits] = await Promise.all([
      getService(serviceId),
      listServiceFeatures({ service_id: serviceId, limit: 12, order_by:'order', direction:'asc' }),
      listServiceBenefits({ service_id: serviceId, limit: 24, order_by:'order', direction:'asc' }),
    ]);

    renderHero(service);
    renderWhatWeDo(features);
    renderBenefits(benefits);

    // Featured projects: önce service_id ile dene, yoksa en yeniler
    let projects = [];
    try {
      projects = await listProjects({ service_id: serviceId, limit: 2, order_by: 'created_at', direction: 'desc' });
      if (!projects?.length) {
        projects = await listProjects({ limit: 2, order_by: 'created_at', direction: 'desc' });
      }
    } catch {}
    renderFeaturedProjects(projects);
  } catch (e){
    console.warn('[servicesinner.dynamic] error:', e);
  }
}

document.addEventListener('DOMContentLoaded', boot);
