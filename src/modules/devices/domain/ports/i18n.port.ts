
export interface I18nPort {
  t(key: string, params?: Record<string, unknown>): string;
}
