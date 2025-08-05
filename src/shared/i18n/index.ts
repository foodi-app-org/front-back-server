import * as storeEn from './locales/store/en'
import * as storeEs from './locales/store/es'

type LocaleLang = 'es' | 'en';

const locales: Record<string, Record<LocaleLang, Record<string, string>>> = {
  store: {
    es: storeEs.default,
    en: storeEn.default
  },
}

export function getLocales(module: string, lang: LocaleLang) {
  return {
    ...(locales[module]?.[lang] || {}),
  }
}
