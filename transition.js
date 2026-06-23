const overlay = document.getElementById('page-transition');

function navigateTo(href) {
  if (!overlay) { window.location.href = href; return; }
  overlay.classList.remove('slide-out');
  overlay.classList.add('slide-in');
  overlay.style.pointerEvents = 'all';
  setTimeout(() => { window.location.href = href; }, 400);
}

document.querySelectorAll('a[data-t]').forEach(link => {
  link.addEventListener('click', e => {
    const target = link.getAttribute('href');
    if (!target || target.startsWith('http') || target.startsWith('mailto') || target.startsWith('#')) return;
    e.preventDefault();
    navigateTo(target);
  });
});

window.addEventListener('pageshow', () => {
  if (!overlay) return;
  overlay.classList.remove('slide-in');
  overlay.classList.add('slide-out');
  overlay.style.pointerEvents = 'none';
});
