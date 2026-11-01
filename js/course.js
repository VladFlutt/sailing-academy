// Course map (sections and modules, in learning order) and the sailor's reference.
(() => {
'use strict';
const SA = window.SA;
const M = (id, ru, en, mins, iyt) => ({ id, title: { ru, en }, mins, iyt });
SA.SECTIONS = [
  { n: 1, title: { ru: 'Яхта и экипаж', en: 'The boat and the crew' }, mods: [
    M('1.1', 'Устройство яхты', 'Parts of a yacht', 35),
    M('1.2', 'Шкипер и экипаж', 'Skipper and crew', 30, 'M3'),
    M('1.3', 'Вахта, усталость, экология, снабжение', 'Watchkeeping, fatigue, environment, provisioning', 30, 'M10'),
    M('1.4', 'Документы, флаги, этикет', 'Papers, flags and etiquette', 30, 'M7') ] },
  { n: 2, title: { ru: 'Безопасность', en: 'Safety' }, mods: [
    M('2.1', 'Личное спасательное снаряжение', 'Personal safety equipment', 35, 'M4'),
    M('2.2', 'Аварийное снабжение, сигналы бедствия, пожар', 'Safety gear, distress signals, fire', 45, 'M5'),
    M('2.3', 'Приёмка яхты и выход из марины', 'Vessel check-out and leaving the marina', 35, 'M6'),
    M('2.4', 'Опрокидывание, заливание, затопление', 'Capsize, swamping, sinking', 25, 'M9'),
    M('2.5', 'Человек за бортом', 'Man overboard', 40, 'M17'),
    M('2.6', 'Первая помощь и переохлаждение', 'First aid and hypothermia', 40, 'M19') ] },
  { n: 3, title: { ru: 'Парус', en: 'Sailing' }, mods: [
    M('3.1', 'Рангоут, такелаж, паруса, лебёдки', 'Spars, rigging, sails, winches', 40, 'M1'),
    M('3.2', 'Курсы относительно ветра', 'Points of sail', 50, 'M1'),
    M('3.3', 'Как работает парус и его настройка', 'How sails work and sail trim', 40),
    M('3.4', 'Рифление и уменьшение парусности', 'Reefing and reducing sail', 30, 'M1'),
    M('3.5', 'Тросы и узлы', 'Ropes and knots', 35, 'M8') ] },
  { n: 4, title: { ru: 'Маневрирование', en: 'Boat handling' }, mods: [
    M('4.1', 'Двигатель: пуск и неисправности', 'Engine: starting and faults', 30, 'M11'),
    M('4.2', 'Швартовка и отход под мотором', 'Berthing and leaving under power', 45, 'M12'),
    M('4.3', 'Якорение и посадка на мель', 'Anchoring and running aground', 40, 'M18'),
    M('4.4', 'Свежая погода', 'Heavy weather', 30, 'M12') ] },
  { n: 5, title: { ru: 'Правила плавания', en: 'Rules of the road' }, mods: [
    M('5.1', 'МППСС: правила расхождения', 'COLREGs: steering and sailing rules', 50, 'M2'),
    M('5.2', 'Огни, знаки и звуковые сигналы', 'Lights, shapes and sound signals', 50),
    M('5.3', 'Навигационное ограждение МАМЭМ', 'IALA buoyage', 45, 'M16'),
    M('5.4', 'Правила вашего трека: ГИМС / IYT', 'Your track’s rules: GIMS / IYT', 30) ] },
  { n: 6, title: { ru: 'Навигация и погода', en: 'Navigation and weather' }, mods: [
    M('6.1', 'Морские карты и пособия', 'Charts and publications', 35, 'M14'),
    M('6.2', 'Компас и прокладка', 'Compass and chartwork', 60),
    M('6.3', 'Приливы и течения', 'Tides and currents', 50, 'M15'),
    M('6.4', 'Метеорология и прогнозы', 'Meteorology and forecasts', 50, 'M13'),
    M('6.5', 'Электронная навигация: GPS, картплоттер, AIS', 'Electronic navigation: GPS, plotter, AIS', 30) ] },
  { n: 7, title: { ru: 'Радиосвязь и переход', en: 'Radio and passage' }, mods: [
    M('7.1', 'УКВ-радиосвязь и сигналы бедствия', 'VHF radio and distress calls', 40),
    M('7.2', 'Планирование перехода', 'Passage planning', 45) ] }
];

const L = (n, url, d) => ({ n, url, d });
const B = (s) => ({ ru: s, en: s });
SA.RESOURCES = {
  title: { ru: 'Справочник яхтсмена', en: 'Sailor’s reference' },
  lead: { ru: 'Таблицы, которые нужны под рукой, и проверенные ресурсы. Перед выходом всегда сверяйтесь с официальными прогнозами и местными лоциями.', en: 'Tables to keep at hand and trusted resources. Before you sail, always check the official forecasts and local pilot books.' },
  blocks: [
    { h: { ru: 'Шкала Бофорта', en: 'Beaufort scale' }, html: () => {
      const ru = SA.lang === 'ru';
      const rows = [[0, '<1', ru ? 'Штиль' : 'Calm', ru ? 'Зеркальная гладь' : 'Mirror-like sea'], [1, '1–3', ru ? 'Тихий' : 'Light air', ru ? 'Рябь' : 'Ripples'], [2, '4–6', ru ? 'Лёгкий' : 'Light breeze', ru ? 'Мелкие волны, гребни не опрокидываются' : 'Small wavelets, crests do not break'], [3, '7–10', ru ? 'Слабый' : 'Gentle breeze', ru ? 'Отдельные барашки' : 'Scattered white horses'], [4, '11–16', ru ? 'Умеренный' : 'Moderate breeze', ru ? 'Много барашков' : 'Frequent white horses'], [5, '17–21', ru ? 'Свежий' : 'Fresh breeze', ru ? 'Барашки повсюду, брызги. Пора брать риф' : 'White horses everywhere, spray. Time to reef'], [6, '22–27', ru ? 'Сильный' : 'Strong breeze', ru ? 'Крупные волны с пеной. Предел для учебных выходов' : 'Large waves, foam. Limit for training trips'], [7, '28–33', ru ? 'Крепкий' : 'Near gale', ru ? 'Пена полосами по ветру' : 'Foam blown in streaks'], [8, '34–40', ru ? 'Очень крепкий' : 'Gale', ru ? 'Высокие волны, срыв гребней' : 'High waves, crests break into spindrift'], [9, '41–47', ru ? 'Шторм' : 'Severe gale', ru ? 'Плотные полосы пены, видимость падает' : 'Dense foam, visibility affected'], [10, '48–55', ru ? 'Сильный шторм' : 'Storm', ru ? 'Море белое от пены' : 'Sea white with foam'], [11, '56–63', ru ? 'Жестокий шторм' : 'Violent storm', ru ? 'Исключительно высокие волны' : 'Exceptionally high waves'], [12, '64+', ru ? 'Ураган' : 'Hurricane', ru ? 'Воздух заполнен пеной и брызгами' : 'Air filled with foam and spray']];
      return `<div class="tblwrap"><table class="tbl"><thead><tr><th>${ru ? 'Балл' : 'Force'}</th><th>${ru ? 'Узлы' : 'Knots'}</th><th>${ru ? 'Название' : 'Name'}</th><th>${ru ? 'Состояние моря' : 'Sea state'}</th></tr></thead><tbody>${rows.map((r) => `<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
    } },
    { h: { ru: 'Сигналы бедствия и фонетический алфавит', en: 'Distress calls and the phonetic alphabet' }, html: () => {
      const ru = SA.lang === 'ru';
      const ph = 'Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(' ');
      return `<div style="display:grid;gap:14px"><div class="tblwrap"><table class="tbl"><thead><tr><th>${ru ? 'Сигнал' : 'Call'}</th><th>${ru ? 'Когда' : 'When'}</th></tr></thead><tbody>
        <tr><td><b>MAYDAY</b> ×3</td><td>${ru ? 'Непосредственная угроза жизни или судну: тонем, пожар, человек за бортом. Канал 16 / DSC Distress.' : 'Grave and imminent danger to life or the vessel: sinking, fire, man overboard. Channel 16 / DSC Distress.'}</td></tr>
        <tr><td><b>PAN-PAN</b> ×3</td><td>${ru ? 'Срочное сообщение без непосредственной угрозы жизни: отказ двигателя у берега, травма.' : 'Urgent, but no immediate danger to life: engine failure near a lee shore, an injury.'}</td></tr>
        <tr><td><b>SÉCURITÉ</b> ×3</td><td>${ru ? 'Сообщение о безопасности мореплавания: плавающее бревно, погасший маяк.' : 'Safety message: a floating log, an unlit light.'}</td></tr></tbody></table></div>
        <p class="mono" style="font-size:.9rem;line-height:1.8">${ph.map((w) => `<b>${w[0]}</b> ${w}`).join(' · ')}</p></div>`;
    } },
    { h: { ru: 'Ресурсы', en: 'Resources' }, cards: [
      { h: { ru: 'Погода', en: 'Weather' }, li: [L(B('Windy'), 'https://www.windy.com', { ru: 'карты ветра и волн по нескольким моделям', en: 'wind and wave maps from several models' }), L(B('PredictWind'), 'https://www.predictwind.com', { ru: 'прогнозы и маршрутизация для яхт', en: 'forecasts and routing for yachts' }), L({ ru: 'Гидрометцентр России', en: 'Hydrometcentre of Russia' }, 'https://meteoinfo.ru', { ru: 'официальные прогнозы и штормовые предупреждения РФ', en: 'official Russian forecasts and warnings' }), L({ ru: 'Met Office: морской прогноз', en: 'Met Office shipping forecast' }, 'https://weather.metoffice.gov.uk/specialist-forecasts/coast-and-sea', { ru: 'пример официального морского прогноза', en: 'an example of an official marine forecast' })] },
      { h: { ru: 'Карты и навигация', en: 'Charts and navigation' }, li: [L(B('Navionics'), 'https://www.navionics.com', { ru: 'электронные карты и приложение', en: 'electronic charts and app' }), L(B('OpenSeaMap'), 'https://map.openseamap.org', { ru: 'открытая морская карта', en: 'open nautical chart' }), L(B('MarineTraffic'), 'https://www.marinetraffic.com', { ru: 'суда по данным AIS', en: 'ships from AIS data' }), L({ ru: 'IHO: INT 1 (условные знаки карт)', en: 'IHO: INT 1 (chart symbols)' }, 'https://iho.int', { ru: 'стандарт символов на морских картах', en: 'the standard for chart symbols' })] },
      { h: { ru: 'Правила и документы', en: 'Rules and documents' }, li: [L({ ru: 'МППСС-72 (COLREGs), текст IMO', en: 'COLREGs, IMO text' }, 'https://www.imo.org/en/About/Conventions/Pages/COLREG.aspx', { ru: 'международные правила предупреждения столкновений', en: 'the international collision regulations' }), L({ ru: 'ГИМС МЧС России', en: 'GIMS (EMERCOM of Russia)' }, 'https://mchs.gov.ru', { ru: 'регистрация маломерных судов, аттестация судоводителей', en: 'small craft registration and skipper certification in Russia' }), L(B('IALA'), 'https://www.iala-aism.org', { ru: 'система навигационного ограждения МАМЭМ', en: 'the maritime buoyage system' })] },
      { h: { ru: 'Организации и обучение', en: 'Organisations and training' }, li: [L({ ru: 'IYT Worldwide', en: 'IYT Worldwide' }, 'https://www.iytworld.com', { ru: 'международные сертификаты яхтенной подготовки', en: 'international yacht training certificates' }), L({ ru: 'ВФПС', en: 'Russian Sailing Federation' }, 'https://www.rusyachting.ru', { ru: 'Всероссийская федерация парусного спорта', en: 'national sailing federation' }), L(B('World Sailing'), 'https://www.sailing.org', { ru: 'международная федерация', en: 'the world governing body' }), L(B('RYA'), 'https://www.rya.org.uk', { ru: 'британская ассоциация, много открытых учебных материалов', en: 'UK association with plenty of open learning material' })] },
      { h: { ru: 'Экстренные номера', en: 'Emergency numbers' }, li: [L({ ru: '112', en: '112' }, null, { ru: 'единый номер экстренных служб в России и ЕС', en: 'single emergency number in Russia and the EU' }), L({ ru: 'УКВ канал 16', en: 'VHF channel 16' }, null, { ru: 'вызов и бедствие на море', en: 'calling and distress at sea' }), L({ ru: 'МСКЦ / MRCC', en: 'MRCC' }, null, { ru: 'морской спасательно-координационный центр вашего района: запишите номер перед выходом', en: 'the rescue coordination centre for your area: note its number before you sail' })] }
    ] }
  ]
};
})();
