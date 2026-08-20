import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const FavoritesContext = createContext(undefined);

const STORAGE_KEY = 'poke_favorites';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id, event) => {
    if (event) {
      event.stopPropagation();
    }

    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (!exists) {
        try {
          confetti({
            particleCount: 30,
            spread: 60,
            origin: {
              x: event ? event.clientX / window.innerWidth : 0.5,
              y: event ? event.clientY / window.innerHeight : 0.5,
            },
            colors: ['#ef4444', '#f59e0b', '#ec4899', '#3b82f6'],
            ticks: 100,
          });
        } catch {
          // confetti is optional, don't let it break anything
        }
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  const isFavorite = (id) => favorites.includes(id);

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
