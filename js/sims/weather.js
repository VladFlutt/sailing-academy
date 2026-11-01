// Simulator: reading the weather — scenarios on pressure, fronts, breezes and fog (module 6.4).
(() => {
'use strict';
const SA = window.SA;
const R = (ru, en) => ({ ru, en });
const Q = (q, o, e) => ({ q, o, a: 0, e });
const ITEMS = [
  Q(R('Утром 1018 гПа, к полудню 1011 гПа. Что ожидать?', 'Morning 1018 hPa, by noon 1011 hPa. What should you expect?'), [R('Усиление ветра, возможно до штормового', 'Rising wind, possibly a gale'), R('Штиль и солнце', 'Calm and sun'), R('Ничего особенного', 'Nothing unusual')], R('7 гПа примерно за 3–4 часа — быстрое падение. Берите рифы и ищите укрытие.', '7 hPa in about 3–4 hours is a fast fall. Reef and look for shelter.')),
  Q(R('Высокие перистые облака, затем слоистые всё ниже, давление медленно падает. Что приближается?', 'High cirrus, then lowering layer cloud, pressure falling slowly. What is coming?'), [R('Тёплый фронт', 'A warm front'), R('Холодный фронт', 'A cold front'), R('Антициклон', 'A high')], R('Затем обложной дождь и ухудшение видимости.', 'Then steady rain and poor visibility.')),
  Q(R('Чёрная туча с валом на горизонте, давление резко подскочило, ветер зашёл на 60°. Что это было?', 'A dark roll cloud, a sharp pressure jump and a 60° veer. What passed?'), [R('Холодный фронт', 'A cold front'), R('Тёплый фронт', 'A warm front'), R('Морской бриз', 'A sea breeze')], R('Холодный фронт проходит быстро, со шквалами, затем проясняется.', 'A cold front passes fast with squalls, then clears.')),
  Q(R('Ясное утро, слабый ветер с берега. Что будет днём у побережья?', 'Clear morning, light offshore wind. What happens on the coast in the afternoon?'), [R('Задует бриз с моря', 'A sea breeze sets in'), R('Шторм', 'A gale'), R('Туман', 'Fog')], R('Суша прогревается, и ветер разворачивается с моря на берег.', 'The land heats up and the wind turns onshore.')),
  Q(R('Тёплый влажный ветер дует на холодную воду. Чего опасаться?', 'Warm moist air blows over cold water. What is the risk?'), [R('Адвективного тумана', 'Advection fog'), R('Града', 'Hail'), R('Штиля', 'Calm')], R('Такой туман держится и при ветре.', 'This fog persists even in wind.')),
  Q(R('Вы стоите спиной к ветру. Ветер дует с юго-запада. Где центр циклона?', 'Your back is to a south-westerly wind. Where is the low?'), [R('К северо-западу от вас', 'To the north-west'), R('К юго-востоку', 'To the south-east'), R('Прямо за спиной', 'Right behind you')], R('Низкое давление слева и чуть впереди.', 'Low pressure is on your left, slightly ahead.')),
  Q(R('Барашки повсюду, брызги, ветер около 19 узлов. Сколько баллов?', 'White horses everywhere, spray, wind about 19 knots. What force?'), [R('5 баллов', 'Force 5'), R('2 балла', 'Force 2'), R('8 баллов', 'Force 8')], R('5 баллов (17–21 уз). Пора брать риф.', 'Force 5 (17–21 kn). Time to reef.')),
  Q(R('Пена ложится полосами по ветру, 30 узлов. Сколько баллов?', 'Foam blows in streaks, 30 knots. What force?'), [R('7 баллов', 'Force 7'), R('4 балла', 'Force 4'), R('11 баллов', 'Force 11')], R('7 баллов (28–33 уз), выше предела учебных выходов.', 'Force 7 (28–33 kn), beyond training limits.')),
  Q(R('Изобары на карте сгущаются над вашим районом к вечеру. Вывод?', 'Isobars bunch up over your area by evening. Conclusion?'), [R('Ветер усилится', 'The wind will increase'), R('Ветер стихнет', 'The wind will drop'), R('Будет туман', 'Fog')], R('Густые изобары — сильный ветер.', 'Close isobars mean strong wind.')),
  Q(R('Ночью ясно и тихо, утром в устье реки туман. Когда он, скорее всего, рассеется?', 'A clear calm night, fog in the estuary in the morning. When will it likely clear?'), [R('К полудню, когда прогреется', 'By midday as it warms up'), R('Только через неделю', 'Not for a week'), R('Сразу на рассвете', 'At dawn')], R('Это радиационный туман: солнце его растапливает.', 'It is radiation fog: the sun burns it off.')),
  Q(R('По прогнозу «ветер отходит». Что это значит?', 'The forecast says the wind will back. What does it mean?'), [R('Сменит направление против часовой стрелки', 'It shifts anticlockwise'), R('По часовой стрелке', 'Clockwise'), R('Стихнет', 'It drops')], R('По часовой — «заходит».', 'Clockwise is veering.'))
];
SA.SIMS.weather = {
  title: R('Читаем погоду', 'Reading the weather'),
  intro: R('Ситуации, которые вы увидите на воде и в прогнозе. Цель: 8 верных ответов. Под рукой — шкала Бофорта в разделе «Справочник».', 'Situations you will meet on the water and in forecasts. Goal: 8 correct. The Beaufort scale is in the Reference section.'),
  mount(host, api) { SA.trainer(host, { key: 'sim.weather', items: ITEMS, goal: 8, api, label: 'weather trainer' }); }
};
})();
