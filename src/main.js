import './style.css';
import Lenis from 'lenis';
import { T, PRODUCTS, LINES, ADDRESSES, FOUNDERS, TESTIMONIALS } from './content.js';
import { slideshowHTML, initSlideshows } from './slideshow.js';

// First impression stays short: each section shows a headline and a few
// facts; the detail lives one click away in four patterns:
//   flip cards   (selling points, product lines, testimonials)
//   detail sheet (products, founders, story, franchise)
//   photo viewer (workshop + street photos)
//   <details>    (addresses & hours)

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
const pad = (n) => String(n).padStart(2, '0');

// Photo groups for the viewer. Captions are i18n keys (or empty).
const CAPS = [
  { key: 'about.c1', img: 'img/about-electrical.webp' },
  { key: 'about.c2', img: 'img/about-mechanical.webp' },
  { key: 'about.c3', img: 'img/about-automation.webp' },
  { key: 'about.c4', img: 'img/about-cnc.webp' },
  { key: 'about.c5', img: 'img/battery-pack.webp' },
  { key: 'about.c6', img: 'img/about-production-1.webp' },
];
const MOSAIC = [0, 3, 4, 1, 2, 5]; // order of CAPS in the 2-column mosaic
const STREET = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `img/street-${n}.webp`);
const GALLERIES = {
  about: () => [...CAPS.map((c) => ({ src: c.img, cap: t(c.key) })), { src: 'img/about-warehouse.webp', cap: t('about.wide') }],
  street: () => STREET.map((src) => ({ src, cap: '' })),
};

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
  renderAbout();
  renderFounders();
  renderTestimonials();
  if (sheet.open) rerenderSheet(); // keep an open panel, in the new language
  if (lb.open) showLb(lbIndex);
  observeReveals();
  observePeeks();
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

// ---------- small building blocks ----------
const locsHTML = () =>
  ADDRESSES.map(
    (a, i) =>
      `<li><span class="c-k">${esc(t(a.key))}</span><span>${esc(a.text)}</span>${
        i === 2 ? ` <a class="maps" href="https://maps.app.goo.gl/xSj8SHUmgVqXiWc29" target="_blank" rel="noopener">${esc(t('contact.maps'))} ↗</a>` : ''
      }</li>`
  ).join('');

function renderLocs() {
  $('#locs2').innerHTML = locsHTML();
}

const flipX = () => `<button type="button" class="flip-x" data-flip-close aria-label="${esc(t('ui.flipBack'))}"></button>`;

const LINE_ICON = {
  move: '<path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0M15 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0M9 17h6M7 15l2-7h5l3 7M14 8V5h3"/>',
  charge: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  drive: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M7 10v4M11 10v4"/>',
  core: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
};

// ---------- product lines (flip cards) ----------
function renderLines() {
  $('#lineGrid').innerHTML = Object.entries(LINES)
    .map(([id, l], i) => {
      const n = PRODUCTS.filter((p) => p.line === id).length;
      return `<li class="flip line-flip" data-reveal style="--d:${i * 0.08}s" ${i === 0 ? 'data-peek' : ''}>
        <button type="button" class="flip-face flip-front line-card" data-flip-open aria-expanded="false">
          <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LINE_ICON[id]}</svg>
          <span class="line-name">PSI ${l.name}</span>
          <span class="line-label">${esc(L(l.label))}</span>
          <span class="plus" aria-hidden="true"></span>
        </button>
        <div class="flip-face flip-back line-card">
          <span class="line-name">PSI ${l.name}</span>
          <p>${esc(t('lines.' + id))}</p>
          <button type="button" class="flip-link" data-line="${id}">${esc(t('lines.see'))} · ${n} →</button>
          ${flipX()}
        </div>
      </li>`;
    })
    .join('');
}

// ---------- products ----------
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
}

const specHTML = (s, withLabel = true) =>
  `<div><dt>${esc(s.v)}${L(s.u) ? `<small>${esc(L(s.u))}</small>` : ''}</dt>${withLabel ? `<dd>${esc(L(s.l))}</dd>` : ''}</div>`;

const slideOpts = (p) => ({
  alt: esc(L(p.alt)),
  tag: `${pad(PRODUCTS.indexOf(p) + 1)} · PSI ${LINES[p.line].name}`,
  labels: { prev: esc(t('slide.prev')), next: esc(t('slide.next')), go: esc(t('slide.go')) },
});

function renderProducts() {
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.line === filter);
  $('#prodGrid').innerHTML = list
    .map(
      (p, i) => `<article class="card" data-reveal style="--d:${(i % 3) * 0.08}s">
        ${slideshowHTML(p.imgs, slideOpts(p))}
        <div class="card-body">
          <h3>${esc(L(p.name))}</h3>
          <dl class="specs specs-mini">${p.specs.slice(0, 2).map((s) => specHTML(s)).join('')}</dl>
          <div class="card-foot">
            <strong class="price-v">${p.price ? vnd(p.price) : esc(t('products.quote'))}</strong>
            <button type="button" class="more-btn stretch" data-product="${p.id}">${esc(t('ui.more'))}<span class="plus" aria-hidden="true"></span></button>
          </div>
        </div>
      </article>`
    )
    .join('');
  initSlideshows($('#prodGrid'));
}

function productSheet(p) {
  const isMove = p.line === 'move';
  return `
    ${slideshowHTML(p.imgs, slideOpts(p))}
    <div class="sheet-pad">
      <p class="eyebrow">PSI ${LINES[p.line].name} · ${esc(L(LINES[p.line].label))}</p>
      <h2 class="display sheet-title" id="sheetTitle">${esc(L(p.name))}</h2>
      <p class="sheet-lead">${esc(L(p.tagline))}</p>
      <p class="sheet-price">${p.price ? vnd(p.price) : esc(t('products.quote'))}</p>
      <h3 class="sheet-h">${esc(t('products.specs'))}</h3>
      <dl class="specs specs-sheet">${p.specs.map((s) => specHTML(s)).join('')}</dl>
      <h3 class="sheet-h">${esc(t('products.features'))}</h3>
      <ul class="ticks">${p.features.map((f) => `<li>${esc(L(f))}</li>`).join('')}</ul>
      ${isMove ? `<p class="sheet-note">${esc(t('products.warranty'))}</p>` : ''}
      <div class="cta-row">
        <a class="btn btn-grad" href="https://m.me/tungxethovn" target="_blank" rel="noopener">${esc(p.price ? t('products.order') : t('products.getquote'))}</a>
        <a class="btn btn-ghost" href="tel:+84366462069">${esc(t('products.call'))} · 0366 462 069</a>
      </div>
    </div>`;
}

// ---------- about ----------
function renderAbout() {
  $('#capChips').innerHTML = CAPS.map(
    (c, i) => `<li><button type="button" class="chip" data-gallery="about" data-index="${i}">${esc(t(c.key))}</button></li>`
  ).join('');
  $('#mosaic').innerHTML = MOSAIC.map((ci, k) => {
    const c = CAPS[ci];
    return `<button type="button" class="tile" data-gallery="about" data-index="${ci}" data-reveal style="--d:${(k % 2) * 0.1}s" data-parallax="${[-0.06, 0.05, 0.08, -0.04, -0.05, 0.06][k]}">
      <img src="${c.img}" alt="${esc(t(c.key))}" loading="lazy" width="800" height="1000" />
      <span class="tile-cap">${esc(t(c.key))}</span>
      <span class="plus" aria-hidden="true"></span>
    </button>`;
  }).join('');
  parallaxEls = $$('[data-parallax]');
}

function storySheet() {
  return `
    <img class="sheet-hero" src="img/about-warehouse.webp" alt="${esc(t('about.wide'))}" width="1600" height="900" />
    <div class="sheet-pad">
      <p class="eyebrow">${esc(t('about.eyebrow'))}</p>
      <h2 class="display sheet-title" id="sheetTitle">${esc(t('about.storyTitle'))}</h2>
      <p class="sheet-lead">${esc(t('about.body'))}</p>
      <div class="sheet-grid3">${CAPS.map(
        (c, i) => `<button type="button" class="mini-tile" data-gallery="about" data-index="${i}"><img src="${c.img}" alt="" loading="lazy" /><span>${esc(t(c.key))}</span></button>`
      ).join('')}</div>
      <h3 class="sheet-h">${esc(t('about.where'))}</h3>
      <ul class="locs">${locsHTML()}</ul>
    </div>`;
}

function networkSheet() {
  return `
    <div class="sheet-strip">${[1, 2, 3].map((n) => `<img src="img/network-${n}.webp" alt="" loading="lazy" />`).join('')}</div>
    <div class="sheet-pad">
      <p class="eyebrow">${esc(t('network.eyebrow'))}</p>
      <h2 class="display sheet-title" id="sheetTitle">${esc(t('network.drawerTitle'))}</h2>
      <p class="sheet-lead">${esc(t('network.body'))}</p>
      <ul class="ticks">${['network.b1', 'network.b2', 'network.b3'].map((k) => `<li>${esc(t(k))}</li>`).join('')}</ul>
      <div class="cta-row">
        <a class="btn btn-grad" href="https://m.me/tungxethovn" target="_blank" rel="noopener">${esc(t('network.cta'))}</a>
        <button type="button" class="btn btn-ghost" data-product="sac-sieu-nhanh-1-8kw">${esc(L(PRODUCTS.find((p) => p.id === 'sac-sieu-nhanh-1-8kw').name))}</button>
      </div>
    </div>`;
}

// ---------- founders (compact cards → profile sheet) ----------
function renderFounders() {
  $('#founderGrid').innerHTML = FOUNDERS.map(
    (f, i) => `<button type="button" class="founder" data-founder="${i}" data-reveal style="--d:${i * 0.07}s">
      <img src="${f.img}" alt="" width="112" height="112" loading="lazy" />
      <span class="f-name">${esc(f.name)}</span>
      <span class="f-role">${esc(L(f.role))}</span>
      <span class="f-more">${esc(t('founders.more'))}<span class="plus" aria-hidden="true"></span></span>
    </button>`
  ).join('');
}

function founderSheet(f) {
  return `
    <div class="sheet-pad sheet-founder">
      <img class="f-big" src="${f.img}" alt="${esc(f.name)}" width="112" height="112" />
      <p class="eyebrow">${esc(t('founders.eyebrow'))}</p>
      <h2 class="display sheet-title" id="sheetTitle">${esc(f.name)}</h2>
      <p class="f-role">${esc(L(f.role))}</p>
      <p class="sheet-lead">${esc(L(f.bio))}</p>
      <div class="f-others">${FOUNDERS.filter((x) => x !== f)
        .map(
          (x) =>
            `<button type="button" class="f-other" data-founder="${FOUNDERS.indexOf(x)}"><img src="${x.img}" alt="" /><span>${esc(x.name)}</span></button>`
        )
        .join('')}</div>
    </div>`;
}

// ---------- testimonials (flip cards: photo → quote) ----------
function renderTestimonials() {
  $('#testiGrid').innerHTML = TESTIMONIALS.map(
    (q, i) => `<li class="flip testi-flip" data-reveal style="--d:${(i % 3) * 0.08}s" ${i === 0 ? 'data-peek' : ''}>
      <button type="button" class="flip-face flip-front testi-front" data-flip-open aria-expanded="false">
        <img src="${q.img}" alt="" width="480" height="640" loading="lazy" />
        <span class="testi-who">${esc(L(q.who))}</span>
        <span class="quote-badge" aria-hidden="true">“</span>
      </button>
      <figure class="flip-face flip-back testi-back">
        <blockquote>“${esc(L(q.quote))}”</blockquote>
        <figcaption>${esc(L(q.who))}</figcaption>
        ${flipX()}
      </figure>
    </li>`
  ).join('');
}

// ---------- street strip ----------
function renderStreet() {
  const imgs = STREET.map(
    (src, i) =>
      `<button type="button" class="street-tile" data-gallery="street" data-index="${i}"><img src="${src}" alt="" loading="lazy" width="640" height="800" /></button>`
  ).join('');
  // the strip is doubled for a seamless loop; the copy is hidden from AT
  $('#streetTrack').innerHTML = reduced ? imgs : imgs + `<div class="track-dup" aria-hidden="true" inert>${imgs}</div>`;
}

// ---------- flip cards ----------
function setFlip(card, on) {
  card.classList.toggle('is-flipped', on);
  card.classList.remove('peek');
  const front = $('.flip-front', card);
  const back = $('.flip-back', card);
  front.setAttribute('aria-expanded', String(on));
  front.inert = on;
  back.inert = !on;
  (on ? back.querySelector('a,button') : front)?.focus({ preventScroll: true });
}
function initFlipInert() {
  $$('.flip').forEach((c) => {
    const back = $('.flip-back', c);
    if (back && !c.classList.contains('is-flipped')) back.inert = true;
  });
}

// One "peek" wobble per group the first time it scrolls into view: a hint
// that the cards turn over.
const peekIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      peekIO.unobserve(e.target);
      if (!reduced) setTimeout(() => e.target.classList.add('peek'), 900);
    }
  },
  { threshold: 0.6 }
);
function observePeeks() {
  initFlipInert();
  $$('[data-peek]').forEach((el) => peekIO.observe(el));
}

// ---------- detail sheet ----------
const sheet = $('#sheet');
const sheetBody = $('#sheetBody');
let sheetRender = null;

function openSheet(render) {
  sheetRender = render;
  sheetBody.innerHTML = render();
  initSlideshows(sheetBody);
  $('.sheet-panel', sheet).scrollTop = 0;
  if (!sheet.open) {
    sheet.showModal();
    lenis?.stop();
    document.documentElement.classList.add('modal-open');
  }
}
// re-render in place (language switch) without closing the panel
function rerenderSheet() {
  if (sheetRender) {
    sheetBody.innerHTML = sheetRender();
    initSlideshows(sheetBody);
  }
}
function closeDialog(d) {
  if (!d.open || d.classList.contains('closing')) return;
  if (reduced) return d.close();
  d.classList.add('closing');
  setTimeout(() => {
    d.classList.remove('closing');
    d.close();
  }, 260);
}
[sheet, $('#lightbox')].forEach((d) => {
  d.addEventListener('close', () => {
    if (!sheet.open && !lb.open) {
      lenis?.start();
      document.documentElement.classList.remove('modal-open');
    }
    if (d === sheet) {
      sheetRender = null;
      initSlideshows(sheetBody);
    }
  });
  d.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeDialog(d);
  });
  // click on the backdrop (outside the panel) closes
  d.addEventListener('click', (e) => {
    if (e.target === d) closeDialog(d);
  });
});

// ---------- photo viewer ----------
const lb = $('#lightbox');
let lbItems = [];
let lbIndex = 0;
let lbGroup = 'about';
function openLb(group, i) {
  lbGroup = group;
  lbItems = GALLERIES[group]();
  showLb(i);
  if (!lb.open) {
    lb.showModal();
    lenis?.stop();
    document.documentElement.classList.add('modal-open');
  }
}
function showLb(i) {
  lbItems = GALLERIES[lbGroup]();
  lbIndex = (i + lbItems.length) % lbItems.length;
  const it = lbItems[lbIndex];
  const img = $('#lbImg');
  img.classList.remove('lb-in');
  void img.offsetWidth;
  img.src = it.src;
  img.alt = it.cap || '';
  img.classList.add('lb-in');
  $('#lbCap').textContent = it.cap || '';
  $('#lbCount').textContent = `${lbIndex + 1} / ${lbItems.length}`;
}
lb.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') showLb(lbIndex + 1);
  if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
});
let lbX = null;
lb.addEventListener('pointerdown', (e) => (lbX = e.clientX));
lb.addEventListener('pointerup', (e) => {
  if (lbX === null) return;
  const dx = e.clientX - lbX;
  lbX = null;
  if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
});

// ---------- one delegated click handler for everything interactive ----------
document.addEventListener('click', (e) => {
  const el = e.target.closest(
    '[data-flip-open],[data-flip-close],[data-product],[data-founder],[data-open],[data-gallery],[data-line],[data-f],[data-close],[data-lb],a[href^="#"]'
  );
  if (!el) return;
  const d = el.dataset;

  if ('flipOpen' in d) return setFlip(el.closest('.flip'), true);
  if ('flipClose' in d) return setFlip(el.closest('.flip'), false);
  if ('close' in d) return closeDialog(el.closest('dialog'));
  if ('lb' in d) return showLb(lbIndex + +d.lb);
  if (d.product) {
    const p = PRODUCTS.find((x) => x.id === d.product);
    return openSheet(() => productSheet(p));
  }
  if (d.founder !== undefined) {
    const f = FOUNDERS[+d.founder];
    return openSheet(() => founderSheet(f));
  }
  if (d.open === 'story') return openSheet(storySheet);
  if (d.open === 'network') return openSheet(networkSheet);
  if (d.gallery) return openLb(d.gallery, +d.index);
  if (d.f) {
    filter = d.f;
    renderFilters();
    renderProducts();
    return observeReveals();
  }
  if (d.line) {
    filter = d.line;
    renderFilters();
    renderProducts();
    observeReveals();
    setFlip(el.closest('.flip'), false);
    return scrollToEl('#products');
  }
  const href = el.getAttribute('href');
  if (href && href.length > 1) {
    e.preventDefault();
    closeMenu();
    const flip = el.closest('.flip');
    if (flip) setFlip(flip, false);
    scrollToEl(href);
  }
});

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

const hdr = $('#hdr');
let parallaxEls = [];
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

// ---------- boot ----------
renderStreet();
applyLang();
onScroll();
startLogo();
requestAnimationFrame(() => document.body.classList.add('ready'));
