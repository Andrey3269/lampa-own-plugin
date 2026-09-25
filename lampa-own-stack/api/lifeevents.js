'use strict';

const providers = require('../providers');
const { response } = require('../lib/common');
const { providerPublicUrl, requestParams } = require('../lib/provider-utils');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  const params = requestParams(req);
  const online = [];

  await Promise.all(providers.map(async (provider) => {
    try {
      if (!provider || provider.enabled === false || typeof provider.search !== 'function') return;
      const found = await provider.search(params);
      if (!found) return;

      online.push({
        name: provider.name || provider.id,
        balanser: provider.id,
        url: providerPublicUrl(req, provider.id, params.title),
        show: true,
        provider: provider.id
      });
    } catch (error) {
      console.error(`[provider:${provider && provider.id}] lifeevents failed`, error);
    }
  }));

  const body = { online, ready: true, life: false };
  const out = response(200, body);
  Object.entries(out.headers).forEach(([k, v]) => res.setHeader(k, v));
  return res.status(200).json(body);
};
