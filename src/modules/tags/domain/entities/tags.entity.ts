/**
 * Domain Entity for TagProduct
 */
export class TagProductEntity {
  constructor(
    public tgId: string,
    public idStore: string | null,
    public idUser: string | null,
    public nameTag: string,
    public state: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
