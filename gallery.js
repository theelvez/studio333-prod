(() => {
  const figures = Array.from(document.querySelectorAll(".look"));
  const zoom = document.getElementById("zoom");
  const zoomStage = document.getElementById("zoom-stage");
  const zoomImg = document.getElementById("zoom-img");
  const zoomCap = document.getElementById("zoom-cap");
  const zoomClose = document.querySelector(".zoom-close");
  if (!figures.length || !zoom || !zoomImg) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const works = figures.map((fig, i) => {
    const picture = fig.querySelector("img");
    return {
      src: fig.dataset.src || (picture && picture.getAttribute("src")) || "",
      title: fig.dataset.title || "",
      alt: (picture && picture.getAttribute("alt")) || "",
      opener: fig.querySelector(".look-open") || fig,
      index: i
    };
  });

  let current = 0;
  let lastFocus = null;
  let zoomed = false;

  const pad = (n) => String(n).padStart(2, "0");

  const paint = (i) => {
    const work = works[i];
    zoomImg.src = work.src;
    zoomImg.alt = work.alt || work.title;
    zoomCap.textContent = pad(i + 1) + "  " + work.title;
  };

  const setHash = (i) => {
    const next = "#work-" + pad(i + 1);
    if (location.hash !== next) history.replaceState(null, "", next);
  };

  const open = (i, writeHash) => {
    current = (i + works.length) % works.length;
    paint(current);
    if (writeHash !== false) setHash(current);
    if (zoomed) return;
    zoomed = true;
    lastFocus = document.activeElement;
    document.body.classList.add("is-zoom");
    zoom.hidden = false;
    zoom.classList.add("is-enter");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        zoom.classList.remove("is-enter");
        zoom.classList.add("is-open");
      });
    });
    zoomClose.focus();
  };

  const show = (i) => {
    const next = (i + works.length) % works.length;
    if (!zoomed) {
      open(next);
      return;
    }
    if (next === current) return;
    current = next;
    paint(current);
    setHash(current);
  };

  const hide = () => {
    if (!zoomed) return;
    zoomed = false;
    zoom.classList.remove("is-open");
    const finish = () => {
      zoom.hidden = true;
      document.body.classList.remove("is-zoom");
      if (location.hash) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    if (reduce) {
      finish();
      return;
    }
    zoom.classList.add("is-enter");
    window.setTimeout(finish, 420);
  };

  works.forEach((work) => {
    work.opener.addEventListener("click", () => open(work.index));
  });

  zoomClose.addEventListener("click", hide);

  let sx = 0;
  let sy = 0;
  let active = false;
  zoomStage.addEventListener("pointerdown", (e) => {
    active = true;
    sx = e.clientX;
    sy = e.clientY;
  });
  zoomStage.addEventListener("pointerup", (e) => {
    if (!active) return;
    active = false;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.abs(dx) >= 46 && Math.abs(dx) > Math.abs(dy)) {
      show(current + (dx < 0 ? 1 : -1));
      return;
    }
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) hide();
  });
  zoomStage.addEventListener("pointercancel", () => {
    active = false;
  });

  document.addEventListener("keydown", (event) => {
    if (!zoomed) return;
    if (event.key === "Escape") {
      event.preventDefault();
      hide();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(current + 1);
    }
  });

  const fromHash = () => {
    const match = location.hash.match(/work-?(\d+)/i) || location.hash.match(/^#(\d{1,2})$/);
    if (!match) return;
    const number = parseInt(match[1], 10);
    if (number >= 1 && number <= works.length) open(number - 1, false);
  };

  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
