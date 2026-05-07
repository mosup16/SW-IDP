// src/features/roles/modals/CreateNewRoleModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import Icon from '../../../components/icon.js';
import Textarea from '../../../components/ui/Textarea.jsx';
import { useToast } from '../../../context/ToastContext';
import '../../../assets/styles/CreateNewRoleModal.css';

export default function CreateNewRoleModal({ isOpen, onClose, role }) {
  const isEdit = !!role;
  const { showToast } = useToast();

  const PERMISSIONS = [
    {
      id: 'users',
      label: 'Users',
      icon: Icon.Users,
      perms: ['users.read', 'users.write'],
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Icon.LayoutGrid,
      perms: ['clients.read', 'clients.manage'],
    },
    {
      id: 'logs',
      label: 'System Logs',
      icon: Icon.ScrollText,
      perms: ['logs.view', 'logs.export'],
    },
  ];

  const [checked, setChecked] = useState(() => {
    const init = {};
    PERMISSIONS.forEach(g => g.perms.forEach(p => (init[p] = false)));
    if (isEdit) {
      init['users.read'] = true;
      init['clients.read'] = true;
      init['logs.view'] = true;
    }
    return init;
  });

  const toggle = (perm) => setChecked(prev => ({ ...prev, [perm]: !prev[perm] }));

  const handleSubmit = () => {
    showToast({
      message: isEdit ? 'Save Role saved' : 'Role created successfully',
      type: 'success',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay modal fade show d-block"
      onClick={onClose}
    >
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
                defaultValue={isEdit ? role.name : ''}
                placeholder="e.g. Financial Analyst"
              />
            </div>

            <div className="mb-4">
              <Textarea />
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <Icon.Shield size={16} color="var(--status-active)" />
              <p className="section-label text-uppercase fw-bold mb-0">
                Permissions Matrix
              </p>
            </div>

            <div className="row g-3">
              {PERMISSIONS.map(group => (
                <div
                  key={group.id}
                  className={group.id === 'logs' ? 'col-12' : 'col-md-6'}
                >
                  <div className="permission-card p-3 rounded-3 border">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <group.icon size={16} className="permission-icon" />
                      <span className="permission-label-text fw-semibold">
                        {group.label}
                      </span>
                    </div>
                    <div className="row g-2">
                      {group.perms.map(perm => (
                        <div key={perm} className="col-6 d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            id={perm}
                            className="permission-checkbox form-check-input mt-0"
                            checked={checked[perm]}
                            onChange={() => toggle(perm)}
                          />
                          <label
                            htmlFor={perm}
                            className="permission-perm-label mb-0"
                          >
                            {perm}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-3">
            <button
              onClick={onClose}
              className="btn btn-link text-dark fw-bold text-decoration-none shadow-none px-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn-create-role btn fw-bold px-4 py-2 rounded-3"
            >
              {isEdit ? 'Save Role' : 'Create Role'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}