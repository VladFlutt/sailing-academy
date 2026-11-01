// Simulator: points of sail and mainsail trim (module 3.2).
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const COURSE_BANDS = [
  [0, 10, { ru: 'Левентик', en: 'Head to wind' }, 'levent'], [10, 45, { ru: 'Мёртвая зона', en: 'No-go zone' }, 'nogo'],
  [45, 60, { ru: 'Крутой бейдевинд', en: 'Close-hauled' }, 'close'], [60, 80, { ru: 'Полный бейдевинд', en: 'Close reach' }, 'close'],
  [80, 100, { ru: 'Галфвинд', en: 'Beam reach' }, 'beam'], [100, 135, { ru: 'Острый бакштаг', en: 'Broad reach' }, 'broad'],
  [135, 160, { ru: 'Полный бакштаг', en: 'Broad reach (deep)' }, 'broad'], [160, 181, { ru: 'Фордевинд', en: 'Run' }, 'run']];
SA.courseOf = (twa) => COURSE_BANDS.find((b) => twa >= b[0] && twa < b[1]);
const TWS = 12;
const POLAR = [[0, 0], [38, 0], [45, 4.6], [52, 5.5], [60, 5.9], [75, 6.3], [90, 6.5], [110, 6.6], [135, 6.0], [150, 5.3], [165, 4.8], [180, 4.5]];
const polar = (a) => { for (let i = 1; i < POLAR.length; i++) if (a <= POLAR[i][0]) { const [a0, v0] = POLAR[i - 1], [a1, v1] = POLAR[i]; return v0 + (v1 - v0) * (a - a0) / (a1 - a0); } return 4.5; };
const TASKS = [
  { id: 'levent', ru: 'Поставьте яхту в левентик', en: 'Put the boat head to wind', ok: (s) => s.twa < 8 },
  { id: 'close', ru: 'Ляжьте в бейдевинд левым галсом и настройте грот (работа паруса > 85%)', en: 'Sail close-hauled on port tack with the main trimmed (efficiency > 85%)', ok: (s) => s.twa >= 45 && s.twa < 80 && s.tk === -1 && s.eff > 0.85 && s.v > 3 },
  { id: 'beam', ru: 'Галфвинд правым галсом, грот настроен', en: 'Beam reach on starboard tack, main trimmed', ok: (s) => s.twa >= 80 && s.twa < 100 && s.tk === 1 && s.eff > 0.85 && s.v > 3 },
  { id: 'broad', ru: 'Бакштаг любым галсом, грот настроен', en: 'Broad reach on either tack, main trimmed', ok: (s) => s.twa >= 100 && s.twa < 160 && s.eff > 0.85 && s.v > 3 },
  { id: 'tackturn', ru: 'Сделайте поворот оверштаг', en: 'Tack the boat', ok: (s) => s.didTack, now: true },
  { id: 'gybe', ru: 'Сделайте поворот фордевинд', en: 'Gybe the boat', ok: (s) => s.didGybe, now: true }
];
const S = {
  helm: { ru: 'Руль · курс яхты', en: 'Helm · boat heading' }, sheet: { ru: 'Гика-шкот', en: 'Mainsheet' }, in: { ru: 'выбрать', en: 'in' }, out: { ru: 'потравить', en: 'out' },
  tasks: { ru: 'Задания', en: 'Tasks' }, keys: { ru: 'С клавиатуры: ← → руль, ↑ ↓ шкот.', en: 'Keyboard: ← → helm, ↑ ↓ sheet.' },
  g: { course: { ru: 'Курс', en: 'Point of sail' }, twa: { ru: 'Угол к ветру', en: 'True wind angle' }, tack: { ru: 'Галс', en: 'Tack' }, awa: { ru: 'Вымпельный ветер', en: 'Apparent wind' }, sog: { ru: 'Скорость', en: 'Boat speed' }, heel: { ru: 'Крен', en: 'Heel' }, eff: { ru: 'Работа паруса', en: 'Sail efficiency' } },
  port: { ru: 'левый', en: 'port' }, stbd: { ru: 'правый', en: 'starboard' }, kn: { ru: 'уз', en: 'kn' }
};
SA.SIMS.points = {
  title: { ru: 'Поставьте яхту на курс и настройте парус', en: 'Put the boat on course and trim the sail' },
  intro: { ru: 'Ветер 12 узлов дует сверху. Поворачивайте яхту ползунком «Руль» или перетаскиванием на схеме, а угол грота меняйте шкотом. Жёлтая стрелка на мачте — [[apparent|вымпельный ветер]].', en: 'A 12-knot wind blows from the top. Turn the boat with the Helm slider or by dragging on the chart, and set the mainsail angle with the sheet. The yellow arrow at the mast shows the [[apparent|apparent wind]].' },
  mount(host, api) {
    const t = SA.t, esc = SA.esc;
    const done = SA.store.get('sim.points', {});
    const s = { h: 300, sheet: 20, v: 0, prevTack: 1, minT: 180, maxT: 0 };
    host.innerHTML = `<div class="sim"><div class="simview"></div><div class="panel"><div class="gauges"></div><div class="trim" aria-live="polite"></div>
      <div class="ctrl"><label class="label" for="p-hdg">${esc(t(S.helm))}</label><div class="row"><button data-d="-5">−5°</button><input type="range" id="p-hdg" min="0" max="359"><button data-d="5">+5°</button></div></div>
      <div class="ctrl"><label class="label" for="p-sheet">${esc(t(S.sheet))}</label><div class="row"><span class="hint">${esc(t(S.in))}</span><input type="range" id="p-sheet" min="0" max="90"><span class="hint">${esc(t(S.out))}</span></div></div>
      <div><span class="label">${esc(t(S.tasks))}</span><ul class="tasks" style="margin-top:8px"></ul></div><p class="hint">${esc(t(S.keys))}</p></div></div>`;
    const view = host.querySelector('.simview'), gauges = host.querySelector('.gauges'), trim = host.querySelector('.trim'), tasksEl = host.querySelector('.tasks');
    const hdg = host.querySelector('#p-hdg'), sh = host.querySelector('#p-sheet');
    const wedge = (a, r) => D.polar(a, r).map((v) => v.toFixed(1)).join(',');
    let streaks = ''; for (let x = -190; x <= 190; x += 38) for (let y = -250; y <= 200; y += 50) streaks += `<path class="streak" d="M${x + ((y / 50) % 2 ? 19 : 0)},${y} v18"/>`;
    let ticks = ''; for (let a = 0; a < 360; a += 10) ticks += `<path d="M${wedge(a, a % 30 ? 182 : 176)} L${wedge(a, 190)}" stroke="var(--muted)" stroke-width="1" opacity=".6"/>`;
    const labels = [[0, 'levent'], [62, 'close'], [-62, 'close'], [90, 'beam'], [-90, 'beam'], [130, 'broad'], [-130, 'broad'], [180, 'run']].map(([a, k]) => { const [x, y] = D.polar(a, 160); return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" font-family="var(--f-display)" font-size="12" font-weight="600" fill="var(--muted)" letter-spacing=".04em">${esc(SA.TERMS[k][SA.lang][0].split(' / ')[0].toUpperCase())}</text>`; }).join('');
    view.innerHTML = `<svg viewBox="-200 -200 400 400" aria-label="${esc(t(this.title))}"><defs><clipPath id="clipsea"><rect x="-200" y="-200" width="400" height="400"/></clipPath></defs>
      <g clip-path="url(#clipsea)"><g class="streaks">${streaks}</g></g><path d="M0,0 L${wedge(-45, 195)} A195,195 0 0 1 ${wedge(45, 195)} Z" fill="var(--nogo)"/>
      <circle r="190" fill="none" stroke="var(--muted)" stroke-width="1" opacity=".5"/>${ticks}${labels}${D.windArrows([-168], -196, 26)}
      <text x="-154" y="-176" font-family="var(--f-display)" font-size="12" font-weight="600" fill="var(--wind)">${TWS} ${esc(t(S.kn))}</text><g class="boatg"></g><g class="vane"></g></svg>`;
    const svg = view.querySelector('svg'), bg = view.querySelector('.boatg'), vane = view.querySelector('.vane');
    const setH = (v) => { s.h = ((Math.round(v) % 360) + 360) % 360; hdg.value = s.h; };
    const setS = (v) => { s.sheet = Math.max(0, Math.min(90, v)); sh.value = s.sheet; };
    setH(s.h); setS(s.sheet);
    const renderTasks = () => { const cur = TASKS.find((x) => !done[x.id]); tasksEl.innerHTML = TASKS.map((x) => `<li class="${done[x.id] ? 'done' : ''} ${cur === x ? 'cur' : ''}"><span class="box">${done[x.id] ? '✓' : ''}</span><span>${esc(x[SA.lang])}</span></li>`).join(''); };
    renderTasks();
    hdg.addEventListener('input', (e) => setH(+e.target.value)); sh.addEventListener('input', (e) => setS(+e.target.value));
    host.querySelectorAll('[data-d]').forEach((b) => b.onclick = () => setH(s.h + +b.dataset.d));
    let drag = false;
    const ptr = (e) => { const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 400 - 200, y = (e.clientY - r.top) / r.height * 400 - 200; if (Math.hypot(x, y) > 12) setH(Math.atan2(x, -y) * 180 / Math.PI); };
    view.addEventListener('pointerdown', (e) => { drag = true; view.setPointerCapture(e.pointerId); ptr(e); });
    view.addEventListener('pointermove', (e) => { if (drag) ptr(e); });
    view.addEventListener('pointerup', () => { drag = false; });
    const onKey = (e) => {
      if (e.target.closest('input,textarea,button') && !e.target.matches('#p-hdg,#p-sheet')) return;
      const r = host.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      const k = { ArrowLeft: () => setH(s.h - 3), ArrowRight: () => setH(s.h + 3), ArrowUp: () => setS(s.sheet - 3), ArrowDown: () => setS(s.sheet + 3) }[e.key];
      if (k) { k(); e.preventDefault(); }
    };
    document.addEventListener('keydown', onKey);
    let hold = null, raf;
    const step = () => {
      const twa = D.twaOf(s.h), tk = D.TACK(s.h), hr = s.h * Math.PI / 180, ux = Math.sin(hr), uy = Math.cos(hr);
      const fx = s.v * ux, fy = s.v * uy + TWS, aws = Math.hypot(fx, fy), awa = Math.acos(Math.max(-1, Math.min(1, (ux * fx + uy * fy) / aws))) * 180 / Math.PI;
      const e = s.sheet - D.optBoom(awa);
      let eff = twa < 40 ? 0 : Math.max(0, 1 - Math.pow(e / (e > 0 ? 22 : 18), 2)); if (twa >= 160 && s.sheet > 70) eff = Math.max(eff, 0.9);
      s.v += (polar(twa) * eff - s.v) * 0.04;
      Object.assign(s, { twa, tk, awa, aws, eff, e, heel: s.v < 0.3 ? 0 : eff * 24 * (awa <= 90 ? Math.min(1, awa / 50) : Math.max(0, (180 - awa) / 90)) * (s.v / 6.5) });
      if (tk !== 0) {
        if (s.prevTack !== tk) { if (s.minT < 40 && s.maxT < 120) s.didTack = true; if (s.maxT > 160) s.didGybe = true; s.minT = twa; s.maxT = twa; }
        s.prevTack = tk;
      }
      s.minT = Math.min(s.minT, twa); s.maxT = Math.max(s.maxT, twa);
    };
    const draw = () => {
      const lu = s.twa < 40 || s.e > 14, fl = lu ? Math.sin(performance.now() / 70) * 4 : 0;
      bg.innerHTML = D.boat(0, 0, s.h, { s: 2.6, boom: Math.max(0, (s.twa < 40 ? 0 : s.sheet) + fl), luff: lu });
      const hr = s.h * Math.PI / 180, mx = 15.6 * Math.sin(hr), my = -15.6 * Math.cos(hr), fd = (s.tk === -1 ? s.h - s.awa : s.h + s.awa) * Math.PI / 180;
      vane.innerHTML = D.arrow((mx + 46 * Math.sin(fd)).toFixed(1), (my - 46 * Math.cos(fd)).toFixed(1), mx.toFixed(1), my.toFixed(1), 'var(--accent)', 3);
      const c = SA.courseOf(Math.round(s.twa)), ru = SA.lang === 'ru';
      const tkTxt = s.tk === -1 ? `<span style="color:var(--port)">${esc(t(S.port))}</span>` : s.tk === 1 ? `<span style="color:var(--stbd)">${esc(t(S.stbd))}</span>` : '—';
      gauges.innerHTML = `<div class="g wide"><span class="label">${esc(t(S.g.course))}</span><span class="big">${SA.term(c[3], esc(t(c[2])))}</span></div>
        <div class="g"><span class="label">${esc(t(S.g.twa))}</span><span class="v">${Math.round(s.twa)}°</span></div><div class="g"><span class="label">${esc(t(S.g.tack))}</span><span class="big" style="font-size:1.2rem">${tkTxt}</span></div>
        <div class="g"><span class="label">${esc(t(S.g.awa))}</span><span class="v">${Math.round(s.awa)}° · ${s.aws.toFixed(1)} ${esc(t(S.kn))}</span></div><div class="g"><span class="label">${esc(t(S.g.sog))}</span><span class="v">${s.v.toFixed(1)} ${esc(t(S.kn))}</span></div>
        <div class="g"><span class="label">${esc(t(S.g.heel))}</span><span class="v">${Math.round(s.heel)}°</span></div><div class="g"><span class="label">${esc(t(S.g.eff))}</span><span class="v">${Math.round(s.eff * 100)}%</span><div class="bar"><i style="width:${Math.round(s.eff * 100)}%;transition:none"></i></div></div>`;
      let cls = 'ok', msg;
      if (s.twa < 40) { cls = 'bad'; msg = ru ? 'Яхта в мёртвой зоне: паруса полощут, хода нет. Уваливайтесь до 45° и больше.' : 'In the no-go zone: the sails flap and the boat stops. Bear away to 45° or more.'; }
      else if (s.e > 10) { cls = 'warn'; msg = ru ? 'Грот заполаскивает: потравлен слишком сильно. Выберите шкот.' : 'The main is luffing: eased too far. Sheet in.'; }
      else if (s.e < -10 && s.twa < 160) { cls = 'warn'; msg = ru ? 'Грот перетянут: поток срывается, растёт крен. Потравите шкот.' : 'The main is over-sheeted: the flow stalls and heel grows. Ease the sheet.'; }
      else msg = ru ? `Парус работает. Гик ≈ ${Math.round(s.sheet)}° к диаметральной плоскости.` : `The sail is working. Boom ≈ ${Math.round(s.sheet)}° off the centreline.`;
      trim.className = 'trim ' + cls; if (trim.textContent !== msg) trim.textContent = msg;
      const cur = TASKS.find((x) => !done[x.id]);
      if (cur) {
        if (cur.ok(s)) { hold = hold || performance.now(); if (cur.now || performance.now() - hold > 1200) { done[cur.id] = true; SA.store.set('sim.points', done); hold = null; renderTasks(); if (TASKS.every((x) => done[x.id])) api.done(); } }
        else hold = null;
      }
    };
    const loop = () => { step(); draw(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    SA.simState = () => { const c = SA.courseOf(Math.round(s.twa || 0)); return { sim: 'points of sail', course: c ? c[2].ru : '', twa: Math.round(s.twa), tack: s.tk === -1 ? 'port' : s.tk === 1 ? 'starboard' : 'none', apparentAngle: Math.round(s.awa), apparentKn: +s.aws.toFixed(1), boatKn: +s.v.toFixed(1), boomAngle: Math.round(s.sheet), optimalBoom: Math.round(D.optBoom(s.awa)), efficiencyPct: Math.round(s.eff * 100), trueWindKn: TWS }; };
    SA.onLeave(() => { cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey); });
  }
};
})();
