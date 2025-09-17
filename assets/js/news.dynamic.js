
import { listNewsPosts as listNews } from "/assets/js/newsApi.js"; 

function pickBadge(tags = []) {
  const t = (Array.isArray(tags) ? tags[0] : tags) || "News";
  if (/trend/i.test(t))   return { cls: "card-category1", label: "Trends" };
  if (/insight/i.test(t)) return { cls: "card-category2", label: "Insights" };
  if (/guide/i.test(t))   return { cls: "card-category3", label: "Guides" };
  return { cls: "card-category1", label: t };
}

function cardHTML(item) {
  const img = item.photo_url || "/assets/images/image 4.png";
  const date = (item.updated_at || item.created_at || "").slice(0,10);
  const { cls, label } = pickBadge(item.tags);


  const href = `/news inner page/newsinner.html?id=${item.id}`;

  return `
  <div class="insight-card">
    <div class="card-image">
      <a href="${href}"><img src="${img}" alt=""></a>
    </div>
    <div class="card-meta">
      <span class="${cls}"><span class="ara"> ${label} </span></span>
      <span class="card-date">${date}</span>
    </div>
    <h3 class="card-title">${item.title ?? ""}</h3>
    <a class="read-more-link" href="${href}">Read more
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 25" fill="none">
        <path d="M17 7.90765L7 17.9077M17 7.90765H8M17 7.90765V16.9077" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>`;
}

async function renderNews() {
 
  const firstGrid = document.querySelector('#app .insights-grid:not(.extra-cards)');
  const moreGrid  = document.querySelector('#app .insights-grid.extra-cards');

  if (!firstGrid || !moreGrid) return;

  firstGrid.innerHTML = "";
  moreGrid.innerHTML  = "";
  moreGrid.classList.add("hidden"); 

  let items = [];
  try {
    items = await listNews({ limit: 12 });  
  } catch (e) {
    firstGrid.innerHTML = `<p style="padding:1rem;color:red">News yüklenemedi: ${e.message}</p>`;
    return;
  }

  const first6 = items.slice(0, 6);
  const next6  = items.slice(6, 12);

  firstGrid.innerHTML = first6.map(cardHTML).join("");
  moreGrid.innerHTML  = next6.map(cardHTML).join("");

  // Yeterli öğe yoksa butonu gizle
  const btn = document.querySelector(".load-more-btn");
  if (btn) {
    if (next6.length === 0) {
      btn.closest(".load-more-container")?.classList.add("hidden");
    } else {
      btn.closest(".load-more-container")?.classList.remove("hidden");
    }

    // Buton davranışı (sayfanın eski JS’i yoksa)
    btn.addEventListener("click", () => {
      const isHidden = moreGrid.classList.contains("hidden");
      moreGrid.classList.toggle("hidden");
      btn.innerHTML = isHidden
        ? `Load less <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M7 7h9v9" stroke="#00B2BA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : `Load more <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 7L7 17M17 7H8v9" stroke="#00B2BA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    });
  }
}

document.addEventListener("DOMContentLoaded", renderNews);
