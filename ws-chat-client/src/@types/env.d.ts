/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WS_CHANNEL_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }