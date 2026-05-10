import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Icon from '../../../../components/icon';
import Textarea from '../../../../components/ui/Textarea';
import { adminService } from '../../../../services/adminService';
import '../../../../assets/styles/CreateNewRoleModal.css';

const PERMISSIONS = [
  { id: 'users',    label: 'Users',               icon: Icon.Users,       perms: ['users.read', 'users.write'] },
  { id: 'roles',    label: 'Roles & Permissions', icon: Icon.ShieldCheck, perms: ['roles.read', 'roles.write'] },
  { id: 'clients',  label: 'Clients',             icon: Icon.LayoutGrid,  perms: ['clients.read', 'clients.write'] },
  { id: 'settings', label: 'System Settings',     icon: Icon.Settings,    perms: ['settings.read', 'settings.write'] },
  { id: 'logs',     label: 'Audit Logs',          icon: Icon.ScrollText,  perms: ['logs.view'] },
];

const ALL_PERMS = PERMISSIONS.flatMap(g => g.perms);

function emptyChecked() {
  const init = {};
  ALL_PERMS.forEach(p => (init[p] = false));
  return init;
}

export default function CreateNewRoleModal({ isOpen, onClose, role, onSave }) {
  const isEdit = !!role;

  const [roleName, setRoleName]       = useState('');
  const [description, setDescription] = useState('');
  const [checked, setChecked]         = useState(emptyChecked);
  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setRoleName(role?.name ?? '');
    setDescription(role?.description ?? '');

    if (!isEdit) {
      setChecked(emptyChecked());
      return;
    }

    setLoading(true);
    adminService.listRolePermissions(role.id)
      .then(list => {
        const next = emptyChecked();
        (list ?? []).forEach(rp => {
          if (rp.permissionCode in next) next[rp.permissionCode] = true;
        });
        setChecked(next);
      })
      .catch(() => setChecked(emptyChecked()))
      .finally(() => setLoading(false));
  }, [isOpen, isEdit, role?.id]);

  const toggle = (perm) => setChecked(prev => ({ ...prev, [perm]: !prev[perm] }));

  const handleSave = async () => {
    if (!roleName.trim() || saving) return;
    setSaving(true);

    const savedRole = {
      id:          isEdit ? role.id : undefined,
      name:        roleName.trim(),
      description: description.trim(),
      type:        isEdit ? role.type : 'CUSTOM',
      permissionCodes: ALL_PERMS.filter(p => checked[p]),
    };

    try {
      if (onSave) await onSave(savedRole, isEdit);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay modal fade show d-block" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content modal-content-custom border-0 shadow-lg">

          <div className="modal-header border-bottom px-4 pt-4 pb-3 d-flex align-items-start bg-gray">
            <div>
              <h5 className="modal-title-custom fw-bold mb-1">
                {isEdit ? 'Edit Role' : 'Create New Role'}
              </h5>
              <p className="modal-subtitle mb-0 text-muted">
                Configure permissions for this access level.
              </p>
            </div>
            <button
              onClick={onClose}
              className="modal-close-btn btn btn-link ms-auto p-0 text-secondary shadow-none"
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body px-4 py-4">

            <p className="section-label text-uppercase fw-bold mb-3">
              Basic Information
            </p>

            <div className="mb-3">
              <label className="form-label-custom form-label fw-semibold">
                Role Name
              </label>
              <input
                type="text"
                className="input-underline form-control"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                placeholder="e.g. Financial Analyst"
              />
            </div>

            <div className="mb-4">
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <Icon.Shield size={16} color="var(--status-active)" />
              <p className="section-label text-uppercase fw-bold mb-0">
                Permissions Matrix
              </p>
              {loading && (
                <span className="text-muted ms-2" style={{ fontSize: 12 }}>loading…</span>
              )}
            </div>

            <div className="row g-3">
              {PERMISSIONS.map(group => {
                const IconComponent = group.icon;
                return (
                  <div
                    key={group.id}
                    className={group.id === 'logs' ? 'col-12' : 'col-md-6'}
                  >
                    <div className="permission-card p-3 rounded-3 border">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <IconComponent size={16} className="permission-icon" />
                        <span className="permission-label-text fw-semibold">
                          {group.label}
                        </span>
                      </div>
                      <div className="permission-options">
                        {group.perms.map(perm => (
                          <label key={perm} htmlFor={perm} className="permission-option">
                            <input
                              type="checkbox"
                              id={perm}
                              className="permission-checkbox form-check-input mt-0"
                              checked={checked[perm] || false}
                              onChange={() => toggle(perm)}
                              disabled={loading || saving}
                            />
                            <span className="permission-perm-label">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="btn btn-link text-dark fw-bold text-decoration-none shadow-none px-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading || !roleName.trim()}
              className="btn-create-role btn fw-bold px-4 py-2 rounded-3"
            >
              {saving ? 'Saving…' : (isEdit ? 'Save Role' : 'Create Role')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
