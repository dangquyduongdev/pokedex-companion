import { NavLink, Outlet } from 'react-router-dom';

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `font-body text-sm tracking-wide pb-1 border-b-2 transition-colors ${
    isActive
      ? 'border-clay text-ink'
      : 'border-transparent text-ink/60 hover:text-ink hover:border-line'
  }`;

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-ink focus:text-paper focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      <header className="border-b border-line bg-paper-card">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="font-body text-xs text-clay-dark tracking-wide">Field Journal No. 01</p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink -mt-0.5">
              Pokédex Companion
            </h1>
          </div>
          <nav aria-label="Primary" className="flex gap-6">
            <NavLink to="/" end className={navLinkClasses}>
              Explore
            </NavLink>
            <NavLink to="/collection" className={navLinkClasses}>
              My Collection
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5 text-xs text-ink/50 font-body">
          Specimen data from{' '}
          <a
            className="underline hover:text-ink"
            href="https://pokeapi.co"
            target="_blank"
            rel="noreferrer"
          >
            PokéAPI
          </a>
          . Built as a technical exercise.
        </div>
      </footer>
    </div>
  );
}
