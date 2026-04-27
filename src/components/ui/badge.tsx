interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-pill bg-brand-light text-brand-deep font-sans text-[13px] font-medium uppercase tracking-[0.65px] ${className}`}
    >
      {children}
    </span>
  );
}

export function MonoBadge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-pill bg-brand-light text-brand-deep font-mono text-[12px] font-semibold uppercase tracking-[0.6px] ${className}`}
    >
      {children}
    </span>
  );
}
