const assert = require('node:assert/strict');
const test = require('node:test');

const { resolveDocumentData } = require('../src/services/documents/documentDataResolver');
const { getAvailableTokensForType, TEMPLATE_TYPES } = require('../src/services/documents/templateDictionary');

test('registry document catalog exposes enterprise and signer tokens', () => {
  const tokens = getAvailableTokensForType(TEMPLATE_TYPES.REGISTRY).map((entry) => entry.token);

  [
    'enterprise_name',
    'enterprise_short_name',
    'enterprise_inn',
    'enterprise_kpp',
    'enterprise_ogrn',
    'enterprise_address',
    'enterprise_phone',
    'manager_position',
    'manager_name',
    'agronomist_position',
    'agronomist_name',
  ].forEach((token) => {
    assert.ok(tokens.includes(token), `Expected token ${token} in registry catalog`);
  });
});

test('registry document data includes enterprise and responsible employees', () => {
  const payload = resolveDocumentData({
    template: {
      name: 'Акт выполненных полевых работ',
      type: TEMPLATE_TYPES.REGISTRY,
    },
    mode: 'by_day',
    date: '2026-06-09',
  });

  assert.equal(payload.enterprise_name, 'КФХ "Теплый стан"');
  assert.equal(payload.enterprise_short_name, 'КФХ "Теплый стан"');
  assert.equal(payload.manager_position, 'Глава КФХ');
  assert.equal(payload.manager_name, 'Иванов Иван Иванович');
  assert.equal(payload.agronomist_position, 'Главный агроном');
  assert.equal(payload.agronomist_name, 'Петрова Анна Сергеевна');
  assert.equal(payload.operations_count, '1');
  assert.equal(payload.items[0].item_operation_id, 'op37');
});
