import { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../../../components/ui/Button';
import { useToast } from '../../../../hooks/useToast';
import { adminService } from '../../../../services/adminService';
import '../../../../assets/styles/CreateIdentityModal.css';

export default function CreateIdentityModal({ isOpen, onClose, onSuccess }) {
  const toast = useToast();
  const [formData, setFormData] = useState({ email: '', password: '', displayName: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await adminService.createIdentity({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || undefined,
      });
      toast.success('Identity created successfully!');
      onSuccess?.(created);
      onClose();
      setFormData({ email: '', password: '', displayName: '' });
    } catch (err) {
      toast.error(err.body?.message ?? 'Failed to create identity.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Identity</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="modal-desc">
          Provision a new identity within the Sovereign IDP.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              placeholder="Full name (optional)"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="user@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Temporary Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <small>Must be at least 12 characters and include a symbol.</small>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create Identity'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
