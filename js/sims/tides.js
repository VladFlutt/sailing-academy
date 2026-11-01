// Simulator: crossing a shallow bar with the rule of twelfths (module 6.3).
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const esc = (s) => SA.esc(s), t = (o) => SA.t(o);
const LW1 = 6, HW = 12, LW2 = 18, LWH = 1.0, HWH = 4.6, CHART = 0.8, DRAFT = 1.9, UKC = 0.5;
const CUM = [0, 1, 3, 6, 9, 11, 12];
const cum = (x) => { const i = Math.min(5, Math.floor(x)); return CUM[i] + (CUM[i + 1] - CUM[i]) * (x - i); };
const height = (h) => h <= HW ? LWH + (HWH - LWH) * cum(h - LW1) / 12 : HWH - (HWH - LWH) * cum(h - HW) / 12;
const hhmm = (h) => { const m = Math.round(h * 60); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const f1 = (x) => { const s = x.toFixed(2); return SA.lang === 'ru' ? s.replace('.', ',') : s; };
const TASKS = [
  { id: 'in', l: R('Утром: найдите самое раннее время, когда можно пройти бар с запасом под килем 0,5 м.', 'Morning: find the earliest time you can cross the bar with 0.5 m under the keel.'), lo: 7.5, hi: 7.5 + 10 / 60 },
  { id: 'out', l: R('Вечером: найдите самое позднее время, когда ещё можно пройти бар на отливе.', 'Evening: find the latest time you can still cross the bar on the ebb.'), lo: 16.5 - 10 / 60, hi: 16.5 }
];
const UI = {
  time: R('Время', 'Time'), hot: R('Высота прилива', 'Height of tide'), data: R('Данные', 'Data'), go: R('Проходим бар сейчас', 'Cross the bar now'),
  facts: R('Малая вода 06:00 — 1,0 м; полная 12:00 — 4,6 м; малая 18:00 — 1,0 м. Глубина на баре по карте 0,8 м. Осадка 1,9 м, нужен запас 0,5 м.', 'LW 06:00 1.0 m; HW 12:00 4.6 m; LW 18:00 1.0 m. Charted depth on the bar 0.8 m. Draught 1.9 m; you want 0.5 m clearance.'),
  ground: R('Мало воды: яхта коснётся грунта или запас меньше 0,5 м. Посчитайте: глубина = 0,8 + высота прилива.', 'Not enough water: you would touch or have under 0.5 m. Work it out: depth = 0.8 + height of tide.'),
  late: R('Пройти можно, но вы потеряли время: найдите момент раньше.', 'You can cross, but you are wasting time: find an earlier moment.'),
  early: R('Пройти можно, но можно и позже: найдите последний безопасный момент.', 'You can cross, but you could leave later: find the last safe moment.'),
  ok: R('Точно. Вы прошли бар вовремя.', 'Spot on. You crossed the bar on time.'), all: R('Оба задания выполнены.', 'Both tasks done.')
};
SA.SIMS.tides = {
  title: R('Пройти мелкий бар', 'Crossing a shallow bar'),
  intro: R('Сдвигайте время ползунком. Тренажёр показывает высоту прилива, а глубину над баром и запас под килем посчитайте сами: глубина = глубина на карте + высота прилива.', 'Move the time slider. The trainer shows the height of tide; work out the depth over the bar and the clearance yourself: depth = charted depth + height of tide.'),
  mount(host, api) {
    const st = SA.store.get('sim.tides', {}); let h = 6;
    host.innerHTML = `<div class="sim"><div class="simview"></div><div class="panel">
      <p class="hint">${esc(t(UI.facts))}</p>
      <div class="ctrl"><span class="label">${esc(t(UI.time))}: <b data-t></b></span><div class="row"><button data-d="-5">−5′</button><input type="range" min="${LW1 * 60}" max="${LW2 * 60}" step="5" value="${h * 60}" data-s aria-label="${esc(t(UI.time))}"><button data-d="5">+5′</button></div></div>
      <div class="gauges"><div class="g wide"><span class="label">${esc(t(UI.hot))}</span><span class="v" data-h></span></div></div>
      <ul class="tasks"></ul><button class="btn" data-go>${esc(t(UI.go))}</button><div class="trim" data-msg aria-live="polite" hidden></div></div></div>`;
    const $ = (s) => host.querySelector(s), view = $('.simview');
    const cur = () => TASKS.find((x) => !st[x.id]);
    const tasks = () => { const c = cur(); $('.tasks').innerHTML = TASKS.map((x) => `<li class="${st[x.id] ? 'done' : ''} ${c === x ? 'cur' : ''}"><span class="box">${st[x.id] ? '✓' : ''}</span><span>${esc(t(x.l))}</span></li>`).join(''); };
    const draw = () => {
      const ht = height(h), depth = CHART + ht, X = (x) => 30 + (x - 6) * 28, Y = (y) => 130 - y * 22;
      const curve = Array.from({ length: 145 }, (_, i) => { const x = 6 + i / 12; return `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(height(x)).toFixed(1)}`; }).join(' ');
      const need = DRAFT + UKC - CHART;
      const sea = 200, k = 14, bar = 280, wl = bar - depth * k, keel = wl + DRAFT * k, ok = depth - DRAFT >= UKC - 1e-6;
      view.innerHTML = `<svg viewBox="0 0 400 300" role="img" aria-label="${SA.lang === 'ru' ? 'Кривая прилива и яхта над баром' : 'Tide curve and the yacht over the bar'}">
        <path d="M${X(6)},${Y(need)} H${X(18)}" stroke="var(--warn)" stroke-dasharray="5 4"/>${D.txt(X(18), Y(need) - 6, SA.lang === 'ru' ? 'нужно 1,6 м' : 'need 1.6 m', { a: 'end', fs: 11, fill: 'var(--warn)' })}
        <path d="${curve}" fill="none" stroke="var(--accent)" stroke-width="2.5"/><path d="M${X(6)},${Y(0)} H${X(18)}" stroke="var(--line)"/>
        ${[6, 9, 12, 15, 18].map((x) => D.txt(X(x), Y(0) + 14, String(x).padStart(2, '0') + ':00', { fs: 10, fill: 'var(--muted)', w: 500 })).join('')}
        <path d="M${X(h)},${Y(0)} V${Y(4.8)}" stroke="var(--ink)" stroke-width="1.2"/><circle cx="${X(h)}" cy="${Y(ht)}" r="5" fill="var(--accent)"/>
        <rect x="0" y="${wl}" width="400" height="${300 - wl}" fill="var(--wind)" opacity=".18"/><path d="M0,${wl} H400" stroke="var(--wind)" stroke-width="1.5"/>
        <path d="M0,300 L0,${bar + 10} Q200,${bar - 6} 400,${bar + 10} L400,300Z" fill="var(--warn)" opacity=".45"/>
        <path d="M150,${wl - 12} L250,${wl - 12} L238,${wl + 6} L162,${wl + 6}Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/>
        <path d="M193,${wl + 6} L196,${keel} L206,${keel} L208,${wl + 6}Z" fill="${ok ? 'var(--ink)' : 'var(--bad)'}"/>
        ${D.txt(330, 296, SA.lang === 'ru' ? 'бар' : 'bar', { fs: 12, fill: 'var(--muted)' })}
      </svg>`;
      $('[data-t]').textContent = hhmm(h); $('[data-h]').textContent = f1(ht) + ' m';
    };
    const msg = (text, cls) => { const m = $('[data-msg]'); m.hidden = false; m.textContent = text; m.className = 'trim ' + cls; };
    const set = (v) => { h = Math.max(LW1, Math.min(LW2, v)); $('[data-s]').value = Math.round(h * 60); $('[data-msg]').hidden = true; draw(); };
    host.addEventListener('input', (e) => { if (e.target.matches('[data-s]')) set(+e.target.value / 60); });
    host.addEventListener('click', (e) => {
      const d = e.target.closest('[data-d]'); if (d) { set(h + +d.dataset.d / 60); return; }
      if (e.target.closest('[data-go]')) {
        const c = cur(), depth = CHART + height(h);
        if (depth - DRAFT < UKC - 1e-6) { msg(t(UI.ground), 'bad'); return; }
        if (!c) { msg(t(UI.all), 'ok'); return; }
        if (h < c.lo - 1e-6) { msg(t(UI.early), 'warn'); return; }
        if (h > c.hi + 1e-6) { msg(t(c.id === 'in' ? UI.late : UI.ground), c.id === 'in' ? 'warn' : 'bad'); return; }
        st[c.id] = true; SA.store.set('sim.tides', st); tasks(); msg(t(UI.ok), 'ok');
        if (TASKS.every((x) => st[x.id])) api.done();
      }
    });
    SA.simState = () => ({ sim: 'tide over a bar (rule of twelfths)', time: hhmm(h), heightOfTideM: +height(h).toFixed(2), chartedDepthM: CHART, draughtM: DRAFT, clearanceNeededM: UKC, task: cur() ? cur().id : 'done' });
    tasks(); draw();
  }
};
})();
