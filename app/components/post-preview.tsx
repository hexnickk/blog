import type { ContentModule } from "app/modules/content";
import type { ComponentProps } from "react";

export type PostPreviewProps = ComponentProps<"a"> & {
  post: ContentModule.Post;
};

export function PostPreview({ post, ...rest }: PostPreviewProps) {
  return (
    <a href={`/posts/${post.slug}`} {...rest}>
      <h2>{post.title}</h2>
      <p>Date: {post.date.toLocaleString()}</p>
    </a>
  );
}
