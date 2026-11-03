import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Korean gates 91 to 96. Static tests always run; the render tests need Chrome and puppeteer
// (CHROME_PATH, and puppeteer-core resolvable from NODE_PATH or the working directory) and skip without them.
const here = dirname(fileURLToPath(import.meta.url));
const SLOPLINT = join(here, 'sloplint.mjs');
const FIX = join(here, 'fixtures');
const KO = new Set(['91', '92', '93', '94', '95', '96']);

const work = mkdtempSync(join(tmpdir(), 'hallmark-ko-'));
test.after(() => rmSync(work, { recursive: true, force: true }));
let seq = 0;
// Lint a copy in a temp folder, so screenshots from --render never land in the fixtures.
function lint(html, flags = []) {
  const dir = join(work, `p${seq++}`);
  cpSync(join(FIX, 'korean-pass'), dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  const run = spawnSync(process.execPath, [SLOPLINT, join(dir, 'index.html'), '--json', ...flags], { encoding: 'utf8', cwd: dir, timeout: 180000 });
  const json = JSON.parse(run.stdout);
  return { ...json, ko: json.findings.filter((f) => KO.has(String(f.gate))) };
}
const pass = readFileSync(join(FIX, 'korean-pass', 'index.html'), 'utf8');
const fail = readFileSync(join(FIX, 'korean-fail', 'index.html'), 'utf8');
const gates = (r) => new Set(r.ko.map((f) => String(f.gate)));
const swap = (src, a, b) => { assert.ok(src.includes(a), `fixture lacks ${a}`); return src.replace(a, b); };
const renders = lint(pass, ['--render']).summary.render === 'ran';
const skipRender = renders ? false : 'render tier not available (needs Chrome and puppeteer)';

test('korean-pass trips no Korean gate (static)', () => {
  assert.deepEqual(lint(pass).ko, []);
});

test('korean-fail trips the static Korean gates, with the right tiers', () => {
  const r = lint(fail);
  assert.deepEqual([...gates(r)].sort(), ['91', '92', '93', '96']);
  assert.equal(r.ko.find((f) => f.gate === '91').grade, 'FAIL');
  assert.equal(r.ko.find((f) => f.gate === '91').tier, 'floor');
  for (const g of ['92', '93', '96']) assert.equal(r.ko.find((f) => f.gate === g).grade, 'REFLEX');
  assert.ok(r.findings.some((f) => f.gate === '96' && f.evidence.includes('지금 바로 시작하세요')));
});

test('korean-pass trips no Korean gate (render)', { skip: skipRender }, () => {
  assert.deepEqual(lint(pass, ['--render']).ko, []);
});

test('korean-fail trips all of 91 to 96 (render)', { skip: skipRender }, () => {
  assert.deepEqual([...gates(lint(fail, ['--render']))].sort(), ['91', '92', '93', '94', '95', '96']);
});

test('gate 91: lang must be Korean on a mostly Hangul page', () => {
  assert.deepEqual([...gates(lint(swap(pass, '<html lang="ko">', '<html lang="en">')))], ['91']);
  assert.deepEqual([...gates(lint(swap(pass, '<html lang="ko">', '<html>')))], ['91']);
  assert.deepEqual(lint(swap(pass, '<html lang="ko">', '<html lang="ko-KR">')).ko, []);
  assert.deepEqual(lint(swap(swap(pass, '<html lang="ko">', '<html>'), '<body>', '<body lang="ko">')).ko, []);
});

test('gate 92: a Korean family before the generic, or none', () => {
  const latin = swap(swap(pass, '"Noto Serif KR", "Nanum Myeongjo", serif', '"Fraunces", serif'), '"Noto Sans KR", sans-serif', '"Inter", system-ui, sans-serif');
  assert.deepEqual([...gates(lint(latin))], ['92']);
  // a Korean family after the generic is unreachable
  const late = swap(pass, '"Noto Sans KR", sans-serif', 'sans-serif, "Noto Sans KR"');
  assert.deepEqual([...gates(lint(late))], ['92']);
  // a family not on the list but named with a KR suffix counts; a :lang(ko) override counts
  assert.deepEqual(lint(swap(pass, '"Noto Sans KR", sans-serif', '"Acme Sans KR", sans-serif')).ko, []);
  assert.deepEqual(lint(swap(latin, '</style>', ':lang(ko) { font-family: "Pretendard Variable", sans-serif; }\n</style>')).ko, []);
});

test('gate 93: keep-all anywhere satisfies the static half', () => {
  const none = swap(pass, ' word-break: keep-all;', '');
  assert.deepEqual([...gates(lint(none))], ['93']);
  assert.deepEqual(lint(swap(none, '</style>', 'main { word-break: keep-all; }\n</style>')).ko, []);
  // a comment is not a declaration
  assert.deepEqual([...gates(lint(swap(none, '</style>', '/* word-break: keep-all */\n</style>')))], ['93']);
});

test('gate 93 to 95 render checks read computed values', { skip: skipRender }, () => {
  const g = (src) => [...gates(lint(src, ['--render']))].sort();
  assert.deepEqual(g(swap(pass, ' word-break: keep-all;', '')), ['93']);
  assert.deepEqual(g(swap(pass, 'em, i, cite { font-style: normal; font-weight: 700; }', 'em, i, cite { font-style: italic; }').replace('외투 주머니에 들어가는 크기입니다.', '<em>외투 주머니</em>에 들어가는 크기입니다.')), ['94']);
  // font-synthesis: none stops the slant, so italic Hangul is not drawn slanted
  assert.deepEqual(g(swap(pass, 'em, i, cite { font-style: normal; font-weight: 700; }', 'em, i, cite { font-style: italic; font-synthesis: none; }').replace('외투 주머니에 들어가는 크기입니다.', '<em>외투 주머니</em>에 들어가는 크기입니다.')), []);
  assert.deepEqual(g(swap(pass, 'h1, h2, h3 { margin: 0; font-family: var(--font-display); font-weight: var(--display-weight); font-synthesis: none; line-height: 1.3;', 'h1, h2, h3 { margin: 0; font-family: var(--font-display); font-weight: var(--display-weight); font-synthesis: none; line-height: 1.05;')), ['95']);
  assert.deepEqual(g(swap(pass, 'font-size: var(--text-md); line-height: 1.7;', 'font-size: var(--text-md); line-height: 1.3;')), ['95']);
});

test('gate 96: stock copy by stem, across inline tags; 에 있어서 is allowed in legal text', () => {
  const withCopy = (text) => swap(pass, '<p>표지 오른쪽 아래에 열두 글자까지 박을 수 있습니다. 비용은 3,000원입니다.</p>', `<p>${text}</p>`);
  assert.deepEqual([...gates(lint(withCopy('이 노트는 <strong>혁신적인</strong> 솔루션입니다.')))], ['96']);
  assert.deepEqual([...gates(lint(withCopy('기록이 중요해서 문장이 되어집니다.')))], ['96']);
  assert.deepEqual([...gates(lint(withCopy('지금이 바로 책상을 정리할 때입니다.')))], ['96']);
  assert.deepEqual([...gates(lint(withCopy('단순한 노트를 넘어 기록의 도구가 됩니다.')))], ['96']);
  assert.deepEqual([...gates(lint(withCopy('물론이죠.')))], ['96']);
  assert.deepEqual(lint(withCopy('문장 끝에 물론이죠 하고 답하는 사람도 있습니다.')).ko, []);
  assert.deepEqual([...gates(lint(withCopy('제작에 있어서 가장 중요한 것은 실입니다.')))], ['96']);
  assert.deepEqual(lint(withCopy('제5조 이 약관의 적용에 있어서 회사는 환불을 따릅니다.')).ko, []);
});

test('gate 96 is skipped in app scope and as notes under copy: verbatim; 91 to 95 still apply', () => {
  const r = lint(fail, ['--scope', 'app']);
  assert.ok(!gates(r).has('96'));
  assert.ok(gates(r).has('91') && gates(r).has('92') && gates(r).has('93'));
  const stamped = swap(fail, '/* Hallmark · job: sell', '/* Hallmark · copy: verbatim · job: sell');
  const v = lint(stamped).ko.filter((f) => f.gate === '96');
  assert.ok(v.length && v.every((f) => f.grade === 'NOTE'));
});

test('every Korean gate is inert without Hangul', () => {
  for (const name of ['exemplars/modern-minimal.html', 'exemplars/editorial.html', 'eyebrow-pass/index.html']) {
    const dir = join(work, `en${seq++}`);
    cpSync(join(FIX, dirname(name)), dir, { recursive: true });
    const run = spawnSync(process.execPath, [SLOPLINT, join(dir, name.split('/')[1]), '--json'], { encoding: 'utf8', cwd: dir });
    assert.deepEqual(JSON.parse(run.stdout).findings.filter((f) => KO.has(String(f.gate))), [], name);
  }
  // an English page with a language switcher is not a Korean page
  const switcher = swap(swap(pass, '<html lang="ko">', '<html lang="en">'), '<a class="site__link" href="#order">주문 방법</a>', '<a class="site__link" href="/ko">한국어</a>');
  const english = switcher.replace(/>([^<>]*[가-힣][^<>]*)</g, (m, t) => (t.includes('한국어') ? m : `>${'Plain English words here. '.repeat(Math.max(1, Math.ceil(t.length / 24)))}<`)).replace(/(content|title)="[^"]*[가-힣][^"]*"/g, '$1="English"').replace(/<title>[^<]*<\/title>/, '<title>English page</title>');
  assert.deepEqual(lint(english).ko, []);
});

test('a waiver on a Korean Reflex gate is accepted; gate 91 (Floor) cannot be waived', () => {
  const noKeep = swap(pass, ' word-break: keep-all;', '');
  const waive = (g, extra) => swap(noKeep, '/* Hallmark · pre-emit critique', `/* Hallmark · waive ${g} · ${extra} */\n/* Hallmark · pre-emit critique`);
  const ok = lint(waive('93', 'no keep-all anywhere in the CSS · the notebook names are Latin product codes and wrap by character'));
  assert.equal(ok.ko.find((f) => f.gate === '93').grade, 'WAIVED');
  const floor = lint(waive('91', 'declares no lang · the notebook names are Latin product codes and wrap by character').replace('<html lang="ko">', '<html>'));
  assert.ok(floor.findings.some((f) => f.gate === '91' && f.grade === 'FAIL'));
  assert.ok(floor.findings.some((f) => f.grade === 'WAIVER' && /Floor is never waivable/.test(f.evidence)));
});
