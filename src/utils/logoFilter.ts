// Generates CSS filter to shift a blue logo (~#007BFF, hue ~211°)
// to approximate a target color using hue-rotate, saturate, brightness.

const BASE_HUE = 211;
const BASE_LUMA = 0.213 * 0 + 0.715 * 123 + 0.072 * 255; // ~106.3

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case R:
      h = (G - B) / d + (G < B ? 6 : 0);
      break;
    case G:
      h = (B - R) / d + 2;
      break;
    default:
      h = (R - G) / d + 4;
  }

  return { h: h * 60, s, l };
}

function luma(r: number, g: number, b: number) {
  return 0.213 * r + 0.715 * g + 0.072 * b;
}

export function getLogoFilter(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);

  const brightness = clamp(
    Math.round((luma(r, g, b) / BASE_LUMA) * 100),
    20,
    220,
  );

  // Neutral / near-neutral colors: desaturate
  if (s < 0.12) {
    return `saturate(0%) brightness(${brightness}%)`;
  }

  const hueRotate = Math.round((((h - BASE_HUE) + 540) % 360) - 180);
  const saturate = clamp(Math.round(s * 100), 20, 180);

  return `hue-rotate(${hueRotate}deg) saturate(${saturate}%) brightness(${brightness}%)`;
}
