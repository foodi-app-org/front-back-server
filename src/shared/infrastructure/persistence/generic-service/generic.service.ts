import {
  Model,
  ModelStatic,
  Op,
  WhereOptions
} from 'sequelize'
import {
  CursorResponse,
  GetAllParams,
  PaginationResponse
} from './pagination/types'
import { fetchOffsetPage } from './pagination/offsetPaginator'
import { fetchCursorPage } from './pagination/cursorPaginator'
import { getTenantName } from '@shared/utils/tenant.utils'

/**
 * GenericService uses dedicated paginators for clarity and testability.
 */
export class GenericService<T extends Model> {
  private readonly model: ModelStatic<T>

  constructor(model: ModelStatic<T>) {
    this.model = model
  }

  /**
   * Get all with stable pagination.
   * Delegates to OffsetPaginator or CursorPaginator depending on pagination.mode
   * @returns PaginationResponse<T> | CursorResponse<T>
   */
  async getAll(params: GetAllParams): Promise<PaginationResponse<T> | CursorResponse<T>> {
    const {
      searchFields,
      attributes,
      idStore,
      pagination,
      where = {},
      orderFields = [{ field: 'createdAt', direction: 'DESC' }]
    } = params

    if (!Array.isArray(searchFields) || searchFields.length === 0) {
      throw new Error('searchFields must be a non-empty array')
    }

    const tenantSchema = this.model.schema(getTenantName(idStore))

    // Build search where
    let searchWhere: WhereOptions = {}
    if ((where as any).search) {
      const searchValue = String((where as any).search).replace(/\s+/g, ' ')
      searchWhere = {
        [Op.or]: searchFields.map(field => ({
          [field]: { [Op.substring]: searchValue }
        }))
      }
    }

    const dateFilter: WhereOptions =
      (where as any).fromDate && (where as any).toDate
        ? { createdAt: { [Op.between]: [(where as any).fromDate, (where as any).toDate] } }
        : {}

    const extraWhere = { ...where }
    delete (extraWhere as any).search
    delete (extraWhere as any).fromDate
    delete (extraWhere as any).toDate

    const mode = pagination?.mode ?? 'offset'

    if (mode === 'cursor') {
      return fetchCursorPage<T>(tenantSchema, {
        searchWhere,
        dateFilter,
        extraWhere,
        attributes: Array.isArray(attributes) ? [...attributes] : undefined,
        orderFields,
        max: pagination?.max,
        cursor: pagination?.cursor
      })
    }

    // offset mode
    return fetchOffsetPage<T>(tenantSchema, {
      searchWhere,
      dateFilter,
      extraWhere,
      attributes: Array.isArray(attributes) ? [...attributes] : undefined,
      orderFields,
      page: pagination?.page,
      max: pagination?.max
    })
  }
}

export default GenericService
