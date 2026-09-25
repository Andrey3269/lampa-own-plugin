'use strict';

const { response, findItem } = require('../lib/common');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  const q = req.query || {};
  const item = findItem(q.title || q.original_title || q.imdb_id || q.tmdb_id || q.kinopoisk_id || '');
  const body = {
    id: q.id || undefined,
    title: q.title || q.original_title || undefined,
    imdb_id: (item && item.imdb_id) || q.imdb_id || undefined,
    kinopoisk_id: (item && item.kinopoisk_id) || q.kinopoisk_id || undefined,
    tmdb_id: (item && item.tmdb_id) || q.tmdb_id || undefined
  };

  Object.entries(response(200, body).headers).forEach(([k, v]) => res.setHeader(k, v));
  return res.status(200).json(body);
};
