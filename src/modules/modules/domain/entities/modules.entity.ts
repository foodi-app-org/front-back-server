/**
 * Domain Entity: Module
 */
export class Module {
  public readonly mId: string
  public mName: string
  public view: string
  public mPath: string
  public mPriority: number
  public mIcon: number
  public mState: number
  public readonly createdAt?: Date
  public updatedAt?: Date

  /**
   * Creates a new Module entity
   * @param props Module properties
   */
  constructor(props: {
    mId: string
    mName: string
    view: string
    mPath: string
    mPriority: number
    mIcon: number
    mState: number
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.mId = props.mId
    this.mName = props.mName
    this.view = props.view
    this.mPath = props.mPath
    this.mPriority = props.mPriority
    this.mIcon = props.mIcon
    this.mState = props.mState
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }
}
