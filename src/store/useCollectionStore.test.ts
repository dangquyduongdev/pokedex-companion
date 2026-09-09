import { beforeEach, describe, expect, it } from 'vitest';
import { useCollectionStore } from './useCollectionStore';
import type { PokemonSummary } from '../types/pokemon';

const pikachu: PokemonSummary = { id: 25, name: 'pikachu', sprite: null, types: ['electric'] };
const bulbasaur: PokemonSummary = { id: 1, name: 'bulbasaur', sprite: null, types: ['grass', 'poison'] };

function reset() {
  useCollectionStore.setState({ favorites: [], groups: [] });
}

describe('useCollectionStore', () => {
  beforeEach(reset);

  it('toggles a pokemon into and out of favourites', () => {
    useCollectionStore.getState().toggleFavorite(pikachu);
    expect(useCollectionStore.getState().isFavorite(25)).toBe(true);

    useCollectionStore.getState().toggleFavorite(pikachu);
    expect(useCollectionStore.getState().isFavorite(25)).toBe(false);
  });

  it('creates and deletes a group', () => {
    useCollectionStore.getState().createGroup('Starters');
    expect(useCollectionStore.getState().groups).toHaveLength(1);

    const groupId = useCollectionStore.getState().groups[0].id;
    useCollectionStore.getState().deleteGroup(groupId);
    expect(useCollectionStore.getState().groups).toHaveLength(0);
  });

  it('adds a favourite to a group and removes it', () => {
    useCollectionStore.getState().toggleFavorite(bulbasaur);
    useCollectionStore.getState().createGroup('Starters');
    const groupId = useCollectionStore.getState().groups[0].id;

    useCollectionStore.getState().addToGroup(groupId, bulbasaur.id);
    expect(useCollectionStore.getState().groups[0].pokemonIds).toContain(1);

    useCollectionStore.getState().removeFromGroup(groupId, bulbasaur.id);
    expect(useCollectionStore.getState().groups[0].pokemonIds).not.toContain(1);
  });

  it('removing a favourite also removes it from any groups', () => {
    useCollectionStore.getState().toggleFavorite(pikachu);
    useCollectionStore.getState().createGroup('Electric team');
    const groupId = useCollectionStore.getState().groups[0].id;
    useCollectionStore.getState().addToGroup(groupId, pikachu.id);

    useCollectionStore.getState().removeFavorite(pikachu.id);

    expect(useCollectionStore.getState().favorites).toHaveLength(0);
    expect(useCollectionStore.getState().groups[0].pokemonIds).not.toContain(25);
  });
});
