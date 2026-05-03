export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const base = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg whitespace-nowrap cursor-pointer',
    'transition-[background,transform,opacity] duration-150',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-[var(--focus-outline)]',
    'active:scale-[0.98]',
    'disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100',
  ].join(' ');

  const variants = {
    primary: [
      'bg-monolith-gradient',
      'text-[var(--btn-primary-text)]',
      'hover:opacity-90',
    ].join(' '),

    secondary: [
      'bg-transparent',
      'text-[var(--text-body)]',
      'border border-[var(--border)]',
      'hover:bg-[var(--sidebar-bg)]',
      'hover:border-[var(--text-muted)]',
    ].join(' '),

    danger: [
      'bg-[var(--btn-danger)]',
      'text-[var(--btn-danger-text)]',
      'hover:bg-[var(--status-error-text)]',
    ].join(' '),
  };

  const sizes = {
    md: 'text-sm px-5 py-[9px] min-h-[40px] gap-2',
    sm: 'text-xs px-[14px] py-[5px] min-h-[30px] gap-1.5',
  };

  const classes = [
    base,
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    className,
  ].join(' ');

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}