'use strict';

const active = require('../providers');
const catalog = require('../providers/catalog');
const { response } = require('../lib/common');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  const activeIds = new Set(active.map(p => p.id));
  const body = [
    ...active.map(p => ({ id: p.id, name: p.name || p.id, status: 'active' })),
    ...catalog.filter(p => !activeIds.has(p.id))
  ];
  const out = response(200, body);
  Object.entries(out.headers).forEach(([k,v]) => res.setHeader(k,v));
  return res.status(200).json(body);
};
