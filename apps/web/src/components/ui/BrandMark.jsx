import { ShieldCheck } from 'lucide-react';

const config = {
  sm: {
    tile:     'w-7 h-7 rounded-[7px]',
    icon:     14,
    wordmark: 'text-sm',
    sub:      'text-[9px]',
    gap:      'gap-2',
  },
  md: {
    tile:     'w-10 h-10 rounded-[10px]',
    icon:     20,
    wordmark: 'text-lg',
    sub:      'text-[11px]',
    gap:      'gap-2.5',
  },
  lg: {
    tile:     'w-14 h-14 rounded-[14px]',
    icon:     28,
    wordmark: 'text-2xl',
    sub:      'text-[13px]',
    gap:      'gap-3',
  },
};

export default function BrandMark({ size = 'md' }) {
  const c = config[size] ?? config.md;

  return (
    <div className={`inline-flex items-center select-none ${c.gap}`}>
      <div
        className={[
          'flex items-center justify-center flex-shrink-0',
          'bg-monolith-gradient',
          'hover:opacity-90',
          'transition-opacity duration-150',
          c.tile,
        ].join(' ')}
      >
        <ShieldCheck
          size={c.icon}
          strokeWidth={2}
          className="text-[var(--btn-primary-text)]"
        />
      </div>

      <div>
        <span
          className={[
            'block font-black tracking-[-0.01em] leading-tight',
            'text-[var(--text-heading)]',
            c.wordmark,
          ].join(' ')}
        >
          SOVEREIGN IDP
        </span>
        <span
          className={[
            'block font-normal tracking-[0.01em]',
            'text-[var(--text-muted)]',
            c.sub,
          ].join(' ')}
        >
          Identity Provisioning &amp; Governance
        </span>
      </div>
    </div>
  );
}