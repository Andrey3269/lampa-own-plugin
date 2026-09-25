'use strict';

const own = require('./own');
const providers = [own];

function cors(res) {
  return res
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports.handler = async function handler(req, res) {
  cors(res);
  if (req.httpMethod === 'OPTIONS') return res.status(204).send('');

  const path = req.path || req.url || '/';
  const query = req.query || {};
  const title = query.title || query.original_title || '';

  if (path.endsWith('/health')) {
    return res.status(200).json({ ok: true, service: 'lampa-own-yandex' });
  }

  if (path.endsWith('/lite/withsearch')) {
    return res.status(200).json(providers.map(p => p.id));
  }

  if (path.endsWith('/lite/events')) {
    const out = [];
    for (const p of providers) {
      try {
        if (await p.search({ title })) {
          out.push({ name: p.name, provider: p.id, show: true, url: `${req.url.split('?')[0].replace(/\/events$/, '')}/${p.id}?provider=${encodeURIComponent(p.id)}&title=${encodeURIComponent(title)}` });
        }
      } catch (_) {}
    }
    return res.status(200).json(out);
  }

  const marker = '/lite/';
  const i = path.indexOf(marker);
  if (i >= 0) {
    const providerId = path.slice(i + marker.length).split('/')[0];
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return res.status(404).json({ error: 'provider_not_found' });
    const rows = await provider.streams({ title, season: query.season, episode: query.episode, selfUrl: req.url.split('?')[0] + `?provider=${encodeURIComponent(providerId)}&title=${encodeURIComponent(title)}` });
    return res.status(200).json(rows);
  }

  return res.status(404).json({ error: 'not_found' });
};
