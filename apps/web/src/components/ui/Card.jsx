import clsx from 'clsx';
import '../../assets/styles/Card.css';

export default function Card({ className, children, ...rest }) {
  return (
    <div className={clsx('card-primitive', className)} {...rest}>
      {children}
    </div>
  );
}