const { UUID, UUIDV4, SMALLINT, STRING, literal } = require('sequelize')

const { STORE_TABLES, tableStateEnum } = require('../../models/storeTables')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(STORE_TABLES, {
    tableId: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false
    },
    tableName: {
      type: STRING(100),
      allowNull: false,
      comment: 'Name or number of the table in the Store'
    },
    seats: {
      type: SMALLINT,
      allowNull: true,
      comment: 'Number of seats available at the table'
    },
    section: {
      type: STRING(50),
      allowNull: true,
      comment: 'Section or area where the table is located (e.g., patio, main hall)'
    },
    tableState: {
      type: SMALLINT,
      allowNull: false,
      defaultValue: tableStateEnum.ACTIVE,
      comment: '0 = Unavailable, 1 = Active, 2 = Occupied',
      validate: {
        isIn: [[tableStateEnum.UNAVAILABLE, tableStateEnum.ACTIVE, tableStateEnum.OCCUPIED]]
      }
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  // Elimina la tabla "store_tables"
  await queryInterface.dropTable(STORE_TABLES, { schema: schemaName })
}
