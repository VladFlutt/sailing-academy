// Shared scenario trainer: a picture, a question, options, instant feedback, a streak goal.
// Used by the knots, COLREGs, lights and buoyage simulators.
(() => {
'use strict';
const SA = window.SA;
const esc = (s) => SA.esc(s), t = (o) => SA.t(o);
const UI = {
  score: { ru: 'Верных ответов', en: 'Correct answers' }, goal: { ru: 'Цель', en: 'Goal' }, next: { ru: 'Следующая ситуация', en: 'Next situation' },
  right: { ru: 'Верно.', en: 'Correct.' }, wrong: { ru: 'Неверно.', en: 'Not quite.' }, done: { ru: 'Тренажёр пройден. Можно продолжать для практики.', en: 'Trainer complete. Keep going for practice.' },
  reset: { ru: 'Начать заново', en: 'Start again' }
};
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
SA.shuffle = shuffle;

// cfg: { key, items: [{ fig?: () => svg, q, o: [..], a, e }], goal, night?, api, label }
SA.trainer = (host, cfg) => {
  const st = SA.store.get(cfg.key, { right: 0, done: false });
  let order = shuffle(cfg.items.map((_, i) => i)), pos = 0, answered = false, cur = null, opts = [];
  const hasFig = cfg.items.some((x) => x.fig);
  host.innerHTML = `<div class="sim trainer${hasFig ? '' : ' nofig'}">${hasFig ? `<div class="simview${cfg.night ? ' night' : ''}"></div>` : ''}<div class="panel">
    <div class="gauges"><div class="g"><span class="label">${esc(t(UI.score))}</span><span class="v" data-r>0</span></div><div class="g"><span class="label">${esc(t(UI.goal))}</span><span class="v">${cfg.goal}</span></div></div>
    <div class="tq"><p class="tqq"></p><div class="opts"></div><p class="fb" aria-live="polite"></p></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-next hidden>${esc(t(UI.next))}</button><button class="btn ghost" data-reset>${esc(t(UI.reset))}</button></div>
  </div></div>`;
  const $ = (s) => host.querySelector(s), view = $('.simview');
  const paint = () => {
    $('[data-r]').textContent = st.right;
    if (st.done && !$('.tdone')) $('.panel').insertAdjacentHTML('afterbegin', `<div class="trim ok tdone">${esc(t(UI.done))}</div>`);
  };
  const show = () => {
    if (pos >= order.length) { order = shuffle(order); pos = 0; }
    cur = cfg.items[order[pos++]]; answered = false;
    opts = shuffle(cur.o.map((o, j) => ({ o, j })));
    if (view) view.innerHTML = cur.fig ? cur.fig() : '';
    $('.tqq').innerHTML = `<b>${esc(t(cur.q))}</b>`;
    $('.opts').innerHTML = opts.map((x, k) => `<button class="opt" data-k="${k}">${esc(t(x.o))}</button>`).join('');
    $('.fb').textContent = ''; $('.fb').className = 'fb'; $('[data-next]').hidden = true;
  };
  host.addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (b && !answered) {
      answered = true; const pick = opts[+b.dataset.k], ok = pick.j === cur.a;
      host.querySelectorAll('.opt').forEach((x) => { const o = opts[+x.dataset.k]; if (o.j === cur.a) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      st.right = ok ? st.right + 1 : Math.max(0, st.right - 1);
      if (st.right >= cfg.goal && !st.done) { st.done = true; cfg.api.done(); }
      SA.store.set(cfg.key, st);
      const fb = $('.fb'); fb.innerHTML = `<b>${esc(t(ok ? UI.right : UI.wrong))}</b> ${SA.md(cur.e)}`; fb.className = 'fb ' + (ok ? 'ok' : 'no');
      $('[data-next]').hidden = false; $('[data-next]').focus({ preventScroll: true }); paint(); return;
    }
    if (e.target.closest('[data-next]')) { show(); return; }
    if (e.target.closest('[data-reset]')) { st.right = 0; st.done = false; SA.store.set(cfg.key, st); $('.tdone')?.remove(); paint(); show(); }
  });
  SA.simState = () => ({ sim: cfg.label, situation: cur ? t(cur.q) : '', answered, correctSoFar: st.right, goal: cfg.goal, ...(cur && cur.state ? cur.state : {}) });
  paint(); show();
};
})();
