const operations = [
  // Актуальный сезон 2026: выполненные работы за май
  { id: 'op1',  fieldId: 'field1',  date: '2026-05-20', timeStart: '07:30', timeEnd: '11:20', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op2',  fieldId: 'field2',  date: '2026-05-20', timeStart: '12:10', timeEnd: '16:40', type: 'Посев',             status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq6' },
  { id: 'op3',  fieldId: 'field3',  date: '2026-05-21', timeStart: '08:00', timeEnd: '12:10', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op4',  fieldId: 'field4',  date: '2026-05-21', timeStart: '13:00', timeEnd: '17:20', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op5',  fieldId: 'field5',  date: '2026-05-22', timeStart: '07:20', timeEnd: '12:00', type: 'Посев',             status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq6' },
  { id: 'op6',  fieldId: 'field6',  date: '2026-05-22', timeStart: '12:40', timeEnd: '16:30', type: 'Посев',             status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq6' },
  { id: 'op7',  fieldId: 'field7',  date: '2026-05-23', timeStart: '07:40', timeEnd: '10:50', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op8',  fieldId: 'field8',  date: '2026-05-23', timeStart: '11:30', timeEnd: '15:30', type: 'Посев',             status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq6' },
  { id: 'op9',  fieldId: 'field9',  date: '2026-05-24', timeStart: '08:00', timeEnd: '11:10', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op10', fieldId: 'field10', date: '2026-05-24', timeStart: '12:00', timeEnd: '14:40', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },

  { id: 'op11', fieldId: 'field1',  date: '2026-05-26', timeStart: '08:10', timeEnd: '12:00', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op12', fieldId: 'field2',  date: '2026-05-26', timeStart: '13:00', timeEnd: '16:10', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op13', fieldId: 'field3',  date: '2026-05-27', timeStart: '07:30', timeEnd: '10:30', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op14', fieldId: 'field4',  date: '2026-05-27', timeStart: '11:20', timeEnd: '14:30', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op15', fieldId: 'field5',  date: '2026-05-28', timeStart: '08:00', timeEnd: '12:20', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op16', fieldId: 'field6',  date: '2026-05-28', timeStart: '13:00', timeEnd: '16:50', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op17', fieldId: 'field7',  date: '2026-05-29', timeStart: '07:50', timeEnd: '11:10', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op18', fieldId: 'field8',  date: '2026-05-29', timeStart: '12:00', timeEnd: '15:40', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op19', fieldId: 'field9',  date: '2026-05-30', timeStart: '08:30', timeEnd: '11:30', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op20', fieldId: 'field10', date: '2026-05-30', timeStart: '12:10', timeEnd: '15:00', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },

  // Первая неделя июня: журнал похож на рабочую смену хозяйства
  { id: 'op21', fieldId: 'field1',  date: '2026-06-01', timeStart: '07:40', timeEnd: '10:30', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op22', fieldId: 'field2',  date: '2026-06-01', timeStart: '11:10', timeEnd: '14:00', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq7' },
  { id: 'op23', fieldId: 'field3',  date: '2026-06-02', timeStart: '08:20', timeEnd: '11:40', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op24', fieldId: 'field4',  date: '2026-06-02', timeStart: '12:30', timeEnd: '15:20', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op25', fieldId: 'field5',  date: '2026-06-03', timeStart: '07:30', timeEnd: '10:10', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq7' },
  { id: 'op26', fieldId: 'field6',  date: '2026-06-03', timeStart: '10:50', timeEnd: '14:20', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op27', fieldId: 'field7',  date: '2026-06-04', timeStart: '08:00', timeEnd: '12:00', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op28', fieldId: 'field8',  date: '2026-06-04', timeStart: '13:10', timeEnd: '16:40', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq7' },
  { id: 'op29', fieldId: 'field9',  date: '2026-06-05', timeStart: '07:50', timeEnd: '11:30', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op30', fieldId: 'field10', date: '2026-06-05', timeStart: '12:20', timeEnd: '15:10', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op31', fieldId: 'field2',  date: '2026-06-06', timeStart: '08:10', timeEnd: '11:00', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op32', fieldId: 'field5',  date: '2026-06-06', timeStart: '11:40', timeEnd: '14:30', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op33', fieldId: 'field1',  date: '2026-06-07', timeStart: '08:00', timeEnd: '10:30', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op34', fieldId: 'field8',  date: '2026-06-07', timeStart: '11:10', timeEnd: '14:20', type: 'Обработка',         status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op35', fieldId: 'field3',  date: '2026-06-08', timeStart: '07:30', timeEnd: '10:20', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op36', fieldId: 'field6',  date: '2026-06-08', timeStart: '10:50', timeEnd: '14:00', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено', cropId: 'crp2', equipmentId: 'eq7' },

  // Сегодня, 9 июня 2026: несколько операций уже закрыты, несколько идут в работе
  { id: 'op37', fieldId: 'field4',  date: '2026-06-09', timeStart: '07:20', timeEnd: '09:50', type: 'ВнесениеУдобрений', status: 'Факт', calendarStatus: 'Выполнено',   cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op38', fieldId: 'field7',  date: '2026-06-09', timeStart: '08:00', timeEnd: '12:00', type: 'Обработка',         status: 'Факт', calendarStatus: 'В процессе', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op39', fieldId: 'field10', date: '2026-06-09', timeStart: '10:20', timeEnd: '13:30', type: 'Обработка',         status: 'Факт', calendarStatus: 'В процессе', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op40', fieldId: 'field5',  date: '2026-06-09', timeStart: '14:00', timeEnd: '16:30', type: 'Обработка',         status: 'Факт', calendarStatus: 'В процессе', cropId: 'crp2', equipmentId: 'eq3' },

  // Один ближайший план на месяц вперед для каждого поля
  { id: 'op41', fieldId: 'field1',  date: '2026-06-11', timeStart: '07:30', timeEnd: '11:00', type: 'Обработка',         status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op42', fieldId: 'field2',  date: '2026-06-13', timeStart: '08:20', timeEnd: '11:40', type: 'Обработка',         status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op43', fieldId: 'field3',  date: '2026-06-16', timeStart: '06:50', timeEnd: '10:30', type: 'Обработка',         status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op44', fieldId: 'field4',  date: '2026-06-18', timeStart: '07:40', timeEnd: '10:20', type: 'ВнесениеУдобрений', status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq7' },
  { id: 'op45', fieldId: 'field5',  date: '2026-06-20', timeStart: '09:00', timeEnd: '12:30', type: 'Обработка',         status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op46', fieldId: 'field6',  date: '2026-06-23', timeStart: '08:10', timeEnd: '11:20', type: 'ВнесениеУдобрений', status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq7' },
  { id: 'op47', fieldId: 'field7',  date: '2026-06-26', timeStart: '07:20', timeEnd: '11:10', type: 'Уборка',            status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq2' },
  { id: 'op48', fieldId: 'field8',  date: '2026-06-29', timeStart: '08:30', timeEnd: '12:00', type: 'Обработка',         status: 'План', calendarStatus: 'Запланировано', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op49', fieldId: 'field9',  date: '2026-07-03', timeStart: '06:40', timeEnd: '11:30', type: 'Уборка',            status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq2' },
  { id: 'op50', fieldId: 'field10', date: '2026-07-08', timeStart: '07:10', timeEnd: '10:40', type: 'Уборка',            status: 'План', calendarStatus: 'Запланировано', cropId: 'crp1', equipmentId: 'eq2' },
];

module.exports = operations;
