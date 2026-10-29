/**
 * Domain entity representing a filter configuration record.
 * `filterTabs` is stored as a JSON column in the DB and deserialized here.
 */
export class FilterConfig {
  constructor(
    public readonly id: string,
    public readonly idStore: string | null,
    public filterTabs: Record<string, unknown>[],
    public active: boolean = true,
    public priority: number = 100,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}
}
