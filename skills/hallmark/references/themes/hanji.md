---
name: Hanji
slug: hanji
genre: editorial
paper: light 95.5 88
display: roman-serif Hahmlet
accent: chromatic-indigo 240
posture: restrained
keywords: bookshop, bookstore, tea house, hanok, craft studio, workshop, gallery, exhibition, cultural space, stationery, calligraphy, paper, 책방, 서점, 찻집, 다실, 한옥, 공방, 전시, 문화공간, 한지, 서예, 문구
material: mulberry-paper ivory, ink-black text, Hahmlet light-weight Hangul heads over Maru Buri prose with Newsreader Latin, 1px warm rules that cut the page into thin cells, one indigo dye
pictured: Catalogue Rows, Split hero
photo: warm sat=-8 con=-6
---

# Hanji

A sheet of mulberry paper under ink: ivory with a faint yellow in it, ink that leans blue-black, Hangul set in a thin batang serif, and one indigo dye (쪽빛) used the way a dyer uses it, sparingly and always on something that was meant to be read. Structure comes from fine warm rules that divide the page into cells, the way slats divide a paper door. It is quiet and bookish, not antique: no seal, no brush stroke, no red stamp, no five-colour palette, no cream-and-terracotta.

## Tokens

```css
:root {
  --color-paper: oklch(95.5% 0.018 88); --color-paper-2: oklch(97.5% 0.012 90); --color-paper-3: oklch(91.5% 0.022 85);
  --color-ink: oklch(21% 0.012 270); --color-ink-2: oklch(32% 0.012 270); --color-muted: oklch(46% 0.014 270);
  --color-rule: oklch(80% 0.02 85); --color-rule-2: oklch(60% 0.03 85);
  --color-accent: oklch(40% 0.085 240); --color-accent-ink: oklch(97% 0.012 90); --color-accent-soft: oklch(90% 0.035 240); --color-focus: oklch(40% 0.085 240);
  --font-display: "Newsreader", "Hahmlet", serif; --font-body: "Newsreader", "Maru Buri", serif;
  --radius-card: 0; --radius-pill: 2px; --rule-hair: 1px;
  --shadow-card: none;
  --tracking-display: 0; --display-weight: 400;
}
```

One dial, the colourway, stated in the stamp (`hanji: ivory`): `ivory`, the tokens above; `ash`, paper oklch(92% 0.01 95) with paper-2 oklch(95% 0.008 95), the rules turning cooler at hue 250; `night-study`, paper oklch(19% 0.015 265) under ink oklch(93% 0.014 88), the indigo lifted to oklch(74% 0.085 240) with accent-ink oklch(18% 0.03 265), the paper band turning dark.

## Type

- **Display:** Hahmlet 400 for Hangul, Newsreader 400 for the Latin inside it, leading 1.3 to 1.4, never bold, never italic (Hangul has none). Sentence case; at the largest step a head may run one line only.
- **Body:** Maru Buri 400 at 17 to 18px, leading 1.7, in `--color-ink-2`; the lede in `--color-ink`. Newsreader carries the Latin and the figures, old-style where the face offers them.
- **Labels, captions, table heads, nav:** Maru Buri 400 a step smaller in `--color-muted`, sentence case, untracked.
- **Emphasis:** a heavier Maru Buri weight (600) or `--color-ink`; never an accent word inside a head.

## Surfaces

- Rules do the structure: 1px `--color-rule` between cells, `--color-rule-2` for a table's head line and a selected row. A grid of cells meets at its rules with no gap, so the paper itself is the cell. The rules run only between cells, never as an outer frame or box around the grid.
- Flat paper in three steps: ground, `--color-paper-2` for a lifted sheet, `--color-paper-3` for a recessed band. No shadow, no card float, radius 0; controls may take 2px.
- Bands: one `--color-paper-3` band or one `--color-accent` field holding a single sentence and its action, two at most per page.
- Photographs: warm and slightly softened, of rooms, shelves, hands at a craft, cups and sheets of paper; flat to the page with a 1px rule edge, no radius, a caption beneath in the label style. Never a face looking at the camera.
- Texture: none beyond the paper tint itself; no fibre image, no noise overlay.

## Range

- **Catalogue rows:** books, teas, workshops or exhibitions as rows between hair rules, a title in the display face, a line of body, a price or date at the right edge in the figure face.
- **Timetables:** a week or a season as a ruled grid whose cells hold a word each, the open day on `--color-accent-soft`.
- **Statements:** one sentence in the display face at the largest step on bare paper, set in a narrow column with a long measure of nothing beside it.
- **Specimens:** a page of a book or a line of calligraphy practice set large in the display face as the picture the page needs.

## Controls

- The pair: an indigo fill with `--color-accent-ink` beside a 1px `--color-rule-2` outline on `--color-paper`, both at 2px, Maru Buri 600.
- Links underline in `--color-rule-2` and take the indigo on hover; inputs are a 1px bottom rule on `--color-paper-2` with the label above.
- The indigo may sit on the primary control, a link, a selected cell and one band; nothing else.

## Motion

A control changes colour over `--dur-short` on `--ease-out`. Nothing slides, fades up or parallaxes.

## Voice

A shopkeeper who has read the books: plain declarative sentences in one register (합쇼체), the object named, the hour and the price stated. 「오늘의 차」, never 「특별한 경험」.

## Do-nots

- Never a seal, a stamp or a vermilion mark; the page is blue-black and one indigo.
- Never a bold or tinted word inside a head, and never Latin italics inside Hangul.
- Never the five traditional colours, a lattice drawn as decoration or a hanok illustration; the rules are the lattice.
- Never a wide centred hero with a sheet-of-paper texture behind it.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@400&family=Newsreader:opsz,wght@6..72,400&display=swap" rel="stylesheet"><link href="https://cdn.jsdelivr.net/gh/fonts-archive/MaruBuri@977eeff68d1d40bcef341f09c1f56cce1903bb8a/subsets/MaruBuri-dynamic-subset.css" rel="stylesheet">
```

```css
:lang(ko) { word-break: keep-all; overflow-wrap: break-word; font-synthesis: none; }
h1, h2, h3 { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: var(--tracking-display); line-height: 1.35; }
.cells { display: grid; gap: var(--rule-hair); background: var(--color-rule); }
.cells > * { background: var(--color-paper); padding: var(--space-lg); }
.row { display: grid; grid-template-columns: 1fr auto; gap: var(--space-md); padding-block: var(--space-md); border-top: var(--rule-hair) solid var(--color-rule); }
.btn { border: var(--rule-hair) solid var(--color-rule-2); border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-lg); background: transparent; color: var(--color-ink); font-weight: 600; transition: background-color var(--dur-short) var(--ease-out); }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
a:hover { color: var(--color-accent); }
```
