import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoritePokemon, Group, PokemonSummary } from '../types/pokemon';

interface CollectionState {
  favorites: FavoritePokemon[];
  groups: Group[];

  isFavorite: (id: number) => boolean;
  toggleFavorite: (pokemon: PokemonSummary) => void;
  removeFavorite: (id: number) => void;

  createGroup: (name: string) => void;
  deleteGroup: (id: string) => void;
  renameGroup: (id: string, name: string) => void;

  addToGroup: (groupId: string, pokemonId: number) => void;
  removeFromGroup: (groupId: string, pokemonId: number) => void;
}

// Persisted to localStorage under this key so a returning visitor sees
// their groups and favourites exactly as they left them.
export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      favorites: [],
      groups: [],

      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      toggleFavorite: (pokemon) =>
        set((state) => {
          const exists = state.favorites.some((f) => f.id === pokemon.id);
          if (exists) {
            return {
              favorites: state.favorites.filter((f) => f.id !== pokemon.id),
              // Keep groups tidy: a removed favourite shouldn't linger inside groups.
              groups: state.groups.map((g) => ({
                ...g,
                pokemonIds: g.pokemonIds.filter((id) => id !== pokemon.id),
              })),
            };
          }
          const newFavorite: FavoritePokemon = {
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprite,
            types: pokemon.types,
            savedAt: Date.now(),
          };
          return { favorites: [newFavorite, ...state.favorites] };
        }),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
          groups: state.groups.map((g) => ({
            ...g,
            pokemonIds: g.pokemonIds.filter((pid) => pid !== id),
          })),
        })),

      createGroup: (name) =>
        set((state) => ({
          groups: [
            ...state.groups,
            { id: crypto.randomUUID(), name, createdAt: Date.now(), pokemonIds: [] },
          ],
        })),

      deleteGroup: (id) =>
        set((state) => ({ groups: state.groups.filter((g) => g.id !== id) })),

      renameGroup: (id, name) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...g, name } : g)),
        })),

      addToGroup: (groupId, pokemonId) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId && !g.pokemonIds.includes(pokemonId)
              ? { ...g, pokemonIds: [...g.pokemonIds, pokemonId] }
              : g
          ),
        })),

      removeFromGroup: (groupId, pokemonId) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? { ...g, pokemonIds: g.pokemonIds.filter((id) => id !== pokemonId) }
              : g
          ),
        })),
    }),
    { name: 'pokedex-companion-collection' }
  )
);
