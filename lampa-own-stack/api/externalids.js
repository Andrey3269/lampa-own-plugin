'use strict';

const { response } = require('../lib/common');

async function tmdbLookup(q) {
  const token = String(process.env.TMDB_TOKEN || '');
  if (!token) return null;

  const title = q.title || q.original_title;
  if (!title) return null;
  const url = 'https://api.themoviedb.org/3/search/multi?query=' + encodeURIComponent(title) + '&include_adult=false&language=en-US&page=1';
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (!res.ok) return null;
  const data = await res.json();
  const rows = Array.isArray(data.results) ? data.results : [];
  const media = rows.find(x => x.media_type === (String(q.serial) === '1' ? 'tv' : 'movie')) || rows[0];
  if (!media) return null;
  return {
    tmdb_id: media.id,
    imdb_id: media.external_ids && media.external_ids.imdb_id,
    title: media.title || media.name,
    original_title: media.original_title || media.original_name
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  const q = req.query || {};
  let extra = null;
  try { extra = await tmdbLookup(q); } catch (e) { console.error('[externalids] tmdb', e && e.message ? e.message : e); }

  const body = {
    id: q.id || undefined,
    title: extra?.title || q.title || q.original_title || undefined,
    original_title: extra?.original_title || q.original_title || undefined,
    imdb_id: extra?.imdb_id || q.imdb_id || undefined,
    kinopoisk_id: q.kinopoisk_id || undefined,
    tmdb_id: extra?.tmdb_id || q.tmdb_id || undefined
  };
  const out = response(200, body);
  Object.entries(out.headers).forEach(([k,v]) => res.setHeader(k,v));
  return res.status(200).json(body);
};
