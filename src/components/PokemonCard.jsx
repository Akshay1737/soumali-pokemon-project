import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { TYPE_MAP } from '../constants/pokemonTypes';
import { useFavorites } from '../context/FavoritesContext';

export const PokemonCard = ({ pokemon, onClick }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);

  const primaryType = pokemon.types[0] || 'normal';
  const typeMeta = TYPE_MAP[primaryType] || TYPE_MAP.normal;
  const favorited = isFavorite(pokemon.id);

  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(pokemon);
    }
  };

  return (
    <article
      className="pokemon-card"
      style={{
        '--card-type-color': typeMeta.color,
      }}
      onClick={() => onClick(pokemon)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${pokemon.name}, ${formattedId}`}
    >
      <div className="card-backdrop-glow" aria-hidden="true" />

      <div className="card-top-bar">
        <span className="card-id">{formattedId}</span>

        <button
          type="button"
          className={`card-action-btn ${favorited ? 'favorited' : ''}`}
          onClick={(e) => toggleFavorite(pokemon.id, e)}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={`Favorite ${pokemon.name}`}
        >
          <Heart size={15} fill={favorited ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="card-image-wrapper">
        <svg
          className="card-image-bg-pokeball"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 8c20.9 0 38.3 15.3 41.5 35.5H68.8C65.9 33.1 58.7 26 50 26s-15.9 7.1-18.8 17.5H8.5C11.7 23.3 29.1 8 50 8zm0 84C29.1 92 11.7 76.7 8.5 56.5h22.7C34.1 66.9 41.3 74 50 74s15.9-7.1 18.8-17.5h22.7C88.3 76.7 70.9 92 50 92zm0-50c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />
        </svg>

        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="card-image"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0.4 }}
          onError={(e) => {
            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
          }}
        />
      </div>

      <div className="card-info">
        <h3 className="card-name">{pokemon.name}</h3>
        <div className="card-types">
          {pokemon.types.map((type) => {
            const badgeMeta = TYPE_MAP[type] || TYPE_MAP.normal;
            return (
              <span
                key={type}
                className="type-badge"
                style={{ background: badgeMeta.badgeBg }}
              >
                <span>{badgeMeta.icon}</span>
                <span>{badgeMeta.label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
};
