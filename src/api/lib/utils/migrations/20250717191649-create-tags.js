const {
  UUIDV4,
  STRING,
  Sequelize,
  SMALLINT
} = require('sequelize')

const { TAGS_PRODUCT_MODEL_NAME } = require('../../models/Store/tagsProduct')
const { states } = require('../state_db')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(TAGS_PRODUCT_MODEL_NAME, {
    tgId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    idStore: {
      type: STRING(36),
      allowNull: true
    },
    idUser: {
      type: STRING(36),
      allowNull: true
    },
    nameTag: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    state: {
      type: SMALLINT,
      allowNull: false,
      defaultValue: states.ACTIVE
    },
    createdAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  // Elimina la tabla "TAGS_PRODUCT_MODEL_NAME"
  await queryInterface.dropTable(TAGS_PRODUCT_MODEL_NAME, { schema: schemaName })
}
