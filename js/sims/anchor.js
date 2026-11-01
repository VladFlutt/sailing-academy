// Simulator: anchoring — how much chain to let out for high water and the neighbours (module 4.3).
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const esc = (s) => SA.esc(s), t = (o) => SA.t(o);
const DEPTH = 4, RISE = 2, FREE = 1, BOAT = 11, NEIGH = 46;
const UI = {
  chain: R('Вытравлено цепи', 'Chain let out'), view: R('Показать', 'Show'), now: R('сейчас', 'now'), hw: R('полную воду', 'high water'),
  depth: R('Глубина', 'Depth'), scope: R('Отношение к глубине (ПВ + борт)', 'Scope (HW depth + freeboard)'), swing: R('Радиус разворота', 'Swing radius'), gap: R('До соседа', 'To the neighbour'),
  drop: R('Отдать якорь', 'Let go'), task: R('Сейчас глубина 4 м, к ночи вода поднимется на 2 м, высота борта 1 м. Якорь — на цепи. Сосед стоит в 46 м от вашего якоря. Выпустите столько цепи, чтобы якорь держал на полной воде и вы не задели соседа при развороте.', 'Depth now is 4 m, the tide will rise 2 m tonight, freeboard is 1 m, all chain. A neighbour lies 46 m from your anchor. Let out enough chain to hold at high water without hitting the neighbour as you swing.'),
  short: (n) => SA.lang === 'ru' ? `Мало: на полной воде отношение 1:${n}, нужно не меньше 1:4. Ночью якорь может сорвать.` : `Too short: at high water the scope is ${n}:1, you need at least 4:1. The anchor may break out tonight.`,
  long: R('Слишком много: при развороте вы заденете соседа. Уменьшите цепь или найдите другое место.', 'Too much: you will hit the neighbour when you swing. Shorten up or find another spot.'),
  ok: (L) => SA.lang === 'ru' ? `Отлично: ${L} м цепи держат на полной воде, и место для разворота есть.` : `Well done: ${L} m of chain holds at high water and you have room to swing.`
};
SA.SIMS.anchor = {
  title: R('Сколько цепи выпустить?', 'How much chain?'),
  intro: R('Двигайте ползунок цепи и переключайте вид «сейчас / полная вода». Сверху — разрез, снизу — вид сверху с кругом разворота.', 'Move the chain slider and switch between now and high water. Top: a side view; bottom: a plan view with the swinging circle.'),
  mount(host, api) {
    let L = 16, hw = false;
    host.innerHTML = `<div class="sim"><div class="simview"></div><div class="panel">
      <p class="hint">${esc(t(UI.task))}</p>
      <div class="ctrl"><span class="label">${esc(t(UI.chain))}: <b data-l></b></span><div class="row"><button data-d="-2">−</button><input type="range" min="8" max="60" step="1" value="${L}" data-ch aria-label="${esc(t(UI.chain))}"><button data-d="2">+</button></div></div>
      <div class="ctrl"><span class="label">${esc(t(UI.view))}</span><div class="seg" role="group"><button data-v="0" aria-pressed="true">${esc(t(UI.now))}</button><button data-v="1" aria-pressed="false">${esc(t(UI.hw))}</button></div></div>
      <div class="gauges"><div class="g"><span class="label">${esc(t(UI.depth))}</span><span class="v" data-dp></span></div><div class="g"><span class="label">${esc(t(UI.scope))}</span><span class="v" data-sc></span></div><div class="g"><span class="label">${esc(t(UI.swing))}</span><span class="v" data-sw></span></div><div class="g"><span class="label">${esc(t(UI.gap))}</span><span class="v" data-gp></span></div></div>
      <button class="btn" data-drop>${esc(t(UI.drop))}</button><div class="trim" data-msg aria-live="polite" hidden></div></div></div>`;
    const $ = (s) => host.querySelector(s), view = $('.simview');
    const calc = () => { const H = DEPTH + (hw ? RISE : 0) + FREE, Hhw = DEPTH + RISE + FREE; const reach = Math.sqrt(Math.max(0, L * L - H * H)); const reachHw = Math.sqrt(Math.max(0, L * L - Hhw * Hhw)); return { H, reach, swing: reach + BOAT, swingMax: Math.max(reach, Math.sqrt(Math.max(0, L * L - (DEPTH + FREE) ** 2))) + BOAT, scopeHw: L / Hhw, reachHw }; };
    const draw = () => {
      const c = calc(), k = 5, ax = 375, sy = 62, bed = sy + (DEPTH + (hw ? RISE : 0)) * k;
      const bx = ax - 18 - c.reach * k; // same scale both ways: 5 px per metre
      const chainEnd = [bx + 18, sy + 2];
      const midx = (chainEnd[0] + ax) / 2, midy = bed + 4;
      const top = 140, cx = 200, cy = top + 70, sc = 1.25;
      const nx = cx + NEIGH * sc, ok = c.swingMax <= NEIGH;
      view.innerHTML = `<svg viewBox="0 0 400 300" role="img" aria-label="${SA.lang === 'ru' ? 'Якорная стоянка: разрез и вид сверху' : 'Anchorage: side and plan view'}">
        <rect x="0" y="${sy}" width="400" height="${bed - sy}" fill="var(--wind)" opacity=".12"/><path d="M0,${sy} H400" stroke="var(--wind)" stroke-width="1.5"/>
        <path d="M0,${bed} H400 V${bed + 14} H0Z" fill="var(--warn)" opacity=".35"/>
        <path d="M${bx - 22},${sy - 6} L${bx + 22},${sy - 6} L${bx + 14},${sy + 4} L${bx - 16},${sy + 4}Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/><path d="M${bx},${sy - 6} V${sy - 50}" stroke="var(--ink)" stroke-width="2"/>
        <path d="M${chainEnd[0]},${chainEnd[1]} Q${midx},${midy} ${ax},${bed}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 2"/>
        <path d="M${ax},${bed} l10,-6 M${ax},${bed} l-4,-8" stroke="var(--ink)" stroke-width="3"/>
        ${D.txt(8, sy + 16, (hw ? 'HW ' : '') + (DEPTH + (hw ? RISE : 0)) + ' m', { a: 'start', fs: 12, fill: 'var(--muted)' })}
        <path d="M0,${top - 8} H400" stroke="var(--line)"/>
        <circle cx="${cx}" cy="${cy}" r="${(c.swingMax * sc).toFixed(1)}" fill="${ok ? 'var(--ok)' : 'var(--bad)'}" opacity=".12" stroke="${ok ? 'var(--ok)' : 'var(--bad)'}" stroke-dasharray="4 4"/>
        <path d="M${cx - 5},${cy} h10 M${cx},${cy - 5} v10" stroke="var(--ink)" stroke-width="2"/>
        ${D.boat(cx - c.swing * sc + 6, cy, 90, { s: .36, nosail: true, edge: false })}
        <circle cx="${nx}" cy="${cy}" r="${(BOAT * sc * .4).toFixed(1)}" fill="none" stroke="var(--muted)" stroke-dasharray="2 3"/>${D.boat(nx, cy, 270, { s: .36, nosail: true, edge: false, fill: 'var(--line)' })}
        ${D.txt(nx, cy + 28, SA.lang === 'ru' ? 'сосед' : 'neighbour', { fs: 11, fill: 'var(--muted)' })}
      </svg>`;
      $('[data-l]').textContent = L + ' m'; $('[data-dp]').textContent = (DEPTH + (hw ? RISE : 0)) + ' m';
      $('[data-sc]').textContent = '1:' + c.scopeHw.toFixed(1); $('[data-sw]').textContent = Math.round(c.swingMax) + ' m'; $('[data-gp]').textContent = NEIGH + ' m';
    };
    const msg = (text, cls) => { const m = $('[data-msg]'); m.hidden = false; m.textContent = text; m.className = 'trim ' + cls; };
    host.addEventListener('input', (e) => { if (e.target.matches('[data-ch]')) { L = +e.target.value; $('[data-msg]').hidden = true; draw(); } });
    host.addEventListener('click', (e) => {
      const d = e.target.closest('[data-d]'); if (d) { L = Math.max(8, Math.min(60, L + +d.dataset.d)); $('[data-ch]').value = L; $('[data-msg]').hidden = true; draw(); return; }
      const v = e.target.closest('[data-v]'); if (v) { hw = v.dataset.v === '1'; host.querySelectorAll('[data-v]').forEach((b) => b.setAttribute('aria-pressed', String(b === v))); draw(); return; }
      if (e.target.closest('[data-drop]')) { const c = calc(); if (c.scopeHw < 4) msg(UI.short(c.scopeHw.toFixed(1)), 'bad'); else if (c.swingMax > NEIGH) msg(t(UI.long), 'warn'); else { msg(UI.ok(L), 'ok'); SA.store.set('sim.anchor', { L }); api.done(); } }
    });
    SA.simState = () => { const c = calc(); return { sim: 'anchoring scope', chainM: L, showing: hw ? 'high water' : 'now', depthNowM: DEPTH, tideRiseM: RISE, freeboardM: FREE, scopeAtHW: +c.scopeHw.toFixed(2), swingRadiusM: Math.round(c.swingMax), neighbourM: NEIGH }; };
    draw();
  }
};
})();
