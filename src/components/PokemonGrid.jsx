import React from 'react';
import { PokemonCard } from './PokemonCard';

export const PokemonGrid = ({ pokemonList, onPokemonClick }) => {
  return (
    <section className="pokemon-grid" aria-label="Pokémon catalog">
      {pokemonList.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onClick={onPokemonClick}
        />
      ))}
    </section>
  );
};
