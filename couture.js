(() => {
  const shots = Array.from(document.querySelectorAll(".shot"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    shots.forEach((el) => el.classList.add("is-awake"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-awake");
    });
  }, { threshold: 0.28 });
  shots.forEach((el) => io.observe(el));
})();
