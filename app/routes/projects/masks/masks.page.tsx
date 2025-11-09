import { H1 } from "app/components/ui/typography";
import { useRef, useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import type { ShapeType, DitherPattern } from "./constants";
import { generateHalftone, eraseAtPoint, clearEraseMask, exportMergedCanvas } from "./halftone-engine";
import { Button } from "app/components/ui/button";
import { Label } from "app/components/ui/label";
import { Slider } from "app/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "app/components/ui/select";
import { Eraser } from "lucide-react";

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
  const { register, watch, setValue, control } = useForm<HalftoneFormValues>({
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
  }, [runGeneration]);

  return (
    <div className="max-w-6xl m-auto px-4 py-24">
      <H1>Masks Generator</H1>
      <div className="flex flex-row gap-8 h-[calc(100vh-16rem)]">
        {/* Canvas */}
        <div className="flex-1 flex flex-col">
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
          <div className="mt-4">
            <div className="flex items-center gap-4 mb-3">
              <Button
                variant={eraseMode ? "default" : "outline"}
                size="sm"
                onClick={() => setEraseMode(!eraseMode)}
              >
                <Eraser className="mr-2 h-4 w-4" />
                Erase Mode
              </Button>

              <div className="flex-1">
                <Label className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">Brush: {brushSize}px</span>
                  <Slider
                    min={5}
                    max={100}
                    step={1}
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                    disabled={!eraseMode}
                    className="flex-1"
                  />
                </Label>
              </div>
            </div>
            <Button
              onClick={handleClearEdits}
              variant="outline"
              size="sm"
            >
              Clear Edits
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-3">
            <input
              className="border p-2 rounded-md w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button
              onClick={handleDownload}
              disabled={!imageRef.current}
              variant="outline"
              className="w-full"
            >
              Download Image
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <Label>
              Spacing: {formValues.spacing}px
            </Label>
            <Controller
              name="spacing"
              control={control}
              render={({ field }) => (
                <Slider
                  min={2}
                  max={40}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>
              Shape Size: {formValues.shapeSize.toFixed(2)}x
            </Label>
            <Controller
              name="shapeSize"
              control={control}
              render={({ field }) => (
                <Slider
                  min={0.5}
                  max={4}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Shape</Label>
            <Controller
              name="shapeType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="ascii">ASCII Art</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Pattern</Label>
            <Controller
              name="ditherPattern"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="variable">Variable Size (Classic)</SelectItem>
                    <SelectItem value="bayer2">Bayer 2x2 (Blocky)</SelectItem>
                    <SelectItem value="bayer4">Bayer 4x4 (Medium)</SelectItem>
                    <SelectItem value="bayer8">Bayer 8x8 (Fine)</SelectItem>
                    <SelectItem value="clustered">Clustered Dot (Newspaper)</SelectItem>
                    <SelectItem value="horizontal">Horizontal Lines</SelectItem>
                    <SelectItem value="vertical">Vertical Lines</SelectItem>
                    <SelectItem value="diagonal">Diagonal Lines</SelectItem>
                    <SelectItem value="checkerboard">Checkerboard</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="mt-4">
            <Label className="flex items-center justify-between">
              <span>Color A (Dark areas)</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{formValues.colorA}</span>
                <input
                  type="color"
                  {...register("colorA")}
                  className="h-8 w-8 rounded border cursor-pointer"
                />
              </div>
            </Label>
          </div>
          <div className="mt-4">
            <Label className="flex items-center justify-between">
              <span>Color B (Light areas)</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{formValues.colorB}</span>
                <input
                  type="color"
                  {...register("colorB")}
                  className="h-8 w-8 rounded border cursor-pointer"
                />
              </div>
            </Label>
          </div>
          <div className="mt-4">
            <Label className="flex items-center justify-between">
              <span>Background Color</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{formValues.backgroundColor}</span>
                <input
                  type="color"
                  {...register("backgroundColor")}
                  className="h-8 w-8 rounded border cursor-pointer"
                />
              </div>
            </Label>
          </div>
          <div className="mt-4 space-y-2">
            <Label>
              Brightness Range: {(formValues.thresholdMin * 100).toFixed(0)}% - {(formValues.thresholdMax * 100).toFixed(0)}%
            </Label>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[formValues.thresholdMin, formValues.thresholdMax]}
              onValueChange={(values) => {
                setValue("thresholdMin", Math.min(values[0], values[1]));
                setValue("thresholdMax", Math.max(values[0], values[1]));
              }}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Contrast: {formValues.contrast.toFixed(1)}</Label>
            <Controller
              name="contrast"
              control={control}
              render={({ field }) => (
                <Slider
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Brightness: {formValues.brightness}</Label>
            <Controller
              name="brightness"
              control={control}
              render={({ field }) => (
                <Slider
                  min={-100}
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Blur: {formValues.blur}px</Label>
            <Controller
              name="blur"
              control={control}
              render={({ field }) => (
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Posterize Levels: {formValues.posterize === 256 ? 'Off' : formValues.posterize}</Label>
            <Controller
              name="posterize"
              control={control}
              render={({ field }) => (
                <Slider
                  min={2}
                  max={256}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Rotation Angle: {formValues.angle}°</Label>
            <Controller
              name="angle"
              control={control}
              render={({ field }) => (
                <Slider
                  min={0}
                  max={90}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
