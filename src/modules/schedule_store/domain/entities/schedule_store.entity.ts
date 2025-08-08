export class ScheduleStore {
  constructor(
    public readonly schId: string,
    public idStore: string,
    public id: string,
    public readonly schDay: number,
    public readonly schHoSta: string,
    public readonly schHoEnd: string,
    public readonly schState: number,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date
  ) {}
}
