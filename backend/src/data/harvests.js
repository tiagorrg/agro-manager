const harvests = [
  // Поле №1 — пшеница озимая
  { id: 'h1',  fieldId: 'field1',  date: '2025-07-31', cropId: 'crp1', grossHarvest: 583.2, yield: 48.4, grainQuality: '2 класс' },
  { id: 'h2',  fieldId: 'field1',  date: '2024-07-29', cropId: 'crp1', grossHarvest: 529.0, yield: 43.9, grainQuality: '3 класс' },
  { id: 'h3',  fieldId: 'field1',  date: '2023-07-27', cropId: 'crp1', grossHarvest: 549.5, yield: 45.6, grainQuality: '3 класс' },
  { id: 'h4',  fieldId: 'field1',  date: '2022-08-01', cropId: 'crp1', grossHarvest: 491.6, yield: 40.8, grainQuality: '3 класс' },

  // Поле №2 — подсолнечник
  { id: 'h5',  fieldId: 'field2',  date: '2025-09-16', cropId: 'crp2', grossHarvest: 261.8, yield: 30.8, grainQuality: null },
  { id: 'h6',  fieldId: 'field2',  date: '2024-09-12', cropId: 'crp2', grossHarvest: 248.2, yield: 29.2, grainQuality: null },
  { id: 'h7',  fieldId: 'field2',  date: '2023-09-09', cropId: 'crp2', grossHarvest: 237.2, yield: 27.9, grainQuality: null },
  { id: 'h8',  fieldId: 'field2',  date: '2022-09-14', cropId: 'crp2', grossHarvest: 216.8, yield: 25.5, grainQuality: null },

  // Поле №3 — пшеница озимая
  { id: 'h9',  fieldId: 'field3',  date: '2025-07-31', cropId: 'crp1', grossHarvest: 453.1, yield: 47.7, grainQuality: '2 класс' },
  { id: 'h10', fieldId: 'field3',  date: '2024-07-29', cropId: 'crp1', grossHarvest: 410.4, yield: 43.2, grainQuality: '3 класс' },
  { id: 'h11', fieldId: 'field3',  date: '2023-07-27', cropId: 'crp1', grossHarvest: 426.6, yield: 44.9, grainQuality: '3 класс' },
  { id: 'h12', fieldId: 'field3',  date: '2022-08-01', cropId: 'crp1', grossHarvest: 380.9, yield: 40.1, grainQuality: '3 класс' },

  // Поле №4 — пшеница озимая
  { id: 'h13', fieldId: 'field4',  date: '2025-07-31', cropId: 'crp1', grossHarvest: 492.2, yield: 48.4, grainQuality: '2 класс' },
  { id: 'h14', fieldId: 'field4',  date: '2024-07-29', cropId: 'crp1', grossHarvest: 446.5, yield: 43.9, grainQuality: '3 класс' },
  { id: 'h15', fieldId: 'field4',  date: '2023-07-27', cropId: 'crp1', grossHarvest: 463.8, yield: 45.6, grainQuality: '3 класс' },
  { id: 'h16', fieldId: 'field4',  date: '2022-08-01', cropId: 'crp1', grossHarvest: 414.9, yield: 40.8, grainQuality: '3 класс' },

  // Поле №5 — подсолнечник
  { id: 'h17', fieldId: 'field5',  date: '2025-09-16', cropId: 'crp2', grossHarvest: 319.7, yield: 30.8, grainQuality: null },
  { id: 'h18', fieldId: 'field5',  date: '2024-09-12', cropId: 'crp2', grossHarvest: 303.1, yield: 29.2, grainQuality: null },
  { id: 'h19', fieldId: 'field5',  date: '2023-09-09', cropId: 'crp2', grossHarvest: 289.6, yield: 27.9, grainQuality: null },
  { id: 'h20', fieldId: 'field5',  date: '2022-09-14', cropId: 'crp2', grossHarvest: 264.7, yield: 25.5, grainQuality: null },

  // Поле №6 — подсолнечник
  { id: 'h21', fieldId: 'field6',  date: '2025-09-16', cropId: 'crp2', grossHarvest: 289.9, yield: 29.4, grainQuality: null },
  { id: 'h22', fieldId: 'field6',  date: '2024-09-12', cropId: 'crp2', grossHarvest: 274.1, yield: 27.8, grainQuality: null },
  { id: 'h23', fieldId: 'field6',  date: '2023-09-09', cropId: 'crp2', grossHarvest: 261.3, yield: 26.5, grainQuality: null },
  { id: 'h24', fieldId: 'field6',  date: '2022-09-14', cropId: 'crp2', grossHarvest: 237.6, yield: 24.1, grainQuality: null },

  // Поле №7 — пшеница озимая
  { id: 'h25', fieldId: 'field7',  date: '2025-07-31', cropId: 'crp1', grossHarvest: 473.8, yield: 48.4, grainQuality: '2 класс' },
  { id: 'h26', fieldId: 'field7',  date: '2024-07-29', cropId: 'crp1', grossHarvest: 429.8, yield: 43.9, grainQuality: '3 класс' },
  { id: 'h27', fieldId: 'field7',  date: '2023-07-27', cropId: 'crp1', grossHarvest: 446.4, yield: 45.6, grainQuality: '3 класс' },
  { id: 'h28', fieldId: 'field7',  date: '2022-08-01', cropId: 'crp1', grossHarvest: 399.4, yield: 40.8, grainQuality: '3 класс' },

  // Поле №8 — подсолнечник
  { id: 'h29', fieldId: 'field8',  date: '2025-09-16', cropId: 'crp2', grossHarvest: 235.0, yield: 30.8, grainQuality: null },
  { id: 'h30', fieldId: 'field8',  date: '2024-09-12', cropId: 'crp2', grossHarvest: 222.8, yield: 29.2, grainQuality: null },
  { id: 'h31', fieldId: 'field8',  date: '2023-09-09', cropId: 'crp2', grossHarvest: 212.9, yield: 27.9, grainQuality: null },
  { id: 'h32', fieldId: 'field8',  date: '2022-09-14', cropId: 'crp2', grossHarvest: 194.6, yield: 25.5, grainQuality: null },

  // Поле №9 — пшеница озимая
  { id: 'h33', fieldId: 'field9',  date: '2025-07-31', cropId: 'crp1', grossHarvest: 468.9, yield: 47.7, grainQuality: '2 класс' },
  { id: 'h34', fieldId: 'field9',  date: '2024-07-29', cropId: 'crp1', grossHarvest: 424.7, yield: 43.2, grainQuality: '3 класс' },
  { id: 'h35', fieldId: 'field9',  date: '2023-07-27', cropId: 'crp1', grossHarvest: 441.4, yield: 44.9, grainQuality: '3 класс' },
  { id: 'h36', fieldId: 'field9',  date: '2022-08-01', cropId: 'crp1', grossHarvest: 394.2, yield: 40.1, grainQuality: '3 класс' },

  // Поле №10 — пшеница озимая
  { id: 'h37', fieldId: 'field10', date: '2025-07-31', cropId: 'crp1', grossHarvest: 215.9, yield: 48.4, grainQuality: '2 класс' },
  { id: 'h38', fieldId: 'field10', date: '2024-07-29', cropId: 'crp1', grossHarvest: 195.8, yield: 43.9, grainQuality: '3 класс' },
  { id: 'h39', fieldId: 'field10', date: '2023-07-27', cropId: 'crp1', grossHarvest: 203.4, yield: 45.6, grainQuality: '3 класс' },
  { id: 'h40', fieldId: 'field10', date: '2022-08-01', cropId: 'crp1', grossHarvest: 182.0, yield: 40.8, grainQuality: '3 класс' },
];

module.exports = harvests;
