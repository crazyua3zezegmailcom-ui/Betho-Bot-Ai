import { sticker } from '../lib/sticker.js';

/**
 * createSticker(buffer, { mime, pack, author })
 * Wraps lib/sticker.js and returns a WebP sticker Buffer.
 */
export async function createSticker(buffer, { mime = '', pack = '', author = '' } = {}) {
  return sticker(buffer, null, pack, author);
}
