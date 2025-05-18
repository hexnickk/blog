import { PostPreview } from "app/components/post-preview";
import type { Route } from "./+types/home";
import { ContentModule } from "app/modules/content";
import { H1, P } from "app/components/ui/typography";
import { Layout } from "app/components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nick K blog" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const posts = await ContentModule.listAll();
  return { posts };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <Layout>
      <H1 className="text-center mb-4">Hi 👋</H1>

      <P className="mb-4">
        I'm Nick, a software engineer, who loves diving deep into all sorts of topics. Welcome abroad!
      </P>

      <div className="flex-1 flex flex-col gap-4">
        {posts.map((post) => (
          <PostPreview key={post.slug} post={post} />
        ))}
      </div>
    </Layout>
  );
}
