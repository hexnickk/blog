import type { Content } from "app/modules/content";
import { useEffect, useState, type ComponentProps } from "react";
import { Link } from "react-router";
import { H3, Muted, P } from "./ui/typography";
import { icons } from "lucide-react";

export type PostPreviewProps = ComponentProps<"a"> & {
  post: Content.Post;
};

export function PostPreview({ post, ...rest }: PostPreviewProps) {
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    setDate(post.date);
  }, [post.date]);

  const Icon = icons[post.icon as keyof typeof icons];

  return (
    <Link to={`/posts/${post.slug}`} className="group" {...rest}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-baseline">
          <H3 className="text-foreground/80 group-hover:text-foreground underline decoration-dotted underline-offset-4">
            {post.title}
          </H3>
        </div>
        <Muted>{date != null && date.toLocaleDateString()}</Muted>
      </div>
      <div className="ml-4">
        <P className="whitespace-pre-wrap">{post.description}</P>
      </div>
    </Link>
  );
}
