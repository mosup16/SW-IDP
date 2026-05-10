import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../../components/icon';
import '../../../../assets/styles/DeleteRoleModal.css';

export default function DeleteIdentityModal({ isOpen, onClose, identity, onDelete }) {
  if (!identity) return null;

  const handleDelete = async () => {
    await onDelete?.(identity);
    onClose();
  };

  const label = identity.displayName || identity.email;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="delete-modal__overlay" onClick={onClose}>
          <motion.div
            className="delete-modal__dialog"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            data-cy="delete-identity-modal"
          >
            <div className="delete-modal__body">
              <div className="delete-modal__top">
                <div className="delete-modal__icon-wrap">
                  <Icon.Warning size={24} />
                </div>
                <div>
                  <h5 className="delete-modal__title">Delete Identity</h5>
                  <p className="delete-modal__desc">
                    You are about to permanently delete{' '}
                    <span className="delete-modal__role-name">{label}</span>.
                  </p>
                </div>
              </div>

              <div className="delete-modal__impact">
                <div className="delete-modal__impact-heading">
                  <Icon.Users size={14} className="delete-modal__impact-icon" />
                  <p className="delete-modal__impact-label">Impact Assessment</p>
                </div>
                <ul className="delete-modal__impact-list">
                  <li className="delete-modal__impact-item">
                    <span className="delete-modal__impact-arrow">›</span>
                    <p className="delete-modal__impact-text">
                      All <span className="delete-modal__impact-bold">active sessions</span> will be terminated.
                    </p>
                  </li>
                  <li className="delete-modal__impact-item">
                    <span className="delete-modal__impact-arrow">›</span>
                    <p className="delete-modal__impact-text">
                      Assigned <span className="delete-modal__impact-bold">role memberships</span> will be revoked.
                    </p>
                  </li>
                  <li className="delete-modal__impact-item">
                    <span className="delete-modal__impact-arrow">›</span>
                    <p className="delete-modal__impact-text">
                      This action is logged in the Audit trail.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="delete-modal__footer">
                <button className="delete-modal__btn-keep" onClick={onClose} data-cy="delete-identity-cancel">
                  Keep Identity
                </button>
                <button className="delete-modal__btn-delete" onClick={handleDelete} data-cy="delete-identity-confirm">
                  <Icon.Delete size={16} />
                  Delete Identity
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
