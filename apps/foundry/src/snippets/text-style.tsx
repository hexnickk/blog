import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const FONTS = ["sans-serif", "serif", "monospace", "cursive", "fantasy"];
const COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
];
const RAINBOW_GRADIENT = "#ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff";

type ColorMode = "single" | "gradient" | "rainbow";

export function SnippetTextStyle() {
  const [text, setText] = useState("Styled Text");
  const [size, setSize] = useState(24);
  const [font, setFont] = useState("sans-serif");
  const [colorMode, setColorMode] = useState<ColorMode>("single");
  const [color, setColor] = useState("#000000");
  const [gradientStart, setGradientStart] = useState("#f093fb");
  const [gradientEnd, setGradientEnd] = useState("#f5576c");
  const [bgColor, setBgColor] = useState("");
  const [margin, setMargin] = useState(0);
  const [padding, setPadding] = useState(0);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strike, setStrike] = useState(false);

  const decorations = [underline && "underline", strike && "line-through"]
    .filter(Boolean)
    .join(" ");

  const getColorStyles = () => {
    if (colorMode === "single") {
      return `color: ${color}`;
    }
    const gradient =
      colorMode === "rainbow"
        ? RAINBOW_GRADIENT
        : `${gradientStart}, ${gradientEnd}`;
    return `background: linear-gradient(90deg, ${gradient}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text`;
  };

  const styles = [
    `font-size: ${size}px`,
    `font-family: ${font}`,
    getColorStyles(),
    bgColor && `background-color: ${bgColor}`,
    margin && `margin: ${margin}px`,
    colorMode === "single" && padding && `padding: ${padding}px`,
    bold && "font-weight: bold",
    italic && "font-style: italic",
    decorations && `text-decoration: ${decorations}`,
  ]
    .filter(Boolean)
    .join("; ");

  const snippet = `<span style="${styles};">${text}</span>`;

  return (
    <article className="border-2 border-foreground bg-card shadow-brutal">
      <div className="border-b-2 border-foreground px-6 py-4">
        <h2 className="text-xl font-bold">Text Style</h2>
      </div>

      <div className="flex flex-col gap-6 p-6">
        {/* Text Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="style-text" className="text-sm font-medium">
            Text
          </label>
          <Textarea
            id="style-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
          />
        </div>

        {/* Size */}
        <div className="flex flex-col gap-2">
          <label htmlFor="style-size" className="text-sm font-medium">
            Size (px)
          </label>
          <Input
            id="style-size"
            type="number"
            min={8}
            max={200}
            step={1}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-32"
          />
        </div>

        {/* Font */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Font</span>
          <div className="flex flex-wrap gap-2">
            {FONTS.map((f) => (
              <button
                key={f}
                onClick={() => setFont(f)}
                className={`h-8 px-3 border border-foreground text-xs ${font === f ? "bg-foreground text-background" : ""}`}
                style={{ fontFamily: f }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Text Color Mode */}
        <div className="flex flex-col gap-2">
          <label htmlFor="color-mode" className="text-sm font-medium">
            Text Color
          </label>
          <NativeSelect
            id="color-mode"
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
          >
            <NativeSelectOption value="single">Single Color</NativeSelectOption>
            <NativeSelectOption value="gradient">Gradient</NativeSelectOption>
            <NativeSelectOption value="rainbow">Rainbow</NativeSelectOption>
          </NativeSelect>
        </div>

        {/* Single Color */}
        {colorMode === "single" && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Color</span>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 border border-foreground ${color === c ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 cursor-pointer border border-foreground"
              />
            </div>
          </div>
        )}

        {/* Gradient Colors */}
        {colorMode === "gradient" && (
          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Start Color</span>
              <input
                type="color"
                value={gradientStart}
                onChange={(e) => setGradientStart(e.target.value)}
                className="h-10 w-16 cursor-pointer border border-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">End Color</span>
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="h-10 w-16 cursor-pointer border border-foreground"
              />
            </div>
          </div>
        )}

        {/* Background Color - only for single color mode */}
        {colorMode === "single" && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Background Color</span>
            <div className="flex gap-2">
              <button
                onClick={() => setBgColor("")}
                className={`h-8 px-3 border border-foreground text-xs ${bgColor === "" ? "bg-foreground text-background" : ""}`}
              >
                None
              </button>
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setBgColor(c)}
                  className={`h-8 w-8 border border-foreground ${bgColor === c ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={bgColor || "#ffffff"}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-8 cursor-pointer border border-foreground"
              />
            </div>
          </div>
        )}

        {/* Spacing */}
        <div className="flex gap-6">
          {colorMode === "single" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="style-padding" className="text-sm font-medium">
                Inner Spacing (px)
              </label>
              <Input
                id="style-padding"
                type="number"
                min={0}
                max={100}
                step={1}
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-32"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="style-margin" className="text-sm font-medium">
              Outer Spacing (px)
            </label>
            <Input
              id="style-margin"
              type="number"
              min={0}
              max={100}
              step={1}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        {/* Style toggles */}
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={bold}
              onChange={(e) => setBold(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-foreground"
            />
            <span className="text-sm font-bold">Bold</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={italic}
              onChange={(e) => setItalic(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-foreground"
            />
            <span className="text-sm italic">Italic</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={underline}
              onChange={(e) => setUnderline(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-foreground"
            />
            <span className="text-sm underline">Underline</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={strike}
              onChange={(e) => setStrike(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-foreground"
            />
            <span className="text-sm line-through">Strike</span>
          </label>
        </div>

        {/* Code output */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Code</span>
          <CodeBlock>{snippet}</CodeBlock>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Preview</span>
          <div className="border-2 border-foreground bg-background p-8">
            <div dangerouslySetInnerHTML={{ __html: snippet }} />
          </div>
        </div>
      </div>
    </article>
  );
}
