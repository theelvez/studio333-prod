(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("dust");
  const svg = document.getElementById("lines");

  if (canvas && canvas.getContext && !reduce) {
    const ctx = canvas.getContext("2d");
    const dots = [];
    const count = window.innerWidth < 700 ? 18 : 36;
    const resize = () => {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < count; i += 1) {
      dots.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.1 + 0.3,
        v: 0.00012 + Math.random() * 0.00022,
      });
    }
    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(196,180,138,0.55)";
      dots.forEach((d) => {
        d.y -= d.v;
        if (d.y < -0.02) d.y = 1.02;
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    };
    tick();
  }

  if (svg && !reduce) {
    const stars = Array.from(document.querySelectorAll(".star"));
    const draw = () => {
      const box = svg.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      svg.innerHTML = "";
      const pts = stars.map((el) => {
        const r = el.getBoundingClientRect();
        return [r.left - box.left + r.width / 2, r.top - box.top];
      });
      pts.forEach((a, i) => {
        pts.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
          if (dist < Math.min(box.width, box.height) * 0.28) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", a[0]);
            line.setAttribute("y1", a[1]);
            line.setAttribute("x2", b[0]);
            line.setAttribute("y2", b[1]);
            line.setAttribute("stroke", "rgba(196,180,138,0.28)");
            line.setAttribute("stroke-width", "0.6");
            svg.appendChild(line);
          }
        });
      });
    };
    draw();
    window.addEventListener("resize", draw);
  }

  if (!document.querySelector('link[href="constellation.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "constellation.css";
    document.head.appendChild(link);
  }

  const looks = Array.from(document.querySelectorAll(".look"));
  if (looks.length) {
    looks.forEach((el) => el.classList.add("is-wait"));
    if (reduce) {
      looks.forEach((el) => el.classList.add("is-seen"));
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-seen");
        });
      }, { threshold: 0.18 });
      looks.forEach((el) => io.observe(el));
    } else {
      looks.forEach((el) => el.classList.add("is-seen"));
    }
  }
})();
