export default function Card({ className = '', children, ...rest }) {
  const base = [
    'bg-[var(--card-bg)]',
    'rounded-xl',
    'border border-[var(--section-divider)]',
    'p-6',
  ].join(' ');

  const classes = [base, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}