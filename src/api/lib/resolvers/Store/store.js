import CatStore from "../../models/information/CategorieStore"
import CitiesModel from "../../models/information/CitiesModel"
import CountriesModel from "../../models/information/CountriesModel"
import DepartmentsModel from "../../models/information/DepartmentsModel"
import productModelFood from "../../models/product/productFood"
import FavoritesModel from "../../models/Store/FavoritesModel"
import ShoppingCard from "../../models/Store/ShoppingCard"
import RatingStore from "../../models/Store/ratingStore"
import SubProducts from "../../models/Store/shoppingCardSubProduct"
import Store from "../../models/Store/Store"
import { deCode, getAttributes } from "../../utils/util"
import ratingStoreStart from "../../models/Store/ratingStoreStart"
import ScheduleStore from "../../models/Store/scheduleStore"
import { Op } from "sequelize"
import StatusOrderModel from "../../models/Store/statusPedidoFinal"
import { createOnePedidoStore } from "./pedidos"
import SaleDataExtra from "./../../models/Store/sales/saleExtraProduct"
import ExtProductFoodOptional from "../../models/Store/sales/saleExtProductFoodOptional"
import ExtProductFoodSubOptional from "../../models/Store/sales/saleExtProductFoodSubOptional"
import { GraphQLError } from "graphql"
import { getStoreSchedules } from "./Schedule"
import { getStatusOpenStore } from "../../utils"
import { ApolloError, ForbiddenError } from "apollo-server-express"
import { setFavorites } from "./setFavorites"
import StatusPedidosModel from "../../models/Store/statusPedidoFinal"

// eslint-disable-next-line
export const newRegisterStore = async (_, { input }, ctx, lol) => {
  const { cId, dId, ctId, id, catStore } = input
  try {
    let res = {}
    const data = await Store.findOne({
      attributes: ["id", "idStore"],
      where: {
        id: deCode(id),
      },
    })
    if (data)
      return {
        success: false,
        message: "Ya existe una tienda registrada",
        idStore: data.idStore,
      }
    res = await Store.create({
      ...input,
      uState: 2,
      cId: deCode(cId),
      id: deCode(id),
      dId: deCode(dId),
      ctId: deCode(ctId),
      catStore: deCode(catStore),
    })
    return {
      success: true,
      idStore: res.idStore,
      message: "Tienda creada",
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error?.message || "",
      idStore: null,
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
  // Hola mundo
  const attributes = getAttributes(Store, info)
  const data = await Store.findOne({
    attributes,
    where: {
      idStore: deCode(context.restaurant),
    },
  })
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateExtraProduct = async ({ input }) => {
  try {
    const { _id, id, pId } = input || {}
    await SubProducts.create({
      pId: deCode(pId),
      id: deCode(id),
      opExPid: deCode(_id),
    })
    return input
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
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
    await ShoppingCard.update(
      { cState: cState === 1 ? 0 : 1 },
      { where: { ShoppingCard: deCode(id) } }
    )
    return { success: true, message: "Eliminado del carrito" }
  } catch (error) {
    return { success: false, message: "No pudo ser eliminado" }
  }
}
// eslint-disable-next-line
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
    valueDelivery
  },
  context) => {
  try {
    if (!context.restaurant || !context?.User?.restaurant?.idStore) {
      throw new GraphQLError('Token expired', {
        extensions: { code: 'FORBIDDEN', message:  { message: 'Token expired' } }
      })
    }
    const statusPedido = await StatusPedidosModel.findOne({
      where: { pCodeRef }
    })
    if (statusPedido) {
      return {
        Response: {
          success: false,
          message: 'Error, esto es raro pero... La orden ya existe'
        }
      }
    }
    if (!id) {
      throw new Error('Elija un cliente, no se pudo realizar la venta')
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
      const productoOriginal = await productModelFood.findByPk(decodePid)
      if (!productoOriginal) {
        throw new Error('No se encontró ningún producto proporcionado, parece que fue eliminado')
      }
      const resShoppingCard = await ShoppingCard.create({
        pId: deCode(pId),
        id: deCode(id),
        comments: comments ?? '',
        cState: 0,
        refCodePid: refCodePid || '',
        cantProducts,
        idStore: deCode(context.restaurant)
      })
      if (dataExtra?.length > 0) {
        await SaleDataExtra.bulkCreate(dataExtra.map(extra => {return {
          exPid: extra.exPid,
          exState: extra.exState,
          extraName: extra.extraName,
          extraPrice: extra.extraPrice,
          newExtraPrice: extra.newExtraPrice,
          pCodeRef: pCodeRef,
          pDatCre: new Date(Date.now()),
          pDatMod: new Date(Date.now()),
          pId: extra.pId,
          quantity: extra.quantity,
          refCodePid,
          shoppingCardId: deCode(resShoppingCard.ShoppingCard),
          state: extra.state
        }}))
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
          await ExtProductFoodOptional.create({
            pId: deCode(pId),
            opExPid: deCode(opExPid),
            OptionalProName,
            state,
            refCodePid,
            code,
            pCodeRef: pCodeRef,
            numbersOptionalOnly,
            pDatCre,
            required,
            pDatMod
          })
          if ((Array.isArray(ExtProductFoodsSubOptionalAll)) && ExtProductFoodsSubOptionalAll?.length > 0) {
            await ExtProductFoodSubOptional.bulkCreate(ExtProductFoodsSubOptionalAll.map(subOptional => {
              return {
              pId: deCode(pId),
              opExPid: deCode(opExPid),
              idStore: deCode(context.restaurant),
              opSubExPid: deCode(subOptional.opSubExPid),
              OptionalSubProName: subOptional.OptionalSubProName,
              exCodeOptionExtra: subOptional.exCodeOptionExtra,
              exCode: subOptional.exCode,
              pCodeRef: pCodeRef,
              state: subOptional.state,
              pDatCre: new Date(Date.now()),
              pDatMod: new Date(Date.now()),
              check: subOptional.check
            }}))

          }
        }))
      }
    const storeOrder = await createOnePedidoStore(null, {
        input: {
          change,
          generateSales: true,
          id: id,
          idStore: context?.restaurant?.replace(/["']/g, ''),
          payMethodPState,
          pCodeRef,
          pickUp,
          pPRecoger: null,
          ShoppingCard: resShoppingCard.ShoppingCard
        }
      })
    const { success, message } = storeOrder || {}
    if (!success) {
        throw new Error(message || 'Ocurrió un error al crear el pedido')
    }
    }))
    await StatusPedidosModel.create({
      change: change,
      channel: 1,
      discount,
      id: deCode(id),
      idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
      locationUser: null,
      payMethodPState: payMethodPState,
      pCodeRef: pCodeRef,
      pickUp,
      pSState: 4,
      totalProductsPrice,
      valueDelivery: valueDelivery
    })
    return {
      ShoppingCard: null,
      Response: {
        success: true,
        message: 'Venta exitosa'
      }
    }
  } catch (e) {
    console.log("🚀 ~ file: store.js:302 ~ e:", e)
    return {
      Response: {
        success: false,
        message: 'Lo sentimos, ha ocurrido un error inesperado'
      }
    }
  }
}
export const getTodaySales = async (_, args, ctx) => {
  try {
    // Validar que el contexto contenga un restaurante válido
    if (!ctx.restaurant) {
      return { success: false, message: "El contexto no contiene un restaurante válido" }
    }
    const START = new Date()
    START.setHours(0, 0, 0, 0)
    const NOW = new Date()

    // Crear fechas START y NOW dentro de la consulta para asegurarse de que reflejen el mismo día
    const data = await StatusOrderModel.findAll({
      attributes: ["pSState", "idStore", "pDatCre"],
      where: {
        [Op.or]: [
          {
            // ID STORE
            pSState: 4,
            idStore: deCode(ctx.restaurant),
            pDatCre: {
              [Op.between]: [START.toISOString(), NOW.toISOString()]
            }
          },
        ],
      },
      order: [["pDatCre", "DESC"]],
    })
    if (data?.length) {
      return data?.length || 0
    } else {
      return 0
    }
  } catch (error) {
    return 0
  }
}

const updateDataOptional = async ({ refCodePid, dataOptional }) => {
  try {
    // 1. Obtener los registros actuales
    const currentDataOptional = await ExtProductFoodOptional.findAll({
      where: { refCodePid },
    })

    // 2. Encontrar nuevos elementos en dataOptional
    const newDataOptional = dataOptional?.filter((item) => {
      const exists = currentDataOptional?.some((currentItem) => {
        return currentItem?.opExPid === item?.opExPid
      })
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
            pDatMod: new Date(Date.now()),
          })

          if (
            Array.isArray(item.ExtProductFoodsSubOptionalAll) &&
            item?.ExtProductFoodsSubOptionalAll?.length > 0
          ) {
            await ExtProductFoodSubOptional.bulkCreate(
              item?.ExtProductFoodsSubOptionalAll?.map((subOptional) => {
                return {
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
                  check: 1,
                }
              })
            )
          }
        })
      )
    }
  // 4. Eliminar registros que no existen en dataOptional
  const itemsToRemove = currentDataOptional.filter((currentItem) => {
    const exists = dataOptional.some((item) => {
      return currentItem.opExPid === item.opExPid
    })
    return !exists
  })
  if (itemsToRemove.length > 0) {
    await Promise.all(
      itemsToRemove.map(async (item) => {
        await ExtProductFoodOptional.destroy({
          where: { opExPid: deCode(item.opExPid) },
        })
        // 4.1 Eliminar los sub-items asociados
        await ExtProductFoodSubOptional.destroy({
          where: { exCodeOptionExtra: item.code },
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
  ShoppingCardId,
}) => {
  try {
    // Obtener los registros actuales
    const currentDataExtra = await SaleDataExtra.findAll({
      where: { refCodePid },
    })

    // Mapear los registros actuales a un nuevo formato
    const dataExtra = currentDataExtra.map((item) => ({
      exPid: item.exPid,
      exState: item.exState,
      extraName: item.extraName,
      quantity: item.quantity,
      extraPrice: item.extraPrice,
      newExtraPrice: item.newExtraPrice,
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
                refCodePid,
              },
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
          state: extra.state,
        }))
      )

      // Esperar a que todas las actualizaciones, eliminaciones e inserciones se completen
      await Promise.all([
        ...updatePromises,
        ...removePromises,
        ...insertPromises,
      ])
    } else {
      await Promise.all([...updatePromises, ...removePromises])
    }

    return {
      success: true,
      message: "Items actualizados y eliminados con éxito",
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
    dataOptional,
  } = input.input || {}
  try {
    await ShoppingCard.update(
      {
        cantProducts,
        comments,
      },
      {
        where: {
          ShoppingCard: deCode(ShoppingCardId),
        },
      }
    )
    const refCodePid = currentShoppingCard?.refCodePid || null
    if (refCodePid) {
      await updateDataExtra({ refCodePid, dataExtra, ShoppingCardId })
      await updateDataOptional({ refCodePid, dataOptional, ShoppingCardId })
    }
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
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
    dataOptional,
  } = input.input || {}
  try {
    if (!id) return new ForbiddenError("no session")
    // Verificar si ya existe una ShoppingCard con el mismo ShoppingCardId
    let existingShoppingCard = null

    if (ShoppingCardId) {
      existingShoppingCard = await ShoppingCard.findOne({
        where: {
          cState: { [Op.gt]: 0 },
          ShoppingCard: deCode(ShoppingCardId),
        },
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
        pId: deCode(pId),
      })
      if (dataExtra?.length > 0) {
        const res = await SaleDataExtra.bulkCreate(
          dataExtra.map((extra) => {
            return {
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
              state: extra.state,
            }
          })
        )
        console.log(res)
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
              ExtProductFoodsSubOptionalAll,
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
              pDatMod,
            })
            if (
              Array.isArray(ExtProductFoodsSubOptionalAll) &&
              ExtProductFoodsSubOptionalAll?.length > 0
            ) {
              await ExtProductFoodSubOptional.bulkCreate(
                ExtProductFoodsSubOptionalAll.map((subOptional) => {
                  return {
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
                    check: subOptional.check,
                  }
                })
              )
            }
          })
        )
      }

      return data
    }
  } catch (e) {
    console.log(e)
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
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
            cState: { [Op.gt]: 0 },
          },
        ],
      },
    })
    return context.User ? data : []
  } catch (e) {
    throw new ApolloError(
      `Lo sentimos, ha ocurrido un error interno en el carrito, ${e}`
    )
  }
}
// eslint-disable-next-line

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllStoreInStore = async (root, args, _, _info) => {
  try {
    const { search, min, max } = args
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [{ cpName: { [Op.substring]: search.replace(/\s+/g, " ") } }],
      }
    }
    const data = await Store.findAll({
      attributes: [
        "idStore",
        "cId",
        "id",
        "dId",
        "scheduleOpenAll",
        "ctId",
        "catStore",
        "neighborhoodStore",
        "Viaprincipal",
        "storeOwner",
        "storeName",
        "emailStore",
        "storePhone",
        "socialRaz",
        "Image",
        "banner",
        "documentIdentifier",
        "uPhoNum",
        "ULocation",
        "upLat",
        "upLon",
        "uState",
        "siteWeb",
        "description",
        "NitStore",
        "typeRegiments",
        "typeContribute",
        "secVia",
        "addressStore",
        "createAt",
      ],
      where: {
        [Op.or]: [
          {
            ...whereSearch,
            uState: 2,
          },
        ],
      },
      limit: max || 100, // Usar solo max como límite
      offset: min || 0, // Usar min como offset si es necesario
      order: [
      ["createdAt", "DESC"],
      ["storeName", "DESC"],
      ["id", "DESC"],
      ],
    })

    // Iterar por cada tienda y obtener los horarios usando getStoreSchedules
    const storesWithSchedules = await Promise.all(
      data.map(async (store) => {
        const schedules = await getStoreSchedules(
          null,
          { idStore: store?.idStore },
          null,
          null
        )
        const { open } = getStatusOpenStore(schedules)
        if (store?.scheduleOpenAll) {
          return {
            ...store?.toJSON(),
            open: true,
          }
        }
        return {
          ...store?.toJSON(),
          open: open,
        }
      })
    )

    return storesWithSchedules
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
    return error
  }
}

export const getOneStore = async (parent, args, context, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(Store, info)
    const data = await Store.findOne({
      attributes,
      where: { idStore: idStore ? deCode(idStore) : deCode(parent.idStore) },
    })
    const schedules = await getStoreSchedules(
      null,
      { idStore: idStore || parent.idStore },
      null,
      null
    )
    console.log(data.scheduleOpenAll)
    if (schedules && data.scheduleOpenAll) {
      const { open } = getStatusOpenStore(schedules)
      return {
        ...data?.toJSON(),
        open: open,
      }
    }
    return data
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
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
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
    return error
  }
}
export const getFavorite = async (_root, args, context) => {
  try {
    const data = await FavoritesModel.findAll({
      attributes: [
        "id",
        "fState",
        "fIStoreId",
        "idStore",
        "updateAt",
        "createAt",
      ],
      where: { id: deCode(context.User.id), fState: 1 },
    })
    return data
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
    return error
  }
}
export const getOneFavorite = async (_root, { idStore }, context) => {
  try {
    const data = await FavoritesModel.findOne({
      attributes: ["id", "fState", "fIStoreId", "idStore"],
      where: { idStore: deCode(idStore), id: deCode(context.User.id) },
    })
    return data
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
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
        id: /* deCode(context.User.id) */ deCode(context.User.id),
      },
    })
    return data
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
    return error
  }
}
export const getAllRating = async (_root, args, ctx, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(RatingStore, info)
    const data = await RatingStore.findAll({
      attributes,
      where: { idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant) },
    })
    return data
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
    return error
  }
}
// eslint-disable-next-line
export const getAllRatingStar = async (_root, { idStore }, ctx, info) => {
  const data = await ratingStoreStart.findAll({
    attributes: ["rScore", "idStore", "rSId", "createAt"],
    where: { idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant) },
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
        rScore,
      },
    })
    if (rating) {
      await ratingStoreStart.update(
        {
          rScore,
        },
        { where: { id: deCode(context.User.id) } }
      )
      return { success: true, message: "" }
    }
    return { success: true, message: "Subido con éxito" }
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
        rState: 1,
      },
    })
    if (rating) {
      await RatingStore.update(
        {
          rState: 1,
          rAppearance,
          rGoodTemperature,
          rTasty,
          rGoodCondition,
        },
        { where: { idStore: deCode(idStore) } }
      )
      return { success: true, message: "Campos subidos" }
    }
    return { success: true, message: "Subido con éxito" }
  } catch (error) {
    return { success: false, message: error }
  }
}
export const setEditNameStore = async (_root, { StoreName }, context) => {
  try {
    await Store.update(
      {
        storeName: StoreName,
      },
      {
        where: {
          idStore: deCode(context.restaurant),
          id: deCode(context.User.id),
        },
      }
    )
    return { success: true, message: "El Restaurante ha cambiado de nombre" }
    // eslint-disable-next-line no-unreachable
  } catch (e) {
    return {
      success: true,
      message: "El Restaurante no pudo cambiar de nombre",
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
          { storeName: { [Op.substring]: search.replace(/\s+/g, " ") } },
          { emailStore: { [Op.substring]: search.replace(/\s+/g, " ") } },
          { Viaprincipal: { [Op.substring]: search.replace(/\s+/g, " ") } },
        ],
      }
    }
    const attributes = getAttributes(Store, info)
    const data = await Store.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...whereSearch,
          },
        ],
      },
             limit: max || 100,
        offset: min || 0,
      order: [["storeName", "ASC"]],
    })
    return data
  } catch (e) {
    const error = new Error("Lo sentimos, ha ocurrido un error interno")
    return error
  }
}

export default {
  TYPES: {
    FavoriteStore: {
      getOneStore: (parent, _args, _context, info) => {
        return getOneStore(parent, _args, _context, info)
      },
    },
    CatStore: {
      getAllStore: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(Store, info)
          const data = await Store.findAll({
            attributes,
            where: { catStore: deCode(parent.catStore), uState: 2 },
          })
          return data
        } catch {
          return null
        }
      },
    },
    ShoppingCard: {
      ExtProductFoodsAll: async (parent, _args, _context, info) => {
        let whereClause = {}
        if (info?.variableValues?.pCodeRef) {
          whereClause.pCodeRef = info.variableValues.pCodeRef
        }
        if (parent.refCodePid) {
          whereClause.refCodePid = parent.refCodePid
        }
        whereClause.quantity = {
          [Op.gt]: 0, // "gt" significa "greater than" (mayor que)
        }

        if (Object.keys(whereClause).length === 0) {
          return []
        }
        try {
          const attributes = getAttributes(SaleDataExtra, info)
          const data = await SaleDataExtra.findAll({
            attributes,
            where: {
              ...whereClause,
            },
          })
          return data
        } catch {
          return []
        }
      },
      salesExtProductFoodOptional: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(ExtProductFoodOptional, info)
          const whereClause = {}

          if (info?.variableValues?.pCodeRef) {
            whereClause.pCodeRef = info.variableValues.pCodeRef
          }

          if (parent?.refCodePid) {
            whereClause.refCodePid = parent.refCodePid
          }

          const data = await ExtProductFoodOptional.findAll({
            attributes,
            where: whereClause,
          })

          return data
        } catch {
          return []
        }
      },
      getStore: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(Store, info)
          const data = await Store.findOne({
            attributes,
            where: { idStore: deCode(parent.idStore) },
          })
          return data
        } catch {
          return null
        }
      },
      productFood: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(productModelFood, info)
          const data = await productModelFood.findOne({
            attributes,
            where: { pId: deCode(parent.pId) },
          })
          return data
        } catch {
          return null
        }
      },
    },

    Store: {
      // eslint-disable-next-line
      getAllRatingStar: async (parent, _args, _context, info) => {
        const data = await ratingStoreStart.findAll({
          attributes: ["rScore", "idStore", "rSId", "createAt"],
          where: { idStore: deCode(parent.idStore) },
        })
        return data
      },
      getStoreSchedules: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(ScheduleStore, info)
          const data = await ScheduleStore.findAll({
            attributes,
            where: { idStore: deCode(parent.idStore) },
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
            where: { cId: deCode(parent.cId) },
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
            where: { dId: deCode(parent.dId) },
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
            where: { ctId: deCode(parent.ctId) },
          })
          return data
        } catch {
          return null
        }
      },
    },
  },
  QUERIES: {
    getStore,
    getFavorite,
    getAllRatingStar,
    getOneRating,
    getAllMatchesStore,
    getTodaySales,
    getOneFavorite,
    getAllRating,
    // getAllStoreAdmin,
    getAllShoppingCard,
    getAllStoreInStore,
    getOneStore,
  },
  MUTATIONS: {
    newRegisterStore,
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
