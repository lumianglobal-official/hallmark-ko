---
name: Ganpan
slug: ganpan
genre: playful
paper: mid 83 85
display: grotesk-heavy Black Han Sans
accent: warm 28
posture: committed
keywords: restaurant, eatery, diner, street food, snack bar, noodle, market, neighbourhood shop, menu, price list, takeout, bar, 동네식당, 식당, 포차, 포장마차, 노포, 국밥
material: tile-and-shutter grey ground with white menu boards on it, near-black ink in 2px rules, Black Han Sans for signs and prices over Wanted Sans, one acrylic-sign red used as a whole field
pictured: Menu Board, Split hero
photo: natural con=6 sat=4
---

# Ganpan

The street in front of the shop at noon: a grey shutter and tiled wall, a plain white menu board, one red acrylic sign with the name on it in thick gothic letters. Heavy Hangul heads, prices set as large as names, 2px ink rules around anything that is a list, and a single red that is allowed to be a whole field. It is a place telling you what it sells and what it costs, not a retro diner, not a neon bar and not a hand-lettered chalkboard.

## Tokens

```css
:root {
  --color-paper: oklch(83% 0.022 85); --color-paper-2: oklch(96% 0.012 90); --color-paper-3: oklch(72% 0.025 80);
  --color-ink: oklch(17% 0.01 60); --color-ink-2: oklch(26% 0.012 60); --color-muted: oklch(35% 0.015 70);
  --color-rule: oklch(46% 0.02 70); --color-rule-2: oklch(17% 0.01 60);
  --color-accent: oklch(49% 0.21 28); --color-accent-ink: oklch(98% 0.01 90); --color-accent-soft: oklch(90% 0.05 30); --color-focus: oklch(17% 0.01 60);
  --font-display: "Black Han Sans", "Wanted Sans Variable", sans-serif; --font-body: "Public Sans", "Wanted Sans Variable", sans-serif;
  --radius-card: 4px; --radius-pill: 4px; --rule-hair: 2px;
  --shadow-card: none;
  --tracking-display: 0; --display-weight: 400;
}
```

Colourways, stated in the stamp (`ganpan: shutter`): `shutter`, the tokens above; `night`, paper oklch(17% 0.012 60) with paper-2 oklch(23% 0.014 60) and paper-3 oklch(12% 0.01 60), ink oklch(94% 0.012 90), the red lifted to oklch(62% 0.21 28) with accent-ink oklch(14% 0.02 40), rules oklch(45% 0.02 70), the paper band turning dark; `signboard`, paper oklch(96% 0.012 90) with paper-2 oklch(99% 0.004 90), the grey demoted to paper-3 oklch(88% 0.016 85).

## Type

- **Display:** Black Han Sans 400 (one weight; never synthesise bold), `--tracking-display`, leading 1.25 to 1.3, set large and short: a name, a dish, a price. The Latin inside it is the same face.
- **Body:** Wanted Sans Variable 500 at 17px, leading 1.65, in `--color-ink-2`; Public Sans carries the Latin and every figure that is not a price. Emphasis is 700 or `--color-ink`.
- **Coverage:** Black Han Sans holds only about 2,350 to 2,788 of the 11,172 syllables. Check every syllable of the names and prices against the face. If the menu is user-edited or open-ended, set the display in Paperlogy 900 (full set, weight 900, `--display-weight: 900`) instead. Otherwise a missing syllable falls back to Wanted Sans at 400, which looks thin inside a heavy word, so test it.
- **Prices:** Black Han Sans at head size, tabular figures, the unit (원) a step smaller beside the number; one currency format all the way down the page.
- **Labels, captions, table heads, nav:** Wanted Sans 700 a step smaller, sentence case, untracked, `--color-muted` or `--color-ink`.

## Surfaces

- Boards: `--color-paper-2` inside a 2px `--color-rule-2` edge, radius 4px, no shadow. A list of dishes, hours or prices lives on a board, rows divided by 2px dotted or solid `--color-rule` lines.
- The ground is `--color-paper`; `--color-paper-3` is the recess for a photograph's frame or a strip of small print.
- Bands: the red `--color-accent` as a whole field with `--color-accent-ink` letters, holding a name, an hour or one instruction; two a page at most. Never a red body-text paragraph.
- Photographs: natural colour, true and slightly punchy, taken at the counter, the pot, the street or the market, flat on the ground inside a 2px ink edge at 4px radius, captioned with what is in the frame. No close portraits of customers.
- No texture, no gradient, no glow; the grey is a flat colour.

## Range

- **Menu boards:** names and prices as rows, a price at the right edge in the display face, a one-line note beneath in body, sections divided by the heavy rule.
- **Sign bands:** one sentence or one name set at display size in `--color-accent-ink` on the red field, the way a shop front reads from across a road.
- **Hours and place:** a plain ruled table, days left and times right, the closed day struck through in muted.
- **Order slips:** a small ruled form (name, number, pickup time) on a board, set as the real thing the page works with.

## Controls

- The pair: a red fill with `--color-accent-ink` beside a 2px `--color-rule-2` outline on `--color-paper-2`, both at 4px, Wanted Sans 700. A phone number is a `tel:` link set as a primary control.
- Links underline 2px in ink and turn red on hover; inputs are a 2px ink outline on `--color-paper-2`.
- The red may sit on a primary control, a sign band, a price that changed and a sold-out mark; nowhere else.

## Motion

Press states change fill over `--dur-micro` on `--ease-out`. Nothing scrolls in, wobbles or blinks.

## Voice

The person behind the counter, in one register (합쇼체 or 해요체, never both): the dish, the price, the hour, what is sold out. 「순대는 오후 4시까지」, never 「특별한 맛의 경험」.

## Do-nots

- Never neon, glow, a chalkboard, a checkered cloth, a brush script or an emoji in a list.
- Never the red as text colour for a paragraph; it is a field or a single price.
- Never a menu without prices, or prices without one format.
- Never a hero that is only a photograph of food with the name small beneath it.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Public+Sans:wght@400;600&display=swap" rel="stylesheet"><link href="https://cdn.jsdelivr.net/npm/wanted-sans@1.0.3/fonts/webfonts/variable/split/WantedSansVariable.css" rel="stylesheet">
```

```css
:lang(ko) { word-break: keep-all; overflow-wrap: break-word; font-synthesis: none; }
h1, h2, h3 { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: var(--tracking-display); line-height: 1.28; }
.board { background: var(--color-paper-2); border: var(--rule-hair) solid var(--color-rule-2); border-radius: var(--radius-card); padding: var(--space-lg); }
.dish { display: flex; justify-content: space-between; gap: var(--space-md); padding-block: var(--space-sm); border-bottom: var(--rule-hair) dotted var(--color-rule); }
.price { font-family: var(--font-display); font-variant-numeric: tabular-nums; }
.sign { background: var(--color-accent); color: var(--color-accent-ink); }
.btn { border: var(--rule-hair) solid var(--color-rule-2); border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-lg); background: var(--color-paper-2); color: var(--color-ink); font-weight: 700; transition: background-color var(--dur-micro) var(--ease-out); }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
```
