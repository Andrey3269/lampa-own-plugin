'use strict';

const { qualityOf, row } = require('./provider-utils');

function config() {
  const url = String(process.env.JELLYFIN_URL || '').replace(/\/$/, '');
  const apiKey = String(process.env.JELLYFIN_API_KEY || '');
  return url && apiKey ? { url, apiKey } : null;
}

async function searchItems(params) {
  const cfg = config();
  if (!cfg) return [];

  const qs = new URLSearchParams({
    SearchTerm: params.title || params.original_title || '',
    Recursive: 'true',
    IncludeItemTypes: 'Movie,Series',
    Limit: '10',
    Fields: 'Path,MediaSources,ProviderIds'
  });
  if (process.env.JELLYFIN_USER_ID) qs.set('UserId', process.env.JELLYFIN_USER_ID);

  const response = await fetch(cfg.url + '/Items?' + qs.toString(), {
    headers: {
      'Accept': 'application/json',
      'X-Emby-Token': cfg.apiKey
    }
  });
  if (!response.ok) throw new Error(`Jellyfin HTTP ${response.status}`);
  const json = await response.json();
  return Array.isArray(json.Items) ? json.Items : [];
}

function playbackUrl(itemId) {
  const cfg = config();
  const params = new URLSearchParams({
    static: 'true',
    api_key: cfg.apiKey
  });
  return cfg.url + '/Videos/' + encodeURIComponent(itemId) + '/stream?' + params.toString();
}

module.exports = {
  id: 'jellyfin',
  name: 'Jellyfin (моя библиотека)',
  enabled: Boolean(config()),
  async search(params) {
    const items = await searchItems(params);
    return items.some(item => item.Type === 'Movie' || item.Type === 'Series');
  },
  async streams(params) {
    const items = await searchItems(params);
    const title = params.title || params.original_title || '';
    return items.slice(0, 10).map(item => row({
      title: item.Name || title,
      url: playbackUrl(item.Id),
      voice: 'Original',
      quality: qualityOf(item.ProductionYear || '') || undefined,
      meta: { source: 'Jellyfin', item_id: item.Id }
    }));
  }
};
