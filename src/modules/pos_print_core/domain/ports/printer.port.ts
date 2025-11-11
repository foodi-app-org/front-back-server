export interface PrinterPort {
    // // send raw bytes/commands to printer
    // printRaw(buffer: Buffer | Uint8Array): Promise<void>
    // // a convenience: print an image buffer (png/jpg) to the printer
    // printImage(imageBuffer: Buffer): Promise<void>
    // // open/close connection lifecycle
    // connect(): Promise<void>
    // close(): Promise<void>
    print(buffer: string): Promise<void>
}