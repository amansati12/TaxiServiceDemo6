/* =====================================================
   ZENITH — Luxury Chauffeur Service — Main JS
   ===================================================== */
'use strict';

/* === Preloader === */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) setTimeout(() => { pre.classList.add('out'); setTimeout(() => pre.remove(), 600); }, 1200);
});

/* === Star field generator === */
function generateStars() {
  const wrap = document.querySelector('.stars-wrap');
  if (!wrap) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;--delay:${Math.random()*5}s;width:${Math.random()>.7?3:2}px;height:${Math.random()>.7?3:2}px`;
    wrap.appendChild(s);
  }
}
generateStars();

/* === Navbar === */
const nav = document.querySelector('.navbar-z');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
}

/* === Active nav link === */
(function() {
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-z').forEach(a => {
    if (a.getAttribute('href') === cur) a.classList.add('active');
  });
})();

/* === Mobile nav === */
(function() {
  const toggle = document.querySelector('.nav-toggle-z');
  const menu = document.querySelector('.mobile-nav-z');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = open ? 'rotate(45deg) translate(3px,5px)' : '';
    spans[1].style.opacity = open ? '0' : '';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(3px,-5px)' : '';
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      menu.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
    }
  });
})();

/* === Back to top === */
const btt = document.getElementById('btt-z');
if (btt) {
  window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 400));
  btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* === Scroll reveal === */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold:.1, rootMargin:'0px 0px -40px 0px' });
document.querySelectorAll('.reveal-z,.reveal-left-z').forEach(el => obs.observe(el));

/* === Number counters === */
function runCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const dur = 1800, step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur).toLocaleString();
  }, 16);
}
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); cObs.unobserve(e.target); } });
}, { threshold:.5 });
document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

/* === Vehicle selector === */
document.querySelectorAll('.v-card-z').forEach(card => {
  card.addEventListener('click', function() {
    document.querySelectorAll('.v-card-z').forEach(c => c.classList.remove('sel'));
    this.classList.add('sel');
    const r = this.querySelector('input[type=radio]');
    if (r) r.checked = true;
    const e = document.getElementById('vehicleError');
    if (e) e.style.display = 'none';
  });
});

/* === Fleet filter === */
(function() {
  const btns = document.querySelectorAll('.filter-z[data-f]');
  const items = document.querySelectorAll('[data-cat]');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.getAttribute('data-f');
      items.forEach(item => {
        item.style.display = f==='all' || item.getAttribute('data-cat')===f ? '' : 'none';
      });
    });
  });
})();

/* === Booking form validation === */
(function() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  const di = form.querySelector('[name=date]');
  if (di) di.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('.input-z[required]').forEach(el => { if (!vf(el)) ok = false; });
    if (!form.querySelector('input[name=vehicle]:checked')) {
      const ve = document.getElementById('vehicleError');
      if (ve) ve.style.display = 'block';
      ok = false;
    }
    const tc = form.querySelector('#termsCheck');
    const te = document.getElementById('termsErr');
    if (tc && !tc.checked) { if (te) te.style.display='block'; ok=false; }
    else if (te) te.style.display='none';
    if (ok) {
      form.style.display = 'none';
      const s = document.getElementById('bookingSuccess');
      if (s) { s.style.display='block'; s.scrollIntoView({behavior:'smooth',block:'center'}); }
      const r = document.getElementById('bookingRef');
      if (r) r.textContent = 'ZNT-' + new Date().getFullYear() + '-' + Math.floor(1000+Math.random()*9000);
    }
  });

  form.querySelectorAll('.input-z').forEach(el => {
    el.addEventListener('blur', () => vf(el));
    el.addEventListener('input', () => { if (el.classList.contains('err')) vf(el); });
  });

  function vf(el) {
    const v = el.value.trim(), n = el.name;
    let ok = true;
    if (n==='email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    else if (n==='phone') ok = /^[\d\s+\-()]{7,15}$/.test(v);
    else if (n==='date') { const t = new Date().toISOString().split('T')[0]; ok = v !== '' && v >= t; }
    else ok = v.length > 0;
    el.classList.toggle('err', !ok);
    el.classList.toggle('ok', ok);
    return ok;
  }
})();

/* === Contact form === */
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('.input-z[required]').forEach(el => {
      const v = el.value.trim();
      let valid = v.length > 0;
      if (el.name==='email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      el.classList.toggle('err', !valid);
      el.classList.toggle('ok', valid);
      if (!valid) ok = false;
    });
    if (ok) {
      form.reset();
      form.querySelectorAll('.input-z').forEach(el => el.classList.remove('ok','err'));
      const s = document.getElementById('contactSuccess');
      if (s) { s.style.display='block'; setTimeout(()=>s.style.display='none',5000); }
    }
  });
})();

/* === Tour book buttons === */
document.querySelectorAll('.tour-book-z').forEach(btn => {
  btn.addEventListener('click', function() {
    const pkg = this.getAttribute('data-pkg');
    const price = this.getAttribute('data-price');
    window.location.href = `booking.html?pkg=${encodeURIComponent(pkg)}&price=${encodeURIComponent(price)}`;
  });
});

/* === Prefill booking from URL === */
(function() {
  const p = new URLSearchParams(window.location.search);
  const pkg = p.get('pkg');
  if (pkg) {
    const n = document.querySelector('[name=notes]');
    if (n) n.value = `Package: ${pkg}${p.get('price') ? ' — ₹'+p.get('price') : ''}`;
  }
})();

/* === FAQ === */
document.querySelectorAll('.faq-q-z').forEach(btn => {
  btn.addEventListener('click', function() {
    const a = this.nextElementSibling;
    const p = this.querySelector('.faq-plus');
    const open = a.style.display === 'block';
    document.querySelectorAll('.faq-a-z').forEach(x => x.style.display='none');
    document.querySelectorAll('.faq-plus').forEach(x => x.textContent='+');
    if (!open) { a.style.display='block'; if(p) p.textContent='−'; }
  });
});

/* === Parallax hero bg === */
(function() {
  const bg = document.querySelector('.hero-bg-img');
  if (!bg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { bg.style.transform=`translateY(${window.scrollY*.25}px)`; ticking=false; });
      ticking = true;
    }
  });
})();
