# Portfolio — Rahul Kumar

Personal portfolio with a **cyberpunk HUD / game-menu** theme, built with **Angular 20**
(standalone components, signals). No router — a single anchor-scrolled page.

## Features

### Experience

- **Entry boot sequence** — a terminal splash (`PORTFOLIO.SYS`) shows once per session with
  four status lines, then reveals the site. Dismiss with **Enter the universe**, **Skip**, or
  **Esc**; tick **Don't show this again** to opt out permanently.
- **Game-style navigation** — numbered nav links (`01`–`06`), a `LOC XX/06` scrollspy readout,
  and keyboard shortcuts **`1`–`6`** to jump between sections.
- **Interactive skill tree** — skill categories rendered as a tablist/tabpanel "tree" with
  staggered node reveals and arrow / Home / End keyboard navigation.
- **Missions** — projects presented as a mission archive: a featured primary mission plus a
  card grid, each opening a terminal-styled **mission briefing** modal (objectives, loadout,
  build log) without leaving the page.
- **Career log** — experience rendered as a timeline of entries with status and tech loadout.
- **Contact terminal** — a terminal-chrome contact section with `// available channels`,
  prompts, and a contact form.
- **Command palette** — `Ctrl`/`Cmd` + `K` (or the navbar terminal button) to navigate and run
  actions (cycle theme, toggle sound, download résumé, email, ask the assistant) with live
  filtering and arrow-key navigation.
- **Ambient FX** — a lightweight canvas particle field plus a vignette and grid backdrop
  (DPR-capped, pauses on hidden tabs, static under reduced motion).
- **Optional sound** — synthesized WebAudio cues (no audio assets), **off by default** and
  persisted; the navbar toggle swaps between a muted and an active icon.
- **Easter egg** — type the hidden code `0407` anywhere for an achievement toast and a brief
  CRT glitch effect.

### Foundation

- **CV-aligned content** — every section is driven by a single typed data source
  (`src/app/core/data/profile.ts`): character/about, skill tree, training, missions, career log,
  education, certifications, and contact.
- **AgenticChat AI assistant** — embedded chat widget (`public/widget.js`) preconfigured with a
  knowledge base covering the portfolio, opportunity prompts, and saved topics.
- **Contact form** — posts to Formspree when an endpoint is configured, otherwise falls back to
  a pre-filled `mailto:` email.
- **Theme system** — light / dark / system modes with the `theme-color` meta tag kept in sync.
- **Certifications auto-hidden** — the certifications section renders nothing while the data is
  still placeholder, so the page never shows empty cards.
- **Mobile-first responsive layout** — 375px/390px-safe, a slide-in mobile menu, and a
  frosted-glass navbar on desktop.
- **Rich site footer** — brand zone, footer nav, contact & social links, and back-to-top,
  responsive across three breakpoints.
- **Accessibility** — skip link, scroll lock on modal/menu/palette, focus trapping, Escape-to-
  close, auto-close on resize, and ARIA labels.
- **Motion** — scroll reveal, count-up stats, marquee, and scroll progress bar, all respecting
  `prefers-reduced-motion`.
- **SEO & social sharing** — Open Graph / Twitter tags, JSON-LD Person schema, canonical URL,
  robots meta, and a custom SVG favicon.
- **Fast hero image** — `srcset`/`sizes` with 320w/640w JPGs.
- **CI** — GitHub Actions workflow (`lint` → `test` → `build`) on every push and pull request to
  `main`.

## Tech stack

- Angular 20.2 (standalone, signals, routing-free single page)
- Tailwind CSS v4 (design tokens only) + hand-written BEM CSS
- Fonts: **Chakra Petch** (display), **Inter** (sans), **JetBrains Mono** (mono)
- TypeScript, ESLint, Karma + Jasmine
- `playwright-core` for the local UI smoke tool (dev-only)

## Getting started

Prerequisites: Node.js and the Angular CLI.

```bash
npm install
npm start
```

Open `http://localhost:4200/`. The site opens on the boot intro — click **Enter the universe**
(or **Skip** / press **Esc**) to reveal the portfolio. If `:4200` is already in use:

```bash
npm start -- --port 4201
```

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm start`     | Run the dev server on `:4200`        |
| `npm run build` | Production build to `dist/`          |
| `npm run test`  | Unit tests (Karma + Jasmine)         |
| `npm run lint`  | ESLint check                         |
| `npm run watch` | Dev build with watch mode            |

### UI smoke test

`tools/verify-ui.mjs` renders the running app at several viewports and asserts sections,
overflow, the skill tree, command palette, modal, ambient canvas, and scrollspy. It targets
`http://localhost:4200` by default:

```bash
BASE_URL=http://localhost:4201 node tools/verify-ui.mjs
```

Screenshots are written to the OS temp directory.

## Project structure

```
src/
  app/
    core/
      data/           profile.ts — single typed content source
      services/       theme, hud, palette, sound
    features/         hero, about, skills, learning, projects, experience,
                      education, certifications, contact
    shared/           navbar, intro, ambient, command-palette, easter-egg,
                      case-study-modal, marquee, scroll-progress, count-up,
                      button, card, icon, section-head, site-footer,
                      scroll-reveal directive
  styles.css          global design tokens, animations, and HUD utilities
public/               AgenticChat widget engine (widget.js/widget.css) and
                      static assets (favicon, résumé, hero images)
tools/                verify-ui.mjs — Playwright UI smoke test
.github/workflows/    CI pipeline
```
