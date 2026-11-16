import { cashDDL, externalFKs, financialKindDDL, table, type Dialect } from './cash-schema'

/** Same physical naming as Venty's delivery module. Never fall back to public. */
export type SchemaPort = {
  query<T extends object = Record<string, unknown>>(sql: string, params?: Record<string, unknown>): Promise<T[]>
  exec(sql: string, params?: Record<string, unknown>): Promise<void>
}
const CASH = ['cash_registers','cash_sessions','sale_payments','cash_movements','cash_counts','cash_count_details'] as const
const REQUIRED: Record<string, string[]> = {
  orders_statuses: ['stPId','idStore','pCodeRef','netTotal','valueDelivery','tip'],
  payment_methods: ['payId','name','state','paymentPriority','type','icon','financialKind'],
  sale_deliveries: ['id','idStore','saleId','saleReference','deliveryStatus','currency','mode','policyVersion','customerFeeMinor','providerCostMinor','posChargeMinor','externalChargeMinor','merchantRevenueMinor','thirdPartyPayableMinor','merchantCostMinor'],
  cash_registers: ['id','idStore','code','name','deviceId','currency','defaultFloatMinor','minimumFloatMinor','closingToleranceMinor','blindCountRequired','policyVersion','active','revision','createdAt','updatedAt'],
  cash_sessions: ['id','idStore','registerId','currency','status','openedBy','openedAt','businessDate','openingMinor','openingSource','previousSessionId','sourceReference','openingVarianceMinor','expectedBalanceMinor','movementSequence','version','policySnapshot','openingKey','openingHash','closingCountId','expectedAtCountMinor','countAtCloseMinor','varianceMinor','retainedMinor','transferredMinor','closedBy','closedAt','approvedBy','approvedAt','closeKey','closeHash','reason','closingDestination'],
  sale_payments: ['id','idStore','saleId','sessionId','payId','paymentKind','methodNameSnapshot','direction','status','confirmationSource','amountAppliedMinor','settlementAmountMinor','cashTenderedMinor','cashChangeMinor','roundingDeltaMinor','originalPaymentId','externalReference','idempotencyKey','requestHash','actorId','confirmedAt','createdAt','policySnapshot'],
  cash_movements: ['id','idStore','sessionId','sequence','type','direction','amountMinor','currency','paymentId','saleDeliveryId','originalMovementId','idempotencyKey','requestHash','reason','reference','actorId','createdAt'],
  cash_counts: ['id','idStore','sessionId','phase','attemptNumber','countedBy','countedAt','countedMinor','expectedMinor','varianceMinor','asOfSequence','status','notes','idempotencyKey','requestHash'],
  cash_count_details: ['countId','idStore','denominationMinor','quantity']
}
const INDEXES = ['cash_one_operational_session','cash_sessions_history','sale_payments_sale','sale_payments_session','cash_movement_delivery','cash_count_session']
const FOREIGN_KEYS = ['cash_payments_sale_fk','cash_payments_method_fk','cash_movements_delivery_fk','cash_session_count_fk']
export type CashSchemaStatus = { ready:boolean; dialect:Dialect; schema:string; missingTables:string[]; missingColumns:string[]; missingIndexes:string[]; missingConstraints:string[]; incompatibleColumns:string[] }

export async function inspectCashSchema(tx:SchemaPort,dialect:Dialect,schema:string):Promise<CashSchemaStatus> {
  table(dialect,schema,'cash_registers') // validate schema before interpolating identifiers
  const missingTables:string[]=[], missingColumns:string[]=[], incompatibleColumns:string[]=[]
  for (const [name,required] of Object.entries(REQUIRED)) {
    const cols = dialect === 'sqlite'
      ? await tx.query<{ name:string; type:string }>('SELECT name, type FROM pragma_table_info(:physical)',{physical:`${schema}.${name}`})
      : await tx.query<{ name:string; type:string }>('SELECT column_name AS name, data_type AS type FROM information_schema.columns WHERE table_schema = :schema AND table_name = :name',{schema,name})
    if (!cols.length) { missingTables.push(name); continue }
    const byName = new Map(cols.map(c=>[c.name,c.type]))
    for (const column of required) {
      if (!byName.has(column)) missingColumns.push(`${name}.${column}`)
      // Existing external delivery amounts use the same BIGINT minor contract.
      else if (column.endsWith('Minor') && !/^(bigint|integer|int8)$/i.test(byName.get(column)??'')) incompatibleColumns.push(`${name}.${column}`)
    }
  }
  const indexes = dialect==='sqlite'
    ? await tx.query<{name:string;definition:string|null}>('SELECT name, sql AS definition FROM sqlite_master WHERE type = \'index\'')
    : await tx.query<{name:string;definition:string}>('SELECT indexname AS name, indexdef AS definition FROM pg_indexes WHERE schemaname = :schema',{schema})
  const indexMap = new Map(indexes.map(i=>[i.name,i.definition??'']))
  const missingIndexes = INDEXES.filter(i=>!indexMap.has(dialect==='sqlite'?`${schema}.${i}`:i))
  const unique = indexMap.get(dialect==='sqlite'?`${schema}.cash_one_operational_session`:'cash_one_operational_session')
  // Do not silently trust a nonunique or unconditional index with the right name.
  if(unique!==undefined && (!/CREATE\s+UNIQUE\s+INDEX/i.test(unique)||!/\bWHERE\b/i.test(unique)||!/registerId/i.test(unique)||!/status/i.test(unique)||!/CLOSED/i.test(unique))) incompatibleColumns.push('index.cash_one_operational_session')
  const missingConstraints:string[]=[]
  if (dialect==='postgres') {
    const existing = await tx.query<{name:string}>(`SELECT c.conname AS name FROM pg_constraint c JOIN pg_namespace n ON n.oid=c.connamespace WHERE n.nspname = :schema AND c.contype='f'`,{schema})
    const names=new Set(existing.map(x=>x.name));missingConstraints.push(...FOREIGN_KEYS.filter(n=>!names.has(n)))
  } else {
    // Existing SQLite tables cannot get an FK using ALTER. Report an incompatible
    // installation instead of pretending it was repaired or rebuilding financial data.
    const expected:Record<string,string[][]>={
      cash_sessions:[['registerId','cash_registers','id'],['previousSessionId','cash_sessions','id'],['closingCountId','cash_counts','id']],
      sale_payments:[['sessionId','cash_sessions','id'],['originalPaymentId','sale_payments','id'],['saleId','orders_statuses','stPId'],['payId','payment_methods','payId']],
      cash_movements:[['sessionId','cash_sessions','id'],['paymentId','sale_payments','id'],['originalMovementId','cash_movements','id'],['saleDeliveryId','sale_deliveries','id']],
      cash_counts:[['sessionId','cash_sessions','id']],cash_count_details:[['countId','cash_counts','id']]
    }
    for(const [name,links] of Object.entries(expected)) {
      if(missingTables.includes(name)) continue
      const fks=await tx.query<{from:string;table:string;to:string}>('SELECT "from", "table", "to" FROM pragma_foreign_key_list(:physical)',{physical:`${schema}.${name}`})
      for(const [from,target,to] of links) if(!fks.some(f=>f.from===from&&f.table===`${schema}.${target}`&&f.to===to)) missingConstraints.push(`${name}.${from}->${target}.${to}`)
    }
  }
  return {ready:![missingTables,missingColumns,missingIndexes,missingConstraints,incompatibleColumns].some(a=>a.length),dialect,schema,missingTables,missingColumns,missingIndexes,missingConstraints,incompatibleColumns}
}

export async function ensureCashTables(tx:SchemaPort,dialect:Dialect,schema:string):Promise<void> {
  // Idempotent without dropping rows; first DDL can run before legacy DDL on new tenants.
  for(const sql of cashDDL(dialect,schema).filter(s=>s.startsWith('CREATE TABLE '))) await tx.exec(sql.replace(/^CREATE TABLE /,'CREATE TABLE IF NOT EXISTS '))
  const status=await inspectCashSchema(tx,dialect,schema)
  const invalid=status.missingColumns.filter(s=>CASH.some(n=>s.startsWith(n+'.')))
  if(invalid.length||status.incompatibleColumns.length) throw new Error(`CASH_SCHEMA_INCOMPATIBLE: ${[...invalid,...status.incompatibleColumns].join(', ')}`)
  for(const sql of cashDDL(dialect,schema).filter(s=>/^CREATE (?:UNIQUE )?INDEX /.test(s))) await tx.exec(sql.replace(/^CREATE (UNIQUE )?INDEX /,(_,unique)=>`CREATE ${unique??''}INDEX IF NOT EXISTS `))
}

/** Safe forward repair. Never creates fake payments, opening balances or historical movements. */
export async function repairCashSchema(tx:SchemaPort,dialect:Dialect,schema:string):Promise<CashSchemaStatus> {
  const before=await inspectCashSchema(tx,dialect,schema)
  const dependencies=before.missingTables.filter(n=>!CASH.includes(n as typeof CASH[number]))
  const missingLegacy=before.missingColumns.filter(s=>!CASH.some(n=>s.startsWith(n+'.'))&&s!=='payment_methods.financialKind')
  if(dependencies.length||missingLegacy.length) throw new Error(`CASH_PREREQUISITES_MISSING: ${[...dependencies,...missingLegacy].join(', ')}`)
  await ensureCashTables(tx,dialect,schema)
  const mid=await inspectCashSchema(tx,dialect,schema)
  if(mid.missingColumns.includes('payment_methods.financialKind')) await tx.exec(financialKindDDL(dialect,schema))
  if(dialect==='postgres') {
    for(const sql of externalFKs(schema)) if(mid.missingConstraints.some(name=>sql.includes(`"${name}"`))) await tx.exec(sql)
  }
  // Safe classification of original static seed only: use name+icon+type, never arbitrary custom methods.
  const seeded=[['Efectivo','IconDollar','CASH'],['Transferencia','IconTransfer','BANK_TRANSFER'],['Visa','IconVisaSimple','CARD'],['Mastercard','IconMasterCardSimple','CARD']]
  for(const [name,icon,kind] of seeded) await tx.exec(`UPDATE ${table(dialect,schema,'payment_methods')} SET "financialKind" = :kind WHERE "financialKind" = 'UNKNOWN' AND "type" = 'static' AND "name" = :name AND "icon" = :icon`,{name,icon,kind})
  const after=await inspectCashSchema(tx,dialect,schema)
  if(!after.ready) throw new Error(`CASH_SCHEMA_INCOMPATIBLE: ${JSON.stringify(after)}`)
  if(dialect==='sqlite') for(const name of CASH) {
    const violations=await tx.query('SELECT * FROM pragma_foreign_key_check(:physical)',{physical:`${schema}.${name}`})
    if(violations.length) throw new Error(`CASH_FOREIGN_KEY_VIOLATIONS: ${name} (${violations.length})`)
  }
  return after
}
