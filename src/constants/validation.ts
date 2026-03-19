export const NOT_ALLOWED_SYMBOLS = ':;,=/{}%&\\"';
export const NOT_ALLOWED_SPACES = '(\r\n|\n|\r|\t)|[\x00-\x1F]';
export const NOT_ALLOWED_SYMBOLS_REGEXP = new RegExp(
  `[${NOT_ALLOWED_SYMBOLS}]|${NOT_ALLOWED_SPACES}`,
  'gm',
);
export const NOT_ALLOWED_SPACES_REGEXP = new RegExp(NOT_ALLOWED_SPACES, 'gm');
