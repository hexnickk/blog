import fs from "node:fs/promises";
import path from "node:path";
import { matter } from "vfile-matter";
import { Struct } from "app/lib/struct";
import { z } from "zod";
import { read } from "to-vfile";

export namespace Content {
  export class Post extends Struct {
    declare slug: string;
    declare draft: boolean;
    declare title: string;
    declare description: string;
    declare date: Date;
    declare content: string;

    static _validator = z.object({
      slug: z.string(),
      draft: z.boolean(),
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

  export async function listAll(): Promise<Post[]> {
    const contentDir = path.join(process.cwd(), "content");
    const filenames = await fs.readdir(contentDir, { recursive: true });
    const files = filenames.filter((filename) => filename.endsWith(".md"));
    const posts = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(contentDir, filename);
        const vFile = await read(filePath);
        matter(vFile, { strip: true });
        const metadata = vFile.data.matter as any;

        return Post.fromRaw({
          slug: filename.replace(/\.md$/, ""),
          draft: metadata.draft!,
          title: metadata.title,
          description: metadata.description,
          date: metadata.date,
          content: String(vFile),
        });
      }),
    );

    posts.sort((a, b) => (b.date > a.date ? -1 : 1));

    return posts;
  }

  export async function getPost(slug: string): Promise<Post | undefined> {
    const posts = await listAll();
    return posts.find((post) => post.slug === slug);
  }
}
