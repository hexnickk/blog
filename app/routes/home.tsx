import type { Route } from "./+types/home";
import { ContentModule } from "~/modules/content";

export async function loader({}: Route.LoaderArgs) {
  const content = await ContentModule.listAll();

  return content;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts, links } = loaderData;

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <h2>{post.title}</h2>
              <p>Date: {post.date.toLocaleString()}</p>
              <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
            </li>
          ))}
        </ul>
      )}

      <h2>Links</h2>
      {links.length === 0 ? (
        <p>No links yet.</p>
      ) : (
        <ul>
          {links.map((link) => (
            <li key={link.slug}>
              <h2>{link.title}</h2>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {link.title} @ {link.date.toLocaleString()}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
