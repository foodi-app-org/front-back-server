const { 
  STRING,
  INTEGER,
  DATE,
  SMALLINT,
  DECIMAL,
  UUID,
  UUIDV4
} = require('sequelize')

const { SHOPPING_CARD_MODEL } = require('../../models/Store/ShoppingCard')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SHOPPING_CARD_MODEL, {
    ShoppingCard: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    id: {
      type: STRING(36),
      allowNull: true
    },
    idUser: {
      type: STRING(36),
      allowNull: true
    },
    priceProduct: {
      type: DECIMAL(1000, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    pId: {
      type: STRING(36),
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
