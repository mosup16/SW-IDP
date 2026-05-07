import React, { useState } from 'react';
import ClientHeader from './ClientHeader';
import ClientTable from './ClientTable';
import { clients } from './clients';
import DeleteClientPopup from '../modals/DeleteClientPopup/DeleteClientPopup';
import SecretRotationModal from '../modals/SecretRotationModal/SecretRotationModal';
import ClientConfiguration from '../ClientConfiguration/ClientConfiguration';

const ClientManagement = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setIsDeleteOpen(true);
  };

  const handleSecretClick = (client) => {
    setSelectedClient(client);
    setIsSecretOpen(true);
  };

  const handleEditClick = (client) => {
    setEditingClient(client);
  };

  const handleCreateClick = () => {
    setEditingClient({});
  };

  const handleBackFromConfig = () => {
    setEditingClient(null);
  };

  if (editingClient !== null) {
    return (
      <ClientConfiguration
        client={editingClient}
        onBack={handleBackFromConfig}
      />
    );
  }

  return (
    <div className="p-5">
      <ClientHeader
        totalClients={61}
        onCreateClick={handleCreateClick}
      />
      <ClientTable
        clients={clients}
        onDeleteClick={handleDeleteClick}
        onSecretRotateClick={handleSecretClick}
        onEditClick={handleEditClick}
      />

      <DeleteClientPopup
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        clientName={selectedClient?.name || ''}
        clientId={selectedClient?.clientId || ''}
        activeTokens="12"
      />

      <SecretRotationModal
        isOpen={isSecretOpen}
        onClose={() => setIsSecretOpen(false)}
        appName={selectedClient?.name || ''}
        newSecret="sec_v2_98fHk2mPqL5vXyNw8R..."
      />
    </div>
  );
};

export default ClientManagement;