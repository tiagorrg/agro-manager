const operations = require('../data/operations');
const harvests = require('../data/harvests');
const fields = require('../data/fields');

const TYPE_LABELS = {
  'Посев': 'Посев',
  'Обработка': 'Обработка',
  'Уборка': 'Уборка',
  'ВнесениеУдобрений': 'Внесение удобрений',
};

function isInPeriod(item, dateFrom, dateTo) {
  if (dateFrom && item.date < dateFrom) return false;
  if (dateTo && item.date > dateTo) return false;
  return true;
}

function countBy(items, keyGetter) {
  return items.reduce((acc, item) => {
    const key = keyGetter(item);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function sumHarvestByYear(items) {
  const result = {};
  for (const harvest of items) {
    const year = harvest.date.slice(0, 4);
    result[year] = +((result[year] || 0) + harvest.grossHarvest).toFixed(1);
  }
  return result;
}

function buildFieldStats(reportFields, reportOperations) {
  return reportFields.map((field) => {
    const fieldOps = reportOperations.filter((operation) => operation.fieldId === field.id);
    const completed = fieldOps.filter((operation) => operation.calendarStatus === 'Выполнено').length;
    return {
      id: field.id,
      name: field.name,
      area: field.area,
      crop: field.currentCrop.name,
      total: fieldOps.length,
      completed,
    };
  });
}

function getTopEntry(record) {
  return Object.entries(record).sort(([, a], [, b]) => b - a)[0] || null;
}

function buildInsights({ scope, selectedField, reportOperations, reportHarvests, byType, byStatus }) {
  const insights = [];
  const total = reportOperations.length;
  const completed = byStatus['Выполнено'] || 0;
  const planned = byStatus['Запланировано'] || 0;
  const inProgress = byStatus['В процессе'] || 0;
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const overdue = reportOperations.filter(
    (operation) => operation.calendarStatus === 'Запланировано' && operation.date < today
  ).length;
  const topType = getTopEntry(byType);

  if (total === 0) {
    insights.push('За выбранный период операции не найдены.');
  } else {
    insights.push(`За выбранный период выполнено ${completedPct}% операций (${completed} из ${total}).`);
  }

  if (topType) {
    insights.push(`Наибольшая нагрузка пришлась на операции типа "${TYPE_LABELS[topType[0]] || topType[0]}" — ${topType[1]} шт.`);
  }

  if (overdue > 0) {
    insights.push(`Есть ${overdue} просроченных плановых операций, их нужно перенести или закрыть.`);
  } else if (planned > 0) {
    insights.push(`Плановых операций без просрочки: ${planned}.`);
  }

  if (inProgress > 0) {
    insights.push(`${inProgress} операций находятся в работе и требуют контроля статуса.`);
  }

  if (scope === 'field' && selectedField) {
    const fieldHarvests = reportHarvests.filter((harvest) => harvest.fieldId === selectedField.id);
    if (fieldHarvests.length > 0) {
      const avgYield = fieldHarvests.reduce((sum, harvest) => sum + harvest.yield, 0) / fieldHarvests.length;
      insights.push(`Средняя урожайность поля "${selectedField.name}" за период — ${avgYield.toFixed(1)} ц/га.`);
    } else {
      insights.push(`По полю "${selectedField.name}" за выбранный период нет данных по урожайности.`);
    }
  }

  return insights;
}

exports.getReports = (req, res) => {
  const scope = req.query.scope === 'field' ? 'field' : 'farm';
  const fieldId = typeof req.query.fieldId === 'string' ? req.query.fieldId : '';
  const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : '';
  const dateTo = typeof req.query.dateTo === 'string' ? req.query.dateTo : '';
  const selectedField = scope === 'field' ? fields.find((field) => field.id === fieldId) : null;

  if (scope === 'field' && !selectedField) {
    return res.status(404).json({ error: 'Поле для отчета не найдено' });
  }

  const reportFields = selectedField ? [selectedField] : fields;
  const fieldIds = new Set(reportFields.map((field) => field.id));
  const reportOperations = operations.filter(
    (operation) => fieldIds.has(operation.fieldId) && isInPeriod(operation, dateFrom, dateTo)
  );
  const reportHarvests = harvests.filter(
    (harvest) => fieldIds.has(harvest.fieldId) && isInPeriod(harvest, dateFrom, dateTo)
  );

  const byType = countBy(reportOperations, (operation) => operation.type);
  const byStatus = countBy(reportOperations, (operation) => operation.calendarStatus);
  const byMonth = countBy(reportOperations, (operation) => operation.date.slice(0, 7));
  const yieldByYear = sumHarvestByYear(reportHarvests);
  const byField = buildFieldStats(reportFields, reportOperations);

  const insights = buildInsights({
    scope,
    selectedField,
    reportOperations,
    reportHarvests,
    byType,
    byStatus,
  });

  res.json({
    scope,
    filters: { fieldId, dateFrom, dateTo },
    selectedField: selectedField
      ? {
          id: selectedField.id,
          name: selectedField.name,
          area: selectedField.area,
          crop: selectedField.currentCrop.name,
        }
      : null,
    byType,
    byStatus,
    byMonth,
    yieldByYear,
    byField,
    insights,
    totals: {
      operations: reportOperations.length,
      fields: reportFields.length,
      totalArea: +reportFields.reduce((sum, field) => sum + field.area, 0).toFixed(1),
    },
  });
};
