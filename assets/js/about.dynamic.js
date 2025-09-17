import { listAbout, listPartners, listTeamMembers } from '/assets/js/aboutApi.js';
import { toAbsolute } from '/assets/js/apiClient.js';

const qs  = (sel) => document.querySelector(sel);
const IS_PROD = /sdaconsulting\.az$/i.test(location.hostname);

async function renderAboutStats() {
  const nums = document.querySelectorAll('.stats-container .stat-number');
  if (!nums?.length) return;

  const aboutList = await listAbout({ limit: 1 });
  const about = (aboutList && aboutList[0]) || null;
  if (!about) return;

 
  const values = [about.experience, about.project_count, about.members];
  nums.forEach((el, i) => { if (values[i] !== undefined) el.textContent = values[i]; });
}

async function renderPartners() {
  const row = qs('.partners-row');
  if (!row) return;
  const list = await listPartners({ limit: 40 });
  row.innerHTML = (list || []).map(p => `
    <div class="partner-item">
      ${p.logo_url ? `<img src="${toAbsolute(p.logo_url)}" alt="${p.name ?? ''}">` : ''}
    </div>
  `).join('');
}

async function renderTeam() {
  const grid = qs('.team-grid');
  if (!grid) return;
  const members = await listTeamMembers({ limit: 12 });
  grid.innerHTML = (members || []).map(m => `
    <div class="team-member">
      <div class="member-image-container">
        <img src="${m.photo_url ? toAbsolute(m.photo_url) : ''}" alt="${m.full_name ?? ''}" class="member-image">
        <button class="add-button" type="button" disabled>
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

async function renderAboutIntroAndHero() {
  const introEl = qs('.about-intro');
  const imgEl   = qs('#about-hero-image');
  const aboutList = await listAbout({ limit: 1 });
  const about = (aboutList && aboutList[0]) || null;
  if (!about) return;

  if (about.intro_html && introEl) {
    introEl.innerHTML = about.intro_html;
  }
  if (about.hero_image_url && imgEl) {
    imgEl.src = toAbsolute(about.hero_image_url);
    imgEl.alt = 'About hero';
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  if (!IS_PROD) return; 

  try {
    await Promise.all([
      renderAboutStats(),
      renderPartners(),
      renderTeam(),
      renderAboutIntroAndHero(),
    ]);
  } catch (e) {
    console.warn('[about.dynamic] error:', e);
  }
});
