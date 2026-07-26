import assert from 'node:assert/strict';
import test from 'node:test';
import translationPL from '../src/locales/pl/translation.json' with { type: 'json' };
import { sanitizeOrderForm } from '../src/features/order/storage.ts';
import { emptyOrderForm } from '../src/features/order/types.ts';

test('draft sanitizer accepts stable identifiers and rejects invalid field types', () => {
  const form = sanitizeOrderForm({
    ...emptyOrderForm,
    name: 'Example Client',
    type: 'web-app',
    budget: 'quote-needed',
  });

  assert.equal(form?.type, 'web-app');
  assert.equal(form?.budget, 'quote-needed');
  assert.equal(sanitizeOrderForm({ ...emptyOrderForm, name: 123 }), null);
});

test('draft sanitizer migrates localized legacy option labels', () => {
  const form = sanitizeOrderForm({
    ...emptyOrderForm,
    type: translationPL.order.form.typeOptions[0],
    deadline: translationPL.order.form.deadlineOptions[4],
  });

  assert.equal(form?.type, 'web-app');
  assert.equal(form?.deadline, 'flexible');
});

test('draft sanitizer clears unknown option identifiers', () => {
  const form = sanitizeOrderForm({ ...emptyOrderForm, type: 'unknown-future-option' });
  assert.equal(form?.type, '');
});
