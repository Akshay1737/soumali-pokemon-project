import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  query,
  setQuery,
  placeholder = 'Search Pokémon by name or Pokédex number (#025)...',
  onClear,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <div className="search-container" role="search">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          ref={inputRef}
          type="text"
          id="pokemon-search-input"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search Pokémon"
          autoComplete="off"
          spellCheck="false"
        />
        {query ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search query"
            title="Clear search"
          >
            <X size={18} />
          </button>
        ) : (
          <kbd className="search-kbd-hint" title="Press '/' key to search">
            /
          </kbd>
        )}
      </div>
    </div>
  );
};
