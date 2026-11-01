// Simulator: man overboard drill — act in the right order while the boat sails away (module 2.5).
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const esc = (s) => SA.esc(s), t = (o) => SA.t(o);
const ACT = {
  shout: { l: R('Крикнуть «Человек за бортом!»', 'Shout “Man overboard!”'), need: [] },
  buoy: { l: R('Бросить спасательный круг и буй с флагом', 'Throw the lifebuoy and danbuoy'), need: ['shout'] },
  spotter: { l: R('Назначить наблюдателя: смотреть и показывать рукой', 'Appoint a spotter to watch and point'), need: ['shout'] },
  mob: { l: R('Нажать MOB на картплоттере', 'Press MOB on the chartplotter'), need: ['shout'] },
  mayday: { l: R('Передать MAYDAY по УКВ / DSC', 'Send a MAYDAY by VHF / DSC'), need: ['shout'] },
  turn: { l: R('Быстрая остановка: привестись и сделать оверштаг', 'Quick stop: head up and tack'), need: ['buoy', 'spotter'] },
  approach: { l: R('Подойти медленно, у человека двигатель в нейтраль', 'Approach slowly, engine in neutral at the casualty'), need: ['turn'] },
  recover: { l: R('Поднять человека на борт', 'Recover the person on board'), need: ['approach', 'mayday', 'mob'] },
  jump: { l: R('Прыгнуть в воду за человеком', 'Jump in after the person'), bad: R('Никогда. Теперь в воде двое, а на борту на одного человека меньше.', 'Never. Now there are two people in the water and one fewer on board.') },
  sails: { l: R('Сначала убрать все паруса', 'Drop all sails first'), bad: R('Это занимает минуты, а яхта всё дальше. Сначала круг, наблюдатель и разворот.', 'That takes minutes while the boat sails away. Lifebuoy, spotter and turn first.') }
};
const WHY = {
  shout: R('Сначала крик: весь экипаж должен узнать о происшествии.', 'Shout first: the whole crew must know.'),
  buoy: R('Круг и данбуй бросают сразу, пока человек рядом.', 'Throw the lifebuoy and danbuoy at once, while the person is close.'),
  spotter: R('Наблюдатель не сводит глаз с человека: в волнах его легко потерять.', 'The spotter never takes their eyes off the person: they vanish easily in waves.'),
  turn: R('Разворачиваться можно, когда круг брошен и наблюдатель назначен.', 'Turn once the lifebuoy is thrown and a spotter is watching.'),
  approach: R('Сначала остановите яхту и развернитесь.', 'Stop the boat and turn back first.'),
  recover: R('Перед подъёмом: подойти к человеку, отметить точку MOB и подать сигнал бедствия.', 'Before recovery: reach the person, mark the MOB position and send a distress call.'),
  mob: R('Отметка MOB сохранит точку падения на картплоттере.', 'The MOB button saves the position on the plotter.'),
  mayday: R('Сигнал бедствия подают сразу: помощь придёт быстрее, а отменить его легко.', 'Send the distress call early: help comes sooner and it is easy to cancel.')
};
const OK = {
  shout: R('Экипаж знает. Теперь круг и наблюдатель — сразу!', 'The crew knows. Now the lifebuoy and a spotter, at once!'),
  spotter: R('Наблюдатель смотрит на человека и показывает рукой.', 'The spotter is watching and pointing.'),
  mob: R('Точка падения сохранена на картплоттере.', 'The position is saved on the plotter.'),
  mayday: R('Сигнал бедствия передан. Береговая служба знает о вас.', 'Distress call sent. The coastguard knows.'),
  turn: R('Яхта приводится и делает оверштаг, стаксель тормозит. Когда яхта развернётся, подходите.', 'The boat heads up and tacks; the backed jib slows her. Once round, make your approach.'),
  approach: R('Медленный подход, двигатель в нейтрали. Можно поднимать.', 'Slow approach, engine in neutral. Ready to recover.')
};
const UI = {
  start: R('Начать учение', 'Start the drill'), again: R('Ещё раз', 'Try again'), time: R('Время', 'Time'), dist: R('До человека', 'To the person'),
  errs: R('Ошибки', 'Mistakes'), log: R('Ваши действия', 'Your actions'), alarm: R('Человек за бортом!', 'Man overboard!'),
  ready: R('Яхта идёт галфвиндом 6 узлов. Нажмите «Начать» — и действуйте быстро.', 'The yacht is on a beam reach at 6 knots. Press Start and act fast.'),
  lost: R('Человек теряется из виду: назначьте наблюдателя!', 'You are losing sight of the person: appoint a spotter!'),
  win: (s, e) => SA.lang === 'ru' ? `Человек на борту через ${s} с, ошибок: ${e}.` : `Person recovered in ${s} s with ${e} mistake(s).`,
  pass: R('Учение засчитано.', 'Drill passed.'), fail: R('Попробуйте ещё раз с не более чем одной ошибкой.', 'Try again with at most one mistake.'),
  buoyFar: (d) => SA.lang === 'ru' ? `Круг упал в ${d} м от человека: бросайте сразу.` : `The lifebuoy landed ${d} m from the person: throw it at once.`
};
SA.SIMS.mob = {
  title: R('Учение «Человек за бортом»', 'Man overboard drill'),
  intro: R('Яхта идёт со скоростью 6 узлов — это 3 метра в секунду. Пока вы думаете, человек остаётся позади. Выполните действия в правильном порядке. Зачёт: человек на борту, не больше одной ошибки.', 'The yacht sails at 6 knots, which is 3 metres a second. While you think, the person falls behind. Carry out the actions in the right order. To pass: the person is back on board with no more than one mistake.'),
  mount(host, api) {
    const keys = SA.shuffle(Object.keys(ACT));
    host.innerHTML = `<div class="sim"><div class="simview"></div><div class="panel">
      <div class="gauges"><div class="g"><span class="label">${esc(t(UI.time))}</span><span class="v" data-time>0 s</span></div><div class="g"><span class="label">${esc(t(UI.dist))}</span><span class="v" data-dist>—</span></div><div class="g wide"><span class="label">${esc(t(UI.errs))}</span><span class="v" data-err>0</span></div></div>
      <div class="trim" data-msg aria-live="polite">${esc(t(UI.ready))}</div>
      <div class="opts mobacts">${keys.map((k) => `<button class="opt" data-a="${k}" disabled>${esc(t(ACT[k].l))}</button>`).join('')}</div>
      <button class="btn" data-start>${esc(t(UI.start))}</button>
      <div><span class="label">${esc(t(UI.log))}</span><ol class="moblog"></ol></div>
    </div></div>`;
    const $ = (s) => host.querySelector(s), view = $('.simview');
    let s, raf = 0, last = 0;
    const reset = () => { s = { phase: 'idle', tm: 0, bx: -30, by: 0, h: 90, v: 3, path: [], did: {}, errs: 0, buoy: null, msgT: 0 }; };
    reset();
    const msg = (text, cls) => { const m = $('[data-msg]'); m.textContent = text; m.className = 'trim ' + (cls || ''); };
    const log = (text, ok) => $('.moblog').insertAdjacentHTML('beforeend', `<li class="${ok ? '' : 'bad'}">${esc(text)}</li>`);
    const dist = () => Math.hypot(s.bx, s.by);
    const draw = () => {
      const pts = [[0, 0], [s.bx, s.by], ...(s.buoy ? [s.buoy] : [])];
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      const ext = Math.max(60, Math.max(...xs) - Math.min(...xs) + 40, (Math.max(...ys) - Math.min(...ys) + 40) * 1.6);
      const k = Math.min(5, 380 / ext), X = (x) => 200 + (x - cx) * k, Y = (y) => 140 + (y - cy) * k;
      const bs = Math.max(.3, Math.min(.9, 10 * k / 58));
      const seen = s.did.spotter || s.phase === 'idle' || s.phase === 'sail' || s.tm < 15;
      const person = s.phase === 'done' ? '' : `<g opacity="${seen ? 1 : .25}"><circle cx="${X(0)}" cy="${Y(0)}" r="13" fill="none" stroke="var(--bad)" stroke-width="1.5" opacity=".5"/><circle cx="${X(0)}" cy="${Y(0)}" r="5" fill="var(--bad)"/></g>`;
      const buoy = s.buoy ? `<circle cx="${X(s.buoy[0])}" cy="${Y(s.buoy[1])}" r="6" fill="none" stroke="#F28C28" stroke-width="3.5"/><path d="M${X(s.buoy[0]) + 8},${Y(s.buoy[1])} v-22 l12,5 -12,5" fill="#F28C28" stroke="#F28C28" stroke-width="1.5"/>` : '';
      const scale = `<path d="M20,250 h${(20 * k).toFixed(1)}" stroke="var(--muted)" stroke-width="2"/>${D.txt(20 + 10 * k, 244, '20 m', { fs: 11, fill: 'var(--muted)' })}`;
      view.innerHTML = `<svg viewBox="0 0 400 260" role="img" aria-label="${SA.lang === 'ru' ? 'Схема учения: яхта и человек в воде' : 'Drill chart: the yacht and the person in the water'}">${D.windArrows([30, 370], 8, 26)}${s.phase === 'idle' ? '' : person}${buoy}${D.boat(X(s.bx), Y(s.by), s.h, { s: bs, boom: s.phase === 'return' || s.phase === 'approach' || s.phase === 'done' ? 4 : undefined, luff: s.phase === 'approach' || s.phase === 'done' })}${scale}</svg>`;
      $('[data-time]').textContent = Math.round(s.tm) + ' s';
      $('[data-dist]').textContent = s.phase === 'idle' || s.phase === 'sail' ? '—' : Math.round(dist()) + ' m';
      $('[data-err]').textContent = s.errs;
    };
    const step = (dt) => {
      if (s.phase === 'sail') { s.tm += dt; s.bx += s.v * dt; if (s.bx >= 0) { s.bx = 0; s.phase = 'away'; s.tm = 0; msg(t(UI.alarm), 'bad'); host.querySelectorAll('[data-a]').forEach((b) => (b.disabled = false)); } return; }
      if (s.phase === 'idle' || s.phase === 'done') return;
      s.tm += dt;
      if (s.phase === 'away') { s.bx += s.v * dt; if (!s.did.spotter && s.tm > 15 && !s.lostSaid) { s.lostSaid = true; msg(t(UI.lost), 'warn'); } return; }
      const tgt = s.path[0];
      if (!tgt) return;
      const dx = tgt[0] - s.bx, dy = tgt[1] - s.by, d = Math.hypot(dx, dy), v = tgt[2] * dt;
      s.h = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
      if (d <= v) { s.bx = tgt[0]; s.by = tgt[1]; s.path.shift(); } else { s.bx += dx / d * v; s.by += dy / d * v; }
    };
    const loop = (now) => { const dt = Math.min(.1, (now - last) / 1000); last = now; step(dt); draw(); raf = requestAnimationFrame(loop); };
    const act = (k) => {
      const a = ACT[k];
      if (s.did[k]) return;
      if (a.bad) { s.errs++; msg(t(a.bad), 'bad'); log(t(a.l), false); draw(); return; }
      const miss = a.need.find((n) => !s.did[n]);
      if (miss) { s.errs++; msg(t(WHY[miss]) , 'warn'); log(t(a.l), false); draw(); return; }
      s.did[k] = true; log(t(a.l), true);
      host.querySelector(`[data-a="${k}"]`).classList.add('right');
      if (k === 'buoy') { s.buoy = [s.bx, s.by]; const d = Math.round(dist()); msg(d > 30 ? UI.buoyFar(d) : t(WHY.buoy), d > 30 ? 'warn' : 'ok'); if (d > 30) s.errs++; return; }
      if (k === 'turn') {
        const cx = s.bx, cy = -14, r = 14; s.path = [];
        for (let a = 20; a <= 270; a += 25) s.path.push([cx + r * Math.sin(a * Math.PI / 180), cy + r * Math.cos(a * Math.PI / 180), 2.5]);
        s.path.push([Math.max(18, cx * .5), 16, 2.5], [20, 14, 2]); s.phase = 'return';
      }
      if (k === 'approach') { s.path = [[6, 10, 1.4], [2, 8, .6]]; s.phase = 'approach'; }
      if (k === 'recover') {
        s.phase = 'done'; const ok = s.errs <= 1;
        msg(UI.win(Math.round(s.tm), s.errs) + ' ' + t(ok ? UI.pass : UI.fail), ok ? 'ok' : 'warn');
        if (ok) { SA.store.set('sim.mob', { best: Math.round(s.tm) }); api.done(); }
        $('[data-start]').textContent = t(UI.again); $('[data-start]').hidden = false; return;
      }
      msg(t(OK[k] || a.l), 'ok');
    };
    host.addEventListener('click', (e) => {
      const b = e.target.closest('[data-a]'); if (b && !b.disabled) { act(b.dataset.a); return; }
      if (e.target.closest('[data-start]')) {
        reset(); $('.moblog').innerHTML = ''; host.querySelectorAll('[data-a]').forEach((x) => { x.disabled = true; x.classList.remove('right'); });
        s.phase = 'sail'; msg(t(UI.ready)); $('[data-start]').hidden = true;
      }
    });
    SA.simState = () => ({ sim: 'man overboard drill', phase: s.phase, secondsSinceMOB: Math.round(s.tm), distanceM: Math.round(dist()), done: Object.keys(s.did), mistakes: s.errs });
    last = performance.now(); raf = requestAnimationFrame(loop);
    SA.onLeave(() => cancelAnimationFrame(raf));
  }
};
})();
