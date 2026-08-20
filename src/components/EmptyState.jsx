import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export const EmptyState = ({
  title = 'No Pokémon Found',
  message = 'We could not find any Pokémon matching your search or filters. Try adjusting your keywords or clearing the filter.',
  onReset,
}) => {
  return (
    <div className="state-container" role="status">
      <div className="state-icon">
        <SearchX size={32} />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {onReset && (
        <button className="btn-primary" onClick={onReset}>
          <RotateCcw size={16} />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
