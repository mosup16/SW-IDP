import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../../services/adminService';
import Icon from '../../../components/icon.js';
import '../../../assets/styles/AuditLogs.css';

const EVENT_TYPES = [
  { code: '',                    label: 'All Event Types' },
  { code: 'AUTH_LOGIN',          label: 'Login' },
  { code: 'IDENTITY_REGISTERED', label: 'Identity Registered' },
  { code: 'IDENTITY_CREATED',    label: 'Identity Created' },
  { code: 'IDENTITY_UPDATED',    label: 'Identity Updated' },
  { code: 'IDENTITY_DELETED',    label: 'Identity Deleted' },
  { code: 'ROLE_CREATED',        label: 'Role Created' },
  { code: 'ROLE_UPDATED',        label: 'Role Updated' },
  { code: 'ROLE_DELETED',        label: 'Role Deleted' },
  { code: 'ROLE_ASSIGNED',       label: 'Role Assigned' },
  { code: 'ROLE_REMOVED',        label: 'Role Removed' },
];

const DATE_PRESETS = [
  { label: 'Last 24h',     days: 1 },
  { label: 'Last 7 Days',  days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
];

const PAGE_SIZE = 10;

function toDateInputValue(date) {
  return date.toISOString().split('T')[0];
}

function fmtTimestamp(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

function shortId(id) {
  if (!id) return '—';
  const s = String(id);
  return s.length > 12 ? `${s.slice(0, 8)}…${s.slice(-4)}` : s;
}

function actorLabel(log) {
  if (log.metadata) {
    try {
      const meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata;
      if (meta.email) return meta.email;
    } catch { /* ignore */ }
  }
  return log.actorId ? shortId(log.actorId) : 'System';
}

function detailLabel(log) {
  if (log.metadata) {
    try {
      const meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata;
      if (meta.errorMessage) return meta.errorMessage;
      if (meta.email && log.targetType) return `${log.targetType.toLowerCase()} · ${meta.email}`;
    } catch { /* ignore */ }
  }
  if (log.targetType && log.targetId) return `${log.targetType.toLowerCase()} · ${shortId(log.targetId)}`;
  return log.targetType?.toLowerCase() ?? '—';
}

function actionDisplay(code) {
  const found = EVENT_TYPES.find(e => e.code === code);
  return found?.label ?? code;
}

function avatarIconFor(log) {
  if (!log.actorId) return 'system';
  return 'light';
}

function avatarText(log) {
  if (!log.actorId) return null;
  const label = actorLabel(log);
  if (label.includes('@')) {
    const local = label.split('@')[0];
    return (local[0] + (local[1] ?? '')).toUpperCase();
  }
  return shortId(log.actorId).slice(0, 2).toUpperCase();
}

function DateRangePicker({ label, onApply }) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(1); // "Last 7 Days"
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return toDateInputValue(d);
  });
  const [toDate, setToDate] = useState(() => toDateInputValue(new Date()));
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function selectPreset(idx) {
    setActivePreset(idx);
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - DATE_PRESETS[idx].days);
    setFromDate(toDateInputValue(from));
    setToDate(toDateInputValue(to));
  }

  function apply() {
    onApply({
      from: fromDate,
      to: toDate,
      label: activePreset !== null ? DATE_PRESETS[activePreset].label : `${fromDate} → ${toDate}`,
    });
    setOpen(false);
  }

  return (
    <div className="audit-daterange-wrapper" ref={ref}>
      <button className="audit-daterange-btn" onClick={() => setOpen(v => !v)} data-cy="audit-daterange-btn">
        <Icon.BookOpen size={15} />
        {label}
        <Icon.ChevronRight size={14} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div className="audit-daterange-panel">
          <div className="audit-daterange-presets">
            {DATE_PRESETS.map((p, i) => (
              <button
                key={p.label}
                className={`audit-preset-chip${activePreset === i ? ' active' : ''}`}
                onClick={() => selectPreset(i)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="audit-daterange-custom">
            <label>From</label>
            <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setActivePreset(null); }} />
            <label>To</label>
            <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setActivePreset(null); }} />
          </div>

          <button className="audit-daterange-apply" onClick={apply}>Apply Range</button>
        </div>
      )}
    </div>
  );
}

function EventTypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = EVENT_TYPES.find(t => t.code === value) ?? EVENT_TYPES[0];

  return (
    <div className="audit-dropdown-wrapper" ref={ref}>
      <button className="audit-dropdown-btn" onClick={() => setOpen(v => !v)} data-cy="audit-event-type-btn">
        <Icon.Filter size={14} />
        {current.label}
        <Icon.ChevronRight size={14} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div className="audit-dropdown-menu">
          {EVENT_TYPES.map(t => (
            <button
              key={t.code || 'all'}
              className={`audit-dropdown-item${value === t.code ? ' active' : ''}`}
              onClick={() => { onChange(t.code); setOpen(false); }}
              data-cy={`audit-event-type-${t.code || 'all'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState('');
  const [dateLabel, setDateLabel] = useState('Last 7 Days');
  const [dateRange, setDateRange] = useState(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return { from: toDateInputValue(from), to: toDateInputValue(to) };
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    adminService.listAuditLogs({
      from: dateRange.from,
      to: dateRange.to,
      action: eventType || undefined,
    })
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.content ?? []);
        setLogs(arr);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [eventType, dateRange]);

  const filtered = logs;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleDateApply({ label, from, to }) {
    setDateLabel(label);
    setDateRange({ from, to });
    setPage(1);
  }

  function handleEventChange(code) {
    setEventType(code);
    setPage(1);
  }

  function handleExport() {
    const rows = [
      ['Timestamp (UTC)', 'Actor', 'Action', 'Detail', 'Status', 'IP Address'],
      ...filtered.map(l => [
        l.timestampUtc ?? '',
        actorLabel(l),
        actionDisplay(l.action),
        detailLabel(l),
        l.status ?? '',
        l.ipAddress ?? '',
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'audit-logs.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="audit-page" style={{ padding: '2rem' }}>Loading audit logs…</div>;
  }

  return (
    <div className="audit-page">
      <nav className="audit-topnav">
        <button className="audit-topnav-icon"><Icon.Bell size={18} /></button>
        <button className="audit-topnav-icon"><Icon.HelpCircle size={18} /></button>
        <div className="audit-topnav-avatar">AU</div>
      </nav>

      <main className="audit-main">
        <div className="audit-header">
          <div className="audit-header-left">
            <h1>Audit Logs</h1>
            <p>Immutable record of system events and access modifications.</p>
          </div>

          <div className="audit-header-actions">
            <DateRangePicker label={dateLabel} onApply={handleDateApply} />
            <EventTypeDropdown value={eventType} onChange={handleEventChange} />
            <button className="audit-export-btn" onClick={handleExport} data-cy="audit-export-btn">
              <Icon.Download size={15} />
              Export
            </button>
          </div>
        </div>

        <div className="audit-card">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Actor</th>
                <th>Action / Event</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="audit-empty">
                      <Icon.ScrollText size={40} />
                      <p>No events found for the selected filters.</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map(log => {
                const isFailed = log.status === 'FAILURE';
                const initials = avatarText(log);
                return (
                  <tr key={log.id} data-cy={`audit-row-${log.id}`}>
                    <td><span className="audit-ts">{fmtTimestamp(log.timestampUtc)}</span></td>
                    <td>
                      <div className="audit-actor">
                        <div className={`audit-actor-avatar ${avatarIconFor(log)}`}>
                          {initials ?? <Icon.Zap size={16} />}
                        </div>
                        <div>
                          <div className="audit-actor-name">{actorLabel(log)}</div>
                          <div className="audit-actor-email">
                            {log.actorId ? `ID: ${shortId(log.actorId)}` : 'System actor'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="audit-action-name">{actionDisplay(log.action)}</div>
                      <div className={`audit-action-detail${isFailed ? ' error' : ''}`}>{detailLabel(log)}</div>
                    </td>
                    <td>
                      <span className={`audit-badge ${isFailed ? 'failed' : 'success'}`}>
                        <span className="audit-badge-dot" />
                        {isFailed ? 'Failed' : 'Success'}
                      </span>
                    </td>
                    <td className="audit-ip">{log.ipAddress ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="audit-footer">
            <p className="audit-showing">
              Showing <strong>{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length.toLocaleString()}</strong> events
            </p>
            <div className="audit-pagination">
              <button
                className="audit-page-btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <button
                className="audit-page-btn primary"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
