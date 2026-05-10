import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../../components/icon';
import Button from '../../../../components/ui/Button';
import { Switch } from '../../../../components/ui/Switch';
import { useToast } from '../../../../hooks/useToast';
import { useAuth } from '../../../../hooks/useAuth';
import { adminService } from '../../../../services/adminService';
import '../../../../assets/styles/EditIdentityModal.css';

export default function EditIdentityModal({ isOpen, onClose, identity, onSaved }) {
  const toast = useToast();
  const { currentUser } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState('ENABLED');
  const [allRoles, setAllRoles] = useState([]);
  const [assignedRoleIds, setAssignedRoleIds] = useState(new Set());
  const [pendingRoleId, setPendingRoleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyRoleId, setBusyRoleId] = useState(null);

  useEffect(() => {
    if (!isOpen || !identity) return;
    setDisplayName(identity.displayName ?? '');
    setStatus(identity.status ?? 'ENABLED');
    setLoading(true);
    Promise.all([
      adminService.listRoles().catch(() => []),
      adminService.listIdentityRoles(identity.id).catch(() => []),
    ]).then(([roles, identityRoles]) => {
      setAllRoles(Array.isArray(roles) ? roles : []);
      setAssignedRoleIds(new Set((identityRoles ?? []).map(r => r.roleId)));
    }).finally(() => setLoading(false));
  }, [isOpen, identity]);

  if (!isOpen || !identity) return null;

  const assignedRoles = allRoles.filter(r => assignedRoleIds.has(r.id));
  const availableRoles = allRoles.filter(r => !assignedRoleIds.has(r.id));

  async function handleAssign() {
    if (!pendingRoleId) return;
    setBusyRoleId(pendingRoleId);
    try {
      await adminService.assignRoleToIdentity({
        identityId: identity.id,
        roleId: pendingRoleId,
        assignedBy: currentUser?.identityId,
      });
      setAssignedRoleIds(prev => new Set(prev).add(pendingRoleId));
      setPendingRoleId('');
    } catch (err) {
      toast.error(err.body?.message ?? 'Failed to assign role.');
    } finally {
      setBusyRoleId(null);
    }
  }

  async function handleRemove(roleId) {
    setBusyRoleId(roleId);
    try {
      await adminService.removeRoleFromIdentity({
        identityId: identity.id,
        roleId,
      });
      setAssignedRoleIds(prev => {
        const next = new Set(prev);
        next.delete(roleId);
        return next;
      });
    } catch (err) {
      toast.error(err.body?.message ?? 'Failed to remove role.');
    } finally {
      setBusyRoleId(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await adminService.updateIdentity(identity.id, {
        displayName: displayName.trim() || null,
        status,
      });
      toast.success('Identity updated.');
      onSaved?.(updated);
      onClose();
    } catch (err) {
      toast.error(err.body?.message ?? 'Failed to update identity.');
    } finally {
      setSaving(false);
    }
  }

  const isDirty =
    displayName !== (identity.displayName ?? '') ||
    status !== (identity.status ?? 'ENABLED');

  return createPortal(
    <div className="edit-identity-modal__overlay" onClick={onClose}>
      <div className="edit-identity-modal__dialog" onClick={e => e.stopPropagation()} data-cy="edit-identity-modal">
        <div className="edit-identity-modal__header">
          <div>
            <h2 className="edit-identity-modal__title">Edit Identity</h2>
            <p className="edit-identity-modal__subtitle">Update profile, access status, and assigned roles.</p>
          </div>
          <button className="edit-identity-modal__close" onClick={onClose} aria-label="Close">
            <Icon.X size={20} />
          </button>
        </div>

        <div className="edit-identity-modal__body">

          <section className="edit-identity-modal__section">
            <p className="edit-identity-modal__section-label">Profile</p>

            <div className="edit-identity-modal__field">
              <label>Email</label>
              <input
                type="email"
                value={identity.email}
                disabled
                className="edit-identity-modal__input edit-identity-modal__input--readonly"
              />
              <small className="edit-identity-modal__hint">Email cannot be changed.</small>
            </div>

            <div className="edit-identity-modal__field">
              <label htmlFor="edit-identity-display-name">Display Name</label>
              <input
                id="edit-identity-display-name"
                data-cy="edit-identity-display-name"
                type="text"
                placeholder="Full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="edit-identity-modal__input"
              />
            </div>

            <div className="edit-identity-modal__field">
              <label>Access Status</label>
              <div className="edit-identity-modal__status-row" data-cy="edit-identity-status-row">
                <Switch
                  id="edit-identity-status"
                  checked={status === 'ENABLED'}
                  onCheckedChange={(checked) => setStatus(checked ? 'ENABLED' : 'DISABLED')}
                  label={status === 'ENABLED' ? 'Active' : 'Disabled'}
                />
              </div>
            </div>
          </section>

          <section className="edit-identity-modal__section">
            <div className="edit-identity-modal__section-header">
              <p className="edit-identity-modal__section-label">Assigned Roles</p>
              <span className="edit-identity-modal__count">
                {loading ? '…' : `${assignedRoles.length} assigned`}
              </span>
            </div>

            {loading ? (
              <p className="edit-identity-modal__empty">Loading roles…</p>
            ) : (
              <>
                {assignedRoles.length === 0 ? (
                  <p className="edit-identity-modal__empty">No roles assigned yet.</p>
                ) : (
                  <ul className="edit-identity-modal__role-list" data-cy="assigned-role-list">
                    {assignedRoles.map(role => (
                      <li key={role.id} className="edit-identity-modal__role-chip" data-cy={`assigned-role-${role.id}`}>
                        <Icon.Shield size={14} />
                        <span className="edit-identity-modal__role-name">{role.name}</span>
                        <button
                          type="button"
                          className="edit-identity-modal__role-remove"
                          onClick={() => handleRemove(role.id)}
                          disabled={busyRoleId === role.id}
                          aria-label={`Remove role ${role.name}`}
                          data-cy={`remove-role-${role.id}`}
                        >
                          <Icon.X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="edit-identity-modal__assign-row">
                  <select
                    className="edit-identity-modal__select"
                    value={pendingRoleId}
                    onChange={(e) => setPendingRoleId(e.target.value)}
                    disabled={availableRoles.length === 0 || busyRoleId !== null}
                    data-cy="role-picker"
                  >
                    <option value="">
                      {availableRoles.length === 0 ? 'No more roles available' : 'Select a role to assign…'}
                    </option>
                    {availableRoles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}{role.type ? ` · ${role.type}` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="edit-identity-modal__assign-btn"
                    onClick={handleAssign}
                    disabled={!pendingRoleId || busyRoleId !== null}
                    data-cy="assign-role-btn"
                  >
                    <Icon.Plus size={14} />
                    Assign
                  </button>
                </div>
              </>
            )}
          </section>
        </div>

        <div className="edit-identity-modal__footer">
          <Button variant="secondary" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!isDirty || saving} data-cy="save-identity-btn">
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
