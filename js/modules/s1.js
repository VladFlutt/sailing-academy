// Section 1 — The boat and the crew: modules 1.1–1.4.
(() => {
'use strict';
const SA = window.SA, D = SA.draw, esc = SA.esc;
const R = (ru, en) => ({ ru, en });
const ru = () => SA.lang === 'ru';
const T = (sec, rn, rd, en, ed) => ({ sec, ru: [rn, rd], en: [en, ed] });
SA.addTerms({
  ahead: T('boat', 'Прямо по носу', 'Направление вперёд по диаметральной плоскости.', 'Ahead', 'Straight in front of the bow.'),
  astern: T('boat', 'За кормой', 'Направление назад; также движение задним ходом.', 'Astern', 'Behind the boat; also moving backwards.'),
  abeam: T('boat', 'Траверз', 'Направление под 90° к диаметральной плоскости, на любом борту.', 'Abeam', 'At 90° to the centreline, on either side.'),
  quarter: T('boat', 'Раковина', 'Кормовая часть борта; направление между траверзом и кормой.', 'Quarter', 'The after part of the side; the direction between abeam and astern.'),
  leeward: T('sail', 'Подветренный', 'Сторона, куда дует ветер, противоположная наветренной.', 'Leeward', 'The side away from the wind, opposite windward.'),
  briefing: T('safety', 'Инструктаж экипажа', 'Рассказ шкипера перед выходом: снаряжение, правила на борту, действия в аварийной ситуации.', 'Crew briefing', 'The skipper’s talk before departure on gear, rules on board and emergencies.'),
  seasick: T('safety', 'Морская болезнь', 'Тошнота и слабость от качки. Помогают горизонт, свежий воздух, вода и лекарства заранее.', 'Seasickness', 'Nausea and weakness from motion. Horizon, fresh air, water and early medication help.'),
  marpol: T('rules', 'МАРПОЛ', 'Международная конвенция о предотвращении загрязнения с судов. Пластик за борт запрещён везде.', 'MARPOL', 'The international convention on pollution from ships. No plastic overboard anywhere.'),
  qflag: T('rules', 'Флаг «Q»', 'Жёлтый флаг: «Моё судно здорово, прошу свободную практику». Поднимают при прибытии из другой страны.', 'Q flag', 'A yellow flag requesting customs and health clearance on arrival from abroad.'),
  raft: T('handling', 'Стоянка лагом', 'Стоянка яхт борт к борту. Через чужую яхту проходят по носовой палубе.', 'Rafting', 'Boats moored side by side. Cross another boat via its foredeck.')
});
const lab = (x, y, k, o = {}) => { const v = SA.TERMS[k]; const name = v ? v[SA.lang][0].split(' (')[0].split(' / ')[0] : k; return `<text class="term" tabindex="0" data-t="${k}" x="${x}" y="${y}" text-anchor="${o.a || 'start'}" font-family="var(--f-display)" font-size="${o.fs || 14}" font-weight="600" fill="var(--accent)">${esc(name)}</text>`; };
const lead = (x1, y1, x2, y2) => `<path d="M${x1},${y1} L${x2},${y2}" stroke="var(--muted)" stroke-width="1" fill="none"/><circle cx="${x2}" cy="${y2}" r="2.5" fill="var(--muted)"/>`;

function deckFig() {
  return `<svg viewBox="0 0 440 300" role="img" aria-label="${ru() ? 'Яхта сверху' : 'Yacht from above'}">
    <path d="M60,150 C120,96 250,84 390,150 C250,216 120,204 60,150Z" transform="translate(0 0)" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
    <path d="M80,150 C130,108 250,98 372,150 C250,202 130,192 80,150Z" fill="none" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>
    <rect x="96" y="128" width="62" height="44" rx="10" fill="color-mix(in srgb,var(--wind) 15%,var(--surface))" stroke="var(--ink)" stroke-width="1.2"/>
    <rect x="170" y="130" width="90" height="40" rx="8" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
    <circle cx="270" cy="150" r="5" fill="var(--ink)"/><path d="M70,150 L98,150" stroke="var(--ink)" stroke-width="3"/>
    <circle cx="122" cy="122" r="5" fill="none" stroke="var(--ink)" stroke-width="2"/><circle cx="122" cy="178" r="5" fill="none" stroke="var(--ink)" stroke-width="2"/>
    <rect x="364" y="146" width="10" height="8" fill="var(--ink)"/>
    <path d="M330,121 l8,0 M330,179 l8,0" stroke="var(--ink)" stroke-width="3"/>
    <ellipse cx="200" cy="100" rx="5" ry="11" fill="var(--warn)" opacity=".8"/>
    ${D.light(372, 136, 'red', 4)}${D.light(372, 164, 'green', 4)}
    ${lead(380, 150, 410, 120)}${lab(406, 112, 'bow', { a: 'end' })}
    ${lead(64, 150, 30, 120)}${lab(24, 112, 'stern')}
    ${lead(300, 110, 300, 60)}${lab(300, 52, 'portside', { a: 'middle' })}
    ${lead(300, 190, 300, 240)}${lab(300, 256, 'starboard', { a: 'middle' })}
    ${lead(127, 140, 150, 34)}${lab(150, 28, 'cockpit', { a: 'middle' })}
    ${lead(84, 150, 40, 210)}${lab(36, 226, 'tiller')}
    ${lead(122, 178, 110, 270)}${lab(110, 286, 'winch', { a: 'middle' })}
    ${lead(338, 179, 380, 230)}${lab(386, 246, 'cleat', { a: 'end' })}
    ${lead(200, 90, 230, 30)}${lab(234, 28, 'fender')}
    ${lead(270, 150, 230, 230)}${lab(222, 248, 'mast', { a: 'middle' })}
    ${lead(368, 150, 420, 186)}${lab(434, 202, 'windlass', { a: 'end', fs: 12 })}
  </svg>`;
}
function dirsFig() {
  const r = 108, dirs = [[0, 'ahead'], [90, 'abeam'], [270, 'abeam'], [180, 'astern'], [135, 'quarter'], [225, 'quarter']];
  return `<svg viewBox="-220 -150 440 300" role="img" aria-label="${ru() ? 'Направления относительно яхты' : 'Directions relative to the boat'}">
    <circle r="${r - 18}" fill="none" stroke="var(--line)" stroke-dasharray="3 5"/>
    ${D.boat(0, 6, 0, { s: 1.3, nosail: true, edge: false })}
    ${dirs.map(([a, k]) => { const [x, y] = D.polar(a, r - 20), [lx, ly] = D.polar(a, r + 8); return D.arrow(...D.polar(a, 46), x, y, 'var(--accent)', 2) + lab(lx.toFixed(0), (ly + 5).toFixed(0), k, { a: Math.abs(lx) < 20 ? 'middle' : lx > 0 ? 'start' : 'end', fs: 13 }); }).join('')}
    ${D.txt(-150, 130, ru() ? 'левый борт' : 'port side', { fs: 12, fill: 'var(--port)' })}${D.txt(150, 130, ru() ? 'правый борт' : 'starboard side', { fs: 12, fill: 'var(--stbd)' })}
  </svg>`;
}
function flagsFig() {
  return `<svg viewBox="0 0 440 250" role="img" aria-label="${ru() ? 'Где поднимают флаги' : 'Where flags are flown'}">
    <path d="M40,190 Q220,210 400,180" stroke="var(--wind)" stroke-width="2" fill="none" opacity=".5"/>
    <path d="M50,168 L360,162 Q350,190 312,196 L100,198 Q70,192 50,168Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
    <path d="M220,164 V24" stroke="var(--ink)" stroke-width="3"/><path d="M208,80 H232" stroke="var(--ink)" stroke-width="2.5"/>
    <path d="M220,24 L350,162 M220,24 L58,166" stroke="var(--ink)" stroke-width="1"/>
    <path d="M232,80 L232,96" stroke="var(--muted)"/><rect x="232" y="84" width="30" height="20" fill="var(--warn)" stroke="#0006"/>
    <path d="M52,168 L36,140" stroke="var(--ink)" stroke-width="2"/><rect x="6" y="128" width="32" height="20" fill="var(--port)" stroke="#0006"/>
    ${D.txt(270, 76, ru() ? 'гостевой флаг страны' : 'courtesy flag', { a: 'start', fs: 13 })}${D.txt(270, 92, ru() ? 'под правой краспицей' : 'under the starboard spreader', { a: 'start', fs: 12, fill: 'var(--muted)', w: 500 })}
    ${D.txt(10, 116, ru() ? 'флаг государства' : 'national ensign', { a: 'start', fs: 13 })}${D.txt(10, 230, ru() ? 'на корме: флагшток или ахтерштаг' : 'at the stern: staff or backstay', { a: 'start', fs: 12, fill: 'var(--muted)', w: 500 })}
  </svg>`;
}
const commandsTable = () => ru()
  ? `<table class="tbl"><thead><tr><th>Шкипер</th><th>Экипаж</th><th>Что происходит</th></tr></thead><tbody>
      <tr><td>«Приготовиться к повороту оверштаг!»</td><td>«Готов!»</td><td>Стаксель-шкот снят со стопора, рабочая лебёдка готова.</td></tr>
      <tr><td>«Поворот!»</td><td>—</td><td>Рулевой приводится, стаксель перекидывают на другой борт.</td></tr>
      <tr><td>«Приготовиться к повороту фордевинд!»</td><td>«Готов!»</td><td>Грот выбран к середине, головы ниже гика.</td></tr>
      <tr><td>«Перекидываем!»</td><td>—</td><td>Гик переходит на другой борт под контролем шкота.</td></tr></tbody></table>`
  : `<table class="tbl"><thead><tr><th>Skipper</th><th>Crew</th><th>What happens</th></tr></thead><tbody>
      <tr><td>“Ready about!”</td><td>“Ready!”</td><td>Jib sheet off the self-tailer, working winch ready.</td></tr>
      <tr><td>“Lee-oh!” / “Helm’s a-lee!”</td><td>—</td><td>The helm turns into the wind and the jib is sheeted across.</td></tr>
      <tr><td>“Stand by to gybe!”</td><td>“Ready!”</td><td>Main sheeted to the centre, heads below the boom.</td></tr>
      <tr><td>“Gybe-oh!”</td><td>—</td><td>The boom crosses under control of the sheet.</td></tr></tbody></table>`;
const watchTable = () => `<table class="tbl"><thead><tr><th>${ru() ? 'Система' : 'System'}</th><th>${ru() ? 'Как устроена' : 'How it works'}</th><th>${ru() ? 'Когда подходит' : 'When it suits'}</th></tr></thead><tbody>
  <tr><td>${ru() ? '2 вахты по 4 часа' : '2 watches, 4 hours'}</td><td>${ru() ? 'Экипаж делится пополам, вахты сменяются каждые 4 часа' : 'The crew splits in two and changes every 4 hours'}</td><td>${ru() ? 'Переход длиннее суток, экипаж 4–6 человек' : 'Passages over a day, crew of 4–6'}</td></tr>
  <tr><td>${ru() ? '3 вахты по 3 часа' : '3 watches, 3 hours'}</td><td>${ru() ? '3 часа на вахте, 6 часов отдыха' : '3 hours on, 6 hours off'}</td><td>${ru() ? 'Большой экипаж, холодная погода' : 'Larger crew, cold weather'}</td></tr>
  <tr><td>${ru() ? 'Шкипер вне вахт' : 'Skipper off watch'}</td><td>${ru() ? 'Шкипер не стоит вахту, но его будят в оговорённых случаях' : 'The skipper keeps no watch but is called in agreed cases'}</td><td>${ru() ? 'Опытный экипаж' : 'An experienced crew'}</td></tr></tbody></table>`;

SA.MODULES['1.1'] = {
  title: R('Устройство яхты', 'Parts of a yacht'),
  lead: R('Корпус, палуба, борта и направления: язык, на котором экипаж говорит на борту с первой минуты.', 'Hull, deck, sides and directions: the language the crew speaks on board from the first minute.'),
  hook: { q: R('С какой стороны яхты горит зелёный ходовой огонь?', 'On which side of the boat is the green navigation light?'), o: [R('Слева', 'Port (left)'), R('Справа', 'Starboard (right)'), R('На корме', 'At the stern')], a: 1,
    ok: R('Верно. Зелёный — правый борт, красный — левый. Запомните: «красное вино осталось» — слева красный.', 'Right. Green is starboard, red is port. “There is a little red port left in the bottle.”'),
    no: R('Нет. Зелёный — правый борт, красный — левый, и это понадобится вам каждую ночь.', 'No. Green is starboard and red is port, and you will need that every night.'),
    fig: () => `<svg viewBox="-150 -110 300 220" role="img">${D.boat(0, 10, 0, { s: 2, nosail: true, edge: false })}${D.light(-18, -30, 'white', 5).replace(/#FFFFFF/g, 'var(--muted)')}${D.light(18, -30, 'white', 5).replace(/#FFFFFF/g, 'var(--muted)')}${D.txt(-60, -36, '?', { fs: 24 })}${D.txt(60, -36, '?', { fs: 24 })}</svg>` },
  goals: [R('назвать основные части корпуса и палубного оборудования;', 'name the main parts of the hull and deck gear;'), R('показать нос, корму, левый и правый борт;', 'point to bow, stern, port and starboard;'), R('описать направление на объект относительно яхты;', 'describe a direction relative to the boat;'), R('объяснить, что такое длина, ширина и осадка и почему важна осадка.', 'explain length, beam and draught and why draught matters.')],
  cards: [
    { h: R('Нос, корма и борта', 'Bow, stern and sides'), fig: deckFig, cap: R('Наведите на подписи, чтобы увидеть пояснения.', 'Hover over the labels for explanations.'),
      body: R('<p>Передняя часть яхты — [[bow|нос]], задняя — [[stern|корма]]. Если стоять лицом к носу, справа будет [[starboard|правый борт]] (огонь зелёный), слева — [[portside|левый борт]] (огонь красный).</p><p>На палубе: [[cockpit|кокпит]], откуда управляют яхтой; [[tiller|румпель]] или [[helm|штурвал]]; [[winch|лебёдки]] для шкотов; [[cleat|утки]] для швартовов; [[fender|кранцы]], которые защищают борт у причала; [[lifeline|леерное ограждение]]; [[windlass|брашпиль]] для якорной цепи.</p>', '<p>The front of the yacht is the [[bow|bow]], the back is the [[stern|stern]]. Facing the bow, [[starboard|starboard]] is on your right (green light) and [[portside|port]] on your left (red light).</p><p>On deck: the [[cockpit|cockpit]] where you steer; the [[tiller|tiller]] or [[helm|wheel]]; [[winch|winches]] for the sheets; [[cleat|cleats]] for mooring lines; [[fender|fenders]] to protect the hull at the dock; the [[lifeline|guardrails]]; the [[windlass|windlass]] for the anchor chain.</p>'),
      check: { q: R('Вы стоите в кокпите лицом к корме. Где правый борт?', 'You stand in the cockpit facing the stern. Where is starboard?'), o: [R('Справа от вас', 'On your right'), R('Слева от вас', 'On your left')], a: 1, e: R('Борта называют, глядя на нос. Лицом к корме правый борт оказывается слева.', 'Sides are named looking forward. Facing aft, starboard is on your left.') } },
    { h: R('Направления относительно яхты', 'Directions relative to the boat'), fig: dirsFig,
      body: R('<p>На борту не говорят «вон там». Объект может быть [[ahead|прямо по носу]], на [[abeam|траверзе]] правого или левого борта, на [[quarter|раковине]] или [[astern|за кормой]]. Между носом и траверзом — «по скуле».</p><p>Точнее — в градусах от носа: «судно 30° справа». Так [[lookout|наблюдатель]] докладывает шкиперу.</p>', '<p>On board nobody says “over there”. An object can be [[ahead|ahead]], [[abeam|abeam]] to port or starboard, on the [[quarter|quarter]] or [[astern|astern]]. Between ahead and abeam it is “on the bow”.</p><p>More precisely, in degrees off the bow: “ship 30° to starboard”. That is how the [[lookout|lookout]] reports to the skipper.</p>') },
    { h: R('Корпус и размеры', 'Hull and dimensions'),
      body: R('<p>[[hull|Корпус]] ниже [[waterline|ватерлинии]] несёт [[keel|киль]], который не даёт яхте сносить ветром и держит её от опрокидывания, и [[rudder|перо руля]]. Главные размеры: [[loa|длина]], [[beamw|ширина]] и [[draft|осадка]].</p><p>Осадку шкипер помнит всегда: она решает, пройдёте ли вы над мелью при отливе. В корпусе ниже ватерлинии есть [[thruhull|забортные отверстия]] с кранами: на каждом должна висеть деревянная пробка подходящего размера.</p>', '<p>The [[hull|hull]] below the [[waterline|waterline]] carries the [[keel|keel]], which resists leeway and keeps the boat upright, and the [[rudder|rudder]]. The key dimensions are [[loa|length overall]], [[beamw|beam]] and [[draft|draught]].</p><p>The skipper always knows the draught: it decides whether you clear a shoal at low tide. Below the waterline there are [[thruhull|seacocks]]; each should have a wooden bung of the right size tied next to it.</p>'),
      check: { q: R('Какой размер важнее всего, когда вы идёте над мелью?', 'Which dimension matters most when crossing a shallow area?'), o: [R('Длина', 'Length'), R('Ширина', 'Beam'), R('Осадка', 'Draught')], a: 2, e: R('Осадка — глубина, на которую яхта погружена.', 'Draught is how deep the boat sits in the water.') } }
  ],
  water: [{ h: R('Что сделать на борту', 'What to do on board'), li: [R('Обойти яхту с инструктором и назвать всё, что видите, от носа до кормы.', 'Walk the boat with the instructor naming everything bow to stern.'), R('Найти все [[thruhull|забортные краны]] и пробки к ним.', 'Find every [[thruhull|seacock]] and its bung.'), R('Узнать осадку вашей яхты и записать её в кокпите.', 'Find your boat’s draught and note it in the cockpit.')] }],
  quiz: [
    { q: R('Какого цвета огонь левого борта?', 'What colour is the port sidelight?'), o: [R('Зелёный', 'Green'), R('Красный', 'Red'), R('Белый', 'White')], a: 1, e: R('Левый — красный, правый — зелёный.', 'Port red, starboard green.') },
    { q: R('Что не даёт яхте сносить вбок и опрокидываться?', 'What stops the yacht drifting sideways and capsizing?'), o: [R('Киль', 'The keel'), R('Перо руля', 'The rudder'), R('Брашпиль', 'The windlass')], a: 0, e: R('Киль — противодрейф и балласт.', 'The keel resists leeway and carries ballast.') },
    { q: R('Объект находится под 90° к борту. Как это называется?', 'An object is at 90° to the side. What is that called?'), o: [R('На траверзе', 'Abeam'), R('На раковине', 'On the quarter'), R('По носу', 'Ahead')], a: 0, e: R('Траверз — 90° от диаметральной плоскости.', 'Abeam is 90° from the centreline.') },
    { q: R('Зачем у забортного крана привязана деревянная пробка?', 'Why is a wooden bung tied next to a seacock?'), o: [R('Чтобы заглушить отверстие, если кран сломается', 'To plug the hole if the seacock fails'), R('Для красоты', 'For decoration'), R('Чтобы крепить кранцы', 'To hang fenders')], a: 0, e: R('Сломанный кран под водой — это течь, пробку забивают сразу.', 'A broken seacock below the waterline is a leak; drive the bung in at once.') },
    { q: R('Для чего кранцы?', 'What are fenders for?'), o: [R('Защищать борт от удара о причал', 'To protect the hull against the dock'), R('Для спасения человека за бортом', 'To rescue a person overboard'), R('Для крепления паруса', 'To secure a sail')], a: 0, e: R('Кранцы вывешивают перед подходом к причалу.', 'Put fenders out before coming alongside.') },
    { q: R('Что такое осадка?', 'What is draught?'), o: [R('Глубина от ватерлинии до низа киля', 'Depth from the waterline to the bottom of the keel'), R('Высота мачты', 'Mast height'), R('Ширина корпуса', 'The hull’s width')], a: 0, e: R('Сравнивайте осадку с глубиной на карте.', 'Compare draught with the depth on the chart.') }
  ]
};

SA.MODULES['1.2'] = {
  title: R('Шкипер и экипаж', 'Skipper and crew'),
  lead: R('Кто за что отвечает на яхте, о чём шкипер говорит перед выходом и как звучат команды.', 'Who is responsible for what, what the skipper covers before departure, and how commands sound.'),
  goals: [R('описать ответственность шкипера и экипажа;', 'describe the responsibilities of skipper and crew;'), R('провести инструктаж экипажа по списку;', 'run a crew briefing from a checklist;'), R('подавать и отвечать на стандартные команды.', 'give and answer standard commands.')],
  cards: [
    { h: R('Ответственность шкипера', 'The skipper’s responsibility'),
      body: R('<p>[[skipper|Шкипер]] отвечает за безопасность яхты и всех людей на борту — это [[dutycare|обязанность заботиться]]. Он решает, выходить ли в море, по какому маршруту и когда возвращаться, и обязан помочь терпящим бедствие, если это не ставит под угрозу собственную яхту.</p><p>Хороший шкипер распределяет роли под силы людей, говорит заранее, а не в последний момент, и следит за состоянием экипажа: усталость, холод и [[seasick|морская болезнь]] — тоже вопросы безопасности.</p>', '<p>The [[skipper|skipper]] is responsible for the boat and everyone on board: the [[dutycare|duty of care]]. They decide whether to sail, the route and when to return, and must help people in distress when this does not endanger their own boat.</p><p>A good skipper assigns roles to suit people, briefs early rather than at the last moment, and watches the crew: fatigue, cold and [[seasick|seasickness]] are safety issues too.</p>') },
    { h: R('Инструктаж перед выходом', 'The pre-departure briefing'),
      body: R('<p>[[briefing|Инструктаж]] проводят до отхода, даже для опытного экипажа на новой яхте. Минимум:</p><ul><li>[[lifejacket|спасательные жилеты]]: где лежат, как надевать, когда носить обязательно;</li><li>где [[liferaft|спасательный плот]], [[flare|фальшфейеры]], [[extinguisher|огнетушители]], [[fireblanket|кошма]], аптечка;</li><li>как работают гальюн, газ и кингстоны;</li><li>действия при «[[mob|человеке за бортом]]» и пожаре;</li><li>как подать сигнал бедствия по [[vhf|УКВ-радио]];</li><li>правила: двигаться по палубе держась, «одна рука для себя».</li></ul>', '<p>A [[briefing|briefing]] happens before departure, even for an experienced crew on a new boat. As a minimum:</p><ul><li>[[lifejacket|lifejackets]]: where they are, how to wear them, when they are mandatory;</li><li>where the [[liferaft|liferaft]], [[flare|flares]], [[extinguisher|extinguishers]], [[fireblanket|fire blanket]] and first-aid kit are;</li><li>how the heads, gas and seacocks work;</li><li>what to do for [[mob|man overboard]] and fire;</li><li>how to send a distress call on the [[vhf|VHF]];</li><li>rules: move along the deck holding on, “one hand for yourself”.</li></ul>'),
      check: { q: R('Когда проводить инструктаж по безопасности?', 'When should the safety briefing happen?'), o: [R('До отхода от причала', 'Before leaving the dock'), R('Когда что-то случится', 'When something happens'), R('Только для новичков', 'Only for beginners')], a: 0, e: R('В море времени объяснять уже не будет.', 'At sea there will be no time to explain.') } },
    { h: R('Команды и ответы', 'Commands and replies'), table: commandsTable,
      body: R('<p>Команда звучит коротко и громко, а экипаж отвечает, что понял и готов. Если ответа нет, манёвр не начинают. Так никто не окажется под гиком или с пальцами в лебёдке.</p>', '<p>Commands are short and loud, and the crew answers to confirm they are ready. No answer, no manoeuvre. That way nobody ends up under the boom or with fingers in a winch.</p>') }
  ],
  water: [{ h: R('Что отработать', 'What to practise'), li: [R('Провести инструктаж для своего экипажа по списку.', 'Give the briefing to your crew from the list.'), R('Отработать команды оверштага и фордевинда с ответами.', 'Practise tack and gybe commands with replies.')] }],
  quiz: [
    { q: R('Кто отвечает за безопасность всех на борту?', 'Who is responsible for the safety of everyone on board?'), o: [R('Шкипер', 'The skipper'), R('Каждый за себя', 'Each person for themselves'), R('Владелец марины', 'The marina owner')], a: 0, e: R('Это и есть обязанность заботиться.', 'That is the duty of care.') },
    { q: R('Что значит «одна рука для себя»?', 'What does “one hand for yourself” mean?'), o: [R('Всегда держаться одной рукой при движении по палубе', 'Always hold on with one hand moving on deck'), R('Работать одной рукой, чтобы не устать', 'Work one-handed to save energy'), R('Здороваться одной рукой', 'Wave with one hand')], a: 0, e: R('Яхту может качнуть в любой момент.', 'The boat can lurch at any moment.') },
    { q: R('Экипаж не ответил «Готов!». Что делает шкипер?', 'The crew did not answer “Ready!”. What does the skipper do?'), o: [R('Не начинает манёвр', 'Does not start the manoeuvre'), R('Поворачивает всё равно', 'Turns anyway'), R('Кричит громче и поворачивает', 'Shouts louder and turns')], a: 0, e: R('Без подтверждения манёвр опасен.', 'Without confirmation the manoeuvre is unsafe.') },
    { q: R('Что входит в инструктаж?', 'What belongs in the briefing?'), o: [R('Жилеты, плот, огнетушители, МОБ, радио', 'Lifejackets, liferaft, extinguishers, MOB, radio'), R('Только меню на неделю', 'Only the menu for the week'), R('Только маршрут', 'Only the route')], a: 0, e: R('Безопасность — главная часть инструктажа.', 'Safety is the core of the briefing.') },
    { q: R('Должен ли шкипер помочь терпящим бедствие?', 'Must the skipper help people in distress?'), o: [R('Да, если это не угрожает своей яхте', 'Yes, if it does not endanger their own boat'), R('Нет, никогда', 'No, never'), R('Только за плату', 'Only for payment')], a: 0, e: R('Это морская традиция и требование закона.', 'It is both sea tradition and law.') },
    { q: R('Что шкиперу делать с уставшим и замёрзшим экипажем?', 'What should the skipper do about a tired, cold crew?'), o: [R('Учитывать это как риск: отдых, горячее питьё, сократить переход', 'Treat it as a risk: rest, hot drinks, shorten the passage'), R('Ничего, это не важно', 'Nothing, it does not matter'), R('Добавить вахт', 'Add more watches')], a: 0, e: R('Усталость приводит к ошибкам.', 'Fatigue leads to mistakes.') }
  ]
};

SA.MODULES['1.3'] = {
  title: R('Вахта, усталость, экология, снабжение', 'Watchkeeping, fatigue, environment, provisioning'),
  lead: R('Как организовать вахты, справиться с усталостью и морской болезнью, не навредить морю и не остаться без воды.', 'How to organise watches, deal with fatigue and seasickness, protect the sea and not run out of water.'),
  goals: [R('выбрать систему вахт для перехода;', 'choose a watch system for a passage;'), R('распознать усталость и морскую болезнь и помочь;', 'recognise fatigue and seasickness and help;'), R('назвать, что нельзя сбрасывать за борт;', 'name what must not go overboard;'), R('рассчитать запас воды и провизии.', 'calculate water and food supplies.')],
  cards: [
    { h: R('Вахты', 'Watches'), table: watchTable,
      body: R('<p>[[watch|Вахта]] отвечает за [[lookout|наблюдение]], курс и паруса. Сдающий вахту рассказывает принимающему обстановку: курс, суда вокруг, изменения погоды, записи в [[logbook|судовом журнале]]. Ночью вахта всегда в жилетах и пристёгнута.</p>', '<p>The [[watch|watch]] keeps [[lookout|lookout]], holds the course and trims the sails. The outgoing watch hands over the situation: course, traffic, weather changes, [[logbook|log]] entries. At night the watch always wears lifejackets and clips on.</p>') },
    { h: R('Усталость и морская болезнь', 'Fatigue and seasickness'),
      body: R('<p>Усталость незаметно снижает внимание. Спите, когда свободны от вахты, ешьте горячее, пейте воду. [[seasick|Морская болезнь]] лечится проще всего заранее: таблетки принимают до выхода, а на борту помогают горизонт, свежий воздух и работа у руля.</p><p>Укачавшегося держат в кокпите, на подветренном борту, в жилете и пристёгнутым. Он быстро теряет воду и мёрзнет.</p>', '<p>Fatigue quietly erodes attention. Sleep when off watch, eat hot food, drink water. [[seasick|Seasickness]] is easiest to treat early: take tablets before leaving, and on board look at the horizon, get fresh air and take the helm.</p><p>Keep a seasick person in the cockpit, on the leeward side, in a lifejacket and clipped on. They lose water and get cold fast.</p>'),
      check: { q: R('Где лучше находиться укачавшемуся?', 'Where should a seasick person be?'), o: [R('В каюте внизу', 'In a cabin below'), R('В кокпите, пристёгнутым, на подветренном борту', 'In the cockpit, clipped on, on the leeward side'), R('На баке', 'On the foredeck')], a: 1, e: R('Свежий воздух и горизонт помогают, а пристёгнутым — безопасно.', 'Fresh air and the horizon help, and clipped on is safe.') } },
    { h: R('Экология и снабжение', 'Environment and provisioning'),
      body: R('<p>По [[marpol|МАРПОЛ]] пластик и масла за борт нельзя нигде. Пищевые отходы — только далеко от берега, сточные воды — в цистерну и на станцию откачки. Используйте мыло, безопасное для моря.</p><p>Запас пресной воды — не меньше 2–3 литров на человека в сутки плюс запас на непредвиденную задержку. Продукты подбирают так, чтобы готовить в качку было просто.</p>', '<p>Under [[marpol|MARPOL]] plastic and oil may never go overboard. Food waste only far from shore, sewage into the holding tank and a pump-out station. Use marine-safe soap.</p><p>Carry at least 2–3 litres of fresh water per person per day, plus a reserve for delays. Choose food that is easy to cook in a seaway.</p>') }
  ],
  water: [{ h: R('Что сделать', 'What to do'), li: [R('Составить график вахт на ночной переход для своего экипажа.', 'Draw up a watch rota for a night passage for your crew.'), R('Посчитать воду на 3 дня для 6 человек с запасом.', 'Calculate water for 6 people for 3 days with a reserve.')] }],
  quiz: [
    { q: R('Что сбрасывать за борт нельзя нигде?', 'What may never go overboard anywhere?'), o: [R('Пластик', 'Plastic'), R('Морскую воду', 'Seawater'), R('Ничего из этого', 'None of these')], a: 0, e: R('Это требование МАРПОЛ.', 'That is a MARPOL rule.') },
    { q: R('Сколько пресной воды планировать на человека в сутки как минимум?', 'How much fresh water per person per day as a minimum?'), o: [R('0,5 л', '0.5 L'), R('2–3 л', '2–3 L'), R('20 л', '20 L')], a: 1, e: R('Плюс запас на задержку.', 'Plus a reserve for delays.') },
    { q: R('Когда принимать таблетки от укачивания?', 'When should you take seasickness tablets?'), o: [R('До выхода', 'Before leaving'), R('Когда уже тошнит', 'When already sick'), R('Никогда', 'Never')], a: 0, e: R('Лекарства действуют лучше заранее.', 'Medication works better taken early.') },
    { q: R('Что сдающая вахта рассказывает новой?', 'What does the outgoing watch hand over?'), o: [R('Курс, суда вокруг, погоду, записи в журнале', 'Course, traffic, weather, log entries'), R('Меню на завтрак', 'The breakfast menu'), R('Ничего', 'Nothing')], a: 0, e: R('Принимающий должен понять обстановку до того, как сдающий уйдёт.', 'The new watch must understand the situation before the old one leaves.') },
    { q: R('Ночью вахта на палубе должна…', 'At night the watch on deck must…'), o: [R('быть в жилетах и пристёгнута', 'wear lifejackets and clip on'), R('спать по очереди', 'take turns sleeping'), R('выключить огни', 'switch off the lights')], a: 0, e: R('Упавшего ночью найти очень трудно.', 'A person overboard at night is very hard to find.') },
    { q: R('Куда девать сточные воды гальюна в марине?', 'Where does toilet waste go in a marina?'), o: [R('В цистерну и на станцию откачки', 'Into the holding tank and a pump-out station'), R('За борт', 'Overboard'), R('В мусорный пакет', 'In a rubbish bag')], a: 0, e: R('В марине сброс запрещён.', 'Discharge in a marina is prohibited.') }
  ]
};

SA.MODULES['1.4'] = {
  title: R('Документы, флаги, этикет', 'Papers, flags and etiquette'),
  lead: R('Какие бумаги должны быть на борту, где и какие флаги поднимают и как вести себя в марине.', 'Which papers must be on board, which flags fly where, and how to behave in a marina.'),
  goals: [R('перечислить судовые и личные документы;', 'list the boat’s and crew’s documents;'), R('поднять флаг государства и гостевой флаг правильно;', 'fly the ensign and courtesy flag correctly;'), R('соблюдать этикет в марине и при стоянке лагом.', 'follow marina and rafting etiquette.')],
  cards: [
    { h: R('Документы', 'Documents'),
      body: R('<p>На яхте держат: документ о регистрации судна (для маломерного судна в России — судовой билет), страховой полис, разрешение на радиостанцию и список экипажа. Шкиперу нужен [[coc|документ о квалификации]]: в России — удостоверение на право управления маломерным судном, выданное ГИМС; за границей обычно требуют международный сертификат.</p><p>В [[logbook|судовой журнал]] записывают время, место, курс, погоду и все события. Это и навигационный инструмент, и документ.</p>', '<p>On board you carry the registration document, insurance, a radio licence and a crew list. The skipper needs a [[coc|certificate of competence]], such as an IYT certificate or the ICC, which many countries require for charter.</p><p>The [[logbook|logbook]] records time, position, course, weather and every event. It is both a navigation tool and a legal record.</p>'),
      check: { q: R('Что записывают в судовой журнал?', 'What goes in the logbook?'), o: [R('Время, место, курс, погоду и события', 'Time, position, course, weather and events'), R('Только имена экипажа', 'Only the crew names'), R('Только расходы', 'Only expenses')], a: 0, e: R('По журналу можно восстановить место, если откажет электроника.', 'The log lets you work out your position if the electronics fail.') } },
    { h: R('Флаги', 'Flags'), fig: flagsFig,
      body: R('<p>[[ensign|Флаг государства]] поднимают на корме. В чужой стране под правой краспицей поднимают [[courtesy|гостевой флаг]] этой страны: он не должен быть выше и больше вашего флага. По прибытии из-за границы до оформления поднимают жёлтый [[qflag|флаг «Q»]].</p>', '<p>The [[ensign|ensign]] flies at the stern. In a foreign country, fly that country’s [[courtesy|courtesy flag]] under the starboard spreader; it must not be larger or higher than the ensign. Arriving from abroad, fly the yellow [[qflag|Q flag]] until cleared.</p>') },
    { h: R('Этикет', 'Etiquette'),
      body: R('<p>При [[raft|стоянке лагом]] через соседнюю яхту ходят по носовой палубе, а не через кокпит, тихо и с разрешения. Подавайте свои швартовы на берег, а не только на соседа. Вечером в марине тише: звук над водой разносится далеко. Генератор и двигатель без надобности не запускают.</p>', '<p>When [[raft|rafted]], cross another boat via its foredeck, not the cockpit, quietly and with permission. Run your own shore lines rather than relying on your neighbour. Keep the noise down in the evening: sound carries over water. Do not run engines or generators without need.</p>') }
  ],
  water: [{ h: R('Что сделать', 'What to do'), li: [R('Найти на яхте все документы и проверить сроки.', 'Find all the boat’s papers and check expiry dates.'), R('Поднять гостевой флаг и флаг «Q» на нужном фале.', 'Hoist a courtesy flag and the Q flag on the right halyard.')] }],
  quiz: [
    { q: R('Где поднимают гостевой флаг страны пребывания?', 'Where is the courtesy flag flown?'), o: [R('Под правой краспицей', 'Under the starboard spreader'), R('На корме вместо своего', 'At the stern instead of the ensign'), R('Под левой краспицей', 'Under the port spreader')], a: 0, e: R('Правая краспица — почётное место.', 'The starboard spreader is the place of honour.') },
    { q: R('Что означает жёлтый флаг «Q»?', 'What does the yellow Q flag mean?'), o: [R('Прошу оформления по прибытии', 'Requesting clearance on arrival'), R('Человек за бортом', 'Man overboard'), R('Иду под мотором', 'Motoring')], a: 0, e: R('Его поднимают при входе в страну до оформления.', 'Fly it on entry until cleared.') },
    { q: R('Как проходить через соседнюю яхту при стоянке лагом?', 'How do you cross a neighbouring boat when rafted?'), o: [R('По носовой палубе', 'Across the foredeck'), R('Через кокпит', 'Through the cockpit'), R('Через каюту', 'Through the cabin')], a: 0, e: R('Кокпит — личное пространство экипажа.', 'The cockpit is the crew’s private space.') },
    { q: R('Может ли гостевой флаг быть больше вашего государственного?', 'Can the courtesy flag be larger than your ensign?'), o: [R('Нет', 'No'), R('Да', 'Yes'), R('Только в выходные', 'Only at weekends')], a: 0, e: R('Он не должен быть больше и выше вашего флага.', 'It must not be larger or higher than the ensign.') },
    { q: R('Зачем вести судовой журнал?', 'Why keep a logbook?'), o: [R('Для навигации и как официальный документ', 'For navigation and as an official record'), R('Для красоты', 'For decoration'), R('Это необязательно', 'It is optional')], a: 0, e: R('Записи помогут восстановить место и события.', 'Entries let you reconstruct position and events.') },
    { q: R('Какой документ подтверждает квалификацию шкипера?', 'Which document proves the skipper’s competence?'), o: [R('Сертификат или удостоверение на управление судном', 'A certificate of competence'), R('Страховой полис', 'The insurance policy'), R('Список экипажа', 'The crew list')], a: 0, e: R('Сертификат выдаёт признанная организация.', 'It is issued by a recognised body.') }
  ]
};
})();
