/**
 * Domain Entity representing a Submodule.
 */
export class Submodule {
  constructor(
    public readonly smId: string,
    public readonly mId: string,
    public smName: string,
    public view: string,
    public smPath: string,
    public smPriority: number,
    public smState: number,
    public readonly createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
