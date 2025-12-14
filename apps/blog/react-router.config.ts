import type { Config } from "@react-router/dev/config";
import { Content } from "./app/modules/content";
import { syncAssets } from "./app/lib/sync-assets";

export default {
  ssr: false,
  prerender: async () => {
    const posts = await Content.listPublic();
    return ["/", "/rss.xml", "/posts/$slug", ...posts.filter(post => post.type === "post").map(post => `/posts/${post.slug}`)];
  },
  async buildEnd({ }) {
    await syncAssets();
  },
} satisfies Config;
