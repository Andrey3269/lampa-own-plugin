module.exports = async function handler(req, res) {
  const body = {
    ok: true,
    service: 'lampa-own-api',
    time: new Date().toISOString()
  };
  res.status(200)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Cache-Control', 'no-store')
    .json(body);
};
