import { useState, useEffect } from 'react';
import Icon from '../../../components/icon';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import CreateIdentityModal from '../modals/CreateIdentityModal/CreateIdentityModal';
import EditIdentityModal from '../modals/EditIdentityModal/EditIdentityModal';
import DeleteIdentityModal from '../modals/DeleteIdentityModal/DeleteIdentityModal';
import { adminService } from '../../../services/adminService';
import '../../../assets/styles/IdentityManagement.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];
function colorFor(id) {
  let h = 0;
  for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return COLORS[h % COLORS.length];
}
function initials(displayName, email) {
  const src = displayName || email || '';
  const parts = src.split(/[\s@.]+/).filter(Boolean);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : src.slice(0, 2).toUpperCase();
}
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export default function IdentityManagement() {
  const [identities, setIdentities] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeNow, setActiveNow]   = useState(0);
  const [loading, setLoading]       = useState(true);
  const [rolesByIdentity, setRolesByIdentity] = useState({});

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadRolesFor(ids) {
    if (!ids.length) return;
    const results = await Promise.all(
      ids.map(id => adminService.listIdentityRoles(id).catch(() => []))
    );
    setRolesByIdentity(prev => {
      const next = { ...prev };
      ids.forEach((id, i) => { next[id] = results[i] ?? []; });
      return next;
    });
  }

  async function load() {
    setLoading(true);
    try {
      const data = await adminService.listIdentities();
      const list = data.identities ?? [];
      setIdentities(list);
      setTotalUsers(data.totalUsers ?? 0);
      setActiveNow(data.activeNow ?? 0);
      loadRolesFor(list.map(i => i.id));
    } catch {
      setIdentities([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleAccess(identity) {
    const next = identity.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    try {
      await adminService.updateIdentity(identity.id, { displayName: identity.displayName, status: next });
      setIdentities(prev => prev.map(i => i.id === identity.id ? { ...i, status: next } : i));
      setActiveNow(prev => prev + (next === 'ENABLED' ? 1 : -1));
    } catch { /* keep state */ }
  }

  function handleIdentitySaved(updated) {
    setIdentities(prev => prev.map(i => i.id === updated.id ? { ...i, ...updated } : i));
    loadRolesFor([updated.id]);
  }

  async function handleDelete(identity) {
    try {
      await adminService.deleteIdentity(identity.id);
      setIdentities(prev => prev.filter(i => i.id !== identity.id));
      setTotalUsers(prev => Math.max(0, prev - 1));
      if (identity.status === 'ENABLED') setActiveNow(prev => Math.max(0, prev - 1));
    } catch { /* keep state */ }
  }

  const columns = [
    {
      key: 'user',
      header: 'USER ENTITY',
      cell: (row) => (
        <div className="user-entity">
          <div className="avatar" style={{ backgroundColor: colorFor(row.id) }}>
            {initials(row.displayName, row.email)}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{row.displayName || '—'}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{row.email}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'ROLES',
      cell: (row) => {
        const roles = rolesByIdentity[row.id] ?? [];
        if (roles.length === 0) return <span className="role-chips__empty">No roles</span>;
        return (
          <div className="role-chips">
            {roles.slice(0, 2).map(r => (
              <span key={r.id} className="role-chips__chip">{r.roleName}</span>
            ))}
            {roles.length > 2 && (
              <span className="role-chips__more">+{roles.length - 2}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'STATUS',
      cell: (row) => (
        <span className={row.status === 'ENABLED' ? 'status-active' : 'status-disabled'}>
          {row.status === 'ENABLED' ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      key: 'regDate',
      header: 'REGISTRATION DATE',
      cell: (row) => fmtDate(row.registeredAt),
    },
    {
      key: 'access',
      header: 'ACCESS',
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.status === 'ENABLED'}
          onChange={() => toggleAccess(row)}
          aria-label={`Toggle access for ${row.email}`}
          data-cy={`toggle-access-${row.id}`}
          style={{ width: '20px', height: '20px', accentColor: '#000000', cursor: 'pointer' }}
        />
      ),
      align: 'center',
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      cell: (row) => (
        <div className="identity-actions">
          <button
            type="button"
            className="identity-actions__btn"
            onClick={() => setEditTarget(row)}
            title="Edit identity & roles"
            aria-label={`Edit ${row.email}`}
            data-cy={`edit-identity-${row.id}`}
          >
            <Icon.Edit size={16} />
          </button>
          <button
            type="button"
            className="identity-actions__btn identity-actions__btn--danger"
            onClick={() => setDeleteTarget(row)}
            title="Delete identity"
            aria-label={`Delete ${row.email}`}
            data-cy={`delete-identity-${row.id}`}
          >
            <Icon.Delete size={16} />
          </button>
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <div className="identities-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Identities</h1>
          <p className="page-desc">
            Manage and provision digital sovereign identities across your enterprise ecosystem.
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)} data-cy="create-identity-btn">
          + Create Identity
        </Button>
      </div>

      <div className="stats-container">
        <Card>
          <div style={{ padding: '20px' }}>
            <div>TOTAL USERS</div>
            <h2>{loading ? '…' : totalUsers.toLocaleString()}</h2>
          </div>
        </Card>
        <Card>
          <div style={{ padding: '20px' }}>
            <div>ACTIVE NOW</div>
            <h2>{loading ? '…' : activeNow.toLocaleString()}</h2>
          </div>
        </Card>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
        ) : (
          <DataTable columns={columns} rows={identities} rowKey={(row) => row.id} />
        )}
      </div>

      <CreateIdentityModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(created) => {
          setIdentities(prev => [...prev, created]);
          setTotalUsers(t => t + 1);
          if (created.status === 'ENABLED') setActiveNow(a => a + 1);
        }}
      />

      <EditIdentityModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        identity={editTarget}
        onSaved={handleIdentitySaved}
      />

      <DeleteIdentityModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        identity={deleteTarget}
        onDelete={handleDelete}
      />
    </div>
  );
}
