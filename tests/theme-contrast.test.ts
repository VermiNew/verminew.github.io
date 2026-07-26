import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { accessibleColor, contrastRatio, readableText } from '../src/utils/colorContrast.ts';

const source = readFileSync(new URL('../src/styles/themes.ts', import.meta.url), 'utf8');
const themeBlocks = [...source.matchAll(/colors:\s*createThemeColors\(\{([\s\S]*?)\},\s*(?:true|false)\)/g)];

const parseColors = (block: string): Record<string, string> => Object.fromEntries(
  [...block.matchAll(/(\w+):\s*'(#[\da-fA-F]{3,6})'/g)].map((match) => [match[1], match[2]]),
);

test('contrast helpers select readable semantic foregrounds', () => {
  assert.ok(contrastRatio(readableText('#2563eb'), '#2563eb') >= 4.5);
  assert.equal(accessibleColor('#eeeeee', '#ffffff', '#111827'), '#111827');
  assert.equal(accessibleColor('#2563eb', '#ffffff', '#111827'), '#2563eb');
});

test('all 16 themes provide readable foreground and link fallbacks', () => {
  assert.equal(themeBlocks.length, 16);

  for (const [, block] of themeBlocks) {
    const colors = parseColors(block);
    for (const token of ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']) {
      const background = colors[token];
      assert.ok(background, `missing ${token}`);
      assert.ok(
        contrastRatio(readableText(background), background) >= 4.5,
        `${token} does not have a readable semantic foreground`,
      );
    }

    const link = accessibleColor(colors.primary, colors.background, colors.text);
    const linkHover = accessibleColor(colors.accent, colors.background, colors.text);
    assert.ok(contrastRatio(link, colors.background) >= 4.5, 'link contrast is below 4.5:1');
    assert.ok(contrastRatio(linkHover, colors.background) >= 4.5, 'link hover contrast is below 4.5:1');
  }
});
