import type { Content } from "app/modules/content";
import { useEffect, useState, type ComponentProps } from "react";
import { Link } from "react-router";
import { H3, Muted, P } from "./ui/typography";
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
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-baseline">
          <ExternalLink size="1em" className="inline" />
          &nbsp;
          <H3 className="text-foreground/80 group-hover:text-foreground underline underline-offset-4 decoration-dotted">
            {link.title}
          </H3>
        </div>
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
