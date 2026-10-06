import type { Config } from "@react-router/dev/config";
import { links } from "./app/modules/content";

export default {
  ssr: false,
  prerender: ({ getStaticPaths }) => {
    return [
      ...getStaticPaths(),
      ...(["post", "project"] as const).flatMap((type) => {
        const count = links.filter((link) => link.type === type).length;
        return Array.from(
          { length: Math.max(1, Math.ceil(count / 15)) },
          (_unused, index) => `${type === "project" ? "/projects" : "/posts"}/pages/${index + 1}`,
        );
      }),
    ];
  },
} satisfies Config;
