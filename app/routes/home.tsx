import * as stylex from "@stylexjs/stylex";
import type { Route } from "./+types/home";
import { links } from "app/modules/content";
import { Layout } from "app/components/layout";
import { Link } from "react-router";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data?.page ? `Page ${data.page} - Nick K blog` : "Nick K blog" },
    {
      name: "description",
      content:
        "I'm Nick, a software engineer, who dives deep into the unknown. Welcome to the journey!",
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const totalPages = Math.max(1, Math.ceil(links.length / 15));
  const page = params.page === undefined ? null : Number(params.page);
  if (
    page !== null &&
    (!Number.isSafeInteger(page) || page < 1 || page > totalPages || params.page !== String(page))
  ) {
    throw new Response("Page not found", { status: 404 });
  }
  return {
    entries: page === null ? links.slice(0, 5) : links.slice((page - 1) * 15, page * 15),
    page,
    totalPages,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { entries, page, totalPages } = loaderData;
  return (
    <Layout>
      {page === null && (
        <p>
          I'm Nick, a software engineer, who dives deep into the unknown. Welcome to the journey!
        </p>
      )}
      <section>
        <h2>{page === null ? "Latest posts" : "All posts"}</h2>
        <ul>
          {entries.map((link) => (
            <li key={link.href} {...stylex.props(pageStyles.entry)}>
              <div {...stylex.props(pageStyles.postRow)}>
                <Link
                  to={link.href}
                  target={/^https?:\/\//.test(link.href) ? "_blank" : undefined}
                  reloadDocument
                >
                  {link.title}
                </Link>
                <small {...stylex.props(pageStyles.date)}>
                  <time dateTime={link.date}>
                    {new Date(link.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                </small>
              </div>
              {link.description && (
                <p {...stylex.props(pageStyles.description)}>{link.description}</p>
              )}
            </li>
          ))}
        </ul>
        {page !== null && (
          <nav aria-label="Pagination" {...stylex.props(pageStyles.pagination)}>
            {page > 1 && (
              <Link to={`/pages/${page - 1}`} rel="prev" aria-label="Newer posts" reloadDocument>
                {"<<"}
              </Link>
            )}
            <span>
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link to={`/pages/${page + 1}`} rel="next" aria-label="Older posts" reloadDocument>
                {">>"}
              </Link>
            )}
          </nav>
        )}
      </section>
    </Layout>
  );
}

const pageStyles = stylex.create({
  entry: { marginBottom: 16 },
  postRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 16,
  },
  date: { flexShrink: 0, whiteSpace: "nowrap" },
  description: { marginBlock: "4px 0", whiteSpace: "pre-wrap" },
  pagination: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    marginTop: 24,
  },
});
