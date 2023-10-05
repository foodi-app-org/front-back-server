import FavoritesModel from '../../models/Store/FavoritesModel'
import { deCode } from '../../utils/util'

import { updateFavorites } from './store'

export const setFavorites = async (_root, { input }, context) => {
  try {
    const data = input
    const { idStore } = data || {}
    if (data.fState) {
      await updateFavorites(null, { input: data }, context)
      return { success: false, message: 'El Restaurante ha sido eliminado de tus favoritos' }
    }
    const isFavorites = await FavoritesModel.findOne({
      attributes: ['id', 'fState', 'fIStoreId', 'idStore'],
      where: { idStore: deCode(idStore) }
    })
    if (isFavorites) {
      await FavoritesModel.update({ fState: isFavorites.fState === 0 ? 1 : 0 }, { where: { idStore: deCode(idStore), id: deCode(context.User.id) } })

      if (isFavorites.fState === 0) {
        return { success: true, message: 'El Restaurante ha sido agregado nuevamente a tus favoritos' }
      }
      return { success: false, message: 'El Restaurante ha sido eliminado de tus favoritos' }
    }
    await FavoritesModel.create({ fState: 1, id: deCode(context.User.id), idStore: deCode(idStore) })
    return { success: true, message: 'El Restaurante ha sido agregado a tus favoritos' }
  } catch (e) {
    return e
  }
}
