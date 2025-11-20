import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Modal } from '../Modal/Modal';
import './NameInputModal.css';

export const NameInputModal = memo(({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Reset name when modal opens
      setName('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
      onClose();
    }
  };

  const handleCancel = useCallback(() => {
    setName('');
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Enter Polygon Name">
      <form onSubmit={handleSubmit} className="name-input-form">
        <label htmlFor="polygon-name" className="name-input-label">
          Polygon Name:
        </label>
        <input
          id="polygon-name"
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for your polygon"
          className="name-input-field"
          maxLength={50}
        />
        <div className="name-input-actions">
          <button type="button" onClick={handleCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={!name.trim()} className="btn btn-primary">
            Start Drawing
          </button>
        </div>
      </form>
    </Modal>
  );
});

NameInputModal.displayName = 'NameInputModal';

