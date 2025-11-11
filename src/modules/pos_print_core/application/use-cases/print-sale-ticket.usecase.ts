import { PrinterPort } from "@modules/pos_print_core/domain/ports/printer.port";
import { ReceiptRenderer } from "@modules/pos_print_core/domain/repositories/pos_print_core.repository"

export interface Sale {
    id: string
    items: Array<{ name: string; price: number; quantity: number }>
    total: number
}

export class PrintSaleTicketUseCase {
  constructor(
    private readonly printer: PrinterPort,
    private readonly renderer: ReceiptRenderer
  ) {}

  async execute(sale: Sale): Promise<void> {
    const buffer = await this.renderer.renderSale(sale)
    await this.printer.print(buffer)
  }
}
