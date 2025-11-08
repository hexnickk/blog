import { H1 } from "app/components/ui/typography";
import { useRef, useState, useEffect, useCallback } from "react";

type ShapeType = "circle" | "square" | "triangle" | "cross" | "diamond";

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
  const [dotSize, setDotSize] = useState(8);
  const [shape, setShape] = useState<ShapeType>("circle");
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [threshold, setThreshold] = useState(0);
  const [contrast, setContrast] = useState(1);

  // Debounce slider values to avoid excessive reprocessing
  const debouncedDotSize = useDebounce(dotSize, 100);
  const debouncedThreshold = useDebounce(threshold, 100);
  const debouncedContrast = useDebounce(contrast, 100);

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

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shapeType: ShapeType, cellSize: number) => {
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

      case "triangle":
        const triSize = size * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - triSize / 2);
        ctx.lineTo(centerX - triSize / 2, centerY + triSize / 2);
        ctx.lineTo(centerX + triSize / 2, centerY + triSize / 2);
        ctx.closePath();
        ctx.fill();
        break;

      case "cross":
        const crossWidth = size / 3;
        const crossLength = size * 2;
        // Horizontal bar
        ctx.fillRect(centerX - crossLength / 2, centerY - crossWidth / 2, crossLength, crossWidth);
        // Vertical bar
        ctx.fillRect(centerX - crossWidth / 2, centerY - crossLength / 2, crossWidth, crossLength);
        break;

      case "diamond":
        const diamondSize = size * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - diamondSize / 2);
        ctx.lineTo(centerX + diamondSize / 2, centerY);
        ctx.lineTo(centerX, centerY + diamondSize / 2);
        ctx.lineTo(centerX - diamondSize / 2, centerY);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }, []);

  const generateHalftone = useCallback((
    img: HTMLImageElement,
    shapeType: ShapeType = shape,
    cellSize: number = debouncedDotSize,
    shapeColor: string = color,
    bgColor: string = backgroundColor,
    thresholdValue: number = debouncedThreshold,
    contrastValue: number = debouncedContrast
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image to get pixel data
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Clear canvas for halftone output with background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Halftone parameters
    ctx.fillStyle = shapeColor;

    // Process image in grid
    for (let y = 0; y < canvas.height; y += cellSize) {
      for (let x = 0; x < canvas.width; x += cellSize) {
        // Calculate average brightness in this cell
        let brightnessSum = 0;
        let pixelCount = 0;

        for (let dy = 0; dy < cellSize && y + dy < canvas.height; dy++) {
          for (let dx = 0; dx < cellSize && x + dx < canvas.width; dx++) {
            const i = ((y + dy) * canvas.width + (x + dx)) * 4;
            // Convert to grayscale (average RGB)
            const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            brightnessSum += brightness;
            pixelCount++;
          }
        }

        let avgBrightness = brightnessSum / pixelCount;

        // Apply contrast
        avgBrightness = Math.min(255, Math.max(0, avgBrightness * contrastValue));

        // Calculate size based on brightness
        // Darker pixels = larger shapes
        const normalizedBrightness = 1 - (avgBrightness / 255);
        const size = normalizedBrightness * (cellSize / 2);

        // Apply threshold - skip if size is below threshold
        if (size < thresholdValue) {
          continue;
        }

        // Draw shape
        drawShape(ctx, x, y, size, shapeType, cellSize);
      }
    }
  }, [shape, debouncedDotSize, color, backgroundColor, debouncedThreshold, debouncedContrast, drawShape]);

  // Auto-regenerate when parameters change
  useEffect(() => {
    if (imageRef.current) {
      generateHalftone(imageRef.current);
    }
  }, [generateHalftone]);

  return (
    <div className="max-w-6xl m-auto px-4 py-24 flex flex-row gap-8">
      {/* Controls */}
      <div className="flex-1">
        <H1>Halftone Generator</H1>
        <input
          className="border p-2"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div className="mt-4">
          <label>
            Dot Size: {dotSize}px
            <input
              type="range"
              min="2"
              max="20"
              value={dotSize}
              onChange={(e) => setDotSize(parseInt(e.target.value))}
              className="block w-full"
            />
          </label>
        </div>
        <div className="mt-4">
          <label>
            Shape:
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value as ShapeType)}
              className="block border p-2"
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
              <option value="cross">Cross</option>
              <option value="diamond">Diamond</option>
            </select>
          </label>
        </div>
        <div className="mt-4">
          <label>
            Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
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
            Threshold: {threshold.toFixed(1)}px
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="block w-full"
            />
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

      {/* Canvas */}
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          className="block w-full border"
        />
      </div>
    </div>
  );
}
