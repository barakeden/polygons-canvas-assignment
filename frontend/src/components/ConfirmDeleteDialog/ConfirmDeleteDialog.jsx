import { memo } from 'react';
import { Modal } from '../Modal/Modal';
import './ConfirmDeleteDialog.css';

export const ConfirmDeleteDialog = memo(({ isOpen, onClose, onConfirm, message }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Polygon">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn btn-danger">
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
});

ConfirmDeleteDialog.displayName = 'ConfirmDeleteDialog';

