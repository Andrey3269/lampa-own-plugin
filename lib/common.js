const catalog = require('../data/catalog.json');

function corsHeaders(extra = {}) {
  return Object.assign({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Kit-AesGcm, X-Zprem-Key',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
  }, extra);
}

function response(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: corsHeaders(Object.assign({'Content-Type': 'application/json; charset=utf-8'}, extraHeaders || {})),
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };
}

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, ' ')
    .trim();
}

function findTitles(query) {
  const q = normalize(query);
  if (!q) return catalog.slice();
  const parts = q.split(/\s+/).filter(Boolean);
  return catalog.filter(item => {
    const hay = normalize([item.title, item.originalTitle, item.year].join(' '));
    return parts.every(part => hay.indexOf(part) !== -1);
  });
}

function findItem(query) {
  const matches = findTitles(query);
  return matches[0] || null;
}

function providerFor(item, providerId) {
  if (!item || !Array.isArray(item.providers)) return null;
  return item.providers.find(p => String(p.id) === String(providerId)) || null;
}

function buildProviderUrl(baseUrl, providerId, query, extra = {}) {
  const u = new URL(baseUrl);
  u.searchParams.set('title', query || '');
  Object.keys(extra).forEach(k => {
    if (extra[k] !== undefined && extra[k] !== null && extra[k] !== '') u.searchParams.set(k, String(extra[k]));
  });
  u.searchParams.set('provider', providerId);
  return u.toString();
}

module.exports = {
  catalog,
  response,
  corsHeaders,
  normalize,
  findTitles,
  findItem,
  providerFor,
  buildProviderUrl
};
