/**
 * Returns the full tenant name with prefix
 * @param tenantId string | number
 * @returns tenant string prefixed with "tenant_"
 */
export const getTenantName = (tenantId: string | number): string => `tenant_${tenantId}`

/**
 * Removes the "tenant_" prefix from a string, if present
 * @param tenantName value that may or may not include the prefix
 * @returns tenant name without prefix or empty string on error
 */
export const removeTenantPrefix = (tenantName: unknown): string => {
  try {
    if (typeof tenantName !== 'string') {
      return ''
    }

    return tenantName.startsWith('tenant_') ? tenantName.slice(7) : tenantName
  } catch (error) {
    console.error(`Error removing tenant prefix: ${error}`)
    return ''
  }
}
