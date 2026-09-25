'use strict';

const providers = require('../../providers');
const { response } = require('../../lib/common');
const { providerPublicUrl, requestParams } = require('../../lib/provider-utils');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  const params = requestParams(req);
  if (!params.title) {
    Object.entries(response(200, []).headers).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).json([]);
  }

  const results = [];
  await Promise.all(providers.map(async (provider) => {
    try {
      if (!provider || typeof provider.search !== 'function') return;
      const found = await provider.search(params);
      if (!found) return;
      results.push({
        name: provider.name || provider.id,
        url: providerPublicUrl(req, provider.id, params.title),
        show: true,
        provider: provider.id
      });
    } catch (error) {
      console.error(`[provider:${provider && provider.id}] search failed`, error);
    }
  }));

  results.sort((a, b) => String(a.name).localeCompare(String(b.name), 'ru'));

  Object.entries(response(200, results).headers).forEach(([k, v]) => res.setHeader(k, v));
  return res.status(200).json(results);
};
