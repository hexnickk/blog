import { glob } from "zx";
import { read, write } from "to-vfile";
import { matter } from "vfile-matter";
import path from "node:path";

/**
 * Detects if text contains Cyrillic characters (Russian)
 */
function hasCyrillic(text: string): boolean {
  return /[а-яА-ЯёЁ]/.test(text);
}

/**
 * Detects language based on content
 */
function detectLanguage(metadata: any, content: string): "en" | "ru" {
  const textToCheck = [
    metadata.title || "",
    metadata.description || "",
    content.slice(0, 500), // Check first 500 chars of content
  ].join(" ");

  return hasCyrillic(textToCheck) ? "ru" : "en";
}

async function main() {
  const contentDir = path.join(process.cwd(), "content");
  const files = await glob("**/*.md", { cwd: contentDir });

  console.log(`Found ${files.length} markdown files`);

  let updated = 0;
  let skipped = 0;

  for (const filename of files) {
    const filePath = path.join(contentDir, filename);
    const vFile = await read(filePath);
    matter(vFile, { strip: false });

    const metadata = vFile.data.matter as any;

    // Skip if already has lang field
    if (metadata.lang) {
      console.log(
        `⏭️  Skipping ${filename} (already has lang: ${metadata.lang})`,
      );
      skipped++;
      continue;
    }

    // Detect language
    const detectedLang = detectLanguage(metadata, String(vFile));

    // Add lang field to frontmatter
    const frontmatterMatch = String(vFile).match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const newFrontmatter = `${frontmatter}\nlang: ${detectedLang}`;
      const newContent = String(vFile).replace(
        /^---\n[\s\S]*?\n---/,
        `---\n${newFrontmatter}\n---`,
      );

      vFile.value = newContent;
      await write(vFile);

      console.log(`✅ Updated ${filename} → lang: ${detectedLang}`);
      updated++;
    }
  }

  console.log(`\n✨ Done! Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch(console.error);
