import { I18nPort } from './i18n.port'
import { getLocales } from './index'

export class I18nAdapter implements I18nPort {
  private readonly translations: Record<string, string>

  constructor(private readonly lang: 'es' | 'en' = 'es', private readonly moduleName: string = 'auth') {
    this.translations = getLocales(this.moduleName, this.lang)
  }

  t(key: string, params: Record<string, unknown> = {}): string {
    const template = this.translations[key] || key
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(`{{${k}}}`, String(v)),
      template
    )
  }
}
