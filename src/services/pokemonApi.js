import { STAT_NAME_MAP } from '../constants/pokemonTypes';

const BASE_URL = 'https://pokeapi.co/api/v2';

// simple cache so we don't re-fetch the same pokemon twice
const detailCache = new Map();
const typeListCache = new Map();

export function getOfficialArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getShinyArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}

export function getAnimatedArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
}

export async function fetchPokemonList(offset = 0, limit = 24) {
  const res = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon list: ${res.statusText}`);
  }
  const data = await res.json();

  // fetch each pokemon's details in parallel to get types and artwork
  const pokemonPromises = data.results.map(async (item) => {
    const parts = item.url.split('/').filter(Boolean);
    const id = parseInt(parts[parts.length - 1], 10);

    if (detailCache.has(id)) {
      const cached = detailCache.get(id);
      return {
        id: cached.id,
        name: cached.name,
        url: item.url,
        image: cached.image,
        types: cached.types,
      };
    }

    try {
      const detailRes = await fetch(`${BASE_URL}/pokemon/${id}`);
      if (detailRes.ok) {
        const detailData = await detailRes.json();
        const types = detailData.types.map((t) => t.type.name);
        const image =
          detailData.sprites?.other?.['official-artwork']?.front_default ||
          getOfficialArtwork(id);

        return {
          id,
          name: detailData.name,
          url: item.url,
          image,
          types,
        };
      }
    } catch {
      // just use fallback data if individual fetch fails
    }

    return {
      id,
      name: item.name,
      url: item.url,
      image: getOfficialArtwork(id),
      types: ['normal'],
    };
  });

  const results = await Promise.all(pokemonPromises);
  return {
    results,
    totalCount: data.count || 1025,
  };
}

export async function fetchPokemonByType(type) {
  if (typeListCache.has(type)) {
    const ids = typeListCache.get(type);
    return ids.map((id) => ({
      id,
      name: detailCache.get(id)?.name || `pokemon-${id}`,
      url: `${BASE_URL}/pokemon/${id}/`,
      image: detailCache.get(id)?.image || getOfficialArtwork(id),
      types: detailCache.get(id)?.types || [type],
    }));
  }

  const res = await fetch(`${BASE_URL}/type/${type}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch type: ${type}`);
  }
  const data = await res.json();
  const pokemonEntries = data.pokemon || [];

  const summaries = [];
  const ids = [];

  for (const entry of pokemonEntries) {
    const parts = entry.pokemon.url.split('/').filter(Boolean);
    const id = parseInt(parts[parts.length - 1], 10);
    if (id <= 1025) {
      ids.push(id);
      summaries.push({
        id,
        name: entry.pokemon.name,
        url: entry.pokemon.url,
        image: getOfficialArtwork(id),
        types: [type],
      });
    }
  }

  typeListCache.set(type, ids);
  return summaries;
}

export async function fetchPokemonDetail(idOrName) {
  const key = String(idOrName).toLowerCase().trim();
  if (detailCache.has(key)) {
    return detailCache.get(key);
  }

  const res = await fetch(`${BASE_URL}/pokemon/${key}`);
  if (!res.ok) {
    throw new Error(`Pokémon "${idOrName}" not found.`);
  }
  const data = await res.json();

  const id = data.id;
  const name = data.name;
  const types = data.types.map((t) => t.type.name);
  const image =
    data.sprites?.other?.['official-artwork']?.front_default ||
    getOfficialArtwork(id);
  const imageShiny =
    data.sprites?.other?.['official-artwork']?.front_shiny ||
    getShinyArtwork(id);
  const imageAnimated =
    data.sprites?.other?.showdown?.front_default ||
    data.sprites?.front_default;

  // build stats array and sum the total while we're at it
  let totalStats = 0;
  const stats = data.stats.map((s) => {
    const val = s.base_stat;
    totalStats += val;
    return {
      name: s.stat.name,
      displayName: STAT_NAME_MAP[s.stat.name] || s.stat.name,
      value: val,
      max: s.stat.name === 'hp' ? 255 : 200,
    };
  });

  const abilities = data.abilities.map((a) => ({
    name: a.ability.name.replace(/-/g, ' '),
    is_hidden: a.is_hidden,
  }));

  // only grab the first 30 moves, the full list is huge
  const moves = data.moves
    .slice(0, 30)
    .map((m) => {
      const versionDetails = m.version_group_details?.[0];
      return {
        name: m.move.name.replace(/-/g, ' '),
        learn_method: versionDetails?.move_learn_method?.name || 'unknown',
        level_learned_at: versionDetails?.level_learned_at || 0,
      };
    });

  const cries = {
    latest: data.cries?.latest,
    legacy: data.cries?.legacy,
  };

  // grab species data for the pokedex description and evolution chain
  let flavorText = '';
  let genus = '';
  let generation = '';
  let evolutionChain = [];

  try {
    const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    if (speciesRes.ok) {
      const speciesData = await speciesRes.json();

      const genusObj = speciesData.genera?.find(
        (g) => g.language.name === 'en'
      );
      if (genusObj) genus = genusObj.genus;

      const flavorObj = speciesData.flavor_text_entries?.find(
        (f) => f.language.name === 'en'
      );
      if (flavorObj) {
        flavorText = flavorObj.flavor_text.replace(/\f|\n|\r/g, ' ');
      }

      if (speciesData.generation?.name) {
        generation = speciesData.generation.name.toUpperCase().replace('-', ' ');
      }

      if (speciesData.evolution_chain?.url) {
        const evoRes = await fetch(speciesData.evolution_chain.url);
        if (evoRes.ok) {
          const evoData = await evoRes.json();
          evolutionChain = parseEvolutionChain(evoData.chain);
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch species data:', err);
  }

  const detail = {
    id,
    name,
    height: data.height,
    weight: data.weight,
    base_experience: data.base_experience,
    types,
    image,
    imageShiny,
    imageAnimated,
    stats,
    totalStats,
    abilities,
    moves,
    cries,
    speciesUrl: data.species?.url,
    flavorText,
    genus,
    generation,
    evolutionChain,
  };

  detailCache.set(id, detail);
  detailCache.set(name.toLowerCase(), detail);

  return detail;
}

function parseEvolutionChain(chain) {
  const items = [];

  function traverse(node) {
    if (!node || !node.species) return;

    const parts = node.species.url.split('/').filter(Boolean);
    const id = parseInt(parts[parts.length - 1], 10);
    const details = node.evolution_details?.[0];

    items.push({
      id,
      name: node.species.name,
      image: getOfficialArtwork(id),
      minLevel: details?.min_level || null,
      trigger: details?.trigger?.name?.replace(/-/g, ' '),
      item: details?.item?.name?.replace(/-/g, ' ') || null,
    });

    if (node.evolves_to && node.evolves_to.length > 0) {
      for (const nextNode of node.evolves_to) {
        traverse(nextNode);
      }
    }
  }

  traverse(chain);
  return items;
}
