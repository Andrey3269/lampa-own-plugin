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
      const found = provider && typeof provider.search === 'function' ? await provider.search(params) : false;
      if (found) online.push({
        name: provider.name || provider.id,
        url: providerPublicUrl(req, provider.id, params.title),
        show: true,
        provider: provider.id
      });
    } catch (error) {
      console.error(`[provider:${provider && provider.id}] lifeevents failed`, error);
    }
  }));

  const body = { online, ready: true, life: false };
  Object.entries(response(200, body).headers).forEach(([k, v]) => res.setHeader(k, v));
  return res.status(200).json(body);
};
