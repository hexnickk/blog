import { PostPreview } from "app/components/post-preview";
import type { Route } from "./+types/home";
import { Content } from "app/modules/content";
import { H2, P, type H2Props } from "app/components/ui/typography";
import { Layout } from "app/components/layout";
import { Config } from "app/modules/config";
import { Link } from "app/components/ui/link";
import { type ComponentProps } from "react";
import { cn } from "app/lib/utils";
import { LinkPreview } from "app/components/link-preview";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: Config.siteName },
    { name: "description", content: Config.siteDescription },
  ];
}

export async function loader({ }: Route.LoaderArgs) {
  const entries = await Content.listAll();
  return { entries };
}

function Section({ className, ...rest }: ComponentProps<"section">) {
  return <section className={cn("gap-4", className)} {...rest} />;
}

function SectionHeader({ className, ...rest }: H2Props) {
  return <H2 className={cn("text-secondary", className)} {...rest} />;
}

function SectionContent({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cn("ml-4", className)} {...rest} />;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { entries } = loaderData;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <Section>
          <SectionHeader>About</SectionHeader>
          <SectionContent>
            <P>Hi 👋 I'm <span className="text-primary">Nick K</span> a software
              engineer, who dives deep into the unknown. Welcome to the journey!
            </P>
            <P>
              Let's be friends on{" "}
              <Link to="https://x.com/hexnickk" target="_blank">
                Twitter (en)
              </Link>{" "}
              or{" "}
              <Link to="https://x.com/kozlovzxc" target="_blank">
                Twitter (ru)
              </Link>
              .
            </P>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>Posts</SectionHeader>
          <SectionContent>
            <div className="flex flex-1 flex-col gap-4">
              {entries.map(
                (entries) =>
                  (entries.type === "post" && (
                    <PostPreview key={entries.slug} post={entries} />
                  )) ||
                  (entries.type === "link" && (
                    <LinkPreview key={entries.href} link={entries} />
                  )),
              )}
            </div>
          </SectionContent>
        </Section>
      </div>
    </Layout>
  );
}
