(() => {
  const mosaic = document.getElementById("mosaic");
  const enter = document.getElementById("enter-collection");
  if (!mosaic) return;
  const tiles = Array.from(mosaic.querySelectorAll(".tile"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pick = (n) => {
    const copy = tiles.slice();
    const out = [];
    while (copy.length && out.length < n) {
      out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
  };

  const cycle = () => {
    if (document.body.classList.contains("is-melting")) return;
    tiles.forEach((t) => t.classList.remove("is-dissolving", "is-fracture"));
    pick(window.innerWidth < 800 ? 2 : 4).forEach((t, i) => {
      t.classList.add(i % 2 ? "is-fracture" : "is-dissolving");
      window.setTimeout(() => t.classList.remove("is-dissolving", "is-fracture"), 1800);
    });
  };

  if (!reduce) {
    window.setInterval(cycle, 2800);
    window.setTimeout(cycle, 900);
  }

  const melt = (href) => {
    if (reduce) {
      location.href = href;
      return;
    }
    document.body.classList.add("is-melting");
    window.setTimeout(() => { location.href = href; }, 1100);
  };

  if (enter) {
    enter.addEventListener("click", (e) => {
      e.preventDefault();
      melt("gallery.html?from=mosaic");
    });
  }
})();
