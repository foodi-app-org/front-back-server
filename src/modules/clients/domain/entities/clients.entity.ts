enum ClientsStateEnum {
  UNAVAILABLE = 0,
  ACTIVE = 1,
  OCCUPIED = 2
}

/**
 * Domain entity representing a Table inside a Store.
 */
export class Clients {
  constructor(
    public readonly cliId: string,
    public readonly idStore: string,
    public readonly idUser: string | null,
    public readonly clState: ClientsStateEnum = ClientsStateEnum.ACTIVE,
    public readonly gender: number,
    public readonly clientAddress: string | null,
    public readonly clientNumber: string | null,
    public readonly clientName: string | null,
    public readonly clientLastName: string | null,
    public readonly ccClient: string | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}