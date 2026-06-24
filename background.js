(function () {
  const existing = document.getElementById('bg-canvas');
  if (existing) existing.remove();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', 'bg-canvas');
  svg.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.prepend(svg);

  const COUNT = 25;
  let W, H, points;

  function init() {
    W = window.innerWidth;
    H = window.innerHeight;
    points = Array.from({ length: COUNT }, (_, i) => ({
      x:  (i % 4) / 3 + (Math.random() - 0.5) * 0.15,
      y:  Math.floor(i / 4) / 3 + (Math.random() - 0.5) * 0.15,
      ox: Math.random() * Math.PI * 2,
      oy: Math.random() * Math.PI * 2,
      s:  0.0002 + Math.random() * 0.00015,
    }));
  }

  window.addEventListener('resize', () => { W = window.innerWidth; H = window.innerHeight; });

  // pre-create line elements for every pair
  const lines = [];
  const totalPairs = (COUNT * (COUNT - 1)) / 2;
  for (let i = 0; i < totalPairs; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', 'rgba(180,180,176,1)');
    svg.appendChild(line);
    lines.push(line);
  }

  let t = 0;
  function draw() {
    const zoom = window.devicePixelRatio || 1;
    const strokeW = zoom > 1.5 ? 3.5 / zoom : 1.5;
    const pts = points.map(p => ({
      x: (p.x + Math.sin(t * p.s + p.ox) * 0.35) * W,
      y: (p.y + Math.cos(t * p.s + p.oy) * 0.30) * H,
    }));

    const maxD = Math.max(W, H) * 0.45;
    let li = 0;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        const line = lines[li++];
        if (d > maxD) {
          line.setAttribute('stroke-opacity', '0');
        } else {
          const alpha = (1 - d / maxD) * 0.35;
          line.setAttribute('x1', pts[i].x);
          line.setAttribute('y1', pts[i].y);
          line.setAttribute('x2', pts[j].x);
          line.setAttribute('y2', pts[j].y);
          line.setAttribute('stroke-opacity', alpha);
          line.setAttribute('stroke-width', strokeW);
        }
      }
    }

    t++;
    requestAnimationFrame(draw);
  }

  init();
  draw();
})();