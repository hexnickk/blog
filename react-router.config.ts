import type { Config } from "@react-router/dev/config";
import { Content } from "./app/modules/content";

export default {
  prerender: async ({ getStaticPaths }) => {
    const staticPaths = getStaticPaths();

    const posts = await Content.listAll();

    return [...staticPaths, ...posts.map((post) => `/posts/${post.slug}`)];
  },
} satisfies Config;
