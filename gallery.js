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
  let index = 0;

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

  const fillForm = (work) => {
    document.getElementById('inquire-img').src = work.src;
    document.getElementById('inquire-img').alt = work.title + ' artwork';
    document.getElementById('inquire-title').textContent = work.title;
    document.getElementById('inquire-medium').textContent = work.medium;
    document.getElementById('inquire-painting').value = work.title;
    document.getElementById('inquire-image').value = work.filename;
    document.getElementById('inquire-index').value = String(work.index + 1);
    document.getElementById('inquire-subject').value =
      'studio333 inquiry — ' + work.title + ' (' + work.filename + ')';
    const urlsEl = document.getElementById('inquire-urls');
    if (urlsEl) urlsEl.value = absoluteUrls(work);
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

  form.addEventListener('submit', (e) => {
    const gotcha = form.querySelector('[name="_gotcha"]');
    if (gotcha && gotcha.value) e.preventDefault();
  });

  carousel.setAttribute('tabindex', '0');

  const applyHash = () => {
    const h = (location.hash || '').replace('#', '');
    if (!h) return;
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
