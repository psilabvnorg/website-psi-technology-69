// PSI 3D logo — the Ψ symbol extruded from the ORIGINAL brand SVG path
// (PSI-Brand-Identity-v2.0/01_Logo-chinh/SVG/psi-bieu-tuong-gradient.svg).
// The 2D outline is never redrawn or distorted: we only give it depth,
// a bevel and the symbol gradient (#38B6F0 top-right -> #7B3FE4 bottom-left).
//
// Scroll choreography: every page section carries a "pose" (position,
// rotation, scale, how far the symbol is expanded). The pose is
// interpolated between the two sections nearest the viewport centre, so
// the logo rotates and expands as the user scrolls, then reassembles at
// the end. Works with any scroll container (it measures sections with
// getBoundingClientRect every frame), so it can be mounted anywhere.

import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import symbolSvg from '../PSI-Brand-Identity-v2.0/01_Logo-chinh/SVG/psi-bieu-tuong-gradient.svg?raw';

const GRAD_FROM = new THREE.Color('#38B6F0'); // top-right
const GRAD_TO = new THREE.Color('#7B3FE4'); // bottom-left
const GRAD_P0 = new THREE.Vector2(575, 0); // gradient line from the SVG
const GRAD_P1 = new THREE.Vector2(0, 686);

// Poses, by section name. x/y are fractions of the half viewport.
export const POSES = {
  // listed in page order; ry keeps increasing so the spin direction is constant
  hero: { x: 0.56, y: 0.0, rx: 0.08, ry: -0.45, rz: 0, s: 1.0, spread: 0, lift: 0, glow: 0.9, o: 1 },
  products: { x: 0.52, y: 0.05, rx: -0.1, ry: 1.9, rz: 0, s: 1.6, spread: 1.0, lift: 0.5, glow: 0.3, o: 0.18 },
  street: { x: -0.1, y: 0.0, rx: 0.25, ry: 3.6, rz: 0.15, s: 2.0, spread: 1.2, lift: 0.6, glow: 0.3, o: 0.28 },
  network: { x: -0.46, y: 0.0, rx: -0.05, ry: 5.2, rz: 0, s: 1.2, spread: 0.6, lift: 0.3, glow: 0.5, o: 0.45 },
  lines: { x: 0.0, y: 0.0, rx: 0.35, ry: 7.0, rz: -0.2, s: 2.3, spread: 1.4, lift: 0.8, glow: 0.35, o: 0.3 },
  about: { x: -0.55, y: 0.0, rx: -0.15, ry: 8.8, rz: 0.1, s: 1.3, spread: 0.7, lift: 0.35, glow: 0.45, o: 0.3 },
  contact: { x: 0.0, y: 0.0, rx: 0, ry: Math.PI * 4, rz: 0, s: 1.75, spread: 0, lift: 0, glow: 1, o: 0.42 },
};
const KEYS = ['x', 'y', 'rx', 'ry', 'rz', 's', 'spread', 'lift', 'glow', 'o'];

const smooth = (t) => t * t * (3 - 2 * t);

// ---------- geometry ----------

function flipWinding(geom) {
  // Mirroring Y (SVG is y-down) inverts triangle winding; swap verts 1<->2.
  for (const name of Object.keys(geom.attributes)) {
    const a = geom.attributes[name];
    const n = a.itemSize;
    for (let i = 0; i < a.count; i += 3) {
      for (let k = 0; k < n; k++) {
        const i1 = (i + 1) * n + k;
        const i2 = (i + 2) * n + k;
        const t = a.array[i1];
        a.array[i1] = a.array[i2];
        a.array[i2] = t;
      }
    }
    a.needsUpdate = true;
  }
}

function paintGradient(geom) {
  const pos = geom.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const d = GRAD_P1.clone().sub(GRAD_P0);
  const len2 = d.lengthSq();
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp(((pos.getX(i) - GRAD_P0.x) * d.x + (pos.getY(i) - GRAD_P0.y) * d.y) / len2, 0, 1);
    c.copy(GRAD_FROM).lerp(GRAD_TO, t);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

function buildSymbol() {
  // Only the geometry is read; the gradient is applied as vertex colours.
  const data = new SVGLoader().parse(symbolSvg.replace(/fill="url\([^)]*\)"/g, 'fill="#000"'));
  const shapes = [];
  for (const p of data.paths) shapes.push(...SVGLoader.createShapes(p));
  // The path holds two separate outlines: the trident body (with the
  // centre post) and the small top bar. Largest = body.
  const area = (s) => Math.abs(THREE.ShapeUtils.area(s.getPoints(8)));
  shapes.sort((a, b) => area(b) - area(a));

  const DEPTH = 70;
  const extrude = {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 12,
    bevelSize: 7,
    bevelOffset: 0,
    bevelSegments: 5,
    curveSegments: 10,
  };
  // SVG viewBox 576 x 686 -> centre it and scale to ~2.4 world units tall.
  const S = 2.4 / 686;
  const toWorld = new THREE.Matrix4()
    .makeScale(S, -S, S)
    .multiply(new THREE.Matrix4().makeTranslation(-288, -343, -DEPTH / 2));

  const parts = shapes.map((shape) => {
    const g = new THREE.ExtrudeGeometry(shape, extrude);
    paintGradient(g); // gradient computed in original SVG coordinates
    g.applyMatrix4(toWorld);
    flipWinding(g);
    g.computeVertexNormals();

    // Outline loop (front face) for the "expanded" echo layers.
    const pts = shape.getPoints(10).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const outline = new THREE.BufferGeometry().setFromPoints(pts);
    outline.applyMatrix4(new THREE.Matrix4().makeScale(S, -S, S).multiply(new THREE.Matrix4().makeTranslation(-288, -343, 0)));
    return { geom: g, outline };
  });
  return parts; // [body, bar]
}

function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(143,220,255,0.55)');
  g.addColorStop(0.35, 'rgba(123,63,228,0.28)');
  g.addColorStop(1, 'rgba(46,20,88,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- mount ----------

/**
 * @param {HTMLCanvasElement} canvas
 * @param {object} opts
 * @param {() => Element[]} opts.getSections  elements with data-logo="<pose name>"
 * @param {Record<string, object>} [opts.poses]
 * @returns {{ destroy(): void }}
 */
export function mount(canvas, opts = {}) {
  const poses = { ...POSES, ...(opts.poses || {}) };
  const getSections = opts.getSections || (() => Array.from(document.querySelectorAll('[data-logo]')));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    canvas.dispatchEvent(new CustomEvent('logo3d:fail'));
    return { destroy() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  // Lights: cool key from top-right (matches gradient), violet fill, rim.
  const key = new THREE.DirectionalLight('#dff4ff', 2.2);
  key.position.set(4, 5, 6);
  const fill = new THREE.DirectionalLight('#a77dff', 1.2);
  fill.position.set(-6, -2, 3);
  const rim = new THREE.DirectionalLight('#38b6f0', 2.5);
  rim.position.set(2, 1, -6);
  scene.add(key, fill, rim, new THREE.AmbientLight('#5b2fb0', 0.35));

  // Root follows the pose; inner group gets idle sway + pointer tilt.
  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);
  scene.add(root);

  const [body, bar] = buildSymbol();
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    metalness: 0.1,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 0.55,
    sheen: 0.25,
    sheenColor: new THREE.Color('#8fdcff'),
  });
  const bodyMesh = new THREE.Mesh(body.geom, material);
  const barMesh = new THREE.Mesh(bar.geom, material);
  inner.add(bodyMesh, barMesh);

  // Echo outline layers — they fan out behind the symbol when "expanded".
  const ECHO = 5;
  const echoes = [];
  for (let i = 0; i < ECHO; i++) {
    const t = i / (ECHO - 1);
    const col = new THREE.Color('#8fdcff').lerp(new THREE.Color('#c4a8ff'), t);
    const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0, depthWrite: false });
    const g = new THREE.Group();
    g.add(new THREE.LineLoop(body.outline, mat), new THREE.LineLoop(bar.outline, mat));
    inner.add(g);
    echoes.push({ g, mat, i: i + 1 });
  }

  // Glow behind the symbol.
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeGlowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  glow.scale.set(6, 6, 1);
  glow.position.z = -1.2;
  root.add(glow);

  // Particle field (energy dust).
  const N = 700;
  const pp = new Float32Array(N * 3);
  const pc = new Float32Array(N * 3);
  const ca = new THREE.Color('#8fdcff');
  const cb = new THREE.Color('#8b5cf6');
  const tmp = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const r = 2.2 + Math.random() * 6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pp.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, r * Math.cos(ph) - 2], i * 3);
    tmp.copy(ca).lerp(cb, Math.random());
    pc.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  pg.setAttribute('color', new THREE.BufferAttribute(pc, 3));
  const points = new THREE.Points(
    pg,
    new THREE.PointsMaterial({
      size: 0.06,
      map: makeDotTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(points);

  // ---------- pose from scroll ----------
  const cur = { ...poses.hero };
  const target = { ...poses.hero };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  function poseFor(name, mobile) {
    const p = { ...(poses[name] || poses.hero) };
    if (mobile) {
      p.x *= 0.12;
      p.s *= 0.72;
      if (name === 'hero') {
        p.y = 0.36;
        p.o = 0.7;
      }
    }
    return p;
  }

  function computeTarget() {
    const els = getSections();
    if (!els.length) return;
    const vh = window.innerHeight;
    const mid = vh * 0.5;
    const mobile = window.innerWidth < 760;
    const marks = els.map((el) => {
      const r = el.getBoundingClientRect();
      return { c: r.top + Math.min(r.height, vh) * 0.5, name: el.getAttribute('data-logo') };
    });
    let a = marks[0];
    let b = marks[0];
    let t = 0;
    if (mid <= marks[0].c) {
      a = b = marks[0];
    } else if (mid >= marks[marks.length - 1].c) {
      a = b = marks[marks.length - 1];
    } else {
      for (let i = 0; i < marks.length - 1; i++) {
        if (mid >= marks[i].c && mid <= marks[i + 1].c) {
          a = marks[i];
          b = marks[i + 1];
          t = smooth((mid - a.c) / Math.max(1, b.c - a.c));
          break;
        }
      }
    }
    const pa = poseFor(a.name, mobile);
    const pb = poseFor(b.name, mobile);
    for (const k of KEYS) target[k] = pa[k] + (pb[k] - pa[k]) * t;
  }

  function onPointer(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener('pointermove', onPointer, { passive: true });

  // ---------- size ----------
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // ---------- loop ----------
  const clock = new THREE.Clock();
  let raf = 0;
  let first = true;
  function frame() {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    computeTarget();
    const k = first || reduced ? 1 : 1 - Math.exp(-dt * 5);
    first = false;
    for (const key2 of KEYS) cur[key2] += (target[key2] - cur[key2]) * k;
    const kp = 1 - Math.exp(-dt * 3);
    pointer.x += (pointer.tx - pointer.x) * kp;
    pointer.y += (pointer.ty - pointer.y) * kp;

    // Viewport-relative placement.
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfW = halfH * camera.aspect;
    root.position.set(cur.x * halfW, cur.y * halfH, 0);
    root.rotation.set(cur.rx, cur.ry, cur.rz);
    root.scale.setScalar(cur.s);

    const sway = reduced ? 0 : 1;
    inner.rotation.set(pointer.y * 0.18 + Math.sin(time * 0.5) * 0.04 * sway, pointer.x * 0.28 + Math.sin(time * 0.35) * 0.1 * sway, 0);
    inner.position.y = Math.sin(time * 0.8) * 0.05 * sway;

    // Expand: the bar lifts away, outline echoes fan out in depth.
    barMesh.position.set(0, cur.lift * 0.55, cur.lift * 0.9);
    bodyMesh.position.set(0, -cur.lift * 0.08, 0);
    for (const e of echoes) {
      const sp = cur.spread;
      e.g.position.z = -0.3 - e.i * 0.55 * sp;
      e.g.scale.setScalar(1 + e.i * 0.09 * sp);
      e.mat.opacity = Math.min(1, sp * 1.2) * (0.75 - e.i * 0.1);
    }

    glow.material.opacity = 0.35 + cur.glow * 0.65;
    glow.scale.setScalar(5 + cur.glow * 2.5);

    points.rotation.y = time * 0.02 + cur.ry * 0.15;
    points.rotation.x = cur.rx * 0.3;
    points.scale.setScalar(1 + cur.spread * 0.35);

    canvas.style.opacity = cur.o.toFixed(3);
    renderer.render(scene, camera);
  }
  frame();
  canvas.classList.add('is-ready');

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      renderer.dispose();
      pmrem.dispose();
    },
  };
}
