const { STRING } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')
const { SMALLINT } = require('sequelize')
const { DECIMAL } = require('sequelize')
const { UUID } = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { enCode } = require('../../utils/util')
const { SHOPPING_CARD_MODEL } = require('../../models/Store/ShoppingCard')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SHOPPING_CARD_MODEL, {
    ShoppingCard: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    id: {
      type: INTEGER,
      allowNull: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    idUser: {
      type: INTEGER,
      allowNull: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    priceProduct: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    pId: {
      type: INTEGER,
      allowNull: false,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    // id store
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
    ShoppingCardRefCode: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false
    },
    discountCardProduct: {
      type: STRING(100),
      allowNull: true
    },
    comments: {
      type: STRING(100),
      allowNull: true
    },
    refCodePid: {
      type: STRING(50),
      allowNull: true
    },
    cantProducts: {
      type: INTEGER,
      allowNull: true
    },
    cState: {
      type: SMALLINT,
      defaultValue: 1
    },
    cDatCre: {
      type: DATE,
      default: Date.now()
    },
    cDatMod: {
      type: DATE,
      default: Date.now()
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(SHOPPING_CARD_MODEL, { schema: schemaName })
}
