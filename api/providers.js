'use strict';

const providers = require('../providers');
const { response } = require('../lib/common');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  const activeIds = new Set((providers.active || providers).map((p) => p.id));
  const catalog = (providers.catalog || []).map((item) => ({
    ...item,
    enabled: activeIds.has(item.id),
    status: activeIds.has(item.id) ? 'active' : item.status
  }));

  Object.entries(response(200, catalog).headers).forEach(([k, v]) => res.setHeader(k, v));
  return res.status(200).json(catalog);
};
