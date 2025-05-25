import { Content } from "app/modules/content";
import type { Route } from "./+types/$slug";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import React, { Fragment, type ComponentProps } from "react";
import { H1, H2, H3, H4, P } from "app/components/ui/typography";
import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "app/lib/utils";
import { Link } from "app/components/ui/link";
import { Config } from "app/modules/config";
import { ArrowLeft } from "lucide-react";
import { Layout } from "app/components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: Config.siteName },
    { name: "description", content: Config.siteDescription },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const post = await Content.getPost(params.slug);

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
        h1: function H1Wrapper({ className, ...rest }: ComponentProps<"h1">) {
          return <H1 className={cn("mt-6 mb-4", className)} {...rest} />;
        },
        h2: function H2Wrapper({ className, ...rest }: ComponentProps<"h2">) {
          return <H2 className={cn("mt-5 mb-3", className)} {...rest} />;
        },
        h3: function H3Wrapper({ className, ...rest }: ComponentProps<"h3">) {
          return <H3 className={cn("mt-4 mb-2", className)} {...rest} />;
        },
        h4: function H4Wrapper({ className, ...rest }: ComponentProps<"h4">) {
          return <H4 className={cn("mt-3 mb-1", className)} {...rest} />;
        },
        a: Link,
        p: P,
      },
    });
  const content = processor.processSync(post?.content).result;

  return (
    <Layout>
      <Link to="/" className="flex items-center">
        <ArrowLeft size="1em" /> Go back
      </Link>
      <div>{content}</div>
    </Layout>
  );
}
