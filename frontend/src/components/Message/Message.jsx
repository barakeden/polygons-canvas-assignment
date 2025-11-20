import './Message.css';

export const Message = ({ message, loading }) => {
  if (!message) return null;

  return (
    <div className={`message ${loading ? 'loading' : ''}`}>
      {loading && <span className="spinner">⏳</span>}
      {message}
    </div>
  );
};

