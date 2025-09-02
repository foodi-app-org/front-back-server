import { Op, QueryInterface } from 'sequelize'
import { SCHEDULE_MODEL } from '../../models/sequelize-schedule-store.model'
import { v4 as uuidv4 } from 'uuid'
import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'


/**
 * Creates the `schedule_stores` table in the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be created.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string,
): Promise<void> => {
    const now = new Date()
    const schedules = Array.from({ length: 7 }).map((_, day) => ({
    schId: uuidv4(),
    id: null,
    idStore: removeTenantPrefix(schemaName),
    schDay: day, // 0 = Sunday, 6 = Saturday
    schHoSta: '00:00',
    schHoEnd: '23:59',
    schState: 1,
    createdAt: now,
    updatedAt: now,
  }))

  await queryInterface.bulkInsert(
    { tableName: SCHEDULE_MODEL, schema: schemaName },
    schedules
  )
}

/**
 * Drops the `schedule_stores` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    const array = [0, 1, 2, 3, 4, 5, 6]
    await queryInterface.bulkDelete(
        { tableName: SCHEDULE_MODEL, schema: schemaName },
        {
            where: {
                idStore: removeTenantPrefix(schemaName),
                schDay: {
                    [Op.in]: array
                }
            }
        }
    )
}


