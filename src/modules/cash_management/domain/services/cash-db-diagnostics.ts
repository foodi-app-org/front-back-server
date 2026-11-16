/** Error classification without passing SQL, credentials or row parameters to GraphQL. */
export function describeCashDbError(error:unknown) {
  const e=error as {name?:unknown;message?:unknown;parent?:{code?:unknown;message?:unknown};original?:{code?:unknown;message?:unknown}}|null
  const dbCode=String(e?.parent?.code??e?.original?.code??'')
  const message=[e?.message,e?.parent?.message,e?.original?.message].filter(v=>typeof v==='string').join(' ')
  let reason='UNEXPECTED',hint='Revisa el registro del servidor de la operación.'
  if(/^(42P01|42703|3F000)$/.test(dbCode)||/no such (table|column)|has no column named|relation .* does not exist|column .* does not exist|schema .* does not exist|CASH_PREREQUISITES_MISSING|CASH_SCHEMA_INCOMPATIBLE/i.test(message)) {
    reason='SCHEMA_NOT_READY';hint='Verifica cashSchemaStatus y ejecuta la reparación de migraciones en el tenant correcto.'
  }else if(/SQLITE_BUSY|SQLITE_LOCKED|40001|40P01/.test(dbCode)||/database is locked|cannot start a transaction within a transaction|database table is locked/i.test(message)) {
    reason='DB_BUSY';hint='La base está ocupada. Consulta el estado de la operación antes de reintentar.'
  }else if(/^23/.test(dbCode)||/SQLITE_CONSTRAINT/.test(dbCode)||/SequelizeUniqueConstraintError|SequelizeForeignKeyConstraintError/.test(String(e?.name??''))) {
    reason='DB_CONSTRAINT';hint='La base rechazó una restricción. Verifica el estado actual y los datos enviados.'
  }else if(/Invalid tenant identifier|CASH_UNSUPPORTED_DIALECT/i.test(message)) {
    reason='DB_CONFIGURATION';hint='Comprueba el dialecto y el identificador de tienda sin prefijo tenant_.'
  }
  return {reason,hint,dbCode: /^[A-Z0-9_]{1,60}$/.test(dbCode)?dbCode:undefined}
}
