import { buildWeeklyWindows, compareWeeklyStock } from '../../domain/services/weekly-stock-comparison'
import { GetWeeklyStockMovementUseCase } from './get-weekly-stock-movement.usecase'
const now = new Date('2026-11-16T07:24:19.697Z')
const windows = buildWeeklyWindows(now)
const run = (totals: number[], firstAt: string | null = '2026-09-01T05:00:00Z') => compareWeeklyStock(windows, { firstAt, totals })
describe('weekly stock', () => {
  it('uses Colombian Monday and eight consecutive windows', () => {
    expect(windows.map(w => w.weekStart)).toEqual(['2026-09-28','2026-10-05','2026-10-12','2026-10-19','2026-10-26','2026-11-02','2026-11-09','2026-11-16'])
    expect(windows[7].startAt).toBe('2026-11-16T05:00:00.000Z')
    expect(buildWeeklyWindows(new Date('2026-11-16T04:59:59Z'))[7].weekStart).toBe('2026-11-09')
  })
  it('compares zeros and growth without clipping', () => {
    const rows=run([0,0,3,6,3,0,10,50])
    expect(rows.map(r => r.comparisonStatus)).toEqual(['NO_ACTIVITY','NEW_ACTIVITY','INCREASED','DECREASED','DECREASED','NEW_ACTIVITY','INCREASED'])
    expect(rows.map(r => r.percentageChange)).toEqual([null,null,100,-50,-100,null,400])
  })
  it('does not fabricate historical zeros', () => {
    const rows=run([0,0,0,0,0,0,0,3], '2026-11-16 06:00:00.000 +00:00')
    expect(rows[5].totalOut).toBeNull()
    expect(rows[6]).toMatchObject({totalOut:3,prevTotalOut:null,comparisonStatus:'NO_REFERENCE',historyPartial:true,isCurrent:true})
    expect(run(Array(8).fill(0),null).every(r=>r.totalOut===null)).toBe(true)
  })
  it('does not use a partially covered prior week', () => {
    expect(run([0,0,0,0,0,0,2,3], '2026-11-10T05:00:00Z')[6].prevTotalOut).toBeNull()
  })
  it('handles year rollover', () => {
    expect(buildWeeklyWindows(new Date('2027-01-03T18:00:00Z'))[7]).toMatchObject({weekStart:'2026-12-28',weekEnd:'2027-01-03'})
  })
  it('rejects inconsistent data',()=>expect(()=>run([0,0,0,0,0,0,0,-1])).toThrow())
  it('delegates to its injected read port', async () => {
    const port = { readWeeklySnapshot: jest.fn().mockResolvedValue({firstAt:'2026-09-01T05:00:00Z',totals:[0,0,0,0,0,0,0,3]}) }
    const result = await new GetWeeklyStockMovementUseCase(port,()=>now).execute()
    expect(port.readWeeklySnapshot).toHaveBeenCalledWith(windows,now.toISOString())
    expect(result[6].comparisonStatus).toBe('NEW_ACTIVITY')
  })
})
