// Simulator: "Which knot?" — situations on board, pick the right knot (module 3.5).
(() => {
'use strict';
const SA = window.SA;
const R = (ru, en) => ({ ru, en });
const K = {
  bowline: R('Беседочный узел', 'Bowline'), clove: R('Выбленочный узел', 'Clove hitch'), roundturn: R('Рыбацкий штык (шлаг и два полуштыка)', 'Round turn and two half hitches'),
  figure8: R('Восьмёрка', 'Figure-of-eight'), reefknot: R('Прямой узел', 'Reef knot'), sheetbend: R('Шкотовый узел', 'Sheet bend'), cleat: R('Крепление на утке', 'Cleat hitch')
};
const Q = (q, a, wrong, e) => ({ q, o: [K[a], ...wrong.map((w) => K[w])], a: 0, e });
const ITEMS = [
  Q(R('Нужно накинуть неподвижную петлю швартова на пал причала.', 'You need a fixed loop in a mooring line to drop over a bollard.'), 'bowline', ['clove', 'reefknot'], R('[[bowline|Беседочный]] даёт петлю, которая не затягивается и легко развязывается.', 'A [[bowline|bowline]] makes a loop that does not slip and unties easily.')),
  Q(R('Повесить кранец на леер так, чтобы потом легко подрегулировать высоту.', 'Hang a fender on the rail so its height is easy to adjust later.'), 'clove', ['bowline', 'figure8'], R('[[clove|Выбленочный узел]] быстро вяжется и регулируется.', 'A [[clove|clove hitch]] is quick to tie and adjust.')),
  Q(R('Шкот стакселя может выскочить из блока. Что завязать на его конце?', 'The jib sheet could run out through its block. What goes on its end?'), 'figure8', ['bowline', 'sheetbend'], R('[[figure8|Восьмёрка]] — стопорный узел.', 'A [[figure8|figure-of-eight]] is a stopper knot.')),
  Q(R('Привязать швартов к рыму на стенке, где на тросе уже есть нагрузка.', 'Tie a line that is already under load to a ring on the quay.'), 'roundturn', ['reefknot', 'clove'], R('Полный шлаг берёт нагрузку, пока вы вяжете два полуштыка: [[roundturn|рыбацкий штык]].', 'The round turn takes the load while you add two half hitches: [[roundturn|round turn and two half hitches]].')),
  Q(R('Связать риф-сезни вокруг собранного паруса.', 'Tie reef points round the bunched sail.'), 'reefknot', ['sheetbend', 'bowline'], R('[[reefknot|Прямой узел]] лежит плоско и развязывается рывком за ходовой конец.', 'A [[reefknot|reef knot]] lies flat and is released by pulling a tail.')),
  Q(R('Нарастить толстый швартов тонким концом, чтобы дотянуться до берега.', 'Lengthen a thick mooring line with a thinner rope to reach the shore.'), 'sheetbend', ['reefknot', 'figure8'], R('На тросах разной толщины прямой узел ползёт, а [[sheetbend|шкотовый]] держит.', 'A reef knot slips on unequal ropes; a [[sheetbend|sheet bend]] holds.')),
  Q(R('Человек в воде. Нужна петля, которую можно надеть ему под мышки.', 'A person is in the water. You need a loop to put under their arms.'), 'bowline', ['clove', 'roundturn'], R('Петля [[bowline|беседочного узла]] не затянется на человеке.', 'A [[bowline|bowline]] loop will not tighten on the person.')),
  Q(R('Закрепить фал так, чтобы его можно было быстро отдать под нагрузкой.', 'Make a halyard fast so it can be released quickly under load.'), 'cleat', ['bowline', 'reefknot'], R('Полный шлаг, восьмёрки и шлаг в замок на [[cleat|утке]] отдаются за секунды.', 'Turn, figure-of-eights and a locking hitch on a [[cleat|cleat]] release in seconds.')),
  Q(R('Привязать тузик к рыму на корме на время стоянки.', 'Tie the dinghy painter to a ring at the stern while at anchor.'), 'roundturn', ['figure8', 'reefknot'], R('[[roundturn|Шлаг и два полуштыка]] надёжны на рыме и легко отдаются.', 'A [[roundturn|round turn and two half hitches]] is secure on a ring and easy to release.')),
  Q(R('Связать два одинаковых тонких конца, чтобы завязать мешок с парусом.', 'Join two equal thin cords to tie up a sail bag.'), 'reefknot', ['sheetbend', 'clove'], R('Для одинаковых тросов без нагрузки подходит [[reefknot|прямой узел]].', 'For equal ropes without heavy load a [[reefknot|reef knot]] works.'))
];
SA.SIMS.knots = {
  title: R('Тренажёр «Какой узел?»', 'Trainer: which knot?'),
  intro: R('Ситуация на борту — выберите узел. Цель: 8 верных ответов (ошибка отнимает один балл). Сами узлы отрабатываются руками на занятии.', 'A situation on board: pick the knot. Goal: 8 correct answers (a mistake costs one point). Tying the knots themselves is practised with real rope in class.'),
  mount(host, api) { SA.trainer(host, { key: 'sim.knots', items: ITEMS, goal: 8, api, label: 'which knot trainer' }); }
};
})();
