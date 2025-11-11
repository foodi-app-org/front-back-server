import { PrinterPort } from '@modules/pos_print_core/domain/ports/printer.port'
import Printer, {
  JustifyModes,
  PrinterImagesModes,
  PrinterModes
} from 'esc-pos-printer' // Ajusta el nombre exacto según tu paquete
import {
  renderExtraRow,
  renderProductRow,
  renderTotalRow,
  separatorLine,
  wrapNameColumn
} from './helpers/escpos-usb-printer.helpers'

export class EscposNetworkPrinterAdapter implements PrinterPort {

  async print(sale: any): Promise<void> {
    console.log("🚀 ~ EscposNetworkPrinterAdapter ~ print ~ sale:", sale)
    try {
      const {
        store
      } = sale
      const {
        storeName,
        description,
        addressStore,
        emailStore,
        storePhone,
        NitStore,
        siteWeb
      } = store ?? {
        storeName: 'Comercio',
        description: '',
        Image: ''
      }
      // GET PRINTERS
      const printer = new Printer()

      /* get Printers list  */
      const printerList = await printer.getPrinters()
      printer.setPrinterName(printerList[0])
      printer.justify(JustifyModes.justifyCenter)
      printer.selectPrintMode(PrinterModes.MODE_EMPHASIZED)
      printer.text(storeName)
      printer.feed()

      // Descripción o categoría
      printer.selectPrintMode(PrinterModes.MODE_FONT_A)
      if (description) {
        printer.text(description)
        printer.feed()
      }

      // Dirección
      if (addressStore) {
        printer.text(addressStore)
        printer.feed()
      }

      // Teléfono
      if (storePhone) {
        printer.text(`Tel: ${storePhone}`)
        printer.feed()
      }

      // Email
      if (emailStore) {
        printer.text(emailStore)
        printer.feed()
      }

      // NIT
      if (NitStore) {
        printer.text(`NIT: ${NitStore}`)
        printer.feed()
      }

      // Sitio web
      if (siteWeb) {
        printer.text(siteWeb)
        printer.feed()
      }

      // Logo
      if (sale.urlLogo) {
        printer.printBase64Image(sale.urlLogo, PrinterImagesModes.IMG_DEFAULT)
        printer.feed()
      }

      printer.justify(JustifyModes.justifyLeft)

      // Fecha
      printer.text(`Fecha: ${sale.date}`)
      printer.feed()

      // Número de venta o referencia
      if (sale.pCodeRef) {
        printer.text(`Venta N°: ${sale.pCodeRef}`)
        printer.feed()
      }

      printer.text(separatorLine())
      printer.feed()

      printer.text(separatorLine())
      printer.feed()
      // Productos
      printer.text('CANT  PRODUCTO         SUBTOTAL')
      printer.text(separatorLine())
      printer.feed()
      for (const prod of sale.products) {
        const qty = prod.ProQuantity
        const name = prod.pName
        const subtotal = formatMoney(prod.ProPrice * qty)

        const nameLines = wrapNameColumn(name, 18)

        // Primera línea: qty, nombre, subtotal
        printer.text(
          renderProductRow(
            qty,
            nameLines[0],
            subtotal
          )
        )

        // Resto de líneas del nombre (solo texto en la columna del nombre)
        for (let i = 1; i < nameLines.length; i++) {
          printer.text(
            renderProductRow(
              "",
              nameLines[i],
              ""
            )
          )
        }

        // Extras
        // Extras con wrap y letra pequeña
        if (Array.isArray(prod.dataExtra) && prod.dataExtra.length > 0) {
          for (const ext of prod.dataExtra) {
            const extSubtotal = ext.quantity * ext.extraPrice;

            // Activamos FONT_B para letra más pequeña
            printer.selectPrintMode(PrinterModes.MODE_FONT_B)

            const wrapped = wrapNameColumn(`${ext.extraName} (${ext.quantity})`, 16)
            printer.feed()

            // Primera línea con subtotal
            printer.text(
              renderExtraRow(
                wrapped[0],
                formatMoney(extSubtotal)
              )
            )

            // Líneas adicionales sin subtotal
            for (let i = 1; i < wrapped.length; i++) {
              printer.text(
                renderExtraRow(
                  wrapped[i],
                  ""
                )
              )
            }

            // Volvemos a FONT_A para el resto
            printer.selectPrintMode(PrinterModes.MODE_FONT_A)
          }
        }
        // Separador por cada producto
        printer.feed();
        printer.text(separatorLine())
        printer.feed();
      }


      printer.text(separatorLine())

      // Subtotal (puedes derivarlo si quieres sumarlo antes)
      printer.text(renderTotalRow('Subtotal:', formatMoney(sale.total)))

      // Descuento
      if (sale.discount && sale.discount.price > 0) {
        printer.text(renderTotalRow('Descuento:', '-' + formatMoney(sale.discount.price)))
      }

      // Total Final
      printer.setEmphasis(true)
      printer.text(renderTotalRow('Total:', formatMoney(sale.total)))
      printer.setEmphasis(false)

      // Método de pago
      printer.text(renderTotalRow('Pago:', sale.paymentMethod))

      // Cambio si existe
      if (sale.change !== '' && sale.change !== null) {
        printer.text(renderTotalRow('Cambio:', formatMoney(Number(sale.change))))
      }
      printer.feed(2)

      printer.justify(JustifyModes.justifyCenter)
      printer.feed()
      printer.qrCode(`${sale.pCodeRef}`, 6)
      printer.text('¡Gracias por su compra!')

      printer.feed(2)
      printer.cut()
      printer.close()
      await printer.print()
    } catch (error) {
      console.error('Error printing receipt:', error)
    }

  }
}

function formatMoney(amount: number = 0): string {
  return `$${amount.toFixed(2)}`
}
