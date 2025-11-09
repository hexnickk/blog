import { H1 } from "app/components/ui/typography";
import { useRef, useState, useEffect, useCallback } from "react";

type ShapeType = "circle" | "square" | "ascii";

// Auto-scaling factors for different shapes to normalize visual density
const SHAPE_SCALE_FACTORS: Record<ShapeType, number> = {
  circle: 1.0,
  square: 0.75,
  ascii: 1.2,
};

// ASCII art character gradient - ordered from darkest (dense) to lightest (sparse)
// Characters with more visual density represent darker areas
const ASCII_GRADIENT = "@+.=- ";
// Alternative gradients for experimentation:
// const ASCII_GRADIENT = "@%#*+=-:. ";
// const ASCII_GRADIENT = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

// Dithering matrices for ordered dithering
// Values normalized to 0-1 range

// 2x2 Bayer - Coarse pattern, larger blocks
const BAYER_MATRIX_2x2 = [
  [0, 2],
  [3, 1]
].map(row => row.map(val => val / 4));

// 4x4 Bayer - Medium pattern
const BAYER_MATRIX_4x4 = [
  [0,  8,  2,  10],
  [12, 4,  14, 6],
  [3,  11, 1,  9],
  [15, 7,  13, 5]
].map(row => row.map(val => val / 16));

// 8x8 Bayer - Good balance of detail and pattern
const BAYER_MATRIX_8x8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
].map(row => row.map(val => val / 64));

// Clustered-dot halftone - Traditional newspaper look
const CLUSTERED_DOT_6x6 = [
  [24, 17, 13, 14, 18, 25],
  [16, 8,  4,  5,  9,  19],
  [12, 3,  0,  1,  6,  15],
  [11, 2,  1,  0,  7,  20],
  [23, 10, 6,  5,  11, 21],
  [31, 22, 15, 14, 26, 32]
].map(row => row.map(val => val / 36));

// Horizontal scanlines
const HORIZONTAL_LINES_4x4 = [
  [0, 0, 0, 0],
  [2, 2, 2, 2],
  [1, 1, 1, 1],
  [3, 3, 3, 3]
].map(row => row.map(val => val / 4));

// Diagonal stripes
const DIAGONAL_LINES_4x4 = [
  [0, 1, 2, 3],
  [1, 2, 3, 0],
  [2, 3, 0, 1],
  [3, 0, 1, 2]
].map(row => row.map(val => val / 4));

// Vertical scanlines
const VERTICAL_LINES_4x4 = [
  [0, 1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3]
].map(row => row.map(val => val / 4));

// Checkerboard pattern
const CHECKERBOARD_4x4 = [
  [0, 1, 0, 1],
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 0, 1, 0]
].map(row => row.map(val => val / 2));

// Circular/Radial pattern
const CIRCULAR_5x5 = [
  [4, 3, 2, 3, 4],
  [3, 1, 0, 1, 3],
  [2, 0, 0, 0, 2],
  [3, 1, 0, 1, 3],
  [4, 3, 2, 3, 4]
].map(row => row.map(val => val / 5));

type DitherPattern = "variable" | "bayer2" | "bayer4" | "bayer8" | "clustered" | "horizontal" | "vertical" | "diagonal" | "checkerboard" | "circular";

const DITHER_MATRICES: Record<Exclude<DitherPattern, "variable">, number[][]> = {
  bayer2: BAYER_MATRIX_2x2,
  bayer4: BAYER_MATRIX_4x4,
  bayer8: BAYER_MATRIX_8x8,
  clustered: CLUSTERED_DOT_6x6,
  horizontal: HORIZONTAL_LINES_4x4,
  vertical: VERTICAL_LINES_4x4,
  diagonal: DIAGONAL_LINES_4x4,
  checkerboard: CHECKERBOARD_4x4,
  circular: CIRCULAR_5x5
};

// Debounce hook for slider inputs
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Halftone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [spacing, setSpacing] = useState(8);
  const [shapeSize, setShapeSize] = useState(1);
  const [shapeType, setShapeType] = useState<ShapeType>("square");
  const [ditherPattern, setDitherPattern] = useState<DitherPattern>("bayer8");
  const [colorA, setColorA] = useState("#000000");
  const [colorB, setColorB] = useState("#ff0000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [thresholdMin, setThresholdMin] = useState(0);
  const [thresholdMax, setThresholdMax] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [brightness, setBrightness] = useState(0);
  const [blur, setBlur] = useState(0);
  const [posterize, setPosterize] = useState(256);
  const [angle, setAngle] = useState(45);

  // Debounce slider values to avoid excessive reprocessing
  const debouncedSpacing = useDebounce(spacing, 100);
  const debouncedShapeSize = useDebounce(shapeSize, 100);
  const debouncedThresholdMin = useDebounce(thresholdMin, 100);
  const debouncedThresholdMax = useDebounce(thresholdMax, 100);
  const debouncedContrast = useDebounce(contrast, 100);
  const debouncedBrightness = useDebounce(brightness, 100);
  const debouncedBlur = useDebounce(blur, 100);
  const debouncedPosterize = useDebounce(posterize, 100);
  const debouncedAngle = useDebounce(angle, 100);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        imageRef.current = img;
        // Initial generation will happen via useEffect
        generateHalftone(img);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `halftone-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shapeType: ShapeType, cellSize: number, darkness: number = 0) => {
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
        // Darker areas get characters from the left (@ is darkest)
        // Lighter areas get characters from the right (space is lightest)
        const charIndex = Math.floor(darkness * (ASCII_GRADIENT.length - 1));
        const char = ASCII_GRADIENT[charIndex];

        // Font size scales with the size parameter (which includes shapeSizeMultiplier)
        // Base size is cellSize, scaled by the size factor
        const fontSize = (size / (cellSize / 2)) * cellSize * 0.8;
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, centerX, centerY);
        break;
    }
  }, []);

  const generateHalftone = useCallback((
    img: HTMLImageElement,
    cellSize: number = debouncedSpacing,
    shapeSizeMultiplier: number = debouncedShapeSize,
    currentShapeType: ShapeType = shapeType,
    pattern: DitherPattern = ditherPattern,
    colorAValue: string = colorA,
    colorBValue: string = colorB,
    bgColor: string = backgroundColor,
    thresholdMinValue: number = debouncedThresholdMin,
    thresholdMaxValue: number = debouncedThresholdMax,
    contrastValue: number = debouncedContrast,
    brightnessValue: number = debouncedBrightness,
    blurValue: number = debouncedBlur,
    posterizeValue: number = debouncedPosterize,
    angleValue: number = debouncedAngle
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Apply blur filter if needed
    if (blurValue > 0) {
      ctx.filter = `blur(${blurValue}px)`;
    }

    // Draw original image to get pixel data
    ctx.drawImage(img, 0, 0);

    // Reset filter
    ctx.filter = 'none';

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Clear canvas for halftone output with background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Helper function to interpolate between two colors
    const interpolateColor = (colorA: string, colorB: string, t: number): string => {
      // Parse hex colors
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };

      const rgbA = hexToRgb(colorA);
      const rgbB = hexToRgb(colorB);

      const r = Math.round(rgbA.r + (rgbB.r - rgbA.r) * t);
      const g = Math.round(rgbA.g + (rgbB.g - rgbA.g) * t);
      const b = Math.round(rgbA.b + (rgbB.b - rgbA.b) * t);

      return `rgb(${r}, ${g}, ${b})`;
    };

    // Convert angle to radians for rotation
    const angleRad = (angleValue * Math.PI) / 180;
    const cosAngle = Math.cos(angleRad);
    const sinAngle = Math.sin(angleRad);

    // Calculate center of canvas for rotation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate bounding box for rotated grid
    const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
    const gridExtent = Math.ceil(diagonal / cellSize) + 1;

    // Get the selected dither matrix (if not using variable size)
    const useVariableSize = pattern === "variable";
    const ditherMatrix = useVariableSize ? null : DITHER_MATRICES[pattern];
    const matrixSize = ditherMatrix?.length ?? 1;

    // Auto-scaling factor for shapes
    const autoScale = SHAPE_SCALE_FACTORS[currentShapeType];

    // Process image in rotated grid using selected dither matrix
    for (let gridY = -gridExtent; gridY < gridExtent; gridY++) {
      for (let gridX = -gridExtent; gridX < gridExtent; gridX++) {
        // Calculate position in rotated grid space
        const localX = gridX * cellSize;
        const localY = gridY * cellSize;

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
        const sampleSize = Math.ceil(cellSize * 0.7);
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
        avgBrightness = Math.min(255, Math.max(0, avgBrightness + brightnessValue));

        // Apply contrast
        avgBrightness = Math.min(255, Math.max(0, avgBrightness * contrastValue));

        // Normalize brightness (0 = black, 1 = white)
        let normalizedBrightness = avgBrightness / 255;

        // Apply posterize/quantization
        if (posterizeValue < 256) {
          normalizedBrightness = Math.round(normalizedBrightness * (posterizeValue - 1)) / (posterizeValue - 1);
        }

        const darkness = 1 - normalizedBrightness;

        // Apply brightness threshold range
        if (darkness < thresholdMinValue || darkness > thresholdMaxValue) {
          continue;
        }

        let dotSize: number;

        if (useVariableSize) {
          // Variable size mode: dot size varies with darkness
          dotSize = darkness * (cellSize / 2) * autoScale * shapeSizeMultiplier;
        } else {
          // Dithering mode: use matrix threshold
          // Get matrix threshold for this position
          const matrixX = ((gridX % matrixSize) + matrixSize) % matrixSize;
          const matrixY = ((gridY % matrixSize) + matrixSize) % matrixSize;
          const matrixThreshold = ditherMatrix![matrixY][matrixX];

          // Matrix comparison - skip if darkness doesn't exceed threshold
          if (darkness < matrixThreshold) {
            continue;
          }

          // Uniform dot size for dithering patterns
          dotSize = (cellSize / 2) * autoScale * shapeSizeMultiplier;
        }

        // Interpolate color based on brightness
        // Dark areas (low brightness) → colorA
        // Light areas (high brightness) → colorB
        const dotColor = interpolateColor(colorAValue, colorBValue, normalizedBrightness);
        ctx.fillStyle = dotColor;

        // Draw shape (adjusted for cell centering)
        // Pass darkness value for ASCII art character selection
        drawShape(ctx, rotatedX - cellSize / 2, rotatedY - cellSize / 2, dotSize, currentShapeType, cellSize, darkness);
      }
    }
  }, [debouncedSpacing, debouncedShapeSize, shapeType, ditherPattern, colorA, colorB, backgroundColor, debouncedThresholdMin, debouncedThresholdMax, debouncedContrast, debouncedBrightness, debouncedBlur, debouncedPosterize, debouncedAngle, drawShape]);

  // Auto-regenerate when parameters change
  useEffect(() => {
    if (imageRef.current) {
      generateHalftone(imageRef.current);
    }
  }, [generateHalftone]);

  return (
    <div className="max-w-6xl m-auto px-4 py-24 flex flex-row gap-8">
      {/* Canvas */}
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          className="block w-full border"
        />
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
        <H1>Masks Generator</H1>
        <input
          className="border p-2"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div className="mt-4">
          <label>
            Spacing: {spacing}px
            <input
              type="range"
              min="2"
              max="20"
              value={spacing}
              onChange={(e) => setSpacing(parseInt(e.target.value))}
              className="block w-full"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Shape Size: {shapeSize.toFixed(2)}x
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={shapeSize}
              onChange={(e) => setShapeSize(parseFloat(e.target.value))}
              className="block w-full"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Shape:
            <select
              value={shapeType}
              onChange={(e) => setShapeType(e.target.value as ShapeType)}
              className="block border p-2"
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="ascii">ASCII Art</option>
            </select>
          </label>
        </div>
        <div className="mt-4">
          <label>
            Pattern:
            <select
              value={ditherPattern}
              onChange={(e) => setDitherPattern(e.target.value as DitherPattern)}
              className="block border p-2"
            >
              <option value="variable">Variable Size (Classic)</option>
              <option value="bayer2">Bayer 2x2 (Blocky)</option>
              <option value="bayer4">Bayer 4x4 (Medium)</option>
              <option value="bayer8">Bayer 8x8 (Fine)</option>
              <option value="clustered">Clustered Dot (Newspaper)</option>
              <option value="horizontal">Horizontal Lines</option>
              <option value="vertical">Vertical Lines</option>
              <option value="diagonal">Diagonal Lines</option>
              <option value="checkerboard">Checkerboard</option>
              <option value="circular">Circular</option>
            </select>
          </label>
        </div>
        <div className="mt-4">
          <label>
            Color A (Dark areas):
            <input
              type="color"
              value={colorA}
              onChange={(e) => setColorA(e.target.value)}
              className="block h-10 w-20"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Color B (Light areas):
            <input
              type="color"
              value={colorB}
              onChange={(e) => setColorB(e.target.value)}
              className="block h-10 w-20"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Background Color:
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="block h-10 w-20"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Brightness Range: {(thresholdMin * 100).toFixed(0)}% - {(thresholdMax * 100).toFixed(0)}%
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Min:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={thresholdMin}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val <= thresholdMax) setThresholdMin(val);
                  }}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Max:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={thresholdMax}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val >= thresholdMin) setThresholdMax(val);
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </label>
        </div>
        <div className="mt-4">
          <label>
            Contrast: {contrast.toFixed(1)}
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={contrast}
              onChange={(e) => setContrast(parseFloat(e.target.value))}
              className="block w-full"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Brightness: {brightness}
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="block w-full"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Blur: {blur}px
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={blur}
              onChange={(e) => setBlur(parseFloat(e.target.value))}
              className="block w-full"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Posterize Levels: {posterize === 256 ? 'Off' : posterize}
            <input
              type="range"
              min="2"
              max="256"
              step="1"
              value={posterize}
              onChange={(e) => setPosterize(parseInt(e.target.value))}
              className="block w-full"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Rotation Angle: {angle}°
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="block w-full"
            />
          </label>
        </div>
        <div className="mt-6">
          <button
            onClick={handleDownload}
            disabled={!imageRef.current}
            className="border px-4 py-2 bg-black text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            Download Halftone
          </button>
        </div>
      </div>
    </div>
  );
}
