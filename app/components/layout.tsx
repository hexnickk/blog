import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

export const layoutStyles = stylex.create({
  layout: {
    maxWidth: 720,
    marginInline: "auto",
    padding: "clamp(24px, 8vh, 96px) 16px 32px",
  },
  contacts: { marginTop: 40 },
});

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div {...stylex.props(layoutStyles.layout)}>
      <main>{children}</main>
      <footer>
        <nav aria-label="Contact links" {...stylex.props(layoutStyles.contacts)}>
          <a href="mailto:h3yniko@gmail.com">Email</a>
          {", "}
          <a href="https://x.com/h3yniko" target="_blank" rel="noopener noreferrer">
            X/Twitter
          </a>
          {", "}
          <a href="https://www.linkedin.com/in/heyniko" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </nav>
      </footer>
    </div>
  );
}
