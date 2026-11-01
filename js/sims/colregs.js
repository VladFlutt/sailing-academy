// Simulator: COLREGs encounters — who gives way? (module 5.1)
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const ME = R('Уступаю я', 'I give way'), THEY = R('Уступает другое судно', 'The other vessel gives way'), BOTH = R('Оба отворачивают вправо', 'Both alter to starboard');
const OPTS = [ME, THEY, BOTH];
const L = {
  you: R('Вы', 'You'), youM: R('Вы, под мотором', 'You, motoring'), sail: R('парусное', 'sailing'), power: R('моторное', 'power'),
  fish: R('тралит', 'trawling'), chan: R('узкий фарватер', 'narrow channel'), wind: R('ветер', 'wind')
};
const lbl = (x, y, s, c) => D.txt(x, y, SA.t(s), { fs: 13, fill: c || 'var(--muted)' });
const youFill = 'color-mix(in srgb,var(--accent) 35%,var(--surface))';
// v: { me:{x,y,h,motor}, other:{x,y,h,kind:'sail'|'power'|'fish'}, channel? }
const scene = (v) => () => {
  const m = v.me, o = v.other;
  const meSvg = m.motor ? D.boat(m.x, m.y, m.h, { s: .9, nosail: true, fill: youFill, edge: false }) : D.boat(m.x, m.y, m.h, { s: .9, fill: youFill });
  const oSvg = o.kind === 'sail' ? D.boat(o.x, o.y, o.h, { s: .9 }) : D.ship(o.x, o.y, o.h, { s: o.kind === 'fish' ? .9 : 1.05, len: o.kind === 'fish' ? .9 : 1.25 });
  const vec = (p, len) => { const [dx, dy] = D.polar(p.h, len); return `<path d="M${p.x},${p.y} l${dx.toFixed(1)},${dy.toFixed(1)}" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 5" fill="none"/>`; };
  const net = o.kind === 'fish' ? (() => { const [dx, dy] = D.polar(o.h + 180, 70); return `<path d="M${o.x},${o.y} l${dx.toFixed(1)},${dy.toFixed(1)}" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="2 4"/><circle cx="${(o.x + dx).toFixed(1)}" cy="${(o.y + dy).toFixed(1)}" r="6" fill="none" stroke="var(--warn)" stroke-width="1.5"/>`; })() : '';
  const ch = v.channel ? `<rect x="-38" y="-150" width="76" height="300" fill="var(--wind)" opacity=".08"/><path d="M-38,-150 V150 M38,-150 V150" stroke="var(--muted)" stroke-dasharray="8 6" stroke-width="1.5"/>${D.txt(44, 138, SA.t(L.chan), { a: 'start', fs: 12, fill: 'var(--muted)' })}` : '';
  return `<svg viewBox="-200 -150 400 300" role="img" aria-label="${SA.lang === 'ru' ? 'Ситуация сближения' : 'Encounter situation'}">${ch}
    ${D.windArrows([-170, 170], -146, 26)}${D.txt(-170, -100, SA.t(L.wind), { fs: 12, fill: 'var(--wind)' })}
    ${vec(m, 90)}${vec(o, 90)}${net}${oSvg}${meSvg}
    ${lbl(m.x, m.y + 48, m.motor ? L.youM : L.you, 'var(--accent)')}${lbl(o.x, o.y + (o.kind === 'sail' ? 48 : 52), L[o.kind])}
  </svg>`;
};
const I = (q, v, a, e, rule) => ({ q, fig: scene(v), o: OPTS, a, e, state: { rule, me: v.me, other: v.other } });
const WHO = R('Кто уступает дорогу?', 'Who gives way?');
const ITEMS = [
  I(WHO, { me: { x: 20, y: 60, h: 320 }, other: { x: -130, y: 10, h: 50, kind: 'sail' } }, 1, R('Вы на правом галсе (ветер в правый борт), он на левом. Судно левого галса уступает — правило 12(a)(i).', 'You are on starboard tack, the other boat on port. Port tack gives way: Rule 12(a)(i).'), '12(a)(i)'),
  I(WHO, { me: { x: -20, y: 60, h: 50 }, other: { x: 130, y: 10, h: 310, kind: 'sail' } }, 0, R('Вы на левом галсе: ветер дует в левый борт. Уступайте яхте правого галса, отворачивая заранее и заметно (правила 12 и 16).', 'You are on port tack: the wind is on your port side. Give way to the starboard-tack boat early and clearly (Rules 12 and 16).'), '12(a)(i)'),
  I(WHO, { me: { x: 40, y: 70, h: 290 }, other: { x: -10, y: -60, h: 250, kind: 'sail' } }, 1, R('Оба на правом галсе. Уступает наветренное судно, то есть то, что ближе к ветру, — это другая яхта (правило 12(a)(ii)).', 'Both on starboard tack. The windward boat gives way, and that is the other boat (Rule 12(a)(ii)).'), '12(a)(ii)'),
  I(WHO, { me: { x: -30, y: -30, h: 70 }, other: { x: 10, y: 90, h: 40, kind: 'sail' } }, 0, R('Оба на левом галсе, и вы на ветре (выше по ветру). Наветренное судно уступает подветренному.', 'Both on port tack and you are to windward. The windward boat keeps clear of the leeward one.'), '12(a)(ii)'),
  I(WHO, { me: { x: 0, y: 60, h: 320 }, other: { x: 150, y: -20, h: 260, kind: 'power' } }, 1, R('Моторное судно уступает парусному — правило 18. Но следите: крупное судно может не видеть яхту, будьте готовы действовать сами (правило 17).', 'A power vessel gives way to a sailing vessel: Rule 18. But a big ship may not see you, so be ready to act yourself (Rule 17).'), '18'),
  I(WHO, { me: { x: -120, y: 40, h: 60 }, other: { x: 0, y: -60, h: 180, kind: 'power' }, channel: true }, 0, R('В узком фарватере яхта длиной менее 20 м не должна мешать судну, которое может идти только по фарватеру (правило 9(b)). Пересекайте его быстро и под прямым углом, когда он не рядом.', 'In a narrow channel a sailing vessel under 20 m must not impede a vessel that can only navigate inside it (Rule 9(b)). Cross quickly, at right angles, when it is clear.'), '9(b)'),
  I(WHO, { me: { x: -40, y: 40, h: 90 }, other: { x: 90, y: 40, h: 90, kind: 'sail' } }, 0, R('Вы догоняете другое судно сзади — это обгон. Обгоняющий уступает всегда, даже парусник моторному (правило 13).', 'You are coming up from astern: overtaking. The overtaking vessel always keeps clear, whatever its type (Rule 13).'), '13'),
  I(WHO, { me: { x: 0, y: 60, h: 0, motor: true }, other: { x: 150, y: -30, h: 270, kind: 'power' } }, 0, R('Под мотором яхта — моторное судно. Другое судно у вас справа, при пересечении курсов уступает тот, у кого другое судно справа (правило 15). Отворачивайте вправо и проходите у него за кормой.', 'Under engine a yacht is a power vessel. The other vessel is on your starboard side, so you give way (Rule 15). Turn to starboard and pass astern of it.'), '15'),
  I(WHO, { me: { x: 0, y: 60, h: 0, motor: true }, other: { x: -150, y: -30, h: 90, kind: 'power' } }, 1, R('Другое судно у вас слева: оно уступает. Вы — привилегированное судно: сохраняйте курс и скорость, но будьте готовы действовать (правило 17).', 'The other vessel is on your port side: it gives way. You are the stand-on vessel: hold course and speed, but be ready to act (Rule 17).'), '15/17'),
  I(WHO, { me: { x: 0, y: 70, h: 0, motor: true }, other: { x: 0, y: -100, h: 180, kind: 'power' } }, 2, R('Два моторных судна идут прямо навстречу: каждое отворачивает вправо и расходится левыми бортами (правило 14).', 'Two power vessels head-on: each alters to starboard and they pass port to port (Rule 14).'), '14'),
  I(WHO, { me: { x: 0, y: 60, h: 320 }, other: { x: 130, y: -40, h: 250, kind: 'fish' } }, 0, R('Судно, занятое ловом рыбы (с тралом или сетями), ограничено в манёвре. Парусное судно уступает ему (правило 18(b)). Не проходите между ним и его сетью.', 'A vessel engaged in fishing is restricted by its gear. A sailing vessel keeps clear of it (Rule 18(b)). Never pass between it and its net.'), '18(b)'),
  I(WHO, { me: { x: 40, y: 40, h: 90 }, other: { x: -120, y: 40, h: 90, kind: 'power' } }, 1, R('Катер догоняет вас сзади: он обгоняющий и уступает (правило 13). Вы сохраняете курс и скорость.', 'The motorboat is coming up from astern: it is overtaking and keeps clear (Rule 13). You hold your course and speed.'), '13')
];
SA.SIMS.colregs = {
  title: R('Кто уступает дорогу?', 'Who gives way?'),
  intro: R('Ветер дует сверху. Ваша яхта подсвечена цветом, пунктир показывает курсы. Определите, кто уступает. Цель: 9 верных ответов. Помните про [[cbdr|постоянный пеленг]]: если он не меняется, риск столкновения есть.', 'The wind blows from the top. Your boat is highlighted; dashed lines show the courses. Decide who gives way. Goal: 9 correct answers. Remember the [[cbdr|constant bearing]]: if it does not change, there is a risk of collision.'),
  mount(host, api) { SA.trainer(host, { key: 'sim.colregs', items: ITEMS, goal: 9, api, label: 'COLREGs give-way trainer' }); }
};
})();
