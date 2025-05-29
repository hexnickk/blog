import type { Content } from "app/modules/content";
import { useEffect, useState, type ComponentProps } from "react";
import { Link } from "react-router";
import { H3, Muted, P } from "./ui/typography";

export type PostPreviewProps = ComponentProps<"a"> & {
  post: Content.Post;
};

export function PostPreview({ post, ...rest }: PostPreviewProps) {
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    setDate(post.date);
  }, [post.date]);

  return (
    <Link to={`/posts/${post.slug}`} className="group" {...rest}>
      <div className="flex items-center justify-between">
        <H3 className="text-foreground/80 group-hover:text-foreground underline decoration-dotted underline-offset-4">
          {post.title}
        </H3>
        <Muted>{date != null && date.toLocaleDateString()}</Muted>
      </div>
      <P className="whitespace-pre-wrap">{post.description}</P>
    </Link>
  );
}
