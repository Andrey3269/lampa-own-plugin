'use strict';

const own = require('./own');
const archive = require('./archive-org');
const wikimedia = require('./wikimedia');
const jellyfin = require('./jellyfin');

// Only providers with an implementation and a defensible source of media are
// exposed to Lampa. The larger catalog is available via /api/providers.
module.exports = [
  own,
  archive,
  wikimedia,
  ...(jellyfin.enabled ? [jellyfin] : [])
];
