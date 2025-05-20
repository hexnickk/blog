import fs from "node:fs/promises";
import path from "node:path";
import { matter } from "vfile-matter";
import { Struct } from "app/lib/struct";
import { z } from "zod";
import { read } from "to-vfile";

export namespace Content {
  export class Post extends Struct {
    declare type: "post";
    declare slug: string;
    declare draft: boolean;
    declare icon?: string;
    declare title: string;
    declare description: string;
    declare date: Date;
    declare content: string;

    static _validator = z.object({
      type: z.literal("post"),
      slug: z.string(),
      draft: z.boolean(),
      icon: z.string().optional(),
      title: z.string(),
      description: z.string(),
      date: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/,
          "Invalid ISO date format",
        )
        .transform((dateStr) => new Date(dateStr)),
      content: z.string(),
    });

    static fromRaw(raw: unknown) {
      const parsed = Post._validator.parse(raw);
      return Post.create(parsed);
    }
  }

  export class Link extends Struct {
    declare type: "link";
    declare href: string;
    declare title: string;
    declare description?: string;
    declare date: Date;

    static _validator = z.object({
      type: z.literal("link"),
      href: z.string(),
      title: z.string(),
      description: z.string().optional(),
      date: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/,
          "Invalid ISO date format",
        )
        .transform((dateStr) => new Date(dateStr)),
    });

    static fromRaw(raw: unknown) {
      const parsed = Link._validator.parse(raw);
      return Link.create(parsed);
    }
  }

  export type Entry = Post | Link;

  export async function listAll(): Promise<Entry[]> {
    const contentDir = path.join(process.cwd(), "content");
    const filenames = await fs.readdir(contentDir, { recursive: true });
    const files = filenames.filter((filename) => filename.endsWith(".md"));

    const entries = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(contentDir, filename);
        const vFile = await read(filePath);
        matter(vFile, { strip: true });
        const metadata = vFile.data.matter as any;

        switch (metadata.type) {
          case "link":
            return Link.fromRaw({
              type: metadata.type,
              href: metadata.href,
              title: metadata.title,
              description: metadata.description,
              date: metadata.date,
            });
          case "post":
            return Post.fromRaw({
              slug: filename.replace(/\.md$/, ""),
              type: metadata.type,
              draft: metadata.draft!,
              icon: metadata.icon ?? "PencilLine",
              title: metadata.title,
              description: metadata.description,
              date: metadata.date,
              content: String(vFile),
            });
          default:
            throw new Error(`Unknown type: ${metadata.type}`);
        }
      }),
    );

    entries.sort((a, b) => (b.date < a.date ? -1 : 1));

    return entries;
  }

  export async function getPost(slug: string): Promise<Post | undefined> {
    const posts = await listAll();
    return posts
      .filter((post) => post.type === "post")
      .find((post) => post.slug === slug);
  }
}
