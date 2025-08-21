import fs from 'fs'
import os from 'os'
import { join } from 'path'
import { Op } from 'sequelize'
import xlsx from 'xlsx'

import StatusPedidosModel from '../../models/Store/statusPedidoFinal'
import { PATH_EXTERNAL_OS } from '../../utils'
import DateRange from '../../utils/DateRange'
import { getTenantName } from '../../utils/util'

const getReportDayNumber = async (parent, args, context) => {
  try {
    const todayRange = new DateRange()

    const { start, end } = todayRange.getRange()
    const schema = context?.restaurant || null
    const { day } = args ?? {
      day: null
    }
    const getAllreports = await StatusPedidosModel.schema(getTenantName(schema)).findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        },
        pSState: 4
      }
    })

    if (getAllreports.length === 0) {
      return {
        success: false,
        message: 'No reports found',
        errors: null,
        data: {
          id: null,
          url: null,
          name: null,
          description: `No reports found for day ${day}`
        }
      }
    }

    const reportData = getAllreports.map(report => ({
      id: report.stPId,
      tableId: report.tableId,
      valueDelivery: report.valueDelivery,
      discount: report.discount,
      tip: report.tip,
      locationUser: report.locationUser,
      createdAt: report.createdAt
    }))
    const workbook = xlsx.utils.book_new()
    const worksheet = xlsx.utils.json_to_sheet(reportData)
    const basePath = join(os.homedir(), PATH_EXTERNAL_OS)
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true })
    }
    const timestamps = new Date().toISOString().replace(/[:.]/g, '-')
    const filePath = join(basePath, `${timestamps}_Report_${day}.xlsx`)
    xlsx.utils.book_append_sheet(workbook, worksheet, `Report_${day}`)
    xlsx.writeFile(workbook, filePath)
    const name = `${timestamps}_Report_${day}.xlsx`
    return {
      success: true,
      message: 'Report generated successfully',
      errors: null,
      data: {
        id: null,
        url: name,
        name,
        description: `Report for day ${day} generated successfully`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error generating report',
      errors: [
        { message: error.message }
      ]
    }
  }
}

const getReportBydateRange = async (parent, args, context) => {
  try {
    const { startDate, endDate } = args
    const schema = context?.restaurant || null
    const todayRange = new DateRange()

    const { start, end } = todayRange.getRange({
      start: startDate,
      end: endDate
    })

    const getAllreports = await StatusPedidosModel.schema(getTenantName(schema)).findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        },
        pSState: 4
      }
    })

    if (getAllreports.length === 0) {
      return {
        success: false,
        message: 'No reports found',
        errors: null,
        data: {
          id: null,
          url: null,
          name: null,
          description: 'No reports found for the selected date range'
        }
      }
    }

    const reportData = getAllreports.map(report => ({
      id: report.stPId,
      tableId: report.tableId,
      valueDelivery: report.valueDelivery,
      discount: report.discount,
      tip: report.tip,
      locationUser: report.locationUser,
      createdAt: report.createdAt
    }))
    const workbook = xlsx.utils.book_new()
    const worksheet = xlsx.utils.json_to_sheet(reportData)
    const basePath = join(os.homedir(), PATH_EXTERNAL_OS)
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true })
    }
    const timestamps = new Date().toISOString().replace(/[:.]/g, '-')
    const filePath = join(basePath, `${timestamps}_Report.xlsx`)
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Report')
    xlsx.writeFile(workbook, filePath)
    const name = `${timestamps}_Report.xlsx`
    return {
      success: true,
      message: 'Report generated successfully',
      errors: null,
      data: {
        id: null,
        url: name,
        name,
        description: `Report for date range ${startDate} to ${endDate} generated successfully`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error generating report',
      errors: [
        { message: error.message }
      ]
    }
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getReportDayNumber,
    getReportBydateRange
  },
  MUTATIONS: {
  }
}
