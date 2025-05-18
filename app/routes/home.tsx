import { PostPreview } from "app/components/post-preview";
import type { Route } from "./+types/home";
import { ContentModule } from "app/modules/content";
import { H1 } from "app/components/ui/typography";
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
      <H1 className="text-center mb-4">Hi, I'm Nick K!</H1>

      <div className="flex-1 flex flex-col gap-4">
        {posts.map((post) => (
          <PostPreview key={post.slug} post={post} />
        ))}
      </div>
    </Layout>
  );
}
