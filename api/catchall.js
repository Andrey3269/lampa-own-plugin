module.exports = async function handler(req, res) {
  res.status(404)
    .setHeader('Access-Control-Allow-Origin', '*')
    .json({error:'not_found'});
};
