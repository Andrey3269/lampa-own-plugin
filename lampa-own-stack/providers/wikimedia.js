'use strict';

const { qualityOf, row } = require('./provider-utils');

const API = 'https://commons.wikimedia.org/w/api.php';

function allowedLicense(meta) {
  const candidates = [
    meta && meta.LicenseShortName && meta.LicenseShortName.value,
    meta && meta.LicenseUrl && meta.LicenseUrl.value,
    meta && meta.UsageTerms && meta.UsageTerms.value
  ].filter(Boolean).map(v => String(v).toLowerCase());

  if (!candidates.length) return false;
  return candidates.some(v =>
    v.includes('public domain') ||
    v.includes('cc0') ||
    v.includes('cc by') ||
    v.includes('cc-by')
  ) && !candidates.some(v => v.includes('noncommercial') || /\bcc[- ]?by[- ]?nc\b/.test(v));
}

async function searchFiles(title) {
  if (!title) return [];
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: title,
    gsrnamespace: '6',
    gsrlimit: '10',
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata'
  });
  const response = await fetch(API + '?' + params.toString(), {
    headers: { 'Accept': 'application/json', 'User-Agent': 'lampa-own-stack/1.0' }
  });
  if (!response.ok) throw new Error(`Wikimedia HTTP ${response.status}`);
  const json = await response.json();
  const pages = json && json.query && json.query.pages ? Object.values(json.query.pages) : [];

  return pages.flatMap(page => {
    const info = page.imageinfo && page.imageinfo[0];
    if (!info || !info.url || !String(info.mime || '').startsWith('video/')) return [];
    if (!allowedLicense(info.extmetadata || {})) return [];

    const quality = qualityOf(page.title);
    return [{
      title: page.title.replace(/^File:/i, ''),
      url: info.url,
      quality,
      source_url: info.descriptionurl,
      license: (info.extmetadata && info.extmetadata.LicenseShortName && info.extmetadata.LicenseShortName.value) || ''
    }];
  });
}

module.exports = {
  id: 'wikimedia',
  name: 'Wikimedia Commons Video',
  enabled: true,
  async search(params) {
    const rows = await searchFiles(params.title || params.original_title);
    return rows.length > 0;
  },
  async streams(params) {
    const rows = await searchFiles(params.title || params.original_title);
    return rows.map(item => row({
      title: item.title,
      url: item.url,
      voice: 'Original',
      quality: item.quality || undefined,
      meta: { source: 'Wikimedia Commons', license: item.license, source_url: item.source_url }
    }));
  }
};
