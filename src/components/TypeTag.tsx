const TYPE_COLORS: Record<string, string> = {
  fire: '#b95c34',
  water: '#3d6fa3',
  grass: '#3f6b4a',
  electric: '#b3892f',
  psychic: '#a45a8c',
  ice: '#4f9aa3',
  dragon: '#5a4fa3',
  dark: '#3a352c',
  fairy: '#c17a9e',
  normal: '#8a8570',
  fighting: '#96471f',
  flying: '#7a8fc2',
  poison: '#7a4f8c',
  ground: '#a3854f',
  rock: '#8a7a52',
  bug: '#6e7a3f',
  ghost: '#5a5a8c',
  steel: '#6f7a80',
};

export default function TypeTag({ type }: { type: string }) {
  const color = TYPE_COLORS[type] ?? '#6f7a55';
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-sm text-[11px] font-body font-medium text-paper-card"
      style={{ backgroundColor: color }}
    >
      {type}
    </span>
  );
}
