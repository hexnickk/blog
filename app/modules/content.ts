import fs from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { matter } from "vfile-matter";
import { Struct } from "~/lib/struct";
import { z } from "zod";

export namespace ContentModule {
  export class ContentBase extends Struct {
    declare type: string;
    declare slug: string;
    declare title: string;
    declare date: Date;
  }

  export const ContentBaseValidtor = z.object({
    type: z.string(),
    slug: z.string(),
    title: z.string(),
    date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/,
        "Invalid ISO date format",
      )
      .transform((dateStr) => new Date(dateStr)),
  });

  export class LinkContent extends ContentBase {
    declare type: "link";
    declare url: string;
  }

  export const LinkContentValidator = z.object({
    ...ContentBaseValidtor.shape,
    type: z.literal("link"),
    url: z.string(),
  });

  export class PostContent extends ContentBase {
    declare type: "post";
    declare htmlContent: string;
  }

  export const PostContentValidator = z.object({
    ...ContentBaseValidtor.shape,
    type: z.literal("post"),
    htmlContent: z.string(),
  });

  export async function listAll() {
    const contentDir = path.join(process.cwd(), "content");
    const filenames = await fs.readdir(contentDir);
    const mdFiles = filenames.filter((filename) => filename.endsWith(".md"));

    const processor = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ["yaml"])
      .use(function myUnifiedPluginHandlingYamlMatter() {
        /**
         * Transform.
         *
         * @param {Node} tree
         *   Tree.
         * @param {VFile} file
         *   File.
         * @returns {undefined}
         *   Nothing.
         */
        return function (tree, file) {
          matter(file);
        };
      })
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify);

    const contentData = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = path.join(contentDir, filename);
        const fileContent = await fs.readFile(filePath, "utf-8");

        const vFile = await processor.process(fileContent);
        const frontmatter = vFile.data.matter || {};
        const htmlContent = String(vFile);

        const slug = filename.replace(/\.md$/, "");

        const content = ContentBaseValidtor.parse({
          slug,
          ...frontmatter,
        });

        switch (content.type) {
          case "link":
            return LinkContentValidator.parse({
              slug,
              ...frontmatter,
            });
          case "post":
            return PostContentValidator.parse({
              slug,
              ...frontmatter,
              htmlContent,
            });
          default:
            throw new Error(`Unknown content type: ${content.type}`);
        }
      }),
    );

    contentData.sort((a, b) => a.date.getTime() - b.date.getTime());

    const posts = contentData.filter(
      (content) => content.type === "post",
    ) as PostContent[];
    const links = contentData.filter(
      (content) => content.type === "link",
    ) as LinkContent[];

    return {
      posts,
      links,
    };
  }
}
