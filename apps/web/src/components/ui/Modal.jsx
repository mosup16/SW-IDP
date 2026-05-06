import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import GlassCard from './GlassCard';
import './Modal.css';

export default function Modal({ open, onOpenChange, title, children, size = 'md' }) {
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
        return;
      }

      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onMouseDown={() => onOpenChange(false)}>
      <div
        className={`modal-container modal-${size}`}
        ref={modalRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <GlassCard>
          {title && (
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              <button
                className="modal-close"
                aria-label="Close modal"
                onClick={() => onOpenChange(false)}
              >
                ✕
              </button>
            </div>
          )}
          <div className="modal-body">{children}</div>
        </GlassCard>
      </div>
    </div>,
    document.body
  );
}
