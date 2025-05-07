import type { Route } from "./+types/home";
import fs from "node:fs/promises";
import path from "node:path";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { matter } from "vfile-matter";

interface Post {
  slug: string;
  title: string;
  date: string;
  htmlContent: string;
}

export async function loader({ }: Route.LoaderArgs): Promise<{ posts: Post[] }> {
  const contentDir = path.join(process.cwd(), "content");
  const filenames = await fs.readdir(contentDir);
  const mdFiles = filenames.filter((filename) => filename.endsWith(".md"));

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
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
        matter(file)
      }
    })
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify);

  const postsData = await Promise.all(
    mdFiles.map(async (filename) => {
      const filePath = path.join(contentDir, filename);
      const fileContent = await fs.readFile(filePath, "utf-8");

      const vFile = await processor.process(fileContent);
      const frontmatter = (vFile.data.matter || {}) as { title?: string; date?: string };
      const htmlContent = String(vFile);

      return {
        slug: filename.replace(/\.md$/, ""),
        title: frontmatter.title || "Untitled Post",
        date: new Date(frontmatter.date || Date.now()),
        htmlContent: htmlContent,
      };
    })
  );

  postsData.sort((a, b) => a.date.getTime() - b.date.getTime());

  const posts: Post[] = postsData.map(post => ({
    ...post,
    date: post.date.toISOString().split('T')[0],
  }));

  return { posts };
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {posts.map((post: Post) => (
            <li key={post.slug}>
              <h2>{post.title}</h2>
              <p>Date: {post.date}</p>
              <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
