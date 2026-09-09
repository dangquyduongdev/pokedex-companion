interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="mb-6">
      <label htmlFor="pokemon-search" className="block text-sm text-ink/70 mb-1.5 font-body">
        Search the index by name
      </label>
      <input
        id="pokemon-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. pikachu, char..."
        className="w-full sm:w-80 border border-line bg-paper-card rounded-sm px-3 py-2 text-ink placeholder:text-ink/40 focus:border-clay outline-none"
      />
    </div>
  );
}
