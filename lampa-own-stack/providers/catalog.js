'use strict';

// Names discovered in the Z01/BWA client-side source list.
// They are intentionally catalog-only here. A name in a client list is not
// proof that an open/public API exists, so they are not exposed as playback
// providers until a separate, permitted adapter is implemented.

const names = [
  'filmix','filmixtv','fxapi','rezka','pizdatoehd','getstv','kinopub','zetflixdb',
  'collaps','hdvb','kodik','bamboo','eneyida','kinoukr','uafilm','uakino',
  'kinotochka','remux','anilibria','animedia','animego','animevost','animebesst',
  'alloha','mirage','phantom','animelib','moonanime','vibix','fancdn','cdnvideohub',
  'vokino','hydraflix','videasy','vidsrc','movpi','vidlink','smashystream',
  'autoembed','pidtor','videoseed','iptvonline','veoveo','kinoflix','leproduction',
  'vkmovie','kinogo','kinobase','asiage','geosaitebi','mikai','dreamerscast'
];

module.exports = names.map(id => ({
  id,
  name: id,
  status: 'catalog-only',
  enabled: false
}));
