/**
 * Prefijo de "uso interno / circulación restringida" según GS1.
 *
 * El rango de prefijos 20–29 está reservado por GS1 para códigos de uso interno
 * de una tienda (no son GTIN oficiales registrados). Usar este rango para los
 * códigos que generamos automáticamente evita colisionar con GTIN reales de
 * fabricantes (p. ej. los que empiezan con 770, el prefijo nacional de
 * Colombia asignado a empresas registradas ante LOGYCA/GS1 Colombia).
 *
 * Es exactamente la convención que usan los sistemas POS para artículos sin
 * código de fábrica (graneles, preparados, productos propios).
 */
const INTERNAL_USE_PREFIX = '2'

/**
 * Calcula el dígito de control (checksum) EAN-13 para una base de 12 dígitos.
 * @param {string} baseCode - Base EAN-13 de exactamente 12 dígitos.
 * @returns {number} Dígito de control (0-9).
 */
export const calculateEAN13Checksum = (baseCode) => {
  if (!/^\d{12}$/.test(baseCode)) {
    throw new Error('Base EAN-13 code must be exactly 12 numeric digits')
  }

  const digits = baseCode.split('').map(Number)
  const sum = digits.reduce((acc, digit, idx) => acc + digit * (idx % 2 === 0 ? 1 : 3), 0)

  const modulo = sum % 10
  return modulo === 0 ? 0 : 10 - modulo
}

/**
 * Genera un EAN-13 válido (13 dígitos + checksum) de USO INTERNO para un POS
 * colombiano. Estructura: `2` (prefijo interno) + 11 dígitos aleatorios + 1
 * dígito de control. El resultado es escaneable por cualquier lector de POS.
 *
 * @returns {string} Un EAN-13 de 13 dígitos válido, listo para almacenar.
 */
export const generateEAN13Barcode = () => {
  // 11 dígitos aleatorios para completar los 12 de la base (prefijo + cuerpo).
  const randomBody = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('')
  const base = `${INTERNAL_USE_PREFIX}${randomBody}`
  const checksum = calculateEAN13Checksum(base)
  return `${base}${checksum}`
}

/**
 * Genera un EAN-13 de uso interno garantizando que no exista aún en la base de
 * datos (respeta la restricción UNIQUE de `ProBarCode`). Reintenta hasta
 * `maxAttempts` veces; si tras los intentos no logra uno libre, devuelve el
 * último generado (la probabilidad de colisión real es mínima y la restricción
 * UNIQUE sigue protegiendo la integridad).
 *
 * @param {Object} params
 * @param {(barcode: string) => Promise<boolean>} params.exists - Función que
 *   indica si un código ya existe en el tenant/tienda actual.
 * @param {number} [params.maxAttempts=5] - Número máximo de reintentos.
 * @returns {Promise<string>} Un EAN-13 válido y (muy probablemente) único.
 */
export const generateUniqueEAN13Barcode = async ({ exists, maxAttempts = 5 }) => {
  let barcode = generateEAN13Barcode()

  if (typeof exists !== 'function') {
    return barcode
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const alreadyExists = await exists(barcode)
    if (!alreadyExists) {
      return barcode
    }
    barcode = generateEAN13Barcode()
  }

  return barcode
}
