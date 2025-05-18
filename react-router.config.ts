import type { Config } from "@react-router/dev/config";
import { ContentModule } from "./app/modules/content";

export default {
  prerender: async ({ getStaticPaths }) => {
    const staticPaths = getStaticPaths();

    const posts = await ContentModule.listAll();

    return [...staticPaths, ...posts.map((post) => `/posts/${post.slug}`)];
  },
} satisfies Config;
