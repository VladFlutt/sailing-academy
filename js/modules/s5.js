// Section 5 — Rules of the road: modules 5.1–5.4. Module 5.4 follows the language track: RU → GIMS, EN → IYT.
(() => {
'use strict';
const SA = window.SA, D = SA.draw;
const R = (ru, en) => ({ ru, en });
const ru = () => SA.lang === 'ru';
const T = (sec, rn, rd, en, ed) => ({ sec, ru: [rn, rd], en: [en, ed] });
SA.addTerms({
  safespeed: T('rules', 'Безопасная скорость', 'Скорость, при которой можно вовремя предпринять действие и остановиться на нужном расстоянии (правило 6).', 'Safe speed', 'A speed at which you can act in time and stop within a suitable distance (Rule 6).'),
  narrowch: T('rules', 'Узкий проход', 'Фарватер, где крупные суда могут идти только по оси. Малые суда держатся правой кромки и не мешают им (правило 9).', 'Narrow channel', 'A channel where large ships can only follow the fairway. Small craft keep to the starboard side and do not impede them (Rule 9).'),
  dayshape: T('rules', 'Знак (днём)', 'Чёрные фигуры — шар, конус, ромб, цилиндр, — которые днём заменяют огни.', 'Day shape', 'Black shapes (ball, cone, diamond, cylinder) used by day in place of lights.'),
  soundsig: T('rules', 'Звуковые сигналы', 'Короткий (1 с) и продолжительный (4–6 с) звук. Один короткий — «изменяю курс вправо», два — «влево», три — «работаю назад».', 'Sound signals', 'Short (1 s) and prolonged (4–6 s) blasts. One short: altering to starboard; two: to port; three: going astern.'),
  wreckbuoy: T('nav', 'Знак новой опасности', 'Буй с синими и жёлтыми полосами над недавно затонувшим судном, пока его нет на картах.', 'Emergency wreck marking buoy', 'A blue and yellow striped buoy over a new wreck until charts are updated.'),
  gims: T('rules', 'ГИМС', 'Государственная инспекция по маломерным судам МЧС России: регистрирует маломерные суда и выдаёт удостоверения на право управления ими.', 'GIMS', 'Russia’s State Inspectorate for Small Craft: registers small craft and issues helmsman licences.'),
  ppvvp: T('rules', 'ППВВП', 'Правила плавания по внутренним водным путям РФ. На реках и водохранилищах действуют вместо МППСС.', 'Inland waterway rules (Russia)', 'Russian inland waterway navigation rules, used instead of COLREGs on rivers and reservoirs.'),
  icc: T('rules', 'ICC', 'Международный сертификат компетентности для прогулочных судов по резолюции ЕЭК ООН № 40. Часто нужен для чартера в Европе.', 'ICC', 'International Certificate of Competence under UN ECE Resolution 40; often required to charter in Europe.'),
  iyt: T('rules', 'IYT', 'International Yacht Training Worldwide — международная организация, выдающая сертификаты яхтсменов.', 'IYT', 'International Yacht Training Worldwide, an international body issuing sailing certificates.')
});

function ladderFig() {
  const rows = ru()
    ? ['Лишённое возможности управляться', 'Ограниченное в маневрировании', 'Стеснённое осадкой', 'Занятое ловом рыбы', 'Парусное', 'Моторное']
    : ['Not under command', 'Restricted in ability to manoeuvre', 'Constrained by draught', 'Engaged in fishing', 'Sailing', 'Power-driven'];
  return `<svg viewBox="0 0 420 270" role="img" aria-label="${ru() ? 'Иерархия судов по правилу 18' : 'Rule 18 hierarchy'}">
    ${rows.map((r, i) => `<rect x="${30 + i * 14}" y="${18 + i * 40}" width="${300 - i * 28}" height="32" rx="6" fill="${i === 4 ? 'color-mix(in srgb,var(--accent) 22%,var(--surface))' : 'var(--surface)'}" stroke="var(--line)"/>${D.txt(180, 39 + i * 40, r, { fs: 13 })}`).join('')}
    ${D.arrow(380, 250, 380, 26, 'var(--accent)', 2.5)}${D.txt(392, 140, ru() ? 'ему уступают' : 'others keep clear', { fs: 12, fill: 'var(--muted)' }).replace('<text', '<text transform="rotate(-90 392 140)"')}
  </svg>`;
}
function overtakeFig() {
  const r = 120, [x1, y1] = D.polar(112.5, r), [x2, y2] = D.polar(247.5, r);
  return `<svg viewBox="-200 -110 400 250" role="img" aria-label="${ru() ? 'Сектор обгона' : 'Overtaking sector'}">
    <path d="M0,0 L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}Z" fill="var(--warn)" opacity=".15" stroke="var(--warn)"/>
    ${D.boat(0, 0, 0, { s: 1, nosail: true, edge: false })}${D.ship(0, 112, 0, { s: .5 })}
    ${D.txt(0, -80, ru() ? 'пересечение или встречный курс' : 'crossing or head-on', { fs: 13, fill: 'var(--muted)' })}
    ${D.txt(122, 86, '22,5°', { fs: 13 })}${D.txt(-122, 86, '22,5°', { fs: 13 })}
    ${D.txt(0, 134, ru() ? 'отсюда — обгон: виден только кормовой огонь' : 'from here it is overtaking: only the sternlight shows', { fs: 12, fill: 'var(--warn)' })}
  </svg>`;
}
function arcsFig() {
  const r = 110, sec = (a1, a2, c) => { const [x1, y1] = D.polar(a1, r), [x2, y2] = D.polar(a2, r); return `<path d="M0,0 L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}Z" fill="${c}" opacity=".28" stroke="${c}"/>`; };
  return `<svg viewBox="-210 -130 420 260" role="img" aria-label="${ru() ? 'Секторы ходовых огней' : 'Navigation light arcs'}">
    ${sec(-112.5, 0, D.LC.red)}${sec(0, 112.5, D.LC.green)}${sec(112.5, 247.5, '#9AA4AE')}
    ${D.boat(0, 0, 0, { s: 1, nosail: true, edge: false })}
    ${D.txt(-80, -60, ru() ? 'левый 112,5°' : 'port 112.5°', { fs: 13, fill: 'var(--port)' })}${D.txt(80, -60, ru() ? 'правый 112,5°' : 'starboard 112.5°', { fs: 13, fill: 'var(--stbd)' })}
    ${D.txt(0, 98, ru() ? 'кормовой 135°' : 'sternlight 135°', { fs: 13 })}${D.txt(0, -116, ru() ? 'топовый белый: 225° вперёд' : 'masthead white: 225° forward', { fs: 13, fill: 'var(--muted)' })}
  </svg>`;
}
function cardinalFig() {
  return `<svg viewBox="-210 -170 420 340" role="img" aria-label="${ru() ? 'Кардинальные знаки вокруг опасности' : 'Cardinal marks around a danger'}">
    <circle r="34" fill="var(--warn)" opacity=".25" stroke="var(--warn)" stroke-dasharray="4 4"/>${D.txt(0, 5, ru() ? 'опасность' : 'danger', { fs: 13 })}
    ${D.buoy(0, -100, 'north', .5)}${D.buoy(0, 118, 'south', .5)}${D.buoy(140, 10, 'east', .5)}${D.buoy(-140, 10, 'west', .5)}
    ${D.txt(0, -156, ru() ? 'N · проходить севернее' : 'N · pass north', { fs: 12 })}${D.txt(0, 162, ru() ? 'S · проходить южнее' : 'S · pass south', { fs: 12 })}
    ${D.txt(170, 54, 'E', { fs: 14 })}${D.txt(-170, 54, 'W', { fs: 14 })}
  </svg>`;
}
const soundsTable = () => `<table class="tbl"><thead><tr><th>${ru() ? 'Сигнал' : 'Signal'}</th><th>${ru() ? 'Значение' : 'Meaning'}</th></tr></thead><tbody>
  <tr><td class="kbd">•</td><td>${ru() ? 'Изменяю курс вправо' : 'I am altering course to starboard'}</td></tr>
  <tr><td class="kbd">• •</td><td>${ru() ? 'Изменяю курс влево' : 'I am altering course to port'}</td></tr>
  <tr><td class="kbd">• • •</td><td>${ru() ? 'Мои движители работают на задний ход' : 'I am operating astern propulsion'}</td></tr>
  <tr><td class="kbd">• • • • •</td><td>${ru() ? 'Не понимаю ваших намерений, сомневаюсь' : 'I do not understand your intentions / doubt'}</td></tr>
  <tr><td class="kbd">—</td><td>${ru() ? 'Туман: моторное судно на ходу, каждые 2 минуты' : 'Fog: power vessel making way, every 2 minutes'}</td></tr>
  <tr><td class="kbd">— • •</td><td>${ru() ? 'Туман: парусное, рыболовное, ограниченное, НУК и др.' : 'Fog: sailing, fishing, restricted, NUC and others'}</td></tr></tbody></table>`;
const shapesTable = () => `<table class="tbl"><thead><tr><th>${ru() ? 'Знак' : 'Shape'}</th><th>${ru() ? 'Значение' : 'Meaning'}</th></tr></thead><tbody>
  <tr><td>●</td><td>${ru() ? 'На якоре' : 'At anchor'}</td></tr>
  <tr><td>▼</td><td>${ru() ? 'Яхта идёт под парусом и мотором одновременно' : 'Motor-sailing'}</td></tr>
  <tr><td>● ●</td><td>${ru() ? 'Лишено возможности управляться' : 'Not under command'}</td></tr>
  <tr><td>● ◆ ●</td><td>${ru() ? 'Ограничено в возможности маневрировать' : 'Restricted in ability to manoeuvre'}</td></tr>
  <tr><td>▮</td><td>${ru() ? 'Стеснено осадкой (цилиндр)' : 'Constrained by draught (cylinder)'}</td></tr>
  <tr><td>▼▲</td><td>${ru() ? 'Лов рыбы (два конуса вершинами вместе)' : 'Fishing (two cones points together)'}</td></tr>
  <tr><td>◆</td><td>${ru() ? 'Буксировка длиной более 200 м' : 'Tow longer than 200 m'}</td></tr></tbody></table>`;

SA.MODULES['5.1'] = {
  title: R('МППСС: правила расхождения', 'COLREGs: steering and sailing rules'),
  lead: R('Кто кому уступает, как определить риск столкновения и как действовать, чтобы вас поняли.', 'Who gives way to whom, how to judge the risk of collision and how to act so others understand you.'),
  hook: { q: R('Две яхты сближаются. Ветер сверху. Кто должен уступить?', 'Two yachts converge. The wind is from the top. Who gives way?'), o: [R('Яхта A', 'Yacht A'), R('Яхта B', 'Yacht B'), R('Обе отворачивают вправо', 'Both turn to starboard')], a: 0,
    ok: R('Верно. A идёт левым галсом (ветер в левый борт) и уступает яхте правого галса.', 'Right. A is on port tack (wind on its port side) and gives way to starboard tack.'),
    no: R('Нет. Посмотрите, в какой борт дует ветер: у A — в левый. Левый галс уступает.', 'No. Look which side the wind is on: for A it is port. Port tack gives way.'),
    fig: () => `<svg viewBox="-160 -110 320 230" role="img">${D.windArrows([-120, 120], -106, 26)}${D.boat(-70, 40, 50, { s: 1 })}${D.boat(80, 40, 310, { s: 1 })}${D.txt(-70, 100, 'A', { fs: 20 })}${D.txt(80, 100, 'B', { fs: 20 })}</svg>` },
  goals: [R('вести наблюдение и выбирать безопасную скорость;', 'keep a lookout and choose a safe speed;'), R('определять риск столкновения по пеленгу;', 'judge the risk of collision from the bearing;'), R('применять правила для парусных судов, обгона, встречных и пересекающихся курсов;', 'apply the rules for sailing vessels, overtaking, head-on and crossing;'), R('знать, кому уступает яхта по правилу 18.', 'know whom a yacht gives way to under Rule 18.')],
  extraTerms: ['standon', 'giveway'],
  cards: [
    { h: R('Наблюдение, скорость, риск', 'Lookout, speed, risk'),
      body: R('<p>[[colregs|МППСС-72]] начинаются не с того, кто прав, а с обязанностей всех: постоянное [[lookout|наблюдение]] зрением и слухом, в том числе за генуей (правило 5); [[safespeed|безопасная скорость]] (правило 6).</p><p>Риск столкновения есть, если [[cbdr|пеленг]] на другое судно не меняется, а расстояние сокращается (правило 7). Возьмите пеленг компасом или заметьте судно на фоне стойки леера: если оно стоит на месте, пора действовать.</p>', '<p>The [[colregs|COLREGs]] start not with who has right of way but with everyone’s duties: a constant [[lookout|lookout]] by sight and hearing, including behind the genoa (Rule 5), and a [[safespeed|safe speed]] (Rule 6).</p><p>There is a risk of collision if the [[cbdr|bearing]] of another vessel stays steady while the range closes (Rule 7). Take a compass bearing or line the ship up with a stanchion: if it does not move, act.</p>'),
      check: { q: R('Пеленг на судно не меняется, расстояние сокращается. Что это значит?', 'The bearing is steady and the range is closing. What does it mean?'), o: [R('Есть риск столкновения', 'Risk of collision'), R('Оно уходит', 'It is moving away'), R('Ничего', 'Nothing')], a: 0, e: R('Постоянный пеленг — главный признак курса на столкновение.', 'A steady bearing is the classic collision course.') } },
    { h: R('Парусные суда: правило 12', 'Sailing vessels: Rule 12'),
      body: R('<p>Две парусные яхты: если галсы разные, [[giveway|уступает]] яхта левого галса. Если галс один, уступает [[windward|наветренная]]. Если вы на левом галсе и не можете понять, каким галсом идёт яхта на ветре, уступайте.</p><p>Галс определяют по стороне, на которой стоит грот: правый галс — грот слева, ветер в правый борт.</p>', '<p>Two sailing yachts: on opposite tacks, the port-tack boat [[giveway|gives way]]. On the same tack, the [[windward|windward]] boat gives way. If you are on port tack and cannot tell the tack of a boat to windward, keep clear.</p><p>The tack is the side the wind comes over: starboard tack means the main is out to port.</p>') },
    { h: R('Обгон, встречные, пересекающиеся', 'Overtaking, head-on, crossing'), fig: overtakeFig,
      body: R('<p>[[overtaking|Обгоняющий]] уступает всегда, будь то яхта или катер (правило 13). Обгон — это подход с направления более 22,5° позади траверза.</p><p>Моторные суда (и яхта под мотором): [[headon|на встречных курсах]] оба отворачивают вправо (правило 14); [[crossing|при пересечении]] уступает тот, у кого другое судно справа (правило 15).</p><p>Уступающий действует заранее и решительно, лучше вправо и с прохождением за кормой (правила 8 и 16). [[standon|Привилегированный]] сохраняет курс и скорость, но обязан действовать, если уступающий явно не справляется (правило 17).</p>', '<p>The [[overtaking|overtaking]] vessel always keeps clear, yacht or motorboat (Rule 13). Overtaking means approaching from more than 22.5° abaft the beam.</p><p>Power vessels (including a yacht under engine): [[headon|head-on]], both turn to starboard (Rule 14); [[crossing|crossing]], the one with the other on its starboard side gives way (Rule 15).</p><p>The give-way vessel acts early and substantially, preferably to starboard and passing astern (Rules 8 and 16). The [[standon|stand-on]] vessel holds course and speed but must act if the give-way vessel clearly is not (Rule 17).</p>') },
    { h: R('Иерархия, фарватеры, СРД', 'Hierarchy, channels and TSS'), fig: ladderFig,
      body: R('<p>Правило 18: парусная яхта уступает судам [[nuc|лишённым возможности управляться]], [[ram|ограниченным в маневрировании]], [[fishing|занятым ловом рыбы]] и не мешает [[cbd|стеснённым осадкой]]. Моторное уступает парусному.</p><p>В [[narrowch|узком проходе]] яхта до 20 м держится правой кромки и не мешает судам, идущим по фарватеру (правило 9). [[tss|Систему разделения движения]] пересекают под прямым углом, как можно быстрее (правило 10).</p>', '<p>Rule 18: a sailing yacht keeps clear of vessels [[nuc|not under command]], [[ram|restricted in ability to manoeuvre]] and [[fishing|engaged in fishing]], and does not impede one [[cbd|constrained by draught]]. Power gives way to sail.</p><p>In a [[narrowch|narrow channel]] a yacht under 20 m keeps to the starboard side and must not impede vessels using the fairway (Rule 9). Cross a [[tss|traffic separation scheme]] at right angles and as quickly as possible (Rule 10).</p>'),
      check: { q: R('Яхта под парусом и судно, занятое тралением. Кто уступает?', 'A yacht under sail meets a vessel trawling. Who gives way?'), o: [R('Яхта', 'The yacht'), R('Траулер', 'The trawler')], a: 0, e: R('Рыболовное судно выше в иерархии правила 18.', 'The fishing vessel ranks higher under Rule 18.') } }
  ],
  sims: ['colregs'],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('Брать пеленг ручным компасом на проходящие суда и следить, меняется ли он.', 'Take hand-bearing compass bearings on passing ships and watch whether they change.'), R('Вслух называть галс встречных яхт и кто уступает.', 'Call out the tack of approaching yachts and who gives way.'), R('Проходя за кормой у судна, менять курс заметно, а не по градусу.', 'When passing astern, alter course boldly, not by a degree at a time.')] }],
  quiz: [
    { q: R('Две яхты на разных галсах. Кто уступает?', 'Two yachts on opposite tacks. Who gives way?'), o: [R('Левого галса', 'The port-tack yacht'), R('Правого галса', 'The starboard-tack yacht'), R('Та, что меньше', 'The smaller one')], a: 0, e: R('Правило 12(a)(i).', 'Rule 12(a)(i).') },
    { q: R('Яхта под парусом догоняет катер. Кто уступает?', 'A sailing yacht is overtaking a motorboat. Who gives way?'), o: [R('Яхта', 'The yacht'), R('Катер', 'The motorboat')], a: 0, e: R('Обгоняющий уступает всегда (правило 13).', 'The overtaking vessel always keeps clear (Rule 13).') },
    { q: R('Два моторных судна идут прямо навстречу. Что делают?', 'Two power vessels meet head-on. What do they do?'), o: [R('Оба отворачивают вправо', 'Both turn to starboard'), R('Оба влево', 'Both turn to port'), R('Меньшее останавливается', 'The smaller one stops')], a: 0, e: R('Правило 14.', 'Rule 14.') },
    { q: R('Вы под мотором, судно справа на пересекающемся курсе. Ваши действия?', 'You are motoring, a vessel on your starboard side is crossing. What do you do?'), o: [R('Уступаю: вправо и за корму', 'Give way: turn to starboard and pass astern'), R('Сохраняю курс', 'Hold course'), R('Отворачиваю влево', 'Turn to port')], a: 0, e: R('Правило 15: «справа — уступи».', 'Rule 15: vessel to starboard has priority.') },
    { q: R('Как пересекать систему разделения движения?', 'How do you cross a traffic separation scheme?'), o: [R('Под прямым углом и быстро', 'At right angles and quickly'), R('По диагонали', 'Diagonally'), R('Вдоль полосы', 'Along the lane')], a: 0, e: R('Правило 10.', 'Rule 10.') },
    { q: R('Что должен делать привилегированный?', 'What must the stand-on vessel do?'), o: [R('Сохранять курс и скорость, но быть готовым действовать', 'Hold course and speed but be ready to act'), R('Ничего', 'Nothing'), R('Ускориться', 'Speed up')], a: 0, e: R('Правило 17.', 'Rule 17.') },
    { q: R('С какого угла позади траверза начинается обгон?', 'From what angle abaft the beam is it overtaking?'), o: [R('Более 22,5°', 'More than 22.5°'), R('Более 45°', 'More than 45°'), R('Любой', 'Any')], a: 0, e: R('Из этого сектора виден только кормовой огонь.', 'From there only the sternlight is visible.') }
  ]
};

SA.MODULES['5.2'] = {
  title: R('Огни, знаки и звуковые сигналы', 'Lights, shapes and sound signals'),
  lead: R('Ночью и в тумане суда «разговаривают» огнями и звуками. Научимся их читать и правильно нести свои огни.', 'At night and in fog vessels speak through lights and sounds. Learn to read them and show your own correctly.'),
  goals: [R('назвать сектора ходовых огней;', 'name the arcs of the navigation lights;'), R('показать, какие огни несёт яхта под парусом и под мотором;', 'show which lights a yacht carries under sail and under power;'), R('опознать судно по огням и дневным знакам;', 'identify a vessel by its lights and day shapes;'), R('подать и понять основные звуковые сигналы.', 'give and understand the main sound signals.')],
  cards: [
    { h: R('Секторы огней', 'Light arcs'), fig: arcsFig,
      body: R('<p>[[sidelights|Бортовые огни]]: красный слева и зелёный справа, каждый на 112,5° от носа до 22,5° позади траверза. [[sternlight|Кормовой]] белый — 135° назад. [[masthead|Топовый]] белый — 225° вперёд. Огни включают от заката до восхода и в ограниченную видимость.</p>', '<p>[[sidelights|Sidelights]]: red to port and green to starboard, each 112.5° from ahead to 22.5° abaft the beam. The white [[sternlight|sternlight]] covers 135° aft. The white [[masthead|masthead light]] covers 225° forward. Show them from sunset to sunrise and in restricted visibility.</p>') },
    { h: R('Огни яхты', 'A yacht’s lights'),
      body: R('<p>Под парусом: бортовые и кормовой. Яхта до 20 м может вместо них нести один [[tricolour|трёхцветный огонь]] на топе мачты — он лучше виден в волнах. Под мотором (даже с поднятыми парусами) яхта — моторное судно: бортовые, кормовой и топовый белый на мачте, трёхцветный при этом выключают. На якоре — белый [[anchorlight|якорный]] огонь кругового освещения.</p><p>Днём под парусом и мотором одновременно поднимают [[steamingcone|конус]] вершиной вниз.</p>', '<p>Under sail: sidelights and sternlight. A yacht under 20 m may instead show one [[tricolour|tricolour]] at the masthead, which is easier to see in waves. Under engine (even with sails up) the yacht is a power vessel: sidelights, sternlight and a white steaming light; the tricolour is switched off. At anchor: an all-round white [[anchorlight|anchor light]].</p><p>By day, when motor-sailing, hoist a [[steamingcone|cone]] point down.</p>'),
      check: { q: R('Яхта идёт под парусами и с включённым двигателем. Какие огни ночью?', 'A yacht is sailing with the engine running. Which lights at night?'), o: [R('Как моторное судно: бортовые, кормовой и топовый', 'As a power vessel: sidelights, sternlight and steaming light'), R('Трёхцветный', 'Tricolour'), R('Только якорный', 'Only the anchor light')], a: 0, e: R('С работающим на ход двигателем яхта — моторное судно.', 'With the engine driving, the yacht is a power vessel.') } },
    { h: R('Огни и знаки других судов', 'Other vessels’ lights and shapes'), table: shapesTable,
      body: R('<p>Крупные суда длиннее 50 м несут два топовых огня: задний выше переднего, и по ним видно, куда судно повёрнуто. Особые суда показывают вертикальные огни кругового освещения: красный над красным — [[nuc|лишено управления]]; красный–белый–красный — [[ram|ограничено в маневрировании]]; три красных — [[cbd|стеснено осадкой]]; зелёный над белым — трал, красный над белым — другой [[fishing|лов рыбы]]. Днём их заменяют чёрные [[dayshape|знаки]].</p>', '<p>Ships over 50 m carry two masthead lights, the aft one higher, which shows which way they are heading. Special vessels show all-round lights in a vertical line: red over red, [[nuc|not under command]]; red–white–red, [[ram|restricted in ability to manoeuvre]]; three reds, [[cbd|constrained by draught]]; green over white, trawling; red over white, other [[fishing|fishing]]. By day black [[dayshape|shapes]] replace them.</p>') },
    { h: R('Звуковые сигналы', 'Sound signals'), table: soundsTable,
      body: R('<p>[[soundsig|Звуковые сигналы]]: короткий звук около 1 с, продолжительный — 4–6 с. Манёвренные сигналы подают суда, видящие друг друга. В тумане сигналы подают каждые 2 минуты; у яхты должен быть рупор или горн.</p>', '<p>[[soundsig|Sound signals]]: a short blast is about 1 s, a prolonged blast 4–6 s. Manoeuvring signals are for vessels in sight of one another. In fog, signals are given every 2 minutes; a yacht must carry a horn.</p>') }
  ],
  sims: ['lights'],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('Включить ходовые огни учебной яхты: под парусом и под мотором.', 'Switch on the training yacht’s lights: under sail and under power.'), R('На ночном выходе называть все огни, которые видите.', 'On a night sail, name every light you see.'), R('Подать сигналы рупором: «изменяю курс вправо», «сомневаюсь».', 'Sound “altering to starboard” and “doubt” on the horn.')] }],
  quiz: [
    { q: R('Какой сектор у бортового огня?', 'What is the arc of a sidelight?'), o: [R('112,5°', '112.5°'), R('135°', '135°'), R('225°', '225°')], a: 0, e: R('От носа до 22,5° позади траверза.', 'From ahead to 22.5° abaft the beam.') },
    { q: R('Что означает один короткий звук?', 'What does one short blast mean?'), o: [R('Изменяю курс вправо', 'Altering course to starboard'), R('Изменяю курс влево', 'Altering course to port'), R('Работаю назад', 'Going astern')], a: 0, e: R('Два коротких — влево, три — назад.', 'Two short: port; three: astern.') },
    { q: R('Красный над красным по вертикали — это…', 'Red over red vertically is…'), o: [R('Судно, лишённое возможности управляться', 'Not under command'), R('Лоцман', 'A pilot vessel'), R('Рыболов', 'A fishing vessel')], a: 0, e: R('Днём — два чёрных шара.', 'By day: two black balls.') },
    { q: R('Какой огонь яхта до 20 м может нести под парусом вместо бортовых и кормового?', 'Which light may a sailing yacht under 20 m show instead of sidelights and sternlight?'), o: [R('Трёхцветный на топе', 'A masthead tricolour'), R('Два белых', 'Two whites'), R('Якорный', 'The anchor light')], a: 0, e: R('Под мотором его выключают.', 'Switch it off under power.') },
    { q: R('Какой знак днём показывает яхта на якоре?', 'Which day shape does a yacht at anchor show?'), o: [R('Чёрный шар', 'A black ball'), R('Конус вниз', 'A cone point down'), R('Ромб', 'A diamond')], a: 0, e: R('Шар в носовой части.', 'A ball forward.') },
    { q: R('Пять и более коротких звуков означают…', 'Five or more short blasts mean…'), o: [R('Не понимаю ваших намерений', 'I do not understand your intentions'), R('Бедствие', 'Distress'), R('Обгоняю', 'I am overtaking')], a: 0, e: R('Сигнал сомнения.', 'The doubt signal.') }
  ]
};

SA.MODULES['5.3'] = {
  title: R('Навигационное ограждение МАМЭМ', 'IALA buoyage'),
  lead: R('Латеральные, кардинальные и другие знаки: как читать «дорожные знаки» на воде.', 'Lateral, cardinal and other marks: how to read the road signs on the water.'),
  goals: [R('отличать латеральные знаки системы A и понимать направление ограждения;', 'tell region A lateral marks apart and understand the direction of buoyage;'), R('опознавать кардинальные знаки днём и ночью;', 'identify cardinal marks by day and night;'), R('знать знаки отдельной опасности, безопасной воды, специальные и новой опасности.', 'know isolated danger, safe water, special and emergency wreck marks.')],
  cards: [
    { h: R('Латеральные знаки', 'Lateral marks'),
      body: R('<p>[[iala|МАМЭМ]] делит мир на районы A и B. Европа, Россия, Африка, Азия (кроме Японии, Кореи, Филиппин) — район A. [[lateral|Латеральные знаки]] района A: красный цилиндр (левая сторона) и зелёный конус (правая сторона).</p><p>Направление ограждения — с моря в гавань или вверх по реке. Входя в порт, оставляйте красные слева, зелёные справа. Выходя — наоборот. В районе B (Америка) цвета поменяны местами, а формы те же.</p>', '<p>[[iala|IALA]] divides the world into regions A and B. Europe, Russia, Africa and most of Asia are region A. Region A [[lateral|lateral marks]]: a red can (port hand) and a green cone (starboard hand).</p><p>The direction of buoyage runs from seaward into harbour or upriver. Entering port, keep reds to port and greens to starboard; leaving, the opposite. In region B (the Americas) the colours swap but the shapes stay.</p>'),
      check: { q: R('Вы выходите из гавани в море (район A). С какой стороны оставить красный буй?', 'You are leaving harbour for the sea (region A). Which side do you leave a red buoy?'), o: [R('Справа', 'To starboard'), R('Слева', 'To port')], a: 0, e: R('Правило «красный слева» действует при входе. На выходе всё наоборот.', '“Red to port” applies going in. Going out it is reversed.') } },
    { h: R('Кардинальные знаки', 'Cardinal marks'), fig: cardinalFig,
      body: R('<p>[[cardinal|Кардинальный знак]] показывает, с какой стороны от опасности безопасная вода: северный — проходите севернее. Цвета чёрный и жёлтый, топовая фигура — два конуса. Конусы указывают туда, где чёрное на знаке: оба вверх — чёрный сверху (N); оба вниз — снизу (S); врозь — чёрный сверху и снизу (E); остриями друг к другу — чёрный посередине (W).</p><p>Ночью белый огонь частых проблесков: N — непрерывно, E — 3, S — 6 + длинный, W — 9. Как циферблат часов.</p>', '<p>A [[cardinal|cardinal mark]] shows which side of a danger the safe water lies: north cardinal, pass north. Colours black and yellow, topmark two cones. The cones point to where the black is: both up, black on top (N); both down, black at the bottom (S); base to base, black top and bottom (E); point to point, black in the middle (W).</p><p>At night, a quick-flashing white light: N continuous, E 3, S 6 plus a long flash, W 9, like a clock face.</p>') },
    { h: R('Другие знаки', 'Other marks'),
      body: R('<p>[[isolated|Отдельная опасность]]: чёрный с красной полосой, два чёрных шара, огонь Fl(2) белый. [[safewater|Безопасная вода]]: красно-белые вертикальные полосы, красный шар. [[special|Специальный знак]]: жёлтый, крест. [[wreckbuoy|Знак новой опасности]]: синие и жёлтые вертикальные полосы, огонь синий и жёлтый попеременно. Обходите его с запасом.</p>', '<p>[[isolated|Isolated danger]]: black with a red band, two black balls, white Fl(2). [[safewater|Safe water]]: red and white vertical stripes, a red ball. [[special|Special mark]]: yellow with an X. [[wreckbuoy|Emergency wreck marking]]: blue and yellow vertical stripes, alternating blue and yellow light. Give it a wide berth.</p>') }
  ],
  sims: ['buoyage'],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('По карте района назвать все знаки на входе в гавань.', 'Name every mark on the harbour approach from the chart.'), R('На выходе вслух говорить, с какой стороны оставляете каждый буй.', 'Call out which side you leave each buoy as you go.')] }],
  quiz: [
    { q: R('Какой знак — левая сторона в районе A?', 'Which mark is port hand in region A?'), o: [R('Красный цилиндр', 'Red can'), R('Зелёный конус', 'Green cone'), R('Жёлтый крест', 'Yellow X')], a: 0, e: R('Входя в порт, оставляйте его слева.', 'Leave it to port entering harbour.') },
    { q: R('Оба конуса направлены вверх. Какой это знак?', 'Both cones point up. Which mark?'), o: [R('Северный', 'North'), R('Южный', 'South'), R('Восточный', 'East')], a: 0, e: R('Проходите севернее.', 'Pass to the north.') },
    { q: R('Сколько вспышек у западного кардинального?', 'How many flashes does a west cardinal show?'), o: [R('9', '9'), R('3', '3'), R('6', '6')], a: 0, e: R('Как 9 часов на циферблате.', 'Like 9 o’clock.') },
    { q: R('Что означают красно-белые вертикальные полосы?', 'What do red and white vertical stripes mean?'), o: [R('Безопасная вода', 'Safe water'), R('Опасность', 'Danger'), R('Специальный знак', 'Special mark')], a: 0, e: R('Знак подхода или середины фарватера.', 'A landfall or mid-channel mark.') },
    { q: R('Какой район МАМЭМ в России?', 'Which IALA region is Russia in?'), o: [R('A', 'A'), R('B', 'B')], a: 0, e: R('Как и вся Европа.', 'Like all of Europe.') },
    { q: R('Синие и жёлтые вертикальные полосы — это…', 'Blue and yellow vertical stripes mean…'), o: [R('Знак новой опасности (затонувшее судно)', 'Emergency wreck marking'), R('Безопасная вода', 'Safe water'), R('Граница пляжа', 'Beach boundary')], a: 0, e: R('Ставят, пока опасность не нанесена на карты.', 'Laid until the danger is charted.') }
  ]
};

// 5.4 — the content depends on the language track (RU → GIMS, EN → IYT).
SA.MODULES['5.4'] = {
  title: R('Правила вашего трека: ГИМС', 'Your track: IYT certification'),
  lead: R('Как получить удостоверение ГИМС на управление маломерным судном и какие правила действуют на внутренних водах России.', 'How IYT certificates work, what the ICC is, and how to prepare for assessment.'),
  goals: [R('описать, кто и что регулирует в плавании на маломерных судах в России;', 'explain what IYT Day Skipper and Crew certificates cover;'), R('перечислить документы на борту маломерного судна;', 'describe the ICC and when it is needed;'), R('понять, где действуют ППВВП, а где МППСС;', 'plan sea time and a logbook;'), R('подготовиться к экзамену в ГИМС.', 'prepare for the IYT assessment.')],
  cards: [
    { h: R('ГИМС и маломерные суда', 'IYT certificates'),
      body: R('<p>[[gims|ГИМС]] МЧС России регистрирует маломерные суда и выдаёт удостоверение на право управления ими. Маломерным считается судно длиной до 20 м, на котором не больше 12 пассажиров, — под это подходит большинство учебных и прогулочных яхт.</p><p>В удостоверении указаны тип судна (например, парусное или моторное) и район плавания: внутренние водные пути, внутренние воды или морские районы. Для моря нужна отметка о морском районе. Удостоверение выдаётся на 10 лет.</p>', '<p>[[iyt|IYT]] Worldwide issues certificates recognised in many countries. The IYT Day Skipper / Crew Sail course you are taking covers sailing a yacht by day in familiar coastal waters, as skipper or competent crew.</p><p>Higher levels (such as Coastal Skipper and Yachtmaster) add night passages, navigation in unfamiliar waters and more sea time. The levels and requirements are set by IYT; your school confirms the current ones.</p>') },
    { h: R('Документы на борту', 'The ICC'),
      body: R('<p>На маломерном судне держат: судовой билет (регистрация), удостоверение судоводителя, документы на радиостанцию, если она есть. Обязательное снабжение — по числу людей: спасательные жилеты, а также круг, огнетушитель и аптечка в зависимости от типа судна. Проверьте полный список в действующих Правилах пользования маломерными судами.</p>', '<p>The [[icc|ICC]] (International Certificate of Competence) is issued under UN ECE Resolution 40 and is often requested by charter companies and authorities in Europe. IYT is authorised to issue it in many countries alongside an IYT certificate, sometimes with a short test of local rules such as CEVNI for inland waters.</p>'),
      check: { q: R('Какой документ подтверждает регистрацию маломерного судна?', 'Which document registers a small craft?'), o: [R('Судовой билет', 'The registration certificate (sudovoy bilet)'), R('Паспорт шкипера', 'The skipper’s passport'), R('Страховка', 'Insurance')], a: 0, e: R('Он всегда должен быть на борту.', 'It must always be on board.') } },
    { h: R('ППВВП и МППСС', 'Sea time and logbook'),
      body: R('<p>На реках, каналах и водохранилищах, отнесённых к внутренним водным путям, действуют [[ppvvp|ППВВП]], а не [[colregs|МППСС]]. В них есть свои сигналы: например, отмашка днём белым флагом и ночью белым проблесковым огнём показывает, каким бортом судно расходится. В море и на большинстве акваторий за пределами ВВП — МППСС-72.</p><p>Перед выходом изучите местные правила: районы, где плавание запрещено, ограничения скорости и порядок подачи сигналов.</p>', '<p>Keep a personal logbook of every sail: date, boat, role, miles, hours and conditions. Night hours and passages as skipper count for higher certificates. Ask your instructor to sign each entry.</p><p>Before chartering abroad, check local rules: inland waters in Europe follow CEVNI, and some countries have their own speed limits and anchoring restrictions.</p>') },
    { h: R('Экзамен', 'Assessment'),
      body: R('<p>Экзамен в ГИМС состоит из теории (тестовые билеты: устройство судна, правила плавания, навигационные знаки, безопасность и первая помощь) и практики на воде: отход, управление, подход к причалу, «человек за бортом». Нужны медицинская справка и документ об окончании обучения, если его требует инспекция. Требования меняются, поэтому уточните их в местном подразделении ГИМС перед подачей документов.</p>', '<p>The IYT assessment combines a theory exam (boat, rules of the road, buoyage, safety, navigation and weather basics) with a practical on the water: leaving and returning to a berth, sailing all points, tacking and gybing, reefing, man overboard and skippering the crew. Your instructor assesses you over the course; the details come from IYT and your school.</p>') }
  ],
  water: [{ h: R('Что сделать', 'What to do'), li: [R('Проверить на учебной яхте наличие всех обязательных документов и снабжения.', 'Start your personal logbook today.'), R('Найти на карте района границы ВВП и морских вод.', 'Find out whether your charter destinations ask for an ICC.')] }],
  quiz: [
    { q: R('Кто выдаёт удостоверение на управление маломерным судном в России?', 'What does the IYT Day Skipper certificate cover?'), o: [R('ГИМС МЧС России', 'Skippering a yacht by day in familiar waters'), R('Яхт-клуб', 'Ocean passages'), R('Береговая охрана', 'Commercial shipping')], a: 0, e: R('ГИМС регистрирует суда и выдаёт удостоверения.', 'Night passages and unfamiliar waters come at higher levels.') },
    { q: R('Какая длина маломерного судна максимальна?', 'What does ICC stand for?'), o: [R('До 20 м', 'International Certificate of Competence'), R('До 12 м', 'International Crew Card'), R('До 50 м', 'Inland Charter Certificate')], a: 0, e: R('И не больше 12 пассажиров.', 'Issued under UN ECE Resolution 40.') },
    { q: R('Какие правила действуют на внутренних водных путях России?', 'Which rules apply on many European inland waterways?'), o: [R('ППВВП', 'CEVNI'), R('Только МППСС', 'Only COLREGs'), R('Никакие', 'None')], a: 0, e: R('В море — МППСС-72.', 'At sea, the COLREGs.') },
    { q: R('На какой срок выдаётся удостоверение ГИМС?', 'What should a personal logbook record?'), o: [R('10 лет', 'Date, boat, role, miles, hours, conditions'), R('1 год', 'Only the boat name'), R('Бессрочно', 'Nothing, it is optional')], a: 0, e: R('Затем его нужно заменить.', 'Signed by the skipper or instructor.') },
    { q: R('Из чего состоит экзамен ГИМС?', 'What does the IYT assessment include?'), o: [R('Теория и практика', 'Theory and a practical on the water'), R('Только теория', 'Only theory'), R('Только собеседование', 'Only an interview')], a: 0, e: R('Практика включает «человек за бортом» и швартовку.', 'The practical includes MOB and berthing.') },
    { q: R('Что указано в удостоверении судоводителя?', 'Who usually asks to see an ICC?'), o: [R('Тип судна и район плавания', 'Charter companies and authorities abroad'), R('Цвет яхты', 'Marina restaurants'), R('Ничего', 'Nobody')], a: 0, e: R('Для моря нужна отметка морского района.', 'Especially in Europe.') }
  ]
};
})();
