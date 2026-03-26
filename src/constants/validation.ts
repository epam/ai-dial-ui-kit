export const NOT_ALLOWED_SYMBOLS = ':;,=/{}%&\\"';
export const NOT_ALLOWED_SPACES = '(\r\n|\n|\r|\t)|[\x00-\x1F]';
const NOT_ALLOWED_SYMBOLS_CHARACTER_CLASS = `[${NOT_ALLOWED_SYMBOLS.replace(/\\/g, '\\\\')}]`;
export const NOT_ALLOWED_SYMBOLS_REGEXP = new RegExp(
  `${NOT_ALLOWED_SYMBOLS_CHARACTER_CLASS}|${NOT_ALLOWED_SPACES}`,
);
export const NOT_ALLOWED_SPACES_REGEXP = new RegExp(NOT_ALLOWED_SPACES);
