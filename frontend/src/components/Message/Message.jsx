import { memo } from 'react';
import './Message.css';

export const Message = memo(({ message, loading }) => {
  if (!message) return null;

  return (
    <div className={`message ${loading ? 'loading' : ''}`}>
      {loading && <span className="spinner">⏳</span>}
      {message}
    </div>
  );
});

Message.displayName = 'Message';

