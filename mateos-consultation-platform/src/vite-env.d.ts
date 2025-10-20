/// <reference types="vite/client" />

// Расширяем интерфейс Window для флага диагностики
interface Window {
  __diagnosisCompleted?: boolean;
}
/// <reference types="react" />
/// <reference types="react-dom" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SIGNALR_HUB_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
