import React, { useState, useMemo } from 'react';
import ClientHeader from './ClientHeader';
import ClientTable from './ClientTable';
import { clients as ALL_CLIENTS } from './clients';
import DeleteClientPopup from '../modals/DeleteClientPopup/DeleteClientPopup';
import SecretRotationModal from '../modals/SecretRotationModal/SecretRotationModal';
import ClientConfiguration from '../ClientConfiguration/ClientConfiguration';

const ClientManagement = () => {
  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState('all');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;


  const filteredClients = useMemo(() => {
    return ALL_CLIENTS.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.clientId.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all' || client.type.toLowerCase() === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
  const exportData = filteredClients.map(({ name, type, clientId, redirectUris, createdAt }) => ({
    Name: name,
    Type: type,
    'Client ID': clientId,
    'Redirect URIs': redirectUris.join(' | '),
    'Created At': createdAt,
  }));

  
  const handleDeleteClick    = (client) => { setSelectedClient(client); setIsDeleteOpen(true); };
  const handleSecretClick    = (client) => { setSelectedClient(client); setIsSecretOpen(true); };
  const handleEditClick      = (client) => { setEditingClient(client); };
  const handleCreateClick    = ()       => { setEditingClient({}); };
  const handleBackFromConfig = ()       => { setEditingClient(null); };

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
        totalClients={ALL_CLIENTS.length}
        onCreateClick={handleCreateClick}
      />

      <ClientTable
        clients={paginatedClients}
        totalCount={ALL_CLIENTS.length}
        totalClients={filteredClients.length}
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        exportData={exportData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onCreateClick={handleCreateClick}
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