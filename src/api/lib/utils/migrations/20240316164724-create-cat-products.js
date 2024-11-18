const { STRING, UUIDV4 } = require('sequelize')
const { INTEGER } = require('sequelize')
const { TEXT } = require('sequelize')

const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { CATEGORY_PRODUCT_MODEL } = require('../../models/Store/cat')
const { USER_MODEL } = require('../../models/Users')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(CATEGORY_PRODUCT_MODEL, {
    carProId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    // id store
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
    // User
    id: {
      type: STRING(36),
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
