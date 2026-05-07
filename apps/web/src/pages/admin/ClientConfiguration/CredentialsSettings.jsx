import React from 'react';
import Icon from '../../../components/icon';
import '../../../assets/styles/ClientConfiguration.css';

const GeneralSettings = ({ client }) => {
  return (
    <div className="config-card">
      {/* Header */}
      <div className="config-card__header">
        <div className="config-card__icon">
          <Icon.HelpCircle size={20} />
        </div>
        <h2 className="config-card__title">General Settings</h2>
      </div>

      {/* Application Name */}
      <div className="mb-4">
        <label className="config-label">Application Name</label>
        <input
          type="text"
          className="config-input"
          placeholder="e.g. Acme Marketing Portal"
          defaultValue={client?.name || ''}
        />
        <p className="config-input-hint">The identifier displayed to end-users during authorization.</p>
      </div>

      {/* Redirect URIs */}
      <div>
        <div className="config-uri-header">
          <label className="config-label" style={{ margin: 0 }}>Redirect URIs</label>
          <button className="config-uri-add">
            <Icon.Plus size={14} />
            Add URI
          </button>
        </div>

        <div className="config-uri-row">
          <input
            type="text"
            className="config-input"
            defaultValue="https://app.acme.com/auth/callback"
          />
          <button className="config-uri-delete">
            <Icon.Trash2 size={18} />
          </button>
        </div>

        <div className="config-uri-row">
          <input
            type="text"
            className="config-input"
            defaultValue="https://localhost:3000/callback"
          />
          <button className="config-uri-delete">
            <Icon.Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;