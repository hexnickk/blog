import * as stylex from "@stylexjs/stylex";
import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content="Nick K blog" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={import.meta.env.VITE_HOST_URL} />
        <meta property="og:title" content="Nick K blog" />
        <meta
          property="og:description"
          content="I'm Nick, a software engineer, who dives deep into the unknown. Welcome to the journey!"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Nick K blog" />
        <meta
          name="twitter:description"
          content="I'm Nick, a software engineer, who dives deep into the unknown. Welcome to the journey!"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Nick K blog"
          href={`${import.meta.env.VITE_HOST_URL}/rss.xml`}
        />
        {import.meta.env.DEV && <link rel="stylesheet" href="/virtual:stylex.css" />}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      void import("virtual:stylex:runtime");
    }
  }, []);
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main {...stylex.props(styles.error)}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre {...stylex.props(styles.stack)}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

const styles = stylex.create({
  error: { marginInline: "auto", maxWidth: 720, padding: "24px 16px" },
  stack: { width: "100%", overflowX: "auto", padding: 16 },
});
