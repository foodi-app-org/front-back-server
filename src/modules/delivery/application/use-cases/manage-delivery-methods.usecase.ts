import type { DeliveryRepository } from '../../domain/repositories/delivery.repository'
import type { CreateDeliveryMethod, UpdateDeliveryMethod } from '../../domain/entities/delivery-method.entity'
import { validateMethod } from '../../domain/services/delivery-policy'
import { DeliveryError, invalid } from '../../domain/services/delivery-error'
export class ListDeliveryMethodsUseCase<Tx> {
  constructor(private readonly repo: DeliveryRepository<Tx>) {}
  execute(includeInactive = false) { return this.repo.listMethods(includeInactive) }
}
export class CreateDeliveryMethodUseCase<Tx> {
  constructor(private readonly repo: DeliveryRepository<Tx>, private readonly idStore: string, private readonly newId: () => string) {}
  execute(input: CreateDeliveryMethod, actor: string) {
    validateMethod(input)
    if (input.mode === 'NONE') invalid('Utiliza la modalidad de retiro inicial')
    const now = new Date()
    return this.repo.createMethod({ ...input, id: this.newId(), idStore: this.idStore, revision: 1, createdBy: actor, updatedBy: actor, createdAt: now, updatedAt: now })
  }
}
export class UpdateDeliveryMethodUseCase<Tx> {
  constructor(private readonly repo: DeliveryRepository<Tx>) {}
  async execute(id: string, expectedRevision: number, patch: UpdateDeliveryMethod, actor: string) {
    const current = await this.repo.findMethod(id)
    if (!current) throw new DeliveryError('DELIVERY_NOT_FOUND', 'Modalidad no encontrada')
    if (current.revision !== expectedRevision) throw new DeliveryError('DELIVERY_CONFLICT', 'La modalidad fue modificada; vuelve a cargarla')
    if (current.mode === 'NONE' && patch.active === false) invalid('No puedes deshabilitar el retiro sin domicilio')
    validateMethod({ ...current, ...patch })
    const updated = await this.repo.updateMethod(id, expectedRevision, patch, actor)
    if (!updated) throw new DeliveryError('DELIVERY_CONFLICT', 'La modalidad fue modificada concurrentemente')
    return updated
  }
}
