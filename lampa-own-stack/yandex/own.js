'use strict';

const catalog = require('../data/catalog.json');

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, ' ')
    .trim();
}

function findItem(params) {
  const title = normalize(params && (params.title || params.original_title));
  const year = Number(params && params.year) || null;
  const items = catalog.filter((item) => {
    if (!title) return true;
    const hay = normalize([item.title, item.originalTitle, item.year].join(' '));
    const parts = title.split(/\s+/).filter(Boolean);
    return parts.every((part) => hay.includes(part));
  });

  if (year) {
    const exact = items.find((item) => Number(item.year) === year);
    if (exact) return exact;
  }

  return items[0] || null;
}

function movieRows(item) {
  return (item.providers || [])
    .filter((p) => p && p.stream)
    .map((p) => ({
      method: 'play',
      text: p.voice || 'Original',
      title: item.title,
      url: p.stream,
      voice_name: p.voice || 'Original',
      quality: p.quality ? { [p.quality]: p.stream } : undefined
    }));
}

function seriesRows(item, seasonNo) {
  const season = (item.seasons || []).find((s) => Number(s.season) === Number(seasonNo));
  if (!season) return [];

  return (season.episodes || []).filter((ep) => ep && ep.stream).map((ep) => ({
    method: 'play',
    text: ep.title || `Серия ${ep.episode}`,
    title: ep.title || `Серия ${ep.episode}`,
    season: Number(seasonNo),
    episode: Number(ep.episode),
    url: ep.stream,
    voice_name: ep.voice || 'Original',
    quality: ep.quality ? { [ep.quality]: ep.stream } : undefined
  }));
}

module.exports = {
  id: 'own',
  name: 'Мой источник',

  async search(params) {
    return Boolean(findItem(params));
  },

  async streams(params) {
    const item = findItem(params);
    if (!item) return [];

    if (item.type === 'series') {
      const seasonParam = params.season;
      if (seasonParam === undefined || seasonParam === '') {
        return (item.seasons || []).map((s, i) => ({
          method: 'link',
          text: `Сезон ${s.season || i + 1}`,
          url: params.selfUrl
            ? `${params.selfUrl}&season=${encodeURIComponent(s.season || i + 1)}`
            : '',
          season: Number(s.season || i + 1)
        }));
      }
      return seriesRows(item, seasonParam);
    }

    return movieRows(item);
  }
};
