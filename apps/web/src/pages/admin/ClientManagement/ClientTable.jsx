import React from 'react';
import Icon from '../../../components/icon';
import RoleFilters from '../RoleManagement/RoleFilters';

const ClientTable = ({ clients, totalClients, currentPage, totalPages, onPageChange, onEditClick, onDeleteClick, onSecretRotateClick }) => {
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <RoleFilters />
        <style>{`
          .role-filters-dropdown {
            display: none !important;
          }
        `}</style>
      </div>

      <div className="card-container p-0 overflow-hidden">
        <table className="table client-table mb-0">
          <thead>
            <tr>
              <th className="ps-4 py-3">CLIENT NAME</th>
              <th className="py-3">CLIENT ID</th>
              <th className="py-3">REDIRECT URIS</th>
              <th className="py-3">CREATED DATE</th>
              <th className="pe-4 py-3 text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="align-middle">
                <td className="ps-4 py-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar-initials">{client.initials}</div>
                    <div>
                      <div className="fw-bold" style={{ color: '#262626' }}>{client.name}</div>
                      <span
                        className={`badge rounded-pill mt-1 px-2 py-1 badge-${client.type.toLowerCase()}`}
                        style={{ fontSize: '10px' }}
                      >
                        {client.type}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="mono-text">{client.clientId}</span>
                </td>
                <td style={{ maxWidth: '300px' }}>
                  {client.redirectUris.map((uri, idx) => (
                    <div key={idx} className="text-secondary small mb-1">
                      <span className={uri.startsWith('+') ? 'text-primary fw-bold' : ''}>{uri}</span>
                    </div>
                  ))}
                </td>
                <td className="text-secondary">{client.createdAt}</td>
                <td className="pe-4 text-end">
                  <div className="d-flex justify-content-end align-items-center gap-3">
                    <Icon.Key
                      size={17}
                      className="cursor-pointer"
                      style={{ color: '#8c8c8c' }}
                      onClick={() => onSecretRotateClick(client)}
                    />
                    <Icon.Edit
                      size={17}
                      className="cursor-pointer"
                      style={{ color: '#8c8c8c' }}
                      onClick={() => onEditClick(client)}
                    />
                    <Icon.Trash2
                      size={17}
                      className="cursor-pointer"
                      style={{ color: '#ff4d4f' }}
                      onClick={() => onDeleteClick(client)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 d-flex justify-content-between align-items-center text-secondary small border-top">
          <span>Showing {clients.length} of {totalClients} clients</span>
          <div className="d-flex align-items-center gap-1">
            <button
              className="btn btn-sm btn-light border-0 px-2"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Icon.ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className="btn btn-sm border-0 px-3"
                style={
                  currentPage === page
                    ? { background: 'black', color: 'white', borderRadius: '6px', fontWeight: 'bold' }
                    : {}
                }
              >
                {page}
              </button>
            ))}

            <button
              className="btn btn-sm btn-light border-0 px-2"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Icon.ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;