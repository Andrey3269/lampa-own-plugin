'use strict';

const providers = require('../../providers');
const { response } = require('../../lib/common');
const { providerPublicUrl, requestParams } = require('../../lib/provider-utils');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  const params = requestParams(req);
  const hasIdentity = params.title || params.original_title || params.imdb_id || params.kinopoisk_id || params.tmdb_id;
  if (!hasIdentity) {
    const out = response(200, []);
    Object.entries(out.headers).forEach(([k,v]) => res.setHeader(k,v));
    return res.status(200).json([]);
  }

  const results = [];
  await Promise.all(providers.map(async provider => {
    try {
      const found = await provider.search(params);
      if (!found) return;
      results.push({
        name: provider.name || provider.id,
        balanser: provider.id,
        provider: provider.id,
        url: providerPublicUrl(req, provider.id, params.title || params.original_title),
        show: true
      });
    } catch (error) {
      console.error(`[provider:${provider.id}] search failed`, error && error.message ? error.message : error);
    }
  }));

  results.sort((a,b) => a.name.localeCompare(b.name, 'ru'));
  const out = response(200, results);
  Object.entries(out.headers).forEach(([k,v]) => res.setHeader(k,v));
  return res.status(200).json(results);
};
