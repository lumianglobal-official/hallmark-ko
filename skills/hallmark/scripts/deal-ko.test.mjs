// Korean deal: a Hangul brief matches ko_keywords (themes/hangul.json) and Hangul words in a theme's own keywords
// by substring; a Latin brief deals exactly as the unpatched theme.mjs did.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME_JS = join(HERE, 'theme.mjs');
const THEMES = join(HERE, '..', 'references', 'themes');
const HANGUL = /[\u3131-\u318E\uAC00-\uD7A3]/;
// The 50 themes the upstream catalog ships; the Korean themes carry their own Korean keywords.
const CATALOG = [
  'almanac', 'arcade', 'atelier', 'bloom', 'blueprint', 'broadside', 'brutal', 'carnival', 'cobalt', 'console',
  'coral', 'darkroom', 'dose', 'dusk', 'editorial', 'formwork', 'furrow', 'garden', 'grid', 'halftone',
  'hedgerow', 'hum', 'ink', 'kiln', 'loom', 'lumen', 'manifesto', 'midnight', 'newsprint', 'overprint',
  'pasteup', 'piste', 'refract', 'ribbon', 'rim', 'riso', 'solstice', 'specimen', 'spore', 'sport',
  'squeeze', 'sticker', 'studio', 'terminal', 'terrazzo', 'ultraviolet', 'vantage', 'vellum', 'wayfind', 'werkstatt',
];
const hangul = JSON.parse(readFileSync(join(THEMES, 'hangul.json'), 'utf8'));

const deal = (prompt, genre, extra = []) => {
  const dir = mkdtempSync(join(tmpdir(), 'deal-ko-'));
  const out = execFileSync('node', [THEME_JS, 'deal', '--genre', genre, '--prompt', prompt, '--log', join(dir, 'log.json'), '--json', ...extra], { encoding: 'utf8' });
  return JSON.parse(out).deal;
};
// What a hit may be: a ko_keywords entry of that theme, or a Hangul word in its own keywords: line.
const koWords = (t) => [...((hangul[t.slug] || {}).ko_keywords || []), ...t.keywords.filter((k) => HANGUL.test(k))];

test('hangul.json covers the 50 catalog themes with at least 8 Korean keywords each', () => {
  const missing = CATALOG.filter((s) => !hangul[s]);
  assert.deepEqual(missing, []);
  for (const s of CATALOG) {
    assert.ok(hangul[s].ko_keywords.length >= 8, s);
    for (const k of hangul[s].ko_keywords) assert.match(k, HANGUL, `${s}: ${k}`);
  }
});

const BRIEFS = [
  ['성수동 독립 책방 랜딩 페이지', 'editorial', ['책방', '독립']],
  ['세무사 사무소 홈페이지', 'modern-minimal', ['세무']],
  ['동네 분식집 메뉴 페이지', 'playful', ['분식']],
  ['수면 앱 소개', 'atmospheric', ['수면', '앱']],
];
for (const [prompt, genre, expect] of BRIEFS) {
  test(`Korean brief deals on ko_keywords: ${prompt}`, () => {
    const hand = deal(prompt, genre);
    assert.equal(hand.length, 3);
    assert.ok(hand[0].hits.length > 0, 'the first dealt theme has a Korean hit');
    assert.ok(hand[0].hits.some((h) => expect.includes(h)), `${hand[0].slug} hits ${hand[0].hits}`);
    for (const t of hand) for (const h of t.hits) {
      assert.ok(prompt.includes(h), `${t.slug}: hit "${h}" is in the brief`);
      assert.ok(koWords(t).includes(h), `${t.slug}: hit "${h}" is one of its Korean keywords`);
    }
  });
}

test('a Korean word with a particle still matches (substring)', () => {
  const hand = deal('수면을 돕는 앱의 소개', 'atmospheric');
  assert.ok(hand[0].hits.includes('수면'), String(hand[0].hits));
});

test('a brief with no Korean keyword deals on genre only', () => {
  const hand = deal('안녕하세요', 'editorial');
  assert.equal(hand.length, 3);
  for (const t of hand) assert.deepEqual(t.hits, []);
});

// A Latin brief must deal exactly as the unpatched deal did, for one fixed seed. The sandbox holds the 50 original
// themes only (later themes shift the seeded tie-breaks), a frozen date and a fixed project salt.
const GOLDEN = [
  { seed: 'ceramics-studio-pottery-kiln-59ea·fixedsalt·2026-01-15·r0', deal: [['kiln', 14, ['kiln', 'ceramics', 'pottery', 'ceramics studio']], ['refract', 5, ['studio']], ['bloom', 2, []]] },
  { seed: 'ceramics-studio-pottery-kiln-59ea·fixedsalt·2026-01-15·r1', deal: [['atelier', 2, ['ceramics']], ['darkroom', 2, []], ['ribbon', 2, []]] },
];
function sandboxDeal(withHangul, extra) {
  const root = mkdtempSync(join(tmpdir(), 'deal-ko-sbx-'));
  mkdirSync(join(root, 'scripts')); mkdirSync(join(root, 'references', 'themes'), { recursive: true }); mkdirSync(join(root, 'proj'));
  copyFileSync(THEME_JS, join(root, 'scripts', 'theme.mjs'));
  for (const s of CATALOG) copyFileSync(join(THEMES, `${s}.md`), join(root, 'references', 'themes', `${s}.md`));
  if (withHangul) copyFileSync(join(THEMES, 'hangul.json'), join(root, 'references', 'themes', 'hangul.json'));
  writeFileSync(join(root, 'proj', 'salt'), 'fixedsalt\n');
  writeFileSync(join(root, 'fix-date.mjs'), "const R = Date; const F = '2026-01-15T12:00:00.000Z'; globalThis.Date = class extends R { constructor(...a) { super(...(a.length ? a : [F])); } static now() { return new R(F).getTime(); } };\n");
  const out = execFileSync('node', ['--import', join(root, 'fix-date.mjs'), join(root, 'scripts', 'theme.mjs'), 'deal', '--genre', 'atmospheric', '--prompt', 'a landing page for a ceramics studio and pottery kiln', '--log', join(root, 'proj', 'log.json'), '--json', ...extra], { encoding: 'utf8' });
  const j = JSON.parse(out);
  return { seed: j.seed, deal: j.deal.map((d) => [d.slug, d.fit, d.hits]) };
}
for (const [i, extra] of [[0, []], [1, ['--reroll', '1']]]) {
  test(`English brief deals as before (reroll ${i}), with and without hangul.json`, () => {
    assert.deepEqual(sandboxDeal(true, extra), GOLDEN[i]);
    assert.deepEqual(sandboxDeal(false, extra), GOLDEN[i]);
  });
}
