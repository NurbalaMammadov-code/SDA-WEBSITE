import { listAbout, listPartners, listTeamMembers } from '/assets/js/aboutApi.js';
import { toAbsolute } from '/assets/js/apiClient.js';

const qs  = (sel) => document.querySelector(sel);

async function renderAboutStats() {
  const nums = document.querySelectorAll('.stats-container .stat-number');
  if (!nums?.length) return;

  const aboutList = await listAbout({ limit: 1 });
  const about = (aboutList && aboutList[0]) || null;
  if (!about) return;

  // Sıra: experience, project_count, members
  const values = [about.experience, about.project_count, about.members];
  nums.forEach((el, i) => { if (values[i] !== undefined) el.textContent = values[i]; });
}

async function renderPartners() {
  const box = qs('.partners-logos');
  if (!box) return;

  const partners = await listPartners({ limit: 50 });

  // Tüm partner logolarını düz listeye açalım
  const logos = [];
  (partners || []).forEach(p => {
    (p.logos || []).forEach(l => logos.push(l));
  });

  if (!logos.length) return;
  box.innerHTML = logos.slice(0, 12).map(l => `
    <img src="${toAbsolute(l.image_url)}" alt="Partner logo" class="partner-logo">
  `).join('');
}

async function renderTeam() {
  const grid = qs('.team-grid');
  if (!grid) return;

  const members = await listTeamMembers({ limit: 12, });
  grid.innerHTML = (members || []).map(m => `
    <div class="team-member">
      <div class="member-image-container">
        <img src="${m.photo_url ? toAbsolute(m.photo_url) : '/assets/images/image 1.png'}" alt="${m.full_name ?? ''}" class="member-image">
        <button class="add-button" type="button" disabled>
          <!-- dekoratif ikon; modal yoksa disabled -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1V17M1 9H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="member-info">
        <h3 class="member-name">${m.full_name ?? ''}</h3>
        <p class="member-title">${m.role ?? ''}</p>
      </div>
    </div>
  `).join('');
}

async function initAll() {
  try {
    // Site ve About API’lerini paralel başlat
    await Promise.all([
      initSite(),           // site.dynamic.js
      (async () => {        // about.dynamic.js
        const aboutList = await listAbout({ limit: 1 });
        const about = (aboutList && aboutList[0]) || null;

        if (about) {
          renderAboutStats(about);
          renderPartners();
          renderTeam();
          renderAboutIntroAndHero(about);
        }
      })()
    ]);
  } catch (e) {
    console.error('initAll error:', e);
  }
}

document.addEventListener('DOMContentLoaded', initAll);


async function renderAboutIntroAndHero() {
  const introEl = document.querySelector('.intro-text');
  const imgEl = document.querySelector('.main-image');
  const aboutList = await listAbout({ limit: 1 });
  const about = (aboutList && aboutList[0]) || null;
  if (!about) return;

  // intro_html HTML formatında gəlir (OpenAPI-də belə tanımladım)
  if (about.intro_html && introEl) {
    introEl.innerHTML = about.intro_html;
  }
  if (about.hero_image_url && imgEl) {
    imgEl.src = toAbsolute(about.hero_image_url);
    imgEl.alt = 'About hero';
  }
}

await Promise.all([
  renderAboutStats(),
  renderPartners(),
  renderTeam(),
  renderAboutIntroAndHero(),
]);

