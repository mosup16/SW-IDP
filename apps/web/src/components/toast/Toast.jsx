import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';
import '../../assets/styles/Toast.css';

const ICONS = {
  success: <CheckCircle2 size={17} />,
  error:   <AlertCircle  size={17} />,
  info:    <Info         size={17} />,
};

export default function Toast({ id, message, tone = 'info', leaving, onDismiss }) {
  return (
    <div
      className={[
        'toast',
        `toast--${tone}`,
        leaving ? 'toast--leaving' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="alert"
    >
      <span className="toast__icon" aria-hidden="true">
        {ICONS[tone] ?? ICONS.info}
      </span>

      <span className="toast__message">{message}</span>

      <button
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        <X size={15} />
      </button>
    </div>
  );
}