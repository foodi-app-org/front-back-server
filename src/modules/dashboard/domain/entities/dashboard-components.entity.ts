export interface DashboardComponentUpdateInput {
  id: string
  name?: string
  title?: string
  coordinates: {
    x: number
    y: number
    w: number
    h: number
  }
}

export enum StateDashboardComponents {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface IDashboardComponents {
  id?: string
  idStore: string
  title: string
  state: StateDashboardComponents
  coordinates: {
    x: number
    y: number
    w: number
    h: number,
    name: string,
    moved: boolean,
    static: boolean,
    title: string,
  }
  createdAt: Date
  updatedAt: Date
}

/**
 * DashboardComponents Entity
 * Represents a status order type within a store.
 */
export class DashboardComponents {
  public id?: string
  public idStore!: string
  public title!: string
  public state!: StateDashboardComponents
  public coordinates!: {
    x: number
    y: number
    w: number
    h: number
  }
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()

  /**
   * Creates a new DashboardComponents entity.
   * @param props - Object containing the status order type properties.
   */
  constructor(props: IDashboardComponents) {
    Object.assign(this, props)
  }
}
