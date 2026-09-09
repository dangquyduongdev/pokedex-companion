// Domain types kept intentionally small — we only model the fields the UI
// actually renders, rather than the full PokeAPI response shape.

export interface PokemonListEntry {
  name: string;
  url: string;
}

export interface PokemonSummary {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
}

export interface FavoritePokemon {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
  savedAt: number;
}

export interface Group {
  id: string;
  name: string;
  createdAt: number;
  pokemonIds: number[];
}
