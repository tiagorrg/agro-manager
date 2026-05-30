const harvests = [
  // Поле №1 — пшеница озимая
  { id: 'h1',  fieldId: 'field1', date: '2025-07-29', cropId: 'crp1', grossHarvest: 58.1, yield: 48.2, grainQuality: '2 класс' },
  { id: 'h2',  fieldId: 'field1', date: '2024-07-28', cropId: 'crp1', grossHarvest: 51.8, yield: 43.0, grainQuality: '3 класс' },
  { id: 'h3',  fieldId: 'field1', date: '2023-07-25', cropId: 'crp1', grossHarvest: 55.4, yield: 46.0, grainQuality: '2 класс' },
  { id: 'h4',  fieldId: 'field1', date: '2022-08-01', cropId: 'crp1', grossHarvest: 48.2, yield: 40.0, grainQuality: '3 класс' },

  // Поле №2 — подсолнечник
  { id: 'h5',  fieldId: 'field2', date: '2025-09-16', cropId: 'crp2', grossHarvest: 25.9, yield: 30.5, grainQuality: null },
  { id: 'h6',  fieldId: 'field2', date: '2024-09-12', cropId: 'crp2', grossHarvest: 23.8, yield: 28.0, grainQuality: null },
  { id: 'h7',  fieldId: 'field2', date: '2023-09-08', cropId: 'crp2', grossHarvest: 22.1, yield: 26.0, grainQuality: null },

  // Поле №3 — кукуруза
  { id: 'h8',  fieldId: 'field3', date: '2025-10-08', cropId: 'crp3', grossHarvest: 132.1, yield: 69.5, grainQuality: null },
  { id: 'h9',  fieldId: 'field3', date: '2024-10-10', cropId: 'crp3', grossHarvest: 126.0, yield: 63.0, grainQuality: null },
  { id: 'h10', fieldId: 'field3', date: '2023-10-05', cropId: 'crp3', grossHarvest: 138.0, yield: 69.0, grainQuality: null },
  { id: 'h11', fieldId: 'field3', date: '2022-10-12', cropId: 'crp3', grossHarvest: 120.0, yield: 60.0, grainQuality: null },

];

module.exports = harvests;
