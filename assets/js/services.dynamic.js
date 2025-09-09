// /assets/js/services.dynamic.js
import { listServices as apiListServices } from '/assets/js/servicesApi.js';
import { request } from '/assets/js/apiClient.js';

const $ = (s, r = document) => r.querySelector(s);

// --- API yardımcıları ---
function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

// Services: servicesApi.js varsa onu kullanıyoruz
async function listServices({ skip = 0, limit = 12, order_by = 'order', direction = 'asc' } = {}) {
  try {
    return await apiListServices({ skip, limit, order_by, direction });
  } catch (e) {
    // apiClient yoksa doğrudan fetch fallback'i:
    const url = `/api/v1/services${toQuery({ skip, limit, order_by, direction })}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Services list failed: ${res.status}`);
    return res.json();
  }
}

// Work processes
async function listWorkProcesses({ skip = 0, limit = 10 } = {}) {
  // apiClient.request ile; yoksa fetch’e düşer
  try {
    return await request('/api/v1/work-processes', { params: { skip, limit } });
  } catch {
    const url = `/api/v1/work-processes${toQuery({ skip, limit })}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Work processes list failed: ${res.status}`);
    return res.json();
  }
}

// --- Render ---
function renderServices(services) {
  const grid = $('.services-section .cards-grid');
  if (!grid) return;

  const items = [...(services || [])]
    .map(s => ({
      id: s.id,
      name: s.name ?? s.title ?? '',                  // isim eşleştirme
      description: s.description ?? s.short_description ?? '',
      order: s.order ?? 0,
    }))
    .sort((a, b) => a.order - b.order);

  if (!items.length) {
    grid.innerHTML = `<div style="opacity:.7">No services available.</div>`;
    return;
  }

  grid.innerHTML = items.map((s, i) => `
    <div class="service-card" data-id="${s.id || ''}">
      <div class="card-number">/${String(i + 1).padStart(2, '0')}/</div>
      <h3 class="card-title">${s.name}</h3>
      <p class="card-description">${s.description}</p>
    </div>
  `).join('');

  // kart tıklama -> inner sayfa
  grid.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) window.location.href = `/services inner page/servicesinner.html?id=${id}`;
    });
  });
}

function renderWorkProcesses(processes) {
  const cont = $('.work-process-section .steps-container');
  if (!cont) return;

  const items = [...(processes || [])]
    .map(p => ({ title: p.title ?? '', description: p.description ?? '', order: p.order ?? 0 }))
    .sort((a, b) => a.order - b.order)
    .slice(0, 6);

  if (!items.length) {
    cont.innerHTML = `<div style="opacity:.7">Work process not available.</div>`;
    return;
  }

  cont.innerHTML = items.map((p, idx) => `
    <div class="step">
      <div class="step-indicator">
        <div class="step-dot"></div>
        ${idx < items.length - 1 ? '<div class="step-line"></div>' : ''}
      </div>
      <div class="step-content">
        <h3 class="step-title">${p.title}</h3>
        <p class="step-description">${p.description}</p>
      </div>
    </div>
  `).join('');
}

// --- Boot ---
async function boot() {
  try {
    const [services, processes] = await Promise.all([
      listServices({ limit: 12, order_by: 'order', direction: 'asc' }),
      listWorkProcesses({ limit: 10 }),
    ]);
    renderServices(services);
    renderWorkProcesses(processes);
  } catch (e) {
    console.warn('[services.dynamic] error:', e);
    const grid = $('.services-section .cards-grid');
    if (grid) grid.innerHTML = `<div style="color:#c33">Services yüklenemedi.</div>`;
  }
}

document.addEventListener('DOMContentLoaded', boot);
