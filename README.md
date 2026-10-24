# Farjana Akter Limu — Portfolio

A personal portfolio for Mst. Farjana Akter Limu, a Computer Science and Engineering student at United International University. The site presents her introduction, academic background, skills, academic project gallery, and contact links in a floral-inspired, responsive design.

## Features

- Responsive single-page layout with Home, About, Academics, Projects, and Contact sections.
- Motion-enhanced interactions with reduced-motion support.
- Portfolio content and theme values managed in a JSON data file.
- Academic project gallery covering subjects such as data structures and algorithms, object-oriented programming, databases, machine learning, web design, software engineering, operating systems, and computer networks.
- Vite-powered development server and production build.

## Tech stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Lucide React icons

## Getting started

Use a Node.js version supported by Vite 8 and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite to view the site.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run format` | Format the project with oxfmt. |

## Project structure

```text
src/
  components/          Page sections and shared UI components
  App.tsx              Composes the portfolio sections
  index.css            Global styles and Tailwind CSS entrypoint
  main.tsx             React application entrypoint
  portfolioData.json   Site copy, theme, navigation, and portfolio content
public/
  images/              Profile images
```

## Updating portfolio content

Edit `src/portfolioData.json` to update the profile, biography, academic timeline, skills, project gallery, contact channels, and theme. Project cards are rendered from the `projects.items` array; each entry can include a category, description, topic tags, image, links, featured state, and status.

Place public assets in `public/` and reference them from the data file using paths such as `/images/example.jpg`.
