const { STRING, literal } = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { USER_PROFILE_MODEL } = require('../../models/users/UserProfileModel')
const { MODEL_DEPARTMENTS_NAME } = require('../../models/information/DepartmentsModel')
const { defaultSchema } = require('../../models/Store/Store')
const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')
const { USER_MODEL } = require('../../models/Users')
const { MODEL_CITIES_NAME } = require('../../models/information/CitiesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(USER_PROFILE_MODEL, {
    upId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    id: {
      type: STRING(36),
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
      unique: true

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
      type: STRING(36),
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: MODEL_COUNTRIES_NAME,
          schema: defaultSchema
        },
        key: 'cId'
      }

    },
    dId: {
      type: STRING(36),
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
      references: {
        model: {
          tableName: MODEL_DEPARTMENTS_NAME,
          schema: defaultSchema
        },
        key: 'dId'
      }

    },
    ctId: {
      type: STRING(36),
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
      references: {
        model: {
          tableName: MODEL_CITIES_NAME,
          schema: defaultSchema
        },
        key: 'ctId'
      }

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
