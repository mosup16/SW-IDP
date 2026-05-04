import clsx from 'clsx';
import './Card.css';

/**
 * Card — flat surface container.
 * bg-surface-container-lowest + rounded-xl + p-6
 *
 * All standard <div> HTML attributes pass through.
 */
export default function Card({ className, children, ...rest }) {
  return (
    <div className={clsx('card-primitive', className)} {...rest}>
      {children}
    </div>
  );
}