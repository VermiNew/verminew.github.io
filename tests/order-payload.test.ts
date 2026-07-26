import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeArchiveEntryName } from '../src/features/order/attachmentNames.ts';
import { createOrderId, createOrderPayload } from '../src/features/order/payload.ts';
import { emptyOrderForm } from '../src/features/order/types.ts';

const completeForm = {
  ...emptyOrderForm,
  name: 'Example Client',
  email: 'client@example.com',
  clientType: 'company',
  contactMethod: 'email',
  type: 'web-app',
  existingProject: 'new',
  budget: 'quote-needed',
  deadline: 'flexible',
  description: 'A bilingual portfolio.',
  contentReady: 'partial',
  hasDomain: 'none',
};

test('order payload keeps stable identifiers and immutable timestamps', () => {
  const payload = createOrderPayload({
    id: 'VMN-2026-TEST1234',
    createdAt: '2026-07-23T10:00:00.000Z',
    updatedAt: '2026-07-23T10:05:00.000Z',
    appVersion: '1.0.0',
    language: 'pl',
    form: completeForm,
    files: [new File(['brief'], 'brief.txt', { type: 'text/plain', lastModified: 123 })],
  });

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.form.type, 'web-app');
  assert.equal(payload.createdAt, '2026-07-23T10:00:00.000Z');
  assert.equal(payload.updatedAt, '2026-07-23T10:05:00.000Z');
  assert.deepEqual(payload.attachments[0], {
    name: 'brief.txt',
    type: 'text/plain',
    size: 5,
    lastModified: 123,
  });
});



test('order IDs contain the creation year and a compact random suffix', () => {
  const id = createOrderId(new Date('2026-07-23T10:00:00.000Z'));
  assert.match(id, /^VMN-2026-[A-F0-9]{8}$/);
});

test('archive attachment names cannot create nested or unsafe paths', () => {
  assert.equal(sanitizeArchiveEntryName('../client/brief?.txt'), '_client_brief_.txt');
  assert.equal(sanitizeArchiveEntryName('   '), 'attachment');
  assert.equal(sanitizeArchiveEntryName('design.png...'), 'design.png');
});
