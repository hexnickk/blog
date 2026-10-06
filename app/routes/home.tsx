import * as stylex from "@stylexjs/stylex";
import type { Route } from "./+types/home";
import { links, type ContentLink } from "app/modules/content";
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

export function loader({ params, request }: Route.LoaderArgs) {
  const { pathname } = new URL(request.url);
  const isHome = pathname === "/";
  const type = pathname.startsWith("/projects") ? "project" : "post";
  const category = type === "project" ? "projects" : "posts";
  const filteredLinks = links.filter((link) => link.type === type);
  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / 15));
  const page = isHome ? null : Number(params.page);
  if (
    page !== null &&
    (!Number.isSafeInteger(page) || page < 1 || page > totalPages || params.page !== String(page))
  ) {
    throw new Response("Page not found", { status: 404 });
  }
  return {
    entries: (isHome
      ? links.slice(0, 10)
      : filteredLinks.slice(((page ?? 1) - 1) * 15, (page ?? 1) * 15)
    ).map(({ title: _title, ...entry }) => entry),
    isHome,
    category,
    page,
    totalPages,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { entries, page, totalPages, category, isHome } = loaderData;
  const categoryBase = category === "projects" ? "/projects" : "/posts";
  return (
    <Layout>
      {!isHome && (
        <p>
          <Link to="/" reloadDocument>
            Home
          </Link>
        </p>
      )}
      {isHome && <p>Hey, I'm Nik Kozlov, nice to meet you!</p>}
      <section>
        {!isHome && <h2>{category === "projects" ? "Projects" : "Posts"}</h2>}
        <EntryList entries={entries} />
        {isHome ? (
          <p>
            See older posts{" "}
            <Link to="/posts/pages/1" reloadDocument>
              here
            </Link>
            , and projects{" "}
            <Link to="/projects/pages/1" reloadDocument>
              here
            </Link>
            .
          </p>
        ) : (
          page !== null && (
            <nav aria-label="Pagination" {...stylex.props(pageStyles.pagination)}>
              {page > 1 && (
                <Link
                  to={`${categoryBase}/pages/${page - 1}`}
                  rel="prev"
                  aria-label={`Newer ${category}`}
                  reloadDocument
                >
                  {"<<"}
                </Link>
              )}
              <span>
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  to={`${categoryBase}/pages/${page + 1}`}
                  rel="next"
                  aria-label={`Older ${category}`}
                  reloadDocument
                >
                  {">>"}
                </Link>
              )}
            </nav>
          )
        )}
      </section>
    </Layout>
  );
}

function EntryList({ entries }: { entries: Omit<ContentLink, "title">[] }) {
  return (
    <ul>
      {entries.map((link) => (
        <li key={link.href} {...stylex.props(pageStyles.entry)}>
          <div {...stylex.props(pageStyles.postRow)}>
            <Link
              to={link.href}
              target={/^https?:\/\//.test(link.href) ? "_blank" : undefined}
              reloadDocument
            >
              {links.find((entry) => entry.href === link.href)?.title}
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
        </li>
      ))}
    </ul>
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
  pagination: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    marginTop: 24,
  },
});
