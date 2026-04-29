import { ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-surface">
      <div className="glass-panel max-w-xl w-full rounded-xl shadow-ambient p-10 space-y-6">
        <div className="flex items-center gap-3">
          <span
            className="monolith-gradient text-on-primary inline-flex items-center justify-center w-10 h-10 rounded-lg"
            aria-hidden
          >
            <ShieldCheck className="w-5 h-5" />
          </span>
          <span className="font-headline text-lg font-bold tracking-tight text-on-surface">
            Sovereign IdP
          </span>
        </div>

        <h1 className="font-headline text-3xl font-extrabold leading-tight text-on-surface">
          Frontend foundation is wired.
        </h1>

        <p className="text-on-surface-variant leading-relaxed">
          This placeholder confirms Vite, React, Tailwind v4, the Material-3 design tokens, the
          Manrope / Inter font pair, and Lucide icons are all loaded. Real screens are built in the
          following issues.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="inline-flex items-center rounded-full bg-tertiary-fixed text-tertiary-container px-3 py-1 text-xs font-medium uppercase tracking-wider">
            tokens loaded
          </span>
          <span className="inline-flex items-center rounded-full bg-secondary-container text-on-surface px-3 py-1 text-xs font-medium uppercase tracking-wider">
            fonts ready
          </span>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-on-primary"
            style={{ backgroundColor: 'var(--color-surface-tint)' }}
          >
            surface-tint
          </span>
        </div>
      </div>
    </main>
  );
}
