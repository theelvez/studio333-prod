document.addEventListener("DOMContentLoaded", () => {
  const looks = Array.from(document.querySelectorAll(".look"));
  const room = document.getElementById("room");
  if (!looks.length || !room) return;

  const img = document.getElementById("room-image");
  const title = document.getElementById("room-title");
  const medium = document.getElementById("room-medium");
  const count = document.getElementById("room-count");
  const closeBtn = document.getElementById("room-close");
  const prevBtn = document.getElementById("room-prev");
  const nextBtn = document.getElementById("room-next");
  let index = 0;
  let lastFocus = null;

  const open = (i) => {
    index = (i + looks.length) % looks.length;
    const el = looks[index];
    img.src = el.dataset.src;
    img.alt = el.dataset.title + " artwork";
    title.textContent = el.dataset.title;
    medium.textContent = el.dataset.medium;
    count.textContent = el.dataset.index + " / 22";
    room.classList.add("is-open");
    room.setAttribute("aria-hidden", "false");
    lastFocus = document.activeElement;
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    room.classList.remove("is-open");
    room.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  looks.forEach((el, i) => {
    el.addEventListener("click", () => open(i));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => open(index - 1));
  nextBtn.addEventListener("click", () => open(index + 1));

  document.addEventListener("keydown", (e) => {
    if (!room.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") open(index - 1);
    if (e.key === "ArrowRight") open(index + 1);
  });

  let startX = null;
  room.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  room.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) open(delta > 0 ? index - 1 : index + 1);
    startX = null;
  });
});
