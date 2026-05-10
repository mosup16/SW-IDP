import React, { useState, useMemo, useEffect } from 'react';
import ClientHeader from './ClientHeader';
import ClientTable from './ClientTable';
import { oauthService } from '../../../services/oauthService';
import { useAuth } from '../../../hooks/useAuth';
import DeleteClientPopup from '../modals/DeleteClientPopup/DeleteClientPopup';
import SecretRotationModal from '../modals/SecretRotationModal/SecretRotationModal';
import ClientConfiguration from '../ClientConfiguration/ClientConfiguration';

function generateClientSecret() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return 'sec_' + btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const ClientManagement = () => {
  const { hasAuthority } = useAuth();
  const canWrite = hasAuthority('clients.write');
  const [clients, setClients]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [filter, setFilter]                 = useState('all');
  const [isDeleteOpen, setIsDeleteOpen]     = useState(false);
  const [isSecretOpen, setIsSecretOpen]     = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient]   = useState(null);
  const [currentPage, setCurrentPage]       = useState(1);
  const [newSecret, setNewSecret]           = useState('');

  const itemsPerPage = 4;

  useEffect(() => {
    oauthService.listClients()
      .then(data => setClients(Array.isArray(data) ? data : (data?.content ?? [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch =
        client.name?.toLowerCase().includes(search.toLowerCase()) ||
        client.clientId?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all' || client.type?.toLowerCase() === filter;
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
    'Redirect URIs': (redirectUris ?? []).join(' | '),
    'Created At': createdAt,
  }));

  const handleDeleteClick  = (client) => { setSelectedClient(client); setIsDeleteOpen(true); };
  const handleSecretClick  = async (client) => {
    setSelectedClient(client);
    setIsSecretOpen(true);
    const generated = generateClientSecret();
    try {
      await oauthService.rotateSecret(client.clientId, generated);
      setNewSecret(generated);
    } catch {
      setNewSecret('');
    }
  };
  const handleEditClick    = (client) => { setEditingClient(client); };
  const handleCreateClick  = ()       => { setEditingClient({}); };
  const handleBackFromConfig = ()     => { setEditingClient(null); };

  const handleConfirmDelete = async () => {
    try {
      await oauthService.deleteClient(selectedClient.clientId);
      setClients(prev => prev.filter(c => c.clientId !== selectedClient.clientId));
      const newTotal = filteredClients.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage);
      if (currentPage > newTotalPages) setCurrentPage(Math.max(1, newTotalPages));
    } catch {
      // keep modal open so user sees it failed
      return;
    }
    setIsDeleteOpen(false);
    setSelectedClient(null);
  };

  const handleSaveClient = async (savedClient, isEdit) => {
    try {
      if (isEdit) {
        const updated = await oauthService.updateClient(savedClient.clientId, savedClient);
        setClients(prev => prev.map(c => c.clientId === savedClient.clientId ? (updated ?? savedClient) : c));
      } else {
        const created = await oauthService.createClient(savedClient);
        setClients(prev => [...prev, created ?? savedClient]);
      }
    } catch {
      // swallow — page will retain old state
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

  if (loading) {
    return <div className="p-5">Loading clients…</div>;
  }

  return (
    <div className="p-5">
      <ClientHeader
        totalClients={clients.length}
        onCreateClick={canWrite ? handleCreateClick : undefined}
        canWrite={canWrite}
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
        onCreateClick={canWrite ? handleCreateClick : undefined}
        onDeleteClick={canWrite ? handleDeleteClick : undefined}
        onSecretRotateClick={canWrite ? handleSecretClick : undefined}
        onEditClick={canWrite ? handleEditClick : undefined}
        canWrite={canWrite}
      />

      <DeleteClientPopup
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        clientName={selectedClient?.name || ''}
        clientId={selectedClient?.clientId || ''}
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
