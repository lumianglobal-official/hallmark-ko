// Korean gates 91 to 96 for sloplint (ids and tiers: references/gates.md, "Korean (Hangul pages only)").
// Zero dependencies. Every gate is inert on a page that is not Korean: no Hangul, or too little of it to be the page's language.
// sloplint.mjs imports checkKorean (static: 91, 92, 93, 96); sloplint-render.mjs imports observeKorean (render: 93, 94, 95).

const HANGUL = /[ᄀ-ᇿ㄰-㆏ꥠ-꥿가-힯ힰ-퟿]/g;
const count = (re, s) => (s.match(re) || []).length;
const trunc = (s, n = 72) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const famKey = (f) => String(f || '').replace(/[\s_-]+/g, '').toLowerCase();

// Families with Hangul glyphs that a Korean page can name on purpose (research/families.tsv, plus the usual web aliases).
// System faces (Malgun Gothic, Apple SD Gothic Neo) are deliberately absent: they are the fallback the gate looks for.
const KOREAN_FAMILIES = [
  'Asta Sans', 'Bagel Fat One', 'Black And White Picture', 'Black Han Sans', 'Cute Font', 'Diphylleia', 'Do Hyeon', 'Dokdo', 'Dongle',
  'East Sea Dokdo', 'Gaegu', 'Gamja Flower', 'Gasoek One', 'Gothic A1', 'Gowun Batang', 'Gowun Dodum', 'Grandiflora One', 'Gugi', 'Hahmlet',
  'Hi Melody', 'IBM Plex Sans KR', 'Jua', 'Kirang Haerang', 'Moirai One', 'Nanum Brush Script', 'Nanum Gothic', 'Nanum Gothic Coding',
  'Nanum Myeongjo', 'Nanum Pen Script', 'Noto Sans KR', 'Noto Serif KR', 'Orbit', 'Poor Story', 'Single Day', 'Song Myung', 'Stylish',
  'Sunflower', 'Yeon Sung', 'Pretendard Variable', 'SUIT Variable', 'Wanted Sans Variable', 'Spoqa Han Sans Neo', 'Maru Buri',
  'Nanum Square Neo', 'Nanum Square Round', 'Paperlogy', 'Gmarket Sans', 'LINE Seed KR', 'KoPubWorld Batang', 'KoPubWorld Dotum',
  'RIDIBatang', 'Galmuri11', 'NeoDunggeunmo', 'D2Coding',
  // aliases: the same faces under the names pages actually write
  'Pretendard', 'Pretendard GOV', 'SUIT', 'Wanted Sans', 'Spoqa Han Sans', 'NanumGothic', 'NanumMyeongjo', 'NanumSquare', 'Noto Sans CJK KR',
  'Noto Serif CJK KR', 'Source Han Sans K', 'Source Han Serif K', 'Source Han Sans KR', 'Source Han Serif KR', 'GmarketSans', 'KoPub Batang',
  'KoPub Dotum', 'Ridibatang', 'Galmuri9', 'Galmuri14', 'Gowun',
].map(famKey);
const KOREAN_SET = new Set(KOREAN_FAMILIES);
const korean = (name) => {
  const k = famKey(name);
  return KOREAN_SET.has(k) || KOREAN_SET.has(k.replace(/variable$/, '')) || /(^|[^a-z])(kr|kor|korean|hangul)([^a-z]|$)/i.test(String(name).replace(/([a-z])([A-Z])/g, '$1 $2')) || /^(noto(sans|serif)(cjk)?)?(kr|kor)$/.test(k);
};
const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'math', 'emoji', 'fangsong']);

function stackOf(value) {
  const out = [];
  let cur = '', q = null;
  for (const ch of String(value)) {
    if (q) { if (ch === q) q = null; else cur += ch; continue; }
    if (ch === '"' || ch === "'") { q = ch; continue; }
    if (ch === ',') { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}
// the families a browser can reach before it stops at a generic keyword
const reachable = (stack) => { const r = []; for (const f of stack) { if (GENERIC.has(f.toLowerCase())) break; r.push(f); } return r; };

const KO_SCOPE = /:lang\(\s*["']?ko|\[lang(?:[\^|~$*]?=)\s*["']?ko/i;
const selParts = (sel) => String(sel).split(/,(?![^(]*\))/).map((p) => p.trim()).filter(Boolean);

// What a page is: Korean when it says so (lang) and has some Hangul, or when Hangul is a real share of its letters.
function profile(doc, api) {
  if (doc._ko) return doc._ko;
  const prose = api.maskedProse(doc).replace(/&#?\w+;/g, ' ');
  const hangul = count(HANGUL, prose);
  const latin = count(/[A-Za-z]/g, prose);
  const share = hangul / (hangul + latin || 1);
  const langOf = (name) => { const t = doc.tags.find((x) => x.name === name && !x.close); return t ? { tag: t, lang: api.getAttr(t.attrs, 'lang') ?? api.getAttr(t.attrs, 'xml:lang') } : null; };
  const html = doc.kind === 'html' ? langOf('html') : null;
  const body = doc.kind === 'html' ? langOf('body') : null;
  const main = doc.kind === 'html' ? langOf('main') : null;
  const isKo = (l) => l && /^ko(?:-|$)/i.test(l.lang || '');
  const declared = isKo(html) || isKo(body) || isKo(main);
  const korean = (declared && hangul >= 1) || (hangul >= 8 && share >= 0.3);
  doc._ko = { prose, hangul, latin, share, html, declared, korean };
  return doc._ko;
}

// Korean stock copy (research/copy-slop.md § 3.2). Matched on text with all whitespace removed, so line breaks and inline tags
// inside a phrase do not hide it. Stems, because Korean endings inflect.
const PHRASES = [
  ['지금 바로 시작하세요', /지금바로시작하세요/, 'Name the act and the result: 「무료 체험 14일 시작」, 「견적 받기」'],
  ['특별한 경험을 선사', /특별한경험을선사/, 'Say what the person gets or does, with one concrete detail'],
  ['새로운 차원의', /새로운차원의/, 'Delete it, or give the measurable difference'],
  ['당신의 일상을 바꿀', /당신의일상을바꿀/, 'Name the situation: 「출근길 15분을 줄여 줍니다」'],
  ['혁신적인 솔루션', /혁신적인솔루션/, 'Name what it is (앱, 장비, 서비스) and what it does'],
  ['완벽한 솔루션', /완벽한솔루션/, 'Name what it is and drop the superlative (표시광고법 risk)'],
  ['원스톱 토탈 솔루션', /원스톱토탈솔루션/, 'List the steps you actually handle'],
  ['새로운 기준을 제시', /새로운기준을제시/, 'State the number or method that is different'],
  ['그 이상의 가치', /그이상의가치/, 'Delete it, or state the extra thing'],
  ['일상에 특별함을 더', /일상에특별함을더/, 'A concrete use case'],
  ['최고의 서비스를 제공', /최고의서비스를제공/, 'Real service terms (응답 시간, A/S 기간), with evidence if kept'],
  ['결론적으로', /결론적으로/, 'Put the conclusion first, with no connector'],
  ['시사하는 바가 크', /시사하는바가크/, 'State the actual implication'],
  ['되어진다 / 되어집니다', /되어(?:진다|집니다)/, '된다 / 됩니다'],
  ['크게 세 가지로 나눌 수', /크게세가지로나눌수/, 'Delete the lead-in and go to the three items'],
  ['지금이 바로 … 할 때입니다', /지금이바로[^.!?。]{0,40}?할때(?:입니다|이다|예요|이에요)/, 'A concrete reason to act now (기한, 재고, 일정)'],
  ['단순한 … 을/를 넘어', /단순한[^.!?。]{0,30}?(?:을|를)넘어/, '「X만이 아니라 Y」, or just say Y'],
  ['도움이 되셨길 바랍니다', /도움이되셨(?:길|기를)바랍니다/, 'Delete it, chat leakage'],
  ['잠시 떠올려 보세요', /잠시떠올려보세요/, 'Delete it and start with the point'],
  ['오늘부터 바로 도입해 보시길 권합니다', /오늘부터바로도입해보시길권합니다/, 'A specific next step with a link'],
  ['에 있어서', /에있어서/, '에서, 에게는, or restructure (statute and 약관 text excepted)'],
  ['논의를 진행하고자', /논의를진행하고자/, '논의하겠습니다 / 논의합니다'],
  ['핵심적인 요소라고 볼 수 있', /핵심적인요소라고볼수있/, 'Say it flat: 「X가 핵심입니다」, with the reason'],
  ['비약적인 성능 개선', /비약적인성능개선/, 'The measured figure with its baseline'],
];
const LEGAL = /약관|처리방침|제\d+조/;

export function checkKorean(ctx, api) {
  const { report } = api;
  const pages = ctx.docs.map((d) => ({ doc: d, p: profile(d, api) }));
  const koDocs = pages.filter((x) => x.p.korean);
  if (!koDocs.length) return;

  // 91: a mostly-Hangul page that does not declare lang="ko" (on html, body or main)
  for (const { doc, p } of koDocs) {
    if (doc.kind !== 'html' || !p.html || p.declared) continue;
    if (p.hangul < 20 || p.share < 0.5) continue;
    const got = p.html.lang == null ? 'declares no lang' : `declares lang="${trunc(p.html.lang, 12)}"`;
    report('91', 'FAIL', doc.file, p.html.tag.line, `${Math.round(p.share * 100)}% of the letters are Hangul, but <html> ${got}`, 'lang="ko" on <html>: screen readers, hyphenation, quote marks and the font fallback all key off it');
  }

  // 92: the stacks that reach Hangul name no Korean family
  const stacks = [];
  const fontFaces = new Set();
  const koScopedNamesKorean = ctx.rules.some((r) => !r.keyframes && selParts(r.selector).some((s) => KO_SCOPE.test(s)) && r.decls.some((d) => d.prop === 'font-family' && reachable(stackOf(api.resolveVars(d.value, ctx.tokens))).some(korean)));
  for (const r of ctx.rules) {
    if (r.keyframes) continue;
    if (r.selector === '@font-face') {
      const fam = r.decls.find((d) => d.prop === 'font-family');
      const range = r.decls.find((d) => d.prop === 'unicode-range');
      if (fam && range && /AC00|D7A3|1100/i.test(range.value)) fontFaces.add(famKey(fam.value.replace(/^['"]|['"]$/g, '')));
      continue;
    }
    for (const d of r.decls) {
      if (d.prop !== 'font-family') continue;
      for (const part of selParts(r.selector)) {
        if (KO_SCOPE.test(part)) continue;
        const last = part.split(/[\s>+~]+/).pop() || '';
        const rootish = /^(html|body|:root|\*)(?![\w-])[^\s>+~]*$/i.test(part) || /^(html|:root)\s*>?\s*body(?![\w-])[^\s>+~]*$/i.test(part);
        if (rootish || /^h[1-6](?![\w-])[^\s>+~]*$/i.test(last)) stacks.push({ label: `${part} { font-family }`, value: api.resolveVars(d.value, ctx.tokens), file: r.file, line: d.line });
      }
    }
  }
  for (const t of ['--font-display', '--font-body']) if (ctx.tokens[t]) stacks.push({ label: t, value: api.resolveVars(ctx.tokens[t], ctx.tokens), file: ctx.rules.find((r) => r.decls.some((d) => d.prop === t))?.file || koDocs[0].doc.file, line: ctx.rules.flatMap((r) => r.decls).find((d) => d.prop === t)?.line || 1 });
  const isKoFam = (f) => korean(f) || fontFaces.has(famKey(f));
  const htmlKo = koDocs.some((x) => x.doc.kind === 'html');
  if (htmlKo && !koScopedNamesKorean) {
    if (!stacks.length) {
      const d = koDocs.find((x) => x.doc.kind === 'html').doc;
      report('92', 'FAIL', d.file, 1, 'Hangul text with no font-family declared; it falls to the OS default (Malgun Gothic, Apple SD Gothic Neo)', 'Name a Korean family before the generic: the dealt theme Hangul pairing, or Wanted Sans Variable, Nanum Square Neo, IBM Plex Sans KR, Asta Sans (references/korean.md § 2)');
    }
    const seen = new Set();
    for (const s of stacks) {
      if (seen.has(s.value) || seen.size >= 2) continue;
      if (reachable(stackOf(s.value)).some(isKoFam)) continue;
      seen.add(s.value);
      report('92', 'FAIL', s.file, s.line, `${s.label}: ${trunc(s.value, 56)} names no Korean family, so Hangul falls to the OS default`, 'Put a Korean family before the generic: the dealt theme Hangul pairing, or Wanted Sans Variable, Nanum Square Neo, IBM Plex Sans KR, Asta Sans (references/korean.md § 2)');
    }
  }

  // 93, static half: no keep-all anywhere (the render half checks the computed value on each Hangul block)
  for (const { doc } of koDocs) {
    const anywhere = /word-break\s*:\s*keep-all|\bbreak-keep\b|\bwordBreak\s*:\s*['"]keep-all/.test((doc.masked + '\n' + ctx.allCss).replace(/\/\*[\s\S]*?\*\//g, ''));
    if (anywhere) continue;
    report('93', 'FAIL', doc.file, 1, 'Hangul text and no word-break: keep-all anywhere in the CSS', 'body { word-break: keep-all; overflow-wrap: break-word } so lines break between words, not mid-word');
  }

  // 96: stock Korean copy
  for (const { doc, p } of koDocs) {
    const flat = []; const map = [];
    for (let i = 0; i < p.prose.length; i++) if (!/\s/.test(p.prose[i])) { flat.push(p.prose[i]); map.push(i); }
    const text = flat.join('');
    const legal = LEGAL.test(text);
    const hit = new Set();
    for (const [label, re, fix] of PHRASES) {
      if (label === '에 있어서' && legal) continue;
      const m = re.exec(text);
      if (m && !hit.has(label) && hit.size < 8) { hit.add(label); report('96', 'FAIL', doc.file, doc.lineOf(map[m.index]), `stock Korean copy "${label}"`, fix); }
    }
    const greet = /(>\s*)(물론이죠|물론입니다)/.exec(doc.masked || '');
    if (greet && hit.size < 8) report('96', 'FAIL', doc.file, doc.lineOf(greet.index + greet[1].length), `stock Korean copy "${greet[2]}" opening a text block`, 'Delete it, chat leakage');
  }
}

// Render half of 93, plus 94 and 95. Runs inside the page (puppeteer stringifies it): no closures, no imports.
export function observeKorean(width) {
  const HG = /[ᄀ-ᇿ㄰-㆏ꥠ-꥿가-힯ힰ-퟿]/g;
  const out = [];
  const body = document.body;
  if (!body) return out;
  const all = body.innerText || '';
  const hangul = (all.match(HG) || []).length;
  const latin = (all.match(/[A-Za-z]/g) || []).length;
  const declared = /^ko(?:-|$)/i.test(document.documentElement.lang || '') || /^ko(?:-|$)/i.test(body.lang || '');
  if (!((declared && hangul >= 1) || (hangul >= 8 && hangul / (hangul + latin) >= 0.3))) return out;
  const tag = `[${width}px] `;
  const SKIP = /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|TITLE|OPTION|TEXTAREA|PRE|CODE|KBD|SAMP|SELECT|INPUT)$/;
  const key = (el) => el.tagName.toLowerCase() + (el.classList && el.classList[0] ? '.' + el.classList[0] : '');
  const list = (a) => [...new Set(a)].slice(0, 3).join(', ') + (new Set(a).size > 3 ? ` and ${new Set(a).size - 3} more` : '');
  const blocks = [];
  for (const el of body.querySelectorAll('*')) {
    if (SKIP.test(el.tagName) || el instanceof SVGElement) continue;
    let n = 0;
    const nodes = [];
    for (const c of el.childNodes) if (c.nodeType === 3) { const k = (c.nodeValue.match(HG) || []).length; if (k) { n += k; nodes.push(c); } }
    if (!n) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    blocks.push({ el, n, nodes, cs });
  }
  const lineInfo = (nodes, fs) => {
    const tops = [];
    for (const node of nodes) { const rg = document.createRange(); rg.selectNodeContents(node); for (const q of rg.getClientRects()) if (q.width > 0) tops.push(q.top); }
    tops.sort((a, b) => a - b);
    const lines = [];
    for (const t of tops) if (!lines.length || t - lines[lines.length - 1] > fs * 0.5) lines.push(t);
    return { count: lines.length, pitch: lines.length > 1 ? (lines[lines.length - 1] - lines[0]) / (lines.length - 1) : null };
  };

  // 93: computed word-break on Hangul text blocks (headings of any length, other blocks with a run of Hangul)
  const bad93 = blocks.filter((b) => (/^H[1-6]$/.test(b.el.tagName) || b.n >= 8) && b.cs.wordBreak !== 'keep-all');
  if (bad93.length) {
    out.push({ gate: '93', grade: 'FAIL', evidence: `${tag}${bad93.length} Hangul text block(s) compute word-break: ${bad93[0].cs.wordBreak} (${list(bad93.map((b) => key(b.el)))})`, fix: 'body { word-break: keep-all; overflow-wrap: break-word }; keep-all is inherited, so one rule on body covers headings and paragraphs' });
  }

  // 94: italic or oblique on Hangul (no Hangul face ships an italic, so the browser slants the glyphs; font-synthesis: none stops it)
  const bad94 = blocks.filter((b) => /^(italic|oblique)/.test(b.cs.fontStyle) && (b.cs.fontSynthesisStyle ? b.cs.fontSynthesisStyle !== 'none' : /style/.test(b.cs.fontSynthesis || 'style')));
  if (bad94.length) {
    out.push({ gate: '94', grade: 'FAIL', evidence: `${tag}Hangul set in ${bad94[0].cs.fontStyle} on ${list(bad94.map((b) => key(b.el)))}; the browser slants the glyphs`, fix: 'Upright Hangul: em, i, cite { font-style: normal } or font-synthesis: none; emphasise with weight, a mark or a colour instead' });
  }

  // 95: line-height, from the computed value or, for "normal", from the pitch of a wrapped block
  const low = [];
  for (const b of blocks) {
    const fs = parseFloat(b.cs.fontSize);
    if (!fs) continue;
    const display = /^H[1-6]$/.test(b.el.tagName) || fs >= 28;
    const numeric = b.cs.lineHeight !== 'normal' ? parseFloat(b.cs.lineHeight) : null;
    if (display) {
      if (numeric != null && numeric / fs < 1.15 - 0.005) low.push({ key: key(b.el), ratio: numeric / fs, need: '1.15', kind: 'display' });
      continue;
    }
    if (b.n < 8 || b.el.closest('button, nav, label, summary, [role="button"], [role="tab"]')) continue;
    const info = lineInfo(b.nodes, fs);
    if (info.count < 2) continue;
    const ratio = numeric != null ? numeric / fs : info.pitch / fs;
    if (ratio < 1.5 - 0.005) low.push({ key: key(b.el), ratio, need: '1.5', kind: 'body' });
  }
  for (const kind of ['display', 'body']) {
    const hit = low.filter((x) => x.kind === kind);
    if (!hit.length) continue;
    out.push({ gate: '95', grade: 'FAIL', evidence: `${tag}Hangul ${kind} line-height under ${hit[0].need}: ${list(hit.map((x) => `${x.key} ${x.ratio.toFixed(2)}`))}`, fix: kind === 'display' ? 'Display heads 1.25 to 1.5 (1.15 is the floor); Hangul blocks are taller than Latin ones and crowd at 1.0' : 'Body copy 1.6 to 1.8 (KRDS asks 1.5 at least); Hangul is dense and needs the air' });
  }
  return out;
}
