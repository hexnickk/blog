import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function SnippetImage() {
  const [url, setUrl] = useState(
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXBucW0ycGdwOGlva3RrNzk4aHVlcmV2ZWIzbHhzeG4yanBsZGk2aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3UkqVq3F50bVCi9URl/giphy.gif",
  );
  const [fullsize, setFullsize] = useState(false);

  const snippet = fullsize
    ? `<img src="${url}" style="position: fixed;left: 0;top: 0;width: 100vw;height: 100vh;"/>`
    : `<img src="${url}"/>`;

  return (
    <article className="border-2 border-foreground bg-card shadow-brutal">
      {/* Card Header */}
      <div className="border-b-2 border-foreground px-6 py-4">
        <h2 className="text-xl font-bold">Image Block</h2>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* URL Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="image-url" className="text-sm font-medium">
            Image URL
          </label>
          <Input
            id="image-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter image URL..."
          />
        </div>

        {/* Checkbox */}
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={fullsize}
              onChange={(e) => setFullsize(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-foreground"
            />
            <span className="text-sm font-medium">Fullsize</span>
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
            {fullsize ? (
              <p className="text-sm text-muted-foreground italic">
                Preview disabled for fullsize mode
              </p>
            ) : (
              <img src={url} className="max-w-full" />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
