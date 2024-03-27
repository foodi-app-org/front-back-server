const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')

const { enCode } = require('../../utils/util')
const { USER_PROFILE_MODEL } = require('../../models/users/UserProfileModel')
const { MODEL_DEPARTMENTS_NAME } = require('../../models/information/DepartmentsModel')
const { defaultSchema } = require('../../models/Store/Store')
const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')
const { USER_MODEL } = require('../../models/Users')
const { MODEL_CITIES_NAME } = require('../../models/information/CitiesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(USER_PROFILE_MODEL, {
    upId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    id: {
      type: INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: USER_MODEL,
          schema: schemaName
        },
        key: 'id'
      },
      unique: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    upPhone: {
      type: STRING(20),
      allowNull: true
    },
    upImage: {
      type: STRING(200),
      allowNull: true
    },
    upDateBir: {
      type: STRING(50),
      allowNull: true
    },
    upAddress: {
      type: STRING(100),
      allowNull: true
    },
    // Locations
    cId: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: MODEL_COUNTRIES_NAME,
          schema: defaultSchema
        },
        key: 'cId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    dId: {
      type: INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
      references: {
        model: {
          tableName: MODEL_DEPARTMENTS_NAME,
          schema: defaultSchema
        },
        key: 'dId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    ctId: {
      type: INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
      references: {
        model: {
          tableName: MODEL_CITIES_NAME,
          schema: defaultSchema
        },
        key: 'ctId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    upZipCode: {
      type: STRING(150),
      allowNull: true
    },
    upLatitude: {
      type: STRING(150),
      allowNull: true
    },
    upLongitude: {
      type: STRING(150),
      allowNull: true
    },
    createAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    },
    updateAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(USER_PROFILE_MODEL, { schema: schemaName })
}
