const operations = require('../data/operations');
const harvests = require('../data/harvests');
const fields = require('../data/fields');

exports.getReports = (req, res) => {
  // Operations by type
  const byType = {};
  for (const op of operations) {
    byType[op.type] = (byType[op.type] || 0) + 1;
  }

  // Operations by calendarStatus
  const byStatus = {};
  for (const op of operations) {
    byStatus[op.calendarStatus] = (byStatus[op.calendarStatus] || 0) + 1;
  }

  // Operations by month (YYYY-MM)
  const byMonth = {};
  for (const op of operations) {
    const month = op.date.slice(0, 7);
    byMonth[month] = (byMonth[month] || 0) + 1;
  }

  // Gross harvest by year (in tonnes from harvests.grossHarvest)
  const yieldByYear = {};
  for (const h of harvests) {
    const year = h.date.slice(0, 4);
    yieldByYear[year] = +((yieldByYear[year] || 0) + h.grossHarvest).toFixed(1);
  }

  // Per-field statistics
  const byField = fields.map(f => {
    const fieldOps = operations.filter(o => o.fieldId === f.id);
    const completed = fieldOps.filter(o => o.calendarStatus === 'Выполнено').length;
    return {
      id: f.id,
      name: f.name,
      area: f.area,
      crop: f.currentCrop.name,
      total: fieldOps.length,
      completed,
    };
  });

  res.json({
    byType,
    byStatus,
    byMonth,
    yieldByYear,
    byField,
    totals: {
      operations: operations.length,
      fields: fields.length,
      totalArea: +fields.reduce((s, f) => s + f.area, 0).toFixed(1),
    },
  });
};
