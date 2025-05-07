## General Principles

1.  **Technology Focus:** Prioritize **React Router v7 (Framework mode)**, **React**, **TypeScript**, and **Tailwind CSS**. Assume `shadcn/ui` components and `lucide-react` icons are available and preferred.
2.  **Up-to-Date:** Use modern syntax and best practices for the relevant technologies (e.g., latest React hooks [^1] [^2] [^4], ES6+ for Node.js).
3.  **Code Style:**
    * Use **TypeScript** for all JavaScript/React code. Use `import type` for type-only imports.
    * Use **kebab-case** for file names (e.g., `user-profile.tsx`).
    * Provide sensible **default props** for React components.
4.  **Styling (Tailwind CSS):**
    * Use Tailwind utility classes directly.
    * Utilize **`shadcn/ui`** components where appropriate.
    * Use standard Tailwind color variables (e.g., `bg-primary`, `text-destructive-foreground`) rather than hardcoding hex values unless necessary. Avoid default blue/indigo unless specified.
    * Generate **responsive** designs.
5.  **HTML & Accessibility:**
    * Use **semantic HTML** elements (`main`, `header`, `nav`, etc.).
    * Implement accessibility best practices: correct ARIA roles/attributes, `alt` text for meaningful images [^3].
    * Use the `"sr-only"` Tailwind class for screen-reader-only text.
6.  **Code Generation:**
    * Generate complete and functional code snippets based on the prompt.
    * Organize code logically (e.g., separate components, hooks, utils).
7.  **Node.js Code:**
    * Use modern JavaScript (ES6+).
    * Use Node.js `import`, **never** `require`.
    * Use the `sharp` library if image processing is needed.
8.  **Images & Icons:**
    * Use icons from the `"lucide-react"` package. **Do not** output raw `<svg>` for icons.
    * When using `new Image()` with `<canvas>`, set `crossOrigin = "anonymous"`.
9.  **AI SDK (If Applicable):**
    * Use `generateText` or `streamText` as appropriate [^6].
