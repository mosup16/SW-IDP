import { useState } from 'react';
import Button from '../../../../components/ui/Button';
import { useToast } from '../../../../hooks/useToast';
import '../../../../assets/styles/CreateIdentityModal.css';

export default function CreateIdentityModal({ isOpen, onClose }) {
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    sendEmail: true
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Identity created successfully!");
      
      onClose();
      setFormData({ email: '', password: '', sendEmail: true });
      setLoading(false);
    }, 700);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Identity</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="modal-desc">
          Provision a new identity within the Sovereign IDP. 
          An invitation will be dispatched securely.
        </p>

        <form onSubmit={handleSubmit}>
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

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.sendEmail}
              onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
            />
            Send invite email
          </label>

          <div className="modal-footer">
            <Button 
              variant="secondary" 
              type="button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Identity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}