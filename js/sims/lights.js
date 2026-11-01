// Simulator: night lights — what vessel do you see? (module 5.2)
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const N = {
  pwrHead: R('Моторное судно идёт прямо на вас', 'Power vessel heading straight at you'),
  pwrStbd: R('Моторное судно, видим его правый борт', 'Power vessel, you see its starboard side'),
  pwrBigPort: R('Моторное судно длиннее 50 м, видим его левый борт', 'Power vessel over 50 m, you see its port side'),
  sailHead: R('Парусное судно идёт прямо на вас', 'Sailing vessel heading straight at you'),
  sailTri: R('Парусная яхта до 20 м, видим её левый борт (трёхцветный огонь)', 'Sailing yacht under 20 m, port side (tricolour)'),
  stern: R('Вы видите корму судна, то есть догоняете его', 'You see a vessel’s stern: you are overtaking it'),
  trawl: R('Судно тралит', 'Vessel trawling'), fish: R('Судно ловит рыбу, но не тралом', 'Vessel fishing, not trawling'),
  nuc: R('Судно, лишённое возможности управляться', 'Vessel not under command'), ram: R('Судно, ограниченное в возможности маневрировать', 'Vessel restricted in her ability to manoeuvre'),
  cbd: R('Судно, стеснённое своей осадкой', 'Vessel constrained by her draught'), pilot: R('Лоцманское судно при исполнении', 'Pilot vessel on duty'),
  anchor: R('Судно на якоре', 'Vessel at anchor'), tow: R('Буксир с буксируемым судном', 'Vessel towing')
};
const hull = (dir) => dir === 'head' ? `<path d="M-46,40 Q0,58 46,40 L30,60 L-30,60Z" fill="#ffffff10"/>` : `<path d="M-110,40 L110,40 L${dir === 'L' ? '80,62 L-120,62' : '120,62 L-80,62'}Z" fill="#ffffff10"/>`;
const sea = `<rect x="-200" y="62" width="400" height="88" fill="#ffffff06"/><path d="M-200,62 H200" stroke="#ffffff22"/>`;
const F = (inner, dir) => () => `<svg viewBox="-200 -150 400 300" role="img" aria-label="${SA.lang === 'ru' ? 'Огни судна ночью' : 'A vessel’s lights at night'}">${sea}${hull(dir)}${inner}</svg>`;
const L = D.light;
const stack = (x, cols, top = -110, gap = 26) => cols.map((c, i) => L(x, top + i * gap, c, 6)).join('');
const I = (fig, a, o, e, state) => ({ q: R('Что за судно перед вами?', 'What vessel is this?'), fig, o: [N[a], ...o.map((k) => N[k])], a: 0, e, state: { lights: state } });
const ITEMS = [
  I(F(L(0, -70, 'white') + L(-34, 18, 'green') + L(34, 18, 'red'), 'head'), 'pwrHead', ['sailHead', 'pwrStbd'], R('Топовый белый огонь плюс оба бортовых: судно с двигателем идёт на вас. Каждый отворачивает вправо.', 'A white masthead light and both sidelights: a power vessel coming at you. Both alter to starboard.'), 'white masthead, red + green'),
  I(F(L(40, -70, 'white') + L(60, 18, 'green'), 'R'), 'pwrStbd', ['pwrBigPort', 'sailTri'], R('Белый топовый и зелёный бортовой: вы видите правый борт моторного судна. Оно у вас слева, вы на привилегированном курсе, но следите.', 'White masthead and green: you see the starboard side of a power vessel. It is on your port side, so you are stand-on, but watch it.'), 'white masthead + green'),
  I(F(L(-60, -50, 'white') + L(50, -95, 'white') + L(-70, 18, 'red'), 'L'), 'pwrBigPort', ['pwrStbd', 'tow'], R('Два топовых огня (задний выше переднего) — судно длиннее 50 м. Красный — его левый борт. Красный огонь у вас справа значит, что оно у вас справа: уступаете вы, если вы под мотором.', 'Two masthead lights (aft one higher): a vessel over 50 m. Red is its port side. If you are motoring, it is on your starboard side and you give way.'), 'two masthead, red'),
  I(F(L(-34, 18, 'green') + L(34, 18, 'red'), 'head'), 'sailHead', ['pwrHead', 'anchor'], R('Только бортовые огни, без топового белого: парусное судно идёт на вас.', 'Only sidelights, no white masthead light: a sailing vessel coming towards you.'), 'red + green only'),
  I(F(`<path d="M0,40 V-104" stroke="#ffffff22" stroke-width="2"/>` + L(0, -110, 'red'), 'L'), 'sailTri', ['nuc', 'pwrBigPort'], R('Один красный огонь на топе мачты — [[tricolour|трёхцветный огонь]] яхты до 20 м, видим её левый борт.', 'One red light at the masthead: a yacht’s [[tricolour|tricolour]], under 20 m, port side towards you.'), 'red at masthead'),
  I(F(L(0, 20, 'white'), 'head'), 'stern', ['anchor', 'pilot'], R('Одиночный белый низко над водой при сближении — обычно [[sternlight|кормовой огонь]]. Вы догоняете судно и уступаете ему как обгоняющее. Огонь на якоре виден на любом направлении и обычно выше.', 'A single low white light you are closing on is usually a [[sternlight|sternlight]]. You are overtaking and keep clear. An anchor light shows all round and is usually higher.'), 'single white'),
  I(F(stack(0, ['green', 'white']) + L(60, 18, 'green'), 'R'), 'trawl', ['fish', 'pilot'], R('Зелёный над белым — судно тралит («зелёное поле над белым снегом» — трал по дну). Держитесь от него в стороне.', 'Green over white: trawling. Keep well clear.'), 'green over white'),
  I(F(stack(0, ['red', 'white']) + L(-70, 18, 'red'), 'L'), 'fish', ['trawl', 'pilot'], R('Красный над белым — лов рыбы не тралом, например сетями. Сеть может тянуться далеко.', 'Red over white: fishing other than trawling, such as with nets. The gear may stretch a long way.'), 'red over white'),
  I(F(stack(0, ['red', 'red'])), 'nuc', ['cbd', 'ram'], R('Два красных по вертикали — судно лишено возможности управляться (поломка). Уступают все.', 'Two reds vertically: not under command. Everyone keeps clear.'), 'red over red'),
  I(F(stack(0, ['red', 'white', 'red'])), 'ram', ['nuc', 'cbd'], R('Красный–белый–красный — судно ограничено в возможности маневрировать: дноуглубление, прокладка кабеля, водолазные работы.', 'Red–white–red: restricted in her ability to manoeuvre, such as dredging or cable laying.'), 'red white red'),
  I(F(stack(0, ['red', 'red', 'red'])), 'cbd', ['ram', 'nuc'], R('Три красных — крупное судно, стеснённое осадкой. Не мешайте ему.', 'Three reds: a large vessel constrained by her draught. Do not impede it.'), 'three red'),
  I(F(stack(0, ['white', 'red'])), 'pilot', ['fish', 'anchor'], R('Белый над красным — лоцманское судно («белая шапка над красным носом»).', 'White over red: a pilot vessel (“white hat, red nose”).'), 'white over red')
];
SA.SIMS.lights = {
  title: R('Ночные огни: что за судно?', 'Night lights: what vessel?'),
  intro: R('Ночью вы видите только огни. Определите тип судна и с какой стороны вы на него смотрите. Цель: 9 верных ответов. Подсказка: если видите и красный, и зелёный, судно идёт прямо на вас.', 'At night you only see lights. Work out the type of vessel and which side you are looking at. Goal: 9 correct. Tip: if you see both red and green, it is heading straight at you.'),
  mount(host, api) { SA.trainer(host, { key: 'sim.lights', items: ITEMS, goal: 9, night: true, api, label: 'night lights trainer' }); }
};
})();
