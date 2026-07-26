const HEX_COLOR_PATTERN = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;

export const normalizeHex = (hex: string): string => {
  if (!HEX_COLOR_PATTERN.test(hex)) {
    throw new Error(`Unsupported color format: ${hex}`);
  }

  const value = hex.slice(1).toLowerCase();
  return value.length === 3
    ? `#${value.split('').map((character) => character.repeat(2)).join('')}`
    : `#${value}`;
};

export const hexToRgb = (hex: string): readonly [number, number, number] => {
  const normalized = normalizeHex(hex).slice(1);
  const parsed = Number.parseInt(normalized, 16);
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255] as const;
};

export const relativeLuminance = (hex: string): number => {
  const convertChannel = (channel: number): number => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  const [red, green, blue] = hexToRgb(hex);
  return 0.2126 * convertChannel(red)
    + 0.7152 * convertChannel(green)
    + 0.0722 * convertChannel(blue);
};

export const contrastRatio = (foreground: string, background: string): number => {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

export const readableText = (background: string): '#ffffff' | '#000000' =>
  contrastRatio('#ffffff', background) >= contrastRatio('#000000', background)
    ? '#ffffff'
    : '#000000';

export const accessibleColor = (
  preferred: string,
  background: string,
  fallback: string,
  minimumRatio = 4.5,
): string => contrastRatio(preferred, background) >= minimumRatio ? preferred : fallback;
