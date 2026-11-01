// Simulator: VHF radio — channels, call types and procedure (module 7.1).
(() => {
'use strict';
const SA = window.SA;
const R = (ru, en) => ({ ru, en });
const Q = (q, o, e) => ({ q, o, a: 0, e });
const ITEMS = [
  Q(R('На каком канале подают сигнал бедствия голосом?', 'Which channel is used for a voice distress call?'), [R('16', '16'), R('70', '70'), R('6', '6')], R('Канал 70 — только для цифровых вызовов DSC.', 'Channel 70 is for DSC data only.')),
  Q(R('Яхта без двигателя дрейфует на камни в 1 миле. Какой вызов?', 'Your engine has failed and you are drifting towards rocks a mile away. Which call?'), [R('MAYDAY', 'MAYDAY'), R('SÉCURITÉ', 'SÉCURITÉ'), R('Обычный вызов марины', 'A routine call to the marina')], R('Непосредственная угроза судну и людям.', 'Grave and imminent danger to the boat and crew.')),
  Q(R('Член экипажа сломал руку, вы в 10 милях от порта. Какой вызов?', 'A crew member has broken an arm, 10 miles from port. Which call?'), [R('PAN-PAN', 'PAN-PAN'), R('MAYDAY', 'MAYDAY'), R('Никакой', 'None')], R('Срочно, но жизни прямо сейчас не угрожает. Попросите медицинскую консультацию.', 'Urgent but not life-threatening. Ask for medical advice.')),
  Q(R('Вы увидели плавающий контейнер на фарватере. Какой вызов?', 'You see a floating container in the fairway. Which call?'), [R('SÉCURITÉ', 'SÉCURITÉ'), R('MAYDAY', 'MAYDAY'), R('PAN-PAN', 'PAN-PAN')], R('Сообщение о безопасности мореплавания.', 'A navigational safety message.')),
  Q(R('Вы вызвали другую яхту на 16 канале, она ответила. Что дальше?', 'You called another yacht on 16 and it answered. What next?'), [R('Перейти на рабочий канал, например 72', 'Switch to a working channel such as 72'), R('Разговаривать на 16', 'Talk on 16'), R('Выключить радио', 'Turn the radio off')], R('16 канал держат свободным для бедствия и вызова.', 'Keep 16 clear for distress and calling.')),
  Q(R('Что значит «Приём» (Over)?', 'What does “Over” mean?'), [R('Я закончил фразу, жду ответа', 'I have finished and expect a reply'), R('Связь окончена', 'The conversation is finished'), R('Повторите', 'Say again')], R('«Конец связи» — Out. Вместе «Over and out» не говорят.', '“Out” ends the exchange. Never say “over and out”.')),
  Q(R('Вы случайно нажали кнопку Distress. Что сделать?', 'You pressed the Distress button by mistake. What do you do?'), [R('Выключить радио и на 16 канале голосом отменить сигнал', 'Switch off, then cancel by voice on channel 16'), R('Ничего', 'Nothing'), R('Подать ещё один', 'Send another')], R('«Всем станциям, это яхта… отменяю мой сигнал бедствия от … UTC».', '“All stations, this is yacht… cancel my distress alert of … UTC”.')),
  Q(R('Какое слово используют, чтобы попросить повторить?', 'Which proword asks for a repeat?'), [R('Say again', 'Say again'), R('Repeat', 'Repeat'), R('Over', 'Over')], R('Repeat в радиообмене не используют.', '“Repeat” is not used on the radio.')),
  Q(R('Что передаёт кнопка Distress на радио с DSC?', 'What does the DSC Distress button send?'), [R('Сигнал бедствия, MMSI и координаты', 'An alert with your MMSI and position'), R('Голосовое сообщение', 'A voice message'), R('Прогноз погоды', 'A weather forecast')], R('Если радио подключено к GPS.', 'If the radio is connected to GPS.')),
  Q(R('Какая мощность для разговора с яхтой в соседней марине?', 'What power for talking to a yacht in the next berth?'), [R('Малая, 1 Вт', 'Low, 1 W'), R('Полная, 25 Вт', 'Full, 25 W'), R('Неважно', 'It does not matter')], R('Малая мощность не мешает другим.', 'Low power avoids blocking others.')),
  Q(R('Какой первый элемент MAYDAY после трёх MAYDAY?', 'What comes right after MAYDAY ×3?'), [R('«Это яхта…» и название три раза', '“This is yacht…” and the name three times'), R('Координаты', 'The position'), R('Число людей', 'Persons on board')], R('Потом MAYDAY, название, позывной и место.', 'Then MAYDAY, name, call sign and position.'))
];
SA.SIMS.vhf = {
  title: R('Тренажёр радиообмена', 'VHF radio trainer'),
  intro: R('Что сказать, на каком канале и каким типом вызова. Цель: 8 верных ответов. На настоящей радиостанции учебные вызовы не передают.', 'What to say, on which channel and with which call type. Goal: 8 correct. Never send practice calls on a real radio.'),
  mount(host, api) { SA.trainer(host, { key: 'sim.vhf', items: ITEMS, goal: 8, api, label: 'VHF radio trainer' }); }
};
})();
