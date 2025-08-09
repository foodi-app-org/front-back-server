import { v4 as uuidv4 } from 'uuid'

export class ScheduleStore {
  constructor(
    public readonly schId: string = uuidv4(),
    public idStore: string,
    public id: string,
    public readonly schDay: number,
    public readonly schHoSta: string,
    public readonly schHoEnd: string,
    public readonly schState: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}
}
