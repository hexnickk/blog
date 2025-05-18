import { ContentModule } from "app/modules/content";
import type { Route } from "./+types/$slug";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import React, { Fragment } from "react";
import { H1, H2, H3, H4 } from "app/components/ui/typography";
import { jsx, jsxs } from "react/jsx-runtime";
import { Header } from "app/components/header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nick K blog" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const post = await ContentModule.getPost(params.slug);

  return {
    post,
  };
}

export default function PostsSlug({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeReact, {
      createElement: React.createElement,
      Fragment,
      jsx,
      jsxs,
      components: {
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
      },
    });
  const content = processor.processSync(post?.content).result;

  return (
    <div className="min-h-screen m-auto max-w-2xl px-4 py-4 flex flex-col">
      <Header />
      <div>{content}</div>
    </div>
  );
}
