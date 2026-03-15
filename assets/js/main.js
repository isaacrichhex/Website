/* ============================================
   HEXORIS — MAIN JS
   ============================================ */

// === HERO CANVAS — particle network ===
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildNodes();
  }

  function buildNodes() {
    const count = Math.min(Math.floor((W * H) / 20000), 60);
    nodes = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r:  1 + Math.random() * 1.5
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const R = 29, G = 168, B = 74;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 170) {
          const a = (1 - dist / 170) * 0.32;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${R},${G},${B},${a})`;
          ctx.lineWidth = 1.1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${R},${G},${B},0.55)`;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick() {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
    draw();
    requestAnimationFrame(tick);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 180);
  }, { passive: true });

  resize();
  tick();
})();

// === NAV SCROLL ===
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// === MOBILE NAV ===
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');

function closeNav() {
  navLinks?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
  hamburger?.querySelectorAll('span').forEach(s => {
    s.style.transform = '';
    s.style.opacity = '';
  });
}

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    closeNav();
  }
});

navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

document.addEventListener('click', (e) => {
  if (navLinks?.classList.contains('open') && !nav?.contains(e.target)) closeNav();
});

// === ACTIVE NAV LINK ===
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a:not(.nav__cta)').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// === FADE-UP OBSERVER ===
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// === COUNTER ANIMATION ===
function animateCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const prefix  = el.dataset.prefix || '';
  const suffix  = el.dataset.suffix || '';
  const decimal = target % 1 !== 0;
  const dur     = 1800;
  const start   = performance.now();

  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + (decimal ? (e * target).toFixed(1) : Math.floor(e * target)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      cio.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => cio.observe(el));

// === CONTACT FORM ===
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn    = form.querySelector('[type="submit"]');
    const status = document.getElementById('form-status');
    const orig   = btn.innerHTML;

    btn.innerHTML = 'Sending…';
    btn.disabled  = true;
    if (status) status.textContent = '';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        if (status) {
          status.textContent = "Message sent — we'll be in touch shortly.";
          status.style.color = 'var(--green)';
        }
        form.reset();
      } else {
        throw new Error('server error');
      }
    } catch {
      if (status) {
        status.textContent = 'Something went wrong. Please email info@hexoris.com directly.';
        status.style.color = '#c94444';
      }
    }

    btn.innerHTML = orig;
    btn.disabled  = false;
  });
}
