const STYLES: Record<string, string> = {
  cold: "border border-line text-muted",
  warm: "border border-gold/50 text-gold",
  hot: "bg-rust text-paper",
  won: "bg-gold text-ink",
  lost: "border border-line text-muted line-through",
};

const LABELS: Record<string, string> = {
  cold: "Cold",
  warm: "Warm",
  hot: "Hot",
  won: "Won",
  lost: "Lost",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${STYLES[status] ?? "border border-line text-muted"}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}

const SOURCE_LABELS: Record<string, string> = {
  scraper: "Scraper",
  website: "Website",
  employee: "Employee",
  manager: "Manager",
};

export function SourceTag({ source }: { source: string }) {
  return <span className="text-xs text-muted">{SOURCE_LABELS[source] ?? source}</span>;
}
