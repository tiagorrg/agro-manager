const operations = [
  // Северное (field1) — пшеница
  { id: 'op1',  fieldId: 'field1', date: '2024-09-15', type: 'Посев',                status: 'Факт', cropId: 'crp1', equipmentId: 'eq1' },
  { id: 'op2',  fieldId: 'field1', date: '2024-11-10', type: 'ВнесениеУдобрений',    status: 'Факт', cropId: 'crp1', equipmentId: 'eq5' },
  { id: 'op3',  fieldId: 'field1', date: '2025-04-20', type: 'Обработка',            status: 'Факт', cropId: 'crp1', equipmentId: 'eq3' },
  { id: 'op4',  fieldId: 'field1', date: '2025-07-25', type: 'Уборка',               status: 'План', cropId: 'crp1', equipmentId: 'eq2' },

  // Южное (field2) — подсолнечник
  { id: 'op5',  fieldId: 'field2', date: '2025-04-28', type: 'Посев',                status: 'Факт', cropId: 'crp2', equipmentId: 'eq1' },
  { id: 'op6',  fieldId: 'field2', date: '2025-05-15', type: 'Обработка',            status: 'Факт', cropId: 'crp2', equipmentId: 'eq3' },
  { id: 'op7',  fieldId: 'field2', date: '2025-09-10', type: 'Уборка',               status: 'План', cropId: 'crp2', equipmentId: 'eq2' },

  // Западное (field3) — кукуруза
  { id: 'op8',  fieldId: 'field3', date: '2025-05-05', type: 'Посев',                status: 'Факт', cropId: 'crp3', equipmentId: 'eq5' },
  { id: 'op9',  fieldId: 'field3', date: '2025-06-01', type: 'ВнесениеУдобрений',   status: 'Факт', cropId: 'crp3', equipmentId: 'eq1' },
  { id: 'op10', fieldId: 'field3', date: '2025-06-20', type: 'Обработка',            status: 'Факт', cropId: 'crp3', equipmentId: 'eq3' },
  { id: 'op11', fieldId: 'field3', date: '2025-10-05', type: 'Уборка',               status: 'План', cropId: 'crp3', equipmentId: 'eq2' },

  // Восточное (field4) — ячмень
  { id: 'op12', fieldId: 'field4', date: '2025-04-10', type: 'Посев',                status: 'Факт', cropId: 'crp4', equipmentId: 'eq1' },
  { id: 'op13', fieldId: 'field4', date: '2025-07-10', type: 'Уборка',               status: 'Факт', cropId: 'crp4', equipmentId: 'eq2' },
];

module.exports = operations;
