import { Shield, Copy, AlertTriangle } from "lucide-react";

export default function CredentialsSettings({ onReveal }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex align-items-center gap-3 mb-1">
        <div className="cc-card-icon d-flex align-items-center justify-content-center rounded-circle border text-primary flex-shrink-0">
          <Shield size={20} />
        </div>
        <h2 className="fs-5 fw-bold text-primary mb-0">Credentials</h2>
      </div>
      <p className="text-secondary small mb-4">
        Generated credentials must be stored securely. The secret will not be visible again.
      </p>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="cc-sublabel d-block mb-2">Client ID</label>
          <div className="position-relative">
            <input
              type="text"
              readOnly
              defaultValue="svc_782349012390"
              className="form-control pe-5 bg-white"
            />
            <button className="btn btn-link p-0 text-secondary d-flex position-absolute top-50 end-0 translate-middle-y me-2">
              <Copy size={18} />
            </button>
          </div>
        </div>
        <div className="col-6">
          <label className="cc-sublabel d-block mb-2">Client Secret</label>
          <div className="position-relative">
            <input
              type="text"
              readOnly
              defaultValue="••••••••••••••••••••••••"
              className="form-control pe-5 bg-white"
            />
            <button
              onClick={onReveal}
              className="btn btn-link p-0 text-secondary small fw-bold position-absolute top-50 end-0 translate-middle-y me-2 text-decoration-none"
              style={{ letterSpacing: "0.4px" }}
            >
              REVEAL
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 cc-alert-danger rounded-2 px-3 py-3">
        <span className="text-danger flex-shrink-0 d-flex">
          <AlertTriangle size={18} />
        </span>
        <span className="text-danger small fw-semibold">
          <strong>Copy your secret now.</strong> Once you navigate away or save, it will be hashed and hidden forever.
        </span>
      </div>
    </div>
  );
}