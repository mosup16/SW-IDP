import { useState } from 'react';
import Icon from '../../../components/icon';
import '../../../assets/styles/UserProfile.css';

const SESSIONS_SEED = [
  {
    id: 's1',
    deviceLabel: 'MacBook Pro - Safari',
    os: 'macOS 14.2',
    icon: 'Monitor',
    location: 'San Francisco, CA',
    ip: '192.168.1.104',
    lastActive: 'Just now',
    isCurrent: true,
  },
  {
    id: 's2',
    deviceLabel: 'iPhone 14 Pro - Native App',
    os: 'iOS 17.1',
    icon: 'Smartphone',
    location: 'San Jose, CA',
    ip: '172.20.10.4',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: 's3',
    deviceLabel: 'Windows Workstation - Chrome',
    os: 'Windows 11',
    icon: 'Monitor',
    location: 'New York, NY',
    ip: '10.0.0.45',
    lastActive: '3 days ago',
    isCurrent: false,
  },
];

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

export default function UserProfile() {
  const [currentPw, setCurrentPw] = useState('••••••••');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const [sessions, setSessions] = useState(SESSIONS_SEED);

  function handleUpdatePassword() {
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
    setPwSuccess(true);
    setNewPw('');
    setConfirmPw('');
    setTimeout(() => setPwSuccess(false), 3000);
  }

  function handleCancelPassword() {
    setNewPw('');
    setConfirmPw('');
    setPwError('');
    setPwSuccess(false);
  }

  function revokeSession(id) {
    setSessions(prev => prev.filter(s => s.id !== id));
  }

  function revokeAll() {
    setSessions(prev => prev.filter(s => s.isCurrent));
  }

  const nonCurrentCount = sessions.filter(s => !s.isCurrent).length;

  return (
    <div className="up-main">
      <h1 className="up-page-title">User Profile</h1>
      <p className="up-page-sub">Manage your identity details, security credentials, and active sessions.</p>

      {/* Top grid - Profile + Security */}
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

          <p className="up-profile-name">Alexander Vance</p>
          <p className="up-profile-email">alexander.vance@sovereign.idp</p>

          <div className="up-status-badge">
            <span className="up-status-dot" />
            Active Identity
          </div>

          <div className="up-profile-meta">
            <div className="up-meta-row">
              <span className="up-meta-label">Role</span>
              <span className="up-meta-value">Super Administrator</span>
            </div>
            <div className="up-meta-row">
              <span className="up-meta-label">Department</span>
              <span className="up-meta-value">Security Ops</span>
            </div>
            <div className="up-meta-row">
              <span className="up-meta-label">Last Login</span>
              <span className="up-meta-value">Today, 08:42 AM</span>
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
            <button className="up-btn-cancel" onClick={handleCancelPassword}>Cancel</button>
            <button
              className="up-btn-primary"
              onClick={handleUpdatePassword}
              disabled={!newPw || !confirmPw}
            >
              Update Password
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
            {sessions.map(session => {
              const DevIcon = session.icon === 'Smartphone' ? Icon.Smartphone : Icon.Monitor;
              return (
                <tr key={session.id}>
                  <td>
                    <div className="up-device-cell">
                      <DevIcon size={20} className="up-device-icon" />
                      <div>
                        <div className="up-device-name">
                          {session.deviceLabel}
                          {session.isCurrent && <span className="up-current-chip">Current</span>}
                        </div>
                        <div className="up-device-os">{session.os}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="up-location-city">{session.location}</div>
                    <div className="up-location-ip">{session.ip}</div>
                  </td>
                  <td>{session.lastActive}</td>
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