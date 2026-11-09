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
const RAR = { c: ['Común', 6], r: ['Especial', 3], e: ['¡Épico!', 1] };
const CATN = { hat: 'Gorros', outfit: 'Ropa', hair: 'Pelo', friend: 'Amigos', pet: 'Mascotas' };
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
const NP = () => { try { return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences; } catch (e) { return null; } };
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
const sfx = { ok: () => tone([660, 880], .1), bad: () => tone([220, 180], .15, 'sine', .12), win: () => tone([523, 659, 784, 1047], .12), box: () => tone([392, 523, 659, 784, 1047, 1319], .09) };
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
function lessonQueue(L) {
  const q = [];
  [...L.items, ...L.sentences].forEach(it => q.push({ k: 'learn', it, L }));
  shuffle(L.items).forEach(it => q.push({ k: 'listen', it, L }));
  shuffle(L.items).forEach(it => q.push({ k: 'read', it, L }));
  shuffle(L.sentences).forEach(it => q.push({ k: 'build', it, L }));
  pick([...L.items, ...L.sentences], 3).forEach(it => q.push({ k: 'say', it, L }));
  return q;
}
function reviewQueue() {
  const A = allItems(), q = [];
  pick(dueIds().filter(id => A[id]), 8).forEach(id => {
    const { it, L, sent } = A[id];
    q.push({ k: sent ? 'build' : (Math.random() < .5 ? 'listen' : 'read'), it, L });
  });
  return shuffle(q);
}
function startSession(kind, L) {
  const queue = kind === 'review' ? reviewQueue() : lessonQueue(L);
  if (!queue.length) return;
  ui = { screen: 'sess', sess: { kind, L, queue, i: 0, miss: {}, total: queue.length, extra: 0 } };
  enterQ(true);
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
  if (q.k === 'learn') { if (first) await sayEs('learn'); if (ui.sess === s && curQ() === q) await sayEn(q.it.en); return; }
  if (q.k === 'listen') { await sayEs('listen_tap'); if (curQ() === q) sayEn(q.it.en); }
  else if (q.k === 'read') { await sayEs('read_tap'); }
  else if (q.k === 'build') { await sayEs('build'); if (curQ() === q) sayEn(q.it.en); }
  else if (q.k === 'say') { await sayEs('repeat'); if (curQ() === q) sayEn(q.it.en); }
}
function miss(q) { const s = ui.sess; s.miss[q.it.id] = (s.miss[q.it.id] || 0) + 1; s.misses = (s.misses || 0) + 1; if (!q.retried && s.queue.length < s.total + 6) { s.queue.push({ k: q.k, it: q.it, L: q.L, retried: 1 }); } }
async function correct(q) {
  q.locked = true; sfx.ok(); clap();
  await sayEs(['great', 'great2', 'great3'][Math.random() * 3 | 0]);
  if (ui.screen === 'sess' && curQ() === q) next();
}
function next() {
  const s = ui.sess; s.i++;
  if (s.i >= s.queue.length) return finish();
  enterQ(false);
}
async function finish() {
  const s = ui.sess, A = allItems();
  const ids = new Set(s.queue.filter(q => q.k !== 'learn' && q.k !== 'say').map(q => q.it.id));
  ids.forEach(id => grade(id, !s.miss[id]));
  const m = s.misses || 0, stars = m <= 1 ? 3 : m <= 4 ? 2 : 1;
  let gotBox = false;
  if (s.kind === 'lesson') {
    const first = !S.done[s.L.id];
    S.done[s.L.id] = true; S.stars[s.L.id] = Math.max(S.stars[s.L.id] || 0, stars);
    if (first || stars === 3) { S.boxes++; gotBox = true; } else S.sparkles += 3;
  } else if (S.claimed !== today()) { S.claimed = today(); S.boxes++; gotBox = true; } else S.sparkles += 2;
  save();
  ui = { screen: 'result', kind: s.kind, stars, gotBox };
  render(); sfx.win(); confetti();
  await sayEs(s.kind === 'review' ? 'review_done' : 'lesson_done');
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
  return `<div class="top"><div class="chip">🧝 ${esc(S.name)}</div><div style="display:flex;gap:8px"><span class="chip">✨ ${S.sparkles}</span>${extra || ''}</div></div>`;
}
function vWelcome() {
  if (ui.wstep === 'name') return `<div class="card center"><h1>Elfos del Inglés</h1><p style="font-size:22px">¿Cómo te llamas?</p><input id="nm" class="inp" maxlength="14" autocomplete="off" value="${esc(ui.nm)}" aria-label="Tu nombre"><div class="err">${esc(ui.err)}</div><button class="btn big" data-act="wname">Siguiente</button></div>`;
  const c = ui.cfg;
  const sw = (arr, key) => arr.map(v => `<button class="tab ${c[key] === v ? 'on' : ''}" style="background:${v};${c[key] === v ? 'outline:4px solid #8E5CF0' : ''};width:46px;height:46px;padding:0" data-act="cfg" data-k="${key}" data-v="${v}" aria-label="color"></button>`).join('');
  const tb = (arr, key) => arr.map(([v, n]) => `<button class="tab ${c[key] === v ? 'on' : ''}" data-act="cfg" data-k="${key}" data-v="${v}">${n}</button>`).join('');
  return `<div class="card center"><h2>¡Crea tu elfo, ${esc(ui.nm)}!</h2>${elfSVG(c, 170)}<p><b>Piel</b></p><div class="tabs" style="justify-content:center">${sw(SKINS, 'skin')}</div><p><b>Peinado</b></p><div class="tabs" style="justify-content:center">${tb(STYLES, 'hairStyle')}</div><p><b>Color de pelo</b></p><div class="tabs" style="justify-content:center">${sw(HAIRS, 'hair')}</div><p><b>Ojos</b></p><div class="tabs" style="justify-content:center">${tb(EYES, 'eyes')}</div><button class="btn big" data-act="wdone">¡Listo!</button></div>`;
}
function vHome() {
  const e = S.eq, due = dueIds().length;
  const fr = e.friend ? `<div class="fr">${elfSVG(PRE[e.friend], 100)}</div>` : '', pt = e.pet ? (() => { const p = catItem(e.pet); return `<div class="pt">${petSVG(p.kind, p.color, 90)}</div>`; })() : '';
  const lessons = C.lessons.map((L, i) => {
    const lock = i > 0 && !S.done[C.lessons[i - 1].id], st = S.stars[L.id] || 0;
    return `<button class="lesson ${lock ? 'lock' : ''}" data-act="lesson" data-id="${L.id}" ${lock ? 'disabled' : ''}><span class="ic">${L.icon}</span><span><b>${i + 1}. ${esc(L.title)}</b><small>${lock ? 'Se abre al terminar la anterior' : S.done[L.id] ? 'Repetir' : '¡Empezar!'}</small></span><span class="st">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span></button>`;
  }).join('');
  return `${topBar(`<span class="chip">🎁 ${S.boxes}</span>`)}<div class="home"><div><div class="stage"><div class="hello">¡Hola, ${esc(S.name)}!</div><div class="scene">${fr}<div class="me">${elfSVG(effCfg(), 190)}</div>${pt}</div></div>
  <div class="row"><button class="btn alt" data-act="closet">👗 Armario</button><button class="btn ${due ? 'green' : 'alt'}" data-act="review" ${due ? '' : 'disabled'}>🔁 Repaso${due ? `<span class="badge">${due}</span>` : ' ✓'}</button></div></div>
  <div class="path">${S.boxes ? `<button class="gift" data-act="box">🎁 ¡Tienes ${S.boxes} caja${S.boxes > 1 ? 's' : ''} sorpresa!</button>` : ''}${lessons}</div></div><button class="gear" data-act="gear" aria-label="Opciones">⚙</button>`;
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
  } else if (q.k === 'say') {
    h = `<h2>🗣️ Repite</h2><div class="bigw">${esc(enText(q.it.en))}</div><div class="es">${esc(enText(q.it.es))}</div><button class="spk" data-act="spk" aria-label="Escuchar">🔊</button><br><button class="btn big green" data-act="said">🎤 ¡Ya lo dije!</button>`;
  }
  return `${bar}<div class="q">${h}</div>`;
}
function vResult() {
  const r = ui;
  return `<div class="card center"><h1>${r.kind === 'review' ? '¡Repaso hecho!' : '¡Lección completada!'}</h1><div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}</div>${r.gotBox ? '<div style="font-size:90px">🎁</div><p style="font-size:20px">¡Has ganado una caja sorpresa!</p>' : '<p style="font-size:20px">✨ ¡Has ganado polvo de brillo!</p>'}<div class="row">${r.gotBox ? '<button class="btn green" data-act="box">Abrir caja 🎁</button>' : ''}<button class="btn alt" data-act="home">Inicio</button></div></div>`;
}
function vBox() {
  const b = ui.box;
  if (b.stage === 'closed') return `${topBar()}<div class="card center"><h2>¡Caja sorpresa!</h2><button class="giftbox ${b.shake ? 'shake' : ''}" data-act="openbox" aria-label="Abrir caja">🎁</button><p style="font-size:20px">Toca la caja para abrirla</p><button class="btn alt" data-act="home">Más tarde</button></div>`;
  const it = b.item;
  if (!it) return `<div class="card center"><h2>¡Lo tienes todo!</h2><p style="font-size:22px">✨ +5 polvo de brillo</p><button class="btn big" data-act="home">Inicio</button></div>`;
  return `<div class="card center reveal"><span class="rar ${it.r}">${RAR[it.r][0]}</span><h2>¡${esc(it.name)}!</h2><div>${preview(it, 190)}</div><div class="row"><button class="btn green" data-act="equip" data-id="${it.id}">¡Ponérmelo!</button><button class="btn alt" data-act="${S.boxes ? 'box' : 'home'}">${S.boxes ? 'Otra caja 🎁' : 'Seguir'}</button></div></div>`;
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
  else if (ui.screen === 'result') h = vResult();
  else if (ui.screen === 'box') h = vBox();
  else if (ui.screen === 'closet') h = vCloset();
  a.innerHTML = h + (ui.gear ? gearHTML() : '');
  syncMascot();
}
function gearHTML() {
  return `<div class="ov"><div class="card"><h2>Opciones para padres</h2><button class="btn alt" data-act="gday">▶ Avanzar un día (probar el repaso) · día +${S.dayOff}</button><button class="btn alt" data-act="gbox">🎁 Regalar una caja</button><button class="btn alt" data-act="gall">🔓 Completar todas las lecciones</button><button class="btn alt" data-act="greset">🗑 Borrar todo el progreso</button><button class="btn" data-act="gclose">Cerrar</button></div></div>`;
}

/* ---------- caja ---------- */
function roll() {
  const un = CAT.filter(x => !x.base && !S.owned.includes(x.id));
  if (!un.length) return null;
  if (S.opened === 0) return catItem('hat_elf_red');
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
  else if (act === 'lesson') { startSession('lesson', C.lessons.find(l => l.id === el.dataset.id)); }
  else if (act === 'review') { startSession('review'); }
  else if (act === 'spk') { const q = curQ(); sayEn(q.it.en); }
  else if (act === 'next') { clap(); next(); }
  else if (act === 'quit') { stopAudio(); ui = { screen: 'home' }; render(); }
  else if (act === 'said') { sfx.ok(); clap(); curQ().locked = true; next(); }
  else if (act === 'opt') {
    const q = curQ(); if (q.locked) return;
    const o = q.opts[+el.dataset.i];
    if (o.id === q.it.id) { el.classList.add('ok'); correct(q); }
    else { el.classList.add('bad'); sfx.bad(); miss(q); await sayEs('oops'); if (curQ() === q) sayEn(q.it.en); }
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
    if (item) S.owned.push(item.id); else S.sparkles += 5;
    save(); ui = { screen: 'box', box: { stage: 'open', item } }; render(); confetti(); sfx.win(); sayEs('surprise');
  }
  else if (act === 'equip') { const it = catItem(el.dataset.id); S.eq[it.cat] = it.id; save(); ui = { screen: 'home' }; render(); }
  else if (act === 'closet') { ui = { screen: 'closet', tab: 'hat' }; render(); }
  else if (act === 'tab') { ui.tab = el.dataset.k; render(); }
  else if (act === 'wear') { const it = catItem(el.dataset.id); S.eq[it.cat] = (S.eq[it.cat] === it.id && !it.base) ? null : it.id; if (it.cat === 'outfit' && !S.eq.outfit) S.eq.outfit = 'o_basic'; save(); render(); }
  else if (act === 'gclose') { ui.gear = false; render(); }
  else if (act === 'gday') { S.dayOff++; save(); render(); }
  else if (act === 'gbox') { S.boxes++; save(); ui.gear = false; render(); }
  else if (act === 'gall') { C.lessons.forEach(L => { S.done[L.id] = true; S.stars[L.id] = S.stars[L.id] || 1; }); save(); ui.gear = false; render(); }
  else if (act === 'greset') { try { localStorage.removeItem(SK); } catch (e) {} const p = NP(); if (p) { try { p.remove({ key: SK }); } catch (e) {} } S = null; ui = { screen: 'welcome', wstep: 'name', nm: '', err: '' }; render(); }
});
async function checkBuild(q) {
  const ok = q.placed.map(i => q.tok[i]).join(' ') === q.tok.join(' ');
  const ans = $('#ans');
  if (ok) { ans && ans.classList.add('ok'); q.locked = true; sfx.ok(); clap(); await sayEn(q.it.en); if (ui.screen === 'sess' && curQ() === q) { await sayEs('great'); if (ui.screen === 'sess' && curQ() === q) next(); } }
  else { ans && ans.classList.add('bad'); sfx.bad(); miss(q); q.locked = true; await sayEs('oops'); if (curQ() === q) { q.placed = []; q.locked = false; render(); sayEn(q.it.en); } }
}

/* ---------- arranque ---------- */
async function boot() {
  try {
    [C, MAN] = await Promise.all([fetch('content.json').then(r => r.json()), fetch('manifest.json').then(r => r.json())]);
  } catch (e) { $('#app').innerHTML = '<p class="loading">No se pudo cargar el curso. Recarga la página.</p>'; return; }
  if (location.hash === '#debug') window.__dbg = () => ({ ui, S });
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
  S = await loadBest();
  ui = S && S.name ? { screen: 'home' } : { screen: 'welcome', wstep: 'name', nm: '', err: '' };
  render();
}
boot();
})();
