import { H1 } from "app/components/ui/typography";
import { useRef, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { ShapeType, DitherPattern } from "./constants";
import { generateHalftone, eraseAtPoint, clearEraseMask, exportMergedCanvas } from "./halftone-engine";

interface HalftoneFormValues {
  spacing: number;
  shapeSize: number;
  shapeType: ShapeType;
  ditherPattern: DitherPattern;
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

export default function MasksPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const eraseMaskRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Form state management with react-hook-form
  const { register, watch, setValue } = useForm<HalftoneFormValues>({
    defaultValues: {
      spacing: 8,
      shapeSize: 1,
      shapeType: "square",
      ditherPattern: "bayer8",
      colorA: "#000000",
      colorB: "#ff0000",
      backgroundColor: "#ffffff",
      thresholdMin: 0,
      thresholdMax: 1,
      contrast: 1,
      brightness: 0,
      blur: 0,
      posterize: 256,
      angle: 45,
    },
  });

  // Watch all form values
  const formValues = watch();

  // Canvas interaction state (not form-related)
  const [eraseMode, setEraseMode] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      e.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      alert(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      e.target.value = '';
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onerror = () => {
      alert('Failed to read the image file. Please try a different file.');
      e.target.value = '';
    };

    reader.onload = (event) => {
      img.onerror = () => {
        alert('Failed to load the image. The file may be corrupted or in an unsupported format.');
        e.target.value = '';
      };

      img.onload = () => {
        // Validate image dimensions to prevent performance issues
        const MAX_DIMENSION = 4096;
        if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
          alert(`Image is too large. Maximum dimensions are ${MAX_DIMENSION}x${MAX_DIMENSION}px. Your image is ${img.width}x${img.height}px.`);
          e.target.value = '';
          return;
        }

        imageRef.current = img;
        runGeneration();
        // Reset file input to allow re-uploading the same file
        e.target.value = '';
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const dataUrl = exportMergedCanvas(canvas, overlayCanvas);
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `halftone-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const erase = useCallback((x: number, y: number) => {
    const eraseMask = eraseMaskRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!eraseMask || !overlayCanvas) return;

    eraseAtPoint(eraseMask, overlayCanvas, x, y, brushSize);
  }, [brushSize]);

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } | null => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return null;
    const rect = overlayCanvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (overlayCanvas.width / rect.width),
      y: (e.clientY - rect.top) * (overlayCanvas.height / rect.height),
    };
  }, []);

  const getCanvasCoordinatesFromTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>): { x: number; y: number } | null => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return null;
    const rect = overlayCanvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return null;
    return {
      x: (touch.clientX - rect.left) * (overlayCanvas.width / rect.width),
      y: (touch.clientY - rect.top) * (overlayCanvas.height / rect.height),
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!eraseMode) return;
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    if (coords) erase(coords.x, coords.y);
  }, [eraseMode, getCanvasCoordinates, erase]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!eraseMode || !isDrawing) return;
    const coords = getCanvasCoordinates(e);
    if (coords) erase(coords.x, coords.y);
  }, [eraseMode, isDrawing, getCanvasCoordinates, erase]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!eraseMode) return;
    e.preventDefault(); // Prevent scrolling while erasing
    setIsDrawing(true);
    const coords = getCanvasCoordinatesFromTouch(e);
    if (coords) erase(coords.x, coords.y);
  }, [eraseMode, getCanvasCoordinatesFromTouch, erase]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!eraseMode || !isDrawing) return;
    e.preventDefault(); // Prevent scrolling while erasing
    const coords = getCanvasCoordinatesFromTouch(e);
    if (coords) erase(coords.x, coords.y);
  }, [eraseMode, isDrawing, getCanvasCoordinatesFromTouch, erase]);

  const handleTouchEnd = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Wrapper to call the extracted generateHalftone with current form values
  const runGeneration = useCallback(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const eraseMask = eraseMaskRef.current;
    const img = imageRef.current;
    if (!canvas || !overlayCanvas || !img) return;

    generateHalftone(img, canvas, overlayCanvas, eraseMask, {
      cellSize: formValues.spacing,
      shapeSizeMultiplier: formValues.shapeSize,
      shapeType: formValues.shapeType,
      pattern: formValues.ditherPattern,
      colorA: formValues.colorA,
      colorB: formValues.colorB,
      backgroundColor: formValues.backgroundColor,
      thresholdMin: formValues.thresholdMin,
      thresholdMax: formValues.thresholdMax,
      contrast: formValues.contrast,
      brightness: formValues.brightness,
      blur: formValues.blur,
      posterize: formValues.posterize,
      angle: formValues.angle,
    });
  }, [formValues]);

  const handleClearEdits = useCallback(() => {
    const eraseMask = eraseMaskRef.current;
    if (!eraseMask) return;

    clearEraseMask(eraseMask);
    runGeneration();
  }, [runGeneration]);

  // Auto-regenerate when form values change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      runGeneration();
    }, 150); // Increased debounce for better performance with large images

    return () => clearTimeout(timer);
  }, [formValues]);

  return (
    <div className="max-w-6xl m-auto px-4 py-24">
      <H1>Masks Generator</H1>
      <div className="flex flex-row gap-8">
        {/* Canvas */}
        <div className="flex-1">
          <div className="relative w-full border">
            {/* Base layer: Background color */}
            <canvas
              ref={canvasRef}
              className="block w-full"
            />
            {/* Overlay layer: Halftone with erasing */}
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 w-full"
              style={{ cursor: eraseMode ? 'crosshair' : 'default', touchAction: eraseMode ? 'none' : 'auto' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            />
            {/* Hidden erase mask - tracks erased areas */}
            <canvas
              ref={eraseMaskRef}
              className="hidden"
            />
          </div>

          {/* Canvas Controls */}
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={eraseMode}
                  onChange={(e) => setEraseMode(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-medium">Erase Mode</span>
              </label>

              <div className="flex-1">
                <label className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">Brush: {brushSize}px</span>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    disabled={!eraseMode}
                    className="flex-1"
                  />
                </label>
              </div>
            </div>
            <button
              onClick={handleClearEdits}
              className="border px-3 py-1 text-sm bg-white hover:bg-gray-100 transition-colors rounded"
            >
              Clear Edits
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
          <input
            className="border p-2"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="mt-4">
            <label>
              Spacing: {formValues.spacing}px
              <input
                type="range"
                min="2"
                max="40"
                {...register("spacing", { valueAsNumber: true })}
                className="block w-full"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Shape Size: {formValues.shapeSize.toFixed(2)}x
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.1"
                {...register("shapeSize", { valueAsNumber: true })}
                className="block w-full"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Shape:
              <select
                {...register("shapeType")}
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
                {...register("ditherPattern")}
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
                {...register("colorA")}
                className="block h-10 w-20"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Color B (Light areas):
              <input
                type="color"
                {...register("colorB")}
                className="block h-10 w-20"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Background Color:
              <input
                type="color"
                {...register("backgroundColor")}
                className="block h-10 w-20"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Brightness Range: {(formValues.thresholdMin * 100).toFixed(0)}% - {(formValues.thresholdMax * 100).toFixed(0)}%
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm w-16">Min:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    {...register("thresholdMin", {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const val = parseFloat(e.target.value);
                        if (val > formValues.thresholdMax) {
                          setValue("thresholdMin", formValues.thresholdMax);
                        }
                      }
                    })}
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
                    {...register("thresholdMax", {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const val = parseFloat(e.target.value);
                        if (val < formValues.thresholdMin) {
                          setValue("thresholdMax", formValues.thresholdMin);
                        }
                      }
                    })}
                    className="flex-1"
                  />
                </div>
              </div>
            </label>
          </div>
          <div className="mt-4">
            <label>
              Contrast: {formValues.contrast.toFixed(1)}
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                {...register("contrast", { valueAsNumber: true })}
                className="block w-full"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Brightness: {formValues.brightness}
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                {...register("brightness", { valueAsNumber: true })}
                className="block w-full"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Blur: {formValues.blur}px
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                {...register("blur", { valueAsNumber: true })}
                className="block w-full"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Posterize Levels: {formValues.posterize === 256 ? 'Off' : formValues.posterize}
              <input
                type="range"
                min="2"
                max="256"
                step="1"
                {...register("posterize", { valueAsNumber: true })}
                className="block w-full"
              />
            </label>
          </div>
          <div className="mt-4">
            <label>
              Rotation Angle: {formValues.angle}°
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                {...register("angle", { valueAsNumber: true })}
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
    </div>
  );
}
