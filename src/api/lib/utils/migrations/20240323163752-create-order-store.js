const { STRING, literal, DataTypes } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')

const { enCode } = require('../../utils/util')
const { ORDER_MODEL } = require('../../models/Store/pedidos')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { SHOPPING_CARD_MODEL } = require('../../models/Store/ShoppingCard')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(ORDER_MODEL, {
    pdpId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    id: {
      type: INTEGER,
      allowNull: true
    },
    ShoppingCard: {
      type: INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: SHOPPING_CARD_MODEL,
          schema: schemaName
        },
        key: 'ShoppingCard'
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
    ppState: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pCodeRef: {
      type: STRING(15),
      allowNull: false
    },
    change: {
      type: INTEGER,
      allowNull: true
    },
    pPDate: {
      type: DATE
    },
    pPStateP: {
      type: INTEGER,
      defaultValue: 0
    },
    payMethodPState: {
      type: INTEGER,
      defaultValue: 0
    },
    pPRecoger: {
      type: INTEGER,
      defaultValue: 0
    },
    unidProducts: {
      type: INTEGER,
      allowNull: true
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
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(ORDER_MODEL, { schema: schemaName })
}
