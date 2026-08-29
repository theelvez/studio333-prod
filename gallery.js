document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progress = document.querySelector('.carousel-progress');
  const currentLabel = document.getElementById('carousel-current');
  const totalLabel = document.getElementById('carousel-total');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  const carousel = document.querySelector('.carousel');
  const slidesContainer = document.querySelector('.slides');
  const overlay = document.getElementById('inquire');
  const form = overlay && overlay.querySelector('.inquire-form');
  const statusEl = document.getElementById('inquire-status');
  const editionValueEl = document.getElementById('inquire-edition-value');
  let index = 0;
  let currentWork = null;

  const workFromSlide = (slide) => {
    const img = slide.querySelector('img');
    const src = img.getAttribute('src');
    return {
      title: slide.querySelector('.piece-name').textContent.trim(),
      medium: slide.querySelector('.piece-meta').textContent.trim(),
      src,
      filename: src.split('/').pop(),
      index: Number(slide.dataset.index)
    };
  };

  const setActive = (newIndex) => {
    index = (newIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    if (progress) progress.style.width = ((index + 1) / slides.length * 100) + '%';
    if (currentLabel) currentLabel.textContent = (index + 1);
    if (totalLabel) totalLabel.textContent = slides.length;
  };

  const absoluteUrls = (work) => {
    const origin = window.location.origin;
    const src = work.src.replace(/^\/+/, '');
    const stem = work.filename.replace(/\.[^.]+$/, '');
    return origin + '/' + src + '\n' + origin + '/gallery.html#' + stem;
  };

  const editionValue = () => {
    const on = overlay ? Array.from(overlay.querySelectorAll('.edition-chip.is-on')) : [];
    const keys = on.map((c) => c.dataset.edition);
    const out = [];
    if (keys.includes('original')) out.push('original');
    if (keys.includes('giclee')) out.push('giclee');
    return out.join(',');
  };

  const editionPhrase = (val) => {
    if (val === 'original,giclee') return 'original + giclée';
    if (val === 'giclee') return 'giclée';
    if (val === 'original') return 'original';
    return '';
  };

  const resetEdition = () => {
    if (overlay) {
      overlay.querySelectorAll('.edition-chip').forEach((chip) => {
        chip.classList.remove('is-on');
        chip.setAttribute('aria-pressed', 'false');
      });
    }
    if (editionValueEl) editionValueEl.value = '';
  };

  const syncSubject = (work) => {
    const val = editionValue();
    if (editionValueEl) editionValueEl.value = val;
    const subjectEl = document.getElementById('inquire-subject');
    if (!subjectEl || !work) return;
    const phrase = editionPhrase(val);
    subjectEl.value = phrase
      ? 'studio333 inquiry — ' + work.title + ' (' + phrase + ')'
      : 'studio333 inquiry — ' + work.title;
  };

  const fillForm = (work) => {
    currentWork = work;
    document.getElementById('inquire-img').src = work.src;
    document.getElementById('inquire-img').alt = work.title + ' artwork';
    document.getElementById('inquire-title').textContent = work.title;
    document.getElementById('inquire-medium').textContent = work.medium;
    document.getElementById('inquire-painting').value = work.title;
    document.getElementById('inquire-image').value = work.filename;
    document.getElementById('inquire-index').value = String(work.index + 1);
    const urlsEl = document.getElementById('inquire-urls');
    if (urlsEl) urlsEl.value = absoluteUrls(work);
    resetEdition();
    syncSubject(work);
  };

  const openInquire = (slide) => {
    if (!overlay) return;
    fillForm(workFromSlide(slide));
    if (statusEl) {
      statusEl.hidden = true;
      statusEl.textContent = '';
    }
    if (form) form.hidden = false;
    overlay.hidden = false;
    document.body.classList.add('is-inquire');
    overlay.querySelector('.inquire-close').focus();
  };

  const closeInquire = () => {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('is-inquire');
  };

  if (overlay) {
    overlay.querySelectorAll('.edition-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const on = !chip.classList.contains('is-on');
        chip.classList.toggle('is-on', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        syncSubject(currentWork);
        if (statusEl && statusEl.textContent === 'Choose original or print.') {
          statusEl.hidden = true;
          statusEl.textContent = '';
        }
      });
    });
  }

  prevBtn.addEventListener('click', () => setActive(index - 1));
  nextBtn.addEventListener('click', () => setActive(index + 1));

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      setActive(index - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setActive(index + 1);
      e.preventDefault();
    }
  });

  let startX = null;
  let startY = null;
  slidesContainer.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
  });
  slidesContainer.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = null;
    startY = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      setActive(index + (dx > 0 ? -1 : 1));
      return;
    }
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      const t = e.target;
      if (t.closest('.inquire-open') || t.closest('.slide.active img') || t.closest('.slide.active')) {
        if (t.closest('a.inquire-open')) return;
        openInquire(slides[index]);
      }
    }
  });

  document.querySelectorAll('.inquire-open').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const slide = link.closest('.slide');
      openInquire(slide || slides[index]);
    });
  });

  overlay.querySelector('.inquire-close').addEventListener('click', closeInquire);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeInquire();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInquire();
  });

  const AJAX = 'https://st333inqfn29.azurewebsites.net/api/inquire';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const gotcha = form.querySelector('[name="_gotcha"]');
    if (gotcha && gotcha.value) return;
    const val = editionValue();
    if (!val) {
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = 'Choose original or print.';
      }
      const row = document.getElementById('inquire-edition-row') || overlay.querySelector('.edition-row');
      if (row) {
        row.focus();
        if (row.scrollIntoView) row.scrollIntoView({ block: 'nearest' });
      }
      return;
    }
    syncSubject(currentWork);
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
      try { json = JSON.parse(bodyText); } catch (parseErr) {}
      console.log('inquire', res.status, bodyText);
      const ok = res.ok && (json.success === true || json.success === 'true');
      if (!ok) {
        const raw = (json && (json.message || json.error)) || bodyText || ('HTTP ' + res.status);
        const lower = String(raw).toLowerCase() + ' ' + res.status;
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = ((res.status === 429) || /rate|limit|too many/.test(lower))
            ? 'Could not send. Please try again.'
            : (String(raw).trim() || 'Could not send. Please try again.');
        }
        return;
      }
      form.hidden = true;
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = "Sent. I'll reply by email.";
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

  carousel.setAttribute('tabindex', '0');

  const applyHash = () => {
    const h = (location.hash || '').replace('#', '');
    if (!h || h === 'picker' || h === 'inquire') return;
    const i = slides.findIndex((s) => {
      const file = s.querySelector('img').getAttribute('src').split('/').pop();
      const stem = file.replace(/\.[^.]+$/, '');
      return h === file || h === stem;
    });
    if (i >= 0) setActive(i);
  };
  applyHash();
  window.addEventListener('hashchange', applyHash);
});
