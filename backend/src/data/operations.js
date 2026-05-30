const operations = [
  // Сезон 2025 — завершенная история для отчетов и карточек полей
  { id: 'op1',  fieldId: 'field1', date: '2025-09-12', timeStart: '08:00', timeEnd: '13:00', type: 'Посев',              status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq6' },
  { id: 'op2',  fieldId: 'field1', date: '2025-10-18', timeStart: '09:00', timeEnd: '12:00', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op3',  fieldId: 'field1', date: '2026-03-28', timeStart: '08:30', timeEnd: '11:30', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op4',  fieldId: 'field1', date: '2026-04-11', timeStart: '10:00', timeEnd: '14:00', type: 'Обработка',          status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op5',  fieldId: 'field2', date: '2026-04-18', timeStart: '08:00', timeEnd: '12:30', type: 'Посев',              status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq6' },
  { id: 'op6',  fieldId: 'field2', date: '2026-05-03', timeStart: '10:00', timeEnd: '13:30', type: 'Обработка',          status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op7',  fieldId: 'field3', date: '2026-04-24', timeStart: '07:30', timeEnd: '12:00', type: 'Посев',              status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq6' },
  { id: 'op8',  fieldId: 'field3', date: '2026-05-07', timeStart: '09:00', timeEnd: '11:30', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq7' },

  // Прошлая неделя относительно 18 мая 2026
  { id: 'op13', fieldId: 'field1', date: '2026-05-11', timeStart: '08:00', timeEnd: '10:30', type: 'Обработка',          status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op14', fieldId: 'field2', date: '2026-05-11', timeStart: '11:00', timeEnd: '13:00', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq7' },
  { id: 'op15', fieldId: 'field3', date: '2026-05-12', timeStart: '09:00', timeEnd: '12:00', type: 'Обработка',          status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq3' },
  { id: 'op18', fieldId: 'field1', date: '2026-05-15', timeStart: '07:30', timeEnd: '09:30', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op19', fieldId: 'field2', date: '2026-05-16', timeStart: '08:00', timeEnd: '11:00', type: 'Обработка',          status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op20', fieldId: 'field3', date: '2026-05-17', timeStart: '12:00', timeEnd: '14:00', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq7' },

  // Текущая неделя: понедельник 18 мая 2026 — сегодня
  { id: 'op21', fieldId: 'field1', date: '2026-05-18', timeStart: '08:00', timeEnd: '11:00', type: 'Обработка',          status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op22', fieldId: 'field2', date: '2026-05-18', timeStart: '11:30', timeEnd: '14:00', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'В процессе', cropId: 'crp2', equipmentId: 'eq7' },
  { id: 'op24', fieldId: 'field3', date: '2026-05-19', timeStart: '08:00', timeEnd: '12:00', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp3', equipmentId: 'eq3' },
  { id: 'op26', fieldId: 'field1', date: '2026-05-20', timeStart: '09:00', timeEnd: '12:30', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op27', fieldId: 'field2', date: '2026-05-20', timeStart: '14:00', timeEnd: '16:00', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op29', fieldId: 'field3', date: '2026-05-21', timeStart: '12:00', timeEnd: '15:00', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp3', equipmentId: 'eq3' },
  { id: 'op31', fieldId: 'field1', date: '2026-05-22', timeStart: '11:00', timeEnd: '13:30', type: 'ВнесениеУдобрений',  status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op32', fieldId: 'field2', date: '2026-05-23', timeStart: '08:00', timeEnd: '11:00', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },

  // Ближайший план до конца июня 2026
  { id: 'op35', fieldId: 'field3', date: '2026-05-26', timeStart: '09:00', timeEnd: '11:30', type: 'ВнесениеУдобрений',  status: 'План', calendarStatus: 'Запланировано', cropId: 'crp3', equipmentId: 'eq7' },
  { id: 'op36', fieldId: 'field2', date: '2026-05-27', timeStart: '10:00', timeEnd: '13:00', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op37', fieldId: 'field1', date: '2026-05-29', timeStart: '08:00', timeEnd: '12:00', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op39', fieldId: 'field3', date: '2026-06-02', timeStart: '07:30', timeEnd: '11:30', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp3', equipmentId: 'eq3' },
  { id: 'op41', fieldId: 'field2', date: '2026-06-06', timeStart: '08:00', timeEnd: '12:00', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op42', fieldId: 'field1', date: '2026-06-09', timeStart: '07:30', timeEnd: '10:30', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op44', fieldId: 'field3', date: '2026-06-15', timeStart: '08:00', timeEnd: '11:00', type: 'ВнесениеУдобрений',  status: 'План', calendarStatus: 'Запланировано', cropId: 'crp3', equipmentId: 'eq7' },
  { id: 'op46', fieldId: 'field1', date: '2026-06-22', timeStart: '08:00', timeEnd: '12:00', type: 'Обработка',          status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op47', fieldId: 'field2', date: '2026-06-25', timeStart: '08:30', timeEnd: '11:30', type: 'ВнесениеУдобрений',  status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq7' },
];

module.exports = operations;
