import { getTenantName, removeTenantPrefix } from './tenant.utils'

describe('tenant.utils', () => {
  describe('getTenantName', () => {
    it('should return a tenant name with prefix', () => {
      expect(getTenantName('abc123')).toBe('tenant_abc123')
    })

    it('should handle numeric tenantId', () => {
      expect(getTenantName(456)).toBe('tenant_456')
    })

    it('should handle empty tenantId', () => {
      expect(getTenantName('')).toBe('tenant_')
    })

    it('should handle undefined tenantId', () => {
      // @ts-expect-error testing undefined input
      expect(getTenantName(undefined)).toBe('tenant_undefined')
    })
  })

  describe('removeTenantPrefix', () => {
    it('should remove the tenant_ prefix', () => {
      expect(removeTenantPrefix('tenant_abc123')).toBe('abc123')
    })

    it('should return the same value if no tenant_ prefix is present', () => {
      expect(removeTenantPrefix('abc123')).toBe('abc123')
    })

    it('should return an empty string on error or invalid input', () => {
      expect(removeTenantPrefix(undefined)).toBe('')
      expect(removeTenantPrefix(undefined)).toBe('')
      expect(removeTenantPrefix({})).toBe('')
    })

    it('should handle empty string input', () => {
      expect(removeTenantPrefix('')).toBe('')
    })

    it('should not fail if called with number or boolean', () => {
      expect(removeTenantPrefix('tenant_123')).toBe('123')
      expect(removeTenantPrefix('tenant_true')).toBe('true')
    })
  })
})
