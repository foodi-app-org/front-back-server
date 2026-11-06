/**
 * Servicio de dominio para la generación y validación de códigos de barras.
 *
 * ── Generación de EAN-13 interno ──────────────────────────────────────────
 * Genera EAN-13 de USO INTERNO para un POS colombiano. El rango de prefijos
 * 20–29 está reservado por GS1 para códigos de circulación interna de la tienda
 * (no son GTIN oficiales), lo que evita colisiones con los GTIN reales de
 * fabricantes (p. ej. el prefijo nacional 770 de Colombia). Es la convención
 * estándar para artículos sin código de fábrica (graneles, preparados, etc.).
 *
 * ── ¿CUÁNDO se activa la autogeneración? ──────────────────────────────────
 * SOLO cuando el producto se crea SIN código de barras (campo `ProBarCode`
 * vacío/undefined). La decisión vive en `CreateProductTypeUseCase.execute`:
 *   - Si el usuario envía un código (p. ej. el EAN de fábrica), se RESPETA ese
 *     valor tal cual (nunca se sobrescribe) y solo se valida que no esté
 *     duplicado dentro de la tienda (findAnyByProBarCode + idStore).
 *   - Si NO se envía código, se llama a `generateUniqueEAN13Barcode`, que:
 *       1. genera `2` + 11 dígitos aleatorios + dígito de control (EAN-13 válido),
 *       2. verifica contra el repositorio (por tienda) que no colisione,
 *       3. reintenta hasta 5 veces si hubiera colisión.
 * Así nunca se producen inconsistencias con códigos comerciales existentes:
 * los códigos de fábrica se conservan y los internos usan un rango distinto.
 *
 * ── Normalización y validación ────────────────────────────────────────────
 * `normalizeBarcode` recorta espacios/saltos de línea preservando ceros a la
 * izquierda (nunca convierte a número). `detectBarcodeFormat`/`isValidBarcode`
 * validan el formato (EAN-13/8, UPC-A/E, CODE128/39, ITF) ANTES de consultar la
 * base, para evitar consultas inútiles.
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

/* -------------------------------------------------------------------------- */
/* Normalización y validación multi-formato (fuente de verdad del backend)    */
/* -------------------------------------------------------------------------- */

/**
 * Formatos lineales soportados. La lista puede ampliarse sin cambiar la lógica
 * de consulta/carrito: solo se agrega el caso en `detectBarcodeFormat`.
 */
export type BarcodeFormat =
  | 'EAN13'
  | 'EAN8'
  | 'UPC_A'
  | 'UPC_E'
  | 'CODE128'
  | 'CODE39'
  | 'ITF'

/** Longitud máxima persistible (debe coincidir con la columna STRING(50)). */
export const MAX_BARCODE_LENGTH = 50

/**
 * Normaliza un código escaneado/ingresado SIN perder información significativa:
 * - Recorta espacios al inicio/fin (los lectores suelen añadir espacios o un
 *   salto de línea final).
 * - NO convierte a número: preserva ceros a la izquierda y valores
 *   alfanuméricos (CODE128/CODE39).
 * - Colapsa espacios internos accidentales solo en los extremos; los espacios
 *   internos legítimos de CODE39 se conservan.
 *
 * @param raw - Valor crudo (string o número proveniente del lector/front).
 * @returns El código normalizado como string.
 */
export const normalizeBarcode = (raw: string | number | null | undefined): string => {
  if (raw === null || raw === undefined) return ''
  // Importante: usar String() preserva ceros a la izquierda y no pierde
  // precisión; nunca se hace parseInt/Number sobre el código.
  return `${raw}`.replace(/[\r\n\t]/g, '').trim()
}

/** Checksum módulo-10 EAN/UPC (pesos 3/1 desde la derecha) sobre todos los dígitos menos el último. */
const hasValidEanUpcChecksum = (value: string): boolean => {
  const digits = value.split('').map(Number)
  const checkDigit = digits[digits.length - 1]
  const body = digits.slice(0, -1).reverse()
  const sum = body.reduce((acc, digit, index) => acc + digit * (index % 2 === 0 ? 3 : 1), 0)
  const calculated = (10 - (sum % 10)) % 10
  return calculated === checkDigit
}

const isValidEAN13 = (v: string): boolean => /^\d{13}$/.test(v) && hasValidEanUpcChecksum(v)
const isValidEAN8 = (v: string): boolean => /^\d{8}$/.test(v) && hasValidEanUpcChecksum(v)
const isValidUPCA = (v: string): boolean => /^\d{12}$/.test(v) && hasValidEanUpcChecksum(v)
const isValidUPCE = (v: string): boolean => /^\d{8}$/.test(v) // UPC-E: 8 dígitos (checksum depende de la expansión)
const isValidITF = (v: string): boolean => /^\d+$/.test(v) && v.length % 2 === 0 && v.length >= 6
const isValidCODE39 = (v: string): boolean => /^[0-9A-Z\-.$/+%\s]+$/.test(v)
const isValidCODE128 = (v: string): boolean => /^[\x20-\x7E]+$/.test(v) && v.length > 0

/**
 * Detecta el formato de un código ya normalizado. Prioriza los formatos con
 * dígito de control (EAN/UPC) y cae a los alfanuméricos (CODE39/CODE128).
 * Devuelve `null` cuando no corresponde a ningún formato soportado.
 */
export const detectBarcodeFormat = (value: string): BarcodeFormat | null => {
  const v = normalizeBarcode(value)
  if (!v || v.length > MAX_BARCODE_LENGTH) return null

  if (/^\d+$/.test(v)) {
    if (v.length === 13 && isValidEAN13(v)) return 'EAN13'
    if (v.length === 12 && isValidUPCA(v)) return 'UPC_A'
    if (v.length === 8 && isValidEAN8(v)) return 'EAN8'
    if (v.length === 8 && isValidUPCE(v)) return 'UPC_E'
    if (isValidITF(v)) return 'ITF'
    // Numérico sin checksum/longitud estándar: representable como CODE128.
    return 'CODE128'
  }

  if (isValidCODE39(v)) return 'CODE39'
  if (isValidCODE128(v)) return 'CODE128'
  return null
}

/**
 * Indica si un código (ya normalizado o no) es válido en ALGÚN formato
 * soportado. Es la validación de formato que el backend aplica ANTES de
 * consultar la base de datos, para evitar consultas inútiles con basura.
 */
export const isValidBarcode = (value: string): boolean => {
  return detectBarcodeFormat(value) !== null
}
