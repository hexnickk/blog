---
name: frontend-design
description: Apply when creating React frontend UI: pages, dashboards, forms, components, layouts, landing pages, modals. Enforces neobrutalist design — hard shadows, 2px borders, warm cream/yellow palette, no dark mode. Tech: React, Tailwind, shadcn (customized).
---

Create frontends that feel like dev tools — functional, data-dense, honest. Clarity first, aesthetic second. The goal is interfaces that happen to look technical because they prioritize function, not interfaces that look technical for style points.

## Design Thinking

Before coding, understand the context:
- **Purpose**: What job does this interface do? Who uses it and in what mindset?
- **Density**: How much information needs to be visible at once?
- **Key actions**: What are the 2-3 things a user must be able to do?

The aesthetic is already chosen: **neobrutalist dev-tool**. Think PostHog, Linear, Vercel dashboard. Interfaces that release dopamine through clarity and function, not decoration.

Execute with intention. Every choice should feel deliberate, not default.

## Guiding Principles

**Honesty over polish**
Raw, functional interfaces. Show structure through borders and hard edges, not gradients or blur. If something is a box, let it be a box.

**Warmth without softness**
Background: `#faf9f6` (cream). Elevated elements (cards, inputs, modals): `#ffffff`. Accent: `#ffcb47` (warm yellow) — reserved for primary actions and key information only. One or two accent uses per viewport. If everything is highlighted, nothing is. Text: `#1a1a1a`. Muted text: `#6b6b6b`.

**Typography as hierarchy**
Sans-serif for all UI: headings, labels, body text, navigation. Monospace only for inline data: numbers, dates, code snippets, technical values. Never use monospace for headings or section titles. Use Tailwind's `font-mono` and `font-sans` — do not explicitly set Inter, Roboto, or other named fonts. Distinct size jumps — if two sizes look similar, they shouldn't both exist.

**Hard edges, hard shadows**
Borders: 2px solid `#1a1a1a`. Radius: 0–2px maximum. Shadows: hard offset (e.g., `4px 4px 0 #1a1a1a`) with no blur. Hover: lift shadow or shift position. Focus: 2px accent (`#ffcb47`) outline or ring. Error: `#dc2626`. Success: `#16a34a`.

**Visual accents: minimal and functional**
Decoration must serve a purpose — dividing sections, indicating state, guiding the eye. Acceptable: simple geometric shapes, line diagrams, technical schematics, dithered images, border dividers. Icons: pixel-art style preferred, otherwise Lucide or Heroicons outline. One decorative element per section maximum. If a visual flourish requires precise alignment or looks broken at different widths, don't use it.

**Motion as feedback**
Minimal, functional transitions. Hover lifts, active presses. No bouncy physics, no decorative animation. Movement confirms interaction, nothing more.

**Space as structure**
Generous whitespace where navigational. Data-dense where functional. Simple grids — clear rows, columns, sections. No overlapping layers, no diagonal flows, no visual complexity for its own sake.

**Accessible by default**
Maintain WCAG AA contrast ratios. Interactive elements must have visible focus states. Touch targets minimum 44px. Don't sacrifice readability for aesthetics.

## Never

- Dark mode
- Rounded corners beyond 2px
- Blur or soft shadows
- Multiple accent colors or gradients
- Glassmorphism, neumorphism
- Cartoon illustrations, mascots, complex decorative scenes
- Purple/violet color schemes
- ASCII art boxes or box-drawing characters as decoration
- Monospace headings or section titles

## Technical Context

React, Tailwind, shadcn/ui — but shadcn defaults must be overridden. Strip rounded corners, replace soft shadows, apply warm palette. Don't use components as-is.
