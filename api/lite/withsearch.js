'use strict';

const providers = require('../../providers');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  const ids = providers
    .filter((p) => p && typeof p.search === 'function')
    .map((p) => p.id);

  return res
    .status(200)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Cache-Control', 'public, s-maxage=300')
    .json(ids);
};
