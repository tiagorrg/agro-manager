const fields = require('../data/fields');
const operations = require('../data/operations');

const TYPE_LABELS = {
  'Посев': 'посев',
  'Обработка': 'обработка',
  'Уборка': 'уборка',
  'ВнесениеУдобрений': 'внесение удобрений',
};

function moscowTodayIso() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function startOfToday() {
  return new Date(`${moscowTodayIso()}T00:00:00`);
}

function daysBetween(from, to) {
  const msInDay = 24 * 60 * 60 * 1000;
  return Math.round((to.getTime() - from.getTime()) / msInDay);
}

function fieldName(fieldId) {
  return fields.find(f => f.id === fieldId)?.name || fieldId;
}

function formatOperationTitle(op) {
  return `${TYPE_LABELS[op.type] || op.type} — ${fieldName(op.fieldId)}`;
}

function byDateAsc(a, b) {
  return new Date(a.date) - new Date(b.date);
}

exports.getAll = (req, res) => {
  const today = startOfToday();
  const recommendations = [];

  const planned = operations.filter(op =>
    op.status === 'План' || op.calendarStatus === 'Запланировано'
  );
  const overdue = planned
    .filter(op => new Date(`${op.date}T00:00:00`) < today)
    .sort(byDateAsc);
  const inProgress = operations
    .filter(op => op.calendarStatus === 'В процессе')
    .sort(byDateAsc);
  const upcoming = planned
    .filter(op => new Date(`${op.date}T00:00:00`) >= today)
    .sort(byDateAsc);

  overdue.slice(0, 4).forEach(op => {
    const opDate = new Date(`${op.date}T00:00:00`);
    const lateBy = Math.abs(daysBetween(today, opDate));
    recommendations.push({
      id: `overdue-${op.id}`,
      severity: lateBy > 30 ? 'high' : 'medium',
      kind: 'overdue',
      title: formatOperationTitle(op),
      description: `Плановая операция просрочена на ${lateBy} дн. Перенесите дату или закройте задачу фактом.`,
      fieldId: op.fieldId,
      fieldName: fieldName(op.fieldId),
      operationId: op.id,
      date: op.date,
      actionLabel: 'Открыть поле',
      actionHref: `/fields/${op.fieldId}`,
    });
  });

  inProgress.slice(0, 3).forEach(op => {
    const opDate = new Date(`${op.date}T00:00:00`);
    const age = Math.max(0, daysBetween(today, opDate) * -1);
    recommendations.push({
      id: `stale-${op.id}`,
      severity: age > 7 ? 'high' : 'medium',
      kind: 'stale',
      title: formatOperationTitle(op),
      description: `Операция находится в работе ${age} дн. Проверьте фактическое выполнение и обновите статус.`,
      fieldId: op.fieldId,
      fieldName: fieldName(op.fieldId),
      operationId: op.id,
      date: op.date,
      actionLabel: 'Открыть поле',
      actionHref: `/fields/${op.fieldId}`,
    });
  });

  fields.forEach(field => {
    const hasFuturePlan = planned.some(op =>
      op.fieldId === field.id && new Date(`${op.date}T00:00:00`) >= today
    );
    const hasOpenPlan = planned.some(op => op.fieldId === field.id);

    if (!hasFuturePlan) {
      recommendations.push({
        id: `no-plan-${field.id}`,
        severity: hasOpenPlan ? 'medium' : 'low',
        kind: 'no_plan',
        title: `${field.name}: нет ближайшего плана`,
        description: hasOpenPlan
          ? 'У поля есть только просроченные плановые работы. Нужен перенос сезона.'
          : 'Для поля не запланированы ближайшие операции. Добавьте следующую задачу в календарь.',
        fieldId: field.id,
        fieldName: field.name,
        operationId: null,
        date: null,
        actionLabel: 'Открыть поле',
        actionHref: `/fields/${field.id}`,
      });
    }
  });

  upcoming.slice(0, 3).forEach(op => {
    recommendations.push({
      id: `upcoming-${op.id}`,
      severity: 'info',
      kind: 'upcoming',
      title: formatOperationTitle(op),
      description: `Ближайшая плановая работа назначена на ${op.date}.`,
      fieldId: op.fieldId,
      fieldName: fieldName(op.fieldId),
      operationId: op.id,
      date: op.date,
      actionLabel: 'К календарю',
      actionHref: '/calendar',
    });
  });

  const severityRank = { high: 0, medium: 1, low: 2, info: 3 };
  recommendations.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  res.json({
    generatedAt: moscowTodayIso(),
    summary: {
      high: recommendations.filter(item => item.severity === 'high').length,
      medium: recommendations.filter(item => item.severity === 'medium').length,
      low: recommendations.filter(item => item.severity === 'low').length,
      info: recommendations.filter(item => item.severity === 'info').length,
      total: recommendations.length,
    },
    items: recommendations.slice(0, 8),
  });
};
