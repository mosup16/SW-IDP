import { ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import './BrandMark.css';

/**
 * BrandMark — gradient tile (monolith-gradient, text-on-primary, ShieldCheck)
 * alongside the "Sovereign IdP" wordmark in font-headline.
 *
 * @param {'sm'|'md'|'lg'} size  – scales both tile and wordmark. Default: 'md'
 * All standard <div> HTML attributes pass through.
 */
export default function BrandMark({ size = 'md', className, ...rest }) {
  return (
    <div
      className={clsx('brand-mark', `brand-mark--${size}`, className)}
      {...rest}
    >
      {/* Gradient tile */}
      <div className="brand-mark__tile" aria-hidden="true">
        <ShieldCheck className="brand-mark__icon" strokeWidth={2} />
      </div>

      {/* Wordmark */}
      <div className="brand-mark__wordmark">
        <span className="brand-mark__name">Sovereign IdP</span>
        <span className="brand-mark__tagline">Identity &amp; Governance</span>
      </div>
    </div>
  );
}