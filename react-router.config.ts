import type { Config } from "@react-router/dev/config";
import { Content } from "./app/modules/content";

import path from "path";
import fs from "fs/promises";
import { glob } from "zx";

async function syncAssets() {
  const assetPaths = await glob(`content/**/*`, {
    ignore: ["**/*.md", "**/*.mdx"],
  });

  let assetsCopied = 0;
  for (const sourcePath of assetPaths) {
    const relativePath = path.relative("content", sourcePath);
    const destPath = path.join("public/content", relativePath);
    const destDir = path.dirname(destPath);

    try {
      await fs.mkdir(destDir, { recursive: true });
      await fs.copyFile(sourcePath, destPath);
      assetsCopied++;
    } catch (error) {
      console.error(`❌ Failed to copy ${relativePath}:`, error);
    }
  }

  if (assetsCopied > 0) {
    console.log(`✨ Copied ${assetsCopied} asset(s) to the public directory.`);
  } else {
    console.log("✨ No new assets to copy.");
  }
}

export default {
  prerender: async ({ getStaticPaths }) => {
    await syncAssets();

    const staticPaths = getStaticPaths();
    const posts = await Content.listPublic();

    return [
      ...staticPaths,
      ...posts
        .filter((entry) => "slug" in entry)
        .map((post) => `/posts/${post.slug}`),
    ];
  },
} satisfies Config;
