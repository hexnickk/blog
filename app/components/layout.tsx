import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Link } from "react-router";

const styles = stylex.create({
  layout: {
    maxWidth: 720,
    marginInline: "auto",
    padding: "24px 16px",
  },
  navigation: { display: "flex", gap: 16, marginBottom: 24 },
});

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div {...stylex.props(styles.layout)}>
      <header>
        <nav aria-label="Main navigation" {...stylex.props(styles.navigation)}>
          <Link to="/" reloadDocument>
            Home
          </Link>
          <Link to="/pages/1" reloadDocument>
            All posts
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
