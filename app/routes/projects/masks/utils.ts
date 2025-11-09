// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function interpolateColor(colorA: string, colorB: string, t: number): string {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);

  const r = Math.round(rgbA.r + (rgbB.r - rgbA.r) * t);
  const g = Math.round(rgbA.g + (rgbB.g - rgbA.g) * t);
  const b = Math.round(rgbA.b + (rgbB.b - rgbA.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

// Canvas utilities
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  preserveContent: boolean = false
): void {
  if (canvas.width === width && canvas.height === height) return;

  let imageData: ImageData | null = null;
  if (preserveContent && canvas.width > 0 && canvas.height > 0) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }

  canvas.width = width;
  canvas.height = height;

  if (imageData) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.putImageData(imageData, 0, 0);
    }
  }
}
