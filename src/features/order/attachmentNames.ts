const FORBIDDEN_FILENAME_CHARS = new RegExp(
  `[\x00-\x1f\x7f<>:"${'/'}\\\\|?*]`,
  'g',
);

export const sanitizeArchiveEntryName = (name: string): string => {
  const sanitized = name
    .replace(FORBIDDEN_FILENAME_CHARS, '_')
    .replace(/^[. ]+|[. ]+$/g, '')
    .trim();

  return sanitized && sanitized !== '.' && sanitized !== '..' ? sanitized : 'attachment';
};

export const createUniqueArchiveEntryName = (name: string, usedNames: Set<string>): string => {
  const sanitized = sanitizeArchiveEntryName(name);
  const extensionIndex = sanitized.lastIndexOf('.');
  const hasExtension = extensionIndex > 0;
  const base = hasExtension ? sanitized.slice(0, extensionIndex) : sanitized;
  const extension = hasExtension ? sanitized.slice(extensionIndex) : '';
  let candidate = sanitized;
  let counter = 2;

  while (usedNames.has(candidate.toLocaleLowerCase('en-US'))) {
    candidate = `${base} (${counter})${extension}`;
    counter += 1;
  }

  usedNames.add(candidate.toLocaleLowerCase('en-US'));
  return candidate;
};
