document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('picker-grid');
  if (!grid) return;

  const overlay = document.getElementById('picker');
  const form = document.querySelector('.picker-form');
  const chosenEl = document.getElementById('picker-chosen');
  const paintingsEl = document.getElementById('picker-paintings');
  const subjectEl = document.getElementById('picker-subject');
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

  const fromSlides = Array.from(document.querySelectorAll('.slide')).map((slide) => {
    const img = slide.querySelector('img');
    const src = img.getAttribute('src');
    return {
      title: slide.querySelector('.piece-name').textContent.trim(),
      src,
      filename: src.split('/').pop()
    };
  });

  const works = fromSlides.length ? fromSlides : FALLBACK.map(([title, src]) => ({
    title,
    src,
    filename: src.split('/').pop()
  }));

  const titles = () => works.filter((w) => selected.has(w.title)).map((w) => w.title);

  const sync = () => {
    const list = titles();
    if (paintingsEl) paintingsEl.value = list.join(', ');
    if (subjectEl) {
      subjectEl.value = list.length
        ? 'studio333 general inquiry — ' + list.join(', ')
        : 'studio333 general inquiry';
    }
    if (chosenEl) {
      chosenEl.textContent = list.length
        ? (list.length === 1 ? '1 work selected' : list.length + ' works selected')
        : 'No works selected — general inquiry';
    }
    grid.querySelectorAll('.picker-tile').forEach((btn) => {
      btn.classList.toggle('is-on', selected.has(btn.dataset.title));
      btn.setAttribute('aria-pressed', selected.has(btn.dataset.title) ? 'true' : 'false');
    });
  };

  grid.innerHTML = '';
  works.forEach((work) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'picker-tile';
    btn.dataset.title = work.title;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', work.title);
    btn.innerHTML = '<img src="' + work.src + '" alt="">';
    btn.addEventListener('click', () => {
      if (selected.has(work.title)) selected.delete(work.title);
      else selected.add(work.title);
      sync();
    });
    grid.appendChild(btn);
  });
  sync();

  const openPicker = () => {
    if (!overlay) return;
    const inquire = document.getElementById('inquire');
    if (inquire) {
      inquire.hidden = true;
      document.body.classList.remove('is-inquire');
    }
    overlay.hidden = false;
    document.body.classList.add('is-picker');
    const closeBtn = overlay.querySelector('.picker-close');
    if (closeBtn) closeBtn.focus();
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
    form.addEventListener('submit', (e) => {
      const gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) e.preventDefault();
      sync();
    });
  }
});
