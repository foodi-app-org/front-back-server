/**
 * Domain Entity: PaymentMethod
 */
export class PaymentMethod {
  public readonly payId: string
  public name: string
  public icon: string
  public state: string
  public paymentPriority: number
  public readonly createdAt?: Date
  public updatedAt?: Date

  /**
   * Creates a new PaymentMethod entity
   * @param props PaymentMethod properties
   */
  constructor(props: {
    payId: string
    name: string
    icon: string
    state: string
    paymentPriority: number
    mIcon: number
    mState: number
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.payId = props.payId
    this.name = props.name
    this.icon = props.icon
    this.state = props.state
    this.paymentPriority = props.paymentPriority
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }
}
