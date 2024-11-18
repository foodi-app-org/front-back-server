const {
  STRING,
  literal,
  DataTypes,
  INTEGER,
  DATE,
  DECIMAL
} = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { STATUS_ORDER_MODEL } = require('../../models/Store/statusPedidoFinal')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(STATUS_ORDER_MODEL, {
    stPId: {
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
    pSState: {
      type: INTEGER,
      defaultValue: 0
    },
    valueDelivery: {
      type: INTEGER,
      defaultValue: 0
    },
    locationUser: {
      type: STRING,
      allowNull: true
    },
    discount: {
      type: INTEGER,
      allowNull: true
    },
    tip: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    change: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    pCodeRef: {
      type: STRING(100),
      unique: true,
      allowNull: false
    },
    totalProductsPrice: {
      type: DECIMAL(1000, 2),
      allowNull: false
    },
    payMethodPState: {
      type: INTEGER,
      defaultValue: 1
    },
    pickUp: {
      type: INTEGER,
      defaultValue: 0
    },
    channel: {
      type: INTEGER, // store or client-store
      defaultValue: 0
    },
    pPDate: {
      type: DATE
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
  await queryInterface.dropTable(STATUS_ORDER_MODEL, { schema: schemaName })
}
