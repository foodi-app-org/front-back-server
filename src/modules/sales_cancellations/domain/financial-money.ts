/** Exact COP arithmetic in centésimas. No rounding on raw inputs. */
export function decimalToMinor(value:string|number|null|undefined):bigint {
  if(value==null)throw Error('REPORT_MISSING_SALE_AMOUNT')
  const s=String(value).trim()
  if(!/^-?(0|[1-9]\d*)(?:\.\d{1,2})?$/.test(s))throw Error('REPORT_INVALID_AMOUNT')
  const negative=s.startsWith('-')
  const [whole,dec='']=s.replace('-','').split('.')
  const result=BigInt(whole)*100n+BigInt((dec+'00').slice(0,2))
  if(result>BigInt(Number.MAX_SAFE_INTEGER))throw Error('REPORT_AMOUNT_UNSAFE')
  return negative?-result:result
}
export function amountToCop(n:bigint):number {
  if(n>BigInt(Number.MAX_SAFE_INTEGER)||n< -BigInt(Number.MAX_SAFE_INTEGER))throw Error('REPORT_AMOUNT_UNSAFE')
  return Number(n)/100
}
/** Accept native Sequelize Date, canonical ISO or the persisted UTC text format. */
export function dateAtUtc(raw:string|Date):Date {
  if(raw instanceof Date){
    if(!Number.isFinite(raw.getTime()))throw Error('REPORT_INVALID_DATE')
    return new Date(raw.getTime())
  }
  const original=String(raw).trim()
  const normalized=original
    .replace(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:)/,'$1T$2')
    .replace(/\s+([+-]\d{2}:?\d{2})$/, '$1')
  const withZone=/[zZ]$|[+-]\d{2}:?\d{2}$/.test(normalized)?normalized:normalized+'Z'
  const date=new Date(withZone)
  if(!Number.isFinite(date.getTime()))throw Error('REPORT_INVALID_DATE')
  return date
}
export function localDateOf(raw:string|Date, timezone:string):string {
  const chunks=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'})
    .formatToParts(dateAtUtc(raw))
  const get=(key:string)=>chunks.find(part=>part.type===key)?.value
  return [get('year'),get('month'),get('day')].join('-')
}
