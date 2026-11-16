export type Row=Record<string,unknown>
export type TransactionPort={ query<T=Row>(sql:string,params?:Row):Promise<T[]>; exec(sql:string,params?:Row):Promise<void>; table(name:string):string }
export interface CashRepository { read?<T>(fn:(tx:TransactionPort)=>Promise<T>):Promise<T>; transaction<T>(fn:(tx:TransactionPort)=>Promise<T>):Promise<T>; bind(transaction:unknown):TransactionPort; readonly idStore:string }
