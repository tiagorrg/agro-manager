const fields = require('../data/fields');
const operations = require('../data/operations');
const harvests = require('../data/harvests');
const crops = require('../data/crops');

exports.getSummary = (req, res) => {
  const totalArea = fields.reduce((sum, f) => sum + f.area, 0);

  // Распределение культур
  const cropMap = {};
  fields.forEach(f => {
    const key = f.currentCrop.name;
    cropMap[key] = (cropMap[key] || 0) + f.area;
  });
  const cropsDistribution = Object.entries(cropMap).map(([crop, area]) => ({
    crop,
    area: +area.toFixed(1),
    percentage: +(area / totalArea * 100).toFixed(1),
  }));

  // Последние 5 операций (по дате)
  const recentOperations = [...operations]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(op => ({
      ...op,
      fieldName: fields.find(f => f.id === op.fieldId)?.name || null,
    }));

  // История урожайности по годам (все поля)
  const yieldHistory = {};
  harvests.forEach(h => {
    const year = new Date(h.date).getFullYear();
    if (!yieldHistory[year]) yieldHistory[year] = { totalGross: 0, count: 0 };
    yieldHistory[year].totalGross += h.grossHarvest;
    yieldHistory[year].count += 1;
  });
  const yieldByYear = Object.entries(yieldHistory)
    .sort(([a], [b]) => a - b)
    .map(([year, data]) => ({ year: +year, totalGross: +data.totalGross.toFixed(1) }));

  // Прогноз урожая — последний зафиксированный год
  const lastYear = yieldByYear.at(-1);
  const prevYear = yieldByYear.at(-2);
  const harvestForecast = lastYear?.totalGross ?? 0;
  const harvestTrend = lastYear && prevYear
    ? +((lastYear.totalGross - prevYear.totalGross) / prevYear.totalGross * 100).toFixed(1)
    : null;

  // Выполнено работ (% операций со статусом "Факт")
  const completedOps = operations.filter(op => op.status === 'Факт').length;
  const completedOpsPercent = +((completedOps / operations.length) * 100).toFixed(1);

  // Прирост площади (статичная метрика — для демонстрации)
  const areaTrend = 5.0;

  res.json({
    totalArea: +totalArea.toFixed(1),
    areaTrend,
    activeFields: fields.length,
    harvestForecast,
    harvestTrend,
    completedOpsPercent,
    completedOps,
    totalOps: operations.length,
    cropsDistribution,
    recentOperations,
    yieldByYear,
  });
};
