export default function AmbientShadowCard({ className = '', children, ...rest }) {
  const base = [
    'relative overflow-hidden',
    'bg-[var(--card-bg)]',
    'rounded-xl',
    'border border-black/[.06]',
    'p-7',
    'shadow-ambient',
    'transition-[box-shadow,transform] duration-200 ease-out',
    'hover:shadow-ambient-hover hover:-translate-y-0.5',
  ].join(' ');

  const classes = [base, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-accent-stripe opacity-60 pointer-events-none"
      />
      {children}
    </div>
  );
}