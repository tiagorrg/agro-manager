const harvests = [
  // Северное — пшеница
  { id: 'h1', fieldId: 'field1', date: '2024-07-28', cropId: 'crp1', grossHarvest: 51.8, yield: 43.0, grainQuality: '3 класс' },
  { id: 'h2', fieldId: 'field1', date: '2023-07-25', cropId: 'crp1', grossHarvest: 55.4, yield: 46.0, grainQuality: '2 класс' },
  { id: 'h3', fieldId: 'field1', date: '2022-08-01', cropId: 'crp1', grossHarvest: 48.2, yield: 40.0, grainQuality: '3 класс' },

  // Южное — подсолнечник
  { id: 'h4', fieldId: 'field2', date: '2024-09-12', cropId: 'crp2', grossHarvest: 23.8, yield: 28.0, grainQuality: null },
  { id: 'h5', fieldId: 'field2', date: '2023-09-08', cropId: 'crp2', grossHarvest: 22.1, yield: 26.0, grainQuality: null },

  // Западное — кукуруза
  { id: 'h6', fieldId: 'field3', date: '2024-10-10', cropId: 'crp3', grossHarvest: 126.0, yield: 63.0, grainQuality: null },
  { id: 'h7', fieldId: 'field3', date: '2023-10-05', cropId: 'crp3', grossHarvest: 138.0, yield: 69.0, grainQuality: null },
  { id: 'h8', fieldId: 'field3', date: '2022-10-12', cropId: 'crp3', grossHarvest: 120.0, yield: 60.0, grainQuality: null },

  // Восточное — ячмень
  { id: 'h9',  fieldId: 'field4', date: '2025-07-10', cropId: 'crp4', grossHarvest: 22.6, yield: 37.5, grainQuality: '2 класс' },
  { id: 'h10', fieldId: 'field4', date: '2024-07-15', cropId: 'crp4', grossHarvest: 24.1, yield: 40.0, grainQuality: '2 класс' },
];

module.exports = harvests;
