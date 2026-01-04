import { SnippetAudio } from "./snippets/audio";
import { SnippetImage } from "./snippets/image";
import { SnippetLongShadow } from "./snippets/long-shadow";
import { SnippetNeonGlow } from "./snippets/neon-glow";
import { SnippetTextStyle } from "./snippets/text-style";
import { SnippetYoutube } from "./snippets/youtube";

export function App() {
  return (
    <div className="min-h-screen mx-auto max-w-6xl p-6">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Foundry</h1>
        <p className="mt-1 text-muted-foreground">
          Snippets to decorate your messages
        </p>
      </header>

      {/* Main content */}
      <main>
        <div className="flex flex-col gap-8">
          <SnippetTextStyle />
          <SnippetNeonGlow />
          <SnippetLongShadow />
          <SnippetAudio />
          <SnippetYoutube />
          <SnippetImage />
        </div>
      </main>
    </div>
  );
}
