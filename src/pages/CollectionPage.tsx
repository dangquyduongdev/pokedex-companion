import { useState } from 'react';
import { useCollectionStore } from '../store/useCollectionStore';
import TypeTag from '../components/TypeTag';
import { EmptyState } from '../components/StateMessages';

function CreateGroupForm() {
  const createGroup = useCollectionStore((s) => s.createGroup);
  const [name, setName] = useState('');

  return (
    <form
      className="flex flex-wrap gap-2 mb-6"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        createGroup(trimmed);
        setName('');
      }}
    >
      <label htmlFor="new-group-name" className="sr-only">
        New expedition log name
      </label>
      <input
        id="new-group-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name a new expedition log, e.g. Kanto Favourites"
        className="flex-1 min-w-[220px] border border-line bg-paper-card rounded-sm px-3 py-2 outline-none focus:border-clay"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-moss text-paper-card rounded-sm text-sm font-medium hover:bg-moss-dark transition-colors"
      >
        Create log
      </button>
    </form>
  );
}

function GroupCard({ group }: { group: ReturnType<typeof useCollectionStore.getState>['groups'][number] }) {
  const favorites = useCollectionStore((s) => s.favorites);
  const deleteGroup = useCollectionStore((s) => s.deleteGroup);
  const removeFromGroup = useCollectionStore((s) => s.removeFromGroup);
  const members = favorites.filter((f) => group.pokemonIds.includes(f.id));

  return (
    <li className="border border-line bg-paper-card rounded-sm p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-display text-lg font-semibold text-ink">{group.name}</h3>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete the log "${group.name}"? This won't remove the favourites themselves.`)) {
              deleteGroup(group.id);
            }
          }}
          className="text-xs text-clay-dark border border-clay/40 rounded-sm px-2 py-1 hover:bg-clay hover:text-paper-card transition-colors shrink-0"
        >
          Delete log
        </button>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-ink/50">No favourites added to this log yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-2 border border-line rounded-sm pl-2 pr-1 py-1 bg-paper"
            >
              <span className="text-sm capitalize">{m.name}</span>
              <button
                type="button"
                onClick={() => removeFromGroup(group.id, m.id)}
                aria-label={`Remove ${m.name} from ${group.name}`}
                className="text-ink/40 hover:text-clay-dark text-sm leading-none px-1"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function FavoriteRow({ favorite }: { favorite: ReturnType<typeof useCollectionStore.getState>['favorites'][number] }) {
  const groups = useCollectionStore((s) => s.groups);
  const addToGroup = useCollectionStore((s) => s.addToGroup);
  const removeFavorite = useCollectionStore((s) => s.removeFavorite);
  const [selectedGroup, setSelectedGroup] = useState('');

  return (
    <li className="flex flex-wrap items-center gap-3 border border-line bg-paper-card rounded-sm p-3">
      {favorite.sprite && (
        <img src={favorite.sprite} alt="" className="w-12 h-12 object-contain" aria-hidden="true" />
      )}
      <div className="min-w-[100px]">
        <p className="text-xs text-ink/50">No. {String(favorite.id).padStart(3, '0')}</p>
        <p className="font-display font-semibold capitalize">{favorite.name}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {favorite.types.map((t) => (
          <TypeTag key={t} type={t} />
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {groups.length > 0 && (
          <>
            <label className="sr-only" htmlFor={`group-select-${favorite.id}`}>
              Add {favorite.name} to a log
            </label>
            <select
              id={`group-select-${favorite.id}`}
              value={selectedGroup}
              onChange={(e) => {
                const groupId = e.target.value;
                if (groupId) {
                  addToGroup(groupId, favorite.id);
                  setSelectedGroup('');
                }
              }}
              className="text-sm border border-line rounded-sm px-2 py-1.5 bg-paper"
            >
              <option value="">Add to log…</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </>
        )}
        <button
          type="button"
          onClick={() => removeFavorite(favorite.id)}
          className="text-sm text-clay-dark border border-clay/40 rounded-sm px-2 py-1.5 hover:bg-clay hover:text-paper-card transition-colors"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export default function CollectionPage() {
  const favorites = useCollectionStore((s) => s.favorites);
  const groups = useCollectionStore((s) => s.groups);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <p className="font-body text-sm text-ink/60 mb-1">Entry 02 — Organise</p>
        <h2 className="font-display text-2xl font-semibold mb-4">Expedition logs</h2>
        <CreateGroupForm />
        {groups.length === 0 ? (
          <EmptyState
            title="No expedition logs yet"
            description="Create a log above, then assign your favourites to it below."
          />
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {groups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold mb-4">All favourites</h2>
        {favorites.length === 0 ? (
          <EmptyState
            title="No favourites saved yet"
            description="Head to Explore and tap the star on any specimen to save it here."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {favorites.map((f) => (
              <FavoriteRow key={f.id} favorite={f} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
