import React, { useState, useMemo } from 'react';
import ClientHeader from './ClientHeader';
import ClientTable from './ClientTable';
import { clients as STATIC_CLIENTS } from './clients';
import DeleteClientPopup from '../modals/DeleteClientPopup/DeleteClientPopup';
import SecretRotationModal from '../modals/SecretRotationModal/SecretRotationModal';
import ClientConfiguration from '../ClientConfiguration/ClientConfiguration';

const ClientManagement = () => {
  const [clients, setClients]               = useState(STATIC_CLIENTS);
  const [search, setSearch]                 = useState('');
  const [filter, setFilter]                 = useState('all');
  const [isDeleteOpen, setIsDeleteOpen]     = useState(false);
  const [isSecretOpen, setIsSecretOpen]     = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient]   = useState(null);
  const [currentPage, setCurrentPage]       = useState(1);
  const [newSecret, setNewSecret]           = useState('');

  const itemsPerPage = 4;

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.clientId.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all' || client.type.toLowerCase() === filter;
      return matchesSearch && matchesFilter;
    });
  }, [clients, search, filter]);

  const totalPages       = Math.ceil(filteredClients.length / itemsPerPage);
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

  const handleDeleteClick  = (client) => { setSelectedClient(client); setIsDeleteOpen(true); };
  const handleSecretClick  = (client) => {
    setSelectedClient(client);
    const generated = 'sec_v2_' + Math.random().toString(36).substring(2, 18).toUpperCase();
    setNewSecret(generated);
    setIsSecretOpen(true);
  };
  const handleEditClick    = (client) => { setEditingClient(client); };
  const handleCreateClick  = ()       => { setEditingClient({}); };
  const handleBackFromConfig = ()     => { setEditingClient(null); };

  const handleConfirmDelete = () => {
    setClients(prev => prev.filter(c => c.clientId !== selectedClient.clientId));
    setIsDeleteOpen(false);
    setSelectedClient(null);
    const newTotal = filteredClients.length - 1;
    const newTotalPages = Math.ceil(newTotal / itemsPerPage);
    if (currentPage > newTotalPages) setCurrentPage(Math.max(1, newTotalPages));
  };

  const handleSaveClient = (savedClient, isEdit) => {
    if (isEdit) {
      setClients(prev => prev.map(c => c.clientId === savedClient.clientId ? savedClient : c));
    } else {
      setClients(prev => [...prev, savedClient]);
    }
    setEditingClient(null);
  };

  if (editingClient !== null) {
    return (
      <ClientConfiguration
        client={editingClient}
        onBack={handleBackFromConfig}
        onSave={handleSaveClient}
      />
    );
  }

  return (
    <div className="p-5">
      <ClientHeader
        totalClients={clients.length}
        onCreateClick={handleCreateClick}
      />

      <ClientTable
        clients={paginatedClients}
        totalCount={clients.length}
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
        onDelete={handleConfirmDelete}
      />

      <SecretRotationModal
        isOpen={isSecretOpen}
        onClose={() => setIsSecretOpen(false)}
        appName={selectedClient?.name || ''}
        newSecret={newSecret}
      />
    </div>
  );
};

export default ClientManagement;