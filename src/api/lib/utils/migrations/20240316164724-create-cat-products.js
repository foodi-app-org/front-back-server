const { STRING } = require('sequelize')
const { INTEGER } = require('sequelize')
const { TEXT } = require('sequelize')

const { enCode } = require('../../utils/util')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { CATEGORY_PRODUCT_MODEL } = require('../../models/Store/cat')
const { USER_MODEL } = require('../../models/Users')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(CATEGORY_PRODUCT_MODEL, {
    carProId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) {
        return enCode(this.getDataValue(x))
      }
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
    // User
    id: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'id',
      references: {
        model: {
          tableName: USER_MODEL,
          schema: defaultSchema
        },
        key: 'id'
      },
      get (x) {
        return enCode(this.getDataValue(x))
      }
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
      type: INTEGER,
      allowNull: true
    },
    pDatCre: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: true
    },
    pDatMod: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: true
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(STORE_MODEL, { schema: schemaName })
}
