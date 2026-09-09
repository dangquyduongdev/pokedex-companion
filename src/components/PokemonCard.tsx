import type { PokemonSummary } from '../types/pokemon';
import TypeTag from './TypeTag';

interface Props {
  pokemon: PokemonSummary;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: PokemonSummary) => void;
}

export default function PokemonCard({ pokemon, isFavorite, onToggleFavorite }: Props) {
  return (
    <li className="border border-line bg-paper-card rounded-sm p-4 flex flex-col gap-3 relative">
      <button
        type="button"
        onClick={() => onToggleFavorite(pokemon)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${pokemon.name} from favourites` : `Save ${pokemon.name} as favourite`}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full border border-line bg-paper hover:border-clay transition-colors"
      >
        <span
          aria-hidden="true"
          className={`text-lg leading-none ${isFavorite ? 'text-clay' : 'text-ink/30'}`}
        >
          {isFavorite ? '★' : '☆'}
        </span>
      </button>

      <div className="flex items-center justify-center h-24 bg-paper rounded-sm">
        {pokemon.sprite ? (
          <img
            src={pokemon.sprite}
            alt={`${pokemon.name} artwork`}
            className="h-24 w-24 object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-xs text-ink/40">No image</span>
        )}
      </div>

      <div>
        <p className="text-xs text-ink/50 font-body">No. {String(pokemon.id).padStart(3, '0')}</p>
        <h3 className="font-display text-lg font-semibold capitalize text-ink">{pokemon.name}</h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {pokemon.types.map((t) => (
          <TypeTag key={t} type={t} />
        ))}
      </div>
    </li>
  );
}
