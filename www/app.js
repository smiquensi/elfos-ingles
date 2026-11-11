(() => {
'use strict';
const $ = s => document.querySelector(s);
const INT = [0, 1, 3, 7, 14, 30];
const SK = 'elfos_ingles_v1';
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const sleep = ms => new Promise(r => setTimeout(r, ms));

let C, MAN = {}, S, ui = { screen: 'welcome', wstep: 'name', nm: '', err: '' };

/* ---------- catálogo de desbloqueos ---------- */
const CAT = [
  { id: 'o_basic', cat: 'outfit', body: 'Pop', cloth: '#8E5CF0', name: 'Chaqueta estrella', base: 1 },
  { id: 'hat_elf_red', cat: 'hat', hat: 'Elf', color: '#E04545', name: 'Gorro de elfo rojo', r: 'c' },
  { id: 'hat_elf_blue', cat: 'hat', hat: 'Elf', color: '#3B82F6', name: 'Gorro de elfo azul', r: 'c' },
  { id: 'hat_elf_green', cat: 'hat', hat: 'Elf', color: '#2E9E5B', name: 'Gorro de elfo verde', r: 'c' },
  { id: 'hat_pop_pink', cat: 'hat', hat: 'Pop', color: '#FF7BAC', name: 'Gorra K-pop rosa', r: 'c' },
  { id: 'hat_pop_teal', cat: 'hat', hat: 'Pop', color: '#39D0C3', name: 'Gorra K-pop turquesa', r: 'c' },
  { id: 'hat_pop_yellow', cat: 'hat', hat: 'Pop', color: '#FFC83D', name: 'Gorra K-pop dorada', r: 'c' },
  { id: 'o_elf_green', cat: 'outfit', body: 'Elf', cloth: '#2E9E5B', name: 'Túnica de elfo verde', r: 'c' },
  { id: 'o_elf_red', cat: 'outfit', body: 'Elf', cloth: '#E04545', name: 'Túnica de elfo roja', r: 'c' },
  { id: 'o_elf_blue', cat: 'outfit', body: 'Elf', cloth: '#3B82F6', name: 'Túnica de elfo azul', r: 'c' },
  { id: 'o_pop_coral', cat: 'outfit', body: 'Pop', cloth: '#FF6F61', name: 'Chaqueta K-pop coral', r: 'c' },
  { id: 'o_pop_pink', cat: 'outfit', body: 'Pop', cloth: '#EC407A', name: 'Chaqueta K-pop rosa', r: 'c' },
  { id: 'o_pop_teal', cat: 'outfit', body: 'Pop', cloth: '#14B8A6', name: 'Chaqueta K-pop turquesa', r: 'c' },
  { id: 'hair_teal', cat: 'hair', color: '#39D0C3', name: 'Pelo turquesa', r: 'r' },
  { id: 'hair_violet', cat: 'hair', color: '#8E5CF0', name: 'Pelo violeta', r: 'r' },
  { id: 'hair_gold', cat: 'hair', color: '#FFC83D', name: 'Pelo dorado', r: 'r' },
  { id: 'pipo', cat: 'friend', name: 'Pipo, el elfo travieso', r: 'r' },
  { id: 'luna', cat: 'friend', name: 'Luna, la elfa estrella', r: 'r' },
  { id: 'nova', cat: 'friend', name: 'Nova, la elfa del ritmo', r: 'r' },
  { id: 'lia', cat: 'friend', name: 'Lía, la elfa rubia', r: 'r' },
  { id: 'tico', cat: 'friend', name: 'Tico, el elfo bailarín', r: 'r' },
  { id: 'pet_chispi', cat: 'pet', kind: 'Blob', color: '#FFB3D1', name: 'Chispi', r: 'e' },
  { id: 'pet_nube', cat: 'pet', kind: 'Cloud', color: '#9EC9FF', name: 'Nube', r: 'e' },
  { id: 'pet_rayo', cat: 'pet', kind: 'Cat', color: '#FFD84D', name: 'Rayo', r: 'e' },
  { id: 'pet_brote', cat: 'pet', kind: 'Sprout', color: '#A7E3A1', name: 'Brote', r: 'e' }
];
CAT.push(
  { id: 'prank_tp', cat: 'prank', scene: 'tp', ico: '🧻', name: 'Travesura: el árbol de papel', r: 'r' },
  { id: 'prank_flour', cat: 'prank', scene: 'flour', ico: '☁️', name: 'Travesura: nevada de harina', r: 'r' },
  { id: 'prank_mustache', cat: 'prank', scene: 'mustache', ico: '🖊️', name: 'Travesura: bigotes a escondidas', r: 'r' },
  { id: 'prank_candy', cat: 'prank', scene: 'candy', ico: '🍬', name: 'Travesura: lluvia de caramelos', r: 'e' }
);
const RAR = { c: ['Común', 6], r: ['Especial', 3], e: ['¡Épico!', 1] };
const CATN = { hat: 'Gorros', outfit: 'Ropa', hair: 'Pelo', friend: 'Amigos', pet: 'Mascotas', prank: 'Travesuras 🎬' };
const PRE = {
  pipo: { skin: '#E8B88A', hair: '#8B4A1F', hairStyle: 'short', eye: '#3A2A4A', eyes: 'Round', mouth: 'Cat', cloth: '#2E9E5B', body: 'Elf', hat: 'Elf', hatColor: '#E04545' },
  luna: { skin: '#FFE3CF', hair: '#3A2A6B', hairStyle: 'bob', eye: '#3A2A4A', eyes: 'Happy', mouth: 'Smile', cloth: '#8E5CF0', body: 'Pop', hat: 'Pop', hatColor: '#FF7BAC' },
  nova: { skin: '#C68642', hair: '#1B1B2B', hairStyle: 'pony', eye: '#3A2A4A', eyes: 'Star', mouth: 'Smile', cloth: '#FF6F61', body: 'Pop', hat: 'Pop', hatColor: '#39D0C3' },
  lia: { skin: '#FFD9B8', hair: '#FFC83D', hairStyle: 'pony', eye: '#2B6CB0', eyes: 'Round', mouth: 'Cat', cloth: '#2E9E5B', body: 'Elf', hat: 'Elf', hatColor: '#3B82F6' },
  tico: { skin: '#8D5524', hair: '#1F1F1F', hairStyle: 'short', eye: '#3A2A4A', eyes: 'Happy', mouth: 'Smile', cloth: '#3B82F6', body: 'Pop', hat: 'Pop', hatColor: '#FFC83D' }
};
const SKINS = ['#FFD9B8', '#F1C27D', '#C68642', '#8D5524'];
const HAIRS = ['#FF7BAC', '#3A2A6B', '#8B4A1F', '#1B1B2B', '#FFC83D', '#39D0C3'];
const STYLES = [['buns', 'Moños'], ['bob', 'Melena'], ['pony', 'Coleta'], ['short', 'Corto']];
const EYES = [['Round', 'Redondos'], ['Happy', 'Felices'], ['Star', 'Brillantes']];

/* ---------- estado ---------- */
function fresh() {
  return { v: 1, name: '', cfg: { skin: '#FFD9B8', hair: '#FF7BAC', hairStyle: 'buns', eye: '#3A2A4A', eyes: 'Round', mouth: 'Smile', cloth: '#8E5CF0', body: 'Pop' },
    owned: ['o_basic'], eq: { outfit: 'o_basic', hat: null, hair: null, friend: null, pet: null }, done: {}, stars: {}, boxes: 0, opened: 0, sparkles: 0, sr: {}, dayOff: 0, claimed: -1, intro: false };
}
/* Guardado doble: localStorage + almacén nativo de Android (Capacitor Preferences). Sobrevive a reinicios y a actualizar el APK. */
const NP = () => {
  try {
    const c = window.Capacitor;
    if (c && typeof c.nativePromise === 'function' && c.isNativePlatform && c.isNativePlatform())
      return { set: o => c.nativePromise('Preferences', 'set', o), get: o => c.nativePromise('Preferences', 'get', o), remove: o => c.nativePromise('Preferences', 'remove', o) };
    return (c && c.Plugins && c.Plugins.Preferences) || null; // (pruebas en navegador)
  } catch (e) { return null; }
};
const parseS = t => { try { const s = JSON.parse(t); return s && s.v === 1 ? s : null; } catch (e) { return null; } };
function load() { try { return parseS(localStorage.getItem(SK)); } catch (e) { return null; } }
function save() {
  if (!S) return; S.t = Date.now();
  const j = JSON.stringify(S);
  try { localStorage.setItem(SK, j); } catch (e) {}
  const p = NP(); if (p) { try { p.set({ key: SK, value: j }); } catch (e) {} }
}
async function loadBest() {
  const a = load(); let b = null;
  const p = NP(); if (p) { try { b = parseS((await p.get({ key: SK })).value); } catch (e) {} }
  const best = (a && b) ? ((b.t || 0) > (a.t || 0) ? b : a) : (a || b);
  if (best && best !== a) { try { localStorage.setItem(SK, JSON.stringify(best)); } catch (e) {} }
  return best;
}
const today = () => Math.floor((Date.now() + S.dayOff * 864e5) / 864e5);
const catItem = id => CAT.find(x => x.id === id);

/* ---------- dibujo ---------- */
function effCfg() {
  const c = { ...S.cfg }, e = S.eq;
  if (e.outfit) { const o = catItem(e.outfit); c.body = o.body; c.cloth = o.cloth; }
  if (e.hair) c.hair = catItem(e.hair).color;
  if (e.hat) { const h = catItem(e.hat); c.hat = h.hat; c.hatColor = h.color; }
  return c;
}
function elfSVG(c, w) {
  const hb = { buns: 'bunsB', bob: 'bobB', pony: 'ponyB' }[c.hairStyle];
  const hf = c.hairStyle === 'short' ? 'shortF' : 'bangsF';
  const st = `--skin:${c.skin};--hair:${c.hair};--eye:${c.eye};--cloth:${c.cloth};--hat:${c.hatColor || '#E04545'}`;
  return `<svg viewBox="-80 -100 160 210" width="${w || 120}" role="img" aria-label="elfo"><g style="${st}">${hb ? `<use href="#${hb}"/>` : ''}<use href="#body${c.body}"/><use href="#head"/><use href="#e${c.eyes}"/><use href="#m${c.mouth}"/><use href="#${hf}"/>${c.hat ? `<use href="#hat${c.hat}"/>` : ''}</g></svg>`;
}
function petSVG(kind, color, w) {
  return `<svg viewBox="-70 -60 140 120" width="${w || 90}" role="img" aria-label="mascota"><g style="--pet:${color}"><use href="#pet${kind}"/></g></svg>`;
}
function vis(v, big) {
  if (v.t === 'emoji') return `<span class="emo">${v.v}</span>`;
  if (v.t === 'swatch') return `<span class="sw" style="background:${v.v}"></span>`;
  if (v.t === 'num') return `<span class="numv">${v.v}<small>${'●'.repeat(v.v)}</small></span>`;
  if (v.t === 'elf') return elfSVG(v.v === 'me' ? effCfg() : PRE[v.v], big ? 150 : 110);
  return '';
}
function preview(it, w) {
  if (it.cat === 'prank') return `<div class="pv" style="font-size:${Math.round(w * .62)}px">🎬<small>${it.ico}</small></div>`;
  if (it.cat === 'friend') return elfSVG(PRE[it.id], w);
  if (it.cat === 'pet') return petSVG(it.kind, it.color, w);
  const c = effCfg();
  if (it.cat === 'hat') { c.hat = it.hat; c.hatColor = it.color; }
  if (it.cat === 'outfit') { c.body = it.body; c.cloth = it.cloth; }
  if (it.cat === 'hair') c.hair = it.color;
  return elfSVG(c, w);
}

/* ---------- audio ---------- */
let cur = null, curRes = null, AC;
function stopAudio() {
  if (cur) { try { cur.pause(); } catch (e) {} cur = null; }
  try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
  if (curRes) { const r = curRes; curRes = null; r(false); }
}
function say(key, text) {
  stopAudio();
  return new Promise(res => {
    curRes = res;
    const fin = () => { if (curRes === res) { curRes = null; res(true); } };
    const f = MAN[key];
    if (f) { const a = new Audio(f); cur = a; a.onended = fin; a.onerror = fin; a.play().catch(fin); }
    else if (text && window.speechSynthesis) { const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.6; u.pitch = 1.6; u.onend = fin; u.onerror = fin; speechSynthesis.speak(u); }
    else fin();
  });
}
const enText = t => t.replace('{name}', S.name);
const sayEn = t => { t = enText(t); return say('en:' + slug(t), t); };
const sayEs = k => say('es:' + k);
function tone(freqs, dur, type, vol) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime;
    freqs.forEach((f, i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'triangle'; o.frequency.value = f; o.connect(g); g.connect(AC.destination);
      g.gain.setValueAtTime(vol || .15, t + i * dur); g.gain.exponentialRampToValueAtTime(.001, t + i * dur + dur * 1.6); o.start(t + i * dur); o.stop(t + i * dur + dur * 1.7); });
  } catch (e) {}
}
/* alterna castellano e inglés (y rota las frases) para que no se repita siempre lo mismo */
async function sayUI(cat, esKeys, enKeys) {
  S.alt = S.alt || {}; const n = S.alt[cat] = (S.alt[cat] || 0) + 1, idx = Math.floor((n - 1) / 2);
  return (n % 2) ? sayEs(esKeys[idx % esKeys.length]) : say('en:ui_' + enKeys[idx % enKeys.length]);
}
async function ins(s, kind, es, en) { s.said = s.said || {}; if (s.said[kind]) return; s.said[kind] = 1; await sayUI('i_' + kind, [es], [en]); }
async function praise(s) { s.ok = (s.ok || 0) + 1; if (s.ok % 3 === 1) await sayUI('p', ['great', 'great2', 'great3', 'great4', 'great5', 'great6'], ['praise1', 'praise2', 'praise3', 'praise4', 'praise5', 'praise6']); }
/* sonidos tipo "campanita" (como Duolingo): suben de tono con cada acierto seguido */
function bell(f, d, dur, vol) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + d;
    [[1, 1], [2, .35], [3, .12]].forEach(([m, g]) => { const o = AC.createOscillator(), gn = AC.createGain(); o.type = 'sine'; o.frequency.value = f * m; o.connect(gn); gn.connect(AC.destination);
      gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime((vol || .18) * g, t + .01); gn.gain.exponentialRampToValueAtTime(.0001, t + dur); o.start(t); o.stop(t + dur + .05); });
  } catch (e) {}
}
const NOTAS = [523.25, 587.33, 659.25, 783.99, 880, 987.77, 1046.5, 1174.66];
const sfx = {
  ok: () => { const s = ui && ui.sess; const n = s ? (s.streak = (s.streak || 0) + 1) : 1, f = NOTAS[Math.min(n - 1, NOTAS.length - 1)]; bell(f, 0, .5); bell(f * 1.5, .09, .7, .2); if (n >= 3) bell(f * 2, .18, .8, .14); },
  bad: () => { tone([220, 180], .15, 'sine', .12); },
  win: () => { [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568].forEach((f, i) => bell(f, i * .11, .9, .16)); bell(2093, .7, 1.2, .1); },
  box: () => { [392, 523.25, 659.25, 783.99, 1046.5, 1318.5, 1568, 2093].forEach((f, i) => bell(f, i * .08, .8, .14)); }
};
/* ---------- comprobación de lectura (micrófono, solo en la app Android) ---------- */
const SRn = (m, o) => window.Capacitor.nativePromise('SpeechRecognition', m, o);
let MIC = false;
async function micInit() {
  try { const c = window.Capacitor; if (!(c && c.nativePromise && c.isNativePlatform && c.isNativePlatform())) return (MIC = false); const a = await SRn('available'); return (MIC = !!(a && a.available)); } catch (e) { return (MIC = false); }
}
async function micPerm() { try { let p = await SRn('checkPermissions'); if (p.speechRecognition !== 'granted') p = await SRn('requestPermissions'); return p.speechRecognition === 'granted'; } catch (e) { return false; } }
async function listenOnce() {
  try {
    const r = await Promise.race([SRn('start', { language: 'en-US', maxResults: 5, partialResults: false, popup: false }), new Promise(res => setTimeout(() => res({ status: 'timeout' }), 9000))]);
    if (r && r.status === 'timeout') { SRn('stop').catch(() => {}); return []; }
    return (r && r.matches) || [];
  } catch (e) { return null; }
}
const ALIAS = { i: ['eye', 'ai', 'aye'], he: ['hi', 'hey', 'e'], she: ['see', 'sea', 'sheet'], you: ['u', 'ew', 'yu'], no: ['know', 'now'], yes: ['yeah', 'yep', 'yess'], two: ['to', 'too'], four: ['for', 'fore'], one: ['won', 'want'], hello: ['hallo', 'hullo', 'hell o'], please: ['pleas', 'peas', 'plays'], blue: ['blu', 'blew'], green: ['grin', 'gren'], red: ['read', 'wred'], pink: ['think', 'ping'], three: ['tree', 'free', 'tri'], five: ['fife', 'fibe'], elf: ['elf', 'help', 'else', 'self'], happy: ['hoppy', 'happi'], girl: ['gal', 'girls'], boy: ['boi', 'buoy', 'bye'], thank: ['thanks', 'think', 'tank'], goodbye: ['good bye', 'goodby', 'good by'] };
const normT = t => (t || '').toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) { const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
const simW = (a, b) => (a === b || (ALIAS[b] || []).includes(a)) ? 1 : 1 - lev(a, b) / Math.max(a.length, b.length);
/* tolerante: vale con parecerse (no exige pronunciación perfecta) */
function heardOk(target, matches) {
  const T = normT(enText(target)), tw = T.split(' ');
  return (matches || []).some(m => { const M = normT(m); if (!M) return false; if (M === T) return true; const mw = M.split(' ');
    if (tw.length === 1) return mw.some(w => simW(w, T) >= .6) || simW(mw.join(''), T) >= .6;
    return tw.filter(w => mw.some(x => simW(x, w) >= .6)).length / tw.length >= .7; });
}
async function micRead() {
  const q = curQ(), s = ui.sess; if (!q || q.k !== 'say' || q.busy || q.locked) return;
  if (!(await micPerm())) { MIC = false; render(); return; }
  q.busy = true; q.st = 'listen'; stopAudio(); render();
  const heard = await listenOnce();
  if (ui.screen !== 'sess' || curQ() !== q) return;
  q.busy = false;
  if (heard === null) { q.err = (q.err || 0) + 1; q.st = ''; if (q.err >= 2) MIC = false; render(); return; }
  q.tries = (q.tries || 0) + 1;
  if (heardOk(q.it.en, heard)) {
    q.locked = true; q.st = 'ok'; s.readOk = (s.readOk || 0) + 1; s.readTot = (s.readTot || 0) + 1; sfx.ok(); clap(); render();
    await sayEn(q.it.en); if (ui.screen === 'sess' && curQ() === q) { await praise(s); if (ui.screen === 'sess' && curQ() === q) next(); }
  } else if (q.tries >= 3) {
    q.locked = true; q.st = 'give'; s.readTot = (s.readTot || 0) + 1; s.miss[q.it.id] = (s.miss[q.it.id] || 0) + 1; s.misses = (s.misses || 0) + 1; sfx.bad(); render();
    await sayUI('t', ['tryagain'], ['tryagain']); if (curQ() === q) { await sayEn(q.it.en); if (ui.screen === 'sess' && curQ() === q) next(); }
  } else {
    q.st = 'bad'; q.heard = (heard[0] || ''); sfx.bad(); render();
    await sayUI('t', ['tryagain'], ['tryagain']); if (curQ() === q) sayEn(q.it.en);
  }
}

function confetti() {
  const d = document.createElement('div'); d.className = 'conf';
  d.innerHTML = Array.from({ length: 34 }, () => `<span style="left:${Math.random() * 100}%;animation-delay:${Math.random() * .8}s">${['✨', '⭐', '💖', '🎉', '❄️'][Math.random() * 5 | 0]}</span>`).join('');
  document.body.appendChild(d); setTimeout(() => d.remove(), 3500);
}

/* ---------- repaso espaciado ---------- */
function allItems() { const m = {}; C.lessons.forEach(L => [...L.items, ...L.sentences].forEach(it => { m[it.id] = { it, L, sent: L.sentences.includes(it) }; })); return m; }
function dueIds() { const t = today(); return Object.keys(S.sr).filter(id => S.sr[id].due <= t); }
function grade(id, ok) {
  const r = S.sr[id] || { b: 0, due: 0 };
  r.b = ok ? Math.min(5, r.b + 1) : 0;
  r.due = today() + INT[r.b];
  S.sr[id] = r;
}

/* ---------- sesiones ---------- */
function snap() {
  if (!S) return; const s = ui && ui.sess;
  S.sess = s ? { kind: s.kind, lid: s.L ? s.L.id : null, i: s.i, miss: s.miss, misses: s.misses || 0, total: s.total, q: s.queue.map(q => ({ k: q.k, id: q.it.id, r: q.retried || 0 })) } : null;
  save();
}
function restoreSess() {
  const r = S && S.sess; if (!r || !r.q) return null;
  const A = allItems(), queue = r.q.filter(x => A[x.id]).map(x => ({ k: x.k, it: A[x.id].it, L: A[x.id].L, retried: x.r || undefined }));
  if (!queue.length || r.i >= queue.length) return null;
  return { kind: r.kind, L: r.lid ? C.lessons.find(l => l.id === r.lid) : undefined, queue, i: r.i, miss: r.miss || {}, misses: r.misses || 0, total: r.total || queue.length, extra: 0 };
}
function lessonQueue(L) {
  const q = [];
  [...L.items, ...L.sentences].forEach(it => q.push({ k: 'learn', it, L }));
  shuffle(L.items).forEach(it => q.push({ k: 'listen', it, L }));
  shuffle(L.items).forEach(it => q.push({ k: 'read', it, L }));
  shuffle(L.sentences).forEach(it => q.push({ k: 'build', it, L }));
  pick([...L.items, ...L.sentences], 4).forEach(it => q.push({ k: 'say', it, L }));
  return q;
}
function reviewQueue() {
  const A = allItems(), q = [];
  pick(dueIds().filter(id => A[id]), 8).forEach(id => {
    const { it, L, sent } = A[id];
    q.push({ k: sent ? 'build' : (Math.random() < .5 ? 'listen' : 'read'), it, L });
  });
  shuffle(q);
  if (MIC) pick(dueIds().filter(id => A[id]), 2).forEach(id => q.push({ k: 'say', it: A[id].it, L: A[id].L }));
  return q;
}
function startSession(kind, L) {
  const queue = kind === 'review' ? reviewQueue() : lessonQueue(L);
  if (!queue.length) return;
  ui = { screen: 'sess', sess: { kind, L, queue, i: 0, miss: {}, total: queue.length, extra: 0 } };
  snap(); enterQ(true);
}
const curQ = () => ui.sess.queue[ui.sess.i];
function prepQ(q) {
  if (q.ready) return;
  q.ready = true;
  if (q.k === 'listen' || q.k === 'read') q.opts = shuffle([q.it, ...pick(q.L.items.filter(x => x.id !== q.it.id), 2)]);
  if (q.k === 'build') {
    q.tok = enText(q.it.en).split(' ');
    let o; do { o = shuffle(q.tok.map((_, i) => i)); } while (q.tok.length > 1 && o.join() === q.tok.map((_, i) => i).join());
    q.order = o; q.placed = [];
  }
}
async function enterQ(first) {
  const q = curQ(); prepQ(q); q.locked = false; render();
  const s = ui.sess;
  if (first && s.kind === 'review') await sayEs('review_today');
  if (q.k === 'learn') { if (first) await sayUI('i_learn', ['learn'], ['learn']); if (ui.sess === s && curQ() === q) await sayEn(q.it.en); return; }
  if (q.k === 'listen') { await ins(s, 'listen', 'listen_tap', 'listen'); if (curQ() === q) sayEn(q.it.en); }
  else if (q.k === 'read') { await ins(s, 'read', 'read_tap', 'read'); }
  else if (q.k === 'build') { await ins(s, 'build', 'build', 'build'); if (curQ() === q) sayEn(q.it.en); }
  else if (q.k === 'say') { q.tries = 0; q.st = ''; if (MIC) { await ins(s, 'say', 'readaloud', 'readaloud'); } else { await ins(s, 'say', 'repeat', 'repeat'); if (curQ() === q) sayEn(q.it.en); } }
}
function miss(q) { const s = ui.sess; s.streak = 0; s.miss[q.it.id] = (s.miss[q.it.id] || 0) + 1; s.misses = (s.misses || 0) + 1; if (!q.retried && s.queue.length < s.total + 6) { s.queue.push({ k: q.k, it: q.it, L: q.L, retried: 1 }); } snap(); }
async function correct(q) {
  q.locked = true; sfx.ok(); clap();
  await praise(ui.sess);
  if (ui.screen === 'sess' && curQ() === q) next();
}
function next() {
  const s = ui.sess; s.i++;
  if (s.i >= s.queue.length) return finish();
  snap(); enterQ(false);
}
async function finish() {
  const s = ui.sess, A = allItems();
  const ids = new Set(s.queue.filter(q => q.k !== 'learn').map(q => q.it.id));
  ids.forEach(id => grade(id, !s.miss[id]));
  const m = s.misses || 0, stars = m <= 1 ? 3 : m <= 4 ? 2 : 1;
  let gotBox = false; const sp0 = S.sparkles;
  const readLow = !!s.readTot && (s.readOk || 0) / s.readTot < .5; // ha leído poco: sin caja ni lección nueva
  if (readLow) { S.sparkles += 1; }
  else if (s.kind === 'lesson') {
    const first = !S.done[s.L.id];
    if (first) S.nt = { d: today(), n: newToday() + 1 };
    S.done[s.L.id] = true; S.stars[s.L.id] = Math.max(S.stars[s.L.id] || 0, stars);
    if (first || stars === 3) { S.boxes++; gotBox = true; } else S.sparkles += 3;
  } else if (S.claimed !== today()) { S.claimed = today(); S.boxes++; gotBox = true; } else S.sparkles += 2;
  const conv = convertSparks(), gain = S.sparkles - sp0 + conv * SPARK_BOX;
  S.sess = null; save();
  ui = { screen: 'result', kind: s.kind, stars, gotBox: gotBox || conv > 0, readLow, conv, gain: gotBox ? 0 : gain };
  render(); sfx.win(); confetti();
  if (readLow) await sayUI('r', ['readlow'], ['readlow']); else await sayEs(s.kind === 'review' ? 'review_done' : 'lesson_done');
}

/* ---------- elfo mascota (asoma y aplaude) ---------- */
let mSig = '';
function syncMascot() {
  let m = document.getElementById('mascot');
  if (!m) { m = document.createElement('div'); m.id = 'mascot'; m.setAttribute('aria-hidden', 'true'); document.body.appendChild(m); }
  const on = ui && (ui.screen === 'sess' || ui.screen === 'result' || ui.screen === 'box');
  m.style.display = on ? '' : 'none';
  m.classList.toggle('cheer', !!ui && ui.screen === 'result');
  if (!on || !S) return;
  const sig = JSON.stringify([effCfg(), S.eq.friend]);
  if (sig !== mSig) { mSig = sig; m.innerHTML = '<div class="mb">' + elfSVG(effCfg(), 130) + '</div><div class="claps"></div>'; }
}
function clap() {
  const m = document.getElementById('mascot'); if (!m || m.style.display === 'none') return;
  m.classList.remove('clap'); void m.offsetWidth; m.classList.add('clap');
  const c = m.querySelector('.claps'); if (!c) return;
  c.innerHTML = ['👏', '👏', '✨'].map((e, i) => `<span style="--i:${i}">${e}</span>`).join('');
  setTimeout(() => { m.classList.remove('clap'); c.innerHTML = ''; }, 1400);
}

/* ---------- vistas ---------- */
function btnSpk(label) { return `<button class="spk" data-act="spk" aria-label="Escuchar">🔊</button>`; }
function topBar(extra) {
  return `<div class="top"><div class="chip">🧝 ${esc(S.name)}</div><div style="display:flex;gap:8px"><button class="chip" data-act="sparks" aria-label="Polvo de estrellas">✨ ${S.sparkles}/${SPARK_BOX}</button>${extra || ''}</div></div>`;
}
function vWelcome() {
  if (ui.wstep === 'name') return `<div class="card center"><h1>Elfos del Inglés</h1><p style="font-size:22px">¿Cómo te llamas?</p><input id="nm" class="inp" maxlength="14" autocomplete="off" value="${esc(ui.nm)}" aria-label="Tu nombre"><div class="err">${esc(ui.err)}</div><button class="btn big" data-act="wname">Siguiente</button></div>`;
  const c = ui.cfg;
  const sw = (arr, key) => arr.map(v => `<button class="tab ${c[key] === v ? 'on' : ''}" style="background:${v};${c[key] === v ? 'outline:4px solid #8E5CF0' : ''};width:46px;height:46px;padding:0" data-act="cfg" data-k="${key}" data-v="${v}" aria-label="color"></button>`).join('');
  const tb = (arr, key) => arr.map(([v, n]) => `<button class="tab ${c[key] === v ? 'on' : ''}" data-act="cfg" data-k="${key}" data-v="${v}">${n}</button>`).join('');
  return `<div class="card center"><h2>¡Crea tu elfo, ${esc(ui.nm)}!</h2>${elfSVG(c, 170)}<p><b>Piel</b></p><div class="tabs" style="justify-content:center">${sw(SKINS, 'skin')}</div><p><b>Peinado</b></p><div class="tabs" style="justify-content:center">${tb(STYLES, 'hairStyle')}</div><p><b>Color de pelo</b></p><div class="tabs" style="justify-content:center">${sw(HAIRS, 'hair')}</div><p><b>Ojos</b></p><div class="tabs" style="justify-content:center">${tb(EYES, 'eyes')}</div><button class="btn big" data-act="wdone">¡Listo!</button></div>`;
}
const SPARK_BOX = 10; // 10 polvos de estrellas = 1 caja sorpresa
function convertSparks() { let n = 0; while (S.sparkles >= SPARK_BOX) { S.sparkles -= SPARK_BOX; S.boxes++; n++; } return n; }
const DAILY_NEW = 2; // lecciones NUEVAS por día (repetir y repasar siempre se puede)
const newToday = () => (S.nt && S.nt.d === today()) ? S.nt.n : 0;
function vHome() {
  const e = S.eq, due = dueIds().length;
  const fr = e.friend ? `<div class="fr">${elfSVG(PRE[e.friend], 100)}</div>` : '', pt = e.pet ? (() => { const p = catItem(e.pet); return `<div class="pt">${petSVG(p.kind, p.color, 90)}</div>`; })() : '';
  const lessons = C.lessons.map((L, i) => {
    const lock0 = i > 0 && !S.done[C.lessons[i - 1].id], cap = !lock0 && !S.done[L.id] && newToday() >= DAILY_NEW, lock = lock0 || cap, st = S.stars[L.id] || 0;
    return `<button class="lesson ${lock ? 'lock' : ''}" data-act="lesson" data-id="${L.id}" ${lock ? 'disabled' : ''}><span class="ic">${L.icon}</span><span><b>${i + 1}. ${esc(L.title)}</b><small>${cap ? '🌙 ¡Hoy ya has hecho 2 nuevas! Sigue mañana' : lock ? 'Se abre al terminar la anterior' : S.done[L.id] ? 'Repetir' : '¡Empezar!'}</small></span><span class="st">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span></button>`;
  }).join('');
  return `${topBar(`<span class="chip">🎁 ${S.boxes}</span>`)}<div class="home"><div><div class="stage"><div class="hello">¡Hola, ${esc(S.name)}!</div><div class="scene">${fr}<div class="me">${elfSVG(effCfg(), 190)}</div>${pt}</div></div>
  <div class="row"><button class="btn alt" data-act="closet">👗 Armario</button><button class="btn ${due ? 'green' : 'alt'}" data-act="review" ${due ? '' : 'disabled'}>🔁 Repaso${due ? `<span class="badge">${due}</span>` : ' ✓'}</button></div></div>
  <div class="path">${prOwned().length ? '<button class="gift" data-act="pranks">🎬 ¡Mis travesuras de elfos!</button>' : ''}${restoreSess() ? `<button class="gift" data-act="resume">▶️ Seguir donde lo dejaste</button>` : ''}${S.boxes ? `<button class="gift" data-act="box">🎁 ¡Tienes ${S.boxes} caja${S.boxes > 1 ? 's' : ''} sorpresa!</button>` : ''}${lessons}</div></div><button class="gear" data-act="gear" aria-label="Opciones">⚙</button>`;
}
function vSess() {
  const s = ui.sess, q = curQ(), pct = Math.round(s.i / s.queue.length * 100);
  const bar = `<div class="top"><button class="chip" data-act="quit" aria-label="Salir">✕</button><div class="prog"><i style="width:${pct}%"></i></div></div>`;
  let h = '';
  if (q.k === 'learn') {
    const it = q.it, isS = !!it.en.includes(' ') || /[.!?]$/.test(it.en);
    h = `<h2>${esc(s.L.title)}</h2><div class="vis">${vis(it.vis, 1)}</div><div class="bigw">${esc(enText(it.en))}</div><div class="es">${esc(enText(it.es))}</div><button class="spk" data-act="spk" aria-label="Escuchar">🔊</button><br><button class="btn big" data-act="next">Siguiente ➜</button>`;
  } else if (q.k === 'listen') {
    h = `<h2>👂 Escucha</h2><button class="spk" data-act="spk" aria-label="Escuchar">🔊</button><div class="opts">${q.opts.map((o, i) => `<button class="opt" data-act="opt" data-i="${i}">${vis(o.vis)}<span class="lab">${esc(enText(o.es))}</span></button>`).join('')}</div>`;
  } else if (q.k === 'read') {
    h = `<h2>👀 Lee</h2><div class="bigw">${esc(enText(q.it.en))}</div><button class="spk" data-act="spk" aria-label="Escuchar">🔊</button><div class="opts">${q.opts.map((o, i) => `<button class="opt" data-act="opt" data-i="${i}">${vis(o.vis)}<span class="lab">${esc(enText(o.es))}</span></button>`).join('')}</div>`;
  } else if (q.k === 'build') {
    h = `<h2>🧩 Forma la frase</h2><div class="vis">${vis(q.it.vis)}</div><div class="es">${esc(enText(q.it.es))}</div><button class="spk" data-act="spk" aria-label="Escuchar">🔊</button><div class="ans" id="ans">${q.placed.map((ti, pi) => `<button class="tile" data-act="unplace" data-p="${pi}">${esc(q.tok[ti])}</button>`).join('')}</div><div class="pool">${q.order.map(ti => `<button class="tile ${q.placed.includes(ti) ? 'used' : ''}" data-act="place" data-t="${ti}">${esc(q.tok[ti])}</button>`).join('')}</div>`;
  } else if (q.k === 'say' && MIC) {
    const msg = q.st === 'bad' ? `<p class="hint">Casi… he oído «${esc(q.heard || '…')}». ¡Inténtalo otra vez, despacito!</p>` : q.st === 'ok' ? '<p class="hint">¡Muy bien leído! 🌟</p>' : q.st === 'give' ? '<p class="hint">Escucha cómo se dice y sigue ➜</p>' : '';
    h = `<h2>🗣️ Léelo en voz alta</h2><div class="bigw">${esc(enText(q.it.en))}</div><div class="es">${esc(enText(q.it.es))}</div>${q.st === 'listen' ? '<div class="micring">🎤 Te escucho…</div>' : q.locked ? '' : '<button class="btn big green" data-act="mic">🎤 Pulsa y léelo</button>'}${msg}${q.locked ? '' : '<br><button class="spk" data-act="spk" aria-label="Escuchar">🔊</button>'}`;
  } else if (q.k === 'say') {
    h = `<h2>🗣️ Repite</h2><div class="bigw">${esc(enText(q.it.en))}</div><div class="es">${esc(enText(q.it.es))}</div><button class="spk" data-act="spk" aria-label="Escuchar">🔊</button><br><button class="btn big green" data-act="said">🎤 ¡Ya lo dije!</button>`;
  }
  return `${bar}<div class="q">${h}</div>`;
}
function vResult() {
  const r = ui;
  return `<div class="card center"><h1>${r.readLow ? '¡Casi lo tienes!' : r.kind === 'review' ? '¡Repaso hecho!' : '¡Lección completada!'}</h1><div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}</div>${r.readLow ? '<p style="font-size:20px">🗣️ Lee en voz alta un poquito mejor para abrir la caja y la siguiente lección. ¡Tú puedes!</p>' : r.gotBox ? '<div style="font-size:90px">🎁</div><p style="font-size:20px">¡Has ganado una caja sorpresa!</p>' : `<p style="font-size:20px">✨ ¡+${r.gain} polvo de estrellas! Llevas ${S.sparkles}/${SPARK_BOX}<br><small>Con ${SPARK_BOX} te regalo una caja sorpresa 🎁</small></p>`}<div class="row">${r.gotBox ? '<button class="btn green" data-act="box">Abrir caja 🎁</button>' : ''}<button class="btn alt" data-act="home">Inicio</button></div></div>`;
}
function vBox() {
  const b = ui.box;
  if (b.stage === 'closed') return `${topBar()}<div class="card center"><h2>¡Caja sorpresa!</h2><button class="giftbox ${b.shake ? 'shake' : ''}" data-act="openbox" aria-label="Abrir caja">🎁</button><p style="font-size:20px">Toca la caja para abrirla</p><button class="btn alt" data-act="home">Más tarde</button></div>`;
  const it = b.item;
  if (!it) return `<div class="card center"><h2>¡Lo tienes todo!</h2><p style="font-size:22px">✨ +5 polvo de brillo</p><button class="btn big" data-act="home">Inicio</button></div>`;
  return `<div class="card center reveal"><span class="rar ${it.r}">${RAR[it.r][0]}</span><h2>¡${esc(it.name)}!</h2><div>${preview(it, 190)}</div><div class="row"><button class="btn green" data-act="equip" data-id="${it.id}">${it.cat === 'prank' ? '🎬 ¡Verla!' : '¡Ponérmelo!'}</button><button class="btn alt" data-act="${S.boxes ? 'box' : 'home'}">${S.boxes ? 'Otra caja 🎁' : 'Seguir'}</button></div></div>`;
}
function vCloset() {
  const t = ui.tab || 'hat', items = CAT.filter(x => x.cat === t && !x.base || (t === 'outfit' && x.base));
  const own = items.filter(x => S.owned.includes(x.id)).length;
  const cells = items.map(x => S.owned.includes(x.id)
    ? `<button class="cell ${S.eq[t] === x.id ? 'on' : ''}" data-act="wear" data-id="${x.id}">${preview(x, 90)}<span>${esc(x.name)}</span></button>`
    : `<div class="cell q">?</div>`).join('');
  return `${topBar()}<div class="card"><div class="tabs">${Object.entries(CATN).map(([k, n]) => `<button class="tab ${t === k ? 'on' : ''}" data-act="tab" data-k="${k}">${n}</button>`).join('')}</div><p class="hear">${own}/${items.length} desbloqueados · toca uno para ponértelo o quitártelo</p><div class="grid">${cells}</div><div class="row"><button class="btn alt" data-act="home">⬅ Inicio</button></div></div>`;
}
function render() {
  const a = $('#app');
  let h = '';
  if (ui.screen === 'welcome') h = vWelcome();
  else if (ui.screen === 'home') h = vHome();
  else if (ui.screen === 'sess') h = vSess();
  else if (ui.screen === 'prank') h = vPrank();
  else if (ui.screen === 'result') h = vResult();
  else if (ui.screen === 'box') h = vBox();
  else if (ui.screen === 'closet') h = vCloset();
  a.innerHTML = h + (ui.gear ? gearHTML() : '') + (ui.spk ? sparkHTML() : '');
  syncMascot();
}
function sparkHTML() {
  const pct = Math.round(S.sparkles / SPARK_BOX * 100);
  return `<div class="ov"><div class="card center"><h2>✨ Polvo de estrellas</h2><div style="font-size:54px">✨🧝✨</div><p style="font-size:20px">Tienes <b>${S.sparkles}</b> de ${SPARK_BOX}.<br>¡Con ${SPARK_BOX} se convierten en una <b>caja sorpresa</b> 🎁!</p><div class="prog" style="height:18px;margin:8px 0 16px"><i style="width:${pct}%"></i></div><p style="font-size:16px">Ganas polvo repitiendo lecciones y repasando.</p><button class="btn" data-act="sclose">¡Vale!</button></div></div>`;
}
function gearHTML() {
  return `<div class="ov"><div class="card"><h2>Opciones para padres</h2><button class="btn alt" data-act="gday">▶ Avanzar un día (probar el repaso) · día +${S.dayOff}</button><button class="btn alt" data-act="gbox">🎁 Regalar una caja</button><button class="btn alt" data-act="gall">🔓 Completar todas las lecciones</button><button class="btn alt" data-act="greset">🗑 Borrar todo el progreso</button><button class="btn" data-act="gclose">Cerrar</button></div></div>`;
}

/* ---------- travesuras de elfos (formato reel) ---------- */
const PR = {
  tp: { n: 'El árbol de papel', t: '#elfos #travesuras #navidad', bub: '¡Ji, ji, ji! 😆' },
  flour: { n: 'Nevada de harina', t: '#elfos #travesuras #nieve', bub: '¡Nevada sorpresa! ❄️' },
  mustache: { n: 'Bigotes a escondidas', t: '#elfos #travesuras #bigotes', bub: '¡Shhh! 🤭' },
  candy: { n: 'Lluvia de caramelos', t: '#elfos #travesuras #caramelos', bub: '¡Dulce travesura! 🍭' }
};
let prT = [];
const prClear = () => { prT.forEach(clearTimeout); prT = []; };
const prOwned = () => CAT.filter(x => x.cat === 'prank' && S.owned.includes(x.id));
const prActor = (cls, w, extra) => `<div class="actor ${cls}" style="width:${w}cqw">${elfSVG(effCfg(), 200)}${extra || ''}</div>`;
const prPet = () => { const p = S.eq.pet && catItem(S.eq.pet); return p ? petSVG(p.kind, p.color, 160) : '<span style="font-size:30cqw">🐶</span>'; };
function prScene(sc) {
  const bub = `<div class="bub b-${sc}">${PR[sc].bub}</div>`;
  if (sc === 'tp') return `<div class="sc"><div class="wall w1"></div><div class="floor"></div><div class="win">❄️</div><div class="tree">🎄</div>${[0, 1, 2, 3, 4, 5].map(i => `<i class="tpw" style="top:${38 + i * 8}%;--r:${i % 2 ? 6 : -6}deg;animation-delay:${2 + i * .8}s;transform-origin:${i % 2 ? 'right' : 'left'}"></i>`).join('')}${prActor('tpA', 30, '<span class="roll">🧻</span>')}${bub}</div>`;
  if (sc === 'flour') return `<div class="sc"><div class="wall w2"></div><div class="floor"></div><div class="shelf"></div>${prActor('flA', 26)}<div class="bowl">🥣</div>${Array.from({ length: 16 }, (_, i) => `<i class="fl" style="--x:${(i % 5 - 2) * 3}cqw;animation-delay:${3 + i * .1}s"></i>`).join('')}<div class="petw">${prPet()}</div><div class="snowc"></div>${bub}</div>`;
  if (sc === 'mustache') return `<div class="sc"><div class="wall w3"></div><div class="floor f3"></div><div class="ted">🧸</div><div class="zz">💤</div><svg class="mus" viewBox="0 0 100 40"><path pathLength="100" d="M6 26 Q24 4 50 22 Q76 4 94 26 Q76 20 50 34 Q24 20 6 26Z"/></svg><div class="pen">🖊️</div><div class="wow">😲</div>${prActor('muA', 30)}${bub}</div>`;
  return `<div class="sc"><div class="wall w4"></div><div class="lamp">💡</div><div class="swing"><i class="cord"></i>${prActor('caA', 28)}</div>${Array.from({ length: 18 }, (_, i) => `<i class="cd" style="left:${6 + (i * 37) % 86}%;--t:${74 + (i * 7) % 12}%;animation-delay:${2 + i * .3}s">${['🍬', '🍭', '🍫', '🍬'][i % 4]}</i>`).join('')}<div class="pile"></div>${bub}</div>`;
}
function vPrank() {
  const m = PR[ui.id], many = prOwned().length > 1;
  return `<div class="reelw"><div class="reel" data-sc="${ui.id}"><div class="rbar"><i></i></div>${prScene(ui.id)}<button class="rx" data-act="pclose" aria-label="Cerrar">✕</button><div class="rside"><button data-act="plike" aria-label="Me gusta">❤️<b>${ui.likes}</b></button><button data-act="preplay" aria-label="Otra vez">🔁</button>${many ? '<button data-act="pnext" aria-label="Siguiente">⏭</button>' : ''}</div><div class="rinfo"><b>@${esc(S.name.toLowerCase())}_elfa 🧝</b><span>Travesura: ${m.n}</span><small>${m.t}</small></div><div class="rend"><button class="btn big" data-act="preplay">🔁 Otra vez</button>${many ? '<button class="btn alt" data-act="pnext">⏭ Otra travesura</button>' : ''}<button class="btn alt" data-act="pclose">Cerrar</button></div></div></div>`;
}
function prStart() {
  const id = ui.id, T = (ms, f) => prT.push(setTimeout(() => { if (ui && ui.screen === 'prank' && ui.id === id) f(); }, ms));
  say('es:prank');
  if (id === 'tp') [1500, 3300, 5100].forEach(t => T(t, () => tone([392, 587, 784], .07)));
  if (id === 'flour') { T(2300, () => tone([300, 220], .12, 'sine')); [3200, 3900, 4600, 5300].forEach(t => T(t, () => tone([700, 900], .05))); }
  if (id === 'mustache') [2400, 2800, 3200].forEach(t => T(t, () => tone([180, 240, 200], .05, 'sawtooth', .05)));
  if (id === 'candy') for (let t = 2200; t < 7500; t += 450) T(t, () => tone([900 + Math.random() * 600], .05));
  T(7000, () => { say('es:giggle'); });
  T(7300, () => sfx.win());
}
function playPrank(id, from) { stopAudio(); prClear(); ui = { screen: 'prank', id, from: from || 'home', likes: ui && ui.likes || 0 }; render(); prStart(); }
function prLeave() { prClear(); stopAudio(); const f = ui.from; ui = f === 'closet' ? { screen: 'closet', tab: 'prank' } : { screen: 'home' }; render(); }
function prMove(d) { const o = prOwned(); if (!o.length) return; const i = Math.max(0, o.findIndex(x => x.scene === ui.id)); playPrank(o[(i + d + o.length) % o.length].scene, ui.from); }
let tY = null;
document.addEventListener('touchstart', e => { tY = ui && ui.screen === 'prank' ? e.touches[0].clientY : null; }, { passive: true });
document.addEventListener('touchend', e => { if (tY == null || !(ui && ui.screen === 'prank')) return; const d = e.changedTouches[0].clientY - tY; tY = null; if (Math.abs(d) > 70) prMove(d < 0 ? 1 : -1); }, { passive: true });

/* ---------- caja ---------- */
function roll() {
  const hue = h => { const n = parseInt((h || '#000000').slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d < .08) return -1; return ((mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60 + 360) % 360; };
  const parecido = (a, b) => { const x = hue(a), y = hue(b); if (x < 0 || y < 0) return x === y; const dd = Math.abs(x - y); return Math.min(dd, 360 - dd) < 18; };
  const mismo = x => x.cat === 'hair' && (parecido(x.color, S.cfg.hair) || parecido(x.color, effCfg().hair)); // no dar un pelo que ya se parece al suyo
  const un = CAT.filter(x => !x.base && !S.owned.includes(x.id) && !mismo(x));
  if (!un.length) return null;
  if (S.opened === 0) return catItem('hat_elf_red');
  if (!S.owned.some(id => id.startsWith('prank_'))) { const p = un.find(x => x.cat === 'prank'); if (p) return p; }
  const tot = un.reduce((a, x) => a + RAR[x.r][1], 0); let r = Math.random() * tot;
  for (const x of un) { r -= RAR[x.r][1]; if (r <= 0) return x; }
  return un[0];
}
async function openBox() {
  if (!ui.box || ui.box.stage !== 'closed') { ui = { screen: 'box', box: { stage: 'closed' } }; render(); sayEs('open_box'); return; }
}

/* ---------- eventos ---------- */
let gearT;
document.addEventListener('pointerdown', e => { const g = e.target.closest('[data-act="gear"]'); if (g) gearT = setTimeout(() => { ui.gear = true; render(); }, 1400); });
document.addEventListener('pointerup', () => clearTimeout(gearT));
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, s = ui.sess;
  if (act === 'gear') return;
  if (act === 'wname') { const v = ($('#nm').value || '').trim(); if (!v) { ui.err = 'Escribe tu nombre'; ui.nm = ''; render(); return; } ui.nm = v; ui.err = ''; ui.wstep = 'create'; ui.cfg = { ...fresh().cfg }; render(); }
  else if (act === 'cfg') { ui.cfg[el.dataset.k] = el.dataset.v; render(); }
  else if (act === 'wdone') { S = fresh(); S.name = ui.nm; S.cfg = ui.cfg; S.intro = true; save(); ui = { screen: 'home' }; render(); sayEs(S.name.toLowerCase() === 'vera' ? 'intro_vera' : 'intro'); }
  else if (act === 'resume') { const r = restoreSess(); if (r) { ui = { screen: 'sess', sess: r }; enterQ(false); } }
  else if (act === 'lesson') { startSession('lesson', C.lessons.find(l => l.id === el.dataset.id)); }
  else if (act === 'review') { startSession('review'); }
  else if (act === 'spk') { const q = curQ(); sayEn(q.it.en); }
  else if (act === 'next') { clap(); next(); }
  else if (act === 'quit') { stopAudio(); ui = { screen: 'home' }; render(); }
  else if (act === 'mic') micRead();
  else if (act === 'pclose') prLeave();
  else if (act === 'preplay') playPrank(ui.id, ui.from);
  else if (act === 'pnext') prMove(1);
  else if (act === 'plike') { ui.likes++; const b = el.querySelector('b'); if (b) b.textContent = ui.likes; sfx.ok(); const h = document.createElement('span'); h.className = 'heart'; h.textContent = '❤️'; el.appendChild(h); setTimeout(() => h.remove(), 900); }
  else if (act === 'pranks') { const o = prOwned(); if (o.length) playPrank(o[0].scene, 'home'); }
  else if (act === 'sparks') { ui.spk = true; sfx.ok(); render(); confetti(); }
  else if (act === 'sclose') { ui.spk = false; render(); }
  else if (act === 'said') { sfx.ok(); clap(); curQ().locked = true; next(); }
  else if (act === 'opt') {
    const q = curQ(); if (q.locked) return;
    const o = q.opts[+el.dataset.i];
    if (o.id === q.it.id) { el.classList.add('ok'); correct(q); }
    else { el.classList.add('bad'); sfx.bad(); miss(q); await sayUI('o', ['oops', 'oops2'], ['oops1', 'oops2']); if (curQ() === q) sayEn(q.it.en); }
  }
  else if (act === 'place') { const q = curQ(); if (q.locked) return; q.placed.push(+el.dataset.t); render(); if (q.placed.length === q.tok.length) checkBuild(q); }
  else if (act === 'unplace') { const q = curQ(); if (q.locked) return; q.placed.splice(+el.dataset.p, 1); render(); }
  else if (act === 'home') { stopAudio(); ui = { screen: 'home' }; render(); }
  else if (act === 'box') { ui = { screen: 'box', box: { stage: 'closed' } }; render(); sayEs('open_box'); }
  else if (act === 'openbox') {
    if (ui.box.stage !== 'closed') return;
    ui.box.shake = true; render(); sfx.box();
    await sleep(750);
    const item = roll(); S.boxes = Math.max(0, S.boxes - 1); S.opened++;
    if (item) S.owned.push(item.id); else { S.sparkles += 5; convertSparks(); }
    save(); ui = { screen: 'box', box: { stage: 'open', item } }; render(); confetti(); sfx.win(); sayEs('surprise');
  }
  else if (act === 'equip') { const p0 = catItem(el.dataset.id); if (p0.cat === 'prank') { playPrank(p0.scene, 'home'); return; } const it = catItem(el.dataset.id); S.eq[it.cat] = it.id; save(); ui = { screen: 'home' }; render(); }
  else if (act === 'closet') { ui = { screen: 'closet', tab: 'hat' }; render(); }
  else if (act === 'tab') { ui.tab = el.dataset.k; render(); }
  else if (act === 'wear') { const p0 = catItem(el.dataset.id); if (p0.cat === 'prank') { playPrank(p0.scene, 'closet'); return; } const it = catItem(el.dataset.id); S.eq[it.cat] = (S.eq[it.cat] === it.id && !it.base) ? null : it.id; if (it.cat === 'outfit' && !S.eq.outfit) S.eq.outfit = 'o_basic'; save(); render(); }
  else if (act === 'gclose') { ui.gear = false; render(); }
  else if (act === 'gday') { S.dayOff++; save(); render(); }
  else if (act === 'gbox') { S.boxes++; save(); ui.gear = false; render(); }
  else if (act === 'gall') { C.lessons.forEach(L => { S.done[L.id] = true; S.stars[L.id] = S.stars[L.id] || 1; }); save(); ui.gear = false; render(); }
  else if (act === 'greset') { try { localStorage.removeItem(SK); } catch (e) {} const p = NP(); if (p) { try { p.remove({ key: SK }); } catch (e) {} } S = null; ui = { screen: 'welcome', wstep: 'name', nm: '', err: '' }; render(); }
});
async function checkBuild(q) {
  const ok = q.placed.map(i => q.tok[i]).join(' ') === q.tok.join(' ');
  const ans = $('#ans');
  if (ok) { ans && ans.classList.add('ok'); q.locked = true; sfx.ok(); clap(); await sayEn(q.it.en); if (ui.screen === 'sess' && curQ() === q) { await praise(ui.sess); if (ui.screen === 'sess' && curQ() === q) next(); } }
  else { ans && ans.classList.add('bad'); sfx.bad(); miss(q); q.locked = true; await sayUI('o', ['oops', 'oops2'], ['oops1', 'oops2']); if (curQ() === q) { q.placed = []; q.locked = false; render(); sayEn(q.it.en); } }
}

/* ---------- arranque ---------- */
async function boot() {
  try {
    [C, MAN] = await Promise.all([fetch('content.json').then(r => r.json()), fetch('manifest.json').then(r => r.json())]);
  } catch (e) { $('#app').innerHTML = '<p class="loading">No se pudo cargar el curso. Recarga la página.</p>'; return; }
  if (location.hash === '#debug') window.__dbg = () => ({ ui, S, playPrank, render, roll, CAT, convertSparks, restoreSess, snap, newToday, today });
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
  S = await loadBest();
  micInit();
  document.addEventListener('visibilitychange', () => { if (document.hidden && S) save(); });
  window.addEventListener('pagehide', () => { if (S) save(); });
  ui = S && S.name ? { screen: 'home' } : { screen: 'welcome', wstep: 'name', nm: '', err: '' };
  render();
}
boot();
})();
