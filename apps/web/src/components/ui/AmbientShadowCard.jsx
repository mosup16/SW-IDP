import clsx from 'clsx';
import '../../assets/styles/AmbientShadowCard.css';


export default function AmbientShadowCard({ className, children, ...rest }) {
  return (
    <div className={clsx('ambient-shadow-card', className)} {...rest}>
      {children}
    </div>
  );
}