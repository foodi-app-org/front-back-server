const {
  STRING,
  literal,
  INTEGER,
  DECIMAL
} = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { EXTRA_PRODUCT_MODEL } = require('../../models/product/productExtras')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { PRODUCT_FOOD_MODEL } = require('../../models/product/productFood')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(EXTRA_PRODUCT_MODEL, {
    exPid: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    pId: {
      type: STRING(36),
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
      }
    },
    idStore: {
      type: STRING(36),
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: STORE_MODEL,
          schema: defaultSchema
        },
        key: 'idStore'
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
      type: DECIMAL(1000, 2),
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
