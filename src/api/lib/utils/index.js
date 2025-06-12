import os from 'os'

import jwt, { decode } from 'jsonwebtoken'
import { google } from 'googleapis'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

require('dotenv').config()

export const generateToken = dataUser => {
  const expiresIn = '1d'
  const AccessToken = jwt.sign(dataUser, process.env.AUTHO_USER_KEY, { expiresIn })
  return AccessToken
}

export async function hashPassword (plainPassword) {
  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(plainPassword, saltRounds)
    return hash
  } catch (error) {
    throw new Error('Error al encriptar la contraseña')
  }
}

export async function comparePasswords (plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
    return isMatch
  } catch (error) {
    throw new Error('Error al comparar las contraseñas')
  }
}

export const linkBelongsTo = (modelOne, modelTwo, target, foreign) => modelOne.belongsTo(modelTwo, {
  targetKey: target,
  foreignKey: foreign
})

export const isNull = dato => {
  if (!dato || dato === '') {
    return true
  } else return false
}

export const URL_BASE = 'http://localhost:4000/'

export const isNumeric = dato => {
  // const value = dato.replace(/,/g, '');
  if (isNaN(dato) && dato !== '' && dato !== undefined && dato !== null) {
    return true
  } else return false
}
export const isPassword = dato => {
  const validar = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/
  if (validar.test(dato) === true) {
    return false
  } else return true
}

export const onlyLetters = dato => {
  const validar = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g
  if (validar.test(dato) === false && dato !== '' && dato !== undefined && dato !== null) {
    return true
  } else return false
}

export const rangeLength = (dato, min, max) => {
  if (dato !== undefined && dato !== '' && dato !== null) {
    if ((dato.length < min) || (dato.length > max)) {
      return true
    } else return false
  } else { return false }
}

export const Match = (dato1, dato2) => {
  if (dato1 !== dato2) {
    return true
  } else return false
}

export const isEmail = email => {
  const validar = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
  if (validar.test(email) === false && email !== '' && email !== undefined && email !== null) {
    return true
  } else return false
}

export const passwordConfirm = (value, valueConfirm) => !(value === valueConfirm)
// export const numberFormat = value => value ? (parseInt(value) ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(parseFloat(`${value}`.replace(/\./g, ''))) : '') : (value === 0 ? 0 : '')

// var options = { style: 'currency', currency: 'GBP' };
// export const numberFormat = value => value && parseFloat(value) && new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
// export const numberFormat = value => value ? (parseInt(value) ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(parseFloat(`${value}`.replace(/\./g, ''))) : '') : (value === 0 ? 0 : '')
export const numberFormat = value => value ? (parseInt(value) ? new Intl.NumberFormat('de-DE').format(parseFloat(`${value}`.replace(/\./g, ''))) : '') : (value === 0 ? 0 : '')

// valida los inputs
export const validations = (e, typeNull, typeLetters, typeNumeric, typeRange, minRange, maxRange, typeEmail, typeFormat) => {
  let { value } = e.target
  const { nextSibling } = e.target
  // verifica si es formato de numero */
  if (typeFormat) { value = value.replace(/\./g, '') }
  // verifica que campos seran y si se encuentra la condicion o no
  if (typeNull) {
    if (isNull(value)) {
      e.target.style.border = '1px solid  red'
      nextSibling.innerHTML = 'Campo requerido.'
      return true
    }
  }
  if (typeNumeric) {
    if (isNumeric(value)) {
      e.target.style.border = '1px solid  red'
      nextSibling.innerHTML = 'Solo puede contener números.'
      return true
    }
  }
  if (typeRange) {
    if (rangeLength(value, minRange, maxRange)) {
      e.target.style.border = '1px solid  red'
      nextSibling.innerHTML = `El rango de caracteres es de ${minRange} a ${maxRange}.`
      return true
    }
  }
  if (typeLetters) {
    if (onlyLetters(value)) {
      e.target.style.border = '1px solid  red'
      nextSibling.innerHTML = 'Solo puede contener letras.'
      return true
    }
  }
  if (typeEmail) {
    if (isEmail(value)) {
      e.target.style.border = '1px solid  red'
      nextSibling.innerHTML = 'No es un formato de email valido.'
      return true
    }
  }
  e.target.style.border = '1px solid  red'
  nextSibling.innerHTML = ''
  return false
}

// valida el formulario
export const validationForm = (inputs, error) => {
  let errorForm = false
  /** verifica los campos del formulario */
  for (let i = 0; i < inputs.length; i++) {
    /** verifica los input y select si se encuentra vacio o si no, si hay un error del onchange */
    if ((!!inputs[i].value === false || inputs[i].value === 'false') && inputs[i].type !== 'submit' && inputs[i].type !== 'file' && inputs[i].type !== 'button') {
      //  verifica si es un input, select obligatorio */
      if (inputs[i].dataset.ignore === 'false') {
        inputs[i].style.border = '1px solid  red'
        inputs[i].nextSibling.innerHTML = 'Campo requerido.'
        errorForm = true
      } else if (inputs[i].dataset.ignore === undefined) {
        if (inputs[i].type === 'tel') {
          inputs[i].style.border = '1px solid  red'
          inputs[i].nextSibling.style.border = '1px solid  red'
          inputs[i].parentNode.nextSibling.innerHTML = 'Campo requerido.'
        } else {
          inputs[i].parentNode.style.border = '1px solid  red'
          inputs[i].parentNode.nextSibling.innerHTML = 'Campo requerido.'
        }
        errorForm = true
      }
    } else
      if (error[inputs[i].name]) { errorForm = true }
  }
  return errorForm
}

export const validationImg = file => (/\.(jpg|png|gif|jpeg)$/i).test(file.name)

export const CalcularDigitoVerificacion = value => {
  let x = 0; let y = 0; let i = 0; let myNit

  // Se limpia el Nit
  myNit = value.replace(/\s/g, '') // Espacios
  myNit = value.replace(/,/g, '') // Comas
  myNit = value.replace(/\./g, '') // Puntos
  myNit = value.replace(/-/g, '') // Guiones

  // Se valida el nit
  if (isNaN(myNit)) {
    return ''
  }

  // Procedimiento
  const vpri = new Array(16)
  const z = myNit.length

  vpri[1] = 3
  vpri[2] = 7
  vpri[3] = 13
  vpri[4] = 17
  vpri[5] = 19
  vpri[6] = 23
  vpri[7] = 29
  vpri[8] = 37
  vpri[9] = 41
  vpri[10] = 43
  vpri[11] = 47
  vpri[12] = 53
  vpri[13] = 59
  vpri[14] = 67
  vpri[15] = 71

  for (i; i < z; i++) {
    y = myNit.substr(i, 1)

    x += (y * vpri[z - i])
  }

  y = x % 11

  return (y > 1) ? 11 - y : y
}

export const extFile = filename => (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined

export const validationsTF = (input, label, tooltip, icon, text, res) => {
  if (res) {
    input.style.backgroundColor = '#FBCACA'
    input.style.borderColor = '#15558d'
    input.style.color = '#15558d'
    label.style.color = '#15558d'
    tooltip.style.opacity = 1
    tooltip.innerHTML = text
    icon.style.opacity = 1
  } else {
    input.style.backgroundColor = 'transparent'
    input.style.borderColor = '#15558d'
    input.style.color = '#15558d'
    label.style.color = '#15558d'
    tooltip.style.opacity = 0
    tooltip.innerHTML = ''
    icon.style.opacity = 0
  }
  return res
}

// valida el formulario
export const validationFormTwo = (inputs, error) => {
  let errorForm = false
  /** verifica los campos del formulario */
  for (let i = 0; i < inputs.length; i++) {
    const { value, type, nextSibling, parentNode, dataset } = inputs[i]
    /** verifica los input y select si se encuentra vacio o si no, si hay un error del onchange */
    if ((!value || value === 'false' || (type === 'tel' && value.length <= 8)) && type !== 'submit' && type !== 'file' && type !== 'button') {
      /** verifica si es un input, select obligatorio */
      if (type === 'tel') {
        inputs[i].style.backgroundColor = '#FBCACA'
        inputs[i].style.borderColor = '#15558d'
        nextSibling.style.backgroundColor = '#FBCACA'
        nextSibling.style.borderColor = '#15558d'
        parentNode.parentNode.firstChild.nextSibling.style.color = '#15558d'
        parentNode.parentNode.firstChild.nextSibling.nextSibling.style.opacity = 1
        parentNode.parentNode.firstChild.nextSibling.nextSibling.innerHTML = 'Campo Requerido.'
        parentNode.parentNode.lastChild.style.opacity = 1
      } else if (dataset.ignore === 'false') errorForm = validationsTF(inputs[i], nextSibling, nextSibling.nextSibling, parentNode.lastChild, 'Campo Requerido.', true)
      else if (dataset.ignore === undefined) errorForm = validationsTF(parentNode, parentNode.firstChild.nextSibling, parentNode.firstChild.nextSibling.nextSibling, parentNode.lastChild, 'Campo Requerido.', true)
    } else error[inputs[i].name] && (errorForm = true)
  }
  return errorForm
}

// verifica los select
export const validationsSelectTwo = v => {
  const s = document.getElementById(v.target.name)
  if (s) { return validationsTF(s.parentNode, s.parentNode.firstChild.nextSibling, s.parentNode.firstChild.nextSibling.nextSibling, s.nextSibling, false, false) }
}

// valida los inputs
export const validationsTwo = (e, typeNull, typeLetters, typeNumeric, typeRange, minRange, maxRange, typeEmail, typeFormat) => {
  let { value } = e.target
  const { nextSibling, parentNode } = e.target
  /** verifica si es formato de numero */
  if (typeFormat) { value = value.replace(/\./g, '') }
  /** verifica que campos seran y si se encuentra la condicion o no */
  if (typeNull) {
    if (isNull(value)) { return validationsTF(e.target, nextSibling, nextSibling.nextSibling, parentNode.lastChild, 'Campo Requerido', true) }
  }
  if (typeNumeric) {
    if (isNumeric(value)) { return validationsTF(e.target, nextSibling, nextSibling.nextSibling, parentNode.lastChild, 'Solo puede contener números', true) }
  }
  if (typeRange) {
    if (rangeLength(value, minRange, maxRange)) { return validationsTF(e.target, nextSibling, nextSibling.nextSibling, parentNode.lastChild, `El rango de caracteres es de ${minRange} a ${maxRange}.`, true) }
  }
  if (typeLetters) {
    if (onlyLetters(value)) { return validationsTF(e.target, nextSibling, nextSibling.nextSibling, parentNode.lastChild, 'Solo puede contener letras', true) }
  }
  if (typeEmail) {
    if (isEmail(value)) { return validationsTF(e.target, nextSibling, nextSibling.nextSibling, parentNode.lastChild, 'No es un formato de email valido', true) }
  }
  return validationsTF(e.target, nextSibling, nextSibling.nextSibling, parentNode.lastChild, false, false)
}

/**
 *
 * @param {Object} data objeto a filtrar
 * @param {Array} filters array a comparar o claves del objeto a excluir
 * @return {Object} devuelve un objeto con los datos filtrados
 */
export const filterKeyObjectOLD = (data, filters) => {
  let values = {}
  for (const elem in data) {
    let coincidence = false
    for (let i = 0; i < filters.length; i++) if (elem === filters[i]) coincidence = true

    if (!coincidence) values = { ...values, [elem]: data[elem] }
  }

  return values
}
export const filterObject = (obj, filters) => {
  let values = {}
  values = Object.keys(obj).filter((key) => !key.includes(filters)).reduce((cur, key) => Object.assign(cur, { [key]: obj[key] }), {})
  return values
}
/**
 * @description Funcion que valida los formularios, funciona para trabajar los errores con estados
 * @version 0.1.1
 * @param {array} elements elementos del formulario
 * @return {array} devuelve un array de bolleanos con el nombre identificador para cada estado en react.
 */
export const validationSubmitHooks = elements => {
  let errorForm = {}
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].name) {
      if (elements[i].type === 'text' || elements[i].type === 'password' || elements[i].type === 'email' || elements[i].type === 'number' || elements[i].type === 'hidden') {
        if (elements[i].dataset.required === 'true') {
          if (!elements[i].value) errorForm = { ...errorForm, [elements[i].name]: !elements[i].value }
          else errorForm = { ...errorForm, [elements[i].name]: !elements[i].value }
        } else {
          errorForm = { ...errorForm, [elements[i].name]: false }
        }
      }
    }
  }
  return errorForm
}

export const getUserFromToken = async (token) => {
  try {
    if (!token) {
      return { session: false, error: true, message: 'Token not provided' }
    }

    const tokenState = getTokenState(token)
    const { needRefresh, valid } = tokenState || {}

    if (valid && !needRefresh) {
      return { session: true, error: false, message: 'Session is valid' }
    }

    if (needRefresh) {
      return { session: false, error: true, message: 'Session expired, refresh needed' }
    }

    return { session: false, error: true, message: 'Token is not valid' }
  } catch (error) {
    return { session: false, error: true, message: 'Internal error' }
  }
}

export function parseCookies (request) {
  const list = {}
  const cookieHeader = request.headers?.cookie
  if (!cookieHeader) return list

  cookieHeader.split(';').forEach((cookie) => {
    let [name, ...rest] = cookie.split('=')
    name = name?.trim()
    if (!name) return
    const value = rest.join('=').trim()
    if (!value) return
    list[name] = decodeURIComponent(value)
  })

  return list
}

/**
 *
 * @param {Object} data objeto a filtrar
 * @param {Array} filters array a comparar o claves del objeto a excluir
 * @param {boolean} dataFilter booleano para devolver los datos filtrados o no
 * @return {Object} devuelve un objeto con los datos filtrados
 */
export const filterKeyObject = (data, filters, dataFilter) => {
  let values = {}; let valuesFilter = {}
  for (const elem in data) {
    let coincidence = false
    for (let i = 0; i < filters.length; i++) {
      if (elem === filters[i]) coincidence = true
      else valuesFilter = filters[i]
    }

    if (!coincidence) values = { ...values, [elem]: data[elem] }
    else valuesFilter = { ...valuesFilter, [elem]: data[elem] }
  }
  if (!dataFilter) return values
  if (dataFilter) return { values, valuesFilter }
}

/**
 * busca en el localstore la información y la parsea si es necesario
 * @version 0.0.1
 * @param {*} jsonValue clave de búsqueda
 * @param {boolean} isParse si se quiere parsear o no
 * @return {boolean} devuelve el valor parseado o false si pudo guardar en localStorage
 */
export const getDataLS = jsonValue => {
  try {
    return (jsonValue ? JSON.parse(jsonValue) : null)
  } catch (e) {
    return jsonValue
  }
}
export function parse (str) {
  return null
}

/**
 * actualizar cache de apollo
 * @param {object} params parametros para actualizar el cachet de apollo
 * @returns {null} no hay retorno
 */
export const updateCache = async ({ cache, query, nameFun, dataNew }) => cache.modify({
  fields: {
    [nameFun] (dataOld = {}) {
      return cache.writeQuery({ query, data: { ...dataOld, data: { ...(dataOld?.data || {}), ...(dataNew?.data || {}) } } })
    }
  }
})

/**
 * obtiene el token del usuario lo guarda en el localStorage
 * @returns {null} no hay retorno
 */
const TOKEN = 'sma.sv1'

export function setToken (token) {
  if (token === null) return false
  else if (token !== null) return JSON.parse
  return null
}
/**
 * obtiene el token del usuario
 * @returns {null} no hay retorno
 */
export function getToken ({ restaurant }) {
  return localStorage.getItem(restaurant || TOKEN)
}
// obtiene el token del usuario y lo descodifica
export function decodeToken (token) {
  return decode(token)
}
const now = Date.now().valueOf() / 1000

export function getTokenState (token) {
  try {
    if (!token) {
      return { valid: false, needRefresh: true }
    }
    const decoded = decode(token)
    if (!decoded) {
      return { valid: false, needRefresh: true }
    } else if (decoded.exp && jwt.decode(token)?.exp < now) {
      return { valid: true, needRefresh: true }
    } else {
      return { valid: true, needRefresh: false }
    }
  } catch (error) {
    return { }
  }
}
// Obtiene el token y lo elimina
export function removeToken () {
  return localStorage.removeItem(TOKEN)
}
export const validateEmail = email => {
  const re = /^(([^<> ()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
/**
 * Transforma una cadena de caracteres a todos mayuscula
 * @version 0.0.1
 * @param {string} value valor en numeros
 * @return {string} nuevo formato en teléfono
 */
export const upperCase = value => `${value || ''}`.toUpperCase()

/**
 * Transforma un numero en formato de teléfono
 * @version 0.0.1
 * @param {string} value valor en numeros
 * @return {string} nuevo formato en teléfono
 */
//  export const phoneFormat = value => !!value && parsePhoneNumber(`${ value }`, 'US')?.formatNational()
/**
 * Calcula el dígito de verificación
 * @version 0.0.1
 * @param {string} value valor en números
 * @return {numeric} el dígito de verificación
 */
export const calculateCheckDigit = value => {
  // variables necesarias
  let nit = `${value}`
  const vpri = [undefined, 3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]

  // Se limpia el Nit
  nit = nit.replace(/\s/g, '') // Espacios
  nit = nit.replace(/,/g, '') // Comas
  nit = nit.replace(/\./g, '') // Puntos
  nit = nit.replace(/-/g, '') // Guiones

  // Se valida el nit
  if (isNaN(nit)) return ''

  // Procedimiento
  let x = 0
  let y = 0
  let i = 0
  const z = nit.length

  for (i; i < z; i++) {
    y = nit.substr(i, 1)

    x += (y * vpri[z - i])
  }

  y = x % 11

  return (y > 1) ? 11 - y : y
}
/**
 * valida los inputs
 * @version 0.0.1
 * @param {boolean} data valor
 * @param {boolean} typeNull null
 * @param {boolean} typeLetters letras
 * @param {boolean} typeNumeric numerico
 * @param {boolean} typeRange rango
 * @param {boolean} minRange minimo de rango
 * @param {boolean} maxRange máximo de rango
 * @param {boolean} typeEmail correo electronico
 * @param {boolean} typeFormat formato numerico
 * @param {boolean} typeMatch comparación
 * @param {boolean} valueMatch segundo valor para comparar
 * @return {boolean} true o false
 */
export const validationsOld = (e, typeNull, typeLetters, typeNumeric, typeRange, minRange, maxRange, typeEmail, typeFormat) => {
  let { value } = e.target
  const { nextSibling, parentNode } = e.target

  /** verifica si es formato de número */
  if (typeFormat) value = value.replace(/\./g, '')
  /** verifica que campos seran y si se encuentra la condicion o no */
  if (typeNull) {
    if (isNull(value)) return validationsTF(parentNode, nextSibling, 'Campo requerido.', true)
  }
  if (typeNumeric) {
    if (isNumeric(value)) return validationsTF(parentNode, nextSibling, 'Solo puede contener números.', true)
  }
  if (typeRange) {
    if (rangeLength(value, minRange, maxRange)) return validationsTF(parentNode, nextSibling, `El rango de caracteres es de ${minRange} a ${maxRange}.`, true)
  }
  if (typeLetters) {
    if (onlyLetters(value)) return validationsTF(parentNode, nextSibling, 'Solo puede contener letras.', true)
  }
  if (typeEmail) {
    if (isEmail(value)) return validationsTF(parentNode, nextSibling, 'No es un formato de email valido.', true)
  }
  return validationsTF(parentNode, nextSibling, false, false)
}
/**
 * Busca el tipo de base 64
 * @version 0.0.1
 * @param {string} filename nombre del archivo con la extension
 * @return {string} nombre del tipo de base 64
 */
export const Bucket = 'NAME'
//
/**
 * Busca la extension del archivo
 * @version 0.0.1
 * @param {string} Key Key del bucket
 * @param {string} name nombre del documento
 * @return {string} nombre de la extension
 */
// export const getFileS3 = async (Key, name) => {
//     const S3 = AWS3()
//     const result = await S3.getObject({ Bucket, Key }).promise().catch(() => undefined)
//     return result && `data:${extFileType(name)};base64,${result.Body.toString('base64')}`
// }

/**
 * guarda un documento en S3
 * @param {String} Key variable de búsqueda
 * @param {Array} Body Array de buffer del documento
 * @return {String} respuesta del servidor
 */
// export const putFileS3 = async (Key, Body) => {
//     const S3 = AWS3()
//     const res = await S3.putObject({ Bucket, Key, Body }).promise().catch(() => undefined)
//     return res
// }
/**
 * Unidad en letra
 * @version 0.0.1
 * @param {number} value numero
 * @return {string} numero el letra
 */
const Unidades = value => {
  switch (value) {
  case 1: return 'UN'
  case 2: return 'DOS'
  case 3: return 'TRES'
  case 4: return 'CUATRO'
  case 5: return 'CINCO'
  case 6: return 'SEIS'
  case 7: return 'SIETE'
  case 8: return 'OCHO'
  case 9: return 'NUEVE'
  default: return ''
  }
}

/**
 * Decena en letra
 * @version 0.0.1
 * @param {string} strSin numero en letra
 * @param {string} numUnit numero en letras
 * @return {string} concatena al cantidad
 */
const DecenasY = (strSin, numUnit) => {
  if (numUnit > 0) return `${strSin} Y ${Unidades(numUnit)}`
  return strSin
}

/**
 * Decena en letra
 * @version 0.0.1
 * @param {number} value numero
 * @return {string} cantidad en letra
 */
const Decenas = value => {
  const ten = Math.floor(value / 10)
  const Unit = value - (ten * 10)

  switch (ten) {
  case 1:
    switch (Unit) {
    case 0: return 'DIEZ'
    case 1: return 'ONCE'
    case 2: return 'DOCE'
    case 3: return 'TRECE'
    case 4: return 'CATORCE'
    case 5: return 'QUINCE'
    default: return `DIECI${Unidades(Unit)}`
    }
  case 2:
    switch (Unit) {
    case 0: return 'VEINTE'
    default: return `VEITI${Unidades(Unit)}`
    }
  case 3: return DecenasY('TREINTA', Unit)
  case 4: return DecenasY('CUARENTA', Unit)
  case 5: return DecenasY('CINCUENTA', Unit)
  case 6: return DecenasY('SESENTA', Unit)
  case 7: return DecenasY('SETENTA', Unit)
  case 8: return DecenasY('OCHENTA', Unit)
  case 9: return DecenasY('NOVENTA', Unit)
  case 0: return Unidades(Unit)
  default: return ''
  }
}
/**
 * Centenas en letra
 * @version 0.0.1
 * @param {number} value numero
 * @return {string} cantidad en letra
 */
const Centenas = value => {
  const hundreds = Math.floor(value / 100)
  const tens = value - (hundreds * 100)

  switch (hundreds) {
  case 1:
    if (tens > 0) return `CIENTO${Decenas(tens)}`
    return 'CIEN'
  case 2: return `DOSCIENTOS${Decenas(tens)}`
  case 3: return `TRESCIENTOS${Decenas(tens)}`
  case 4: return `CUATROCIENTOS${Decenas(tens)}`
  case 5: return `QUINIENTOS${Decenas(tens)}`
  case 6: return `SEISCIENTOS${Decenas(tens)}`
  case 7: return `SETECIENTOS${Decenas(tens)}`
  case 8: return `OCHOCIENTOS${Decenas(tens)}`
  case 9: return `NOVECIENTOS${Decenas(tens)}`
  default: return Decenas(tens)
  }
}

/**
 * Seccion en letra
 * @version 0.0.1
 * @param {number} value numero del valor
 * @param {number} divider numero de division
 * @param {string} strSingular numero en letras
 * @param {string} strPlural numero en letras
 * @return {string} cantidad en letra
 */
const Seccion = (value, divider, strSingular, strPlural) => {
  const hundreds = Math.floor(value / divider)
  const rest = value - (hundreds * divider)
  let letters = ''

  if (hundreds > 0) {
    if (hundreds > 1) letters = `${Centenas(hundreds)} ${strPlural}`
    else letters = strSingular
  }

  if (rest > 0) letters += ''

  return letters
}
/**
 * Miles en letra
 * @version 0.0.1
 * @param {number} value numero del valor
 * @return {string} cantidad en letra
 */
const Miles = value => {
  const divider = 1000
  const hundreds = Math.floor(value / divider)
  const rest = value - (hundreds * divider)
  const strThousands = Seccion(value, divider, 'UN MIL', 'MIL')
  const strhundreds = Centenas(rest)

  if (strThousands === '') return strhundreds

  return `${strThousands} ${strhundreds}`
}

/**
 * Millones en letra
 * @version 0.0.1
 * @param {number} value numero del valor
 * @return {string} cantidad en letra
 */
const Millones = value => {
  const divider = 1000000
  const hundreds = Math.floor(value / divider)
  const rest = value - (hundreds * divider)
  const strMillions = Seccion(value, divider, 'UN MILLON DE', 'MILLONES DE')
  const strThousands = Miles(rest)

  if (strMillions === '') return strThousands

  return `${strMillions} ${strThousands}`
}
/**
 * Formato de transformar numero a Letras
 * @version 0.0.1
 * @param {number} value numero del valor
 * @param {number} format activar formato de pesos
 * @return {string} cantidad en letra
 */
export const NumeroALetras = (value, format = false) => {
  const data = {
    number: value,
    integers: Math.floor(value),
    letterPennies: '',
    letterCoinPlural: format ? '' : 'PESOS COLOMBIANOS',
    letterCoinSingular: format ? '' : 'PESO COLOMBIANO',
    letterCoinPenniesPlural: 'CENTAVOS',
    letterCoinPennieSingular: 'CENTAVO',
    pennies: ((Math.round(value * 100)) - (Math.floor(value) * 100))
  }

  if (data.pennies > 0) {
    data.letterPennies = `CON ${(function () {
      if (data.pennies === 1) return `${Millones(data.pennies)} ${data.letterCoinPennieSingular}`
      else return `${Millones(data.pennies)} ${data.letterCoinPenniesPlural}`
    })()
    }`
  }

  if (data.integers === 0) return `CERO ${data.letterCoinPlural} ${data.letterPennies}`
  if (data.integers === 1) return `${Millones(data.integers)} ${data.letterCoinSingular} ${data.letterPennies}`
  else return `${Millones(data.integers)} ${data.letterCoinPlural} ${data.letterPennies}`
}

/**
 * Busca un valor aleatorio de 10 caracteres
 * @version 0.0.1
 * @return {string} Valor aleatorio
 */
export const valRand = () => {
  /** variables necesarias */
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  /** creación de codigo */
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}
// Te devuelve un valor en formato reducido en millones
export const numberFormatM = param => {
  let money = 0; let num = 0; let value = 0; let val = param
  if (val >= 1000000000) {
    num = `${val}`.charAt(0)
    value = parseFloat(`${num}000`)
    money += value
    val -= parseFloat(`${num}000000000`)
  }

  if (val >= 100000000) {
    num = `${val}`.charAt(0)
    value = parseFloat(`${num}00`)
    money += value
    val -= parseFloat(`${num}00000000`)
  }

  if (val >= 10000000) {
    num = `${val}`.charAt(0)
    value = parseFloat(`${num}0`)
    money += value
    val -= parseFloat(`${num}0000000`)
  }

  if (val >= 1000000) {
    num = `${val}`.charAt(0)
    value = parseFloat(`${num}`)
    money += value
    val -= parseFloat(`${num}000000`)
  }
  if (val >= 100000) {
    num = `${val}`.charAt(0)
    value = parseFloat(`0.${num}`)
    money += value
    val -= parseFloat(`${num}00000`)
  }
  if (val >= 10000) {
    num = `${val}`.charAt(0)
    value = parseFloat(`0.0${num}`)
    money += value
    val -= parseFloat(`${num}0000`)
  }
  if (val >= 1000) {
    num = `${val}`.charAt(0)
    value = parseFloat(`0.00${num}`)
    money += value
    val -= parseFloat(`${num}000`)
  }
  if (val >= 100) {
    num = `${val}`.charAt(0)
    value = parseFloat(`0.000${num}`)
    money += value
    val -= parseFloat(`${num}00`)
  }
  if (val >= 10) {
    num = `${val}`.charAt(0)
    value = parseFloat(`0.0000${num}`)
    money += value
    val -= parseFloat(`${num}0`)
  }
  if (val >= 1) {
    num = `${val}`.charAt(0)
    value = parseFloat(`0.00000${num}`)
    money += value
    val -= parseFloat(`${num}`)
  }

  return money.toFixed(2)
}

export const mongoObjectId = function () {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16)
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase()
}

export default function useKeypress (key, action) {
  return {}
}
export const CalculateIva = (quantity, rate, iPercentage, state) => {
  const rateNumber = parseInt(rate)
  const PercentageNumber = parseInt(iPercentage)
  const quantityNumber = parseInt(quantity)
  let TotalIva
  const SubTotal = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0
  if (state === 'INCLUSIVE') {
    TotalIva = SubTotal ? SubTotal / (100 + PercentageNumber) * PercentageNumber : 0
    return TotalIva
  } else if (state === 'EXCLUSIVE') {
    const PercentageNumber = parseInt(iPercentage)
    TotalIva = SubTotal ? (SubTotal * PercentageNumber) / 100 : 0
    return TotalIva
  } else {
    TotalIva = 0
    return TotalIva
  }
}
/**
 *
 * @param {value quantity} quantity
 * @param {*} rate
 * @returns {null} no hay retorno
 * @returns {calc} calculo amounTotal
 */
export const CalculateAmount = (quantity, rate) => {
  const quantityNumber = parseFloat(quantity)
  const rateNumber = parseFloat(rate)
  const amountTotal = quantityNumber && rateNumber ? quantityNumber * rateNumber : '00'
  return amountTotal
}
/**
 *
 * @param {*}
 * @returns {null} no hay retorno
 * @returns {date} date day
 */
const today = new Date()
export const dateNow = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

// export const handleDelete = async (_id, action = () => undefined) => {
//   useEffect(() => {
//     function onKeyup() {
//       if (_id) action()
//     }
//     onKeyup()
//   }, [_id])
// }

export const hiddenEmail = email => {
  const domain = email.replace(/.*@/, '')
  const username = email.replace(/@.*/, '')
  const sliceDomain = domain.slice(domain.indexOf('.'), domain.length)
  const sliceUsername = username.slice(0, 3)
  const lastChar = username.charAt(username.length - 1)
  const usernameLengthToHide =
        username.length - (sliceUsername.length + lastChar.length)
  const hideUsername = '*'.repeat(usernameLengthToHide)
  const domainLengthToHide = domain.length - sliceDomain.length
  const hideDomain = '*'.repeat(domainLengthToHide)
  const result = `${sliceUsername}${hideUsername}${lastChar}@${hideDomain}${sliceDomain}`
  return result
}
export const roundToTwo = (num) => (Math.round(num + 'e+2') + 'e-2')

export const NewDateFormat = (date) => {
  try {
    return date
  } catch (error) {
    return null
  }
}

export const convertBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
    }
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = error => {
      reject(error)
    }
  })
/**
 * OBTIENE EL TAMAÑO DE EL ARCHIVO
 */
export const getFileSizeByUnit = (file, unit = 'B') => {
  const originFileSize = file && file.size
  if (!originFileSize) {
    return 0
  }
  const unitStr = unit.toUpperCase()
  const unitFormula = {
    B: size => size,
    KB: size => size / 1024,
    MB: size => size / (1024 * 1024),
    GB: size => size / (1024 * 1024 * 1024),
    TB: size => size / (1024 * 1024 * 1024 * 1024)
  }
  return [unitFormula[unitStr] ? unitFormula[unitStr](originFileSize) : 0, { unit }]
}
export function RandomCode (length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
            charactersLength))
  }
  return result
}
export function getActiveToken (input, cursorPosition) {
  // recuperamos la posición actual del cursor
  if (cursorPosition === undefined) return undefined
  // creamos un array temporal para guardar las palabras
  const words = []
  // recorremos el texto y lo separamos por espacios y saltos de línea
  input.split(/[\s\n]/).forEach((word, index) => {
    // recuperamos la palabra anterior
    const previous = words[index - 1]
    // calculamos el rango de la palabra
    // recuperamos el índice inicial de la palabra
    const start = index === 0 ? index : previous.range[1] + 1
    // recuperamos donde termina la palabra
    const end = start + word.length
    // guardamos la palabra y su rango en el texto
    words.push({ word, range: [start, end] })
  })
  // buscamos en qué palabra estamos dependiendo de la posición del cursor
  return words.find(
    ({ range }) => range[0] <= cursorPosition && range[1] >= cursorPosition
  )
}

export const DEFAULT_CVC_LENGTH = 3
export const DEFAULT_ZIP_LENGTH = 5
export const DEFAULT_CARD_FORMAT = /(\d{1,4})/g
export const CARD_TYPES = {
  amex: {
    name: 'Amex',
    color: 'green'
  },
  visa: {
    name: 'Visa',
    color: 'lime'
  },
  diners: {
    name: 'Diners',
    color: 'orange'
  },
  discover: {
    name: 'Discover',
    color: 'purple'
  },
  jcb: {
    name: 'Jcb',
    color: 'red'
  },
  jcb15: {
    name: 'Jcb',
    color: 'red'
  },
  maestro: {
    name: 'Maestro',
    color: 'yellow'
  },
  mastercard: {
    name: 'Mastercard',
    color: 'lightblue'
  },
  unionpay: {
    name: 'Unipay',
    color: 'cyan'
  }
}

export const getCardType = (cardNum) => {
  let payCardType = ''
  const regexMap = [
    { regEx: /^4[0-9]{5}/gi, cardType: 'VISA' },
    { regEx: /^5[1-5][0-9]{4}/gi, cardType: 'MASTERCARD' },
    { regEx: /^3[47][0-9]{3}/gi, cardType: 'AMEX' },
    { regEx: /^6[0-9]{5}/gi, cardType: 'DISCOVER' },
    { regEx: /^(5[06-8]\d{4}|6\d{5})/gi, cardType: 'MAESTRO' }
  ]

  for (let j = 0; j < regexMap.length; j++) {
    if (cardNum.match(regexMap[j].regEx)) {
      payCardType = regexMap[j].cardType
      break
    }
  }
  if (
    cardNum.indexOf('50') === 0 ||
        cardNum.indexOf('60') === 0 ||
        cardNum.indexOf('65') === 0
  ) {
    const g = '508500-508999|606985-607984|608001-608500|652150-653149'
    const i = g.split('|')
    for (let d = 0; d < i.length; d++) {
      const c = parseInt(i[d].split('-')[0], 10)
      const f = parseInt(i[d].split('-')[1], 10)
      if (
        cardNum.substr(0, 6) >= c &&
                cardNum.substr(0, 6) <= f &&
                cardNum.length >= 6
      ) {
        payCardType = 'RUPAY'
        break
      }
    }
  }
  return payCardType
}

// 'midudev'.Length // 7
// 'midudev' [1] // i
// 'midudev'.includes('dev') // true
// 'midudev'.index0f ('midu') // 0
// 'midudev'.startsWith('midu') // true
// 'midudev'.endsWith('paint') // false
// 'midudev'.slice(0, 4) // 'midu'
// 'midudev'.slice(4) // 'dev'
// 'midudev'.toUpperCase() // 'MIDUDEV'
// 'MiduDev'.toLowerCase() // 'midudev'
// 'midudev'.replace('dev',') // 'midu
// 'midu'.repeat(3) // 'midumidumidu'
//  ' mi du '. trim() // 'mi du'
// 'mi du dev'.split(' ') // [ 'mi', 'du', 'dev' ]
// var todayDate = new Date().toISOString().slice(0, 10);
// var d = new Date(todayDate);
// d.setMonth(d.getMonth() -3);
// console.log(todayDate)
// console.log(d.toISOString().slice(0, 10));

function getDeviceInfo () {
  const deviceInfo = {
    cpuModel: os.cpus()[0].model,
    platform: os.platform(),
    cpuArchitecture: os.arch(),
    totalMemory: os.totalmem() / (1024 * 1024 * 1024), // Convertir a GB
    freeMemory: os.freemem() / (1024 * 1024 * 1024), // Convertir a GB
    hostname: os.hostname(),
    release: os.release(),
    uptime: os.uptime(),
    userInfo: os.userInfo(),
    networkInterfaces: os.networkInterfaces()
  }

  return deviceInfo
}

export function parseUserAgent (userAgent) {
  if (!userAgent) return

  const browserInfo = {
    name: 'Unknown',
    short_name: getDeviceInfo().cpuModel,
    version: getDeviceInfo().release || 'Unknown',
    family: 'Unknown',
    platform: getDeviceInfo().platform || 'Unknown',
    device: detectDeviceType(userAgent),
    os: detectOperatingSystem(userAgent),
    model: detectDeviceModel(userAgent)
  }

  const browser = detectBrowser(userAgent)
  browserInfo.name = browser.name
  browserInfo.version = browser.version
  browserInfo.family = browser.family

  return browserInfo
}

function detectDeviceType (userAgent) {
  if (/Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent)) return 'Mobile'
  if (/Tablet/i.test(userAgent)) return 'Tablet'
  return 'Desktop'
}

function detectDeviceModel (userAgent) {
  const modelPatterns = {
    iPhone: /iPhone/i,
    iPad: /iPad/i,
    SamsungGalaxy: /Samsung Galaxy/i
  }

  for (const [model, pattern] of Object.entries(modelPatterns)) {
    if (pattern.test(userAgent)) return model
  }

  return 'Unknown'
}

function detectBrowser (userAgent) {
  const browserPatterns = {
    Chrome: /Chrome\/([0-9.]+)/,
    Firefox: /Firefox\/([0-9.]+)/,
    Safari: /Version\/([0-9.]+).*Safari/,
    Edge: /Edg\/([0-9.]+)/,
    IE: /MSIE ([0-9.]+)/
  }

  for (const [name, pattern] of Object.entries(browserPatterns)) {
    const match = userAgent.match(pattern)
    if (match) return { name, version: match[1], family: name }
  }

  return { name: 'Unknown', version: 'Unknown', family: 'Unknown' }
}

function detectOperatingSystem (userAgent) {
  const osPatterns = {
    Windows: /Windows/i,
    MacOS: /Macintosh|Mac OS X/i,
    Linux: /Linux/i,
    Android: /Android/i,
    iOS: /iPhone|iPad|iPod/i
  }

  for (const [os, pattern] of Object.entries(osPatterns)) {
    if (pattern.test(userAgent)) return os
  }

  return 'Unknown'
}

const handleHourPmAM = (hour) => {
  const hourPmAm = new Date(`1/1/1999 ${hour}`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  return hour ? hourPmAm : ''
}

function handleMessageHour (message, open) {
  return { message, open }
}

// Función para convertir el objeto de tiempo en una cadena de tiempo
function getTimeString (timeStr) {
  return timeStr || '00:00' // Return '00:00' for empty time strings
}

function getCurrentDayAndTime () {
  try {
    const date = new Date()
    const currentTime = date.getHours() * 60 + date.getMinutes()
    const currentDayOfWeek = date.getDay()
    return { currentTime, currentDayOfWeek }
  } catch (error) {
    return {

    }
  }
}

function sortOpeningsByDay (openings) {
  const days = [
    'openingSun',
    'openingMon',
    'openingTue',
    'openingWed',
    'openingThu',
    'openingFri',
    'openingSat'
  ]
  const sortedOpenings = {}

  days.forEach((day) => {
    sortedOpenings[day] = openings[day] || '00:00 - 00:00' // Agregar horario vacío para los días faltantes
  })

  return sortedOpenings
}

// Función para obtener la clave de openings a partir del día de la semana
function getOpeningKeyFromDay (day) {
  const days = {
    0: 'openingSun',
    1: 'openingMon',
    2: 'openingTue',
    3: 'openingWed',
    4: 'openingThu',
    5: 'openingFri',
    6: 'openingSat'
  }
  return days[day]
}

const weekDays = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
]

function timeToInt (text) {
  const hour = parseInt(text.substring(0, 2))
  const minute = parseInt(text.substring(3))
  return hour * 60 + minute
}

export const days = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
  Sunday: 'Domingo'
}

function getNextDaySchedule (dataSchedules) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const dayOfWeekTomorrow = tomorrow.getDay()

  const findNextDay = dataSchedules.length
    ? dataSchedules.some((schedule) => schedule.schDay === dayOfWeekTomorrow)
    : false

  const findDataNextDay = dataSchedules.length
    ? dataSchedules.find((schedule) => schedule.schDay === dayOfWeekTomorrow) || {}
    : {}

  return { findNextDay, findDataNextDay, dayOfWeekTomorrow }
}

function getOpeningStatus (openings, currentTime, currentDayOfWeek, dataSchedules) {
  const weekDayLookup = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  const ceroHours = '00:00 - 00:00'
  let dayOfWeek = currentDayOfWeek

  for (let i = 0; i < 7; i++) {
    const dayName = weekDayLookup[dayOfWeek % 7]
    const opening = openings['opening' + dayName.substring(0, 3)]
    const timeSpans = opening?.split(';').map((item) => item.trim())

    for (const span of timeSpans) {
      const hours = span.split('-').map((item) => item.trim())
      const openTime = timeToInt(hours[0])
      const closeTime = timeToInt(hours[1])

      if (currentTime >= openTime && currentTime <= closeTime) {
        return handleMessageHour(
          'Abierto Ahora - Cierra a las: ' + handleHourPmAM(hours[1]),
          true
        )
      }

      if (currentTime < openTime && dayOfWeek === currentDayOfWeek) {
        return handleMessageHour(
          'Aun temprano - Abre hoy a las: ' + handleHourPmAM(hours[0]),
          false
        )
      }

      if (
        currentTime >= closeTime - 30 * 60000 &&
                currentTime < closeTime &&
                dayOfWeek === currentDayOfWeek
      ) {
        return handleMessageHour(
          'Pronto por cerrar - Cierra hoy a las: ' + handleHourPmAM(hours[1]),
          true
        )
      }

      const { findNextDay, findDataNextDay, dayOfWeekTomorrow } = getNextDaySchedule(
        dataSchedules,
        currentDayOfWeek
      )

      if (findNextDay && findDataNextDay?.schHoSta) {
        const nameOfDayTomorrow = weekDays[dayOfWeekTomorrow]
        return handleMessageHour(
          `Cerrado - Mañana ${nameOfDayTomorrow} ${!!findDataNextDay?.schHoSta && 'a las'} ${findDataNextDay?.schHoSta ? findDataNextDay?.schHoSta : ''
          }`,
          false
        )
      }

      const nextDayName = weekDayLookup[(dayOfWeek + 1) % 7]
      const nextOpening = openings['opening' + nextDayName.substring(0, 3)]
      const nextHours = nextOpening?.split(';')?.map((item) => item?.trim())

      if (nextHours[0] !== ceroHours) {
        return handleMessageHour(
          'Cerrado - Abre el ' + days[nextDayName] + ' a las ' + nextHours[0],
          false
        )
      }
    }

    dayOfWeek++
  }

  return handleMessageHour('Cerrado', false)
}

export function getStatusOpenStore (dataSchedules) {
  // Crear el objeto openings a partir del dataSchedules
  const openings = {}
  dataSchedules.forEach((schedule) => {
    const day = schedule.schDay
    const openingKey = getOpeningKeyFromDay(day)
    const schHoSta = getTimeString(schedule.schHoSta)
    const schHoEnd = getTimeString(schedule.schHoEnd)
    openings[openingKey] = `${schHoSta} - ${schHoEnd}`
  })

  for (let i = 0; i < 7; i++) {
    const openingKey = getOpeningKeyFromDay(i)
    // eslint-disable-next-line no-prototype-builtins
    if (!openings.hasOwnProperty(openingKey)) {
      openings[openingKey] = '00:00 - 00:00' // Horario vacío para el día faltante
    }
  }

  // Ordenar los horarios y obtener la hora actual y día de la semana
  const sortedOpenings = sortOpeningsByDay(openings)
  const { currentTime, currentDayOfWeek } = getCurrentDayAndTime()

  // Obtener el estado de apertura actual
  const { message, open } = getOpeningStatus(sortedOpenings, currentTime, currentDayOfWeek, dataSchedules)

  return {
    open: open ? 1 : 0, // Convertir booleano a 1 o 0
    message // Mensaje de estado de apertura
  }
}

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URL = process.env.REDIRECT_URL
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const AuthClient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
AuthClient.setCredentials({ refresh_token: REFRESH_TOKEN })

export const sendEmail = async ({
  html = '<html></html>',
  from = process.env.EMAIL_TRANSPORT_ACCESS,
  to,
  subject = ''
}) => {
  try {
    if (!to) {
      throw new Error('Destinatario del correo no especificado.')
    }
    if (!html || typeof html !== 'string') {
      throw new Error('Contenido HTML inválido.')
    }

    if (!subject || typeof subject !== 'string') {
      throw new Error('Asunto del correo inválido.')
    }
    const htmlTemplates = await html
    const FromEmail = await from
    const toEmail = await to
    const subjectEmail = await subject
    const textEmail = await subject
    const ascessToken = await AuthClient.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_TRANSPORT_ACCESS,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ascessToken
      },
      tls: {
        rejectUnauthorized: false
      }

    })
    const MailOptions = {
      from: FromEmail,
      to: toEmail,
      text: textEmail,
      subject: subjectEmail,
      html: htmlTemplates
    }
    const result = await transport.sendMail(MailOptions)
    return result
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.error === 'invalid_grant') {
      // El refresh token ha expirado, toma acciones para manejarlo
      // handleExpiredRefreshToken()
    }
  }
}

export const generateCode = async (length = 6) => {
  if (length <= 0) {
    throw new Error('Length must be a positive integer')
  }

  const min = 10 ** (length - 1)
  const max = 10 ** length - 1
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min

  return randomNumber
}

export function addDaysToCurrentDate () {
  const trialDays = process.env.TRIAL_DAYS ? parseInt(process.env.TRIAL_DAYS) : 0
  const currentDate = new Date()
  const endDate = new Date(currentDate)
  endDate.setDate(currentDate.getDate() + trialDays)
  return endDate.toISOString()
}

/**
 * Generates custom Joi error messages for validation.
 *
 * @param {string} label - Field label for user-friendly messages
 * @param {number} [max] - Optional maximum length/number
 * @param {number} [min] - Optional minimum length/number
 * @returns {Object<string, string>} Joi error messages
 */
export const stringMessages = (label, max, min) => {
  const messages = {
    'string.base': `${label} debería ser un tipo de 'texto'`,
    'string.empty': `${label} no puede ser un campo vacío`,
    'string.unsafe': `${label} no puede contener caracteres especiales`,
    'string.email': `${label} debe ser un email válido`,
    'string.pattern.base': `${label} tiene un formato inválido`,
    'string.uri': `${label} debe ser una URL válida`,
    'string.uriCustom': `${label} debe ser una URL válida`,
    'number.base': `${label} debe ser un número válido`,
    'number.integer': `${label} debe ser un número entero`,
    'number.unsafe': `${label} es demasiado grande, por favor verifica el valor ingresado`,
    'boolean.base': `${label} debe ser un valor booleano (true o false)`,
    'array.base': `${label} debe ser una lista válida`,
    'date.base': `${label} debe ser una fecha válida`,
    'any.required': `${label} es un campo requerido`
  }

  if (max !== undefined) {
    messages['string.max'] = `${label} debe tener una longitud máxima de ${max}`
    messages['number.max'] = `${label} debe ser menor o igual a ${max}`
  }

  if (min !== undefined) {
    messages['string.min'] = `${label} debe tener una longitud mínima de ${min}`
    messages['number.min'] = `${label} debe ser mayor o igual a ${min}`
  }

  if (max !== undefined && min !== undefined) {
    messages['string.length'] = `${label} debe tener una longitud entre ${min} y ${max}`
  }

  return messages
}

export const MAX_INTEGER_MYSQL = 999999999999.99

export const PATH_EXTERNAL_OS = 'app_data'
