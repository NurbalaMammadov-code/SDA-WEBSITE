// /assets/js/servicesinner.dynamic.js
import { getService, listServiceBenefits, listServices } from './servicesApi.js';
import { getQuery, toAbsolute } from './apiClient.js';

const idParam = getQuery('id');

const els = {
  title:   document.getElementById('service-title'),
  desc:    document.getElementById('service-description'),
  heroImg: document.getElementById('service-hero-image'),
  what:    document.getElementById('what-we-do'),
  benefits:document.getElementById('benefits-list'),
};

async function ensureServiceId() {
  if (idParam) return Number(idParam);
  // id yoksa ilk servisi al
  const list = await listServices({ limit: 1 });
  return (list && list[0]?.id) || null;
}

function renderWhatWeDo(items) {
  if (!els.what) return;
  els.what.innerHTML = items.slice(0, 6).map(b => `
    <div class="service-card">
      <div class="card-icon"><span></span></div>
      <h3>${b.title ?? ''}</h3>
      <p>${b.description ?? ''}</p>
    </div>
  `).join('');
}

function renderBenefits(items) {
  if (!els.benefits) return;
  els.benefits.innerHTML = items.map(b => `
    <div class="benefit-item">
      <h3 class="benefit-title">${b.title ?? ''}</h3>
      <p class="benefit-description">${b.description ?? ''}</p>
    </div>
  `).join('');
}

async function load() {
  const serviceId = await ensureServiceId();
  if (!serviceId) { console.warn('service id yok'); return; }

  const [service, benefits] = await Promise.all([
    getService(serviceId),
    listServiceBenefits({ limit: 100, order_by:'order', direction:'asc' }),
  ]);

  if (els.title) els.title.textContent = service.name || 'Service';
  if (els.desc)  els.desc.textContent  = service.description || '';
  if (els.heroImg && service.icon_url) els.heroImg.src = toAbsolute(service.icon_url);

  const ordered = (benefits || []).sort((a,b)=> (a.order??0)-(b.order??0));
  renderWhatWeDo(ordered);
  renderBenefits(ordered);
}

load().catch(console.error);
