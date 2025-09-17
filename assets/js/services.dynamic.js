// /assets/js/services.dynamic.js
import { listServices, listWorkProcesses } from "/assets/js/servicesApi.js";

const $ = (s, r = document) => r.querySelector(s);

// Grid'i esnek bul (class/id uyuşmazlığı olmasın)
function getServicesGrid() {
  return (
    document.querySelector(".services-section .cards-grid") ||
    document.querySelector(".services-section .services-grid") ||
    document.querySelector(".cards-grid") ||
    document.getElementById("servicesGrid")
  );
} 

// API'den gelen cevabı diziye normalize et
function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.items || payload?.results || payload?.data || payload?.rows || [];
}

function renderServices(servicesRaw) {
  const grid = getServicesGrid();
  if (!grid) {
    console.warn("[services] Grid bulunamadı (class/id eşleşmiyor).");
    return;
  }

  const items = toArray(servicesRaw)
    .map((s) => ({
      id: s.id ?? s.slug ?? s.uuid ?? "",
      name: s.name ?? s.title ?? s.service_name ?? "",
      description: s.description ?? s.short_description ?? s.excerpt ?? "",
      order: Number(s.order ?? s.sort ?? 0),
    }))
    .sort((a, b) => a.order - b.order);

  if (!items.length) {
    grid.innerHTML = `<div style="opacity:.7">No services available.</div>`;
    return;
  }

  grid.innerHTML = items
    .map(
      (s, i) => `
      <div class="service-card" data-id="${s.id}">
        <div class="card-number">/${String(i + 1).padStart(2, "0")}/</div>
        <h3 class="card-title">${s.name}</h3>
        <p class="card-description">${s.description}</p>
      </div>`
    )
    .join("");

  // Kart tıklama → detay
  grid.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      if (!id) return;
      // klasör adında boşluk varsa tarayıcı %20'ye çevirir ama en temizi klasörü boşluksuz adlandırmaktır
      window.location.href = `/services inner page/servicesinner.html?id=${encodeURIComponent(id)}`;
      // tercihen: /services-inner/servicesinner.html?id=...
    });
  });
}

function renderWorkProcesses(processesRaw) {
  const cont =
    document.querySelector(".work-process-section .steps-container") ||
    document.querySelector(".steps-container");
  if (!cont) return;

  const items = toArray(processesRaw)
    .map((p) => ({
      title: p.title ?? p.name ?? "",
      description: p.description ?? p.detail ?? "",
      order: Number(p.order ?? p.sort ?? 0),
    }))
    .sort((a, b) => a.order - b.order)
    .slice(0, 6);

  if (!items.length) {
    cont.innerHTML = `<div style="opacity:.7">Work process not available.</div>`;
    return;
  }

  cont.innerHTML = items
    .map(
      (p, idx) => `
      <div class="step">
        <div class="step-indicator">
          <div class="step-dot"></div>
          ${idx < items.length - 1 ? '<div class="step-line"></div>' : ""}
        </div>
        <div class="step-content">
          <h3 class="step-title">${p.title}</h3>
          <p class="step-description">${p.description}</p>
        </div>
      </div>`
    )
    .join("");
}

async function boot() {
  try {
    console.time("services:fetch");
    const [services, processes] = await Promise.all([
      // order_by/direction backend’de farklı isimli olabilir; sorun değil, yoksa yok sayılır
      listServices({ limit: 12, order_by: "order", direction: "asc" }),
      listWorkProcesses({ limit: 10 }),
    ]);
    console.timeEnd("services:fetch");
    console.debug("[services] payload:", services);
    renderServices(services);
    renderWorkProcesses(processes);
  } catch (e) {
    console.warn("[services.dynamic] error:", e);
    const grid = getServicesGrid();
    if (grid) grid.innerHTML = `<div style="color:#c33">Services yüklenemedi.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", boot);
