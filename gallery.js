(() => {
  const figures = Array.from(document.querySelectorAll(".look"));
  const room = document.getElementById("room");
  if (!figures.length || !room) return;

  const img = document.getElementById("room-image");
  const title = document.getElementById("room-title");
  const medium = document.getElementById("room-medium");
  const indexEl = document.getElementById("room-index");
  const btnClose = document.getElementById("room-close");
  const btnPrev = document.getElementById("room-prev");
  const btnNext = document.getElementById("room-next");
  const main = document.getElementById("main");
  const mast = document.querySelector(".mast");
  const colophon = document.querySelector(".colophon");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fadeMs = reduceMotion ? 0 : 900;

  const works = figures.map((fig, i) => {
    const picture = fig.querySelector("img");
    return {
      src: fig.dataset.src || (picture && picture.getAttribute("src")) || "",
      title: fig.dataset.title || "",
      medium: fig.dataset.medium || "",
      alt: (picture && picture.getAttribute("alt")) || "",
      opener: fig.querySelector(".look-open") || fig,
      index: i,
    };
  });

  let current = 0;
  let lastFocus = null;
  let startX = null;
  let fading = false;

  const pad = (n) => String(n).padStart(2, "0");

  const focusables = () => [btnClose, btnPrev, btnNext].filter(Boolean);

  const setChrome = (open) => {
    document.body.classList.toggle("is-room", open);
    if (main) {
      if (open) main.setAttribute("aria-hidden", "true");
      else main.removeAttribute("aria-hidden");
      if ("inert" in main) main.inert = open;
    }
    if (mast && "inert" in mast) mast.inert = open;
    if (colophon && "inert" in colophon) colophon.inert = open;
  };

  const paint = (i) => {
    const work = works[i];
    img.src = work.src;
    img.alt = work.alt;
    title.textContent = work.title;
    medium.textContent = work.medium;
    indexEl.textContent = `${pad(i + 1)} / ${pad(works.length)}`;
  };

  const setHash = (i) => {
    const next = `#work-${pad(i + 1)}`;
    if (location.hash !== next) {
      history.replaceState(null, "", next);
    }
  };

  const show = (i, { writeHash = true } = {}) => {
    const next = (i + works.length) % works.length;
    const opening = room.hasAttribute("hidden");

    if (opening) {
      lastFocus = document.activeElement;
      room.removeAttribute("hidden");
      setChrome(true);
      paint(next);
      current = next;
      if (!reduceMotion) {
        room.classList.add("is-enter");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => room.classList.remove("is-enter"));
        });
      }
      btnClose.focus();
    } else if (next === current) {
      return;
    } else if (reduceMotion || fading) {
      paint(next);
      current = next;
    } else {
      fading = true;
      room.classList.add("is-crossfade");
      window.setTimeout(() => {
        paint(next);
        current = next;
        room.classList.remove("is-crossfade");
        fading = false;
      }, fadeMs / 2);
    }

    if (writeHash) setHash(next);
  };

  const hide = () => {
    room.setAttribute("hidden", "");
    room.classList.remove("is-enter", "is-crossfade");
    fading = false;
    setChrome(false);
    if (location.hash) {
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    }
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  };

  works.forEach((work) => {
    work.opener.addEventListener("click", () => show(work.index));
  });

  btnClose.addEventListener("click", hide);
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));

  document.addEventListener("keydown", (event) => {
    if (room.hasAttribute("hidden")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      hide();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(current + 1);
      return;
    }
    if (event.key === "Tab") {
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  room.addEventListener(
    "touchstart",
    (event) => {
      startX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  room.addEventListener("touchend", (event) => {
    if (startX === null) return;
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) {
      show(current + (delta < 0 ? 1 : -1));
    }
    startX = null;
  });

  const fromHash = () => {
    const match = location.hash.match(/work-?(\d+)/i) || location.hash.match(/^#(\d{1,2})$/);
    if (!match) return;
    const number = parseInt(match[1], 10);
    if (number >= 1 && number <= works.length) {
      show(number - 1, { writeHash: false });
    }
  };

  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
