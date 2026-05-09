import React, { useState } from 'react';
import Icon from '../../../../components/icon';
import '../../../../assets/styles/SecretRotationModal.css';

const SecretRotationModal = ({ isOpen, onClose, appName, newSecret }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(newSecret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="modal-overlay">
      <div className="secret-modal">

        <div className="secret-modal__icon-wrap">
          <div className="secret-modal__icon-bg">
            <div className="secret-modal__icon-circle">
              <Icon.Success size={26} />
            </div>
          </div>
        </div>

        <h2 className="secret-modal__title">Client Secret Rotated</h2>
        <p className="secret-modal__subtitle">
          The secret for <strong>{appName}</strong> has been successfully updated.
        </p>

        <div className="secret-modal__box">
          <div className="secret-modal__box-label">New Client Secret</div>
          <div className="secret-modal__input-wrap">
            <input
              type="text"
              readOnly
              className="secret-modal__input"
              value={newSecret}
            />
            <button className="secret-modal__copy-btn" onClick={handleCopy}>
              {copied ? <Icon.Check size={18} /> : <Icon.Copy2 size={18} />}
            </button>
          </div>
          {copied && (
            <p style={{ fontSize: '12px', color: 'var(--status-active)', marginTop: '4px' }}>
              Copied to clipboard!
            </p>
          )}
        </div>
        <div className="secret-modal__warning">
          <Icon.Warning size={15} className="secret-modal__warning-icon" />
          <span className="secret-modal__warning-text">
            <strong>Copy this secret now.</strong> It will not be shown again. If you lose it,
            you will need to generate a new one.
          </span>
        </div>

        <button className="secret-modal__btn" onClick={onClose}>
          I have saved it
        </button>

      </div>
    </div>
  );
};

export default SecretRotationModal;