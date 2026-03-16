/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THEME_COLORS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
