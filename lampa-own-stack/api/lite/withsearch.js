'use strict';

const providers = require('../../providers');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Lampa sends account_email / uid / nws_id here as session metadata.
  // The provider registry is independent from those values.
  const ids = providers
    .filter((p) => p && p.enabled !== false && typeof p.search === 'function')
    .map((p) => p.id);

  return res
    .status(200)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Cache-Control', 'public, s-maxage=300')
    .setHeader('Content-Type', 'application/json; charset=utf-8')
    .json(ids);
};
