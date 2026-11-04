---
name: Gyeoljae
slug: gyeoljae
genre: modern-minimal
paper: light 97.5 95
display: grotesk-sans IBM Plex Sans KR
accent: cool 262
posture: restrained
keywords: public service, government, civic, b2b, legal, law firm, forms, application, reception, administration, 공공, 민원, 법무, 신청서, 접수, 서식, 행정
material: copy-paper white with a pale tint for form heads, navy-black ink, IBM Plex Sans and IBM Plex Sans KR at 400 to 600, 1px navy rules that box every field and table, one navy for confirmation
pictured: Ruled Forms, Split hero
photo: muted
---

# Gyeoljae

A form that someone has taken care over: warm copy-paper white, ruled boxes with the label in a tinted header cell and the entry beside it, an approval row of small cells at the top right where each person who checked it has initialled. The type is a firm gothic that stays legible at 14px, and a single navy marks what is confirmed. It is dense on purpose and calm in manner, not a government portal clone, not a dashboard of rounded cards and not a pastel clinic.

## Tokens

```css
:root {
  --color-paper: oklch(97.5% 0.006 95); --color-paper-2: oklch(99% 0.005 95); --color-paper-3: oklch(94% 0.009 100);
  --color-ink: oklch(20% 0.02 262); --color-ink-2: oklch(31% 0.025 262); --color-muted: oklch(45% 0.02 262);
  --color-rule: oklch(80% 0.012 262); --color-rule-2: oklch(40% 0.03 262);
  --color-accent: oklch(34% 0.095 262); --color-accent-ink: oklch(98% 0.005 95); --color-accent-soft: oklch(93% 0.025 262); --color-focus: oklch(52% 0.16 262);
  --font-display: "IBM Plex Sans", "IBM Plex Sans KR", sans-serif; --font-body: "IBM Plex Sans", "IBM Plex Sans KR", sans-serif;
  --radius-card: 0; --radius-pill: 2px; --rule-hair: 1px;
  --shadow-card: none;
  --tracking-display: 0; --display-weight: 600;
}
```

Colourways, stated in the stamp (`gyeoljae: copy-paper`): `copy-paper`, the tokens above; `blueprint-grey`, paper oklch(94% 0.01 255) with paper-2 oklch(98% 0.005 255) and paper-3 oklch(90% 0.014 255), rules oklch(76% 0.016 255); `night-desk`, paper oklch(18% 0.02 262) with paper-2 oklch(22% 0.022 262) and paper-3 oklch(14% 0.02 262), ink oklch(94% 0.008 262), accent oklch(72% 0.11 262) with accent-ink oklch(16% 0.03 262), the paper band turning dark.

## Type

- **Display:** IBM Plex Sans KR 600 with IBM Plex Sans for the Latin, leading 1.3 to 1.4, sentence case. A head is a plain statement of the service or the form; it never carries a second colour.
- **Body:** IBM Plex Sans KR 400 at 16 to 17px, leading 1.65, in `--color-ink-2`; table text 15px. Emphasis is 500 or 600.
- **Labels, table heads, captions, nav:** 500 a step smaller, sentence case, untracked, in `--color-muted` on `--color-paper-3` header cells or `--color-ink` on bare paper.
- **Figures:** Plex Sans tabular figures right-aligned in a column; amounts carry the unit in the head cell, not in every row.

## Surfaces

- Boxed fields: every group of facts is a table with 1px `--color-rule-2` outer edge and 1px `--color-rule` inner lines, a label cell on `--color-paper-3` and an entry cell on `--color-paper-2`. Radius 0, no shadow.
- Two papers: the ground and the lifted sheet `--color-paper-2` that carries forms; `--color-paper-3` for header cells, a strip of notes and the recessed band.
- Bands: one `--color-paper-3` band or one `--color-accent` band holding a single instruction or a deadline; two a page at most.
- Photographs: rare, muted and matter-of-fact (a counter, a waiting room, a desk with papers), inside a 1px rule edge at radius 0 with a caption beneath. Pages in this theme lead with the form or table, not a picture.
- No texture, no gradient, no icon tiles.

## Range

- **Approval cells:** a row of three or four small cells, each a role in its header and an empty or filled body, the filled one carrying the navy initial or a check in `--color-accent`.
- **Procedures:** steps as a ruled table, a number cell, an action, who does it, and the time it takes; the current step on `--color-accent-soft`.
- **Fee and document tables:** columns divided by 1px rules, figures right-aligned and tabular, a total row on `--color-paper-3`.
- **Checklists:** a document list where each row has a square check cell, drawn as the real input, with the required papers named.

## Controls

- The pair: a navy fill with `--color-accent-ink` beside a 1px `--color-rule-2` outline on `--color-paper-2`, both at 2px, 500 weight, 44px tall.
- Inputs sit in an entry cell: a 1px `--color-rule-2` box on `--color-paper-2`, the label in its header cell, an error under the entry in `--color-ink` with a navy rule at its left.
- The navy may sit on the primary control, a confirmation mark, the current step and one band; state beyond that is carried by words.

## Motion

Fields and rows change colour over `--dur-short` on `--ease-out`. No entrances, counters or sliding drawers.

## Voice

An office writing a notice: one register (합쇼체), the action first, then who, when and what to bring. 「접수는 방문 전 예약으로 받습니다」, with no slogan.

## Do-nots

- Never a rounded card grid, an icon tile or a gradient button; the table is the layout.
- Never a stamp that is not a fact; a check cell exists only where a person confirmed something.
- Never a second signal colour; red and green belong to the product when it has statuses, not to the theme.
- Never lead with a photograph of smiling staff.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
:lang(ko) { word-break: keep-all; overflow-wrap: break-word; font-synthesis: none; }
h1, h2, h3 { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: var(--tracking-display); line-height: 1.35; }
.form { width: 100%; border-collapse: collapse; background: var(--color-paper-2); border: var(--rule-hair) solid var(--color-rule-2); }
.form th, .form td { padding: var(--space-sm) var(--space-md); border: var(--rule-hair) solid var(--color-rule); text-align: left; vertical-align: top; }
.form th { background: var(--color-paper-3); color: var(--color-muted); font-weight: 500; width: 9em; }
.num { text-align: right; font-variant-numeric: tabular-nums; }
.btn { min-height: 44px; border: var(--rule-hair) solid var(--color-rule-2); border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-lg); background: var(--color-paper-2); color: var(--color-ink); font-weight: 500; transition: background-color var(--dur-short) var(--ease-out); }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
```
