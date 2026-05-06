import './IconButton.css';

export default function IconButton({ 'aria-label': ariaLabel, className = '', children, ...props }) {
  return (
    <button
      className={`icon-button ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
