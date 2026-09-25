'use strict';

// Names observed in the supplied Lampa/BWA client source list.
// These are identifiers only; they are NOT proof that the upstream service
// is currently active, free, licensed, or has a public API.
const providerIds = [
  'filmix', 'filmixtv', 'fxapi', 'rezka', 'pizdatoehd', 'getstv', 'kinopub',
  'zetflixdb', 'collaps', 'hdvb', 'kodik', 'bamboo', 'eneyida', 'kinoukr',
  'uafilm', 'uakino', 'kinotochka', 'remux', 'anilibria', 'animedia',
  'animego', 'animevost', 'animebesst', 'alloha', 'mirage', 'phantom',
  'animelib', 'moonanime', 'vibix', 'fancdn', 'cdnvideohub', 'vokino',
  'hydraflix', 'videasy', 'vidsrc', 'movpi', 'vidlink', 'smashystream',
  'autoembed', 'pidtor', 'videoseed', 'iptvonline', 'veoveo', 'kinoflix',
  'leproduction', 'vkmovie', 'kinogo', 'kinobase', 'asiage', 'geosaitebi',
  'mikai', 'dreamerscast'
];

module.exports = providerIds.map((id) => ({
  id,
  enabled: false,
  status: 'adapter_pending'
}));
