(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles, mouse;

  mouse = { x: -9999, y: -9999 };
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const PARTICLE_COUNT = 108;
  const MAX_DIST       = 150;   // line draw distance
  const MOUSE_DIST     = 100;   // repel radius
  const REPEL_FORCE    = 0.012;
  const BASE_SPEED     = 0.3;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }
  window.addEventListener("resize", resize);

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  rand(0, W),
      y:  rand(0, H),
      vx: rand(-BASE_SPEED, BASE_SPEED),
      vy: rand(-BASE_SPEED, BASE_SPEED),
      r:  rand(1, 2.2),
    }));
  }

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    // ambient corner glow
    const glow = ctx.createRadialGradient(W * 0.75, H * 0.25, 0, W * 0.75, H * 0.25, W * 0.55);
    glow.addColorStop(0, "rgba(26,111,255,0.055)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // update + draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // mouse repel
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const md  = Math.hypot(mdx, mdy);
      if (md < MOUSE_DIST && md > 0) {
        const force = (MOUSE_DIST - md) / MOUSE_DIST;
        p.vx += (mdx / md) * force * REPEL_FORCE * 6;
        p.vy += (mdy / md) * force * REPEL_FORCE * 6;
      }

      // dampen so they don't rocket off
      p.vx *= 0.995;
      p.vy *= 0.995;

      // nudge back toward base speed if too slow
      const spd = Math.hypot(p.vx, p.vy);
      if (spd < 0.05) {
        p.vx += rand(-0.02, 0.02);
        p.vy += rand(-0.02, 0.02);
      }

      p.x += p.vx;
      p.y += p.vy;

      // wrap edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      // draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(26,111,255,0.55)";
      ctx.fill();

      // draw lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q   = particles[j];
        const dx  = p.x - q.x;
        const dy  = p.y - q.y;
        const d   = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(26,111,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
})();