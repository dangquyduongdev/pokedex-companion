import type { PokemonListEntry, PokemonSummary } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokeApiError extends Error {}

/**
 * Fetches the full list of Pokémon names + resource URLs.
 * The list itself is tiny (name + url per entry), so we grab it once
 * and do all name-search filtering on the client rather than round
 * tripping to the API per keystroke.
 */
export async function fetchAllPokemonNames(): Promise<PokemonListEntry[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=2000&offset=0`);
  if (!res.ok) {
    throw new PokeApiError('Could not reach the Pokédex right now.');
  }
  const data = await res.json();
  return data.results as PokemonListEntry[];
}

function idFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : 0;
}

/**
 * Fetches display details (sprite + types) for a single Pokémon by name or id.
 */
export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonSummary> {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!res.ok) {
    throw new PokeApiError(`Couldn't find a Pokémon matching "${nameOrId}".`);
  }
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    sprite:
      data.sprites?.other?.['official-artwork']?.front_default ??
      data.sprites?.front_default ??
      null,
    types: (data.types ?? []).map((t: { type: { name: string } }) => t.type.name),
  };
}

/**
 * Fetches details for a page of list entries in parallel.
 * Individual failures are swallowed (returned as null) so one bad
 * entry doesn't blank out the whole page.
 */
export async function fetchPokemonPage(entries: PokemonListEntry[]): Promise<PokemonSummary[]> {
  const results = await Promise.all(
    entries.map(async (entry) => {
      try {
        return await fetchPokemonDetail(idFromUrl(entry.url) || entry.name);
      } catch {
        return null;
      }
    })
  );
  return results.filter((r): r is PokemonSummary => r !== null);
}
