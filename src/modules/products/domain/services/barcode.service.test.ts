import {
  calculateEAN13Checksum,
  detectBarcodeFormat,
  generateEAN13Barcode,
  isValidBarcode,
  normalizeBarcode
} from './barcode.service'

describe('barcode.service - normalizeBarcode', () => {
  it('recorta espacios y saltos de línea del lector', () => {
    expect(normalizeBarcode('  7701234567890 \n')).toBe('7701234567890')
    expect(normalizeBarcode('770123\t4567890')).toBe('7701234567890')
  })

  it('preserva ceros a la izquierda (no convierte a número)', () => {
    expect(normalizeBarcode('0001234567890')).toBe('0001234567890')
  })

  it('acepta número y lo vuelve string sin perder información', () => {
    expect(normalizeBarcode(7701234567890)).toBe('7701234567890')
  })

  it('devuelve cadena vacía para null/undefined', () => {
    expect(normalizeBarcode(null)).toBe('')
    expect(normalizeBarcode(undefined)).toBe('')
  })
})

describe('barcode.service - detectBarcodeFormat', () => {
  it('detecta EAN-13 válido (checksum correcto)', () => {
    // 2 + 11 aleatorios + checksum: generado por el propio servicio
    const code = generateEAN13Barcode()
    expect(detectBarcodeFormat(code)).toBe('EAN13')
  })

  it('EAN-13 con checksum incorrecto NO se detecta como EAN13', () => {
    // 4006381333931 es un EAN-13 válido; con 0 final el checksum es incorrecto.
    expect(detectBarcodeFormat('4006381333930')).not.toBe('EAN13')
  })

  it('detecta UPC-A (12 dígitos con checksum)', () => {
    // 036000291452 es un UPC-A válido clásico.
    expect(detectBarcodeFormat('036000291452')).toBe('UPC_A')
  })

  it('detecta EAN-8 válido', () => {
    // 96385074 es un EAN-8 válido clásico.
    expect(detectBarcodeFormat('96385074')).toBe('EAN8')
  })

  it('detecta CODE39 alfanumérico en mayúsculas', () => {
    expect(detectBarcodeFormat('ABC-123')).toBe('CODE39')
  })

  it('detecta CODE128 para ASCII imprimible mixto', () => {
    expect(detectBarcodeFormat('abc123XYZ')).toBe('CODE128')
  })

  it('numérico sin longitud/checksum estándar cae a CODE128', () => {
    expect(detectBarcodeFormat('12345')).toBe('CODE128')
  })

  it('devuelve null para vacío o demasiado largo', () => {
    expect(detectBarcodeFormat('')).toBeNull()
    expect(detectBarcodeFormat('x'.repeat(51))).toBeNull()
  })
})

describe('barcode.service - isValidBarcode', () => {
  it('es true para un EAN-13 generado', () => {
    expect(isValidBarcode(generateEAN13Barcode())).toBe(true)
  })

  it('es false para cadena vacía', () => {
    expect(isValidBarcode('')).toBe(false)
  })
})

describe('barcode.service - generateEAN13Barcode', () => {
  it('genera 13 dígitos válidos con prefijo de uso interno 2', () => {
    for (let i = 0; i < 200; i++) {
      const code = generateEAN13Barcode()
      expect(code).toMatch(/^\d{13}$/)
      expect(code[0]).toBe('2')
      // checksum coherente
      const base = code.slice(0, 12)
      expect(String(calculateEAN13Checksum(base))).toBe(code[12])
    }
  })
})
