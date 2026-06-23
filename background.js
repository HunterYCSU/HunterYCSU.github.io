(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // sparse set of points that drift very slowly
  const COUNT  = 25;
  const points = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * 1,
    y:  Math.random() * 1,
    ox: Math.random() * Math.PI * 2,
    oy: Math.random() * Math.PI * 2,
    s:  0.00008 + Math.random() * 0.00006,
  }));

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // resolve current positions
    const pts = points.map(p => ({
      x: (p.x + Math.sin(t * p.s + p.ox) * 0.35) * W,
      y: (p.y + Math.cos(t * p.s + p.oy) * 0.30) * H,
    }));

    // draw lines between all pairs
    ctx.lineWidth = 0.8;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        const maxD = W * 0.3;
        if (d > maxD) continue;
        const alpha = (1 - d / maxD) * 0.35;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(80, 80, 76, ${alpha})`;
        ctx.stroke();
      }
    }

    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();