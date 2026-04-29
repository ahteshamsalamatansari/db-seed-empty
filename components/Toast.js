import { useEffect } from 'react';

export default function Toast({ message, type, icon, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type} show`}>
      <div className="toast-icon">{icon}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
}
