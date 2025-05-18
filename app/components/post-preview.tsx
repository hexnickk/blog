import type { Content } from "app/modules/content";
import type { ComponentProps } from "react";
import { Link } from "react-router";
import { H3, Muted, P } from "./ui/typography";

export type PostPreviewProps = ComponentProps<"a"> & {
  post: Content.Post;
};

export function PostPreview({ post, ...rest }: PostPreviewProps) {
  return (
    <Link to={`/posts/${post.slug}`} className="group" {...rest}>
      <H3 className="group-hover:underline">{post.title}</H3>
      <Muted>{post.date.toLocaleDateString()}</Muted>
      <P className="whitespace-pre-wrap">{post.description}</P>
    </Link>
  );
}
