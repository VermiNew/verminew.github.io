import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_FILE_SIZE_BYTES,
  isEmailValid,
  validateFiles,
} from '../src/features/order/validation.ts';

test('email validation accepts normal addresses and rejects malformed values', () => {
  assert.equal(isEmailValid('person@example.com'), true);
  assert.equal(isEmailValid(' person@example.com '), true);
  assert.equal(isEmailValid('person@'), false);
  assert.equal(isEmailValid('person example.com'), false);
});

test('attachment validation rejects duplicates, unsupported files and oversized files', () => {
  const image = new File(['image'], 'mockup.png', { type: 'image/png' });
  const duplicate = new File(['other'], 'MOCKUP.PNG', { type: 'image/png' });
  assert.equal(validateFiles([image, duplicate]).error, 'duplicate');

  const executable = new File(['x'], 'tool.exe', { type: 'application/octet-stream' });
  assert.equal(validateFiles([executable]).error, 'type');

  const oversized = new File([new Uint8Array(MAX_FILE_SIZE_BYTES + 1)], 'large.pdf', {
    type: 'application/pdf',
  });
  assert.equal(validateFiles([oversized]).error, 'file-size');
});

test('attachment validation accepts supported files', () => {
  const files = [
    new File(['image'], 'wireframe.webp', { type: 'image/webp' }),
    new File(['brief'], 'requirements.pdf', { type: 'application/pdf' }),
    new File(['notes'], 'notes.txt', { type: 'text/plain' }),
  ];
  const result = validateFiles(files);
  assert.equal(result.error, null);
  assert.equal(result.files.length, 3);
});
