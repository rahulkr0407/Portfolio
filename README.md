# Portfolio — Rahul Kumar

Personal portfolio built with **Angular 20** (standalone components, signals).

## Features

- **CV-aligned content** — hero, about, experience, projects, skills, learning, certifications, education, and contact sections driven by a single typed data source (`src/app/core/data/profile.ts`).
- **AgenticChat AI assistant** — embedded chat widget (`public/widget.js`) preconfigured with a knowledge base covering the portfolio, opportunity prompts, and saved topics.
- **Contact form** — posts to Formspree when an endpoint is configured, otherwise falls back to a pre-filled `mailto:` email.
- **Theme system** — light / dark / system modes with `theme-color` meta tag kept in sync.
- **Mobile-first responsive layout** — 375px/390px-safe, with a fixed navbar that stays exactly 64px tall (no oversized layers), a slide-in mobile menu, and a frosted-glass navbar on desktop.
- **Rich site footer** — brand zone, footer nav, contact & social links, and back-to-top, responsive across three breakpoints.
- **Accessibility** — skip link, scroll lock on modal/menu, Escape-to-close, auto-close on resize, ARIA labels.
- **Motion** — scroll reveal animations, count-up stats, marquee, and scroll progress bar, all respecting `prefers-reduced-motion`.
- **Case-study modal** — project details without leaving the page, with per-project GitHub/live links.
- **SEO & social sharing** — Open Graph / Twitter tags, JSON-LD Person schema, canonical URL, robots meta, and a custom SVG favicon.
- **CI** — GitHub Actions workflow (`lint` → `test` → `build`) on every push and pull request to `main`.
- **Fast hero image** — `srcset`/`sizes` with 320w/640w JPGs.

## Tech stack

- Angular 20.2 (standalone, signals, routing-free single page)
- Tailwind CSS v4 (design tokens only) + hand-written BEM CSS
- TypeScript, ESLint, Karma + Jasmine

## Getting started

Prerequisites: Node.js and the Angular CLI.

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm start`    | Run the dev server on `:4200`        |
| `npm run build`| Production build to `dist/`          |
| `npm run test` | Unit tests (Karma + Jasmine)          |
| `npm run lint` | ESLint check                         |
| `npm run watch`| Dev build with watch mode            |

## Project structure

```
src/
  app/
    features/       hero, about, experience, projects, skills, learning, certifications, education, contact
    shared/         navbar, scroll-progress, marquee, modal, count-up, icons, footer
    core/           services (theme) and data (profile)
  styles.css        global CSS variables, tokens, and base rules
public/             AgenticChat widget engine (widget.js/widget.css) and static assets (favicon)
.github/workflows/  CI pipeline
```