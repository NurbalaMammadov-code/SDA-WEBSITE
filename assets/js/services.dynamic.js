// /assets/js/services.dynamic.js
(function () {
  const API = "";

  const $ = (s, r = document) => r.querySelector(s);

  function toQuery(params = {}) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      q.set(k, v);
    });
    const s = q.toString();
    return s ? `?${s}` : "";
  }

  async function listServices({ skip = 0, limit = 12, order_by = "order", direction = "asc" } = {}) {
    // /api/v1/services GET (Swagger'da order_by + direction destekli)
    const url = `${API}/api/v1/services${toQuery({ skip, limit, order_by, direction })}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Services list failed: ${res.status}`);
    return res.json();
  }

  async function listWorkProcesses({ skip = 0, limit = 10 } = {}) {
    // /api/v1/work-processes GET
    const url = `${API}/api/v1/work-processes${toQuery({ skip, limit })}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Work processes list failed: ${res.status}`);
    return res.json();
  }

  function renderServices(services) {
    const grid = $('.services-section .cards-grid');
    if (!grid) return;

    // order alanına göre zaten sıralı gelecek, yine de güvenlik için sort:
    const items = [...(services || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    grid.innerHTML = items.map((s, i) => `
      <div class="service-card" data-id="${s.id || ""}">
        <div class="card-number">/${String(i + 1).padStart(2, "0")}/</div>
        <h3 class="card-title">${s.name ?? ""}</h3>
        <p class="card-description">${s.description ?? ""}</p>
      </div>
    `).join("");

    // kartlara tıklayınca inner sayfasına git
    grid.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        if (id) {
          window.location.href = `/services inner page/servicesinner.html?id=${id}`;
        }
      });
    });
  }

  function renderWorkProcesses(processes) {
    const cont = $('.work-process-section .steps-container');
    if (!cont) return;

    const items = [...(processes || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, 6);

    cont.innerHTML = items.map((p, idx) => `
      <div class="step">
        <div class="step-indicator">
          <div class="step-dot"></div>
          ${idx < items.length - 1 ? '<div class="step-line"></div>' : ''}
        </div>
        <div class="step-content">
          <h3 class="step-title">${p.title ?? ""}</h3>
          <p class="step-description">${p.description ?? ""}</p>
        </div>
      </div>
    `).join("");
  }

  async function boot() {
    try {
      const [services, processes] = await Promise.all([
        listServices({ limit: 12, order_by: "order", direction: "asc" }),
        listWorkProcesses({ limit: 10 })
      ]);
      renderServices(services);
      renderWorkProcesses(processes);
    } catch (e) {
      console.warn("[services.dynamic] error:", e);
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
