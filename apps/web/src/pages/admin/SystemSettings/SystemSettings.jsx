import { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../../../components/icon';
import { useAuth } from '../../../hooks/useAuth';
import { adminService } from '../../../services/adminService';
import '../../../assets/styles/SystemSettings.css';

// ── Helpers ───────────────────────────────────────────────────────
function isValidHex(val) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val);
}

function parseValue(rawValue, type) {
  if (type === 'INT')  return Number(rawValue);
  if (type === 'BOOL') return rawValue === 'true';
  return rawValue ?? '';
}

const DEFAULTS = {
  accessTokenTtl:    60,
  refreshTokenTtl:   30,
  passwordMinLength: 12,
  complexity: { uppercase: false, number: true, special: true },
  maintenanceMode:   false,
  primaryColor:      '#000000',
  companyLogoUrl:    '',
};

function settingsToForm(list) {
  const map = Object.fromEntries((list ?? []).map(s => [s.key, s]));
  return {
    accessTokenTtl:    parseValue(map['access_token_ttl']?.value,              'INT')  ?? DEFAULTS.accessTokenTtl,
    refreshTokenTtl:   parseValue(map['refresh_token_ttl']?.value,             'INT')  ?? DEFAULTS.refreshTokenTtl,
    passwordMinLength: parseValue(map['password_min_length']?.value,           'INT')  ?? DEFAULTS.passwordMinLength,
    complexity: {
      uppercase: parseValue(map['password_complexity_uppercase']?.value ?? 'false', 'BOOL'),
      number:    parseValue(map['password_complexity_number']?.value    ?? 'true',  'BOOL'),
      special:   parseValue(map['password_complexity_special']?.value   ?? 'true',  'BOOL'),
    },
    maintenanceMode: parseValue(map['maintenance_mode']?.value ?? 'false', 'BOOL'),
    primaryColor:    map['primary_color']?.value    ?? DEFAULTS.primaryColor,
    companyLogoUrl:  map['company_logo_url']?.value ?? DEFAULTS.companyLogoUrl,
  };
}

function formToUpdates(form) {
  return [
    { key: 'access_token_ttl',              value: String(form.accessTokenTtl),         type: 'INT'    },
    { key: 'refresh_token_ttl',             value: String(form.refreshTokenTtl),        type: 'INT'    },
    { key: 'password_min_length',           value: String(form.passwordMinLength),      type: 'INT'    },
    { key: 'password_complexity_uppercase', value: String(form.complexity.uppercase),   type: 'BOOL'   },
    { key: 'password_complexity_number',    value: String(form.complexity.number),      type: 'BOOL'   },
    { key: 'password_complexity_special',   value: String(form.complexity.special),     type: 'BOOL'   },
    { key: 'maintenance_mode',              value: String(form.maintenanceMode),        type: 'BOOL'   },
    { key: 'primary_color',                 value: form.primaryColor,                   type: 'STRING' },
    { key: 'company_logo_url',              value: form.companyLogoUrl,                 type: 'IMAGE'  },
  ];
}

// ── Custom Checkbox ───────────────────────────────────────────────
function Checkbox({ id, label, checked, onChange }) {
  return (
    <label className="gc-checkbox-item" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="gc-checkbox-box">
        {checked && <Icon.Check size={12} strokeWidth={3} />}
      </span>
      <span className="gc-checkbox-label">{label}</span>
    </label>
  );
}

// ── Toggle Switch ─────────────────────────────────────────────────
function Toggle({ id, checked, onChange }) {
  return (
    <label className="gc-toggle-track" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="gc-toggle-slider" />
    </label>
  );
}

// ── Number Input with validation ──────────────────────────────────
function NumberInput({ id, value, onChange, min, max, hint }) {
  const [error, setError] = useState('');

  function handle(raw) {
    onChange(raw);
    if (raw === '') { setError('Required'); return; }
    const n = Number(raw);
    if (isNaN(n)) { setError('Must be a number'); return; }
    if (min !== undefined && n < min) { setError(`Minimum is ${min}`); return; }
    if (max !== undefined && n > max) { setError(`Maximum is ${max}`); return; }
    setError('');
  }

  return (
    <div>
      <input
        id={id}
        type="number"
        className={`gc-input${error ? ' error' : ''}`}
        value={value}
        onChange={e => handle(e.target.value)}
        min={min}
        max={max}
      />
      {error
        ? <p className="gc-input-error"><Icon.AlertTriangle size={11} />{error}</p>
        : hint && <p className="gc-input-hint">{hint}</p>
      }
    </div>
  );
}

// ── Color Picker ──────────────────────────────────────────────────
function ColorPicker({ value, onChange }) {
  const [text, setText] = useState(value);
  const [error, setError] = useState('');

  function handleText(val) {
    setText(val);
    if (isValidHex(val)) { setError(''); onChange(val); }
    else setError('Enter a valid hex color (e.g. #1a2b3c)');
  }

  function handleNative(val) {
    setText(val);
    setError('');
    onChange(val);
  }

  return (
    <div>
      <div className="gc-color-input-wrap">
        <button className="gc-color-swatch-btn" type="button">
          <div className="gc-color-swatch-preview" style={{ background: isValidHex(text) ? text : '#000' }} />
          <input type="color" value={isValidHex(text) ? text : '#000000'} onChange={e => handleNative(e.target.value)} />
        </button>
        <input
          type="text"
          className="gc-color-text-input"
          value={text}
          onChange={e => handleText(e.target.value)}
          maxLength={7}
          spellCheck={false}
        />
      </div>
      {error && <p className="gc-color-error">{error}</p>}
    </div>
  );
}

// ── Logo Dropzone ─────────────────────────────────────────────────
function LogoDropzone({ logoUrl, onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file) return;
    const allowed = ['image/png', 'image/svg+xml'];
    if (!allowed.includes(file.type)) { alert('Only PNG or SVG files are allowed.'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('File must be under 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = e => onChange(e.target.result);
    reader.readAsDataURL(file);
  }, [onChange]);

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function handleFileInput(e) {
    processFile(e.target.files[0]);
    e.target.value = '';
  }

  if (logoUrl) {
    return (
      <div className="gc-dropzone" style={{ cursor: 'default' }}>
        <div className="gc-logo-preview">
          <img src={logoUrl} alt="Company logo preview" />
          <div className="gc-logo-preview-actions">
            <button className="gc-logo-remove-btn" onClick={() => onChange('')}>
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`gc-dropzone${dragOver ? ' drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".png,.svg,image/png,image/svg+xml"
        onChange={handleFileInput}
      />
      <div className="gc-dropzone-icon"><Icon.Upload size={28} /></div>
      <p className="gc-dropzone-text">
        Drag &amp; drop logo or <a onClick={e => { e.preventDefault(); inputRef.current?.click(); }}>browse</a>
      </p>
      <p className="gc-dropzone-hint">PNG, SVG up to 2MB</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function SystemSettings() {
  const { currentUser } = useAuth();
  const [form, setForm]     = useState(DEFAULTS);
  const [saved, setSaved]   = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService.listSettings()
      .then(list => {
        const parsed = settingsToForm(list);
        setForm(parsed);
        setSaved(parsed);
      })
      .catch(() => { /* keep DEFAULTS */ })
      .finally(() => setLoading(false));
  }, []);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function setComplexity(key, value) {
    setForm(prev => ({
      ...prev,
      complexity: { ...prev.complexity, [key]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const identityId = currentUser?.identityId;
      await Promise.all(
        formToUpdates(form).map(({ key, value, type }) =>
          adminService.updateSetting(key, { value, type, updatedBy: identityId })
        )
      );
      setSaved(form);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch { /* keep unsaved state */ } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(saved);
  }

  if (loading) {
    return (
      <div className="gc-page">
        <main className="gc-main">
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            Loading configuration…
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="gc-page">

      <main className="gc-main">
        {/* Header */}
        <div className="gc-header">
          <div className="gc-header-left">
            <h1>Global Configuration</h1>
            <p>Manage core security policies and branding for the Sovereign IdP.</p>
          </div>

          <div className="gc-header-actions">
            {toast && (
              <span className="gc-toast">
                <Icon.CheckCircle2 size={15} />
                Configuration saved!
              </span>
            )}
            {isDirty && !toast && (
              <>
                <span className="gc-dirty-dot" title="Unsaved changes" />
                <button className="gc-save-btn ghost" onClick={handleReset}>
                  Reset
                </button>
              </>
            )}
            <button
              className="gc-save-btn"
              onClick={handleSave}
              disabled={!isDirty || saving}
            >
              {saving
                ? <><Icon.RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                : <><Icon.Download size={14} /> Save Configuration</>
              }
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="gc-grid">
          {/* ── Security & Tokens card ── */}
          <div className="gc-card">
            <div className="gc-card-header">
              <Icon.Shield size={22} className="gc-card-icon" />
              <span className="gc-card-title">Security &amp; Tokens</span>
            </div>

            <div className="gc-row-2">
              <div>
                <label className="gc-field-label" htmlFor="access-ttl">
                  Access Token Expiration (Mins)
                </label>
                <NumberInput
                  id="access-ttl"
                  value={form.accessTokenTtl}
                  onChange={v => set('accessTokenTtl', v)}
                  min={1}
                  max={1440}
                  hint="Recommended: 15–60 mins"
                />
              </div>
              <div>
                <label className="gc-field-label" htmlFor="refresh-ttl">
                  Refresh Token Expiration (Days)
                </label>
                <NumberInput
                  id="refresh-ttl"
                  value={form.refreshTokenTtl}
                  onChange={v => set('refreshTokenTtl', v)}
                  min={1}
                  max={365}
                  hint="Recommended: 7–30 days"
                />
              </div>
            </div>

            <hr className="gc-divider" />

            <label className="gc-field-label">Password Complexity</label>
            <div className="gc-checkbox-group">
              <Checkbox
                id="chk-upper"
                label="Require Uppercase Letters"
                checked={form.complexity.uppercase}
                onChange={v => setComplexity('uppercase', v)}
              />
              <Checkbox
                id="chk-number"
                label="Require Numbers"
                checked={form.complexity.number}
                onChange={v => setComplexity('number', v)}
              />
              <Checkbox
                id="chk-special"
                label="Require Special Characters"
                checked={form.complexity.special}
                onChange={v => setComplexity('special', v)}
              />
            </div>

            <hr className="gc-divider" />

            <label className="gc-field-label" htmlFor="min-len">
              Minimum Password Length
            </label>
            <div style={{ maxWidth: 280 }}>
              <NumberInput
                id="min-len"
                value={form.passwordMinLength}
                onChange={v => set('passwordMinLength', v)}
                min={6}
                max={128}
                hint="Minimum 6, recommended 12+"
              />
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="gc-right-col">
            {/* System Status card */}
            <div className="gc-card">
              <div className="gc-card-header">
                <Icon.Power size={20} className="gc-card-icon" />
                <span className="gc-card-title">System Status</span>
              </div>

              <div className="gc-toggle-row">
                <div className="gc-toggle-info">
                  <p className="gc-toggle-name">Maintenance Mode</p>
                  <p className="gc-toggle-desc">Disables login for non-admins.</p>
                </div>
                <Toggle
                  id="maintenance-toggle"
                  checked={form.maintenanceMode}
                  onChange={v => set('maintenanceMode', v)}
                />
              </div>

              {form.maintenanceMode && (
                <div className="gc-maintenance-warning">
                  <Icon.AlertTriangle size={14} />
                  Maintenance mode is <strong>ON</strong> — non-admin logins are blocked.
                </div>
              )}
            </div>

            {/* Branding card */}
            <div className="gc-card">
              <div className="gc-card-header">
                <Icon.Brush size={20} className="gc-card-icon" />
                <span className="gc-card-title">Branding</span>
              </div>

              <div className="gc-color-field">
                <label className="gc-field-label">Primary Color</label>
                <ColorPicker
                  value={form.primaryColor}
                  onChange={v => set('primaryColor', v)}
                />
              </div>

              <label className="gc-field-label">Company Logo</label>
              <LogoDropzone
                logoUrl={form.companyLogoUrl}
                onChange={v => set('companyLogoUrl', v)}
              />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
