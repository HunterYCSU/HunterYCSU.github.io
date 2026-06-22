/* transition.js — shared across all pages */

// ---- CURSOR ----
const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// ---- PAGE TRANSITIONS ----
const overlay = document.getElementById('page-transition');

function navigateTo(href) {
  if (!overlay) { window.location.href = href; return; }
  overlay.classList.remove('slide-out');
  overlay.classList.add('slide-in');
  overlay.style.pointerEvents = 'all';
  setTimeout(() => { window.location.href = href; }, 450);
}

document.querySelectorAll('a[data-transition]').forEach(link => {
  link.addEventListener('click', e => {
    const target = link.getAttribute('href');
    if (!target || target.startsWith('#') || target.startsWith('mailto') || target.startsWith('http')) return;
    e.preventDefault();
    navigateTo(target);
  });
});

// Slide out on arrival
window.addEventListener('pageshow', () => {
  if (!overlay) return;
  overlay.classList.remove('slide-in');
  overlay.classList.add('slide-out');
  overlay.style.pointerEvents = 'none';
});

// ---- ACTIVE NAV ----
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === path || (path === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

const burger = document.querySelector('.nav-burger');
const drawer = document.querySelector('.nav-drawer');
const scrim  = document.querySelector('.nav-scrim');

function closeDrawer() {
  burger.classList.remove('open');
  drawer.classList.remove('open');
  scrim.classList.remove('open');
}

if (burger) {
  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : (burger.classList.add('open'), drawer.classList.add('open'), scrim.classList.add('open'));
  });
}
if (scrim) scrim.addEventListener('click', closeDrawer);
document.querySelectorAll('.nav-drawer a').forEach(a => a.addEventListener('click', closeDrawer));