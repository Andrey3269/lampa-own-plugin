'use strict';

function first(q, keys) {
  for (let i = 0; i < keys.length; i++) {
    const value = q[keys[i]];
    if (value !== undefined && value !== null && String(value) !== '') return value;
  }
  return '';
}

function toBool(value) {
  if (value === true || value === false) return value;
  const s = String(value || '').toLowerCase();
  return s === '1' || s === 'true' || s === 'yes';
}

/**
 * Lampa/Lampac-compatible query contract.
 * Unknown query fields are intentionally ignored by providers, but the
 * normalized object keeps the fields we may need later for adapters.
 */
function requestParams(req) {
  const q = req.query || {};

  return {
    // IDs
    id: first(q, ['id']),
    imdb_id: first(q, ['imdb_id']),
    kinopoisk_id: first(q, ['kinopoisk_id']),
    tmdb_id: first(q, ['tmdb_id']),

    // Titles
    title: first(q, ['title', 'original_title']),
    original_title: first(q, ['original_title']),

    // Type / release information
    serial: toBool(q.serial),
    original_language: first(q, ['original_language']),
    year: first(q, ['year']),

    // Search context used by Lampa
    source: first(q, ['source']),
    clarification: toBool(q.clarification),
    similar: toBool(q.similar),
    rchtype: first(q, ['rchtype']),
    anime: toBool(q.anime),

    // Episode selection
    season: first(q, ['season']),
    episode: first(q, ['episode']),

    // Request/session metadata. Providers should generally NOT persist these.
    account_email: first(q, ['account_email']),
    uid: first(q, ['uid']),
    nws_id: first(q, ['nws_id']),
    cub_id: first(q, ['cub_id']),

    // Internal routing
    provider: first(q, ['provider', 'providerId']),
    life: toBool(q.life),
    memkey: first(q, ['memkey'])
  };
}

function providerPublicUrl(req, providerId, title) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const base = `${proto}://${host}/api/lite/${encodeURIComponent(providerId)}`;
  const params = new URLSearchParams();
  params.set('provider', providerId);
  if (title) params.set('title', title);
  return `${base}?${params.toString()}`;
}

module.exports = { providerPublicUrl, requestParams, toBool };
