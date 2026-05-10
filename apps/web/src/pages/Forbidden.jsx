import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--page-bg, #f5f5f7)',
      padding: '32px',
    }}>
      <div style={{
        background: '#fff',
        padding: '40px 48px',
        borderRadius: 14,
        textAlign: 'center',
        maxWidth: 420,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Access denied</h1>
        <p style={{ color: 'var(--text-muted, #888)', marginBottom: 24, fontSize: 14.5, lineHeight: 1.5 }}>
          You don&apos;t have permission to access this page. If you believe this is a mistake, contact your administrator.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            padding: '11px 28px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
