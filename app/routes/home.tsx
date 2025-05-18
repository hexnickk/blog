import { PostPreview } from "app/components/post-preview";
import type { Route } from "./+types/home";
import { Content } from "app/modules/content";
import { H1, P } from "app/components/ui/typography";
import { Layout } from "app/components/layout";
import { Config } from "app/modules/config";

export function meta({}: Route.MetaArgs) {
  return [
    { title: Config.siteName },
    { name: "description", content: Config.siteDescription },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const posts = await Content.listAll();
  return { posts };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <Layout>
      <H1 className="text-center mb-4">Hi 👋</H1>

      <P className="mb-4">
        {Config.siteDescription}
      </P>

      <div className="flex-1 flex flex-col gap-4">
        {posts.map((post) => (
          <PostPreview key={post.slug} post={post} />
        ))}
      </div>
    </Layout>
  );
}
