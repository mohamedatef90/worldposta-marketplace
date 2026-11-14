# WorldPosta Marketplace

A front-end prototype of a marketplace for cloud applications and virtual machines: browse featured apps and categories, configure an app with a price estimate, and walk through registration and payment screens. It is an Angular app that runs on sample data in the browser; there is no backend.

It was created in Google AI Studio and can be viewed there: https://ai.studio/apps/drive/1ww8D0bOkX6M0n7MStZoQ7zjwnzLtBRFr

## Pages

Routes are defined in `src/app.routes.ts`:

| Route | Page |
| --- | --- |
| `/` | Marketplace home: featured applications, explore by category |
| `/category/:id` | All apps in a category |
| `/configure/:id` | App detail and configuration, with a price computed from base, storage, RAM, and bandwidth options (`osOptions` are listed per app) |
| `/docs` | Documentation |
| `/publishing` | Publishing page |
| `/register` | Registration screen |
| `/payment` | Payment screen |
| `**` | Not found |

Marketplace data lives in `src/services/marketplace.service.ts` and its types in `src/models/marketplace.model.ts` (price, OS options, rating, reviews, optional badge, provider, downloads). The auth service only toggles a signed-in flag (`src/services/auth.service.ts`).

## Tech stack

- Angular 20 (standalone components, signals)
- TypeScript
- Tailwind CSS (loaded from the CDN in `index.html`)

## Getting started

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev       # ng serve
npm run build     # ng build
npm run preview   # ng serve with the production configuration
```

No environment variables are used.

## Project structure

```
src/
  app.component.*, app.routes.ts   Shell layout and routes
  components/                      One folder per page, plus header and footer
  services/                        Marketplace data and auth flag
  models/marketplace.model.ts      Types
index.html, index.tsx              Entry points
CLAUDE.md                          Notes for AI coding assistants
```
