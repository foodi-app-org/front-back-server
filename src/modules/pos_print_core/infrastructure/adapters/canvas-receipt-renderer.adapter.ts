import { Sale } from '@modules/pos_print_core/application'
import { ReceiptRenderer } from '@modules/pos_print_core/domain/repositories/pos_print_core.repository'
import { createCanvas } from 'canvas'


export class CanvasReceiptRenderer implements ReceiptRenderer {
  private readonly width = 384 // ancho típico de impresora térmica en px
  private readonly lineHeight = 24

  async renderSale(sale: Sale): Promise<string> {
    // Crear canvas
    const canvas = createCanvas(this.width, this.calculateHeight(sale))
    const ctx = canvas.getContext('2d')

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Texto negro
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 14px Sans'

    let y = 0

    // Título
    ctx.fillText('TICKET DE VENTA', 0, y += this.lineHeight)

    // Información de la venta
    ctx.font = '12px Sans'
    ctx.fillText(`ID: ${sale.id}`, 0, y += this.lineHeight)

    // Items
    for (const item of sale.items) {
      ctx.fillText(`- ${item.name} x ${item.quantity}`, 0, y += this.lineHeight)
    }

    // Aquí podrías agregar totales, QR, logos, etc.

    // Convertir canvas a buffer PNG
    const buffer = canvas.toBuffer('image/png')

    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    const os = await import('node:os')

    const baseDir =
      process.platform === 'win32'
        ? process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
        : process.platform === 'darwin'
          ? path.join(os.homedir(), 'Library', 'Application Support')
          : process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share')

    const appDataDir = path.join(baseDir, 'app_data')
    await fs.mkdir(appDataDir, { recursive: true })

    const filePath = path.join(appDataDir, `receipt_${sale.id}_${Date.now()}.png`)
    await fs.writeFile(filePath, buffer)

    return filePath
  }

  private calculateHeight(sale: Sale): number {
    // Altura dinámica: base + items * lineHeight
    const baseHeight = 100
    const itemsHeight = sale.items.length * this.lineHeight
    return baseHeight + itemsHeight
  }
}
