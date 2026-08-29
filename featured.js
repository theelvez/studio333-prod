document.addEventListener('DOMContentLoaded', () => {
  // Named wall at Bis. Do not fall back to the full 33-work gallery.
  // Rasa only remaining: giclée price/size, EMAIL_TO to the artist.
  const BIS_WORKS = [
    { title: 'Golden Veil', src: 'assets/art-07.jpg', medium: 'Acrylic, mixed media on canvas' },
    { title: 'Twilight Passage', src: 'assets/art-08.jpg', medium: 'Acrylic, mixed media on canvas' }
  ];

  const AJAX = 'https://st333inqfn29.azurewebsites.net/api/inquire';
  const grid = document.getElementById('bis-grid');
  const empty = document.getElementById('bis-empty');
  const overlay = document.getElementById('buy');
  const form = document.getElementById('buy-form');
  const statusEl = document.getElementById('buy-status');
  const editionValueEl = document.getElementById('buy-edition-value');
  const submitBtn = document.getElementById('buy-submit');
  let currentWork = null;

  const filenameOf = (work) => work.src.split('/').pop();

  const absoluteUrls = (work) => {
    const origin = window.location.origin;
    const src = work.src.replace(/^\/+/, '');
    const stem = filenameOf(work).replace(/\.[^.]+$/, '');
    return origin + '/' + src + '\n' + origin + '/gallery.html#' + stem;
  };

  const lockGiclee = () => {
    if (editionValueEl) editionValueEl.value = 'giclee';
    if (submitBtn) submitBtn.textContent = 'Contact artist';
    const subjectEl = document.getElementById('buy-subject');
    if (subjectEl && currentWork) {
      subjectEl.value = 'studio333 giclée — ' + currentWork.title;
    }
  };

  const fill = (work) => {
    currentWork = work;
    const img = document.getElementById('buy-img');
    img.src = work.src;
    img.alt = work.title + ' artwork';
    document.getElementById('buy-title').textContent = work.title;
    document.getElementById('buy-medium').textContent = work.medium || '';
    document.getElementById('buy-painting').value = work.title;
    document.getElementById('buy-image').value = filenameOf(work);
    document.getElementById('buy-urls').value = absoluteUrls(work);
    lockGiclee();
  };

  const openBuy = (work) => {
    fill(work);
    if (statusEl) {
      statusEl.hidden = true;
      statusEl.textContent = '';
    }
    if (form) form.hidden = false;
    overlay.hidden = false;
    document.body.classList.add('is-inquire');
    const closeBtn = overlay.querySelector('.inquire-close');
    if (closeBtn) closeBtn.focus();
  };

  const closeBuy = () => {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('is-inquire');
  };

  overlay.querySelector('.inquire-close').addEventListener('click', closeBuy);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeBuy();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBuy();
  });

  if (!BIS_WORKS.length) {
    if (grid) grid.hidden = true;
    if (empty) empty.hidden = false;
  } else {
    if (empty) empty.hidden = true;
    if (grid) {
      grid.innerHTML = '';
      BIS_WORKS.forEach((work) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'picker-tile';
        btn.setAttribute('aria-label', 'Contact artist about ' + work.title);
        const img = document.createElement('img');
        img.src = work.src;
        img.alt = work.title;
        btn.appendChild(img);
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openBuy(work);
        });
        grid.appendChild(btn);
      });
    }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) return;
      lockGiclee();
      const payload = {};
      new FormData(form).forEach((value, key) => {
        if (key === '_gotcha' || key === '_next') return;
        payload[key] = value;
      });
      payload._captcha = 'false';
      const submit = form.querySelector('[type="submit"]');
      if (submit) submit.disabled = true;
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = 'Sending…';
      }
      try {
        const res = await fetch(AJAX, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const bodyText = await res.text();
        let json = {};
        try { json = JSON.parse(bodyText); } catch (err) {}
        console.log('inquire', res.status, bodyText);
        const ok = res.ok && (json.success === true || json.success === 'true');
        if (!ok) {
          const raw = (json && (json.message || json.error)) || bodyText || ('HTTP ' + res.status);
          const lower = String(raw).toLowerCase() + ' ' + res.status;
          if (statusEl) {
            statusEl.textContent = ((res.status === 429) || /rate|limit|too many/.test(lower))
              ? 'Could not send. Please try again.'
              : (String(raw).trim() || 'Could not send. Please try again.');
          }
          return;
        }
        form.hidden = true;
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = "Sent. I'll email you to complete.";
        }
      } catch (err) {
        console.log('inquire', err);
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = (err && err.message) || 'Could not send. Please try again.';
        }
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }
});
