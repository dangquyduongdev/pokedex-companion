interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-8">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="text-sm px-3 py-1.5 border border-line rounded-sm disabled:opacity-30 hover:border-clay transition-colors"
      >
        ← Previous
      </button>
      <span className="text-sm text-ink/60 font-body" aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="text-sm px-3 py-1.5 border border-line rounded-sm disabled:opacity-30 hover:border-clay transition-colors"
      >
        Next →
      </button>
    </nav>
  );
}
