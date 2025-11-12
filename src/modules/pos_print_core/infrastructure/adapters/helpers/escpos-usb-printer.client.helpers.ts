import Printer, { PrinterModes } from "esc-pos-printer"
import { separatorLine } from "./escpos-usb-printer.helpers"

export function printClientData(printer: Printer, sale: any) {
  if (!sale.client) return

  const { clientName, clientLastName, clientNumber, clientAddress, email, ccClient } = sale.client

  printer.text(separatorLine())
  printer.feed()

  printer.selectPrintMode(PrinterModes.MODE_EMPHASIZED)
  printer.text('CLIENTE')
  printer.selectPrintMode(PrinterModes.MODE_FONT_A)
  printer.feed()

  if (clientName || clientLastName) {
    printer.text(`Nombre: ${clientName ?? ''} ${clientLastName ?? ''}`.trim())
    printer.feed()
  }

  if (ccClient) {
    printer.text(`Documento: ${ccClient}`)
    printer.feed()
  }

  if (clientNumber) {
    printer.text(`Tel: ${clientNumber}`)
    printer.feed()
  }

  if (email) {
    printer.text(`Email: ${email}`)
    printer.feed()
  }

  if (clientAddress) {
    printer.text(`Dirección: ${clientAddress}`)
    printer.feed()
  }

  printer.text(separatorLine())
  printer.feed()
}
