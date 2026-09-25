'use strict';

function providerPublicUrl(req, providerId, title) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const base = `${proto}://${host}/api/lite/${encodeURIComponent(providerId)}`;
  const params = new URLSearchParams();
  params.set('provider', providerId);
  if (title) params.set('title', title);
  return `${base}?${params.toString()}`;
}

function requestParams(req) {
  const q = req.query || {};
  return {
    title: q.title || q.original_title || '',
    original_title: q.original_title || '',
    year: q.year || '',
    imdb_id: q.imdb_id || '',
    tmdb_id: q.tmdb_id || '',
    kinopoisk_id: q.kinopoisk_id || '',
    season: q.season,
    episode: q.episode
  };
}

module.exports = { providerPublicUrl, requestParams };
