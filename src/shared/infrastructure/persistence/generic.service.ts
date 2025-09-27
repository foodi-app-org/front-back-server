import {
    FindOptions,
    Model,
    ModelStatic,
    Op,
    OrderItem,
    WhereOptions
} from 'sequelize'

import { getTenantName } from '../../utils/tenant.utils'

/**
 * Interface for pagination details
 */
interface Pagination {
    max?: number
    page?: number
}

/**
 * Interface for ordering fields
 */
interface OrderField {
    field: string
    direction: 'ASC' | 'DESC'
}

/**
 * Parameters for getAll method
 */
interface GetAllParams {
    searchFields: string[]
    attributes?: string[] | null
    idStore: string
    pagination?: Pagination
    where?: Record<string, unknown>
    orderFields?: OrderField[]
}

/**
 * Generic Service for Sequelize models
 * @template T Sequelize Model type
 */
export class GenericService<T extends Model> {
    private readonly model: ModelStatic<T>

    /**
     * @param model Sequelize model
     * @param tenantNameGetter Function to get tenant name (defaults to getTenantName)
     */
    constructor(model: ModelStatic<T>) {
        this.model = model
    }

    /**
     * Fetches all records based on provided filters, pagination, and ordering.
     * @param params Query parameters
     * @returns Object with success status, message, data, and pagination info
     */
    async getAll({
        searchFields,
        attributes,
        idStore,
        pagination,
        where = {},
        orderFields = [{ field: 'createdAt', direction: 'DESC' }]
    }: GetAllParams) {
        try {
            if (!Array.isArray(searchFields) || searchFields.length === 0) {
                throw new Error('searchFields must be a non-empty array')
            }

            // Build search conditions
            let whereSearch: WhereOptions = { ...where }

            if (where.search) {
                const searchValue = String(where.search).replace(/\s+/g, ' ')
                whereSearch = {
                    [Op.or]: searchFields.map(field => ({
                        [field]: { [Op.substring]: searchValue }
                    }))
                }
            }

            const tenantSchema = this.model.schema(getTenantName(idStore))
            const dateFilter: WhereOptions = where?.fromDate && where?.toDate
            ? { createdAt: { [Op.between]: [where.fromDate, where.toDate] } }
            : {}
            // Count total records
            const totalRecords = await tenantSchema.count({
                where: {
                    [Op.and]: [
                        whereSearch,
                        dateFilter
                    ]
                }
            })

            const pageSize = pagination?.max ?? 300
            const currentPage = pagination?.page ?? 1
            const offset = (currentPage - 1) * pageSize

            // Construct the order array for Sequelize
            const order: OrderItem[] = orderFields.map(({ field, direction }) => [field, direction])
            // Fetch data
            const data = await tenantSchema.findAll({
                ...(attributes && { attributes }),
                where: {
                    [Op.and]: [
                      whereSearch,
                      dateFilter
                    ]
                  },
                limit: pageSize,
                offset,
                order
            } as FindOptions)

            return {
                success: true,
                message: 'Data fetched successfully',
                data,
                pagination: {
                    totalRecords,
                    totalPages: Math.ceil(totalRecords / pageSize),
                    currentPage
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    message: error.message,
                    data: [],
                    pagination: {
                        totalRecords: 0,
                        totalPages: 0,
                        currentPage: pagination?.page ?? 1
                    }
                }
            }
            return {
                success: false,
                message: 'An unknown error occurred',
                data: [],
                pagination: {
                    totalRecords: 0,
                    totalPages: 0,
                    currentPage: pagination?.page ?? 1
                }
            }
        }
    }
}

export default GenericService
