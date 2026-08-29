(() => {
  const frames = Array.from(document.querySelectorAll(".frame"));
  const caption = document.getElementById("film-caption");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!frames.length) return;
  let i = 0;
  const hold = 4200;

  const show = (n) => {
    frames.forEach((el, idx) => el.classList.toggle("is-on", idx === n));
    const t = frames[n];
    caption.innerHTML = `<span>${t.dataset.index}</span> ${t.dataset.title}`;
  };

  if (reduce) {
    document.body.classList.add("is-settled");
    return;
  }

  show(0);
  window.setTimeout(() => document.body.classList.add("is-settled"), 5200);

  window.setInterval(() => {
    i = (i + 1) % frames.length;
    show(i);
  }, hold);
})();
