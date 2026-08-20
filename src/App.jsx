import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { TypeFilter } from './components/TypeFilter';
import { SortControls } from './components/SortControls';
import { PokemonGrid } from './components/PokemonGrid';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { PokemonModal } from './components/PokemonModal';
import { Footer } from './components/Footer';

import {
  fetchPokemonList,
  fetchPokemonByType,
  fetchPokemonDetail,
} from './services/pokemonApi';
import { GENERATIONS } from './constants/pokemonTypes';
import { useFavorites } from './context/FavoritesContext';
import { Loader2 } from 'lucide-react';

const PAGE_SIZE = 24;

export const App = () => {
  const [allLoadedPokemon, setAllLoadedPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(1025);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGen, setSelectedGen] = useState(0);
  const [sortBy, setSortBy] = useState('id_asc');
  const [viewMode, setViewMode] = useState('all');

  const [selectedPokemonKey, setSelectedPokemonKey] = useState(null);

  const { favorites } = useFavorites();

  // open modal if url has #pokemon= on load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#pokemon=')) {
        const key = decodeURIComponent(hash.replace('#pokemon=', ''));
        if (key) setSelectedPokemonKey(key);
      } else if (!hash) {
        setSelectedPokemonKey(null);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openPokemonModal = (idOrName) => {
    setSelectedPokemonKey(idOrName);
    window.location.hash = `pokemon=${idOrName}`;
  };

  const closePokemonModal = () => {
    setSelectedPokemonKey(null);
    if (window.location.hash.startsWith('#pokemon=')) {
      history.pushState(
        '',
        document.title,
        window.location.pathname + window.location.search
      );
    }
  };

  const loadInitialPokemon = useCallback(
    async (genId = 0) => {
      setLoading(true);
      setError(null);
      try {
        const gen = GENERATIONS.find((g) => g.id === genId) || GENERATIONS[0];
        const startOffset = gen.offset;
        const initialLimit = Math.min(PAGE_SIZE, gen.limit);

        const data = await fetchPokemonList(startOffset, initialLimit);
        setAllLoadedPokemon(data.results);
        setOffset(startOffset + initialLimit);
        setTotalCount(gen.limit);
      } catch (err) {
        setError(err.message || 'Failed to fetch Pokémon.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadByType = useCallback(async (type) => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchPokemonByType(type);
      setAllLoadedPokemon(list);
      setTotalCount(list.length);
      setOffset(list.length);
    } catch (err) {
      setError(err.message || `Failed to fetch Pokémon of type ${type}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedType) {
      loadByType(selectedType);
    } else {
      loadInitialPokemon(selectedGen);
    }
  }, [selectedType, selectedGen, loadByType, loadInitialPokemon]);

  const handleLoadMore = async () => {
    if (loadingMore || selectedType) return;
    setLoadingMore(true);
    try {
      const gen = GENERATIONS.find((g) => g.id === selectedGen) || GENERATIONS[0];
      const maxLimit = gen.offset + gen.limit;
      const nextLimit = Math.min(PAGE_SIZE, maxLimit - offset);

      if (nextLimit <= 0) return;

      const data = await fetchPokemonList(offset, nextLimit);
      setAllLoadedPokemon((prev) => [...prev, ...data.results]);
      setOffset((prev) => prev + nextLimit);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const [directSearchResult, setDirectSearchResult] = useState(null);
  const [isSearchingDirect, setIsSearchingDirect] = useState(false);

  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase().replace(/^#/, '');
    if (!trimmed) {
      setDirectSearchResult(null);
      return;
    }

    const localMatch = allLoadedPokemon.some(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        String(p.id) === trimmed
    );

    if (!localMatch) {
      const debounceTimer = setTimeout(async () => {
        setIsSearchingDirect(true);
        try {
          const detail = await fetchPokemonDetail(trimmed);
          if (detail) {
            setDirectSearchResult({
              id: detail.id,
              name: detail.name,
              url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/`,
              image: detail.image,
              types: detail.types,
            });
          }
        } catch {
          setDirectSearchResult(null);
        } finally {
          setIsSearchingDirect(false);
        }
      }, 400);

      return () => clearTimeout(debounceTimer);
    } else {
      setDirectSearchResult(null);
    }
  }, [searchQuery, allLoadedPokemon]);

  const displayedPokemon = useMemo(() => {
    let list = [...allLoadedPokemon];

    if (directSearchResult && !list.some((p) => p.id === directSearchResult.id)) {
      list = [directSearchResult, ...list];
    }

    if (viewMode === 'favorites') {
      list = list.filter((p) => favorites.includes(p.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim().replace(/^#/, '');
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          p.types.some((t) => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'id_desc') return b.id - a.id;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      return a.id - b.id;
    });

    return list;
  }, [
    allLoadedPokemon,
    directSearchResult,
    viewMode,
    favorites,
    searchQuery,
    sortBy,
  ]);

  const handleSurpriseMe = () => {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    openPokemonModal(randomId);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
    setSelectedGen(0);
    setSortBy('id_asc');
    setViewMode('all');
  };

  const genConfig = GENERATIONS.find((g) => g.id === selectedGen) || GENERATIONS[0];
  const canLoadMore =
    !selectedType &&
    viewMode === 'all' &&
    !searchQuery &&
    offset < genConfig.offset + genConfig.limit;

  return (
    <div className="app-container">
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRandomClick={handleSurpriseMe}
      />

      <main className="main-content">
        <section className="hero-section">
          <h2 className="hero-headline">Pokémon Explorer</h2>

          <SearchBar
            query={searchQuery}
            setQuery={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </section>

        <section className="filters-bar">
          <SortControls
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedGen={selectedGen}
            setSelectedGen={setSelectedGen}
            totalResultsCount={displayedPokemon.length}
          />

          <TypeFilter
            selectedType={selectedType}
            onSelectType={(type) => {
              setSelectedType(type);
              setSearchQuery('');
            }}
          />
        </section>

        {loading ? (
          <LoadingSkeleton count={12} />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => {
              if (selectedType) loadByType(selectedType);
              else loadInitialPokemon(selectedGen);
            }}
          />
        ) : displayedPokemon.length === 0 ? (
          viewMode === 'favorites' ? (
            <EmptyState
              title="No Favorites Yet"
              message="You have not added any Pokémon to your favorites. Click the heart icon on any card to save your favorite Pokémon!"
              onReset={() => setViewMode('all')}
            />
          ) : (
            <EmptyState
              title="Pokémon not found"
              message={
                isSearchingDirect
                  ? 'Searching PokéAPI database...'
                  : `No Pokémon matches "${searchQuery}". Try searching for another name (e.g. "pikachu", "charizard") or ID (#025).`
              }
              onReset={handleResetFilters}
            />
          )
        ) : (
          <>
            <PokemonGrid
              pokemonList={displayedPokemon}
              onPokemonClick={(p) => openPokemonModal(p.name)}
            />

            {canLoadMore && (
              <div className="load-more-section">
                <button
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  aria-label="Load more Pokémon"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Loading More Pokémon...</span>
                    </>
                  ) : (
                    <span>Load More Pokémon</span>
                  )}
                </button>
                <span className="load-more-count">
                  Showing {allLoadedPokemon.length} of {genConfig.limit} in {genConfig.name}
                </span>
              </div>
            )}
          </>
        )}
      </main>

      {selectedPokemonKey && (
        <PokemonModal
          pokemonIdOrName={selectedPokemonKey}
          onClose={closePokemonModal}
          onSelectPokemon={(idOrName) => openPokemonModal(idOrName)}
        />
      )}

      <Footer />
    </div>
  );
};
