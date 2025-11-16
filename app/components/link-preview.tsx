import type { Content } from "app/modules/content";
import { useEffect, useState, type ComponentProps } from "react";
import { CardLink } from "./ui/card-link";
import { H3, Muted, P } from "./ui/typography";

export type LinkPreviewProps = ComponentProps<"a"> & {
  link: Content.Link;
};

export function LinkPreview({ link, ...rest }: LinkPreviewProps) {
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    setDate(link.date);
  }, [link.date]);

  return (
    <CardLink to={link.href} target="_blank" {...rest}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline">
          <H3 className="text-black group-hover:text-white">{link.title}</H3>
        </div>
        <Muted className="shrink-0 group-hover:text-white">
          {date != null && date.toLocaleDateString()}
        </Muted>
      </div>
      {link.description && (
        <div className="ml-6">
          <P className="whitespace-pre-wrap group-hover:text-white">
            {link.description}
          </P>
        </div>
      )}
    </CardLink>
  );
}
