import React from 'react';
import Icon from '../../../components/icon';
import '../../../assets/styles/ClientConfiguration.css';

const CredentialsSettings = ({ onReveal }) => {
  return (
    <div className="config-card">
      {/* Header */}
      <div className="config-card__header">
        <div className="config-card__icon">
          <Icon.Shield size={20} />
        </div>
        <h2 className="config-card__title">Credentials</h2>
      </div>
      <p className="config-card__subtitle">
        Generated credentials must be stored securely. The secret will not be visible again.
      </p>

      {/* Client ID & Secret grid */}
      <div className="config-credentials-grid">
        {/* Client ID */}
        <div>
          <label className="config-label">Client ID</label>
          <div className="config-credentials-input-wrap">
            <input
              type="text"
              className="config-input config-input--readonly"
              defaultValue="svc_782349012390"
              readOnly
            />
            <button className="config-credentials-action">
              <Icon.Copy size={18} />
            </button>
          </div>
        </div>

        {/* Client Secret */}
        <div>
          <label className="config-label">Client Secret</label>
          <div className="config-credentials-input-wrap">
            <input
              type="text"
              className="config-input config-input--readonly"
              defaultValue="••••••••••••••••••••••••"
              readOnly
            />
            <button className="config-credentials-action" onClick={onReveal}>
              REVEAL
            </button>
          </div>
        </div>
      </div>

      {/* Warning banner */}
      <div className="config-warning">
        <Icon.Warning size={18} />
        <span>
          <strong>Copy your secret now.</strong> Once you navigate away or save, it will be hashed and hidden forever.
        </span>
      </div>
    </div>
  );
};

export default CredentialsSettings;