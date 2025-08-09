export enum StateOderTypes {
    ACTIVE = 1,
    INACTIVE = 0,
    ARCHIVED = -1
}

export interface CreateStatusTypeOrderInput {
    idStatus: string
    name: string
    description: string
    color: string
    backgroundColor: string
    state: StateOderTypes
    active: boolean
    priority: number
    createdAt: Date
    updatedAt: Date
}
