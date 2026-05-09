import { Info, Plus, Trash2 } from "lucide-react";

export default function GeneralSettings({
  name,
  onNameChange,
  type,
  onTypeChange,
  clientId,
  uris,
  onAddUri,
  onRemoveUri,
  onUpdateUri,
}) {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="cc-card-icon d-flex align-items-center justify-content-center rounded-circle border text-primary flex-shrink-0">
          <Info size={20} />
        </div>
        <h2 className="fs-5 fw-bold text-primary mb-0">General Settings</h2>
      </div>

      <div className="mb-4">
        <label className="cc-sublabel d-block mb-2">Application Name</label>
        <input
          type="text"
          placeholder="e.g. Acme Marketing Portal"
          className="cc-input form-control"
          value={name}
          onChange={e => onNameChange(e.target.value)}
        />
        <p className="text-secondary small mt-2 mb-0">
          The identifier displayed to end-users during authorization.
        </p>
      </div>

      <div className="mb-4">
        <label className="cc-sublabel d-block mb-2">Client ID</label>
        <input
          type="text"
          className="cc-input form-control bg-light"
          value={clientId}
          readOnly
        />
        <p className="text-secondary small mt-2 mb-0">
          Auto-generated unique identifier for this client.
        </p>
      </div>

      <div className="mb-4">
        <label className="cc-sublabel d-block mb-2">Client Type</label>
        <select
          className="cc-input form-select"
          value={type}
          onChange={e => onTypeChange(e.target.value)}
        >
          <option value="confidential">Confidential</option>
          <option value="public">Public</option>
          <option value="machine">Machine-to-Machine</option>
        </select>
        <p className="text-secondary small mt-2 mb-0">
          Determines how the client authenticates with the authorization server.
        </p>
      </div>

      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="cc-sublabel mb-0">Redirect URIs</label>
          <button
            onClick={onAddUri}
            className="btn btn-link p-0 text-primary fw-bold small d-flex align-items-center gap-1 text-decoration-none"
          >
            <Plus size={14} strokeWidth={2.5} /> Add URI
          </button>
        </div>
        {uris.map((uri, i) => (
          <div key={i} className="position-relative mb-2">
            <input
              type="text"
              value={uri}
              onChange={e => onUpdateUri(i, e.target.value)}
              className="cc-input form-control pe-5"
            />
            <button
              onClick={() => onRemoveUri(i)}
              className="btn btn-link p-0 text-danger d-flex position-absolute top-50 end-0 translate-middle-y me-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}