# PSI Technology — company website

One-page bilingual (VI / EN) introduction site for PSI Technology
(Công ty TNHH PSI LAB VN), built on Brand Identity v2.0.

The background is a real-time 3D version of the Ψ symbol, extruded from the
original brand SVG (`PSI-Brand-Identity-v2.0/01_Logo-chinh/SVG/psi-bieu-tuong-gradient.svg`,
never redrawn). As you scroll it rotates, moves between sections and
"expands" (the top bar lifts away and outline layers fan out in depth), then
reassembles front-facing behind the contact section.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (+ dist/logo3d/psi-logo3d.js)
```

`dist/` is a plain static site (relative paths) — upload it to any host.

## Where things live

| What | File |
| --- | --- |
| Copy (VI/EN), products, contact info | `src/content.js` |
| 3D logo + scroll poses (`POSES`) | `src/logo3d.js` |
| Page structure | `index.html` |
| Styles (brand tokens at the top) | `src/style.css` |
| Photo crops → WebP | `scripts/build-images.py` |

Product data and contact details mirror `psilabvnorg/PsiLab`
(`src/constants/catalog.ts`, `src/constants/site.ts`).

Each section has `data-logo="<pose>"`; edit `POSES` in `src/logo3d.js` to
change where the logo sits, how it's rotated and how far it expands there.

`dist/logo3d/psi-logo3d.js` is a standalone build of the effect
(`PSILogo3D.mount(canvas, { getSections })`) for reuse elsewhere.
