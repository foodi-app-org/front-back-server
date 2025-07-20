/**
 * Generate a valid 13-digit EAN-13 barcode with checksum
 * @returns {string} A valid 13-digit EAN-13 barcode
 */
export const generateEAN13Barcode = () => {
  const base = '770' + Math.floor(Math.random() * 1e9).toString().padStart(9, '0') // 770 = Colombia prefix
  const checksum = calculateEAN13Checksum(base)
  return `${base}${checksum}`
}

/**
 * Calculate EAN-13 checksum digit for 12-digit base
 * @param {string} baseCode - 12-digit EAN-13 base code
 * @returns {number} Checksum digit (0-9)
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
