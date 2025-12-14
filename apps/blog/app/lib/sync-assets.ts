import { fs, glob, path } from "zx";

export async function syncAssets() {
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
