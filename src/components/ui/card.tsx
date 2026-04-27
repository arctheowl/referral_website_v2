interface CardProps {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  id?: string;
}

export function Card({ children, className = "", featured = false, id }: CardProps) {
  const radius = featured ? "rounded-card-lg" : "rounded-card";
  const padding = featured ? "p-8" : "p-6";
  return (
    <div
      id={id}
      className={`bg-bg-card border border-border shadow-[var(--shadow-card)] ${radius} ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
