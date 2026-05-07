import React from 'react';
import Icon from '../../../components/icon';

const ClientHeader = ({ totalClients, onCreateClick }) => {
  return (
    <div className="d-flex align-items-start justify-content-between mb-4">
      {/* Left: title + subtitle */}
      <div>
        <h1 className="fw-bold mb-1" style={{ fontSize: '28px', color: '#141414' }}>
          Client Applications
        </h1>
        <p className="text-secondary mb-0" style={{ fontSize: '14px' }}>
          Manage OAuth2 and OIDC application credentials and scopes.
        </p>
      </div>

      {/* Right: total clients + button */}
      <div className="d-flex align-items-center gap-3">
        {/* Total Clients box */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-2"
            style={{ width: '34px', height: '34px', background: '#e8f0fe' }}
          >
            <Icon.LayoutGrid size={16} style={{ color: '#1677ff' }} />
          </div>
          <div>
            <div className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Total Clients
            </div>
            <div className="fw-bold" style={{ fontSize: '18px', lineHeight: 1.1 }}>
              {totalClients}
            </div>
          </div>
        </div>

        {/* Create button */}
        <button
          className="btn d-flex align-items-center gap-2 fw-bold"
          style={{
            background: '#000000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
          }}
          onClick={onCreateClick}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
          Create New Client
        </button>
      </div>
    </div>
  );
};

export default ClientHeader;
