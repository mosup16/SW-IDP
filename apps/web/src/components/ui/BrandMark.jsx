import { ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import '../../assets/styles/BrandMark.css';

export default function BrandMark({ size = 'md', className, ...rest }) {
  return (
    <div
      className={clsx('brand-mark', `brand-mark--${size}`, className)}
      {...rest}
    >
      {}
      <div className="brand-mark__tile" aria-hidden="true">
        <ShieldCheck className="brand-mark__icon" strokeWidth={2} />
      </div>

      {}
      <div className="brand-mark__wordmark">
        <span className="brand-mark__name">Sovereign IdP</span>
        <span className="brand-mark__tagline">Identity &amp; Governance</span>
      </div>
    </div>
  );
}