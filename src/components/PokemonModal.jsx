import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TYPE_MAP, STAT_COLOR_MAP } from '../constants/pokemonTypes';
import { fetchPokemonDetail } from '../services/pokemonApi';
import { useFavorites } from '../context/FavoritesContext';

export const PokemonModal = ({
  pokemonIdOrName,
  onClose,
  onSelectPokemon,
}) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  const { isFavorite, toggleFavorite } = useFavorites();

  const loadDetail = useCallback(async (idOrName) => {
    setLoading(true);
    setError(null);
    setActiveTab('about');
    try {
      const data = await fetchPokemonDetail(idOrName);
      setDetail(data);
    } catch (err) {
      setError(err.message || 'Failed to load details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pokemonIdOrName) loadDetail(pokemonIdOrName);
  }, [pokemonIdOrName, loadDetail]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && detail && detail.id > 1) {
        onSelectPokemon(detail.id - 1);
      } else if (e.key === 'ArrowRight' && detail && detail.id < 1025) {
        onSelectPokemon(detail.id + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detail, onClose, onSelectPokemon]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!pokemonIdOrName) return null;

  const primaryType = detail?.types[0] || 'normal';
  const themeMeta = TYPE_MAP[primaryType] || TYPE_MAP.normal;
  const formattedId = detail ? `#${String(detail.id).padStart(3, '0')}` : '';

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pokemon-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ '--modal-theme-color': themeMeta.color }}
      >
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div
              className="logo-pokeball"
              style={{
                margin: '0 auto 1.5rem',
                width: '50px',
                height: '50px',
                animation: 'spin 1.2s linear infinite',
              }}
            />
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              Loading Pokédex Data...
            </p>
          </div>
        ) : error || !detail ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>
              Pokémon not found
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {error}
            </p>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div
              className="modal-header-hero"
              style={{ background: themeMeta.bgGradient }}
            >
              <div className="modal-hero-glow" />

              <div className="modal-nav-bar">
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {detail.id > 1 && (
                    <button
                      className="icon-btn"
                      style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'transparent' }}
                      onClick={() => onSelectPokemon(detail.id - 1)}
                      title="Previous Pokémon (← key)"
                      aria-label="Previous Pokémon"
                    >
                      <ChevronLeft size={18} />
                      <span className="hide-mobile">#{String(detail.id - 1).padStart(3, '0')}</span>
                    </button>
                  )}
                  {detail.id < 1025 && (
                    <button
                      className="icon-btn"
                      style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'transparent' }}
                      onClick={() => onSelectPokemon(detail.id + 1)}
                      title="Next Pokémon (→ key)"
                      aria-label="Next Pokémon"
                    >
                      <span className="hide-mobile">#{String(detail.id + 1).padStart(3, '0')}</span>
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    className="icon-btn icon-btn-round"
                    style={{
                      background: isFavorite(detail.id) ? 'white' : 'rgba(255,255,255,0.2)',
                      color: isFavorite(detail.id) ? '#ef4444' : 'white',
                      borderColor: 'transparent',
                    }}
                    onClick={(e) => toggleFavorite(detail.id, e)}
                    title={isFavorite(detail.id) ? 'Favorited' : 'Add to Favorites'}
                    aria-label="Favorite"
                  >
                    <Heart size={18} fill={isFavorite(detail.id) ? '#ef4444' : 'none'} />
                  </button>

                  <button
                    className="modal-close-btn"
                    onClick={onClose}
                    title="Close (Esc)"
                    aria-label="Close dialog"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="modal-hero-layout" style={{ color: 'white' }}>
                <div className="modal-image-col">
                  <img
                    src={detail.image}
                    alt={detail.name}
                    className="modal-image"
                  />
                </div>

                <div className="modal-title-col">
                  <div className="modal-id-row">
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, opacity: 0.9 }}>
                      {formattedId}
                    </span>
                    {detail.generation && (
                      <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '0.15rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}>
                        {detail.generation}
                      </span>
                    )}
                  </div>

                  <h2 id="modal-pokemon-title" className="modal-pokemon-name">
                    {detail.name}
                  </h2>

                  {detail.genus && (
                    <div className="modal-genus" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      {detail.genus}
                    </div>
                  )}

                  <div className="card-types" style={{ marginTop: '0.5rem' }}>
                    {detail.types.map((type) => {
                      const badge = TYPE_MAP[type] || TYPE_MAP.normal;
                      return (
                        <span
                          key={type}
                          className="type-badge"
                          style={{
                            background: 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255,255,255,0.4)',
                          }}
                        >
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                      );
                    })}
                  </div>

                  {detail.flavorText && (
                    <div
                      className="modal-flavor-text"
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        borderLeftColor: 'white',
                        color: 'rgba(255,255,255,0.95)',
                      }}
                    >
                      "{detail.flavorText}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-tabs-nav" role="tablist">
              {['about', 'stats', 'evolution', 'moves'].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'about' && 'Overview'}
                  {tab === 'stats' && 'Base Stats'}
                  {tab === 'evolution' && 'Evolution'}
                  {tab === 'moves' && `Moves (${detail.moves.length})`}
                </button>
              ))}
            </div>

            <div className="modal-tab-body">
              {activeTab === 'about' && (
                <div>
                  <div className="info-grid">
                    <div className="info-card">
                      <span className="info-label">Height</span>
                      <span className="info-value">
                        {(detail.height / 10).toFixed(1)} m
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                          ({(detail.height * 0.328084).toFixed(1)} ft)
                        </span>
                      </span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Weight</span>
                      <span className="info-value">
                        {(detail.weight / 10).toFixed(1)} kg
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                          ({((detail.weight / 10) * 2.20462).toFixed(1)} lbs)
                        </span>
                      </span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Base Experience</span>
                      <span className="info-value">{detail.base_experience || 'N/A'} XP</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Base Stat Total</span>
                      <span className="info-value" style={{ color: themeMeta.color }}>
                        {detail.totalStats}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Abilities</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {detail.abilities.map((ability) => (
                      <div
                        key={ability.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        <span>{ability.name}</span>
                        {ability.is_hidden && (
                          <span style={{
                            fontSize: '0.65rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontWeight: 700,
                          }}>
                            HIDDEN
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div>
                  <div className="stats-list">
                    {detail.stats.map((st) => {
                      const statColor = STAT_COLOR_MAP[st.name] || '#3b82f6';
                      const percentage = Math.min(Math.round((st.value / st.max) * 100), 100);
                      return (
                        <div key={st.name} className="stat-row">
                          <span className="stat-label">{st.displayName}</span>
                          <span className="stat-number">{st.value}</span>
                          <div className="stat-bar-track">
                            <div
                              className="stat-bar-fill"
                              style={{ width: `${percentage}%`, background: statColor }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="total-stats-row">
                    <span style={{ color: 'var(--text-secondary)' }}>Total Base Points</span>
                    <span style={{ fontSize: '1.2rem', color: themeMeta.color }}>{detail.totalStats}</span>
                  </div>
                </div>
              )}

              {activeTab === 'evolution' && (
                <div>
                  {detail.evolutionChain && detail.evolutionChain.length > 1 ? (
                    <div className="evolution-chain-wrap">
                      {detail.evolutionChain.map((evo, idx) => {
                        const isCurrent = evo.id === detail.id;
                        return (
                          <React.Fragment key={evo.id}>
                            <div
                              className={`evolution-node ${isCurrent ? 'current' : ''}`}
                              onClick={() => onSelectPokemon(evo.id)}
                              role="button"
                              tabIndex={0}
                            >
                              <img src={evo.image} alt={evo.name} className="evolution-img" />
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'capitalize' }}>
                                {evo.name}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                #{String(evo.id).padStart(3, '0')}
                              </span>
                            </div>
                            {idx < detail.evolutionChain.length - 1 && (
                              <div className="evolution-arrow">
                                <span>➔</span>
                                <span>
                                  {detail.evolutionChain[idx + 1].minLevel
                                    ? `Lvl ${detail.evolutionChain[idx + 1].minLevel}`
                                    : detail.evolutionChain[idx + 1].item
                                    ? detail.evolutionChain[idx + 1].item
                                    : detail.evolutionChain[idx + 1].trigger || 'Evolves'}
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                      <p>This Pokémon does not evolve.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'moves' && (
                <div className="moves-grid">
                  {detail.moves.map((m, idx) => (
                    <div key={idx} className="move-tag">
                      <span>{m.name}</span>
                      <span className="move-method">
                        {m.level_learned_at > 0 ? `Lv. ${m.level_learned_at}` : m.learn_method}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
