import {
  ReportCatalogCategory,
  ReportCategory,
  ReportDefinition
} from '../types'

/**
 * Human readable labels for each report category.
 */
export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  SALES: 'Ventas',
  PRODUCTS: 'Productos',
  INVENTORY: 'Inventario y stock',
  PURCHASES: 'Compras y proveedores',
  EXPENSES: 'Salidas y gastos',
  CASH: 'Caja y métodos de pago',
  BILLING: 'Facturación',
  CLIENTS: 'Clientes',
  EMPLOYEES: 'Empleados y operación',
  FINANCIAL: 'Financieros y consolidados'
}

const BOTH_FORMATS: ('XLSX' | 'CSV')[] = ['XLSX', 'CSV']

/**
 * Reason used for reports whose underlying models do not yet exist in the POS.
 */
const PENDING_NO_MODEL =
  'Pendiente: el POS aún no cuenta con los modelos/entidades requeridos para este reporte.'

/**
 * The authoritative report catalog. The backend owns this definition so new
 * reports can be added here without touching the frontend. Reports flagged as
 * `enabled: false` are surfaced to the UI as unavailable (with a reason) rather
 * than hidden, matching the requirement to never present fictitious data.
 *
 * Implemented reports map to a data service in
 * {@link file://../../application/data/report-data.registry.ts}.
 */
export const REPORT_DEFINITIONS: ReportDefinition[] = [
  // ----------------------------------------------------------------- SALES
  {
    id: 'sales.summary',
    name: 'Resumen general de ventas',
    description:
      'Totales de ventas confirmadas del periodo: número de ventas, ingreso total, ticket promedio, descuentos y propinas.',
    category: 'SALES',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'metric', label: 'Métrica', type: 'string' },
      { key: 'value', label: 'Valor', type: 'string' }
    ]
  },
  {
    id: 'sales.detail',
    name: 'Detalle de ventas',
    description:
      'Una fila por venta confirmada con su código, fecha, total, descuento, propina, método de pago y canal.',
    category: 'SALES',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [
      {
        key: 'paymentMethod',
        label: 'Método de pago',
        type: 'PAYMENT_METHOD',
        multiple: true
      }
    ],
    availableFields: [
      { key: 'code', label: 'Código', type: 'string' },
      { key: 'date', label: 'Fecha', type: 'datetime' },
      { key: 'total', label: 'Total', type: 'currency' },
      { key: 'discount', label: 'Descuento', type: 'currency' },
      { key: 'tip', label: 'Propina', type: 'currency' },
      { key: 'paymentMethod', label: 'Método de pago', type: 'string' },
      { key: 'channel', label: 'Canal', type: 'string' }
    ]
  },
  {
    id: 'sales.byDay',
    name: 'Ventas por día',
    description: 'Ingreso y número de ventas confirmadas agrupadas por día local.',
    category: 'SALES',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'day', label: 'Día', type: 'date' },
      { key: 'orders', label: 'Ventas', type: 'number' },
      { key: 'total', label: 'Total', type: 'currency' }
    ]
  },
  {
    id: 'sales.byPaymentMethod',
    name: 'Ventas por método de pago',
    description: 'Totales de ventas confirmadas agrupadas por método de pago.',
    category: 'SALES',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'paymentMethod', label: 'Método de pago', type: 'string' },
      { key: 'orders', label: 'Ventas', type: 'number' },
      { key: 'total', label: 'Total', type: 'currency' }
    ]
  },
  {
    id: 'sales.byProduct',
    name: 'Ventas por producto',
    description:
      'Unidades vendidas e ingreso por producto, derivados de las líneas de venta del periodo.',
    category: 'SALES',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'type', label: 'Tipo', type: 'string' },
      { key: 'product', label: 'Producto', type: 'string' },
      { key: 'parent', label: 'Producto principal', type: 'string' },
      { key: 'units', label: 'Unidades', type: 'number' },
      { key: 'total', label: 'Ingreso', type: 'currency' }
    ]
  },
  {
    id: 'sales.topProducts',
    name: 'Productos más vendidos',
    description: 'Ranking de productos y complementos por unidades vendidas en el periodo.',
    category: 'SALES',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'type', label: 'Tipo', type: 'string' },
      { key: 'product', label: 'Producto', type: 'string' },
      { key: 'parent', label: 'Producto principal', type: 'string' },
      { key: 'units', label: 'Unidades', type: 'number' },
      { key: 'total', label: 'Ingreso', type: 'currency' }
    ]
  },
  {
    id: 'sales.cancelled',
    name: 'Ventas canceladas / pedidos no confirmados',
    description:
      'Pedidos que no alcanzaron el estado confirmado (state distinto de concluido) en el periodo.',
    category: 'SALES',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'code', label: 'Código', type: 'string' },
      { key: 'date', label: 'Fecha', type: 'datetime' },
      { key: 'status', label: 'Estado', type: 'string' },
      { key: 'total', label: 'Total', type: 'currency' }
    ]
  },

  // -------------------------------------------------------------- PRODUCTS
  {
    id: 'products.catalog',
    name: 'Catálogo completo de productos',
    description:
      'Listado de productos y complementos con precio, IVA, estado, stock actual y si gestionan inventario.',
    category: 'PRODUCTS',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'type', label: 'Tipo', type: 'string' },
      { key: 'code', label: 'Código', type: 'string' },
      { key: 'name', label: 'Nombre', type: 'string' },
      { key: 'price', label: 'Precio', type: 'currency' },
      { key: 'vat', label: 'IVA %', type: 'number' },
      { key: 'stock', label: 'Stock', type: 'number' },
      { key: 'manageStock', label: 'Gestiona stock', type: 'boolean' },
      { key: 'active', label: 'Activo', type: 'boolean' }
    ]
  },
  {
    id: 'products.lowStock',
    name: 'Productos con stock bajo / agotados',
    description:
      'Productos y complementos que gestionan inventario con existencias menores o iguales al umbral configurado.',
    category: 'PRODUCTS',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'type', label: 'Tipo', type: 'string' },
      { key: 'code', label: 'Código', type: 'string' },
      { key: 'name', label: 'Nombre', type: 'string' },
      { key: 'stock', label: 'Stock', type: 'number' }
    ]
  },

  // ------------------------------------------------------------- INVENTORY
  {
    id: 'inventory.current',
    name: 'Existencias actuales',
    description:
      'Stock actual por producto y complemento gestionado, con valor estimado al precio de venta.',
    category: 'INVENTORY',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'type', label: 'Tipo', type: 'string' },
      { key: 'code', label: 'Código', type: 'string' },
      { key: 'name', label: 'Nombre', type: 'string' },
      { key: 'stock', label: 'Stock', type: 'number' },
      { key: 'price', label: 'Precio', type: 'currency' },
      { key: 'value', label: 'Valor estimado', type: 'currency' }
    ]
  },
  {
    id: 'inventory.movements',
    name: 'Historial de movimientos de inventario',
    description:
      'Movimientos reales de stock (entradas, salidas y ajustes) registrados en el periodo, a partir del historial de inventario.',
    category: 'INVENTORY',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [
      {
        key: 'movementType',
        label: 'Tipo de movimiento',
        type: 'MOVEMENT_TYPE',
        multiple: true,
        options: [
          { value: 'RESTOCK', label: 'Entrada' },
          { value: 'DECREMENT', label: 'Salida por venta' },
          { value: 'ADJUST', label: 'Ajuste' },
          { value: 'RESERVE', label: 'Reserva' },
          { value: 'RELEASE', label: 'Liberación' }
        ]
      }
    ],
    availableFields: [
      { key: 'date', label: 'Fecha', type: 'datetime' },
      { key: 'product', label: 'Producto', type: 'string' },
      { key: 'type', label: 'Tipo', type: 'string' },
      { key: 'delta', label: 'Cantidad', type: 'number' },
      { key: 'reference', label: 'Referencia', type: 'string' }
    ]
  },

  // -------------------------------------------------------------- CLIENTS
  {
    id: 'clients.list',
    name: 'Clientes registrados',
    description:
      'Clientes del establecimiento registrados dentro del periodo, con sus datos de contacto.',
    category: 'CLIENTS',
    enabled: true,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: [
      { key: 'name', label: 'Nombre', type: 'string' },
      { key: 'document', label: 'Documento', type: 'string' },
      { key: 'phone', label: 'Teléfono', type: 'string' },
      { key: 'email', label: 'Correo', type: 'string' },
      { key: 'createdAt', label: 'Registro', type: 'datetime' }
    ]
  },

  // -------------------------------------------------- PENDING (no models)
  {
    id: 'purchases.list',
    name: 'Compras realizadas',
    description: 'Compras a proveedores durante el periodo.',
    category: 'PURCHASES',
    enabled: false,
    disabledReason: PENDING_NO_MODEL,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: []
  },
  {
    id: 'cash.summary',
    name: 'Resumen de caja',
    description: 'Aperturas, cierres, arqueos y diferencias de caja.',
    category: 'CASH',
    enabled: false,
    disabledReason: PENDING_NO_MODEL,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: []
  },
  {
    id: 'expenses.list',
    name: 'Gastos registrados',
    description: 'Gastos y egresos registrados en el periodo.',
    category: 'EXPENSES',
    enabled: false,
    disabledReason: PENDING_NO_MODEL,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: []
  },
  {
    id: 'billing.invoices',
    name: 'Facturas emitidas',
    description: 'Documentos electrónicos y su estado (DIAN/CUFE).',
    category: 'BILLING',
    enabled: false,
    disabledReason: PENDING_NO_MODEL,
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: []
  },
  {
    id: 'financial.profit',
    name: 'Utilidad bruta y margen',
    description:
      'Costo de mercancía vendida, utilidad y margen por producto/categoría.',
    category: 'FINANCIAL',
    enabled: false,
    disabledReason:
      'Pendiente: no existe un costo de adquisición confiable asociado a los productos vendidos.',
    supportedFormats: BOTH_FORMATS,
    supportsMultipleSelection: true,
    filters: [],
    availableFields: []
  }
]

/**
 * Looks up a report definition by id.
 *
 * @param id - Report id.
 * @returns The definition or undefined when unknown.
 */
export const findReportDefinition = (id: string): ReportDefinition | undefined =>
  REPORT_DEFINITIONS.find((def) => def.id === id)

/**
 * Groups the catalog by category for grouped UI rendering. Empty categories are
 * omitted so the UI only shows groups that contain at least one report.
 *
 * @returns Ordered list of categories, each with its reports.
 */
export const getCatalogGroupedByCategory = (): ReportCatalogCategory[] => {
  const order: ReportCategory[] = [
    'SALES',
    'PRODUCTS',
    'INVENTORY',
    'PURCHASES',
    'EXPENSES',
    'CASH',
    'BILLING',
    'CLIENTS',
    'EMPLOYEES',
    'FINANCIAL'
  ]

  return order
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      reports: REPORT_DEFINITIONS.filter((def) => def.category === category)
    }))
    .filter((group) => group.reports.length > 0)
}
