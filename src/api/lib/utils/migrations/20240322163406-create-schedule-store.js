const { STRING, UUIDV4 } = require('sequelize')
const { INTEGER } = require('sequelize')


const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { USER_MODEL } = require('../../models/Users')
const { SCHEDULE_MODEL } = require('../../models/Store/scheduleStore')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SCHEDULE_MODEL, {
    schId: {
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
      },

    },
    schDay: {
      type: INTEGER,
      allowNull: false
    },
    schHoSta: {
      type: STRING(60),
      allowNull: false
    },
    schHoEnd: {
      type: STRING(60),
      allowNull: false
    },
    schState: {
      type: INTEGER,
      allowNull: false
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(SCHEDULE_MODEL, { schema: schemaName })
}
