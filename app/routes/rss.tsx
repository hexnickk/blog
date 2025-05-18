import { Config } from "app/modules/config";
import { Content } from "app/modules/content";
import { Env } from "app/modules/env";

function postToRssItem(post: Content.Post) {
  return `
  <item>
    <title>${post.title}</title>
    <link>${Env.HOST_URL}/posts/${post.slug}</link>
    <guid isPermaLink="true">${Env.HOST_URL}/posts/${post.slug}</guid>
    <description><![CDATA[${post.description}]]></description>
    <pubDate>${post.date.toUTCString()}</pubDate>
  </item>
`;
}

function postsToRssItems(posts: Content.Post[]) {
  const latestPost = posts[0];
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${Config.siteName}</title>
  <link>${Env.HOST_URL}</link>
  <description>${Config.siteDescription}</description>
  <language>en-uk</language>
  <lastBuildDate>${latestPost.date.toUTCString()}</lastBuildDate>
  ${posts.map(postToRssItem).join("\n")}
</channel>
</rss>`;
}

export async function loader() {
  const posts = await Content.listAll();
  const body = postsToRssItems(posts);

  const response = new Response(body);
  response.headers.set("Content-Type", "application/xml");
  return response;
}
