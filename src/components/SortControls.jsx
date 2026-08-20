import React from 'react';
import { ArrowUpDown, Layers, Filter } from 'lucide-react';
import { GENERATIONS } from '../constants/pokemonTypes';

export const SortControls = ({
  sortBy,
  setSortBy,
  selectedGen,
  setSelectedGen,
  totalResultsCount,
}) => {
  return (
    <div className="filters-header">
      <div className="filters-title-group">
        <Filter size={18} className="text-muted" />
        <span>
          Showing <strong>{totalResultsCount}</strong> Pokémon
        </span>
      </div>

      <div className="controls-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={16} className="text-muted" />
          <select
            className="custom-select"
            value={selectedGen}
            onChange={(e) => setSelectedGen(Number(e.target.value))}
            aria-label="Filter by Generation"
          >
            {GENERATIONS.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.name} {gen.region !== 'All' ? `(${gen.region})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUpDown size={16} className="text-muted" />
          <select
            className="custom-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort Pokémon"
          >
            <option value="id_asc">ID: Low to High</option>
            <option value="id_desc">ID: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>
    </div>
  );
};
