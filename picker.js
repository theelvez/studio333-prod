document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('picker-grid');
  if (!grid) return;

  const overlay = document.getElementById('picker');
  const form = document.querySelector('.picker-form');
  const chosenEl = document.getElementById('picker-chosen');
  const paintingsEl = document.getElementById('picker-paintings');
  const urlsEl = document.getElementById('picker-urls');
  const subjectEl = document.getElementById('picker-subject');
  const statusEl = document.getElementById('picker-status');
  const AJAX = 'https://formsubmit.co/ajax/rrandjm43v3r@gmail.com';
  const selected = new Set();

  const FALLBACK = [
    ['Winter Light', 'assets/art-01.jpg'],
    ['Aerial Frost', 'assets/art-02.jpg'],
    ['Veiled Branches', 'assets/art-03.jpg'],
    ['Celestial Drift', 'assets/art-04.jpg'],
    ['Radiant Mist', 'assets/art-05.jpg'],
    ['Silent Echoes', 'assets/art-06.jpg'],
    ['Golden Veil', 'assets/art-07.jpg'],
    ['Twilight Passage', 'assets/art-08.jpg'],
    ['Frosted Horizon', 'assets/art-09.jpg'],
    ['Echoing Stillness', 'assets/art-10.jpg'],
    ['Opaline Dusk', 'assets/art-11.jpg'],
    ['Shifting Silence', 'assets/art-12.jpg'],
    ['Gilded Whisper', 'assets/art-13.jpg'],
    ['Luminous Veins', 'assets/art-14.jpg'],
    ['Hushed Aurora', 'assets/art-15.jpg'],
    ['Crystalline Path', 'assets/art-16.jpg'],
    ['Solstice Veil', 'assets/art-17.jpg'],
    ['Frozen Reverie', 'assets/art-18.jpg'],
    ['Silent Prism', 'assets/art-19.jpg'],
    ['Opal Frost', 'assets/art-20.jpg'],
    ['Aurora Drift', 'assets/art-21.jpg'],
    ['Radiant Spiral', 'assets/art-22.jpg'],
    ['Ivory Cascade', 'assets/art-23.jpg'],
    ['Pale Meridian', 'assets/art-24.jpg'],
    ['Haloed Rift', 'assets/art-25.jpg'],
    ['Alabaster Bloom', 'assets/art-26.jpg'],
    ['Quiet Ripple', 'assets/art-27.jpg'],
    ['Amber Fissure', 'assets/art-28.jpg'],
    ['Soft Orbit', 'assets/art-29.jpg'],
    ['Nocturne Frost', 'assets/art-30.jpg'],
    ['Feathered Dusk', 'assets/art-31.jpg'],
    ['Sunlit Fracture', 'assets/art-32.jpg'],
    ['Solar Bloom', 'assets/art-33.jpg']
  ];

  const seen = new Set();
  const fromSlides = [];
  document.querySelectorAll('.slide').forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return;
    const src = img.getAttribute('src');
    if (!src) return;
    const filename = src.split('/').pop();
    if (seen.has(filename)) return;
    seen.add(filename);
    const nameEl = slide.querySelector('.piece-name');
    fromSlides.push({
      title: nameEl ? nameEl.textContent.trim() : filename,
      src,
      filename
    });
  });

  const works = (fromSlides.length ? fromSlides : FALLBACK.map(([title, src]) => ({
    title,
    src,
    filename: src.split('/').pop()
  }))).filter((w) => w.src);

  const absoluteUrls = (work) => {
    const origin = window.location.origin;
    const src = work.src.replace(/^\/+/, '');
    const stem = work.filename.replace(/\.[^.]+$/, '');
    return origin + '/' + src + '\n' + origin + '/gallery.html#' + stem;
  };

  const sync = () => {
    const chosen = works.filter((w) => selected.has(w.title));
    const list = chosen.map((w) => w.title);
    if (paintingsEl) paintingsEl.value = list.join(', ');
    if (urlsEl) urlsEl.value = chosen.map(absoluteUrls).join('\n');
    if (subjectEl) {
      subjectEl.value = list.length
        ? 'studio333 general inquiry — ' + list.join(', ')
        : 'studio333 general inquiry';
    }
    if (chosenEl) {
      chosenEl.textContent = list.length
        ? list.length + ' selected'
        : 'None selected — general inquiry';
    }
    grid.querySelectorAll('.picker-tile').forEach((btn) => {
      const on = selected.has(btn.dataset.title);
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      const mark = btn.querySelector('.picker-check');
      if (mark) mark.hidden = !on;
    });
  };

  const revealTile = (btn, img) => {
    if (img.naturalWidth) btn.hidden = false;
  };

  grid.innerHTML = '';
  works.forEach((work) => {
    const probe = new Image();
    probe.decoding = 'async';
    probe.src = work.src;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'picker-tile';
    btn.hidden = true;
    btn.dataset.title = work.title;
    btn.dataset.file = work.filename;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Select ' + work.title);
    const img = document.createElement('img');
    img.className = 'picker-thumb';
    img.alt = work.title;
    img.width = 96;
    img.height = 96;
    img.decoding = 'async';
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
    const mark = document.createElement('span');
    mark.className = 'picker-check';
    mark.setAttribute('aria-hidden', 'true');
    mark.hidden = true;
    mark.textContent = '\u2713';
    btn.appendChild(img);
    btn.appendChild(mark);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (selected.has(work.title)) selected.delete(work.title);
      else selected.add(work.title);
      sync();
    });
    img.addEventListener('load', () => revealTile(btn, img));
    img.addEventListener('error', () => btn.remove());
    img.src = work.src;
    if (img.complete && img.naturalWidth) revealTile(btn, img);
    grid.appendChild(btn);
  });
  sync();

  const resetSent = () => {
    if (form) form.hidden = false;
    if (statusEl) {
      statusEl.hidden = true;
      statusEl.textContent = '';
    }
  };

  const openPicker = () => {
    resetSent();
    if (overlay) {
      const inquire = document.getElementById('inquire');
      if (inquire) {
        inquire.hidden = true;
        document.body.classList.remove('is-inquire');
      }
      overlay.hidden = false;
      document.body.classList.add('is-picker');
      const closeBtn = overlay.querySelector('.picker-close');
      if (closeBtn) closeBtn.focus();
    }
  };

  const closePicker = () => {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('is-picker');
  };

  document.querySelectorAll('.picker-open').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openPicker();
    });
  });

  if (overlay) {
    const closeBtn = overlay.querySelector('.picker-close');
    if (closeBtn) closeBtn.addEventListener('click', closePicker);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePicker();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePicker();
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) return;
      sync();
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
        statusEl.textContent = 'Sending\u2026';
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
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false || json.success === 'false') {
          throw new Error('send failed');
        }
        form.hidden = true;
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Inquiry sent.';
        }
      } catch (err) {
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Could not send. Please try again.';
        }
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }
});
