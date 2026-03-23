const operations = [
  // ──────────────── Северное (field1) — пшеница ────────────────
  { id: 'op1',  fieldId: 'field1', date: '2024-09-15', timeStart: '08:00', timeEnd: '12:00', type: 'Посев',               status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq1' },
  { id: 'op2',  fieldId: 'field1', date: '2024-11-10', timeStart: '09:00', timeEnd: '11:00', type: 'ВнесениеУдобрений',   status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq5' },
  { id: 'op3',  fieldId: 'field1', date: '2025-04-20', timeStart: '10:00', timeEnd: '14:00', type: 'Обработка',           status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op4',  fieldId: 'field1', date: '2025-07-25', timeStart: '07:00', timeEnd: '16:00', type: 'Уборка',              status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq2' },

  // ──────────────── Южное (field2) — подсолнечник ───────────────
  { id: 'op5',  fieldId: 'field2', date: '2025-04-28', timeStart: '09:00', timeEnd: '13:00', type: 'Посев',               status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq1' },
  { id: 'op6',  fieldId: 'field2', date: '2025-05-15', timeStart: '11:00', timeEnd: '14:00', type: 'Обработка',           status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op7',  fieldId: 'field2', date: '2025-09-10', timeStart: '07:00', timeEnd: '17:00', type: 'Уборка',              status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq2' },

  // ──────────────── Западное (field3) — кукуруза ────────────────
  { id: 'op8',  fieldId: 'field3', date: '2025-05-05', timeStart: '08:00', timeEnd: '12:00', type: 'Посев',               status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq5' },
  { id: 'op9',  fieldId: 'field3', date: '2025-06-01', timeStart: '10:00', timeEnd: '12:00', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq1' },
  { id: 'op10', fieldId: 'field3', date: '2025-06-20', timeStart: '09:00', timeEnd: '13:00', type: 'Обработка',           status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq3' },
  { id: 'op11', fieldId: 'field3', date: '2025-10-05', timeStart: '07:00', timeEnd: '15:00', type: 'Уборка',              status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq2' },

  // ──────────────── Восточное (field4) — ячмень ─────────────────
  { id: 'op12', fieldId: 'field4', date: '2025-04-10', timeStart: '08:00', timeEnd: '12:00', type: 'Посев',               status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp4', equipmentId: 'eq1' },
  { id: 'op13', fieldId: 'field4', date: '2025-07-10', timeStart: '07:00', timeEnd: '16:00', type: 'Уборка',              status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp4', equipmentId: 'eq2' },

  // ──────────────── Прошлая неделя (16–22 марта 2026) ─────────────
  { id: 'op14', fieldId: 'field1', date: '2026-03-17', timeStart: '09:00', timeEnd: '11:00', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq5' },
  { id: 'op15', fieldId: 'field2', date: '2026-03-18', timeStart: '10:00', timeEnd: '13:00', type: 'Обработка',           status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op16', fieldId: 'field3', date: '2026-03-19', timeStart: '09:00', timeEnd: '12:00', type: 'Посев',               status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq1' },
  { id: 'op17', fieldId: 'field1', date: '2026-03-20', timeStart: '14:00', timeEnd: '16:00', type: 'Обработка',           status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op18', fieldId: 'field2', date: '2026-03-21', timeStart: '08:00', timeEnd: '10:00', type: 'Посев',               status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq1' },
  { id: 'op19', fieldId: 'field3', date: '2026-03-22', timeStart: '11:00', timeEnd: '14:00', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp3', equipmentId: 'eq5' },

  // ──────────────── Текущая неделя (23–29 марта 2026) ──────────────
  // Понедельник 23 — сегодня
  { id: 'op20', fieldId: 'field1', date: '2026-03-23', timeStart: '09:00', timeEnd: '11:00', type: 'ВнесениеУдобрений',  status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq5' },
  { id: 'op21', fieldId: 'field2', date: '2026-03-23', timeStart: '11:30', timeEnd: '13:30', type: 'Обработка',           status: 'Факт', calendarStatus: 'В процессе', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op22', fieldId: 'field3', date: '2026-03-23', timeStart: '15:00', timeEnd: '17:00', type: 'Посев',               status: 'План', calendarStatus: 'Запланировано', cropId: 'crp3', equipmentId: 'eq1' },

  // Вторник 24
  { id: 'op23', fieldId: 'field1', date: '2026-03-24', timeStart: '09:00', timeEnd: '12:00', type: 'Посев',               status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq1' },
  { id: 'op24', fieldId: 'field2', date: '2026-03-24', timeStart: '14:00', timeEnd: '16:00', type: 'ВнесениеУдобрений',  status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq5' },

  // Среда 25
  { id: 'op25', fieldId: 'field3', date: '2026-03-25', timeStart: '10:00', timeEnd: '13:00', type: 'Обработка',           status: 'План', calendarStatus: 'Запланировано', cropId: 'crp3', equipmentId: 'eq3' },

  // Четверг 26
  { id: 'op26', fieldId: 'field1', date: '2026-03-26', timeStart: '09:00', timeEnd: '11:00', type: 'Уборка',              status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq2' },
  { id: 'op27', fieldId: 'field2', date: '2026-03-26', timeStart: '13:00', timeEnd: '15:00', type: 'Обработка',           status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },

  // Пятница 27
  { id: 'op28', fieldId: 'field3', date: '2026-03-27', timeStart: '08:00', timeEnd: '10:00', type: 'ВнесениеУдобрений',  status: 'План', calendarStatus: 'Запланировано', cropId: 'crp3', equipmentId: 'eq5' },

  // Следующая неделя (30+ марта 2026) — для "Ближайшие задачи" в sidebar
  { id: 'op29', fieldId: 'field1', date: '2026-03-30', timeStart: '09:00', timeEnd: '13:00', type: 'Посев',               status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq1' },
  { id: 'op30', fieldId: 'field2', date: '2026-04-01', timeStart: '10:00', timeEnd: '14:00', type: 'Обработка',           status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },
];

module.exports = operations;
