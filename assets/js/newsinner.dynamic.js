// /assets/js/newsinner.dynamic.js
import { getNews, listNews } from '/assets/js/newsApi.js';
import { getQuery, formatDate, toAbsolute } from 'assets/js/apiClient.js';

const id = getQuery('id');
const els = {
  tag:    document.getElementById('news-tag'),
  title:  document.getElementById('news-title'),
  date:   document.getElementById('news-date'),
  img:    document.getElementById('news-main-image'),
  body:   document.getElementById('news-sections'),
  relatedGrid: document.querySelector('#app .insights-grid') || document.getElementById('app'),
};

async function load() {
  if (!id) { console.warn('news id yok'); return; }
  const news = await getNews(id);

  // Üst kısım
  const tag = (news.tags && news.tags[0]) || 'News';
  if (els.tag)   els.tag.textContent = tag;
  if (els.title) els.title.textContent = news.title || '';
  if (els.date)  els.date.textContent  = formatDate(news.created_at || news.updated_at);

  if (els.img && news.photo_url) els.img.src = toAbsolute(news.photo_url);

  // İçerik (sections varsa onlardan, yoksa summary’den)
  if (els.body) {
    els.body.innerHTML = '';
    if (news.summary && (!news.sections || news.sections.length === 0)) {
      const p = document.createElement('p');
      p.className = 'intro-text';
      p.textContent = news.summary;
      els.body.appendChild(p);
    }
    (news.sections || [])
      .sort((a,b)=> (a.order??0)-(b.order??0))
      .forEach(sec => {
        if (sec.heading) {
          const h2 = document.createElement('h2');
          h2.textContent = sec.heading;
          els.body.appendChild(h2);
        }
        if (sec.image_url) {
          const fig = document.createElement('div');
          fig.className = 'image-container';
          fig.innerHTML = `<img src="${toAbsolute(sec.image_url)}" alt="">`;
          els.body.appendChild(fig);
        }
        if (sec.content) {
          // Paragraflara böl
          sec.content.split(/\n{2,}/).forEach(chunk=>{
            const p = document.createElement('p');
            p.textContent = chunk.trim();
            els.body.appendChild(p);
          });
        }
      });
  }

  // Keep reading
  if (els.relatedGrid) {
    const all = await listNews({ limit: 9 });
    const items = (all || []).filter(n => n.id !== news.id).slice(0, 6);
    els.relatedGrid.innerHTML = items.map(n => `
      <div class="insight-card">
        <div class="card-image">
          <a href="/news inner page/newsinner.html?id=${n.id}">
            <img src="${n.photo_url ? toAbsolute(n.photo_url) : '/assets/images/image 4.png'}" alt="">
          </a>
        </div>
        <div class="card-meta">
          <span class="card-category1">● <span class="ara">${(n.tags && n.tags[0]) || 'News'}</span></span>
          <span class="card-date">${formatDate(n.created_at)}</span>
        </div>
        <h3 class="card-title">${n.title ?? ''}</h3>
        <a href="/news inner page/newsinner.html?id=${n.id}" class="read-more-link">Read more
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 25" fill="none">
            <path d="M17 7.9L7 17.9M17 7.9H8M17 7.9V16.9" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </a>
      </div>
    `).join('');
  }
}

load().catch(err => console.error(err));
