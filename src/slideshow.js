// Product photo slideshow.
// Effect: the incoming photo is revealed with a clip-path wipe (direction
// follows the browse direction) while it settles from a slight zoom; the
// outgoing photo stays underneath until covered. Progress segments on top
// double as the timer: when the active segment's fill animation ends
// (4 s), the slideshow advances. Pausing the animation (hover, focus,
// off-screen, hidden tab) therefore pauses the timer too.
// Browse with the arrows, the segments, or a swipe.

export const SLIDE_MS = 4000;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param {{src:string, contain?:boolean}[]} imgs
 * @param {object} o  { alt, tag, labels: { prev, next, go } } — strings already escaped
 */
export function slideshowHTML(imgs, o) {
  const n = imgs.length;
  const slides = imgs
    .map(
      (im, i) =>
        `<div class="slide${i === 0 ? ' on' : ''}${im.contain ? ' contain' : ''}" aria-hidden="${i !== 0}">` +
        `<img src="${im.src}" alt="${n > 1 ? `${o.alt} (${i + 1}/${n})` : o.alt}" loading="lazy" decoding="async" draggable="false" />` +
        `</div>`
    )
    .join('');
  const controls =
    n > 1
      ? `<div class="segs">${imgs
          .map((_, i) => `<button type="button" class="seg${i === 0 ? ' on' : ''}" aria-label="${o.labels.go} ${i + 1}"><i></i></button>`)
          .join('')}</div>` +
        `<button type="button" class="nav-btn prev" aria-label="${o.labels.prev}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>` +
        `<button type="button" class="nav-btn next" aria-label="${o.labels.next}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>` +
        `<span class="count"><b>1</b> / ${n}</span>`
      : '';
  return `<div class="card-media${n > 1 ? ' is-show' : ''}">${slides}${controls}<span class="tag">${o.tag}</span></div>`;
}

// Live slideshows, grouped by the container they were bound in, so the
// product grid and the detail panel can each be re-rendered on their own.
const live = new Map();

/** (Re)binds every slideshow inside `scope`. Call after each render of it. */
export function initSlideshows(scope = document) {
  (live.get(scope) || []).forEach((s) => s.destroy());
  live.set(scope, Array.from(scope.querySelectorAll('.card-media.is-show')).map(makeSlideshow));
}

function makeSlideshow(root) {
  const $ = (s) => root.querySelector(s);
  const slides = Array.from(root.querySelectorAll('.slide'));
  const segs = Array.from(root.querySelectorAll('.seg'));
  const countEl = $('.count b');
  const n = slides.length;
  let cur = 0;
  let visible = false;
  let hover = false;

  root.style.setProperty('--slide-ms', `${SLIDE_MS}ms`);
  const setPaused = () => root.classList.toggle('paused', reduced() || !visible || hover || document.hidden);

  function go(to, dir) {
    to = (to + n) % n;
    if (to === cur) return;
    if (dir === undefined) dir = to > cur ? 1 : -1;
    const from = slides[cur];
    const next = slides[to];
    root.classList.toggle('back', dir < 0);
    slides.forEach((s) => s.classList.remove('prev'));
    next.classList.remove('on');
    void next.offsetWidth; // re-arm the incoming slide at its start state
    from.classList.remove('on');
    from.classList.add('prev');
    next.classList.add('on');
    from.setAttribute('aria-hidden', 'true');
    next.setAttribute('aria-hidden', 'false');
    segs.forEach((s, i) => {
      s.classList.toggle('on', i === to);
      s.classList.toggle('done', i < to);
    });
    const bar = segs[to] && segs[to].firstElementChild;
    if (bar) {
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
    }
    cur = to;
    if (countEl) countEl.textContent = String(to + 1);
  }

  root.addEventListener('animationend', (e) => {
    if (e.animationName === 'seg-fill') go(cur + 1, 1);
  });
  segs.forEach((s, i) => s.addEventListener('click', () => go(i)));
  $('.prev')?.addEventListener('click', () => go(cur - 1, -1));
  $('.next')?.addEventListener('click', () => go(cur + 1, 1));

  root.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') {
      hover = true;
      setPaused();
    }
  });
  root.addEventListener('pointerleave', () => {
    hover = false;
    setPaused();
  });
  root.addEventListener('focusin', () => {
    hover = true;
    setPaused();
  });
  root.addEventListener('focusout', () => {
    hover = false;
    setPaused();
  });

  let sx = null;
  root.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('button')) sx = e.clientX;
  });
  root.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });

  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      setPaused();
    },
    { threshold: 0.35 }
  );
  io.observe(root);
  document.addEventListener('visibilitychange', setPaused);
  setPaused();

  return {
    destroy() {
      io.disconnect();
      document.removeEventListener('visibilitychange', setPaused);
    },
  };
}
