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
  if (!plane || !img || !titleEl) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  let index = 0;
  let busy = false;

  const preload = (i) => {
    const n = new Image();
    n.src = works[(i + works.length) % works.length].src;
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
      img.src = work.src;
      img.alt = work.title;
      numEl.textContent = work.num;
      titleEl.textContent = work.title;
      countEl.textContent = work.num + " / 22";
      titleEl.classList.remove("is-leaving");
      if (!reduce) {
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
    titleEl.classList.add("is-leaving");
    window.setTimeout(() => {
      apply();
      busy = false;
    }, 360);
  };

  prevBtn.addEventListener("click", () => render(index - 1, -1));
  nextBtn.addEventListener("click", () => render(index + 1, 1));

  window.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      render(index - 1, -1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      render(index + 1, 1);
    }
  });

  let sx = 0;
  let sy = 0;
  let tracking = false;
  stage.addEventListener("pointerdown", (e) => {
    tracking = true;
    sx = e.clientX;
    sy = e.clientY;
  });
  stage.addEventListener("pointerup", (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.abs(dx) < 46 || Math.abs(dx) < Math.abs(dy)) return;
    render(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  stage.addEventListener("pointercancel", () => {
    tracking = false;
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
