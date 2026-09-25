'use strict';

async function fetchJson(url, options = {}) {
  const timeoutMs = Number(options.timeoutMs || 8000);
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body,
      signal: controller ? controller.signal : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    return await response.json();
  } finally {
    if (timer) clearTimeout(timer);
  }
}

module.exports = { fetchJson };
