import Printer, { JustifyModes, PrinterImagesModes, PrinterModes } from 'esc-pos-printer';
import { renderTable, ColDef, Row } from './escpos-usb-printer.helpers';
import { numberFormat } from '@shared/utils/number-format';
import { printClientData } from './escpos-usb-printer.client.helpers';

export class ReceiptPrinter {
  private readonly printer: Printer;
  private readonly formatter: (amount: number) => string;

  constructor(printer: Printer) {
    this.printer = printer;
    this.formatter = (amount: number) => String(numberFormat(amount));
  }

  formatMoney(amount: number = 0): string {
    return this.formatter(amount);
  }
  printHeader(sale: any) {
    const store = sale.store ?? {};
    const {
      storeName = "Comercio",
      description,
      addressStore,
      emailStore,
      storePhone,
      NitStore,
      siteWeb
    } = store;

    this.printer.feed();
    this.printer.justify(JustifyModes.justifyCenter);
    this.printer.text("¡Gracias por su compra!");
    this.printer.feed(5);

    this.printer.justify(JustifyModes.justifyCenter);
    this.printer.selectPrintMode(PrinterModes.MODE_EMPHASIZED);
   
    this.printer.text(storeName);
    this.printer.feed();

    this.printer.selectPrintMode(PrinterModes.MODE_FONT_A);

    if (description) this.printLine(description);
    if (addressStore) this.printLine(addressStore);
    if (storePhone) this.printLine(`Tel: ${storePhone}`);
    if (emailStore) this.printLine(emailStore);
    if (NitStore) this.printLine(`NIT: ${NitStore}`);
    if (siteWeb) this.printLine(siteWeb);

    if (sale.urlLogo) {
      this.printer.printBase64Image(sale.urlLogo, PrinterImagesModes.IMG_DEFAULT);
      this.printer.feed();
    }

    this.printer.justify(JustifyModes.justifyLeft);
    this.printer.feed();
  }
  // -------------------------------------------------------------------
  printProducts(shopping: any[]) {
    const cols: ColDef[] = [
      { width: 4, align: "left" },
      { width: 18, align: "left" },
      { width: 10, align: "right" },
    ];

    // Header
    this.printLine(
      renderTable({ cols, totalWidth: 32, rows: [["CANT", "PRODUCTO", "SUBTOTAL"]] })
    );
    this.printLine("-".repeat(32));

    // Shopping products
    for (const shop of shopping) {
      console.log("🚀 ~ ReceiptPrinter ~ printProducts ~ shop:", shop)
      const qty = Number(shop.cantProducts)
      const rowComment: Row[] = [['', shop.comments, '']];
      // Construimos las filas del producto con wrap
      for (const prod of shop.products) {
        const name = prod.pName
        const subtotal = this.formatMoney(prod.ProPrice * qty);
        const rows: Row[] = [[`(${qty})`, name, subtotal]]
        const tableString = renderTable({ cols, totalWidth: 32, rows });
        this.printLine(tableString)

        const tableComment = renderTable({ cols, totalWidth: 32, rows: rowComment });

        const extras = prod.dataExtra || []
        if (Array.isArray(extras) && extras.length > 0) {
          this.printExtras(extras, cols);
        }
        if (shop.comments && shop.comments.length > 0) {
          this.printLine(tableComment);
        }
      }
      this.printLine("-".repeat(32));
    }
  }

  // Extras con sangría y wrap
  printExtras(extras: any[], cols: ColDef[]) {
    for (const ext of extras) {
      const extSubtotal = this.formatMoney(Number(ext.quantity) * ext.extraPrice);
      const rows: Row[] = [[
        "", // CANT vacío
        `  +${ext.extraName} (${ext.quantity})`, // Producto con sangría + nombre
        extSubtotal
      ]];
      const tableString = renderTable({ cols, totalWidth: 32, rows });
      this.printLine(tableString);
    }
  }
  printClient(sale: any) {
    printClientData(this.printer, sale);
    this.printer.feed();
  }

  // ------------------------- SALE INFO -------------------------
  printSaleInfo(sale: any) {
    this.printer.selectPrintMode(PrinterModes.MODE_EMPHASIZED);
    this.printer.text('DETALLES DE LA VENTA');
    this.printer.feed();
    this.printer.selectPrintMode(PrinterModes.MODE_FONT_A);
    this.printLine(`Fecha: ${sale.date}`);
    this.printLine(`Fecha factura: ${new Date().toLocaleDateString()}`);
    if (sale.pCodeRef) this.printLine(`Venta N°: ${sale.pCodeRef}`);

    this.printLine("-".repeat(32));
    this.printer.feed();
  }


  printTotals(sale: any) {
    const cols: ColDef[] = [
      { width: 20, align: "right" },
      { width: 12, align: "right" }
    ];

    this.printLine("-".repeat(32));

    const rows: Row[] = [];
    rows.push(["Subtotal:", this.formatMoney(sale.total)]);

    if (sale.discount && sale.discount.price > 0) {
      rows.push(["Descuento:", "-" + this.formatMoney(sale.discount.price)]);
    }

    rows.push(["Total a pagar:", this.formatMoney(sale.total)]);
    rows.push(["Su pago:", sale.paymentMethod]);

    if (sale.change !== "" && sale.change !== null) {
      rows.push(["Su cambio:", this.formatMoney(Number(sale.change))]);
    }

    this.printLine(renderTable({ cols, totalWidth: 32, rows }));
    this.printer.feed(2);
  }
  printFooter(pCodeRef: string) {
    this.printer.justify(JustifyModes.justifyCenter);
    this.printer.feed();
    this.printer.qrCode(`${pCodeRef}`, 6);
    this.printer.feed();
    this.printer.text("¡Gracias por su compra!");
    this.printer.feed(5);
  }
  // Línea helper
  printLine(text: string) {
    // el printer espera cada línea
    for (const line of text.split("\n")) {
      this.printer.text(line);
      this.printer.feed();
    }
  }
}
