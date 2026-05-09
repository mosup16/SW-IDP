import { motion, AnimatePresence } from "framer-motion";
import '../../../../assets/styles/DeleteRoleModal.css';
import Icon from '../../../../components/icon';

export default function DeleteRoleModal({ isOpen, onClose, roleName, userCount, onDelete }) {

  const handleDelete = () => {
    if (onDelete) onDelete();
    onClose();
  };

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
          >
            <div className="delete-modal__body">

              <div className="delete-modal__top">
                <div className="delete-modal__icon-wrap">
                  <Icon.Warning size={24} />
                </div>
                <div>
                  <h5 className="delete-modal__title">Delete Role</h5>
                  <p className="delete-modal__desc">
                    You are about to permanently delete the{' '}
                    <span className="delete-modal__role-name">{roleName}</span>{' '}
                    role.
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
                      <span className="delete-modal__impact-bold">
                        {userCount} Users
                      </span>{' '}
                      will lose access permissions associated with this role.
                    </p>
                  </li>
                  <li className="delete-modal__impact-item">
                    <span className="delete-modal__impact-arrow">›</span>
                    <p className="delete-modal__impact-text">
                      <span className="delete-modal__impact-bold">
                        3 Access Policies
                      </span>{' '}
                      will be orphaned and require manual reassignment.
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
                <button className="delete-modal__btn-keep" onClick={onClose}>
                  Keep Role
                </button>
                <button className="delete-modal__btn-delete" onClick={handleDelete}>
                  <Icon.Delete size={16} />
                  Delete Role
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}