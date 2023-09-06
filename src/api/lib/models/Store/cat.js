import { INTEGER, STRING, TEXT, TINYINT, literal } from 'sequelize'
import connect from '../../db'
const sequelize = connect()
import { enCode } from '../../utils/util'
import Users from '../Users' // Asegúrate de exportar Users correctamente en su módulo correspondiente
import Store from '../Store/Store' // Asegúrate de exportar Store correctamente en su módulo correspondiente
let productModelFood = null // Agrega esta línea

const catProducts = sequelize.define('catproducts', {
  carProId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get(x) { return enCode(this.getDataValue(x)) }
  },
  // id store
  idStore: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    },
    get(x) { return enCode(this.getDataValue(x)) }
  },
  // User
  id: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    },
    get(x) { return enCode(this.getDataValue(x)) }
  },
  pName: {
    type: STRING,
    allowNull: true
  },
  ProDescription: {
    type: TEXT,
    allowNull: true
  },
  pState: {
    type: TINYINT,
    allowNull: true
  },
  pDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: true
  },
  pDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: true
  }
}, {
  timestamps: false
})

export default catProducts

import('../product/productFood').then(module => {
  productModelFood = module.default
  catProducts.hasMany(productModelFood, {
    foreignKey: 'carProId',
    onDelete: 'CASCADE' // Configuración para borrar en cascada
  })
})