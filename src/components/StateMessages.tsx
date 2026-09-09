export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" aria-busy="true" aria-label="Loading specimens">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="border border-line bg-paper-card rounded-sm p-4 h-48 animate-pulse"
        >
          <div className="h-24 bg-line/60 rounded-sm mb-3" />
          <div className="h-3 w-16 bg-line/60 rounded-sm mb-2" />
          <div className="h-4 w-24 bg-line/60 rounded-sm" />
        </li>
      ))}
    </ul>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="border border-clay/40 bg-clay/5 rounded-sm p-6 text-center">
      <p className="font-display text-lg text-clay-dark mb-1">Something went wrong</p>
      <p className="text-sm text-ink/70 mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium px-4 py-2 border border-clay text-clay-dark rounded-sm hover:bg-clay hover:text-paper-card transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-dashed border-line rounded-sm p-8 text-center">
      <p className="font-display text-lg text-ink mb-1">{title}</p>
      <p className="text-sm text-ink/60">{description}</p>
    </div>
  );
}
