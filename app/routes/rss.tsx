import { links } from "app/modules/content";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function loader() {
  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Nick K blog</title>
  <link>${escapeXml(import.meta.env.VITE_HOST_URL)}</link>
  <description>I'm Nick, a software engineer, who dives deep into the unknown. Welcome to the journey!</description>
  <lastBuildDate>${new Date(links[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
  ${links
    .map((link) => {
      const href = escapeXml(new URL(link.href, import.meta.env.VITE_HOST_URL).href);
      return `<item>
    <title>${escapeXml(link.title)}</title>
    <link>${href}</link>
    <guid isPermaLink="true">${href}</guid>
    <description>${escapeXml(link.description ?? "")}</description>
    <pubDate>${new Date(link.date).toUTCString()}</pubDate>
  </item>`;
    })
    .join("\n")}
</channel>
</rss>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
