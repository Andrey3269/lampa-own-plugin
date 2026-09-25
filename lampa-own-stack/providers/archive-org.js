'use strict';

const { normalizeTitle, qualityOf, row } = require('./provider-utils');

const SEARCH_URL = 'https://archive.org/advancedsearch.php';
const META_URL = 'https://archive.org/metadata/';
const MAX_RESULTS = 6;

function isAllowedLicense(metadata) {
  const values = [
    metadata && metadata.licenseurl,
    metadata && metadata.license,
    metadata && metadata.rights
  ].filter(Boolean).map(v => String(v).toLowerCase());

  if (!values.length) return false;
  return values.some(v =>
    v.includes('creativecommons.org/licenses/') ||
    v.includes('creativecommons.org/publicdomain/') ||
    v.includes('creative commons') ||
    v.includes('public domain') ||
    v.includes('cc0')
  );
}

function isPlayableVideo(file) {
  if (!file || file.private === '1' || file.private === 1) return false;
  const name = String(file.name || '');
  const format = String(file.format || '').toLowerCase();
  return /\.(mp4|webm|ogv|m4v)$/i.test(name) ||
    /mpeg-4|mpeg4|h\.264|webm|ogg video|quicktime/i.test(format);
}

function directUrl(identifier, filename) {
  return 'https://archive.org/download/' + encodeURIComponent(identifier) + '/' + encodeURIComponent(filename).replace(/%2F/g, '/');
}

async function searchItems(title) {
  const queryTitle = String(title || '').trim();
  if (!queryTitle) return [];

  const params = new URLSearchParams();
  params.set('q', `title:(${queryTitle}) AND (mediatype:movies OR mediatype:video)`);
  params.append('fl[]', 'identifier');
  params.append('fl[]', 'title');
  params.append('fl[]', 'year');
  params.append('fl[]', 'description');
  params.append('fl[]', 'licenseurl');
  params.append('fl[]', 'rights');
  params.set('rows', String(MAX_RESULTS));
  params.set('page', '1');
  params.set('output', 'json');

  const response = await fetch(SEARCH_URL + '?' + params.toString(), {
    headers: { 'Accept': 'application/json' }
  });
  if (!response.ok) throw new Error(`archive search HTTP ${response.status}`);
  const json = await response.json();
  return json && json.response && Array.isArray(json.response.docs) ? json.response.docs : [];
}

async function getMetadata(identifier) {
  const response = await fetch(META_URL + encodeURIComponent(identifier), {
    headers: { 'Accept': 'application/json' }
  });
  if (!response.ok) throw new Error(`archive metadata HTTP ${response.status}`);
  return response.json();
}

async function getCandidates(params) {
  const title = params.title || params.original_title;
  if (!title) return [];

  const docs = await searchItems(title);
  const candidates = [];

  for (const doc of docs) {
    try {
      const id = doc.identifier;
      if (!id) continue;
      const meta = await getMetadata(id);
      const metadata = meta.metadata || {};
      if (!isAllowedLicense(metadata)) continue;

      const files = Array.isArray(meta.files) ? meta.files.filter(isPlayableVideo) : [];
      for (const file of files) {
        const fileName = String(file.name || '');
        const quality = qualityOf(fileName);
        candidates.push({
          title: metadata.title || doc.title || title,
          url: directUrl(id, fileName),
          quality,
          descriptionUrl: 'https://archive.org/details/' + encodeURIComponent(id),
          license: metadata.licenseurl || metadata.license || metadata.rights || ''
        });
      }
    } catch (error) {
      console.error('[archive-org]', idError(error));
    }
  }

  return candidates
    .sort((a, b) => b.quality - a.quality)
    .slice(0, 10);
}

function idError(error) {
  return error && error.message ? error.message : String(error || 'error');
}

module.exports = {
  id: 'archive-org',
  name: 'Internet Archive (CC/Public Domain)',
  enabled: true,
  async search(params) {
    const rows = await getCandidates(params);
    return rows.length > 0;
  },
  async streams(params) {
    const rows = await getCandidates(params);
    return rows.map(item => row({
      title: item.title,
      url: item.url,
      voice: 'Original',
      quality: item.quality || undefined,
      meta: {
        source: 'Internet Archive',
        license: item.license,
        source_url: item.descriptionUrl
      }
    }));
  }
};
