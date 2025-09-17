// /assets/js/newsinner.dynamic.js
import { getNewsPost, listNewsPosts, listRelatedPosts } from '/assets/js/newsApi.js';
import { getQuery, formatDate, toAbsolute } from '/assets/js/apiClient.js';

const qs  = (s) => document.querySelector(s);
const slug = getQuery('slug', null);
const id   = getQuery('id',   null);

// Sayfadaki hedef elemanlar
const els = {
  tag:    document.getElementById('news-tag'),
  title:  document.getElementById('news-title'),
  date:   document.getElementById('news-date'),
  img:    document.getElementById('news-main-image'),
  // Görseller üst blokta (#news-sections) kalır; metin gövdesini .article-content’e yazacağız
  body:   document.querySelector('.article-content'),
  relatedGrid: document.querySelector('#app .insights-grid') || document.getElementById('app'),
  share: {
    twitter: document.querySelector('.social-btn.twitter'),
    facebook: document.querySelector('.social-btn.facebook'),
    linkedin: document.querySelector('.social-btn.linkedin'),
  }
}; 

// Basit yardımcılar
const prefer = (...vals) => vals.find(v => v !== undefined && v !== null && v !== '') ?? '';
const postHref = (p) => {
  if (p?.slug) return `/news inner page/newsinner.html?slug=${encodeURIComponent(p.slug)}`;
  if (p?.id   != null) return `/news inner page/newsinner.html?id=${p.id}`;
  return '/news page/news.html';
};

function attachShareHandlers(titleText) {
  const url = location.href;
  const text = titleText || document.title;
  if (els.share.twitter) {
    els.share.twitter.addEventListener('click', () => {
      const u = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      window.open(u, '_blank', 'noopener');
    });
  }
  if (els.share.facebook) {
    els.share.facebook.addEventListener('click', () => {
      const u = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(u, '_blank', 'noopener');
    });
  }
  if (els.share.linkedin) {
    els.share.linkedin.addEventListener('click', () => {
      const u = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(u, '_blank', 'noopener');
    });
  }
}

function renderBodyFromSections(sections) {
  if (!els.body) return;
  els.body.innerHTML = '';
  (sections || [])
    .sort((a,b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach(sec => {
      if (sec.heading) {
        const h2 = document.createElement('h2');
        h2.textContent = sec.heading;
        els.body.appendChild(h2);
      }
      if (sec.image_url) {
        const wrap = document.createElement('div');
        wrap.className = 'image-container';
        wrap.innerHTML = `<img src="${toAbsolute(sec.image_url)}" alt="">`;
        els.body.appendChild(wrap);
      }
      if (sec.content_html) {
        const div = document.createElement('div');
        div.innerHTML = sec.content_html;
        els.body.appendChild(div);
      } else if (sec.content) {
        sec.content.split(/\n{2,}/).forEach(chunk => {
          const p = document.createElement('p');
          p.textContent = chunk.trim();
          els.body.appendChild(p);
        });
      }
    });
}

async function renderRelated(current) {
  if (!els.relatedGrid) return;

  // Önce related endpoint’ini dene
  let rel = null;
  try {
    rel = await listRelatedPosts({ slug: current.slug, limit: 6 });
  } catch { /* endpoint yoksa düşer */ }

  // Fallback: son yazılardan, mevcut yazıyı çıkar
  if (!Array.isArray(rel) || !rel.length) {
    const data = await listNewsPosts({ limit: 9, sort: 'published_desc' }).catch(() => null);
    const items = (data && (data.items || data)) || [];
    rel = items.filter(p => (current.slug ? p.slug !== current.slug : p.id !== current.id)).slice(0, 6);
  }

  els.relatedGrid.innerHTML = rel.map(n => {
    const img = prefer(n.cover_image_url, n.photo_url, '/assets/images/image 4.png');
    const date = prefer(n.published_at, n.created_at, n.updated_at);
    return `
      <div class="insight-card">
        <div class="card-image">
          <a href="${postHref(n)}">
            <img src="${toAbsolute(img)}" alt="${n.title ?? ''}">
          </a>
        </div>
        <div class="card-meta">
          <span class="card-category1">● <span class="ara">${(n.tags && n.tags[0]) || 'News'}</span></span>
          <span class="card-date">${formatDate(date)}</span>
        </div>
        <h3 class="card-title">${n.title ?? ''}</h3>
        <a href="${postHref(n)}" class="read-more-link">Read more
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 25" fill="none">
            <path d="M17 7.90765L7 17.9077M17 7.90765H8M17 7.90765V16.9077" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    `;
  }).join('');
}

async function load() {
  const key = slug || id;
  if (!key) { console.warn('news key yok (slug veya id bekleniyor)'); return; }

  // Haberi getir
  const post = await getNewsPost(key);

  // Üst kısım
  const tag  = (post.tags && post.tags[0]) || 'News';
  const date = prefer(post.published_at, post.created_at, post.updated_at);
  const img  = prefer(post.cover_image_url, post.photo_url);

  if (els.tag)   els.tag.textContent   = tag;
  if (els.title) els.title.textContent = post.title || '';
  if (els.date)  els.date.textContent  = formatDate(date);
  if (els.img && img) els.img.src = toAbsolute(img);

  // Gövde (öncelik body_html → sections → summary)
  const bodyHtml  = prefer(post.body_html, post.content_html, post.html);
  if (els.body) {
    if (bodyHtml) {
      els.body.innerHTML = bodyHtml;
    } else if (Array.isArray(post.sections) && post.sections.length) {
      renderBodyFromSections(post.sections);
    } else if (post.summary) {
      els.body.innerHTML = `<p class="intro-text">${post.summary}</p>`;
    } else {
      // hiçbir şey yoksa, mevcut statik içerik kalsın
    }
  }

  attachShareHandlers(post.title);
  await renderRelated(post);
}

document.addEventListener('DOMContentLoaded', () => {
  load().catch(err => console.error('newsinner.dynamic error:', err));
});
