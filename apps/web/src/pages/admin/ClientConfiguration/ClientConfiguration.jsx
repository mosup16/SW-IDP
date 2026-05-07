import React, { useState } from 'react';
import Icon from '../../../components/icon';
import GeneralSettings from './GeneralSettings';
import CredentialsSettings from './CredentialsSettings';
import SecurityStandards from './SecurityStandards';
import QuickHelp from './QuickHelp';
import SecretRotationModal from '../modals/SecretRotationModal/SecretRotationModal';
import '../../../assets/styles/ClientConfiguration.css';

const ClientConfiguration = ({ client, onBack }) => {
  const [isSecretOpen, setIsSecretOpen] = useState(false);

  return (
    <div className="p-5">
      {/* Breadcrumb */}
      <div className="config-breadcrumb">
        <span className="config-breadcrumb__link" onClick={onBack}>Clients</span>
        <Icon.ChevronRight size={12} />
        <span className="config-breadcrumb__current">
          {client?.name ? 'Edit Client' : 'Create New Client'}
        </span>
      </div>

      <h1 className="config-title">Client Configuration</h1>

      <div className="row g-4">
        {/* Left column */}
        <div className="col-lg-8">
          <CredentialsSettings onReveal={() => setIsSecretOpen(true)} />
          <GeneralSettings client={client} />
          
          
          
        </div>

        {/* Right column */}
        <div className="col-lg-4">
          <SecurityStandards />
          <QuickHelp />
      
        </div>
      </div>

      {/* Footer */}
      <div className="config-footer">
        <button className="config-footer__save" onClick={onBack}>Save Changes</button>
        <button className="config-footer__cancel" onClick={onBack}>Cancel</button>
      </div>

      <SecretRotationModal
        isOpen={isSecretOpen}
        onClose={() => setIsSecretOpen(false)}
        appName={client?.name || 'Monolith_Production_App'}
        newSecret="sec_v2_98fHk2mPqL5vXyNw8R..."
      />
    </div>
  );
};

export default ClientConfiguration;
