import type { Content } from "app/modules/content";
import { useEffect, useState, type ComponentProps } from "react";
import { CardLink } from "./ui/card-link";
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
    <CardLink to={`/posts/${post.slug}`} {...rest}>
      <div className="flex items-center justify-between gap-4">
        <H3 className="text-black group-hover:text-white">{post.title}</H3>
        <Muted className="shrink-0 group-hover:text-white">
          {date != null && date.toLocaleDateString()}
        </Muted>
      </div>
      <P className="mt-4 whitespace-pre-wrap group-hover:text-white">
        {post.description}
      </P>
    </CardLink>
  );
}
