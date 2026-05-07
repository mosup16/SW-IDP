import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../../services/adminService';
import Icon from '../../../components/icon.js';
import '../../../assets/styles/AuditLogs.css';

const EVENT_TYPES = ['All Event Types', 'Authentication', 'Policy Change', 'Token Issued', 'Client Created'];

const DATE_PRESETS = [
  { label: 'Last 24h', days: 1 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
];

function toDateInputValue(date) {
  return date.toISOString().split('T')[0];
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();
}

function avatarClass(name = '') {
  if (name.toLowerCase().includes('admin') || name.toLowerCase().includes('system')) return 'dark';
  if (name.toLowerCase().includes('unknown')) return 'unknown';
  if (name.toLowerCase().includes('service') || name.toLowerCase().includes('billing')) return 'system';
  return 'light';
}

const DEMO_LOGS = [
  {
    id: 'l1', timestamp: '2023-10-27T14:32:01Z',
    actorName: 'System Admin', actorEmail: 'admin@sovereign.local',
    action: 'Policy Update', detail: 'ID: pol_8x9f2a',
    status: 'SUCCESS', ip: '192.168.1.45', type: 'Policy Change',
  },
  {
    id: 'l2', timestamp: '2023-10-27T14:28:15Z',
    actorName: 'Billing Service', actorEmail: 'Client Credentials',
    action: 'Token Issued', detail: 'Scope: read:billing',
    status: 'SUCCESS', ip: '10.0.4.22', type: 'Token Issued',
  },
  {
    id: 'l3', timestamp: '2023-10-27T14:15:02Z',
    actorName: 'Unknown User', actorEmail: 'jdoe@external.com',
    action: 'Login Attempt', detail: 'Invalid Credentials',
    status: 'FAILED', ip: '203.0.113.42', type: 'Authentication',
  },
  {
    id: 'l4', timestamp: '2023-10-27T13:55:44Z',
    actorName: 'Mike Kumar', actorEmail: 'mkumar@sovereign.local',
    action: 'Interactive Login', detail: 'MFA Verified',
    status: 'SUCCESS', ip: '192.168.1.105', type: 'Authentication',
  },
  {
    id: 'l5', timestamp: '2023-10-27T13:40:12Z',
    actorName: 'System Admin', actorEmail: 'admin@sovereign.local',
    action: 'Client Created', detail: 'App: Analytics_Dash',
    status: 'SUCCESS', ip: '192.168.1.45', type: 'Client Created',
  },
  {
    id: 'l6', timestamp: '2023-10-27T12:11:00Z',
    actorName: 'Maria Lopez', actorEmail: 'maria.lopez@sovereign.idp',
    action: 'Interactive Login', detail: 'MFA Verified',
    status: 'SUCCESS', ip: '10.10.2.88', type: 'Authentication',
  },
  {
    id: 'l7', timestamp: '2023-10-27T11:05:33Z',
    actorName: 'Unknown User', actorEmail: 'attacker@evil.io',
    action: 'Login Attempt', detail: 'Invalid Credentials',
    status: 'FAILED', ip: '45.33.99.11', type: 'Authentication',
  },
];

const PAGE_SIZE = 5;


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
    onApply({ from: fromDate, to: toDate, label: activePreset !== null ? DATE_PRESETS[activePreset].label : `${fromDate} → ${toDate}` });
    setOpen(false);
  }

  return (
    <div className="audit-daterange-wrapper" ref={ref}>
      <button className="audit-daterange-btn" onClick={() => setOpen(v => !v)}>
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

  return (
    <div className="audit-dropdown-wrapper" ref={ref}>
      <button className="audit-dropdown-btn" onClick={() => setOpen(v => !v)}>
        <Icon.Filter size={14} />
        {value}
        <Icon.ChevronRight size={14} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div className="audit-dropdown-menu">
          {EVENT_TYPES.map(t => (
            <button
              key={t}
              className={`audit-dropdown-item${value === t ? ' active' : ''}`}
              onClick={() => { onChange(t); setOpen(false); }}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default function AuditLogs() {
  const [logs, setLogs] = useState(DEMO_LOGS);
  const [eventType, setEventType] = useState('All Event Types');
  const [dateLabel, setDateLabel] = useState('Last 7 Days');
  const [page, setPage] = useState(1);

  useEffect(() => {
    adminService.listAuditLogs({}).then(data => {
      if (Array.isArray(data) && data.length > 0) setLogs(data);
    }).catch(() => {});
  }, []);

  // Filter
  const filtered = logs.filter(l =>
    eventType === 'All Event Types' || l.type === eventType
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleDateApply({ label }) {
    setDateLabel(label);
    setPage(1);
  }

  function handleEventChange(val) {
    setEventType(val);
    setPage(1);
  }

  function handleExport() {
    const rows = [
      ['Timestamp (UTC)', 'Actor', 'Email', 'Action', 'Detail', 'Status', 'IP Address'],
      ...filtered.map(l => [l.timestamp, l.actorName, l.actorEmail, l.action, l.detail, l.status, l.ip]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'audit-logs.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="audit-page">
      {/* Top Nav */}
      <nav className="audit-topnav">
        <button className="audit-topnav-icon"><Icon.Bell size={18} /></button>
        <button className="audit-topnav-icon"><Icon.HelpCircle size={18} /></button>
        <div className="audit-topnav-avatar">AU</div>
      </nav>

      <main className="audit-main">
        {/* Header */}
        <div className="audit-header">
          <div className="audit-header-left">
            <h1>Audit Logs</h1>
            <p>Immutable record of system events and access modifications.</p>
          </div>

          <div className="audit-header-actions">
            <DateRangePicker label={dateLabel} onApply={handleDateApply} />
            <EventTypeDropdown value={eventType} onChange={handleEventChange} />
            <button className="audit-export-btn" onClick={handleExport}>
              <Icon.Download size={15} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
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
                const isFailed = log.status === 'FAILED';
                return (
                  <tr key={log.id}>
                    <td><span className="audit-ts">{log.timestamp.replace('T', ' ').replace('Z', '')}</span></td>
                    <td>
                      <div className="audit-actor">
                        <div className={`audit-actor-avatar ${avatarClass(log.actorName)}`}>
                          {log.actorName.toLowerCase().includes('unknown')
                            ? <Icon.HelpCircle size={16} />
                            : log.actorName.toLowerCase().includes('service')
                              ? <Icon.Zap size={16} />
                              : getInitials(log.actorName)}
                        </div>
                        <div>
                          <div className="audit-actor-name">{log.actorName}</div>
                          <div className="audit-actor-email">{log.actorEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="audit-action-name">{log.action}</div>
                      <div className={`audit-action-detail${isFailed ? ' error' : ''}`}>{log.detail}</div>
                    </td>
                    <td>
                      <span className={`audit-badge ${isFailed ? 'failed' : 'success'}`}>
                        <span className="audit-badge-dot" />
                        {isFailed ? 'Failed' : 'Success'}
                      </span>
                    </td>
                    <td className="audit-ip">{log.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="audit-footer">
            <p className="audit-showing">
              Showing <strong>{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.toLocaleString ? filtered.length.toLocaleString() : filtered.length}</strong> events
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