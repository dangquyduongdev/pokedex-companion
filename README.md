# Pokédex Companion

A small fan site for Pokémon: browse the Pokédex, search by name, save favourites, and
organise them into named "expedition logs" (groups). Built for the MPF front-end
technical exercise.

**Live demo:** https://pokedex-companion-sandy.vercel.app

## Running locally

Requirements: **Node 20+** (built and tested on Node 22) and npm.

```bash
npm install
npm run dev       # starts the dev server at http://localhost:5173
```

Other useful scripts:

```bash
npm run build     # type-checks and builds a production bundle to dist/
npm run preview   # serves the production build locally
npm run lint      # runs oxlint
npm test          # runs the vitest unit tests
```

## Architectural decisions

- **Vite + React + TypeScript.** Fast local dev, strict typing, no meta-framework
  overhead — this is a small client-only app with no need for SSR/routing on a server.
- **React Router** for two real routes (`/` Explore, `/collection` My Collection) with
  a shared `Layout` and nav, rather than a single page that swaps content with a
  boolean flag — this was one of the evaluation points called out in the brief.
- **Zustand + `persist` middleware** for state management. The store
  (`useCollectionStore`) is the single source of truth for favourites and groups, and
  `persist` mirrors it to `localStorage` automatically, satisfying the "remember the
  user's choices" requirement without hand-rolled `useEffect`/`localStorage` glue code
  scattered across components.
- **Separation of concerns.** `src/api` only knows how to talk to PokeAPI and returns
  plain typed objects; `src/hooks/usePokemonExplorer.ts` owns the search/pagination
  state machine; presentation components (`src/components`, `src/pages`) only render
  props and call callbacks. No component fetches data directly.
- **Search approach.** PokeAPI has no server-side "search by substring" endpoint, so
  the app fetches the full name index once (~1300 lightweight `{name, url}` entries)
  and filters client-side as the user types, then only fetches full details
  (sprite/types) for the 12 entries on the current page. This keeps the UI responsive
  without spamming the API per keystroke.
- **Data model.** Favourites and groups are stored as plain arrays of small typed
  objects (`FavoritePokemon`, `Group`) in `src/types/pokemon.ts`. Removing a favourite
  also cleans it out of any group it belonged to, so the two collections can't drift
  out of sync.
- **Design.** A "field journal" visual direction (paper/ink/moss/clay palette, a
  serif display face for headings, numbered specimen entries) rather than a generic
  card-grid SaaS look, since the brief specifically calls out design/UX effort as a
  plus.

## Trade-offs made for the 2-hour limit

- Search matches on substring only (no fuzzy matching / typo tolerance).
- Pagination is simple next/previous rather than jump-to-page or infinite scroll.
- No dedicated detail page per Pokémon — the card already shows what's needed
  (artwork, types, Pokédex number); a detail route would be a natural next step.
- Group membership is managed via a `<select>` per favourite rather than
  drag-and-drop; simpler to build and just as usable, but less flashy.
- Only the store logic has unit tests — no component or E2E tests were added given
  the time budget (see below for what I'd add next).

## What I'd add with more time

- A detail view/route per Pokémon (stats, abilities, evolution chain).
- Component tests (React Testing Library) for `PokemonCard`, `CollectionPage`, and
  an E2E smoke test (Playwright) covering "search → favourite → add to group →
  reload → still there".
- Debounced search input and a cancel-in-flight-request guard for slow typers.
- Drag-and-drop reordering of favourites within a group.
- Deploy previews wired into the CI workflow (currently CI only lints, type-checks,
  tests and builds).

## Deploying

The app is a static Vite build, so any static host works. Two quick options:

**Vercel**
```bash
npm i -g vercel
vercel
```

**GitHub Pages**
1. `npm run build`
2. Push the `dist/` folder's contents to a `gh-pages` branch (or use the
   `peaceiris/actions-gh-pages` GitHub Action) and enable Pages on that branch in the
   repo settings.

## Tech stack

React 19 · TypeScript · Vite · React Router · Zustand (with `persist`) ·
Tailwind CSS v4 · Vitest · PokeAPI
