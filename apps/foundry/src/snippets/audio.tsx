import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function SnippetAudio() {
  const [url, setUrl] = useState(
    "https://dn721505.ca.archive.org/0/items/RichardWagnerTheRideOfTheValkyriesFromApocalypseNow/Richard%20Wagner%20-%20The%20Ride%20of%20the%20Valkyries%20%28From%20Apocalypse%20Now%29.mp3",
  );
  const [autoplay, setAutoplay] = useState(false);
  const [hidden, setHidden] = useState(false);

  const attributes = ["controls", autoplay && "autoplay", hidden && "hidden"]
    .filter(Boolean)
    .join(" ");

  const snippet = `<audio ${attributes}><source src="${url}" type="audio/mpeg"></audio>`;

  return (
    <article className="border-2 border-foreground bg-card shadow-brutal">
      {/* Card Header */}
      <div className="border-b-2 border-foreground px-6 py-4">
        <h2 className="text-xl font-bold">Audio Block</h2>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* URL Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="audio-url" className="text-sm font-medium">
            Audio URL
          </label>
          <Input
            id="audio-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter audio URL..."
          />
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-foreground"
            />
            <span className="text-sm font-medium">Autoplay</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-foreground"
            />
            <span className="text-sm font-medium">Hidden</span>
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
