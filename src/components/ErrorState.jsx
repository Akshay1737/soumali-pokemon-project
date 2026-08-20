import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  message = "Something went wrong. We couldn't load the Pokémon from the PokéAPI.",
  onRetry,
}) => {
  return (
    <div className="state-container" role="alert">
      <div className="state-icon" style={{ color: '#ef4444' }}>
        <AlertTriangle size={32} />
      </div>
      <h3 className="state-title">Connection Error</h3>
      <p className="state-message">{message}</p>
      <button className="btn-primary" onClick={onRetry}>
        <RefreshCw size={16} />
        <span>Try Again</span>
      </button>
    </div>
  );
};
