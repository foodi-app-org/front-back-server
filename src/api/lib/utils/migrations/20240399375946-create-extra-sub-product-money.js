const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')

const { enCode } = require('../../utils/util')
const { EXTRA_PRODUCT_MODEL } = require('../../models/product/productExtras')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { PRODUCT_FOOD_MODEL } = require('../../models/product/productFood')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(EXTRA_PRODUCT_MODEL, {
    exPid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    pId: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'pId',
      references: {
        model: {
          tableName: PRODUCT_FOOD_MODEL,
          schema: schemaName
        },
        key: 'pId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    idStore: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: STORE_MODEL,
          schema: defaultSchema
        },
        key: 'idStore'
      },
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    exState: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    extraName: {
      type: STRING,
      allowNull: false
    },
    extraPrice: {
      type: INTEGER,
      allowNull: true
    },
    // state
    state: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    pDatCre: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    pDatMod: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(EXTRA_PRODUCT_MODEL, { schema: schemaName })
}
