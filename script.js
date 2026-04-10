/* ============================================================
   FUSION GYM — script.js  (shared across all pages)
   ============================================================ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Animate hero title lines
    document.querySelectorAll('.hero-line em').forEach((el, i) => {
      el.style.animationDelay = (0.3 + i * 0.15) + 's';
    });
  }, 1800);
});

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});

(function animateFollower() {
  fx += (mx - fx) * 0.11;
  fy += (my - fy) * 0.11;
  if (follower) { follower.style.left = fx + 'px'; follower.style.top = fy + 'px'; }
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .plan-card, .trainer-card, .g-item, .class-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    if (follower) { follower.style.transform = 'translate(-50%,-50%) scale(1.4)'; follower.style.opacity = '0.25'; }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    if (follower) { follower.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.opacity = '0.5'; }
  });
});

/* ── DARK MODE ── */
const darkToggle = document.getElementById('darkToggle');
const darkIcon = document.getElementById('darkIcon');

const applyDark = (on) => {
  document.body.classList.toggle('dark', on);
  if (darkIcon) darkIcon.className = on ? 'fas fa-sun' : 'fas fa-moon';
};

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const next = !document.body.classList.contains('dark');
    localStorage.setItem('fgDark', next);
    applyDark(next);
  });
}
applyDark(localStorage.getItem('fgDark') === 'true');

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    if (mobileOverlay) mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileOverlay && mobileOverlay.classList.contains('open') ? 'hidden' : '';
  });
}

document.querySelectorAll('.mobile-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SCROLL TO TOP ── */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── SMOOTH SCROLL (for anchor links on same page) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
  // Stagger cards within the same parent
  const siblings = el.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  let idx = 0;
  siblings.forEach((sib, si) => { if (sib === el) idx = si; });
  el.style.transitionDelay = Math.min(idx * 0.08, 0.4) + 's';
  revealObs.observe(el);
});

/* ── ANIMATED COUNTERS ── */
const counterRow = document.getElementById('counterRow');
let counted = false;
if (counterRow) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1800, step = target / (duration / 16);
        let curr = 0;
        const iv = setInterval(() => {
          curr = Math.min(curr + step, target);
          counter.textContent = Math.floor(curr).toLocaleString();
          if (curr >= target) clearInterval(iv);
        }, 16);
      });
    }
  }, { threshold: 0.5 }).observe(counterRow);
}

/* ── GALLERY FILTER ── */
document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.getAttribute('data-f');
    document.querySelectorAll('.g-item').forEach(item => {
      const match = f === 'all' || item.getAttribute('data-cat') === f;
      item.style.display = match ? '' : 'none';
      if (match) { item.style.animation = 'none'; requestAnimationFrame(() => { item.style.animation = 'fadeUp 0.4s ease'; }); }
    });
  });
});

/* ── ACTIVE NAV LINK (homepage scroll sections) ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(sec => { if (sec.getBoundingClientRect().top <= 120) cur = sec.id; });
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active-nav', href === '#' + cur);
  });
}, { passive: true });