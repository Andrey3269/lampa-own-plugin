import assert from 'node:assert/strict';

const archive = await import('../providers/archive-org.js');
const wikimedia = await import('../providers/wikimedia.js');
const jellyfin = await import('../providers/jellyfin.js');

assert.equal(archive.default?.id || archive.id, 'archive-org');
assert.equal(wikimedia.default?.id || wikimedia.id, 'wikimedia');
assert.equal(jellyfin.default?.id || jellyfin.id, 'jellyfin');

console.log('provider exports: OK');
