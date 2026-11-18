import { createHash } from 'node:crypto'
import { DataTypes, type QueryInterface } from 'sequelize'

/** Forward-only, additive, tenant-scoped identity and commercial audit trail. No refund/payment/stock rows duplicated. */
export async function up(qi: QueryInterface, schemaName: string): Promise<void> {
  if (schemaName === 'public') return
  const operations = { tableName: 'sale_cancellation_operations', schema: schemaName }
  const events = { tableName: 'sale_cancellation_events', schema: schemaName }
  const ix = 'sco_' + createHash('sha256').update(schemaName).digest('hex').slice(0, 12)
  await qi.sequelize.transaction(async transaction => {
    await qi.createTable(operations, {
      id: {type: DataTypes.STRING(36), primaryKey:true, allowNull:false},
      idStore: {type:DataTypes.STRING(36),allowNull:false},
      saleId: {type:DataTypes.STRING(36),allowNull:false},
      saleReference: {type:DataTypes.STRING(100),allowNull:false},
      kind: {type:DataTypes.STRING(24),allowNull:false},
      phase: {type:DataTypes.STRING(32),allowNull:false},
      idempotencyKey: {type:DataTypes.STRING(100),allowNull:false},
      requestHash: {type:DataTypes.STRING(64),allowNull:false},
      refundKey: {type:DataTypes.STRING(100),allowNull:true},
      refundId: {type:DataTypes.STRING(36),allowNull:true},
      reason: {type:DataTypes.TEXT,allowNull:false},
      requestedBy: {type:DataTypes.STRING(100),allowNull:false},
      requestedAt: {type:DataTypes.DATE,allowNull:false},
      updatedAt: {type:DataTypes.DATE,allowNull:false},
      externalReference: {type:DataTypes.STRING(200),allowNull:true},
      fiscalDocumentReference: {type:DataTypes.STRING(200),allowNull:true},
      fiscalStatus: {type:DataTypes.STRING(32),allowNull:false,defaultValue:'NOT_EVALUATED'},
      providerVerified: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false}
    },{transaction})
    await qi.createTable(events, {
      id:{type:DataTypes.STRING(36),primaryKey:true,allowNull:false},
      idStore:{type:DataTypes.STRING(36),allowNull:false},
      operationId:{type:DataTypes.STRING(36),allowNull:false},
      phase:{type:DataTypes.STRING(32),allowNull:false},
      actorId:{type:DataTypes.STRING(100),allowNull:false},
      reason:{type:DataTypes.TEXT,allowNull:false},
      occurredAt:{type:DataTypes.DATE,allowNull:false}
    },{transaction})
    await qi.addIndex(operations,['idStore','idempotencyKey'],{unique:true,name:`${ix}_idem`,transaction})
    await qi.addIndex(operations,['refundKey'],{unique:true,name:`${ix}_refund_key`,transaction})
    await qi.addIndex(operations,['refundId'],{unique:true,name:`${ix}_refund_id`,transaction})
    await qi.addIndex(operations,['idStore','saleId','requestedAt'],{name:`${ix}_by_sale`,transaction})
    await qi.addIndex(events,['idStore','operationId','occurredAt'],{name:`${ix}_events`,transaction})
  })
}
export async function down(): Promise<void> {
  throw new Error('CANCELLATION_FORWARD_ONLY: la evidencia comercial no se elimina mediante rollback')
}
