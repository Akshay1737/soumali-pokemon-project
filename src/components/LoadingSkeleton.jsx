import React from 'react';

export const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="pokemon-grid" aria-label="Loading Pokémon...">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="skeleton-shimmer" style={{ width: '45px', height: '18px', borderRadius: '4px' }} />
            <div className="skeleton-shimmer" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
            <div className="skeleton-shimmer" style={{ width: '130px', height: '130px', borderRadius: '50%' }} />
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div className="skeleton-shimmer" style={{ width: '70%', height: '22px', marginBottom: '0.65rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div className="skeleton-shimmer" style={{ width: '60px', height: '22px', borderRadius: '9999px' }} />
              <div className="skeleton-shimmer" style={{ width: '60px', height: '22px', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
