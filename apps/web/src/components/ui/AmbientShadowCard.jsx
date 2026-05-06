import clsx from 'clsx';
import './AmbientShadowCard.css';

/**
 * AmbientShadowCard — elevated surface container with the project's
 * signature soft ambient shadow.
 * bg-surface-container-lowest + shadow-ambient + rounded-xl
 *
 * All standard <div> HTML attributes pass through.
 */
export default function AmbientShadowCard({ className, children, ...rest }) {
  return (
    <div className={clsx('ambient-shadow-card', className)} {...rest}>
      {children}
    </div>
  );
}