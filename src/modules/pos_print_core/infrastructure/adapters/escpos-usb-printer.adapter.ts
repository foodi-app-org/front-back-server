import Printer from 'esc-pos-printer'
import { PrinterPort } from '@modules/pos_print_core/domain/ports/printer.port'
import { ReceiptPrinter } from './helpers/receipt-printer'

export class EscposNetworkPrinterAdapter implements PrinterPort {
  async print(sale: any): Promise<boolean> {
    try {
      const printer = new Printer()
      const printerList = await printer.getPrinters()

      printer.setPrinterName(printerList[0])

      const receipt = new ReceiptPrinter(printer)

      receipt.printHeader(sale)
      receipt.printClient(sale)
      receipt.printSaleInfo(sale)
      receipt.printProducts(sale.products)
      receipt.printTotals(sale.totals)
      receipt.printFooter(sale.pCodeRef)

      printer.cut()
      printer.close()
      const { success } = await printer.print()
      if (!success) {
        return false
      }
      return success
    } catch (error) {
      console.error('Error printing receipt:', error)
      return false
    }
  }
}
