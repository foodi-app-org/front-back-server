import { INTEGER, DATE, UUIDV4, STRING } from 'sequelize'

import connect from '../../db'
import productModelFood from '../product/productFood'
import Users from '../Users'
import productsOptionalExtra from '../../models/product/productsOptionalExtra'

const sequelize = connect()

const SubProducts = sequelize.define('subproducts', {
  subProductsId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }

  },
  pId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModelFood,
      key: 'pId'
    }

  },
  opExPid: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productsOptionalExtra,
      key: 'opExPid'
    }

  },
  cDatCre: {
    type: DATE,
    default: Date.now()
  },
  cDatMod: {
    type: DATE,
    default: Date.now()
  }
}, {
  timestamps: false
})

export default SubProducts
