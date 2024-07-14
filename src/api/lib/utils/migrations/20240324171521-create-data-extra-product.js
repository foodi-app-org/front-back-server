const { STRING, DataTypes } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')

const { enCode } = require('../../utils/util')
const { SALES_DATA_EXTRA_PRODUCTO } = require('../../models/Store/sales/saleExtraProduct')
const { SHOPPING_CARD_MODEL } = require('../../models/Store/ShoppingCard')
const { DECIMAL } = require('sequelize')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SALES_DATA_EXTRA_PRODUCTO, {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    shoppingCardId: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: SHOPPING_CARD_MODEL,
          schema: schemaName

        },
        key: 'ShoppingCard'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    pId: {
      type: STRING,
      allowNull: false
    },
    pCodeRef: {
      type: STRING(100),
      unique: false,
      allowNull: true
    },
    refCodePid: {
      type: STRING(50),
      allowNull: true
    },
    exPid: {
      type: STRING,
      allowNull: false
    },
    exState: {
      type: INTEGER,
      allowNull: false
    },
    extraName: {
      type: STRING,
      allowNull: false
    },
    extraPrice: {
      type: DECIMAL(1000, 2),
      allowNull: false
    },
    state: {
      type: INTEGER,
      allowNull: false
    },
    pDatCre: {
      type: DATE,
      allowNull: false
    },
    pDatMod: {
      type: DATE,
      allowNull: false
    },
    quantity: {
      type: INTEGER,
      allowNull: false
    },
    newExtraPrice: {
      type: DECIMAL(1000, 2),
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
  await queryInterface.dropTable(SALES_DATA_EXTRA_PRODUCTO, { schema: schemaName })
}
