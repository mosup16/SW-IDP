import clsx from 'clsx';
import '../../assets/styles/Button.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  return (
    <button
      className={clsx(
        'btn',
        variant === 'primary' ? 'btn--primary' : 'btn--secondary',
        size === 'sm' ? 'btn--sm' : 'btn--md',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}