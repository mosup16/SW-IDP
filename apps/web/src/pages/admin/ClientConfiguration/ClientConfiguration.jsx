import { useState } from "react";
import { CheckCircle2, Copy, AlertTriangle } from "lucide-react";
import GeneralSettings     from "./GeneralSettings";
import CredentialsSettings from "./CredentialsSettings";
import SecurityStandards   from "./SecurityStandards";
import QuickHelp           from "./QuickHelp";
import "../../../assets/styles/ClientConfiguration.css";

const SecretModal = ({ isOpen, onClose, appName, newSecret }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(newSecret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
    >
      <div className="cc-modal bg-white rounded-4 p-5 text-center shadow-lg">
        <div className="cc-modal__icon rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-4">
          <CheckCircle2 size={36} color="white" strokeWidth={2.5} />
        </div>

        <h2 className="fs-4 fw-bold text-dark mb-2">Client Secret Rotated</h2>
        <p className="text-secondary mb-4">
          The secret for <strong>{appName}</strong> has been successfully updated.
        </p>

        <div className="bg-light rounded-3 p-3 mb-3 text-start">
          <div className="cc-sublabel mb-2">New Client Secret</div>
          <div className="d-flex align-items-center gap-2 bg-white border rounded-2 px-3 py-2">
            <span className="flex-grow-1 font-monospace small text-dark">{newSecret}</span>
            <button className="btn btn-link p-0 text-secondary d-flex" onClick={handleCopy}>
              <Copy size={18} />
            </button>
          </div>
          {copied && (
            <p style={{ fontSize: '12px', color: 'green', marginTop: '4px' }}>
              Copied to clipboard!
            </p>
          )}
        </div>

        <div className="d-flex align-items-start gap-2 cc-alert-danger rounded-2 p-3 mb-4 text-start">
          <span className="text-danger flex-shrink-0 d-flex mt-1">
            <AlertTriangle size={18} />
          </span>
          <span className="small text-danger">
            <strong>Copy this secret now.</strong> It will not be shown again. If you lose it, you will need to generate a new one.
          </span>
        </div>

        <button onClick={onClose} className="btn btn-dark w-100 py-3 fw-semibold rounded-3">
          I have saved it
        </button>
      </div>
    </div>
  );
};

export default function ClientConfiguration({ client, onBack, onSave }) {
  const isEdit = client && Object.keys(client).length > 0;

  const [name, setName]           = useState(isEdit ? client.name              : '');
  const [type, setType]           = useState(isEdit ? client.type              : 'confidential');
  const [clientId]                = useState(isEdit ? client.clientId          : 'client_' + Date.now());
  const [uris, setUris]           = useState(
    isEdit && client.redirectUris?.length
      ? client.redirectUris
      : ['https://app.acme.com/auth/callback', 'https://localhost:3000/callback']
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [newSecret, setNewSecret] = useState('');

  const addUri    = ()       => setUris(prev => [...prev, '']);
  const removeUri = (i)      => setUris(prev => prev.filter((_, idx) => idx !== i));
  const updateUri = (i, val) => setUris(prev => prev.map((u, idx) => idx === i ? val : u));

  const generateSecret = () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return 'sec_' + btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const handleReveal = () => {
    const generated = generateSecret();
    setNewSecret(generated);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (!isEdit && !newSecret) return;

    const secretForRequest = newSecret || generateSecret();

    const savedClient = {
      ...(isEdit ? client : {}),
      clientId,
      name:         name.trim(),
      type,
      clientSecret: secretForRequest,
      redirectUris: uris.filter(u => u.trim() !== ''),
      createdAt:    isEdit ? client.createdAt : new Date().toISOString().split('T')[0],
      ...(isEdit ? {} : {
        status:        'active',
        assignedUsers: 0,
      }),
    };

    if (onSave) onSave(savedClient, isEdit);
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-xl py-4 px-4">

        <nav className="cc-breadcrumb d-flex align-items-center gap-1 mb-2 text-uppercase fw-semibold">
          <span
            className="text-secondary"
            style={{ cursor: 'pointer' }}
            onClick={onBack}
          >
            Clients
          </span>
          <span className="cc-breadcrumb__sep text-secondary">›</span>
          <span className="text-dark">{isEdit ? 'Edit Client' : 'Create New Client'}</span>
        </nav>

        <h1 className="fw-bold text-dark mb-4 fs-2">Client Configuration</h1>

        <div className="row g-4 align-items-start">
          <div className="col">
            <GeneralSettings
              name={name}
              onNameChange={setName}
              type={type}
              onTypeChange={setType}
              clientId={clientId}
              uris={uris}
              onAddUri={addUri}
              onRemoveUri={removeUri}
              onUpdateUri={updateUri}
            />
            <CredentialsSettings onReveal={handleReveal} />
          </div>

          <div className="col-auto" style={{ width: 340 }}>
            <SecurityStandards />
            <QuickHelp />
          </div>

        </div>

        <div className="d-flex justify-content-end gap-3 mt-5">
          <button
            className="btn btn-outline-secondary px-5 py-3 fw-semibold rounded-3"
            onClick={onBack}
          >
            Cancel
          </button>
          <button
            className="btn btn-dark px-5 py-3 fw-semibold rounded-3"
            onClick={handleSave}
          >
            {isEdit ? 'Save Changes' : 'Create Client'}
          </button>
        </div>

      </div>

      <SecretModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appName={name || 'New Client'}
        newSecret={newSecret}
      />
    </div>
  );
}