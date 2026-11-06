/**
 * Servicio de dominio para la generación de códigos de barras de producto.
 *
 * Genera EAN-13 de USO INTERNO para un POS colombiano. El rango de prefijos
 * 20–29 está reservado por GS1 para códigos de circulación interna de la tienda
 * (no son GTIN oficiales), lo que evita colisiones con los GTIN reales de
 * fabricantes (p. ej. el prefijo nacional 770 de Colombia). Es la convención
 * estándar para artículos sin código de fábrica (graneles, preparados, etc.).
 */

/** Prefijo de uso interno (GS1 restricted circulation). */
const INTERNAL_USE_PREFIX = '2'

/**
 * Calcula el dígito de control EAN-13 para una base de 12 dígitos.
 * @param baseCode - Base EAN-13 de exactamente 12 dígitos.
 * @returns Dígito de control (0-9).
 */
export const calculateEAN13Checksum = (baseCode: string): number => {
  if (!/^\d{12}$/.test(baseCode)) {
    throw new Error('Base EAN-13 code must be exactly 12 numeric digits')
  }
  const digits = baseCode.split('').map(Number)
  const sum = digits.reduce((acc, digit, idx) => acc + digit * (idx % 2 === 0 ? 1 : 3), 0)
  const modulo = sum % 10
  return modulo === 0 ? 0 : 10 - modulo
}

/**
 * Genera un EAN-13 válido (13 dígitos + checksum) de uso interno.
 * Estructura: `2` + 11 dígitos aleatorios + 1 dígito de control.
 */
export const generateEAN13Barcode = (): string => {
  const randomBody = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('')
  const base = `${INTERNAL_USE_PREFIX}${randomBody}`
  const checksum = calculateEAN13Checksum(base)
  return `${base}${checksum}`
}

/**
 * Genera un EAN-13 de uso interno garantizando que no exista aún (según la
 * función `exists` provista, típicamente respaldada por el repositorio y la
 * restricción UNIQUE de `ProBarCode`). Reintenta hasta `maxAttempts` veces.
 *
 * @param exists - Predicado async que indica si un código ya está en uso.
 * @param maxAttempts - Número máximo de reintentos (por defecto 5).
 * @returns Un EAN-13 válido y (muy probablemente) único.
 */
export const generateUniqueEAN13Barcode = async (
  exists: (barcode: string) => Promise<boolean>,
  maxAttempts = 5
): Promise<string> => {
  let barcode = generateEAN13Barcode()

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const alreadyExists = await exists(barcode)
    if (!alreadyExists) {
      return barcode
    }
    barcode = generateEAN13Barcode()
  }

  return barcode
}
