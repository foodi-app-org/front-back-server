/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable n/no-deprecated-api */
const crypto = require('crypto')

const { Base64 } = require('js-base64')

const SECRET_KEY = 'f128635fca2edc7bb4e47a577cfe0d1a013dcdceffacad1abb128e640f9e571c'

const enCode = value => {
  try {
    if (value) {
      const cipher = crypto.createCipher('aes-256-cbc', Buffer.from(SECRET_KEY, 'hex'))
      let encrypted = cipher.update(value.toString(), 'utf-8', 'hex')
      encrypted += cipher.final('hex')

      const uuid = [
        encrypted.substr(0, 8),
        encrypted.substr(8, 4),
        encrypted.substr(12, 4),
        encrypted.substr(16, 4),
        encrypted.substr(20)
      ].join('-')

      return uuid
    }
  } catch (error) {
    return ''
  }
}

const deCode = uuidValue => {
  try {
    if (!uuidValue) return ''

    if (typeof uuidValue !== 'string') {
      uuidValue = uuidValue.toString()
    }

    const encryptedHex = uuidValue.replace(/-/g, '')
    const decipher = crypto.createDecipher('aes-256-cbc', Buffer.from(SECRET_KEY, 'hex'))
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf-8') // Cambia 'hex' a 'utf-8'
    decrypted += decipher.final('utf-8') // Cambia 'hex' a 'utf-8'

    return parseInt(decrypted, 10)
  } catch (error) {
    return ''
  }
}

const linkBelongsTo = (modelOne, modelTwo, target, foreign) => modelOne.belongsTo(modelTwo, {
  targetKey: target,
  foreignKey: foreign
})

const linkHasMany = (modelOne, modelTwo, target, foreign) => modelOne.hasMany(modelTwo, {
  targetKey: target,
  foreignKey: foreign
})

const consecutive = value => {
  let consecutive = parseInt(value) + 1
  consecutive = `${consecutive}`
  if (consecutive.length === 4) { consecutive = `00${consecutive}` } else if (consecutive.length === 5) { consecutive = `0${consecutive}` }
  return consecutive
}

const UpCrNotFind = async (model, newItem, where, condition, updateFind = false) => {
  /** confirma si hay id para actualizar o registrar */
  if (condition) {
    const data = await model.update(newItem, { where: where || { [condition.id]: deCode(condition.value) } })
    if (!!data[0] && !!updateFind) { return await model.findOne({ where: where || { [condition.id]: deCode(condition.value) } }) } else { return where || { [condition.id]: condition.value } }
  } else { return await model.create(newItem) }
}

const UpCrFind = async (model, newItem, where, condition, updateFind = false) => {
  const res = await model.findOne({ where: where || { [condition.id]: deCode(condition.value) } })
  /** confirma si hay id para actualizar o registrar */
  if (res) {
    await model.update(newItem, { where: where || { [condition.id]: deCode(condition.value) } })
    return res
  } else { return await model.create(newItem) }
}

const updateOrCreate = async (model, newItem, where) => {
  /** busca si existe */
  const result = await model.findOne({ where })
  /** confirma si existe para actualizar o registrar */
  if (result) {
    const data = await model.update(newItem, { where })
    if (data[0] !== 0) { return await model.findOne({ where }) } else { return result }
  } else { return await model.create(newItem) }
}

// Busca los campos que coinciden con la base de datos y la query de graphql
const getAttributes = (model, { fieldNodes }) => {
  // get the fields of the Model (columns of the table)
  const columns = new Set(Object.keys(model.rawAttributes))
  const requested_attributes = fieldNodes[0].selectionSet?.selections
    .map(({ name: { value } }) => value)
    // filter the attributes against the columns
  return requested_attributes.filter(attribute => columns.has(attribute))
}

/**
 * Verifica que contenga un valor
 * @version 0.0.1
 * @param {*} value valor
 * @return {boolean} true o false
 */
const isNull = value => {
  if (!!value || value === 0) return false
  return true
}
const validationID = (value, typeNull = true) => {
  try {
    if (typeNull && isNull(value) && isNaN(Base64.decode(value))) throw new Error('No es una codificación valida.')
    else if (!typeNull && isNaN(value ? Base64.decode(value) : 0)) throw new Error('No es una codificación valida')
    return value ? deCode(value) : null
  } catch (error) {
    throw new Error('No es una codificación valida.')
  }
}

/**
 *
 * @param {Object} data objeto a filtrar
 * @param {Array} filters array a comparar o claves del objeto
 * @return {Object} devuelve un objeto con los datos filtrados
 */
const filterKeyObject = (data, filters) => {
  let values = {}
  for (const elem in data) {
    let coincidence = false
    for (let i = 0; i < filters.length; i++) if (elem === filters[i]) coincidence = true

    if (!coincidence) values = { ...values, [elem]: data[elem] }
  }

  return values
}
/**
 * valida los inputs
 * @version 0.0.1
 * @param {*} data valor
 * @param {boolean} typeNull null
 * @param {boolean} typeRange rango
 * @param {number} minRange minimo de rango
 * @param {number} maxRange maximo de rango
 * @param {boolean} typeLetters letras
 * @param {boolean} typeNumeric numerico
 * @param {boolean} typeEmail correo electronico
 * @param {boolean} typeFormat formato numerico
 * @return {boolean} true o false
 */

module.exports = {
  enCode,
  deCode,
  consecutive,
  // pushNotifications,
  UpCrNotFind,
  UpCrFind,
  linkBelongsTo,
  linkHasMany,
  updateOrCreate,
  getAttributes,
  validationID,
  filterKeyObject
}
