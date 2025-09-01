/**
 * Role entity that represents the business object.
 */
export class Role {
  constructor(
    public readonly idRole: string,
    public idStore: string | null,
    public priority: number | null,
    public name: string,
    public description: string | null,
    public state: number,
    public permissions: Record<string, unknown>,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
