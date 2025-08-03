import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const USER_MODEL = 'users'

/**
 * Interface that defines the attributes stored in DB
 */
export interface IUserAttributes {
  id: string
  associateStore?: object
  name: string
  idRole?: string
  username?: string
  lastName?: string
  email: string
  avatar?: string
  uToken?: string
  uPhoNum?: string
  ULocation?: string
  upLat?: string
  uState?: number
  upLon?: string
  upIdeDoc?: string
  siteWeb?: string
  description?: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during User creation
 */
export type IUserCreationAttributes = Optional<IUserAttributes, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeUserModel extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  declare id: string
  declare associateStore?: object
  declare name: string
  declare idRole?: string
  declare username?: string
  declare lastName?: string
  declare email: string 
  declare avatar?: string
  declare uToken?: string
  declare uPhoNum?: string
  declare ULocation?: string
  declare upLat?: string
  declare uState?: number
  declare upLon?: string
  declare upIdeDoc?: string
  declare siteWeb?: string
  declare description?: string
  declare password: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

SequelizeUserModel.init(
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    associateStore: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    name: { type: DataTypes.STRING },
    idRole: { type: DataTypes.STRING(36), allowNull: true },
    username: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    avatar: { type: DataTypes.STRING },
    uToken: { type: DataTypes.STRING(100) },
    uPhoNum: { type: DataTypes.STRING(50) },
    ULocation: { type: DataTypes.STRING(100) },
    upLat: { type: DataTypes.STRING(30) },
    uState: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 30 }
    },
    upLon: { type: DataTypes.STRING(30) },
    upIdeDoc: { type: DataTypes.STRING(50) },
    siteWeb: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING }
  },
  {
    sequelize,
    modelName: USER_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeUserModel
