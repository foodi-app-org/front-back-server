export const numberFormat = (value, options = {
  currency: 'COP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'currency',
  notation: 'standard'
}) => {
  if (value === null || value === undefined) return value

  const locale = {
    COP: 'es-CO',
    USD: 'en-US',
    EUR: 'de-DE'
  }

  let numericValue = value

  if (typeof value === 'string') {
    // Reemplaza miles (.) y decimales (,) para convertirlo en número JS válido
    numericValue = Number(value.replace(/\./g, '').replace(',', '.'))
  }

  if (!isNaN(numericValue)) {
    const settings = { ...options }
    const currencyLocale = typeof locale[options.currency] === 'string' ? locale[options.currency] : 'es-CO'
    // @ts-ignore
    return new Intl.NumberFormat(currencyLocale, settings).format(numericValue)
  }

  return value
}