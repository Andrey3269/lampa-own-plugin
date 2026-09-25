'use strict';

/**
 * Copy this file to providers/<your-id>.js.
 *
 * The provider must expose:
 *   id       - URL-safe unique id
 *   name     - name shown in Lampa
 *   search() - returns true/false or an array when the title exists
 *   streams()- returns Lampa play/link rows
 *
 * Only use APIs/endpoints you are authorized to access.
 */

module.exports = {
  id: 'source-template',
  name: 'Source Template',

  async search() {
    return false;
  },

  async streams() {
    return [];
  }
};
