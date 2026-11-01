// Section 6 — Navigation and weather: modules 6.1–6.5.
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const ru = () => SA.lang === 'ru';
const T = (sec, rn, rd, en, ed) => ({ sec, ru: [rn, rd], en: [en, ed] });
SA.addTerms({
  latitude: T('nav', 'Широта', 'Угол к северу или югу от экватора. Одна минута широты — одна морская миля.', 'Latitude', 'Angle north or south of the equator. One minute of latitude is one nautical mile.'),
  longitude: T('nav', 'Долгота', 'Угол к востоку или западу от Гринвича. Расстояния по шкале долготы не измеряют.', 'Longitude', 'Angle east or west of Greenwich. Never measure distance on the longitude scale.'),
  datum: T('nav', 'Нуль глубин', 'Уровень, от которого на карте отсчитаны глубины, обычно наинизший теоретический уровень (LAT).', 'Chart datum', 'The level charted depths are measured from, usually Lowest Astronomical Tide.'),
  drying: T('nav', 'Осыхающая высота', 'Высота грунта над нулём глубин; на карте подчёркнута. Здесь на малой воде суша.', 'Drying height', 'Height of the seabed above chart datum, underlined on the chart. Dry at low water.'),
  ntm: T('nav', 'Извещения мореплавателям', 'Периодические поправки к картам и пособиям: новые опасности, изменения огней и буёв.', 'Notices to Mariners', 'Regular corrections to charts and publications: new dangers, changed lights and buoys.'),
  variation: T('nav', 'Магнитное склонение', 'Угол между истинным и магнитным меридианом. Указан на розе карты и меняется по годам.', 'Variation', 'The angle between true and magnetic north, shown on the chart rose; it changes yearly.'),
  deviation: T('nav', 'Девиация', 'Ошибка компаса от железа и электроники на борту. Зависит от курса, берётся из таблицы девиации.', 'Deviation', 'Compass error from the boat’s own iron and electronics. It varies with heading; read it from the deviation card.'),
  fix: T('nav', 'Обсервация', 'Место яхты по наблюдениям: пеленги, GPS, глубины. Отмечается кружком с временем.', 'Fix', 'A position from observations: bearings, GPS or depths. Marked with a circle and the time.'),
  dr: T('nav', 'Счислимое место', 'Место по курсу и пройденному расстоянию без учёта течения и дрейфа.', 'Dead reckoning (DR)', 'Position from course and distance run, without tide or leeway.'),
  ep: T('nav', 'Место с учётом течения и дрейфа', 'Счислимое место, исправленное на течение и ветровой дрейф.', 'Estimated position (EP)', 'DR corrected for tidal stream and leeway.'),
  leeway: T('nav', 'Дрейф', 'Боковой снос яхты ветром; на бейдевинде обычно 5–10°.', 'Leeway', 'Sideways drift from the wind; typically 5–10° close-hauled.'),
  transit: T('nav', 'Створ', 'Два ориентира на одной линии. Самая точная линия положения, без компаса.', 'Transit', 'Two marks in line. The most accurate position line, no compass needed.'),
  springs: T('nav', 'Сизигийный прилив', 'Прилив с наибольшей амплитудой, через 1–2 дня после новолуния и полнолуния.', 'Spring tides', 'Tides with the largest range, a day or two after new and full moon.'),
  neaps: T('nav', 'Квадратурный прилив', 'Прилив с наименьшей амплитудой, около первой и последней четверти луны.', 'Neap tides', 'Tides with the smallest range, around the moon’s quarters.'),
  twelfths: T('nav', 'Правило двенадцатых', 'За 6 часов прилива вода поднимается по часам на 1, 2, 3, 3, 2, 1 двенадцатую амплитуды.', 'Rule of twelfths', 'Over six hours the tide rises 1, 2, 3, 3, 2, 1 twelfths of its range per hour.'),
  range: T('nav', 'Амплитуда прилива', 'Разность высот полной и малой воды.', 'Tidal range', 'Difference between high and low water heights.'),
  isobar: T('nav', 'Изобара', 'Линия равного давления на синоптической карте. Чем гуще изобары, тем сильнее ветер.', 'Isobar', 'A line of equal pressure. The closer they are, the stronger the wind.'),
  front: T('nav', 'Атмосферный фронт', 'Граница тёплой и холодной воздушных масс. На фронте меняются ветер, давление и погода.', 'Front', 'The boundary between warm and cold air. Wind, pressure and weather change across it.'),
  veer: T('nav', 'Ветер заходит / отходит', 'Заходит (veer) — меняет направление по часовой стрелке; отходит (back) — против.', 'Veer and back', 'Veering: wind shifts clockwise; backing: anticlockwise.'),
  seabreeze: T('nav', 'Бриз', 'Дневной ветер с моря на сушу в солнечную погоду; ночью может смениться береговым.', 'Sea breeze', 'An afternoon onshore wind on sunny days; it may reverse to a land breeze at night.'),
  ais: T('nav', 'АИС', 'Автоматическая идентификационная система: суда передают имя, курс, скорость и место. Есть не у всех.', 'AIS', 'Automatic Identification System: vessels broadcast name, course, speed and position. Not everyone has it.'),
  cpa: T('nav', 'CPA / TCPA', 'Дистанция и время кратчайшего сближения с другим судном, рассчитанные плоттером или АИС.', 'CPA / TCPA', 'Closest point of approach and time to it, calculated by the plotter or AIS.'),
  cog: T('nav', 'Путевой угол и путевая скорость', 'COG и SOG — курс и скорость относительно грунта по GPS, с учётом течения и дрейфа.', 'COG and SOG', 'Course and speed over ground from GPS, including tide and leeway.'),
  xte: T('nav', 'Боковое отклонение (XTE)', 'Расстояние от линии пути между путевыми точками.', 'Cross-track error (XTE)', 'Distance off the track line between waypoints.')
});

function chartFig() {
  return `<svg viewBox="0 0 420 260" role="img" aria-label="${ru() ? 'Сетка морской карты' : 'Chart grid'}">
    <rect x="40" y="20" width="340" height="200" fill="color-mix(in srgb,var(--wind) 10%,var(--surface))" stroke="var(--ink)"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M40,${20 + i * 50} H380" stroke="var(--line)"/><path d="M${40 + i * 85},20 V220" stroke="var(--line)"/>`).join('')}
    ${Array.from({ length: 41 }, (_, i) => `<path d="M${i % 5 ? 34 : 28},${220 - i * 5} H40" stroke="var(--ink)" stroke-width="1"/>`).join('')}
    ${D.txt(22, 224, "0'", { fs: 11, a: 'end' })}${D.txt(22, 174, "10'", { fs: 11, a: 'end' })}${D.txt(22, 124, "20'", { fs: 11, a: 'end' })}
    <path d="M120,180 L300,80" stroke="var(--accent)" stroke-width="2.5"/><circle cx="120" cy="180" r="4" fill="var(--accent)"/><circle cx="300" cy="80" r="4" fill="var(--accent)"/>
    <path d="M50,140 L50,60" stroke="var(--accent)" stroke-width="5" opacity=".5"/>
    ${D.txt(210, 246, ru() ? 'расстояние — циркулем по шкале широт сбоку: 1′ = 1 миля' : 'measure distance with dividers on the side latitude scale: 1′ = 1 mile', { fs: 12, w: 500 })}
    ${D.txt(230, 112, ru() ? '≈ 20 миль' : '≈ 20 miles', { fs: 13, fill: 'var(--accent)' })}
  </svg>`;
}
function roseFig() {
  const r = 90, ticks = Array.from({ length: 36 }, (_, i) => { const [x1, y1] = D.polar(i * 10, r), [x2, y2] = D.polar(i * 10, r - (i % 9 ? 6 : 12)); return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}" stroke="var(--ink)"/>`; }).join('');
  const [mx, my] = D.polar(-6, r + 18), [tx, ty] = D.polar(0, r + 18);
  return `<svg viewBox="-210 -130 420 300" role="img" aria-label="${ru() ? 'Роза компаса со склонением' : 'Compass rose with variation'}">
    <circle r="${r}" fill="var(--surface)" stroke="var(--ink)"/>${ticks}
    <path d="M0,0 L${tx},${ty}" stroke="var(--ink)" stroke-width="2"/><path d="M0,0 L${mx.toFixed(1)},${my.toFixed(1)}" stroke="var(--accent)" stroke-width="2.5"/>
    ${D.txt(tx + 10, ty, ru() ? 'истинный N' : 'true N', { a: 'start', fs: 12 })}${D.txt(mx - 8, my, ru() ? 'магнитный N' : 'magnetic N', { a: 'end', fs: 12, fill: 'var(--accent)' })}
    ${D.txt(0, 40, ru() ? 'склонение 6°W (2026)' : 'variation 6°W (2026)', { fs: 13 })}
    ${D.txt(0, 122, ru() ? 'Истинный → магнитный → компасный: W прибавлять, E вычитать' : 'True → Magnetic → Compass: add West, subtract East', { fs: 13 })}
  </svg>`;
}
function fixFig() {
  return `<svg viewBox="0 0 420 240" role="img" aria-label="${ru() ? 'Обсервация по трём пеленгам' : 'Three-bearing fix'}">
    <path d="M0,40 Q80,20 140,50 T300,30 L420,20 V0 H0Z" fill="var(--warn)" opacity=".3"/>
    <path d="M60,46 v-14 l6,6 -6,6" fill="var(--ink)"/><rect x="200" y="34" width="8" height="12" fill="var(--ink)"/><path d="M340,26 l6,-12 l6,12z" fill="var(--ink)"/>
    <path d="M63,40 L255,210" stroke="var(--accent)" stroke-width="1.6"/><path d="M204,42 L214,220" stroke="var(--accent)" stroke-width="1.6"/><path d="M346,22 L175,215" stroke="var(--accent)" stroke-width="1.6"/>
    <path d="M208,170 L231,180 L219,190Z" fill="var(--bad)" opacity=".3"/>
    ${D.txt(412, 206, ru() ? '«треуголка»: место внутри,' : '“cocked hat”: you are inside;', { a: 'end', fs: 12, w: 500 })}${D.txt(412, 222, ru() ? 'берите угол ближе к опасности' : 'assume the corner nearest danger', { a: 'end', fs: 12, w: 500 })}
  </svg>`;
}
function twelfthsFig() {
  const h = [1, 2, 3, 3, 2, 1]; let acc = 0;
  return `<svg viewBox="0 0 420 220" role="img" aria-label="${ru() ? 'Правило двенадцатых' : 'Rule of twelfths'}">
    ${h.map((v, i) => { acc += v; const x = 50 + i * 56; return `<rect x="${x}" y="${190 - acc * 10}" width="44" height="${acc * 10}" fill="var(--wind)" opacity=".25"/><rect x="${x}" y="${190 - acc * 10}" width="44" height="${v * 10}" fill="var(--accent)" opacity=".8"/>${D.txt(x + 22, 184 - acc * 10 + v * 10 - 6 > 0 ? 204 : 204, (i + 1) + (ru() ? ' ч' : ' h'), { fs: 12 })}${D.txt(x + 22, 186 - acc * 10 - 4, v + '/12', { fs: 12 })}`; }).join('')}
    <path d="M40,190 H390" stroke="var(--ink)"/>${D.txt(46, 30, ru() ? 'вода поднимается быстрее всего в 3-й и 4-й час' : 'the tide rises fastest in the 3rd and 4th hours', { a: 'start', fs: 13 })}
  </svg>`;
}
function lowFig() {
  const rings = [40, 70, 100].map((r) => `<ellipse cx="160" cy="130" rx="${r * 1.3}" ry="${r}" fill="none" stroke="var(--muted)"/>`).join('');
  return `<svg viewBox="0 0 420 260" role="img" aria-label="${ru() ? 'Циклон в северном полушарии' : 'Low pressure, northern hemisphere'}">
    ${rings}${D.txt(160, 136, ru() ? 'Н' : 'L', { fs: 24, fill: 'var(--bad)' })}
    ${[[160, 45, 260], [290, 130, 340], [160, 215, 80], [30, 130, 170]].map(([x, y, a]) => { const [dx, dy] = D.polar(a, 34); return D.arrow(x, y, x + dx, y + dy, 'var(--wind)', 2.5); }).join('')}
    ${D.txt(330, 40, ru() ? 'Против часовой' : 'Anticlockwise', { fs: 13 })}${D.txt(330, 58, ru() ? 'и внутрь' : 'and inwards', { fs: 13 })}
    ${D.txt(330, 200, ru() ? 'Спиной к ветру —' : 'Back to the wind:', { fs: 12, w: 500 })}${D.txt(330, 216, ru() ? 'низкое давление слева' : 'low pressure on your left', { fs: 12, w: 500 })}
  </svg>`;
}

SA.MODULES['6.1'] = {
  title: R('Морские карты и пособия', 'Charts and publications'),
  lead: R('Как читать морскую карту: координаты, расстояния, глубины, знаки, и какие пособия нужны штурману.', 'How to read a chart: position, distance, depths and symbols, and which publications a navigator needs.'),
  goals: [R('снять и нанести координаты;', 'read and plot a position;'), R('измерить расстояние по шкале широт;', 'measure distance on the latitude scale;'), R('отличить глубину от осыхающей высоты;', 'tell depth from drying height;'), R('назвать пособия для перехода.', 'name the publications for a passage.')],
  cards: [
    { h: R('Координаты и расстояние', 'Position and distance'), fig: chartFig,
      body: R('<p>Место задают [[latitude|широтой]] и [[longitude|долготой]], например 59°52,4′N 029°41,0′E. Широту читают по боковой рамке карты, долготу — по верхней и нижней.</p><p>Морская миля (1852 м) — это одна минута широты, поэтому расстояние измеряют циркулем по боковой шкале широт, на той же высоте, где лежит отрезок. Шкала долгот для расстояний не годится.</p>', '<p>A position is given as [[latitude|latitude]] and [[longitude|longitude]], for example 50°47.2′N 001°18.5′W. Read latitude on the side borders and longitude on the top and bottom.</p><p>A nautical mile (1852 m) is one minute of latitude, so measure distance with dividers on the side latitude scale, level with your line. Never use the longitude scale for distance.</p>'),
      check: { q: R('По какой шкале измеряют расстояние?', 'Which scale do you measure distance on?'), o: [R('По боковой шкале широт', 'The side latitude scale'), R('По шкале долгот', 'The longitude scale'), R('По любой', 'Either')], a: 0, e: R('Минута долготы короче мили везде, кроме экватора.', 'A minute of longitude is shorter than a mile everywhere except the equator.') } },
    { h: R('Глубины и знаки', 'Depths and symbols'),
      body: R('<p>Глубины на карте отсчитаны от [[datum|нуля глубин]] — уровня, ниже которого вода опускается очень редко. Фактическая глубина равна глубине на карте плюс высота прилива. [[drying|Осыхающие высоты]] подчёркнуты: на малой воде там суша. Высоты маяков и мостов даны от уровня полной воды.</p><p>Условные знаки собраны в справочнике INT 1: камни, затонувшие суда, характер грунта, огни. Внизу карты — год издания и последняя корректура.</p>', '<p>Charted depths are measured from [[datum|chart datum]], a level the water seldom falls below. Actual depth equals charted depth plus height of tide. [[drying|Drying heights]] are underlined: that is land at low water. Heights of lights and bridges are above high water.</p><p>Symbols are explained in INT 1 (Chart 5011): rocks, wrecks, seabed type, lights. The edition date and last correction are in the margin.</p>') },
    { h: R('Пособия', 'Publications'),
      body: R('<p>Кроме карт штурману нужны: лоция района, таблицы приливов, списки огней, альманах или справочник по портам. Карты и пособия корректируют по [[ntm|извещениям мореплавателям]]. Электронная карта удобна, но бумажная — резерв на случай отказа электроники.</p>', '<p>Besides charts a navigator uses: a pilot book, tide tables, a list of lights, and an almanac. Charts and books are kept up to date with [[ntm|Notices to Mariners]]. Electronic charts are convenient, but paper is the backup when the electronics fail.</p>') }
  ],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('Снять координаты трёх объектов с учебной карты и нанести три точки.', 'Read three positions off the training chart and plot three more.'), R('Измерить расстояние маршрута циркулем.', 'Measure a route with dividers.')] }],
  quiz: [
    { q: R('Чему равна морская миля?', 'What is a nautical mile?'), o: [R('Одной минуте широты, 1852 м', 'One minute of latitude, 1852 m'), R('1000 м', '1000 m'), R('Одной минуте долготы', 'One minute of longitude')], a: 0, e: R('Поэтому расстояние меряют по шкале широт.', 'That is why you measure on the latitude scale.') },
    { q: R('Что означает подчёркнутая цифра на карте?', 'What does an underlined figure on a chart mean?'), o: [R('Осыхающая высота', 'A drying height'), R('Глубина', 'A depth'), R('Высота маяка', 'A light’s height')], a: 0, e: R('На малой воде там суша.', 'It dries at low water.') },
    { q: R('Фактическая глубина равна…', 'Actual depth equals…'), o: [R('глубине на карте плюс высота прилива', 'charted depth plus height of tide'), R('глубине на карте', 'charted depth'), R('высоте прилива', 'height of tide')], a: 0, e: R('Глубины на карте отсчитаны от нуля глубин.', 'Charted depths are from chart datum.') },
    { q: R('Где на карте читают широту?', 'Where do you read latitude?'), o: [R('На боковой рамке', 'On the side border'), R('На верхней рамке', 'On the top border'), R('На розе компаса', 'On the compass rose')], a: 0, e: R('Долготу — сверху и снизу.', 'Longitude is top and bottom.') },
    { q: R('Как обновляют карты?', 'How are charts kept up to date?'), o: [R('По извещениям мореплавателям', 'From Notices to Mariners'), R('Никак', 'They are not'), R('Раз в 50 лет', 'Every 50 years')], a: 0, e: R('Дата корректуры — в углу карты.', 'The correction date is in the margin.') },
    { q: R('Зачем бумажная карта, если есть плоттер?', 'Why carry paper charts with a plotter?'), o: [R('Резерв при отказе электроники', 'A backup if the electronics fail'), R('Для красоты', 'For decoration'), R('Не нужна', 'They are not needed')], a: 0, e: R('Электроника отказывает в самый неподходящий момент.', 'Electronics fail at the worst moment.') }
  ]
};

SA.MODULES['6.2'] = {
  title: R('Компас и прокладка', 'Compass and chartwork'),
  lead: R('Истинный, магнитный и компасный курс, обсервация по пеленгам и счисление: основа штурманского дела.', 'True, magnetic and compass courses, fixing by bearings and dead reckoning: the core of navigation.'),
  goals: [R('переводить курсы между истинным, магнитным и компасным;', 'convert between true, magnetic and compass;'), R('получить обсервацию по трём пеленгам;', 'fix your position from three bearings;'), R('вести счисление и решать задачи «скорость–время–расстояние»;', 'keep a DR plot and solve speed-time-distance;'), R('учесть течение и дрейф.', 'allow for tide and leeway.')],
  cards: [
    { h: R('Склонение и девиация', 'Variation and deviation'), fig: roseFig,
      body: R('<p>Карта ориентирована на истинный север, компас показывает на магнитный. Разница — [[variation|склонение]], оно указано на розе карты с годом и ежегодным изменением. Железо и электроника на яхте дают [[deviation|девиацию]], её берут из таблицы для текущего курса.</p><p>Перевод с карты на компас: истинный → магнитный → компасный. Западные поправки прибавляют, восточные вычитают. Обратно — наоборот. Пример: истинный 095°, склонение 4°W → магнитный 099°; девиация 2°E → компасный 097°.</p>', '<p>The chart is drawn to true north; the compass points to magnetic north. The difference is [[variation|variation]], shown on the chart rose with its year and annual change. Iron and electronics on board cause [[deviation|deviation]], read from the deviation card for your heading.</p><p>Chart to compass: True → Magnetic → Compass. Add West, subtract East (“Error West, compass best; error East, compass least”). Reverse it going back. Example: true 095°, variation 4°W → magnetic 099°; deviation 2°E → compass 097°.</p>'),
      check: { q: R('Истинный курс 200°, склонение 5°E. Магнитный курс?', 'True course 200°, variation 5°E. Magnetic?'), o: [R('195°', '195°'), R('205°', '205°'), R('200°', '200°')], a: 0, e: R('Восточное склонение вычитают.', 'Subtract East.') } },
    { h: R('Обсервация', 'Fixing your position'), fig: fixFig,
      body: R('<p>Ручным компасом берут пеленги на три приметных ориентира, разнесённых примерно на 60°, переводят в истинные и прокладывают линии от ориентиров. Линии образуют маленький треугольник — «треуголку»: место внутри, а для безопасности принимают угол ближе к опасности. Самая точная линия — [[transit|створ]]. Место отмечают кружком с временем и записывают в журнал: это [[fix|обсервация]].</p>', '<p>With a hand-bearing compass take bearings of three charted objects about 60° apart, convert them to true and plot the lines from the objects. They form a small triangle, the cocked hat: you are inside it, and for safety assume the corner nearest danger. The most accurate line is a [[transit|transit]]. Mark the [[fix|fix]] with a circle and time and log it.</p>') },
    { h: R('Счисление', 'Dead reckoning'),
      body: R('<p>Расстояние = скорость × время. Удобно считать по минутам: при скорости 6 узлов яхта проходит 1 милю за 10 минут. [[dr|Счислимое место]] получают, откладывая курс и пройденное расстояние от последней обсервации. Добавив снос течением и ветровой [[leeway|дрейф]], получают [[ep|место с учётом течения]]. Обсервацию делают регулярно, хотя бы раз в час.</p>', '<p>Distance = speed × time. Think in minutes: at 6 knots you cover a mile every 10 minutes. A [[dr|DR]] position comes from laying off course and distance run from the last fix. Add tidal stream and [[leeway|leeway]] to get an [[ep|estimated position]]. Fix regularly, at least hourly.</p>'),
      check: { q: R('Скорость 5 узлов, 36 минут. Сколько пройдено?', 'Speed 5 knots for 36 minutes. Distance?'), o: [R('3 мили', '3 miles'), R('5 миль', '5 miles'), R('1,8 мили', '1.8 miles')], a: 0, e: R('5 × 36 / 60 = 3.', '5 × 36 / 60 = 3.') } }
  ],
  sims: ['compass'],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('Взять три пеленга ручным компасом и нанести обсервацию.', 'Take three bearings with a hand-bearing compass and plot a fix.'), R('Вести счисление час и сравнить с GPS.', 'Keep a DR plot for an hour and compare it with GPS.')] }],
  quiz: [
    { q: R('Магнитный курс 090°, девиация 3°W. Компасный?', 'Magnetic 090°, deviation 3°W. Compass?'), o: [R('093°', '093°'), R('087°', '087°'), R('090°', '090°')], a: 0, e: R('К компасу западную поправку прибавляют.', 'Going to compass, add West.') },
    { q: R('Откуда берут склонение?', 'Where do you find variation?'), o: [R('С розы на карте', 'From the chart rose'), R('Из таблицы девиации', 'From the deviation card'), R('С GPS', 'From GPS')], a: 0, e: R('С поправкой на год.', 'Corrected for the year.') },
    { q: R('От чего зависит девиация?', 'What does deviation depend on?'), o: [R('От курса яхты', 'The boat’s heading'), R('От времени суток', 'Time of day'), R('От глубины', 'Depth')], a: 0, e: R('Поэтому есть таблица по курсам.', 'Hence the card by heading.') },
    { q: R('На каком угле разносить три пеленга?', 'How far apart should three bearings be?'), o: [R('Около 60°', 'About 60°'), R('5°', '5°'), R('180°', '180°')], a: 0, e: R('Острые углы дают большую ошибку.', 'Narrow angles give large errors.') },
    { q: R('Сколько пройдёт яхта за 20 минут при 6 узлах?', 'How far at 6 knots in 20 minutes?'), o: [R('2 мили', '2 miles'), R('6 миль', '6 miles'), R('1 миля', '1 mile')], a: 0, e: R('6 узлов — миля за 10 минут.', '6 knots is a mile every 10 minutes.') },
    { q: R('Чем EP отличается от DR?', 'How does an EP differ from DR?'), o: [R('Учтены течение и дрейф', 'It includes tide and leeway'), R('Это то же самое', 'They are the same'), R('Это GPS', 'It is GPS')], a: 0, e: R('DR — только курс и расстояние.', 'DR is course and distance only.') }
  ]
};

SA.MODULES['6.3'] = {
  title: R('Приливы и течения', 'Tides and currents'),
  lead: R('Почему вода поднимается и опускается, как посчитать глубину на нужное время и когда течение поможет, а когда помешает.', 'Why the water rises and falls, how to work out depth at a given time, and when the stream helps or hinders.'),
  goals: [R('объяснить сизигийные и квадратурные приливы;', 'explain spring and neap tides;'), R('посчитать высоту прилива по правилу двенадцатых;', 'work out height of tide by the rule of twelfths;'), R('рассчитать глубину и запас под килем;', 'calculate depth and under-keel clearance;'), R('учесть приливо-отливное течение в плане перехода.', 'use tidal streams in a passage plan.')],
  cards: [
    { h: R('Почему бывают приливы', 'Why tides happen'),
      body: R('<p>Приливы создают Луна и Солнце. Обычно два прилива в сутки, около 6 часов вода поднимается и около 6 опускается. Когда Луна и Солнце на одной линии (новолуние и полнолуние), [[range|амплитуда]] больше — [[springs|сизигийные приливы]]. В четверти луны амплитуда меньше — [[neaps|квадратурные]].</p><p>В Балтийском и Чёрном морях приливы почти незаметны, а в Белом море, на Дальнем Востоке, в Ла-Манше они достигают нескольких метров.</p>', '<p>Tides are caused by the Moon and Sun. Usually there are two a day: about six hours rising, six falling. When Moon and Sun line up (new and full moon), the [[range|range]] is largest: [[springs|springs]]. At the quarters it is smallest: [[neaps|neaps]].</p><p>Tides are tiny in the Baltic and Mediterranean but reach several metres in the English Channel and Brittany.</p>') },
    { h: R('Правило двенадцатых', 'The rule of twelfths'), fig: twelfthsFig,
      body: R('<p>Таблицы приливов дают время и высоту полной и малой воды. Промежуточную высоту оценивают по [[twelfths|правилу двенадцатых]]: за 1-й час вода поднимается на 1/12 амплитуды, за 2-й — на 2/12, за 3-й и 4-й — по 3/12, за 5-й — 2/12, за 6-й — 1/12.</p><p>Пример: малая вода 1,0 м в 06:00, полная 4,6 м, амплитуда 3,6 м (1/12 = 0,3 м). В 09:00 высота 1,0 + (1+2+3) × 0,3 = 2,8 м.</p>', '<p>Tide tables give times and heights of high and low water. Estimate heights in between with the [[twelfths|rule of twelfths]]: the water rises 1/12 of the range in the 1st hour, 2/12 in the 2nd, 3/12 in each of the 3rd and 4th, 2/12 in the 5th and 1/12 in the 6th.</p><p>Example: LW 1.0 m at 06:00, HW 4.6 m, range 3.6 m (1/12 = 0.3 m). At 09:00 the height is 1.0 + (1+2+3) × 0.3 = 2.8 m.</p>'),
      check: { q: R('Малая вода 0,5 м, амплитуда 2,4 м. Высота через 2 часа после малой воды?', 'LW 0.5 m, range 2.4 m. Height two hours after LW?'), o: [R('1,1 м', '1.1 m'), R('0,9 м', '0.9 m'), R('1,7 м', '1.7 m')], a: 0, e: R('1/12 = 0,2 м; (1+2) × 0,2 = 0,6; 0,5 + 0,6 = 1,1 м.', '1/12 = 0.2 m; (1+2) × 0.2 = 0.6; 0.5 + 0.6 = 1.1 m.') } },
    { h: R('Глубина и течения', 'Depth and streams'),
      body: R('<p>Глубина = глубина на карте + высота прилива. Нужно, чтобы она была не меньше осадки плюс запас под килем (обычно 0,5–1 м, на волне больше). Для осыхающих мест глубина = высота прилива − осыхающая высота.</p><p>Приливо-отливные течения показаны ромбами на карте и в атласе течений. Выходите так, чтобы течение было попутным. Ветер против течения поднимает крутую короткую волну: такие места и часы лучше обходить.</p>', '<p>Depth = charted depth + height of tide. It must be at least your draught plus under-keel clearance (usually 0.5–1 m, more in waves). Over a drying area, depth = height of tide − drying height.</p><p>Tidal streams are shown by diamonds on the chart and in tidal stream atlases. Time your departure for a fair tide. Wind against tide raises steep, short seas: avoid such places and hours.</p>') }
  ],
  sims: ['tides'],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('По таблице приливов рассчитать время, когда можно выйти через мелкий бар.', 'Use the tide table to work out when you can cross a shallow bar.'), R('Сравнить расчёт с эхолотом.', 'Compare your calculation with the echo sounder.')] }],
  quiz: [
    { q: R('Когда бывают сизигийные приливы?', 'When are spring tides?'), o: [R('Около новолуния и полнолуния', 'Around new and full moon'), R('Только весной', 'Only in spring'), R('В четверти луны', 'At the quarters')], a: 0, e: R('Название не связано с весной.', 'The name has nothing to do with the season.') },
    { q: R('За какой час вода поднимается быстрее всего?', 'In which hour does the tide rise fastest?'), o: [R('3-й и 4-й', '3rd and 4th'), R('1-й', '1st'), R('6-й', '6th')], a: 0, e: R('По 3/12 амплитуды.', '3/12 of the range each.') },
    { q: R('Глубина на карте 1,2 м, высота прилива 2,0 м. Глубина?', 'Charted depth 1.2 m, height of tide 2.0 m. Depth?'), o: [R('3,2 м', '3.2 m'), R('0,8 м', '0.8 m'), R('2,0 м', '2.0 m')], a: 0, e: R('Складываем.', 'Add them.') },
    { q: R('Осыхающая высота 1,0 м, высота прилива 3,0 м. Глубина?', 'Drying height 1.0 m, height of tide 3.0 m. Depth?'), o: [R('2,0 м', '2.0 m'), R('4,0 м', '4.0 m'), R('1,0 м', '1.0 m')], a: 0, e: R('Высота прилива минус осыхающая высота.', 'Height of tide minus drying height.') },
    { q: R('Что опасно при ветре против течения?', 'What is dangerous with wind against tide?'), o: [R('Крутая короткая волна', 'Steep, short seas'), R('Штиль', 'Calm'), R('Туман', 'Fog')], a: 0, e: R('Особенно у мысов и в проливах.', 'Especially off headlands and in straits.') },
    { q: R('Где на карте данные о течениях?', 'Where is tidal stream data on the chart?'), o: [R('В таблицах у ромбов', 'In tables linked to diamonds'), R('На розе', 'On the compass rose'), R('Нигде', 'Nowhere')], a: 0, e: R('Подробнее — в атласе течений.', 'More detail is in a tidal stream atlas.') }
  ]
};

SA.MODULES['6.4'] = {
  title: R('Метеорология и прогнозы', 'Meteorology and forecasts'),
  lead: R('Давление, фронты, бриз и туман: как понимать прогноз и замечать перемены погоды на воде.', 'Pressure, fronts, sea breezes and fog: how to read a forecast and notice weather changing on the water.'),
  goals: [R('читать синоптическую карту: циклоны, антициклоны, изобары;', 'read a synoptic chart: lows, highs and isobars;'), R('описать прохождение тёплого и холодного фронта;', 'describe warm and cold fronts passing;'), R('предсказать бриз и туман;', 'predict sea breezes and fog;'), R('найти и понять морской прогноз.', 'find and understand a marine forecast.')],
  extraTerms: ['wind'],
  cards: [
    { h: R('Давление и ветер', 'Pressure and wind'), fig: lowFig,
      body: R('<p>Воздух течёт из областей высокого давления в области низкого. В северном полушарии вокруг циклона (низкое давление) ветер дует против часовой стрелки и внутрь, вокруг антициклона — по часовой и наружу. Закон Бейс-Балло: встаньте спиной к ветру — низкое давление будет слева и немного впереди.</p><p>Чем гуще [[isobar|изобары]], тем сильнее ветер. Быстрое падение барометра — больше 3 гПа за 3 часа — признак усиления ветра; больше 6 гПа — вероятен шторм.</p>', '<p>Air flows from high to low pressure. In the northern hemisphere wind blows anticlockwise and inwards round a low, clockwise and outwards round a high. Buys Ballot’s law: stand with your back to the wind and low pressure is on your left, slightly ahead.</p><p>The closer the [[isobar|isobars]], the stronger the wind. A fast-falling barometer, over 3 hPa in 3 hours, warns of more wind; over 6 hPa, a gale is likely.</p>'),
      check: { q: R('Северное полушарие, вы стоите спиной к ветру. Где циклон?', 'Northern hemisphere, back to the wind. Where is the low?'), o: [R('Слева', 'On your left'), R('Справа', 'On your right'), R('Сзади', 'Behind you')], a: 0, e: R('Закон Бейс-Балло.', 'Buys Ballot’s law.') } },
    { h: R('Фронты', 'Fronts'),
      body: R('<p>Тёплый [[front|фронт]]: высокие перистые облака, затем слои всё ниже, давление падает, обложной дождь, видимость хуже; после фронта ветер [[veer|заходит]] (по часовой), теплеет. Холодный фронт: быстро, шквалы и ливни, резкий заход ветра, потом прояснение, холоднее и хорошая видимость, давление растёт. За холодным фронтом часто ветер с порывами.</p>', '<p>Warm [[front|front]]: high cirrus, then lowering layers, falling pressure, steady rain, worse visibility; afterwards the wind [[veer|veers]] (clockwise) and it gets warmer. Cold front: fast, squalls and heavy showers, a sharp veer, then clearing, colder with good visibility and rising pressure. Behind a cold front the wind is often gusty.</p>') },
    { h: R('Бриз, туман и прогнозы', 'Sea breeze, fog and forecasts'),
      body: R('<p>[[seabreeze|Бриз]]: в солнечный день суша нагревается, и после полудня ветер дует с моря на берег, иногда до 4–5 баллов, затем стихает к вечеру. Туман: адвективный — тёплый влажный воздух над холодной водой, держится и при ветре; радиационный — ночью над сушей, утром выносится в устья и тает к полудню.</p><p>Прогнозы: официальная метеослужба, прогнозы по УКВ от береговых станций, NAVTEX, приложения с моделями. Сравнивайте источники и смотрите на тренд давления.</p>', '<p>[[seabreeze|Sea breeze]]: on a sunny day the land heats up and in the afternoon the wind blows onshore, sometimes Force 4–5, dying in the evening. Fog: advection fog is warm moist air over cold sea and persists even in wind; radiation fog forms over land at night, drifts into estuaries in the morning and burns off by midday.</p><p>Forecasts: the national met service, coastguard VHF broadcasts, NAVTEX, model apps. Compare sources and watch the pressure trend.</p>') }
  ],
  sims: ['weather'],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('Записывать давление в журнал каждый час на переходе.', 'Log the barometer every hour on passage.'), R('Принять прогноз по УКВ и пересказать его экипажу.', 'Take down a VHF forecast and brief it to the crew.')] }],
  quiz: [
    { q: R('Что значат густые изобары?', 'What do closely spaced isobars mean?'), o: [R('Сильный ветер', 'Strong wind'), R('Штиль', 'Calm'), R('Туман', 'Fog')], a: 0, e: R('Большой перепад давления на малом расстоянии.', 'A big pressure difference over a short distance.') },
    { q: R('Барометр упал на 7 гПа за 3 часа. Это…', 'The barometer fell 7 hPa in 3 hours. That means…'), o: [R('вероятен шторм', 'a gale is likely'), R('будет штиль', 'calm is coming'), R('ничего', 'nothing')], a: 0, e: R('Быстрое падение — опасный признак.', 'A fast fall is a warning sign.') },
    { q: R('Что бывает после прохождения холодного фронта?', 'What follows a cold front?'), o: [R('Прояснение, порывистый ветер, холоднее', 'Clearing, gusty wind, colder'), R('Затяжной дождь', 'Long steady rain'), R('Туман', 'Fog')], a: 0, e: R('Видимость обычно отличная.', 'Visibility is usually excellent.') },
    { q: R('Когда обычно усиливается морской бриз?', 'When does a sea breeze usually build?'), o: [R('После полудня в солнечный день', 'In the afternoon on a sunny day'), R('Ночью', 'At night'), R('В пасмурную погоду', 'On overcast days')], a: 0, e: R('Суша прогревается сильнее моря.', 'The land heats faster than the sea.') },
    { q: R('Что значит «ветер заходит»?', 'What does “veering” mean?'), o: [R('Меняет направление по часовой стрелке', 'Shifts clockwise'), R('Против часовой', 'Shifts anticlockwise'), R('Усиливается', 'Strengthens')], a: 0, e: R('Против часовой — «отходит».', 'Anticlockwise is backing.') },
    { q: R('Какой туман держится и при ветре?', 'Which fog persists even in wind?'), o: [R('Адвективный', 'Advection fog'), R('Радиационный', 'Radiation fog'), R('Никакой', 'Neither')], a: 0, e: R('Его приносит тёплый воздух над холодной водой.', 'Warm air over cold sea keeps making it.') }
  ]
};

SA.MODULES['6.5'] = {
  title: R('Электронная навигация: GPS, картплоттер, AIS', 'Electronic navigation: GPS, plotter, AIS'),
  lead: R('Что умеет электроника на яхте, где она ошибается и как её проверять.', 'What the electronics on board can do, where they go wrong and how to cross-check them.'),
  goals: [R('пользоваться путевыми точками и маршрутом на плоттере;', 'use waypoints and routes on the plotter;'), R('отличать курс и скорость по компасу и лагу от COG и SOG;', 'tell heading and boat speed from COG and SOG;'), R('оценить опасность сближения по АИС;', 'judge collision risk with AIS;'), R('перепроверять электронику традиционными методами.', 'cross-check electronics by traditional methods.')],
  cards: [
    { h: R('GPS и картплоттер', 'GPS and plotter'),
      body: R('<p>GPS даёт место с точностью около 10 м, но сама карта может быть смещена, особенно у малых островов и старых съёмок. На мелком масштабе плоттер скрывает детали: камень может пропасть с экрана. Задайте безопасную глубину и проверьте маршрут, увеличив масштаб по всей длине.</p><p>Путевые точки ставят на чистой воде, а не на буях. [[xte|Боковое отклонение]] показывает, насколько вас снесло с линии пути.</p>', '<p>GPS gives a position to about 10 m, but the chart itself may be offset, especially near small islands and old surveys. At small scale the plotter hides detail: a rock may vanish from the screen. Set a safety depth and check the route zoomed in along its whole length.</p><p>Put waypoints in clear water, not on buoys. [[xte|Cross-track error]] shows how far you have been set off the track.</p>'),
      check: { q: R('Почему маршрут на плоттере проверяют при крупном масштабе?', 'Why check a plotter route zoomed in?'), o: [R('На мелком масштабе прячутся опасности', 'Small scale hides dangers'), R('Так красивее', 'It looks nicer'), R('Не нужно', 'There is no need')], a: 0, e: R('Камни и мели могут не отображаться.', 'Rocks and shoals may not show.') } },
    { h: R('Курс и путь', 'Heading and track'),
      body: R('<p>Компас показывает, куда смотрит нос, лаг — скорость относительно воды. GPS показывает [[cog|путевой угол и скорость]] относительно грунта. Разница между ними — это течение и дрейф. Сравнивая их, вы видите течение в реальном времени.</p>', '<p>The compass shows where the bow points, the log shows speed through the water. GPS shows [[cog|COG and SOG]] over the ground. The difference is tide and leeway. Comparing them shows you the stream in real time.</p>') },
    { h: R('АИС и проверка', 'AIS and cross-checking'),
      body: R('<p>[[ais|АИС]] показывает имя, курс и скорость крупных судов и рассчитывает [[cpa|CPA и TCPA]]. Но малые суда, рыбаки и многие яхты АИС не имеют, а передатчик класса B на яхте суда могут фильтровать. АИС не заменяет [[lookout|наблюдение]] и пеленг.</p><p>Электроника отказывает от воды и разряда аккумулятора. Записывайте место в журнал каждый час: с последней обсервацией вы продолжите путь по счислению.</p>', '<p>[[ais|AIS]] shows the name, course and speed of ships and calculates [[cpa|CPA and TCPA]]. But small craft, fishermen and many yachts have no AIS, and ships may filter Class B yacht targets. AIS does not replace a [[lookout|lookout]] and bearings.</p><p>Electronics fail from water and flat batteries. Log your position hourly: from the last fix you can carry on by DR.</p>') }
  ],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('Создать маршрут на плоттере и проверить его на бумажной карте.', 'Build a route on the plotter and check it on the paper chart.'), R('Сравнить курс по компасу с COG и оценить течение.', 'Compare compass heading with COG and estimate the stream.')] }],
  quiz: [
    { q: R('Что показывает SOG?', 'What does SOG show?'), o: [R('Скорость относительно грунта', 'Speed over the ground'), R('Скорость относительно воды', 'Speed through the water'), R('Скорость ветра', 'Wind speed')], a: 0, e: R('Её даёт GPS.', 'It comes from GPS.') },
    { q: R('Все ли суда видны на АИС?', 'Are all vessels visible on AIS?'), o: [R('Нет', 'No'), R('Да', 'Yes')], a: 0, e: R('Многие малые суда без АИС.', 'Many small craft have none.') },
    { q: R('Где ставить путевую точку?', 'Where do you put a waypoint?'), o: [R('На чистой воде рядом со знаком', 'In clear water near the mark'), R('Прямо на буе', 'Right on the buoy'), R('На берегу', 'On land')], a: 0, e: R('Иначе по автопилоту можно врезаться в буй.', 'Otherwise the autopilot may steer you into the buoy.') },
    { q: R('Разница между курсом по компасу и COG показывает…', 'The difference between heading and COG shows…'), o: [R('течение и дрейф', 'tide and leeway'), R('девиацию', 'deviation'), R('ничего', 'nothing')], a: 0, e: R('Это снос в реальном времени.', 'It is your set in real time.') },
    { q: R('Что такое CPA?', 'What is CPA?'), o: [R('Кратчайшая дистанция сближения', 'Closest point of approach'), R('Скорость судна', 'Ship speed'), R('Позывной', 'Call sign')], a: 0, e: R('TCPA — время до неё.', 'TCPA is the time to it.') },
    { q: R('Зачем записывать место в журнал при работающем GPS?', 'Why log your position when GPS works?'), o: [R('Чтобы продолжить по счислению при отказе', 'To carry on by DR if it fails'), R('Не нужно', 'There is no need'), R('Для отчёта в марину', 'For the marina')], a: 0, e: R('Электроника может отказать в любой момент.', 'Electronics can fail at any time.') }
  ]
};
})();
