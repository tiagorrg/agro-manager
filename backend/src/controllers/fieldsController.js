const fields = require('../data/fields');
const operations = require('../data/operations');
const harvests = require('../data/harvests');

exports.getAll = (req, res) => {
  res.json(fields);
};

exports.getById = (req, res) => {
  const field = fields.find(f => f.id === req.params.id);
  if (!field) return res.status(404).json({ error: 'Поле не найдено' });

  const fieldOperations = operations.filter(o => o.fieldId === field.id);
  const fieldHarvests = harvests.filter(h => h.fieldId === field.id);

  res.json({ ...field, operations: fieldOperations, harvests: fieldHarvests });
};
