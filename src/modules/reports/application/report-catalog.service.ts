import {
  getCatalogGroupedByCategory,
  REPORT_DEFINITIONS
} from '../domain/catalog/report-catalog'
import {
  ReportCatalogCategory,
  ReportDefinition
} from '../domain/types'

/**
 * Serves the backend-owned report catalog. The frontend builds its UI from this
 * data, so new reports can be added in the catalog without frontend changes.
 */
export class ReportCatalogService {
  /**
   * Returns the full flat catalog.
   *
   * @returns All report definitions.
   */
  getAll(): ReportDefinition[] {
    return REPORT_DEFINITIONS
  }

  /**
   * Returns the catalog grouped by category for grouped rendering.
   *
   * @returns Categories with their reports.
   */
  getGrouped(): ReportCatalogCategory[] {
    return getCatalogGroupedByCategory()
  }
}
