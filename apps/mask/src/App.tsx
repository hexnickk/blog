import { useRef, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import type { ShapeType, DitherPattern } from "./constants";
import {
  generateHalftone,
  exportMergedCanvas,
} from "./halftone-engine";
import { H1 } from "./components/typography";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Slider } from "./components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

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

export function App() {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      e.target.value = "";
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onerror = () => {
      alert("Failed to read the image file. Please try a different file.");
      e.target.value = "";
    };

    reader.onload = (event) => {
      img.onerror = () => {
        alert(
          "Failed to load the image. The file may be corrupted or in an unsupported format.",
        );
        e.target.value = "";
      };

      img.onload = () => {
        imageRef.current = img;
        runGeneration();
        // Reset file input to allow re-uploading the same file
        e.target.value = "";
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

  // Load default image on mount
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      runGeneration();
    };
    img.onerror = () => {
      console.error("Failed to load default image");
    };
    img.src = "/massimiliano-morosinotto-3i5PHVp1Fkw-unsplash (1).jpg";
  }, []); // Empty deps - run only once on mount

  // Auto-regenerate when form values change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      runGeneration();
    }, 150); // Increased debounce for better performance with large images

    return () => clearTimeout(timer);
  }, [runGeneration]);

  return (
    <div className="m-auto max-w-6xl px-4 py-8 md:py-24">
      <H1 className="mb-4 md:mb-6">Masks Generator</H1>
      <div className="flex flex-col gap-4 md:h-[calc(100vh-16rem)] md:flex-row md:gap-8">
        {/* Canvas Section */}
        <div className="flex w-full flex-col md:flex-1">
          {/* Canvas - sizes based on image dimensions */}
          <div className="relative w-full border">
            {/* Base layer: Background color */}
            <canvas
              ref={canvasRef}
              className="block max-h-[50vh] w-full md:max-h-[70vh]"
              style={{ objectFit: "contain" }}
            />
            {/* Overlay layer: Halftone with erasing */}
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 max-h-[50vh] w-full md:max-h-[70vh]"
              style={{
                objectFit: "contain",
              }}
            />
            {/* Hidden erase mask - tracks erased areas */}
            <canvas ref={eraseMaskRef} className="hidden" />
          </div>
        </div>

        {/* Controls Section - scrollable with max height on mobile */}
        <div className="max-h-[calc(100vh-40vh-8rem)] w-full overflow-y-auto md:max-h-none md:flex-1 md:pr-2">
          <div className="mb-4 space-y-3">
            <input
              className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 w-full rounded-md border p-2 text-sm file:mr-2 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-semibold md:file:mr-4 md:file:px-4 md:file:py-2"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button
              onClick={handleDownload}
              disabled={!imageRef.current}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Download Image
            </Button>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Spacing: {formValues.spacing}px</Label>
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
            <Label className="text-sm">
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
            <Label className="text-sm">Shape</Label>
            <Controller
              name="shapeType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-full">
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
            <Label className="text-sm">Pattern</Label>
            <Controller
              name="ditherPattern"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="variable">
                      Variable Size (Classic)
                    </SelectItem>
                    <SelectItem value="bayer2">Bayer 2x2 (Blocky)</SelectItem>
                    <SelectItem value="bayer4">Bayer 4x4 (Medium)</SelectItem>
                    <SelectItem value="bayer8">Bayer 8x8 (Fine)</SelectItem>
                    <SelectItem value="clustered">
                      Clustered Dot (Newspaper)
                    </SelectItem>
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
          <div className="mt-4 space-y-2">
            <Label className="flex items-center justify-between text-sm">
              <span>Color A (Dark areas)</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs">
                  {formValues.colorA}
                </span>
                <input
                  type="color"
                  {...register("colorA")}
                  className="h-8 w-8 cursor-pointer rounded border"
                />
              </div>
            </Label>
          </div>
          <div className="mt-4 space-y-2">
            <Label className="flex items-center justify-between text-sm">
              <span>Color B (Light areas)</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs">
                  {formValues.colorB}
                </span>
                <input
                  type="color"
                  {...register("colorB")}
                  className="h-8 w-8 cursor-pointer rounded border"
                />
              </div>
            </Label>
          </div>
          <div className="mt-4 space-y-2">
            <Label className="flex items-center justify-between text-sm">
              <span>Background Color</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs">
                  {formValues.backgroundColor}
                </span>
                <input
                  type="color"
                  {...register("backgroundColor")}
                  className="h-8 w-8 cursor-pointer rounded border"
                />
              </div>
            </Label>
          </div>
          <div className="mt-4 space-y-2">
            <Label className="text-sm">
              Brightness Range: {(formValues.thresholdMin * 100).toFixed(0)}% -{" "}
              {(formValues.thresholdMax * 100).toFixed(0)}%
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
            <Label className="text-sm">
              Contrast: {formValues.contrast.toFixed(1)}
            </Label>
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
            <Label className="text-sm">
              Brightness: {formValues.brightness}
            </Label>
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
            <Label className="text-sm">Blur: {formValues.blur}px</Label>
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
            <Label className="text-sm">
              Posterize Levels:{" "}
              {formValues.posterize === 256 ? "Off" : formValues.posterize}
            </Label>
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
          <div className="mt-4 space-y-2 pb-4">
            <Label className="text-sm">
              Rotation Angle: {formValues.angle}°
            </Label>
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
