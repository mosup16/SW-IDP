import { useState } from "react";
import { CheckCircle2, Copy, AlertTriangle } from "lucide-react";
import GeneralSettings     from "./GeneralSettings";
import CredentialsSettings from "./CredentialsSettings";
import SecurityStandards   from "./SecurityStandards";
import QuickHelp           from "./QuickHelp";
import "../../../assets/styles/ClientConfiguration.css";

// ── Secret Rotation Modal ────────────────────────────────────────────────────
const SecretModal = ({ isOpen, onClose, appName, newSecret }) => {
  if (!isOpen) return null;
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
            <button className="btn btn-link p-0 text-secondary d-flex">
              <Copy size={18} />
            </button>
          </div>
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

// ── Main Component ───────────────────────────────────────────────────────────
// ✅ Now correctly accepts `client` and `onBack` props from ClientManagement
export default function ClientConfiguration({ client = {}, onBack }) {
  const isEditing = client && client.id;

  const [modalOpen, setModalOpen] = useState(false);
  const [appName, setAppName]     = useState(client?.name || "");
  const [uris, setUris]           = useState(
    client?.redirectUris?.filter(u => !u.startsWith('+')) || [
      "https://app.acme.com/auth/callback",
      "https://localhost:3000/callback",
    ]
  );

  const addUri    = ()       => setUris(prev => [...prev, ""]);
  const removeUri = (i)      => setUris(prev => prev.filter((_, idx) => idx !== i));
  const updateUri = (i, val) => setUris(prev => prev.map((u, idx) => idx === i ? val : u));

  // ✅ Save Changes handler — extend with your API call as needed
  const handleSave = () => {
    const payload = {
      ...(isEditing ? { id: client.id } : {}),
      name: appName,
      redirectUris: uris.filter(u => u.trim() !== ""),
    };
    console.log(isEditing ? "Updating client:" : "Creating client:", payload);
    // TODO: call your API, then navigate back on success
    if (onBack) onBack();
  };

  // ✅ Cancel navigates back to the client list
  const handleCancel = () => {
    if (onBack) onBack();
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-xl py-4 px-4">

        {/* Breadcrumb */}
        <nav className="cc-breadcrumb d-flex align-items-center gap-1 mb-2 text-uppercase fw-semibold">
          <span
            className="text-secondary"
            style={{ cursor: "pointer" }}
            onClick={handleCancel}   // ✅ clicking "Clients" also goes back
          >
            Clients
          </span>
          <span className="cc-breadcrumb__sep text-secondary">›</span>
          <span className="text-dark">
            {isEditing ? `Edit: ${client.name}` : "Create New Client"}
          </span>
        </nav>

        <h1 className="fw-bold text-dark mb-4 fs-2">Client Configuration</h1>

        <div className="row g-4 align-items-start">

          {/* Left Column */}
          <div className="col">
            <GeneralSettings
              appName={appName}
              onAppNameChange={setAppName}
              uris={uris}
              onAddUri={addUri}
              onRemoveUri={removeUri}
              onUpdateUri={updateUri}
            />
            <CredentialsSettings onReveal={() => setModalOpen(true)} />
          </div>

          {/* Right Column */}
          <div className="col-auto" style={{ width: 340 }}>
            <SecurityStandards />
            <QuickHelp />
          </div>

        </div>

        {/* ✅ Footer buttons are now wired up */}
        <div className="d-flex justify-content-end gap-3 mt-5">
          <button
            className="btn btn-outline-secondary px-5 py-3 fw-semibold rounded-3"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-dark px-5 py-3 fw-semibold rounded-3"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>

      </div>

      <SecretModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appName={appName || "this client"}
        newSecret="sec_v2_98fHk2mPqL5vXyNw8R..."
      />
    </div>
  );
}