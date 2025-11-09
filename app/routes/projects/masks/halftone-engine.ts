import type { ShapeType, DitherPattern } from "./constants";
import { ASCII_GRADIENT, SHAPE_SCALE_FACTORS, DITHER_MATRICES } from "./constants";
import { interpolateColor, resizeCanvas } from "./utils";

export interface HalftoneParams {
  cellSize: number;
  shapeSizeMultiplier: number;
  shapeType: ShapeType;
  pattern: DitherPattern;
  colorA: string;
  colorB: string;
  backgroundColor: string;
  thresholdMin: number;
  thresholdMax: number;
  contrast: number;
  brightness: number;
  blur: number;
  posterize: number;
  angle: number;
}

// Draw a single shape (circle, square, or ASCII character)
export function drawShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shapeType: ShapeType,
  cellSize: number,
  darkness: number = 0
): void {
  const centerX = x + cellSize / 2;
  const centerY = y + cellSize / 2;

  switch (shapeType) {
    case "circle":
      ctx.beginPath();
      ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "square":
      const squareSize = size * 2;
      ctx.fillRect(centerX - squareSize / 2, centerY - squareSize / 2, squareSize, squareSize);
      break;

    case "ascii":
      // Map darkness (0 = light, 1 = dark) to character in gradient
      const charIndex = Math.floor(darkness * (ASCII_GRADIENT.length - 1));
      const char = ASCII_GRADIENT[charIndex];

      // Font size scales with size parameter but capped to prevent overlap/blobs
      // size * 2 gives good scaling, capped to prevent blobs
      const fontSize = Math.min(size * 2, cellSize * 2);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(char, centerX, centerY);
      break;
  }
}

// Generate halftone effect on canvas
export function generateHalftone(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  overlayCanvas: HTMLCanvasElement,
  eraseMask: HTMLCanvasElement | null,
  params: HalftoneParams
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set base canvas size (for background only)
  canvas.width = img.width;
  canvas.height = img.height;

  // Fill base canvas with background color
  ctx.fillStyle = params.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sync overlay canvas size and clear it

  resizeCanvas(overlayCanvas, img.width, img.height, false);
  const overlayCtx = overlayCanvas.getContext("2d");
  if (!overlayCtx) return;

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  // Sync erase mask canvas size (preserve content)
  if (eraseMask) {
    resizeCanvas(eraseMask, img.width, img.height, true);
  }

  // Create a temporary canvas for image processing
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  // Apply blur filter if needed
  if (params.blur > 0) {
    tempCtx.filter = `blur(${params.blur}px)`;
  }

  // Draw original image to get pixel data
  tempCtx.drawImage(img, 0, 0);

  // Reset filter
  tempCtx.filter = 'none';

  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

  // Convert angle to radians for rotation
  const angleRad = (params.angle * Math.PI) / 180;
  const cosAngle = Math.cos(angleRad);
  const sinAngle = Math.sin(angleRad);

  // Calculate center of canvas for rotation
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Calculate bounding box for rotated grid
  const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
  const gridExtent = Math.ceil(diagonal / params.cellSize) + 1;

  // Get the selected dither matrix (if not using variable size)
  const useVariableSize = params.pattern === "variable";
  const ditherMatrix = useVariableSize ? null : DITHER_MATRICES[params.pattern as Exclude<DitherPattern, "variable">];
  const matrixSize = ditherMatrix?.length ?? 1;

  // Auto-scaling factor for shapes
  const autoScale = SHAPE_SCALE_FACTORS[params.shapeType];

  // Process image in rotated grid using selected dither matrix
  for (let gridY = -gridExtent; gridY < gridExtent; gridY++) {
    for (let gridX = -gridExtent; gridX < gridExtent; gridX++) {
      // Calculate position in rotated grid space
      const localX = gridX * params.cellSize;
      const localY = gridY * params.cellSize;

      // Standard rotation around center
      const rotatedX = localX * cosAngle - localY * sinAngle + centerX;
      const rotatedY = localX * sinAngle + localY * cosAngle + centerY;

      // Skip if outside canvas bounds
      if (rotatedX < 0 || rotatedX >= canvas.width || rotatedY < 0 || rotatedY >= canvas.height) {
        continue;
      }

      // Sample brightness in the cell area
      let brightnessSum = 0;
      let pixelCount = 0;

      // Sample in the cell area
      const sampleSize = Math.ceil(params.cellSize * 0.7);
      for (let dy = -sampleSize / 2; dy < sampleSize / 2; dy++) {
        for (let dx = -sampleSize / 2; dx < sampleSize / 2; dx++) {
          const sampleX = Math.floor(rotatedX + dx);
          const sampleY = Math.floor(rotatedY + dy);

          // Check bounds
          if (sampleX >= 0 && sampleX < canvas.width && sampleY >= 0 && sampleY < canvas.height) {
            const i = (sampleY * canvas.width + sampleX) * 4;
            // Convert to grayscale (average RGB)
            const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            brightnessSum += brightness;
            pixelCount++;
          }
        }
      }

      if (pixelCount === 0) continue;

      let avgBrightness = brightnessSum / pixelCount;

      // Apply brightness adjustment (-100 to +100)
      avgBrightness = Math.min(255, Math.max(0, avgBrightness + params.brightness));

      // Apply contrast
      avgBrightness = Math.min(255, Math.max(0, avgBrightness * params.contrast));

      // Normalize brightness (0 = black, 1 = white)
      let normalizedBrightness = avgBrightness / 255;

      // Apply posterize/quantization
      if (params.posterize < 256) {
        normalizedBrightness = Math.round(normalizedBrightness * (params.posterize - 1)) / (params.posterize - 1);
      }

      const darkness = 1 - normalizedBrightness;

      // Apply brightness threshold range
      if (darkness < params.thresholdMin || darkness > params.thresholdMax) {
        continue;
      }

      let dotSize: number;

      if (useVariableSize) {
        // Variable size mode: dot size varies with darkness
        dotSize = darkness * (params.cellSize / 2) * autoScale * params.shapeSizeMultiplier;
      } else {
        // Dithering mode: use matrix threshold
        if (!ditherMatrix) continue; // Type safety: should never happen but guards against null

        // Get matrix threshold for this position
        const matrixX = ((gridX % matrixSize) + matrixSize) % matrixSize;
        const matrixY = ((gridY % matrixSize) + matrixSize) % matrixSize;
        const matrixThreshold = ditherMatrix[matrixY][matrixX];

        // Matrix comparison - skip if darkness doesn't exceed threshold
        if (darkness < matrixThreshold) {
          continue;
        }

        // Uniform dot size for dithering patterns
        dotSize = (params.cellSize / 2) * autoScale * params.shapeSizeMultiplier;
      }

      // Interpolate color based on brightness
      const dotColor = interpolateColor(params.colorA, params.colorB, normalizedBrightness);
      overlayCtx.fillStyle = dotColor;

      // Draw shape (adjusted for cell centering)
      drawShape(overlayCtx, rotatedX - params.cellSize / 2, rotatedY - params.cellSize / 2, dotSize, params.shapeType, params.cellSize, darkness);
    }
  }

  // Apply the erase mask to the newly generated halftone
  if (eraseMask && eraseMask.width > 0 && eraseMask.height > 0) {
    overlayCtx.globalCompositeOperation = "destination-out";
    overlayCtx.drawImage(eraseMask, 0, 0);
    overlayCtx.globalCompositeOperation = "source-over";
  }
}

// Erase functionality
export function eraseAtPoint(
  eraseMask: HTMLCanvasElement,
  overlayCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  brushSize: number
): void {
  const maskCtx = eraseMask.getContext("2d");
  const overlayCtx = overlayCanvas.getContext("2d");
  if (!maskCtx || !overlayCtx) return;

  // Draw white circles on the erase mask (white = erased area)
  maskCtx.fillStyle = "white";
  maskCtx.beginPath();
  maskCtx.arc(x, y, brushSize, 0, Math.PI * 2);
  maskCtx.fill();

  // Immediately apply to overlay for visual feedback
  overlayCtx.globalCompositeOperation = "destination-out";
  overlayCtx.fillStyle = "white";
  overlayCtx.beginPath();
  overlayCtx.arc(x, y, brushSize, 0, Math.PI * 2);
  overlayCtx.fill();
  overlayCtx.globalCompositeOperation = "source-over";
}

// Clear erase mask
export function clearEraseMask(eraseMask: HTMLCanvasElement): void {
  const ctx = eraseMask.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, eraseMask.width, eraseMask.height);
}

// Export merged canvas (base + overlay)
export function exportMergedCanvas(
  baseCanvas: HTMLCanvasElement,
  overlayCanvas: HTMLCanvasElement
): string {
  const mergedCanvas = document.createElement("canvas");
  mergedCanvas.width = baseCanvas.width;
  mergedCanvas.height = baseCanvas.height;
  const mergedCtx = mergedCanvas.getContext("2d");
  if (!mergedCtx) return "";

  // Draw base layer
  mergedCtx.drawImage(baseCanvas, 0, 0);

  // Draw overlay layer (with transparency/erased areas)
  mergedCtx.drawImage(overlayCanvas, 0, 0);

  return mergedCanvas.toDataURL("image/png");
}
