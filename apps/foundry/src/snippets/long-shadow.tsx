import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SHADOW_COLORS = [
  "#ef3550",
  "#f48fb1",
  "#7e57c2",
  "#2196f3",
  "#26c6da",
  "#43a047",
  "#eeff41",
  "#f9a825",
  "#ff5722",
];

export function SnippetLongShadow() {
  const [text, setText] = useState("BOOM");
  const [size, setSize] = useState(48);
  const [depth, setDepth] = useState(9);

  const shadows = SHADOW_COLORS.slice(0, depth)
    .map((color, i) => `${-4 * (i + 1)}px ${4 * (i + 1)}px ${color}`)
    .join(",");

  const style = `margin-top: 0px;margin-bottom: 50px;text-align: center;font-family: sans-serif;font-size: ${size}px;letter-spacing: 0.15rem;text-transform: uppercase;color: #fff;text-shadow: ${shadows};`;

  const snippet = `<span style="${style}">${text}</span>`;

  return (
    <article className="border-2 border-foreground bg-card shadow-brutal">
      <div className="border-b-2 border-foreground px-6 py-4">
        <h2 className="text-xl font-bold">Long Shadow</h2>
      </div>

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="shadow-text" className="text-sm font-medium">
            Text
          </label>
          <Input
            id="shadow-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
          />
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="shadow-size" className="text-sm font-medium">
              Size (px)
            </label>
            <Input
              id="shadow-size"
              type="number"
              min={12}
              max={200}
              step={1}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="shadow-depth" className="text-sm font-medium">
              Shadow Depth ({depth})
            </label>
            <input
              id="shadow-depth"
              type="range"
              min={1}
              max={9}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-32 cursor-pointer accent-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Code</span>
          <CodeBlock>{snippet}</CodeBlock>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Preview</span>
          <div className="border-2 border-foreground bg-neutral-800 p-8 overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: snippet }} />
          </div>
        </div>
      </div>
    </article>
  );
}
