// /assets/js/joinour.dynamic.js
(function () {
  const API = "";

  const $ = (s, r = document) => r.querySelector(s);

  function showModalOk() {
    const modal = $('#success-modal');
    const done = $('#done-btn');
    if (!modal || !done) return;
    modal.style.display = 'block';
    done.onclick = () => {
      modal.style.display = 'none';
    };
  }

  // Dosya kutusu UI (isteğe bağlı)
  function wireFileBox() {
    const input = $('#cv');
    const nameEl = $('#fileName');
    const infoBox = $('#fileInfo');
    const infoName = $('#fileInfoName');
    const infoSize = $('#fileInfoSize');
    const progress = $('#fileProgress');
    const removeBtn = $('#removeFileBtn');

    if (!input) return;

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) {
        if (nameEl) nameEl.textContent = '';
        if (infoBox) infoBox.style.display = 'none';
        return;
      }
      if (nameEl) nameEl.textContent = file.name;
      if (infoBox) infoBox.style.display = 'flex';
      if (infoName) infoName.textContent = file.name;
      if (infoSize) infoSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
      if (progress) progress.style.width = '40%'; // gerçek upload progress fetch ile izlenemiyor
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        input.value = '';
        if (nameEl) nameEl.textContent = '';
        if (infoBox) infoBox.style.display = 'none';
      });
    }
  }

  async function submitForm(e) {
    e.preventDefault();
    const form = e.currentTarget;

    const firstName = form.querySelector('#firstName')?.value?.trim();
    const lastName  = form.querySelector('#lastName')?.value?.trim();
    const phone     = form.querySelector('#phone')?.value?.trim();
    const email     = form.querySelector('#email')?.value?.trim();
    const message   = form.querySelector('#message')?.value?.trim();
    const privacyOk = form.querySelector('#privacy')?.checked;
    const cvFile    = form.querySelector('#cv')?.files?.[0] || null;

    if (!privacyOk) {
      alert('Lütfen gizlilik/onay kutusunu işaretleyin.');
      return;
    }

    const fd = new FormData();
    fd.append('first_name', firstName || '');
    fd.append('last_name', lastName || '');
    fd.append('phone_number', phone || '');
    fd.append('email', email || '');
    if (message) fd.append('message', message);
    if (cvFile)  fd.append('cv', cvFile, cvFile.name); // Swagger: cv (binary) opsiyonel

    const btn = form.querySelector('.submit-btn');
    const old = btn ? btn.textContent : null;
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    try {
      const res = await fetch(`${API}/api/v1/contact-messages`, { method: 'POST', body: fd });
      if (!res.ok) {
        const t = await res.text().catch(()=> '');
        throw new Error(`Submit failed: ${res.status} ${t}`);
      }
      // başarı
      form.reset();
      const infoBox = $('#fileInfo'); if (infoBox) infoBox.style.display = 'none';
      const nameEl = $('#fileName');  if (nameEl)  nameEl.textContent = '';
      showModalOk();
    } catch (err) {
      console.error('[joinour.dynamic] error:', err);
      alert('Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = old; }
    }
  }

  function boot() {
    wireFileBox();
    const form = $('#contact-form');
    if (form) form.addEventListener('submit', submitForm);
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
