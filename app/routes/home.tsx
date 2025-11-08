import { PostPreview } from "app/components/post-preview";
import type { Route } from "./+types/home";
import { Content } from "app/modules/content";
import { H2, P } from "app/components/ui/typography";
import { Layout } from "app/components/layout";
import { Config } from "app/modules/config";
import { Link } from "app/components/ui/link";
import { LinkPreview } from "app/components/link-preview";

export function meta({}: Route.MetaArgs) {
  return [
    { title: Config.siteName },
    { name: "description", content: Config.siteDescription },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const entries = await Content.listPublic();
  return { entries };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { entries } = loaderData;

  return (
    <Layout>
      <div className="relative flex flex-col gap-6">
        <section className="gap-4">
          <H2>About</H2>
          <div className="ml-4">
            <P>
              Hi 👋 I'm <strong>Nick K</strong> a software engineer, who dives
              deep into the unknown. Welcome to the journey!
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
          </div>
        </section>

        <section className="gap-4">
          <H2>Latest posts</H2>
          <div className="ml-4">
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
          </div>
        </section>
      </div>
    </Layout>
  );
}
