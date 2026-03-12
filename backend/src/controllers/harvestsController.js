const harvests = require('../data/harvests');
const fields = require('../data/fields');
const crops = require('../data/crops');

function enrich(h) {
  return {
    ...h,
    field: fields.find(f => f.id === h.fieldId) || null,
    crop: crops.find(c => c.id === h.cropId) || null,
  };
}

exports.getAll = (req, res) => {
  let result = harvests;
  if (req.query.fieldId) result = result.filter(h => h.fieldId === req.query.fieldId);
  res.json(result.map(enrich));
};
