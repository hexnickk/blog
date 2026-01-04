import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const COLORS = ["#00ffff", "#ff00ff", "#00ff00", "#ff9900", "#ff0000"];

export function SnippetNeonGlow() {
  const [text, setText] = useState("NEON");
  const [color, setColor] = useState("#00ffff");

  const style = `color: ${color}; text-shadow: 0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}; font-family: sans-serif; font-size: 2rem; font-weight: bold;`;

  const snippet = `<span style="${style}">${text}</span>`;

  return (
    <article className="border-2 border-foreground bg-card shadow-brutal">
      <div className="border-b-2 border-foreground px-6 py-4">
        <h2 className="text-xl font-bold">Neon Glow</h2>
      </div>

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="neon-text" className="text-sm font-medium">
            Text
          </label>
          <Input
            id="neon-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
          />
        </div>

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

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Code</span>
          <CodeBlock>{snippet}</CodeBlock>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Preview</span>
          <div className="border-2 border-foreground bg-black p-8">
            <div dangerouslySetInnerHTML={{ __html: snippet }} />
          </div>
        </div>
      </div>
    </article>
  );
}
