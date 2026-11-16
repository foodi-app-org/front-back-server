import type { GraphQLContext } from '@shared/types/context'
import { ContextValidator } from '@shared/utils/context-validator'
import { requireRule, id } from '../../domain/services/cash-money'
import type { Actor } from '../../application/use-cases/cash-operations'
import { GraphQLError } from 'graphql'
import { JwtTokenService } from '@modules/auth/infrastructure/services/jwt-token.service'


export type CashPermission = 'read'|'manage'|'open'|'collect'|'move'|'close'|'approve'|'audit'
/** Explicit opt-in: roles and allowlist are OFF for the requested development pilot.
 * Do not use unrestricted settings on a multi-user production installation.
 * Physical custody, authenticated context, tenant, money and state are never bypassed.
 */
export const CASH_ACCESS_CONFIG = Object.freeze({
  validatePermissions: process.env.VENTY_CASH_VALIDATE_PERMISSIONS === 'true',
  validateEnabledStores: process.env.VENTY_CASH_VALIDATE_STORES === 'true',
  enforceBlindCount: process.env.VENTY_CASH_ENFORCE_BLIND_COUNT !== 'false'
})
/** Backwards-compatible alias for local resolvers updated in the prior fix. */
export const VALIDATE_CASH_ACCESS = CASH_ACCESS_CONFIG.validatePermissions
function jsonEnv(name:string):unknown { try{return JSON.parse(process.env[name]??'null')}catch{return null} }
export function cashEnabled(store:string):boolean {
  if(!CASH_ACCESS_CONFIG.validateEnabledStores) return true
  const stores=jsonEnv('VENTY_CASH_STORES')
  return Array.isArray(stores)&&stores.includes(store)
}
export function permission(actor:Actor,perm:CashPermission):boolean {
  if(!CASH_ACCESS_CONFIG.validatePermissions)return true
  const config=jsonEnv('VENTY_CASH_GRANTS')
  return Array.isArray(config)&&config.some(g=>g&&g.store===actor.storeId&&g.user===actor.id&&Array.isArray(g.permissions)&&g.permissions.includes(perm))
}
export function sessionActor(context:GraphQLContext):Actor {
  const storeId=new ContextValidator(context).validateUserSession()
  requireRule(typeof storeId==='string'&&/^[a-zA-Z0-9_-]{1,36}$/.test(storeId)&&!storeId.startsWith('tenant_'),'INVALID_TENANT','La sesión no identifica un comercio válido (usa idStore sin prefijo tenant_)')
  requireRule(typeof context.User?.id==='string'&&context.User.id.trim().length>0,'CASH_ACTOR_REQUIRED','No se pudo identificar el operador. Verifica la sesión autenticada.')
  return {storeId,id:id(context.User.id)}
}
export function authorizedCash(context:GraphQLContext,perm:CashPermission):Actor {
  const actor=sessionActor(context)
  requireRule(cashEnabled(actor.storeId),'CASH_STORE_DISABLED','La gestión de caja no está habilitada para este comercio')
  requireRule(permission(actor,perm),'FORBIDDEN','No tienes permiso para esta operación de caja')
  return actor
}

/** Explicit development-only exception, independent of RBAC. */
export const allowSelfApproval = process.env.NODE_ENV !== 'production' && process.env.VENTY_CASH_ALLOW_SELF_APPROVAL === 'true'
interface CashSocketParams {
  authorization?: string
  restaurant?: string
}

interface TokenClaims {
  sub?: string
  type?: string
}

export function authorizeCashSocket(
  params: unknown,
  requestedStore: string
): string {
  const connection = params as CashSocketParams | undefined

  const token = connection?.authorization
    ?.replace(/^Bearer\s+/i, '')
    .trim()

  if (!token) {
    throw new GraphQLError('Token no proporcionado', {
      extensions: {
        code: 'UNAUTHENTICATED'
      }
    })
  }

  let claims: TokenClaims

  try {
    claims = new JwtTokenService()
      .verify<TokenClaims>(token)
  } catch {
    throw new GraphQLError('Token inválido o expirado', {
      extensions: {
        code: 'UNAUTHENTICATED'
      }
    })
  }

  if (!claims?.sub || claims.type === 'refresh') {
    throw new GraphQLError('Token de acceso inválido', {
      extensions: {
        code: 'UNAUTHENTICATED'
      }
    })
  }

  if (
    !requestedStore ||
    !/^[a-zA-Z0-9_-]{1,36}$/.test(requestedStore) ||
    requestedStore.startsWith('tenant_') ||
    connection?.restaurant !== requestedStore
  ) {
    throw new GraphQLError('Comercio inválido', {
      extensions: {
        code: 'INVALID_TENANT'
      }
    })
  }

  return claims.sub
}