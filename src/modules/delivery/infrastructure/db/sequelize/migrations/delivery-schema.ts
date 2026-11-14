import { DELIVERY_MODES } from '../../../../domain/entities/delivery-method.entity'
/** SQLite represents Sequelize schemas as a single physical identifier: tenant_x.table. */
export type DeliveryDialect = 'postgres' | 'sqlite'
export function dialectOf(value: string): DeliveryDialect {
  if (value !== 'postgres' && value !== 'sqlite') throw new Error('Delivery supports PostgreSQL and SQLite only')
  return value
}
export function validateSchema(schema: string) {
  if (!/^(public|tenant_[a-zA-Z0-9_-]{1,36})$/.test(schema)) throw new Error('Invalid delivery schema')
  return schema
}
const q = (value: string) => `"${value.replace(/"/g, '""')}"`
export const table = (dialect: DeliveryDialect, schema: string, name: string) => dialect === 'sqlite' ? q(`${validateSchema(schema)}.${name}`) : `${q(validateSchema(schema))}.${q(name)}`
const index = (dialect: DeliveryDialect, schema: string, name: string) => q(dialect === 'sqlite' ? `${validateSchema(schema)}.${name}` : name)
const modes = DELIVERY_MODES.map(mode => `'${mode}'`).join(', ')
const max = '9007199254740991'
const money = (dialect: DeliveryDialect, name: string, nullable = false) => {
  const col = q(name), integer = dialect === 'sqlite' ? `typeof(${col}) = 'integer' AND ` : ''
  return `${col} BIGINT ${nullable ? '' : 'NOT NULL '}CHECK (${nullable ? `${col} IS NULL OR (` : ''}${integer}${col} BETWEEN 0 AND ${max}${nullable ? ')' : ''})`
}
export function ddl(dialect: DeliveryDialect, schema: string): string[] {
  const methods = table(dialect, schema, 'delivery_methods'), sales = table(dialect, schema, 'sale_deliveries'), orders = table(dialect, schema, 'orders_statuses')
  const date = dialect === 'postgres' ? 'TIMESTAMPTZ' : 'DATETIME'
  const methodSql = `CREATE TABLE IF NOT EXISTS ${methods} (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL, "idStore" VARCHAR(36) NOT NULL, "code" VARCHAR(48) UNIQUE NOT NULL,
    "name" VARCHAR(120) NOT NULL, "mode" VARCHAR(40) NOT NULL CHECK ("mode" IN (${modes})),
    ${money(dialect, 'defaultFeeMinor', true)}, "allowFeeOverride" BOOLEAN NOT NULL, "active" BOOLEAN NOT NULL,
    "revision" INTEGER NOT NULL CHECK ("revision" > 0), "createdBy" VARCHAR(36), "updatedBy" VARCHAR(36),
    "createdAt" ${date} NOT NULL, "updatedAt" ${date} NOT NULL, UNIQUE ("id", "idStore"),
    CHECK (("mode" IN ('NONE','MERCHANT_SUBSIDIZED','MERCHANT_SUBSIDIZED_EXTERNAL') AND "defaultFeeMinor" IS NOT NULL AND "defaultFeeMinor" = 0 AND NOT "allowFeeOverride") OR ("mode" NOT IN ('NONE','MERCHANT_SUBSIDIZED','MERCHANT_SUBSIDIZED_EXTERNAL') AND (("defaultFeeMinor" IS NOT NULL AND "defaultFeeMinor" > 0) OR ("defaultFeeMinor" IS NULL AND "allowFeeOverride"))))
  )`
  // On PostgreSQL orders_statuses may not exist yet because the module glob is not dependency sorted.
  // Add that FK in DML, after all DDL. SQLite permits a forward reference at CREATE TABLE.
  const orderFk = dialect === 'sqlite' ? `, FOREIGN KEY ("saleId") REFERENCES ${orders}("stPId") ON DELETE RESTRICT` : ''
  const snapshotSql = `CREATE TABLE IF NOT EXISTS ${sales} (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL, "idStore" VARCHAR(36) NOT NULL, "saleId" VARCHAR(36) UNIQUE NOT NULL,
    "saleReference" VARCHAR(100) UNIQUE NOT NULL, "methodId" VARCHAR(36) NOT NULL, "methodRevision" INTEGER NOT NULL CHECK ("methodRevision" > 0),
    "methodCode" VARCHAR(48) NOT NULL, "methodName" VARCHAR(120) NOT NULL, "mode" VARCHAR(40) NOT NULL CHECK ("mode" IN (${modes})),
    "providerType" VARCHAR(16) NOT NULL CHECK ("providerType" IN ('NONE','OWN','THIRD_PARTY')),
    "collector" VARCHAR(16) NOT NULL CHECK ("collector" IN ('NONE','MERCHANT','PROVIDER')),
    "beneficiary" VARCHAR(16) NOT NULL CHECK ("beneficiary" IN ('NONE','MERCHANT','PROVIDER')),
    "providerName" VARCHAR(120), "providerRef" VARCHAR(100), "currency" VARCHAR(3) NOT NULL CHECK ("currency" = 'COP'),
    "policyVersion" INTEGER NOT NULL CHECK ("policyVersion" = 1),
    ${['customerFeeMinor','posChargeMinor','externalChargeMinor','merchantRevenueMinor','thirdPartyPayableMinor'].map(n => money(dialect,n)).join(', ')},
    ${money(dialect,'providerCostMinor',true)}, ${money(dialect,'merchantCostMinor',true)},
    "deliveryStatus" VARCHAR(20) NOT NULL CHECK ("deliveryStatus" IN ('NOT_REQUIRED','PENDING','DISPATCHED','DELIVERED','CANCELLED')),
    "createdBy" VARCHAR(36) NOT NULL, "updatedBy" VARCHAR(36) NOT NULL, "createdAt" ${date} NOT NULL, "updatedAt" ${date} NOT NULL,
    CHECK ("customerFeeMinor" = "posChargeMinor" + "externalChargeMinor"), CHECK ("posChargeMinor" = "merchantRevenueMinor" + "thirdPartyPayableMinor"),
    FOREIGN KEY ("methodId","idStore") REFERENCES ${methods}("id","idStore") ON DELETE RESTRICT${orderFk}
  )`
  return [methodSql, snapshotSql,
    `CREATE INDEX IF NOT EXISTS ${index(dialect,schema,'delivery_methods_active_idx')} ON ${methods}("idStore","active")`,
    `CREATE INDEX IF NOT EXISTS ${index(dialect,schema,'sale_deliveries_status_idx')} ON ${sales}("idStore","deliveryStatus","createdAt")`,
    `CREATE INDEX IF NOT EXISTS ${index(dialect,schema,'sale_deliveries_method_idx')} ON ${sales}("methodId")`]
}
export const pgOrderFk = (schema: string) => `ALTER TABLE ${table('postgres',schema,'sale_deliveries')} ADD CONSTRAINT "sale_deliveries_order_fk" FOREIGN KEY ("saleId") REFERENCES ${table('postgres',schema,'orders_statuses')}("stPId") ON DELETE RESTRICT`
export const pgDropOrderFk = (schema: string) => `ALTER TABLE ${table('postgres',schema,'sale_deliveries')} DROP CONSTRAINT IF EXISTS "sale_deliveries_order_fk"`
export const insertPresetSql = (dialect: DeliveryDialect,schema: string) => `INSERT INTO ${table(dialect,schema,'delivery_methods')} ("id","idStore","code","name","mode","defaultFeeMinor","allowFeeOverride","active","revision","createdBy","updatedBy","createdAt","updatedAt") VALUES (:id,:idStore,:code,:name,:mode,:defaultFeeMinor,:allowFeeOverride,:active,1,NULL,NULL,:now,:now) ON CONFLICT ("code") DO NOTHING`
