import { usePokemonExplorer } from '../hooks/usePokemonExplorer';
import { useCollectionStore } from '../store/useCollectionStore';
import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';
import Pagination from '../components/Pagination';
import { LoadingGrid, ErrorState, EmptyState } from '../components/StateMessages';

export default function HomePage() {
  const { query, setQuery, page, setPage, totalPages, resultCount, results, isLoading, error, retry } =
    usePokemonExplorer();
  const isFavorite = useCollectionStore((s) => s.isFavorite);
  const toggleFavorite = useCollectionStore((s) => s.toggleFavorite);

  return (
    <section>
      <p className="font-body text-sm text-ink/60 mb-1">Entry 01 — Explore</p>
      <h2 className="font-display text-2xl font-semibold mb-4">Browse the specimen index</h2>

      <SearchBar value={query} onChange={setQuery} />

      {!isLoading && !error && (
        <p className="text-sm text-ink/60 mb-4" aria-live="polite">
          {resultCount} specimen{resultCount === 1 ? '' : 's'} found
        </p>
      )}

      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : isLoading ? (
        <LoadingGrid />
      ) : results.length === 0 ? (
        <EmptyState
          title="No specimens match that name"
          description="Try a shorter search, like a partial name."
        />
      ) : (
        <>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((p) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                isFavorite={isFavorite(p.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </ul>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </section>
  );
}
