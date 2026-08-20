import React from 'react';

export const Footer = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-inner">
        <p style={{ fontWeight: 600 }}>
          PokéDex PRO &mdash; Built with ReactJS and PokéAPI
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and Game Freak.
        </p>
        <div className="footer-links">
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            PokéAPI Docs
          </a>
          <span>•</span>
          <a
            href="https://github.com/PokeAPI/pokeapi"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Data Source
          </a>
        </div>
      </div>
    </footer>
  );
};
