import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function extractVideoId(url: string): string {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url;
}

export function SnippetYoutube() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [width, setWidth] = useState(560);
  const [height, setHeight] = useState(315);
  const [autoplay, setAutoplay] = useState(false);

  const videoId = extractVideoId(url);
  const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`;

  const snippet = `<iframe width="${width}" height="${height}" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

  return (
    <article className="border-2 border-foreground bg-card shadow-brutal">
      <div className="border-b-2 border-foreground px-6 py-4">
        <h2 className="text-xl font-bold">YouTube Embed</h2>
      </div>

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="youtube-url" className="text-sm font-medium">
            YouTube URL or Video ID
          </label>
          <Input
            id="youtube-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL..."
          />
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="youtube-width" className="text-sm font-medium">
              Width (px)
            </label>
            <Input
              id="youtube-width"
              type="number"
              min={200}
              max={1920}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="youtube-height" className="text-sm font-medium">
              Height (px)
            </label>
            <Input
              id="youtube-height"
              type="number"
              min={100}
              max={1080}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

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
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Code</span>
          <CodeBlock>{snippet}</CodeBlock>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Preview</span>
          <div className="border-2 border-foreground bg-background p-4 overflow-auto">
            <iframe
              width={width}
              height={height}
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </article>
  );
}
