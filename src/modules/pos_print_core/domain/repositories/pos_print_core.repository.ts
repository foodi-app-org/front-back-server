export interface ReceiptRenderer {
    renderSale(sale: unknown): Promise<string>
}