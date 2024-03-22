const { STRING } = require('sequelize')
const { INTEGER } = require('sequelize')

const { enCode } = require('../../utils/util')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { USER_MODEL } = require('../../models/Users')
const { SCHEDULE_MODEL } = require('../../models/Store/scheduleStore')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SCHEDULE_MODEL, {
    schId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    createAt: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false
    },
    updateAt: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(SCHEDULE_MODEL, { schema: schemaName })
}
