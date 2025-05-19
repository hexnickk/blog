import type { Content } from "app/modules/content";
import { useEffect, useState, type ComponentProps } from "react";
import { Link } from "react-router";
import { H4, Muted, P } from "./ui/typography";

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
      <div className="flex items-center justify-between mb-2">
        <H4 className="group-hover:underline">{post.title}</H4>
        <Muted>{date != null && date.toLocaleDateString()}</Muted>
      </div>
      <div className="ml-4">
        <P className="whitespace-pre-wrap">{post.description}</P>
      </div>
    </Link>
  );
}
