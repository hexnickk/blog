import { ContentModule } from "app/modules/content";
import type { Route } from "./+types/$slug";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import React, { Fragment, type ComponentProps } from "react";
import { H1, H2, H3, H4 } from "app/components/ui/typography";
import { jsx, jsxs } from "react/jsx-runtime";
import { Header } from "app/components/header";
import { cn } from "app/lib/utils";

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
        h1: function H1Wrapper({ className, ...rest }: ComponentProps<'h1'>) {
          return <H1 className={cn('mb-4 mt-6', className)} {...rest} />;
        },
        h2: function H2Wrapper({ className, ...rest }: ComponentProps<'h2'>) {
          return <H2 className={cn('mb-3 mt-5', className)} {...rest} />;
        },
        h3: function H3Wrapper({ className, ...rest }: ComponentProps<'h3'>) {
          return <H3 className={cn('mb-2 mt-4', className)} {...rest} />;
        },
        h4: function H4Wrapper({ className, ...rest }: ComponentProps<'h4'>) {
          return <H4 className={cn('mb-1 mt-3', className)} {...rest} />;
        },
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
