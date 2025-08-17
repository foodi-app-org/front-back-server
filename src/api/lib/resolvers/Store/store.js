import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { Op } from 'sequelize'

import connect from '../../db'
import CatStore from '../../models/information/CategorieStore'
import CitiesModel from '../../models/information/CitiesModel'
import CountriesModel from '../../models/information/CountriesModel'
import DepartmentsModel from '../../models/information/DepartmentsModel'
import productModelFood from '../../models/product/productFood'
import clients from '../../models/Store/clients'
import FavoritesModel from '../../models/Store/FavoritesModel'
import { ORDER_STATUS_TYPE_MODEL, OrderStatusTypeModel } from '../../models/Store/OrderStatusTypes'
import RatingStore from '../../models/Store/ratingStore'
import ratingStoreStart from '../../models/Store/ratingStoreStart'
import ExtProductFoodOptional from '../../models/Store/sales/saleExtProductFoodOptional'
import ExtProductFoodSubOptional from '../../models/Store/sales/saleExtProductFoodSubOptional'
import ScheduleStore from '../../models/Store/scheduleStore'
import ShoppingCard from '../../models/Store/ShoppingCard'
import StatusOrderModel, { STATUS_ORDER_MODEL } from '../../models/Store/statusPedidoFinal'
import Store from '../../models/Store/Store'
import Users from '../../models/Users'
import { getStatusOpenStore } from '../../utils'
import DateRange from '../../utils/DateRange'
import { NotFountError } from '../../utils/handleError'
import {
  LogDanger,
  LogInfo,
  LogSuccess,
  LogWarning
} from '../../utils/logs'
import { MigrationFolder } from '../../utils/migrate-models'
import {
  deCode,
  getAttributes,
  getTenantName
} from '../../utils/util'
import { createClients } from '../clients/clients'
import { updateStock } from '../inventory/inventory'
import { createStockMovement } from '../inventory/inventory.stockmoments'
import { createTenant } from '../tenant/tenant.resolver'
import SaleDataExtra from './../../models/Store/sales/saleExtraProduct'
import { createOnePedidoStore } from './orders'
import { getStoreSchedules } from './Schedule'
import { setFavorites } from './setFavorites'

require('dotenv').config()

// eslint-disable-next-line
const createDeliveryTime = async (_, { minutes }, ctx, __) => {
  if (!ctx.restaurant) {
    LogDanger('No se pudo crear el tiempo de entrega')
    return {
      success: false,
      message: 'No se pudo crear el tiempo de entrega'
    }
  }
  try {
    if (minutes < 1 || minutes > 60) {
      LogWarning('El tiempo de entrega debe estar entre 1 y 60 minutos')
      throw new Error('El tiempo de entrega debe estar entre 1 y 60 minutos')
    }
    await Store.schema(getTenantName(ctx?.restaurant)).update(
      { deliveryTimeMinutes: minutes },
      { where: { idStore: deCode(ctx.restaurant) } }
    )
    LogSuccess('Tiempo de entrega creado')
    return {
      success: true,
      message: 'Tiempo de entrega creado'
    }
  } catch (error) {
    LogDanger('No se pudo crear el tiempo de entrega')
    return {
      success: false,
      message: 'No se pudo crear el tiempo de entrega'
    }
  }
}
export const newRegisterStore = async (_, { input }, ctx) => {
  const {
    id = null,
    catStore = null,
    emailStore
  } = input || {}

  try {
    // Verificar si el usuario existe
    const findUser = await Users.findOne({
      where: { id: deCode(id) }
    })
    if (!findUser) {
      LogDanger('No se encontró el usuario')
      return {
        success: false,
        message: 'No se encontró el usuario'
      }
    }

    // Verificar si ya existe una tienda registrada para este usuario
    const existingStore = await Store.findOne({
      attributes: ['id', 'idStore', 'emailStore'],
      where: { id: deCode(id) }
    })
    if (existingStore) {
      LogWarning('Ya existe una tienda registrada')
      return {
        success: false,
        message: 'Ya existe una tienda registrada',
        idStore: existingStore.idStore
      }
    }

    // Verificar si el emailStore ya está en uso
    const existingEmailStore = await Store.findOne({
      where: { emailStore }
    })
    if (existingEmailStore) {
      LogWarning('Ya existe una cuenta con el mismo correo')
      return {
        success: false,
        message: 'Ya existe una cuenta con el mismo correo',
        idStore: null
      }
    }
    // Crear la tienda
    const newStore = await Store.schema(MigrationFolder.public).create({
      ...input,
      uState: 2,
      cId: 'f0a59395-9ad2-426f-817c-eb034578fa80',
      id: deCode(id),
      dId: '622b4edc-62f8-418e-9222-42861deec133',
      ctId: '0855c115-c6ea-46a7-b58b-d2398e16867a',
      catStore: deCode(catStore)
    })
    const idStore = newStore.idStore

    // Crear el tenant
    const inputTenant = {
      subdomain: idStore,
      subscriberId: idStore,
      schemaName: idStore,
      subscriptionId: idStore,
      storageId: newStore.storeName ?? '',
      masterPassword: idStore,
      deleted: false,
      mailBody: emailStore ?? findUser.email
    }
    const context = {
      ...ctx,
      User: {
        ...ctx.User,
        restaurant: {
          idStore
        }
      },
      restaurant: {
        idStore
      }
    }
    await createTenant(null, { input: inputTenant }, context)
    const newUserContext = {
      ...context,
      restaurant: idStore
    }
    // Crear el cliente por defecto
    const inputClient = {
      clientName: 'CLIENTES VARIOS',
      clientLastName: '',
      ClientAddress: '',
      ccClient: idStore,
      clientNumber: '',
      gender: 1,
      idStore
    }
    const { success, message } = await createClients(null, { input: inputClient }, newUserContext)
    LogInfo(message)
    return {
      success: true,
      idStore,
      message: `${success ? 'Tienda creada Correctamente' : message || 'Tienda creada pero falto el usuario'}`
    }
  } catch (error) {
    return {
      success: false,
      message: error?.message || 'Ocurrió un error inesperado',
      idStore: null
    }
  }
}

// eslint-disable-next-line
export const getStore = async (
  _root,
  {
    id,
    StoreName,
    idStore
  },
  context,
  info
) => {
  const attributes = getAttributes(Store, info)
  const data = await Store.findOne({
    attributes,
    where: {
      idStore: deCode(context.restaurant)
    }
  })
  LogSuccess('Datos de la tienda obtenidos correctamente')
  return data
}
// eslint-disable-next-line
export const oneCategoriesStore = async (parent, _args, _context, info) => {
  try {
    const data = CatStore.findOne({ attributes: ['catStore', 'cName'], where: { catStore: deCode(parent.catStore) } })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

/**
 *
 * @param {*} root
 * @param {*} args
 * @param {*} context contexto de la app
 * @param {*} _info ADMINISTRA SHOPPING_CART
 */
// eslint-disable-next-line
export const deleteOneItem = async (root, args, context, _info) => {
  try {
    const { ShoppingCard: id, cState } = args || {}
    await ShoppingCard.schema(getTenantName(context.restaurant)).update(
      { cState: cState === 1 ? 0 : 1 },
      { where: { ShoppingCard: deCode(id) } }
    )
    return { success: true, message: 'Eliminado del carrito' }
  } catch (error) {
    return { success: false, message: 'No pudo ser eliminado' }
  }
}
/**
 * Registers a new sales store.
 *
 * @async
 * @param {Object} root - The root object.
 * @param {Object} args - The arguments object.
 * @param {Array} args.input - Input data for the sales.
 * @param {Number} args.totalProductsPrice - The total price of the products.
 * @param {boolean} args.pickUp - Whether or not the order is for pick-up.
 * @param {Number} args.discount - Discount amount, if applicable.
 * @param {string} args.id - ID of the client.
 * @param {string} args.idStore - ID of the store.
 * @param {Number} args.change - Change amount.
 * @param {string} args.pCodeRef - Reference code for the order.
 * @param {string} args.payMethodPState - Payment method.
 * @param {Number} args.valueDelivery - Delivery value.
 * @param {Object} context - The context object.
 * @returns {Promise<Object>} The result object containing success status and message.
 * @throws {GraphQLError} Throws an error if the token has expired.
 */
export const registerSalesStore = async (
  root,
  {
    input,
    totalProductsPrice,
    pickUp,
    discount,
    id,
    idStore,
    change,
    pCodeRef,
    payMethodPState,
    tableId,
    valueDelivery
  },
  context) => {
  try {
    LogInfo(`registerSalesStore: pCodeRef: ${pCodeRef} Iniciando venta`)
    if (!context.restaurant || !context?.User?.restaurant?.idStore) {
      LogDanger('registerSalesStore: Expired token')
      throw new GraphQLError('Token expired', {
        extensions: { code: 'FORBIDDEN', message: { message: 'Token expired' } }
      })
    }
    const statusOrder = await StatusOrderModel.schema(getTenantName(context?.restaurant)).findOne({
      where: { pCodeRef }
    })
    if (statusOrder) {
      LogDanger(`registerSalesStore: pCodeRef ${pCodeRef} already exists`)
      return {
        Response: {
          success: false,
          message: 'Error, esto es raro pero... La orden ya existe'
        }
      }
    }
    let clientId = id || null
    if (!id) {
      if (!context?.restaurant) throw new Error('No se pudo realizar la venta')
      const data = await clients.schema(getTenantName(context?.restaurant)).findOne({
        attributes: ['cliId', 'ccClient'],
        where: { ccClient: context?.restaurant || idStore }
      })
      clientId = data?.cliId
      if (!data) {
        LogDanger(`registerSalesStore: pCodeRef: ${pCodeRef} No client found`)
        throw new Error('Elija un cliente, no se pudo realizar la venta')
      }
    }
    if (!input.length) {
      return {
        ShoppingCard: null,
        Response: {
          success: false,
          message: 'No se ha podido realizar la venta, no hay productos en el carrito'
        }
      }
    }
    for (const element of input) {
      const { pId, cantProducts, refCodePid } = element
      if (!refCodePid) throw new Error('No pudimos guardar tu venta, intenta de nuevo')

      const decodePid = deCode(pId)
      const originalProduct = await productModelFood.schema(getTenantName(context?.restaurant)).findByPk(decodePid)

      if (!originalProduct) {
        LogDanger(`registerSalesStore: pCodeRef: ${pCodeRef} Product not found`)
        throw new NotFountError('No se encontró el producto, puede haber sido eliminado')
      }

      if (originalProduct.manageStock && originalProduct.stock < cantProducts) {
        LogDanger(`registerSalesStore: Stock insuficiente para ${originalProduct.dataValues.pName}`)
        return { Response: { success: false, message: `No hay suficiente stock para el producto ${originalProduct.dataValues.pName}` } }
      }
    }
    await Promise.all(input.map(async (element) => {
      const {
        pId,
        cantProducts,
        comments,
        dataExtra,
        dataOptional,
        refCodePid
      } = element
      const decodePid = deCode(pId)
      if (!refCodePid) throw new Error('No pudimos guardar tu venta, intenta de nuevo')
      const originalProduct = await productModelFood.schema(getTenantName(context?.restaurant)).findByPk(decodePid)
      // Verificar stock disponible
      const resShoppingCard = await ShoppingCard.schema(getTenantName(context?.restaurant)).create({
        pId: deCode(pId),
        id: clientId ? deCode(clientId) : deCode(id),
        comments: comments ?? '',
        cState: 0,
        priceProduct: originalProduct?.ProPrice || 0,
        refCodePid: refCodePid || '',
        cantProducts,
        idStore: deCode(context.restaurant)
      })
      if (originalProduct.manageStock) {
        const movementType = 'OUT'
        // Actualizar el stock del producto si el producto maneja stock
        await updateStock(null, {
          productId: decodePid,
          quantity: cantProducts,
          type: movementType
        }, context)

        // Crear un movimiento de stock
        await createStockMovement(null, {
          input: {
            productId: decodePid,
            movementType,
            quantity: cantProducts,
            previousStock: originalProduct.stock,
            newStock: originalProduct.stock - cantProducts
          }
        }, context)
      }

      if (dataExtra?.length > 0) {
        SaleDataExtra.belongsTo(ShoppingCard, { foreignKey: 'shoppingCardId' })
        await SaleDataExtra.schema(getTenantName(context.restaurant)).bulkCreate(dataExtra.map(extra => ({
          exPid: extra.exPid,
          exState: extra.exState,
          extraName: extra.extraName,
          extraPrice: extra.extraPrice,
          newExtraPrice: extra.newExtraPrice,
          pCodeRef,
          pDatCre: new Date(Date.now()),
          pDatMod: new Date(Date.now()),
          pId: extra.pId,
          quantity: extra.quantity,
          refCodePid,
          shoppingCardId: deCode(resShoppingCard?.ShoppingCard),
          state: extra.state
        })))
      }

      if (Array.isArray(dataOptional) && dataOptional.length > 0) {
        await Promise.all(dataOptional.map(async (optional) => {
          const {
            opExPid,
            OptionalProName,
            state,
            code,
            numbersOptionalOnly,
            pDatCre,
            required,
            pDatMod,
            ExtProductFoodsSubOptionalAll
          } = optional
          await ExtProductFoodOptional.schema(getTenantName(context.restaurant)).create({
            pId: deCode(pId),
            opExPid: deCode(opExPid),
            OptionalProName,
            state,
            refCodePid,
            code,
            pCodeRef,
            numbersOptionalOnly,
            pDatCre,
            required,
            pDatMod
          })
          if ((Array.isArray(ExtProductFoodsSubOptionalAll)) && ExtProductFoodsSubOptionalAll?.length > 0) {
            await ExtProductFoodSubOptional.schema(getTenantName(context.restaurant)).bulkCreate(ExtProductFoodsSubOptionalAll.map(subOptional => ({
              pId: deCode(pId),
              opExPid: deCode(opExPid),
              idStore: deCode(context.restaurant),
              opSubExPid: deCode(subOptional.opSubExPid),
              OptionalSubProName: subOptional.OptionalSubProName,
              exCodeOptionExtra: subOptional.exCodeOptionExtra,
              exCode: subOptional.exCode,
              pCodeRef,
              state: subOptional.state,
              pDatCre: new Date(Date.now()),
              pDatMod: new Date(Date.now()),
              check: subOptional.check
            })))
          }
        }))
      }

      const storeOrder = await createOnePedidoStore(null, {
        input: {
          change: !isNaN(parseFloat(change)) && isFinite(change) ? parseFloat(change) : 0,
          generateSales: true,
          id: clientId || id,
          idStore: context?.restaurant?.replace(/["']/g, ''),
          payMethodPState,
          pCodeRef,
          pickUp,
          pPRecoger: null,
          ShoppingCard: resShoppingCard?.ShoppingCard
        }
      }, context)
      const { success, message } = storeOrder || {}
      if (!success) {
        throw new Error(message || 'Ocurrió un error al crear el pedido')
      }
    }))
    const OrderStatus = await OrderStatusTypeModel.schema(getTenantName(context?.restaurant)).findOne({
      where: {
        state: 4
      }
    })
    await StatusOrderModel.schema(getTenantName(context?.restaurant)).create({
      change: !isNaN(parseFloat(change)) && isFinite(change) ? parseFloat(change) : 0,
      channel: 1,
      discount,
      id: clientId ? deCode(clientId) : deCode(id),
      idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
      locationUser: null,
      payMethodPState,
      tableId,
      pCodeRef,
      pickUp,
      pSState: OrderStatus?.idStatus ?? null,
      totalProductsPrice,
      valueDelivery
    })
    LogSuccess(`registerSalesStore: pCodeRef: ${pCodeRef} Venta exitosa`)
    return {
      ShoppingCard: null,
      Response: {
        success: true,
        message: 'Venta exitosa'
      }
    }
  } catch (e) {
    // Manaje error stock
    if (e instanceof ApolloError && e.message.includes('No hay suficiente stock para el producto')) {
      LogDanger(`registerSalesStore: ${e.message}`)
      return {
        Response: {
          success: false,
          message: 'No hay suficiente stock para el producto seleccionado'
        }
      }
    }
    let message = 'Lo sentimos, ha ocurrido un error inesperado'
    if (e instanceof NotFountError) {
      message = e.message
    }

    if (e instanceof Error) {
      message = e.message
    }
    // console.log(e)
    if (e instanceof GraphQLError && e.extensions?.code === 'FORBIDDEN') {
      message = 'Token expired'
    }
    LogDanger(`registerSalesStore: ${message}, ${e}`)
    return {
      Response: {
        success: false,
        message
      }
    }
  }
}

export const getTodaySales = async (_, args, context) => {
  try {
    if (!context.restaurant) {
      return { success: false, message: 'El contexto no contiene un restaurante válido' }
    }

    const todayRange = new DateRange()
    const { start, end } = todayRange.getRange()
    const sequelize = connect()
    const tenant = getTenantName(context?.restaurant)

    const result = await sequelize.query(
      `
    SELECT COUNT(*) AS "total"
    FROM "${tenant}.${STATUS_ORDER_MODEL}" so
    INNER JOIN "${tenant}.${ORDER_STATUS_TYPE_MODEL}" ost
      ON so."pSState" = ost."idStatus"
    WHERE ost."priority" = 4
      AND so."idStore" = :idStore
      AND so."createdAt" BETWEEN :start AND :end
  `,
      {
        replacements: {
          idStore: deCode(context.restaurant),
          start,
          end
        },
        type: sequelize.QueryTypes.SELECT
      }
    )
    /** @type {number} */
    const total = result?.[0]?.total ? Number(result[0].total) : 0

    return total
  } catch (error) {
    return 0
  }
}

const getSalesAmountToday = async (_, args, ctx) => {
  try {
    if (!ctx.restaurant) {
      return {
        success: false,
        message: 'El contexto no contiene un restaurante válido',
        total: 0
      }
    }

    const { start, end } = new DateRange().getRange()
    const sequelize = connect()
    const tenant = getTenantName(ctx?.restaurant)
    const result = await sequelize.query(
      `
      SELECT ROUND(SUM("totalProductsPrice"), 2) AS "total"
      FROM "${tenant}.${STATUS_ORDER_MODEL}"
      WHERE "pSState" = 4 
        AND "idStore" = :idStore 
        AND "createdAt" BETWEEN :start AND :end;
      `,
      {
        replacements: {
          idStore: deCode(ctx.restaurant),
          start,
          end
        },
        type: sequelize.QueryTypes.SELECT
      }
    )
    return {
      success: true,
      message: 'Monto total de ventas del día obtenido',
      total: result[0]?.total ?? 0
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error interno al obtener las ventas de hoy',
      total: 0
    }
  }
}

const updateDataOptional = async ({ refCodePid, dataOptional }) => {
  try {
    // 1. Obtener los registros actuales
    const currentDataOptional = await ExtProductFoodOptional.findAll({
      where: { refCodePid }
    })

    // 2. Encontrar nuevos elementos en dataOptional
    const newDataOptional = dataOptional?.filter((item) => {
      const exists = currentDataOptional?.some((currentItem) => currentItem?.opExPid === item?.opExPid)
      return !exists
    })
    // 3. Crear nuevos registros en la base de datos
    if (newDataOptional?.length > 0) {
      await Promise?.all(
        newDataOptional?.map(async (item) => {
          await ExtProductFoodOptional?.create({
            pId: deCode(item?.pId),
            opExPid: deCode(item?.opExPid),
            OptionalProName: item?.OptionalProName,
            state: item?.state,
            refCodePid,
            code: item?.code,
            numbersOptionalOnly: item?.numbersOptionalOnly,
            pDatCre: new Date(Date.now()),
            required: item?.required,
            pDatMod: new Date(Date.now())
          })

          if (
            Array.isArray(item.ExtProductFoodsSubOptionalAll) &&
            item?.ExtProductFoodsSubOptionalAll?.length > 0
          ) {
            await ExtProductFoodSubOptional.bulkCreate(
              item?.ExtProductFoodsSubOptionalAll?.map((subOptional) => ({
                pId: deCode(subOptional.pId),
                opExPid: deCode(subOptional.opExPid),
                idStore: subOptional.idStore,
                opSubExPid: deCode(subOptional.opSubExPid),
                OptionalSubProName: subOptional.OptionalSubProName,
                exCodeOptionExtra: subOptional.exCodeOptionExtra,
                exCode: subOptional.exCode,
                state: subOptional.state,
                pDatCre: new Date(Date.now()),
                pDatMod: new Date(Date.now()),
                check: 1
              }))
            )
          }
        })
      )
    }
    // 4. Eliminar registros que no existen en dataOptional
    const itemsToRemove = currentDataOptional.filter((currentItem) => {
      const exists = dataOptional.some((item) => currentItem.opExPid === item.opExPid)
      return !exists
    })
    if (itemsToRemove.length > 0) {
      await Promise.all(
        itemsToRemove.map(async (item) => {
          await ExtProductFoodOptional.destroy({
            where: { opExPid: deCode(item.opExPid) }
          })
          // 4.1 Eliminar los sub-items asociados
          await ExtProductFoodSubOptional.destroy({
            where: { exCodeOptionExtra: item.code }
          })
        })
      )
    }
    return { success: true, message: 'DataOptional updated successfully' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const updateDataExtra = async ({
  refCodePid,
  dataExtra: incomeDataExtra,
  ShoppingCardId
}) => {
  try {
    // Obtener los registros actuales
    const currentDataExtra = await SaleDataExtra.findAll({
      where: { refCodePid }
    })

    // Mapear los registros actuales a un nuevo formato
    const dataExtra = currentDataExtra.map((item) => ({
      exPid: item.exPid,
      exState: item.exState,
      extraName: item.extraName,
      quantity: item.quantity,
      extraPrice: item.extraPrice,
      newExtraPrice: item.newExtraPrice
    }))

    // Crear una lista de promesas para actualizar los registros
    const updatePromises = []

    // Crear una lista de IDs de registros en incomeDataExtra
    const incomeDataExtraIds = incomeDataExtra.map((item) => item.exPid)

    for (const newRecord of incomeDataExtra) {
      const { quantity, exPid } = newRecord

      // Buscar el registro correspondiente en los datos actuales
      const currentRecord = dataExtra?.find((record) => record?.exPid === exPid)
      const newExtraPrice = quantity * currentRecord?.extraPrice
      // Verificar si los datos han cambiado antes de actualizar
      if (currentRecord && currentRecord.quantity !== parseInt(quantity)) {
        updatePromises.push(
          SaleDataExtra.update(
            {
              quantity: parseInt(quantity),
              newExtraPrice: parseInt(newExtraPrice)
            },
            {
              where: {
                exPid, // Actualizar el registro correspondiente
                refCodePid
              }
            }
          )
        )
      }
    }

    // Identificar IDs de registros en currentDataExtra que no están en incomeDataExtra
    const recordsToRemoveIds = dataExtra
      .filter((record) => !incomeDataExtraIds.includes(record.exPid))
      .map((record) => record.exPid)

    // Crear una lista de promesas para eliminar los registros que no existen en incomeDataExtra
    const removePromises = recordsToRemoveIds.map((exPid) =>
      SaleDataExtra.destroy({ where: { exPid } })
    )

    // Crear una lista de nuevos registros para insertar en SaleDataExtra
    const newRecordsToInsert = incomeDataExtra.filter(
      (newRecord) =>
        !dataExtra.some(
          (currentRecord) => currentRecord.exPid === newRecord.exPid
        )
    )
    if (incomeDataExtra.length) {
      // Insertar nuevos registros en SaleDataExtra
      const insertPromises = SaleDataExtra.bulkCreate(
        newRecordsToInsert.map((extra) => ({
          exPid: extra.exPid,
          exState: extra.exState,
          extraName: extra.extraName,
          extraPrice: extra.extraPrice,
          newExtraPrice: extra.newExtraPrice,
          pCodeRef: null,
          pDatCre: new Date(Date.now()),
          pDatMod: new Date(Date.now()),
          pId: extra.pId,
          quantity: extra.quantity,
          refCodePid,
          shoppingCardId: deCode(ShoppingCardId), // Usar el parámetro ShoppingCardId en lugar de decodificar
          state: extra.state
        }))
      )

      // Esperar a que todas las actualizaciones, eliminaciones e inserciones se completen
      await Promise.all([
        ...updatePromises,
        ...removePromises,
        ...insertPromises
      ])
    } else {
      await Promise.all([...updatePromises, ...removePromises])
    }

    return {
      success: true,
      message: 'Items actualizados y eliminados con éxito'
    }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export const updateShoppingCardItems = async (input, currentShoppingCard) => {
  const {
    cantProducts,
    comments,
    ShoppingCard: ShoppingCardId,
    dataExtra,
    dataOptional
  } = input.input || {}
  try {
    await ShoppingCard.update(
      {
        cantProducts,
        comments
      },
      {
        where: {
          ShoppingCard: deCode(ShoppingCardId)
        }
      }
    )
    const refCodePid = currentShoppingCard?.refCodePid || null
    if (refCodePid) {
      await updateDataExtra({ refCodePid, dataExtra, ShoppingCardId })
      await updateDataOptional({ refCodePid, dataOptional, ShoppingCardId })
    }
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

/**
 * The function `registerShoppingCard` is an asynchronous function that takes in input parameters and a
 * context object. It extracts specific properties from the input object and logs them to the console.
 * @param _root - The `_root` parameter is typically used in GraphQL resolvers and represents the root
 * value of the resolver chain. It is not used in this specific function.
 * @param input - The `input` parameter is an object that contains the following properties:
 * @param context - The `context` parameter is an object that contains information about the current
 * user. In this case, it includes the `User` object, which has an `id` property.
 */
export const registerShoppingCard = async (_root, input, context) => {
  const { id } = context.User
  const {
    cantProducts,
    pId,
    cState,
    refCodePid,
    comments,
    idStore,
    dataExtra,
    ShoppingCard: ShoppingCardId,
    dataOptional
  } = input.input || {}
  try {
    if (!id) return new ForbiddenError('no session')
    if (comments.length > 140) return new Error('El comentario es muy largo')
    // Verificar si ya existe una ShoppingCard con el mismo ShoppingCardId
    let existingShoppingCard = null

    if (ShoppingCardId) {
      existingShoppingCard = await ShoppingCard.findOne({
        where: {
          cState: { [Op.gt]: 0 },
          ShoppingCard: deCode(ShoppingCardId)
        }
      })
      if (existingShoppingCard) {
        const shoppingCard = existingShoppingCard
        return await updateShoppingCardItems(input, shoppingCard)
      }
    }
    if (pId && !ShoppingCardId) {
      const data = await ShoppingCard.create({
        cantProducts,
        cState,
        comments,
        refCodePid,
        id: deCode(id),
        idStore: deCode(idStore),
        idUser: deCode(id),
        pId: deCode(pId)
      })
      if (dataExtra?.length > 0) {
        await SaleDataExtra.bulkCreate(
          dataExtra.map((extra) => ({
            exPid: extra.exPid,
            exState: extra.exState,
            extraName: extra.extraName,
            extraPrice: extra.extraPrice,
            newExtraPrice: extra.newExtraPrice,
            pCodeRef: null,
            pDatCre: new Date(Date.now()),
            pDatMod: new Date(Date.now()),
            pId: extra.pId,
            quantity: extra.quantity,
            refCodePid,
            shoppingCardId: deCode(data.ShoppingCard),
            state: extra.state
          }))
        )
      }
      if (Array.isArray(dataOptional) && dataOptional.length > 0) {
        await Promise.all(
          dataOptional.map(async (optional) => {
            const {
              opExPid,
              OptionalProName,
              state,
              code,
              numbersOptionalOnly,
              pDatCre,
              required,
              pDatMod,
              ExtProductFoodsSubOptionalAll
            } = optional
            await ExtProductFoodOptional.create({
              pId: deCode(pId),
              opExPid: deCode(opExPid),
              OptionalProName,
              state,
              refCodePid,
              code,
              pCodeRef: null,
              numbersOptionalOnly,
              pDatCre,
              required,
              pDatMod
            })
            if (
              Array.isArray(ExtProductFoodsSubOptionalAll) &&
              ExtProductFoodsSubOptionalAll?.length > 0
            ) {
              await ExtProductFoodSubOptional.bulkCreate(
                ExtProductFoodsSubOptionalAll.map((subOptional) => ({
                  pId: deCode(pId),
                  opExPid: deCode(opExPid),
                  idStore: deCode(context.restaurant),
                  opSubExPid: deCode(subOptional.opSubExPid),
                  OptionalSubProName: subOptional.OptionalSubProName,
                  exCodeOptionExtra: subOptional.exCodeOptionExtra,
                  exCode: subOptional.exCode,
                  pCodeRef: null,
                  state: subOptional.state,
                  pDatCre: new Date(Date.now()),
                  pDatMod: new Date(Date.now()),
                  check: subOptional.check
                }))
              )
            }
          })
        )
      }

      return data
    }
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
// eslint-disable-next-line
export const getAllShoppingCard = async (_root, { input }, context, info) => {
  if (!context.User.id) return []
  try {
    const attributes = getAttributes(ShoppingCard, info)
    const data = await ShoppingCard.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...(context.User ? { idUser: deCode(context.User.id) } : {}),
            cState: { [Op.gt]: 0 }
          }
        ]
      }
    })
    return context.User ? data : []
  } catch (e) {
    throw new ApolloError(
      `Lo sentimos, ha ocurrido un error interno en el carrito, ${e}`
    )
  }
}

export const getAllStoreInStore = async (root, args, _, _info) => {
  try {
    const { search, min, max } = args
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [{ cpName: { [Op.substring]: search.replace(/\s+/g, ' ') } }]
      }
    }
    const data = await Store.findAll({
      attributes: [
        'idStore',
        'cId',
        'id',
        'dId',
        'scheduleOpenAll',
        'ctId',
        'createdAt',
        'catStore',
        'neighborhoodStore',
        'Viaprincipal',
        'storeOwner',
        'storeName',
        'emailStore',
        'storePhone',
        'socialRaz',
        'Image',
        'banner',
        'documentIdentifier',
        'deliveryTimeMinutes',
        'uPhoNum',
        'ULocation',
        'upLat',
        'upLon',
        'uState',
        'siteWeb',
        'description',
        'NitStore',
        'typeRegiments',
        'typeContribute',
        'secVia',
        'addressStore',
        'createAt'
      ],
      where: {
        [Op.or]: [
          {
            ...whereSearch,
            uState: 2
          }
        ]
      },
      limit: max || 100, // Usar solo max como límite
      offset: min || 0, // Usar min como offset si es necesario
      order: [
        ['createdAt', 'DESC'],
        ['storeName', 'DESC'],
        ['id', 'DESC']
      ]
    })

    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const getOneStore = async (parent, args, context, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(Store, info)
    const data = await Store.schema(getTenantName(idStore)).findOne({
      attributes,
      where: { idStore: idStore ? deCode(idStore) : deCode(parent.idStore) }
    })
    const schedules = await getStoreSchedules(
      null,
      { idStore: idStore ?? parent.idStore },
      null,
      null
    )
    if (schedules && data.scheduleOpenAll) {
      const { open } = getStatusOpenStore(schedules)
      return {
        ...data?.toJSON(),
        open
      }
    }
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const updateFavorites = async (_root, { input }, context) => {
  try {
    const { fState, idStore } = input || {}
    await FavoritesModel.update(
      { fState: fState === 0 ? 1 : 0 },
      { where: { idStore: deCode(idStore), id: deCode(context.User.id) } }
    )
    return { ...input, id: deCode(context.User.id) }
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const getFavorite = async (_root, args, context) => {
  try {
    const data = await FavoritesModel.findAll({
      attributes: [
        'id',
        'fState',
        'fIStoreId',
        'idStore',
        'updateAt',
        'createAt'
      ],
      where: { id: deCode(context.User.id), fState: 1 }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const getOneFavorite = async (_root, { idStore }, context) => {
  try {
    const data = await FavoritesModel.findOne({
      attributes: ['id', 'fState', 'fIStoreId', 'idStore'],
      where: { idStore: deCode(idStore), id: deCode(context.User.id) }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const getOneRating = async (_root, args, context, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(RatingStore, info)
    const data = await RatingStore.findOne({
      attributes,
      where: {
        idStore: deCode(idStore),
        id: /* deCode(context.User.id) */ deCode(context.User.id)
      }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const getAllRating = async (_root, args, ctx, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(RatingStore, info)
    const data = await RatingStore.findAll({
      attributes,
      where: { idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant) }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
// eslint-disable-next-line
export const getAllRatingStar = async (_root, { idStore }, ctx, info) => {
  const data = await ratingStoreStart.findAll({
    attributes: ['rScore', 'idStore', 'rSId', 'createAt'],
    where: { idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant) }
  })
  return data
}
export const setRatingStar = async (_root, { input }, context) => {
  const { idStore, rScore } = input || {}
  try {
    // eslint-disable-next-line
    const [rating, _created] = await ratingStoreStart.findOrCreate({
      where: { id: deCode(context.User.id) },
      defaults: {
        id: deCode(context.User.id),
        idStore: deCode(idStore),
        rScore
      }
    })
    if (rating) {
      await ratingStoreStart.update(
        {
          rScore
        },
        { where: { id: deCode(context.User.id) } }
      )
      return { success: true, message: '' }
    }
    return { success: true, message: 'Subido con éxito' }
  } catch (error) {
    return { success: false, message: error }
  }
}
export const setRating = async (_root, { input }, context) => {
  const { idStore, rAppearance, rTasty, rGoodTemperature, rGoodCondition } =
    input || {}
  try {
    // eslint-disable-next-line
    const [rating, _created] = await RatingStore.findOrCreate({
      where: { id: deCode(context.User.id) },
      defaults: {
        id: deCode(context.User.id),
        idStore: deCode(idStore),
        rAppearance,
        rGoodTemperature,
        rTasty,
        rGoodCondition,
        rState: 1
      }
    })
    if (rating) {
      await RatingStore.update(
        {
          rState: 1,
          rAppearance,
          rGoodTemperature,
          rTasty,
          rGoodCondition
        },
        { where: { idStore: deCode(idStore) } }
      )
      return { success: true, message: 'Campos subidos' }
    }
    return { success: true, message: 'Subido con éxito' }
  } catch (error) {
    return { success: false, message: error }
  }
}
export const setEditNameStore = async (_root, { StoreName }, context) => {
  try {
    await Store.update(
      {
        storeName: StoreName
      },
      {
        where: {
          idStore: deCode(context.restaurant),
          id: deCode(context.User.id)
        }
      }
    )
    return { success: true, message: 'El Restaurante ha cambiado de nombre' }
    // eslint-disable-next-line no-unreachable
  } catch (e) {
    return {
      success: true,
      message: 'El Restaurante no pudo cambiar de nombre'
    }
  }
}

export const getAllMatchesStore = async (root, args, context, info) => {
  try {
    const { search, min, max } = args
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { storeName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { emailStore: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { Viaprincipal: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }
    const attributes = getAttributes(Store, info)
    const data = await Store.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...whereSearch
          }
        ]
      },
      limit: max || 100,
      offset: min || 0,
      order: [['storeName', 'ASC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

const upsertGoal = async (_, { input }, context) => {
  const { User, restaurant: idStore } = context || {}
  if (!User) {
    throw new GraphQLError('Session expired', {
      extensions: { code: 'SESSION_EXPIRED', http: { status: 401 } }
    })
  }

  try {
    LogInfo(`upsertGoal: ${JSON.stringify(input)}`)

    const schema = Store.schema(getTenantName(idStore))
    const { dailyGoal } = input || {}
    if (!dailyGoal) {
      return {
        success: false,
        message: 'La meta diaria no puede ser nula o indefinida',
        data: null
      }
    }
    const store = await schema.findOne({
      attributes: ['dailyGoal', 'idStore'],
      where: { idStore }
    })

    if (store) {
      await schema.update({ dailyGoal }, { where: { idStore: deCode(idStore) } })

      return {
        success: true,
        message: 'Meta actualizada con éxito',
        data: store
      }
    }

    return {
      success: false,
      message: 'No se encontró la tienda',
      data: null
    }
  } catch (e) {
    return {
      success: false,
      message: 'Lo sentimos, ha ocurrido un error interno',
      errors: e,
      data: null
    }
  }
}

export default {
  TYPES: {
    FavoriteStore: {
      getOneStore: (parent, _args, _context, info) => getOneStore(parent, _args, _context, info)
    },
    CatStore: {
      getAllStore: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(Store, info)
          const data = await Store.findAll({
            attributes,
            where: { catStore: deCode(parent.catStore), uState: 2 }
          })
          return data
        } catch {
          return null
        }
      }
    },
    ShoppingCard: {
      ExtProductFoodsAll: async (parent, _args, context, info) => {
        const whereClause = {}
        if (info?.variableValues?.pCodeRef) {
          whereClause.pCodeRef = info.variableValues.pCodeRef
        }
        if (parent.refCodePid) {
          whereClause.refCodePid = parent.refCodePid
        }
        whereClause.quantity = {
          [Op.gt]: 0 // "gt" significa "greater than" (mayor que)
        }

        if (Object.keys(whereClause).length === 0) {
          return []
        }
        try {
          const attributes = getAttributes(SaleDataExtra, info)
          const data = await SaleDataExtra.schema(getTenantName(context.restaurant)).findAll({
            attributes,
            where: {
              ...whereClause
            }
          })
          return data
        } catch {
          return []
        }
      },
      salesExtProductFoodOptional: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(ExtProductFoodOptional, info)
          const whereClause = {}

          if (info?.variableValues?.pCodeRef) {
            whereClause.pCodeRef = info.variableValues.pCodeRef
          }

          if (parent?.refCodePid) {
            whereClause.refCodePid = parent.refCodePid
          }

          const data = await ExtProductFoodOptional.schema(getTenantName(context.restaurant)).findAll({
            attributes,
            where: whereClause
          })

          return data
        } catch {
          return []
        }
      },
      getStore: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(Store, info)
          const data = await Store.schema(getTenantName(context.restaurant)).findOne({
            attributes,
            where: { idStore: deCode(parent.idStore) }
          })
          return data
        } catch {
          return null
        }
      },
      productFood: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(productModelFood, info)
          const data = await productModelFood.schema(getTenantName(context.restaurant)).findOne({
            attributes,
            where: { pId: deCode(parent.pId) }
          })
          return data
        } catch {
          return null
        }
      }
    },

    Store: {
      // eslint-disable-next-line
      getAllRatingStar: async (parent, _args, _context, info) => {
        const data = await ratingStoreStart.findAll({
          attributes: ['rScore', 'idStore', 'rSId', 'createAt'],
          where: { idStore: deCode(parent.idStore) }
        })
        return data
      },
      getStoreSchedules: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(ScheduleStore, info)
          const data = await ScheduleStore.schema(getTenantName(context.restaurant)).findAll({
            attributes,
            where: { idStore: deCode(parent.idStore) }
          })
          return data
        } catch {
          return null
        }
      },
      cateStore: oneCategoriesStore,
      pais: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(CountriesModel, info)
          const data = await CountriesModel.findOne({
            attributes,
            where: { cId: deCode(parent.cId) }
          })
          return data
        } catch {
          return null
        }
      },
      department: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(DepartmentsModel, info)
          const data = await DepartmentsModel.findOne({
            attributes,
            where: { dId: deCode(parent.dId) }
          })
          return data
        } catch {
          return null
        }
      },
      city: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(CitiesModel, info)
          const data = await CitiesModel.findOne({
            attributes,
            where: { ctId: deCode(parent.ctId) }
          })
          return data
        } catch {
          return null
        }
      }
    }
  },
  QUERIES: {
    getSalesAmountToday,
    getFavorite,
    getAllRatingStar,
    getOneRating,
    getAllMatchesStore,
    getTodaySales,
    getOneFavorite,
    getAllRating,
    getAllShoppingCard,
    getAllStoreInStore,
    getOneStore
  },
  MUTATIONS: {
    newRegisterStore,
    upsertGoal,
    createDeliveryTime,
    setFavorites,
    setRatingStar,
    deleteOneItem,
    setEditNameStore,
    setRating,
    registerSalesStore,
    registerShoppingCard
  },
  SUBSCRIPTION: {
  }
}
