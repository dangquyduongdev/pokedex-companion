import { useEffect, useMemo, useState } from 'react';
import { fetchAllPokemonNames, fetchPokemonPage, PokeApiError } from '../api/pokeapi';
import type { PokemonListEntry, PokemonSummary } from '../types/pokemon';

const PAGE_SIZE = 12;

/**
 * Owns all data-fetching + search/pagination state for the Explore page,
 * keeping that logic out of the presentation component.
 */
export function usePokemonExplorer() {
  const [allNames, setAllNames] = useState<PokemonListEntry[]>([]);
  const [namesError, setNamesError] = useState<string | null>(null);
  const [namesLoading, setNamesLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const [pageResults, setPageResults] = useState<PokemonSummary[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Load the full name index once on mount.
  useEffect(() => {
    let cancelled = false;
    setNamesLoading(true);
    fetchAllPokemonNames()
      .then((names) => {
        if (!cancelled) setAllNames(names);
      })
      .catch((err) => {
        if (!cancelled) {
          setNamesError(err instanceof PokeApiError ? err.message : 'Could not load the Pokédex index.');
        }
      })
      .finally(() => {
        if (!cancelled) setNamesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allNames;
    return allNames.filter((entry) => entry.name.includes(q));
  }, [allNames, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Reset to page 1 whenever the search query changes.
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Fetch details for the current page slice whenever it changes.
  useEffect(() => {
    if (namesLoading) return;
    let cancelled = false;
    const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (slice.length === 0) {
      setPageResults([]);
      setPageLoading(false);
      return;
    }

    setPageLoading(true);
    setPageError(null);
    fetchPokemonPage(slice)
      .then((results) => {
        if (!cancelled) setPageResults(results);
      })
      .catch(() => {
        if (!cancelled) setPageError('Could not load these specimens. Check your connection and try again.');
      })
      .finally(() => {
        if (!cancelled) setPageLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, page, namesLoading]);

  return {
    query,
    setQuery,
    page,
    setPage,
    totalPages,
    resultCount: filtered.length,
    results: pageResults,
    isLoading: namesLoading || pageLoading,
    error: namesError ?? pageError,
    retry: () => setPage((p) => p),
  };
}
