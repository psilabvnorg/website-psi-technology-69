import './style.css';
import Lenis from 'lenis';
import { T, PRODUCTS, LINES, ADDRESSES, FOUNDERS, TESTIMONIALS } from './content.js';
import { slideshowHTML, initSlideshows } from './slideshow.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- language ----------
const LS_KEY = 'psi-lang';
let lang = 'vi';
try {
  const saved = localStorage.getItem(LS_KEY);
  // Vietnamese by default; only the visitor's own earlier choice overrides it.
  if (saved === 'vi' || saved === 'en') lang = saved;
} catch (e) {
  /* storage blocked: default to VI */
}
let filter = 'all';

const t = (k) => T[lang][k] ?? T.vi[k] ?? k;
const L = (b) => (typeof b === 'string' ? b : b[lang]);
const vnd = (n) => `${n.toLocaleString('vi-VN')} ₫`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function applyLang() {
  document.documentElement.lang = lang;
  document.title = t('meta.title');
  $('meta[name="description"]')?.setAttribute('content', t('meta.desc'));
  $$('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderLocs();
  renderLines();
  renderFilters();
  renderProducts();
  renderFounders();
  renderTestimonials();
}

function setLang(l) {
  lang = l;
  try {
    localStorage.setItem(LS_KEY, l);
  } catch (e) {
    /* ignore */
  }
  applyLang();
}

// ---------- renderers ----------
function renderLocs() {
  const html = ADDRESSES.map(
    (a, i) =>
      `<li><span class="c-k">${esc(t(a.key))}</span><span>${esc(a.text)}</span>${
        i === 2 ? ` <a class="maps" href="https://maps.app.goo.gl/xSj8SHUmgVqXiWc29" target="_blank" rel="noopener">${esc(t('contact.maps'))} ↗</a>` : ''
      }</li>`
  ).join('');
  $('#locs').innerHTML = html;
  $('#locs2').innerHTML = html;
}

const LINE_ICON = {
  move: '<path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0M15 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0M9 17h6M7 15l2-7h5l3 7M14 8V5h3"/>',
  charge: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  drive: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M7 10v4M11 10v4"/>',
  core: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
};

function renderLines() {
  $('#lineGrid').innerHTML = Object.entries(LINES)
    .map(([id, l], i) => {
      const n = PRODUCTS.filter((p) => p.line === id).length;
      return `<button type="button" class="line-card" data-line="${id}" data-reveal style="--d:${i * 0.08}s">
        <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LINE_ICON[id]}</svg>
        <span class="line-name">PSI ${l.name}</span>
        <span class="line-label">${esc(L(l.label))}</span>
        <span class="line-desc">${esc(t('lines.' + id))}</span>
        <span class="line-count">${n} ${esc(n === 1 ? t('lines.count1') : t('lines.count'))} →</span>
      </button>`;
    })
    .join('');
  $$('.line-card').forEach((b) =>
    b.addEventListener('click', () => {
      filter = b.dataset.line;
      renderFilters();
      renderProducts();
      scrollToEl('#products');
    })
  );
  observeReveals();
}

function renderFilters() {
  const keys = ['all', ...Object.keys(LINES)];
  $('#filters').innerHTML = keys
    .map(
      (k) =>
        `<button type="button" class="pill" data-f="${k}" aria-pressed="${filter === k}">${
          k === 'all' ? esc(t('products.all')) : 'PSI ' + LINES[k].name
        }</button>`
    )
    .join('');
  $$('#filters .pill').forEach((b) =>
    b.addEventListener('click', () => {
      filter = b.dataset.f;
      renderFilters();
      renderProducts();
    })
  );
}

function renderProducts() {
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.line === filter);
  $('#prodGrid').innerHTML = list
    .map((p, i) => {
      const idx = PRODUCTS.indexOf(p) + 1;
      const specs = p.specs
        .map((s) => `<div><dt>${esc(s.v)}${L(s.u) ? `<small>${esc(L(s.u))}</small>` : ''}</dt><dd>${esc(L(s.l))}</dd></div>`)
        .join('');
      return `<article class="card" data-reveal style="--d:${(i % 3) * 0.08}s">
        ${slideshowHTML(p.imgs, {
          alt: esc(L(p.alt)),
          tag: `${String(idx).padStart(2, '0')} · PSI ${LINES[p.line].name}`,
          labels: { prev: esc(t('slide.prev')), next: esc(t('slide.next')), go: esc(t('slide.go')) },
        })}
        <div class="card-body">
          <h3>${esc(L(p.name))}</h3>
          <p class="tagline">${esc(L(p.tagline))}</p>
          <dl class="specs">${specs}</dl>
          <div class="card-foot">
            <div class="price"><span>${esc(t('products.price'))}</span><strong>${p.price ? vnd(p.price) : esc(t('products.quote'))}</strong></div>
            <a class="btn btn-sm btn-grad" href="https://m.me/tungxethovn" target="_blank" rel="noopener">${esc(
              p.price ? t('products.order') : t('products.getquote')
            )}</a>
          </div>
        </div>
      </article>`;
    })
    .join('');
  initSlideshows($('#prodGrid'));
  observeReveals();
}

// ---------- founders & testimonials ----------
function renderFounders() {
  $('#founderGrid').innerHTML = FOUNDERS.map(
    (f, i) => `<article class="founder" data-reveal style="--d:${(i % 2) * 0.08}s">
      <img src="${f.img}" alt="${esc(f.name)}" width="112" height="112" loading="lazy" />
      <div>
        <h4>${esc(f.name)}</h4>
        <p class="f-role">${esc(L(f.role))}</p>
        <p class="f-bio">${esc(L(f.bio))}</p>
      </div>
    </article>`
  ).join('');
  observeReveals();
}

function renderTestimonials() {
  $('#testiGrid').innerHTML = TESTIMONIALS.map(
    (q, i) => `<figure class="testi" data-reveal style="--d:${(i % 3) * 0.08}s">
      <img src="${q.img}" alt="" width="480" height="640" loading="lazy" />
      <div>
        <blockquote>“${esc(L(q.quote))}”</blockquote>
        <figcaption>${esc(L(q.who))}</figcaption>
      </div>
    </figure>`
  ).join('');
  observeReveals();
}

// ---------- reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
);
function observeReveals() {
  $$('[data-reveal]:not(.in)').forEach((el) => io.observe(el));
}

// ---------- counters ----------
function runCounters() {
  $$('[data-count]').forEach((el) => {
    const to = +el.dataset.count;
    if (reduced || to < 5) return;
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    setTimeout(() => requestAnimationFrame(step), 500);
  });
}

// ---------- smooth scroll + header ----------
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}
function scrollToEl(sel) {
  const el = $(sel);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  e.preventDefault();
  closeMenu();
  scrollToEl(id);
});

const hdr = $('#hdr');
const parallaxEls = $$('[data-parallax]');
function onScroll() {
  hdr.classList.toggle('solid', window.scrollY > 40);
  if (reduced || window.innerWidth < 760) return;
  const vh = window.innerHeight;
  for (const el of parallaxEls) {
    const r = el.getBoundingClientRect();
    const c = r.top + r.height / 2 - vh / 2;
    el.style.setProperty('--py', `${(c * +el.dataset.parallax).toFixed(1)}px`);
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- mobile menu ----------
const burger = $('#burger');
function closeMenu() {
  document.body.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => {
  const open = !document.body.classList.contains('menu-open');
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', String(open));
});

$$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

// ---------- 3D logo ----------
async function startLogo() {
  const canvas = $('#logo3d');
  const fail = () => document.body.classList.add('no-webgl');
  canvas.addEventListener('logo3d:fail', fail);
  try {
    const { mount } = await import('./logo3d.js');
    mount(canvas, { getSections: () => $$('[data-logo]') });
  } catch (e) {
    console.warn('3D logo unavailable', e);
    fail();
  }
}

// ---------- marquee: duplicate the strip for a seamless loop ----------
const track = $('.track');
if (track && !reduced) {
  Array.from(track.children).forEach((img) => {
    const c = img.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    track.appendChild(c);
  });
}

// ---------- boot ----------
applyLang();
observeReveals();
onScroll();
runCounters();
startLogo();
requestAnimationFrame(() => document.body.classList.add('ready'));
