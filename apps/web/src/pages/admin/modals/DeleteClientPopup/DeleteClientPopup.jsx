import React from 'react';
import Icon from '../../../../components/icon';
import '../../../../assets/styles/DeleteClient.css';

const DeleteClientPopup = ({ isOpen, onClose, clientName, clientId, activeTokens }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal">

        {/* Header */}
        <div className="delete-modal__header">
          <div className="delete-modal__icon">
            <Icon.Warning size={22} />
          </div>
          <div>
            <h2 className="delete-modal__title">Delete Client Application</h2>
            <p className="delete-modal__subtitle">
              Are you sure you want to delete <strong>{clientName}</strong>? This action
              is permanent and will revoke all active tokens for this client.
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="delete-modal__info">
          <div className="delete-modal__info-row">
            <span className="delete-modal__info-label">Client ID</span>
            <span className="delete-modal__info-value">{clientId}</span>
          </div>
          <div className="delete-modal__info-row">
            <span className="delete-modal__info-label">Active Tokens</span>
            <span className="delete-modal__info-tokens">{activeTokens}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="delete-modal__footer">
          <button className="delete-modal__btn-cancel" onClick={onClose}>
            Keep Application
          </button>
          <button className="delete-modal__btn-delete" onClick={onClose}>
            <Icon.Trash2 size={16} />
            Delete Permanently
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteClientPopup;