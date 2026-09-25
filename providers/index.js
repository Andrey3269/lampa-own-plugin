'use strict';

const own = require('./own');

// Only providers with an implemented adapter are exposed to the live API.
// The complete source-name catalogue is available from ./catalog.js.
const activeProviders = [own];

module.exports = activeProviders;
module.exports.active = activeProviders;
module.exports.catalog = require('./catalog');
