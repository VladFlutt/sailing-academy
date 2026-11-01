// Simulator: IALA region A buoyage — identify the mark and how to pass it (module 5.3).
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const A = {
  port: R('Левая сторона: при входе с моря оставить слева', 'Port hand: leave to port when entering from seaward'),
  stbd: R('Правая сторона: при входе с моря оставить справа', 'Starboard hand: leave to starboard when entering from seaward'),
  north: R('Северный кардинальный: проходить к северу от знака', 'North cardinal: pass to the north of it'),
  south: R('Южный кардинальный: проходить к югу от знака', 'South cardinal: pass to the south of it'),
  east: R('Восточный кардинальный: проходить к востоку от знака', 'East cardinal: pass to the east of it'),
  west: R('Западный кардинальный: проходить к западу от знака', 'West cardinal: pass to the west of it'),
  danger: R('Отдельная опасность: малая опасность прямо под знаком, близко не подходить', 'Isolated danger: a small danger right under it, keep clear'),
  safe: R('Безопасная вода: вокруг чисто, середина фарватера или подход', 'Safe water: clear all round, mid-channel or landfall'),
  special: R('Специальный знак: зона, кабель или гонка — смотрите карту', 'Special mark: a zone, cable or race area; check the chart')
};
const sea = `<rect x="-200" y="60" width="400" height="90" fill="var(--wind)" opacity=".1"/>`;
const fig = (kind, note) => () => `<svg viewBox="-200 -150 400 300" role="img" aria-label="${SA.lang === 'ru' ? 'Навигационный знак' : 'Navigation mark'}">${sea}${D.buoy(0, 30, kind, 1.25)}${note ? D.txt(0, 136, SA.t(note), { fs: 14, fill: 'var(--muted)' }) : ''}</svg>`;
const night = (txt) => () => `<svg viewBox="-200 -150 400 300" role="img" aria-label="${SA.lang === 'ru' ? 'Огонь знака ночью' : 'A mark’s light at night'}"><rect x="-200" y="-150" width="400" height="300" fill="#08121D"/>${D.light(0, -40, 'white', 8)}${D.txt(0, 40, txt, { fs: 26, fill: '#fff', w: 600 })}</svg>`;
const MARK = R('Что это за знак и как его обходить?', 'What is this mark and how do you pass it?');
const id = (k, o, e) => ({ q: MARK, fig: fig(k), o: [A[k], ...o.map((x) => A[x])], a: 0, e, state: { mark: k } });
const ITEMS = [
  id('port', ['stbd', 'special'], R('Красный цилиндр — [[lateral|латеральный]] знак левой стороны в системе A (Европа и Россия). Входя в порт с моря, держите его слева.', 'A red can: a port-hand [[lateral|lateral]] mark in region A (Europe and Russia). Entering harbour from seaward, keep it on your port side.')),
  id('stbd', ['port', 'safe'], R('Зелёный конус — знак правой стороны. Входя с моря, оставляйте справа. В районе B (Америка) цвета наоборот.', 'A green cone: starboard-hand mark. Entering from seaward, leave it to starboard. Region B (the Americas) swaps the colours.')),
  id('north', ['south', 'west'], R('Оба конуса вверх, чёрный над жёлтым. Безопасная вода к северу от [[cardinal|кардинального знака]].', 'Both cones up, black over yellow. Safe water lies to the north of this [[cardinal|cardinal mark]].')),
  id('south', ['north', 'east'], R('Оба конуса вниз, жёлтый над чёрным. Проходите к югу.', 'Both cones down, yellow over black. Pass to the south.')),
  id('east', ['west', 'danger'], R('Конусы основаниями врозь («яйцо»), чёрный–жёлтый–чёрный. Проходите к востоку.', 'Cones base to base (an “egg”), black–yellow–black. Pass to the east.')),
  id('west', ['east', 'north'], R('Конусы вершинами друг к другу («рюмка», W), жёлтый–чёрный–жёлтый. Проходите к западу.', 'Cones point to point (a wine glass, W), yellow–black–yellow. Pass to the west.')),
  id('danger', ['safe', 'special'], R('Два чёрных шара и красно-чёрные полосы — [[isolated|отдельная опасность]]: камень или затонувшее судно прямо под знаком.', 'Two black balls and black–red bands: an [[isolated|isolated danger]], such as a rock or wreck right beneath it.')),
  id('safe', ['danger', 'port'], R('Красно-белые вертикальные полосы и красный шар — [[safewater|безопасная вода]]. Обычно ставят на подходе к фарватеру.', 'Red and white vertical stripes and a red ball: [[safewater|safe water]], often at the approach to a channel.')),
  id('special', ['danger', 'stbd'], R('Жёлтый знак с косым крестом — [[special|специальный]]: граница зоны, трубопровод, гоночная дистанция.', 'Yellow with an X topmark: a [[special|special mark]] for a zone, pipeline or race area.')),
  { q: R('Ночью белый огонь даёт 9 частых вспышек, затем пауза. Какой это знак?', 'At night a white light gives 9 quick flashes, then a pause. Which mark is it?'), fig: night('Q(9) 15s'), o: [A.west, A.east, A.south], a: 0, e: R('Число вспышек — как цифры на циферблате: восток — 3, юг — 6, запад — 9, север — непрерывно.', 'Count the flashes like a clock face: east 3, south 6, west 9, north continuous.') },
  { q: R('Белый огонь: 6 частых вспышек и одна длинная. Что это?', 'A white light: 6 quick flashes and one long flash. What is it?'), fig: night('Q(6)+LFl 15s'), o: [A.south, A.north, A.danger], a: 0, e: R('Южный кардинальный: 6 «часов» плюс длинная вспышка, чтобы не спутать с востоком и западом.', 'South cardinal: “6 o’clock” plus a long flash so it is not confused with east or west.') },
  { q: R('Белый огонь: группы по 2 вспышки. Что это за знак?', 'A white light flashing in groups of 2. Which mark?'), fig: night('Fl(2) 5s'), o: [A.danger, A.safe, A.east], a: 0, e: R('Fl(2) — отдельная опасность: «два шара — две вспышки».', 'Fl(2): isolated danger, two balls, two flashes.') }
];
SA.SIMS.buoyage = {
  title: R('Читаем навигационные знаки', 'Reading the buoys'),
  intro: R('Система МАМЭМ, район A (Европа, Россия). Определите знак по форме, цвету и топовой фигуре, а ночью по огню. Цель: 9 верных ответов.', 'IALA region A (Europe, Russia). Identify the mark by shape, colour and topmark, and at night by its light. Goal: 9 correct.'),
  mount(host, api) { SA.trainer(host, { key: 'sim.buoyage', items: ITEMS, goal: 9, api, label: 'IALA buoyage trainer' }); }
};
})();
