import React from 'react';
import { TYPE_MAP, ALL_TYPES } from '../constants/pokemonTypes';

export const TypeFilter = ({ selectedType, onSelectType }) => {
  return (
    <div className="type-pills-container" role="tablist" aria-label="Filter by Pokémon type">
      <button
        role="tab"
        aria-selected={selectedType === null}
        className={`type-pill ${selectedType === null ? 'active' : ''}`}
        onClick={() => onSelectType(null)}
        style={{
          background: selectedType === null ? 'var(--primary)' : undefined,
        }}
      >
        <span>🌟</span>
        <span>All Types</span>
      </button>

      {ALL_TYPES.map((typeKey) => {
        const meta = TYPE_MAP[typeKey];
        const isSelected = selectedType === typeKey;

        return (
          <button
            key={typeKey}
            role="tab"
            aria-selected={isSelected}
            className={`type-pill ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectType(isSelected ? null : typeKey)}
            style={{
              background: isSelected ? meta.color : undefined,
              borderColor: isSelected ? meta.color : undefined,
            }}
          >
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
};
