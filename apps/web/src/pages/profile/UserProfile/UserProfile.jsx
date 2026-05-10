import { useState, useEffect } from 'react';
import Icon from '../../../components/icon';
import { useAuth } from '../../../hooks/useAuth';
import { adminService } from '../../../services/adminService';
import { authService } from '../../../services/authService';
import '../../../assets/styles/UserProfile.css';

function PasswordField({ id, label, value, onChange, placeholder, hint, error }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="up-field">
      <label className="up-field-label" htmlFor={id}>{label}</label>
      <div className="up-field-input-wrap">
        <input
          id={id}
          className="up-field-input"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || ''}
          autoComplete="off"
        />
        <button
          type="button"
          className="up-field-toggle"
          onClick={() => setVisible(v => !v)}
          tabIndex={-1}
        >
          {visible ? <Icon.EyeOff size={16} /> : <Icon.Eye size={16} />}
        </button>
      </div>
      {hint && !error && <p className="up-field-hint">{hint}</p>}
      {error && (
        <p className="up-field-error">
          <Icon.AlertTriangle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function relativeTime(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function isMobile(userAgent) {
  if (!userAgent) return false;
  return /mobile|android|iphone|ipad/i.test(userAgent);
}

export default function UserProfile() {
  const { currentUser } = useAuth();

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    adminService.listSessions()
      .then(data => {
        if (Array.isArray(data)) {
          setSessions(data);
          const current = data.find(s => s.isCurrent);
          if (current?.identity?.displayName) setDisplayName(current.identity.displayName);
        }
      })
      .catch(() => {})
      .finally(() => setSessionsLoading(false));
  }, []);

  async function handleUpdatePassword() {
    setPwError('');
    setPwSuccess(false);
    if (newPw.length < 12) {
      setPwError('Must be at least 12 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('Passwords do not match.');
      return;
    }
    setPwLoading(true);
    try {
      await authService.updatePassword({ currentPassword: currentPw, newPassword: newPw });
      setPwSuccess(true);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.body?.message ?? 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  }

  function handleCancelPassword() {
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setPwError('');
    setPwSuccess(false);
  }

  async function revokeSession(id) {
    try {
      await adminService.revokeSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch { /* keep state */ }
  }

  async function revokeAll() {
    try {
      await adminService.revokeAllSessions();
      setSessions(prev => prev.filter(s => s.isCurrent));
    } catch { /* keep state */ }
  }

  const nonCurrentCount = sessions.filter(s => !s.isCurrent).length;
  const email = currentUser?.email ?? '—';

  return (
    <div className="up-main">
      <h1 className="up-page-title">User Profile</h1>
      <p className="up-page-sub">Manage your identity details, security credentials, and active sessions.</p>

      <div className="up-top-grid">
        {/* Profile Card */}
        <div className="up-profile-card">
          <div className="up-avatar-wrapper">
            <div className="up-avatar">
              <Icon.UserCircle size={56} />
            </div>
            <button className="up-avatar-edit">
              <Icon.Pencil size={12} />
            </button>
          </div>

          <p className="up-profile-name">{displayName || '—'}</p>
          <p className="up-profile-email">{email}</p>

          <div className="up-status-badge">
            <span className="up-status-dot" />
            Active Identity
          </div>

          <div className="up-profile-meta">
            <div className="up-meta-row">
              <span className="up-meta-label">Identity ID</span>
              <span className="up-meta-value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                {currentUser?.identityId ?? '—'}
              </span>
            </div>
            <div className="up-meta-row">
              <span className="up-meta-label">Active Sessions</span>
              <span className="up-meta-value">{sessionsLoading ? '…' : sessions.length}</span>
            </div>
          </div>
        </div>

        {/* Security Credentials */}
        <div className="up-security-card">
          <div className="up-security-header">
            <div className="up-security-icon-wrap">
              <Icon.Key size={18} />
            </div>
            <span className="up-security-title">Security Credentials</span>
          </div>

          <PasswordField
            id="current-pw"
            label="Current Password"
            value={currentPw}
            onChange={setCurrentPw}
            placeholder="Enter current password"
          />

          <PasswordField
            id="new-pw"
            label="New Password"
            value={newPw}
            onChange={val => { setNewPw(val); setPwError(''); }}
            placeholder="Enter new password"
            hint="Must be at least 12 characters, including a number and symbol."
            error={pwError}
          />

          <PasswordField
            id="confirm-pw"
            label="Confirm New Password"
            value={confirmPw}
            onChange={val => { setConfirmPw(val); setPwError(''); }}
            placeholder="Confirm new password"
          />

          <div className="up-security-actions">
            {pwSuccess && (
              <span className="up-toast">
                <Icon.CheckCircle2 size={15} />
                Password updated!
              </span>
            )}
            <button className="up-btn-cancel" onClick={handleCancelPassword} disabled={pwLoading}>
              Cancel
            </button>
            <button
              className="up-btn-primary"
              onClick={handleUpdatePassword}
              disabled={!currentPw || !newPw || !confirmPw || pwLoading}
            >
              {pwLoading ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="up-sessions-card">
        <div className="up-sessions-header">
          <div className="up-sessions-header-left">
            <div className="up-sessions-icon-wrap">
              <Icon.Monitor size={18} />
            </div>
            <div>
              <p className="up-sessions-title">Active Sessions</p>
              <p className="up-sessions-sub">Manage devices currently authenticated to your account.</p>
            </div>
          </div>

          {nonCurrentCount > 0 && (
            <button className="up-btn-revoke-all" onClick={revokeAll}>
              Revoke All
            </button>
          )}
        </div>

        <table className="up-sessions-table">
          <thead>
            <tr>
              <th>Device / Application</th>
              <th>Location (IP)</th>
              <th>Last Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessionsLoading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Loading…
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No active sessions.
                </td>
              </tr>
            ) : sessions.map(session => {
              const DevIcon = isMobile(session.userAgent) ? Icon.Smartphone : Icon.Monitor;
              return (
                <tr key={session.id}>
                  <td>
                    <div className="up-device-cell">
                      <DevIcon size={20} className="up-device-icon" />
                      <div>
                        <div className="up-device-name">
                          {session.deviceLabel || 'Unknown device'}
                          {session.isCurrent && <span className="up-current-chip">Current</span>}
                        </div>
                        <div className="up-device-os">{session.userAgent || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="up-location-city">{session.location || '—'}</div>
                    <div className="up-location-ip">{session.ipAddress || '—'}</div>
                  </td>
                  <td>{relativeTime(session.lastActiveAt)}</td>
                  <td>
                    {session.isCurrent ? (
                      <span className="up-action-active">Active</span>
                    ) : (
                      <button className="up-btn-revoke" onClick={() => revokeSession(session.id)}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
