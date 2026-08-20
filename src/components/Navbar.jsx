import React from 'react';
import { Sun, Moon, Heart, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';

export const Navbar = ({
  viewMode,
  setViewMode,
  onRandomClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        {/* logo clicks go back to all view */}
        <div
          className="brand-logo"
          onClick={() => setViewMode('all')}
          role="button"
          tabIndex={0}
          aria-label="Pokémon Explorer Home"
        >
          <div className="logo-pokeball" aria-hidden="true" />
          <h1 className="brand-title">
            PokéDex <span className="brand-title-pro">PRO</span>
          </h1>
        </div>

        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={onRandomClick}
            title="Discover a random Pokémon"
            aria-label="Discover a random Pokémon"
          >
            <Sparkles size={16} />
            <span className="hide-mobile">Surprise Me</span>
          </button>

          <button
            className={`icon-btn ${viewMode === 'favorites' ? 'active' : ''}`}
            onClick={() =>
              setViewMode(viewMode === 'favorites' ? 'all' : 'favorites')
            }
            title="View saved Favorites"
            aria-label="Toggle favorites view"
          >
            <Heart
              size={16}
              fill={viewMode === 'favorites' ? '#ffffff' : 'currentColor'}
            />
            <span className="hide-mobile">Favorites</span>
            {favorites.length > 0 && (
              <span className="badge-count">{favorites.length}</span>
            )}
          </button>

          <button
            className="icon-btn icon-btn-round"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
