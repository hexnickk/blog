import type { Content } from "app/modules/content";
import { useEffect, useState, type ComponentProps } from "react";
import { Link } from "react-router";
import { H4, Muted, P } from "./ui/typography";
import { ExternalLink } from "lucide-react";

export type LinkPreviewProps = ComponentProps<"a"> & {
  link: Content.Link;
};

export function LinkPreview({ link, ...rest }: LinkPreviewProps) {
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    setDate(link.date);
  }, [link.date]);

  return (
    <Link to={link.href} className="group" target="_blank" {...rest}>
      <div className="flex items-center justify-between mb-2">
        <H4 className="group-hover:underline flex items-center gap-1">
          <ExternalLink size="1em" />
          {link.title}
        </H4>
        <Muted>{date != null && date.toLocaleDateString()}</Muted>
      </div>
      {link.description && (
        <div className="ml-4">
          <P className="whitespace-pre-wrap">{link.description}</P>
        </div>
      )}
    </Link>
  );
}
