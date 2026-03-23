const operations = require('../data/operations');
const fields = require('../data/fields');
const crops = require('../data/crops');
const equipment = require('../data/equipment');

const ALLOWED_STATUSES = ['Запланировано', 'В процессе', 'Выполнено'];
const ALLOWED_TYPES = ['Посев', 'Обработка', 'Уборка', 'ВнесениеУдобрений'];

let opCounter = 30;

// Обогащаем операцию связанными данными
function enrich(op) {
  return {
    ...op,
    field:     fields.find(f => f.id === op.fieldId)         || null,
    crop:      crops.find(c => c.id === op.cropId)           || null,
    equipment: equipment.find(e => e.id === op.equipmentId)  || null,
  };
}

exports.getAll = (req, res) => {
  let result = operations;
  if (req.query.fieldId) result = result.filter(o => o.fieldId === req.query.fieldId);
  if (req.query.type)    result = result.filter(o => o.type === req.query.type);
  if (req.query.status)  result = result.filter(o => o.status === req.query.status);
  res.json(result.map(enrich));
};

exports.getById = (req, res) => {
  const op = operations.find(o => o.id === req.params.id);
  if (!op) return res.status(404).json({ error: 'Операция не найдена' });
  res.json(enrich(op));
};

exports.create = (req, res) => {
  const { fieldId, type, date, timeStart, timeEnd, cropId } = req.body;

  if (!fieldId || !type || !date) {
    return res.status(400).json({ error: 'Необходимы fieldId, type, date' });
  }
  if (!ALLOWED_TYPES.includes(type)) {
    return res.status(400).json({ error: `Допустимые типы: ${ALLOWED_TYPES.join(', ')}` });
  }

  opCounter++;
  const op = {
    id: `op${opCounter}`,
    fieldId,
    type,
    date,
    timeStart: timeStart || null,
    timeEnd: timeEnd || null,
    status: 'План',
    calendarStatus: 'Запланировано',
    cropId: cropId || null,
    equipmentId: null,
  };

  operations.push(op);
  res.status(201).json(enrich(op));
};

exports.reschedule = (req, res) => {
  const op = operations.find(o => o.id === req.params.id);
  if (!op) return res.status(404).json({ error: 'Операция не найдена' });

  const { date, timeStart, timeEnd } = req.body;
  if (!date) return res.status(400).json({ error: 'Необходима дата' });

  op.date = date;
  if (timeStart !== undefined) op.timeStart = timeStart || null;
  if (timeEnd !== undefined) op.timeEnd = timeEnd || null;

  res.json(enrich(op));
};

exports.patchStatus = (req, res) => {
  const op = operations.find(o => o.id === req.params.id);
  if (!op) return res.status(404).json({ error: 'Операция не найдена' });

  const { calendarStatus } = req.body;
  if (!ALLOWED_STATUSES.includes(calendarStatus)) {
    return res.status(400).json({ error: `Допустимые статусы: ${ALLOWED_STATUSES.join(', ')}` });
  }

  op.calendarStatus = calendarStatus;
  res.json(enrich(op));
};
