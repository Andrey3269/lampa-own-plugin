'use strict';

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, ' ')
    .trim();
}

function qualityOf(value) {
  const s = String(value || '').toLowerCase();
  if (/2160|4k|uhd/.test(s)) return 2160;
  if (/1440/.test(s)) return 1440;
  if (/1080|fullhd|full hd/.test(s)) return 1080;
  if (/720|hd/.test(s)) return 720;
  if (/480/.test(s)) return 480;
  if (/360/.test(s)) return 360;
  return 0;
}

function pickQualityLabel(value) {
  const q = qualityOf(value);
  return q ? String(q) + 'p' : 'Original';
}

function row({ title, url, voice, quality, meta }) {
  return {
    method: 'play',
    text: voice || 'Original',
    title: title || '',
    url,
    voice_name: voice || 'Original',
    quality: quality ? { [quality]: url } : undefined,
    meta: meta || undefined
  };
}

module.exports = { normalizeTitle, qualityOf, pickQualityLabel, row };
