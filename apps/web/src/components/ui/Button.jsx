import clsx from 'clsx';
import './Button.css';

/**
 * Button — primary UI action primitive.
 *
 * @param {'primary'|'secondary'} variant  – visual style. Default: 'primary'
 * @param {'sm'|'md'}             size     – padding / font scale. Default: 'md'
 * All standard <button> HTML attributes (onClick, disabled, type, …) pass through.
 */
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