const operations = require('../data/operations');
const fields = require('../data/fields');
const crops = require('../data/crops');
const equipment = require('../data/equipment');

// Обогащаем операцию связанными данными
function enrich(op) {
  return {
    ...op,
    field: fields.find(f => f.id === op.fieldId) || null,
    crop: crops.find(c => c.id === op.cropId) || null,
    equipment: equipment.find(e => e.id === op.equipmentId) || null,
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
