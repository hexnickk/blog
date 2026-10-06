import type { Config } from "@react-router/dev/config";
import { links } from "./app/modules/content";

export default {
  ssr: false,
  prerender: ({ getStaticPaths }) => {
    const totalPages = Math.max(1, Math.ceil(links.length / 15));
    return [
      ...getStaticPaths(),
      ...Array.from({ length: totalPages }, (_unused, index) => `/pages/${index + 1}`),
    ];
  },
} satisfies Config;
