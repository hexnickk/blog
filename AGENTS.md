1.  **Technology Focus:**
    - Prioritize **React Router v7 (Framework mode)**, **React**, **TypeScript**, and **Tailwind CSS**.
    - Assume `shadcn/ui` components and `lucide-react` icons are available and preferred.
1.  **Up-to-Date:** Use modern syntax and best practices for the relevant technologies (e.g., latest React hooks, ES6+ for Node.js).
1.  **Code Style:**
    - Use **TypeScript** for all JavaScript/React code. Use `import type` for type-only imports.
    - Use **kebab-case** for file names (e.g., `user-profile.tsx`).
    - Provide sensible **default props** for React components based on `ComponentProps` when possible.
1.  **Styling (Tailwind CSS):**
    - Use Tailwind utility classes directly.
    - Utilize **`shadcn/ui`** components where appropriate.
    - Use standard Tailwind color variables (e.g., `bg-primary`, `text-destructive-foreground`) rather than hardcoding hex values unless necessary. Avoid default blue/indigo unless specified.
    - Generate **responsive** designs using only two breakpoints: mobile (default) and desktop+tablet (`md:` and above). Never use `sm:`, `lg:`, `xl:`, or `2xl:` breakpoints.
1.  **HTML & Accessibility:**
    - Use **semantic HTML** elements (`main`, `header`, `nav`, etc.).
1.  **Node.js Code:**
    - Use modern JavaScript (ES6+).
    - Use Node.js `import`, **never** `require`.
1.  **Images & Icons:**
    - Use icons from the `"lucide-react"` package. **Do not** output raw `<svg>` for icons.
    - When using `new Image()` with `<canvas>`, set `crossOrigin = "anonymous"`.
