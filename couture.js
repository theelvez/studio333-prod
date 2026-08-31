(() => {
  const works = [
    ["01", "Winter Light"],
    ["02", "Aerial Frost"],
    ["03", "Veiled Branches"],
    ["04", "Celestial Drift"],
    ["05", "Radiant Mist"],
    ["06", "Silent Echoes"],
    ["07", "Golden Veil"],
    ["08", "Twilight Passage"],
    ["09", "Frosted Horizon"],
    ["10", "Echoing Stillness"],
    ["11", "Opaline Dusk"],
    ["12", "Shifting Silence"],
    ["13", "Gilded Whisper"],
    ["14", "Luminous Veins"],
    ["15", "Hushed Aurora"],
    ["16", "Crystalline Path"],
    ["17", "Solstice Veil"],
    ["18", "Frozen Reverie"],
    ["19", "Silent Prism"],
    ["20", "Opal Frost"],
    ["21", "Aurora Drift"],
    ["22", "Radiant Spiral"]
  ].map(([num, title], i) => ({
    num,
    title,
    src: "assets/art-" + String(i + 1).padStart(2, "0") + ".jpg"
  }));

  const plane = document.querySelector(".plane");
  const frame = document.getElementById("frame");
  const stage = document.getElementById("stage");
  const img = document.getElementById("plane-img");
  const titleEl = document.getElementById("plane-title");
  const numEl = document.getElementById("plane-num");
  const countEl = document.getElementById("plane-count");
  const prevBtn = document.querySelector(".plane-prev");
  const nextBtn = document.querySelector(".plane-next");
  const zoom = document.getElementById("zoom");
  const zoomStage = document.getElementById("zoom-stage");
  const zoomImg = document.getElementById("zoom-img");
  const zoomCap = document.getElementById("zoom-cap");
  const zoomClose = document.querySelector(".zoom-close");
  if (!plane || !img || !titleEl || !zoom) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  let index = 0;
  let busy = false;
  let zoomed = false;

  const preload = (i) => {
    const n = new Image();
    n.src = works[(i + works.length) % works.length].src;
  };

  const paint = (work) => {
    img.src = work.src;
    img.alt = work.title;
    numEl.textContent = work.num;
    titleEl.textContent = work.title;
    countEl.textContent = work.num + " / 22";
    frame.setAttribute("aria-label", "View " + work.title + " full screen");
    zoomImg.src = work.src;
    zoomImg.alt = work.title;
    zoomCap.textContent = work.num + "  " + work.title;
  };

  const render = (next, dir) => {
    const i = (next + works.length) % works.length;
    if (i === index && dir) return;
    if (busy) return;
    const work = works[i];
    index = i;
    preload(i + 1);
    preload(i - 1);

    const apply = () => {
      paint(work);
      titleEl.classList.remove("is-leaving");
      if (!reduce && !zoomed) {
        titleEl.classList.remove("is-arriving");
        void titleEl.offsetWidth;
        titleEl.classList.add("is-arriving");
      }
      img.classList.remove("is-out");
    };

    if (reduce) {
      apply();
      return;
    }

    busy = true;
    img.classList.add("is-out");
    if (!zoomed) titleEl.classList.add("is-leaving");
    window.setTimeout(() => {
      apply();
      busy = false;
    }, 360);
  };

  const openZoom = () => {
    if (zoomed) return;
    const work = works[index];
    paint(work);
    zoomed = true;
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

  const closeZoom = () => {
    if (!zoomed) return;
    zoomed = false;
    zoom.classList.remove("is-open");
    const finish = () => {
      zoom.hidden = true;
      document.body.classList.remove("is-zoom");
      frame.focus();
    };
    if (reduce) {
      finish();
      return;
    }
    zoom.classList.add("is-enter");
    window.setTimeout(finish, 420);
  };

  const bindSwipe = (el, onTap, onSwipe) => {
    let sx = 0;
    let sy = 0;
    let active = false;
    el.addEventListener("pointerdown", (e) => {
      active = true;
      sx = e.clientX;
      sy = e.clientY;
    });
    el.addEventListener("pointerup", (e) => {
      if (!active) return;
      active = false;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) >= 46 && Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx < 0 ? 1 : -1);
        return;
      }
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) onTap();
    });
    el.addEventListener("pointercancel", () => {
      active = false;
    });
  };

  prevBtn.addEventListener("click", () => render(index - 1, -1));
  nextBtn.addEventListener("click", () => render(index + 1, 1));
  zoomClose.addEventListener("click", closeZoom);

  bindSwipe(stage, openZoom, (dir) => render(index + dir, dir));
  bindSwipe(zoomStage, closeZoom, (dir) => render(index + dir, dir));

  frame.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openZoom();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    if (e.key === "Escape" && zoomed) {
      e.preventDefault();
      closeZoom();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      render(index - 1, -1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      render(index + 1, 1);
    }
  });

  if (fine && !reduce && frame) {
    const reset = () => {
      plane.classList.remove("is-tracking");
      plane.style.setProperty("--rx", "0deg");
      plane.style.setProperty("--ry", "0deg");
      plane.style.setProperty("--lx", "42%");
      plane.style.setProperty("--ly", "32%");
    };
    frame.addEventListener("pointermove", (e) => {
      if (zoomed) return;
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      plane.classList.add("is-tracking");
      plane.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
      plane.style.setProperty("--rx", (-y * 5).toFixed(2) + "deg");
      plane.style.setProperty("--lx", (50 + x * 42).toFixed(1) + "%");
      plane.style.setProperty("--ly", (36 + y * 34).toFixed(1) + "%");
    });
    frame.addEventListener("pointerleave", reset);
  }

  preload(1);
  preload(works.length - 1);
})();
