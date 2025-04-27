const {
  UUID,
  UUIDV4,
  ENUM,
  INTEGER,
  STRING,
  DATE
} = require('sequelize')

const { STOCK_MOVEMENT_NAME } = require('../../models/inventory/stockMovement')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(STOCK_MOVEMENT_NAME, {
    id: {
      type: UUID,
      primaryKey: true,
      allowNull: true
    },
    idstockMoment: {
      type: UUID,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: UUIDV4
    },
    productId: {
      type: UUID,
      allowNull: false
    },
    movementType: {
      type: ENUM('IN', 'OUT', 'ADJUSTMENT'),
      allowNull: false
    },
    quantity: {
      type: 'INTEGER',
      allowNull: false
    },
    previousStock: {
      type: INTEGER,
      allowNull: false
    },
    newStock: {
      type: INTEGER,
      allowNull: false
    },
    reference: {
      type: STRING,
      allowNull: true
    },
    createdAt: {
      type: DATE,
      defaultValue: Date.now()
    },
    updatedAt: {
      type: DATE,
      defaultValue: Date.now()
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  // Elimina la tabla "STOCK_MOVEMENT_NAME"
  await queryInterface.dropTable(STOCK_MOVEMENT_NAME, { schema: schemaName })
}
