// Simulator: compass conversions and speed-time-distance, freshly generated problems (module 6.2).
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const n3 = (x) => String(((Math.round(x) % 360) + 360) % 360).padStart(3, '0') + '°';
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const ew = (v) => Math.abs(v) + '°' + (v < 0 ? 'W' : 'E'); // negative = West
const roseFig = (deg, label) => () => { const [x, y] = D.polar(deg, 100); return `<svg viewBox="-150 -130 300 260" role="img" aria-label="${label}"><circle r="104" fill="var(--surface)" stroke="var(--ink)"/>${Array.from({ length: 36 }, (_, i) => { const [a, b] = D.polar(i * 10, 104), [c, d] = D.polar(i * 10, i % 9 ? 96 : 88); return `<path d="M${a.toFixed(1)},${b.toFixed(1)} L${c.toFixed(1)},${d.toFixed(1)}" stroke="var(--ink)"/>`; }).join('')}${['N', 'E', 'S', 'W'].map((s, i) => { const [a, b] = D.polar(i * 90, 74); return D.txt(a.toFixed(0), (b + 5).toFixed(0), s, { fs: 13, fill: 'var(--muted)' }); }).join('')}${D.arrow(0, 0, x.toFixed(1), y.toFixed(1), 'var(--accent)', 3)}${D.boat(0, 0, deg, { s: .55, nosail: true, edge: false })}</svg>`; };
function convItem() {
  const tr = rnd(0, 35) * 10 + rnd(0, 9), v = rnd(1, 8) * (Math.random() < .5 ? -1 : 1), d = rnd(1, 5) * (Math.random() < .5 ? -1 : 1);
  const toC = Math.random() < .6;
  // T -> M: subtract East (positive), add West (negative): M = T - v ; C = M - d
  const m = tr - v, c = m - d;
  if (toC) {
    const right = n3(c), wrong = [n3(tr + v + d), n3(tr - v + d), n3(tr + v - d)].filter((w) => w !== right);
    const o = [right, ...[...new Set(wrong)].slice(0, 2)];
    return { q: R(`Истинный курс ${n3(tr)}, склонение ${ew(v)}, девиация ${ew(d)}. Какой компасный курс?`, `True course ${n3(tr)}, variation ${ew(v)}, deviation ${ew(d)}. Compass course?`), fig: roseFig(tr, 'true course'), o: o.map((x) => ({ ru: x, en: x })), a: 0,
      e: R(`T ${n3(tr)} → M ${n3(m)} (${v < 0 ? 'W прибавляем' : 'E вычитаем'}) → C ${n3(c)} (${d < 0 ? 'W прибавляем' : 'E вычитаем'}).`, `T ${n3(tr)} → M ${n3(m)} (${v < 0 ? 'add West' : 'subtract East'}) → C ${n3(c)} (${d < 0 ? 'add West' : 'subtract East'}).`), state: { trueCourse: tr, variation: v, deviation: d } };
  }
  // compass bearing -> true: T = C + d + v
  const cb = rnd(0, 359), t = cb + d + v;
  const right = n3(t), wrong = [n3(cb - d - v), n3(cb + d - v), n3(cb - d + v)].filter((w) => w !== right);
  return { q: R(`Пеленг по компасу ${n3(cb)}, девиация ${ew(d)}, склонение ${ew(v)}. Какой истинный пеленг для карты?`, `Compass bearing ${n3(cb)}, deviation ${ew(d)}, variation ${ew(v)}. True bearing to plot?`), fig: roseFig(cb, 'compass bearing'), o: [right, ...[...new Set(wrong)].slice(0, 2)].map((x) => ({ ru: x, en: x })), a: 0,
    e: R(`С компаса на карту: восточные поправки прибавляем, западные вычитаем. C ${n3(cb)} → M ${n3(cb + d)} → T ${n3(t)}.`, `Compass to chart: add East, subtract West. C ${n3(cb)} → M ${n3(cb + d)} → T ${n3(t)}.`), state: { compassBearing: cb, variation: v, deviation: d } };
}
const runFig = (top, bottom) => () => `<svg viewBox="0 0 300 200" role="img" aria-label="speed time distance"><path d="M30,120 H270" stroke="var(--muted)" stroke-dasharray="6 5"/>${D.boat(60, 120, 90, { s: .8, nosail: true, edge: false })}<circle cx="260" cy="120" r="6" fill="var(--accent)"/>${D.txt(150, 70, top, { fs: 20 })}${D.txt(150, 170, bottom, { fs: 15, fill: 'var(--muted)' })}</svg>`;
function stdItem() {
  const sp = rnd(3, 8), mins = [12, 15, 18, 20, 24, 30, 36, 40, 45, 48, 90][rnd(0, 10)], dist = Math.round(sp * mins / 6) / 10;
  const f = (x) => (SA.lang === 'ru' ? String(x).replace('.', ',') : String(x));
  if (Math.random() < .5) {
    const o = [dist, Math.round(sp * mins / 10) / 10 === dist ? dist + 1 : Math.round(sp * mins / 10) / 10, Math.round(dist * 20) / 10];
    return { fig: runFig(`${sp} kn · ${mins} min`, '? nm'), q: R(`Скорость ${sp} уз, время ${mins} мин. Сколько миль пройдено?`, `Speed ${sp} kn for ${mins} min. Distance in miles?`), o: [...new Set(o)].map((x) => ({ ru: f(x) + ' мили', en: f(x) + ' nm' })), a: 0, e: R(`${sp} × ${mins} / 60 = ${f(dist)} мили.`, `${sp} × ${mins} / 60 = ${f(dist)} nm.`), state: { speed: sp, minutes: mins } };
  }
  const t = Math.round(dist / sp * 60);
  return { fig: runFig(`${f(dist)} nm · ${sp} kn`, '? min'), q: R(`До знака ${f(dist)} мили, скорость ${sp} уз. Через сколько минут подойдём?`, `The mark is ${f(dist)} nm away at ${sp} kn. How many minutes?`), o: [...new Set([t, t + 10, Math.max(5, t - 8)])].map((x) => ({ ru: x + ' мин', en: x + ' min' })), a: 0, e: R(`${f(dist)} / ${sp} × 60 = ${t} мин.`, `${f(dist)} / ${sp} × 60 = ${t} min.`), state: { speed: sp, distance: dist } };
}
SA.SIMS.compass = {
  title: R('Штурманский тренажёр', 'Navigation trainer'),
  intro: R('Каждый раз новые задачи: перевод курсов и пеленгов между истинным, магнитным и компасным и расчёт «скорость–время–расстояние». Цель: 8 верных ответов. Отрицательных курсов не бывает: 360° = 000°.', 'New problems every time: converting courses and bearings between true, magnetic and compass, and speed-time-distance. Goal: 8 correct. There are no negative courses: 360° = 000°.'),
  mount(host, api) { const items = Array.from({ length: 24 }, (_, i) => (i % 3 === 2 ? stdItem() : convItem())); SA.trainer(host, { key: 'sim.compass', items, goal: 8, api, label: 'compass and chartwork trainer' }); }
};
})();
