'use strict';

const providers = require('../../providers');
const { response } = require('../../lib/common');
const { requestParams } = require('../../lib/provider-utils');

function getProvider(id) {
  return providers.find((p) => p && String(p.id) === String(id));
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  const q = req.query || {};
  const providerId = q.provider || q.providerId || q[0] || '';
  const provider = getProvider(providerId);

  if (!provider) {
    const body = { error: 'provider_not_found', provider: providerId };
    Object.entries(response(404, body).headers).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(404).json(body);
  }

  try {
    const params = requestParams(req);
    params.provider = providerId;
    params.selfUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}${req.url.split('?')[0]}?provider=${encodeURIComponent(providerId)}&title=${encodeURIComponent(params.title)}`;

    const rows = await provider.streams(params);
    const out = Array.isArray(rows) ? rows : [];

    Object.entries(response(200, out).headers).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).json(out);
  } catch (error) {
    console.error(`[provider:${provider.id}] streams failed`, error);
    const body = { error: 'provider_error', provider: provider.id };
    Object.entries(response(502, body).headers).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(502).json(body);
  }
};
