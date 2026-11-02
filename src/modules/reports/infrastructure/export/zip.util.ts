import { deflateRawSync } from 'node:zlib'

/**
 * A single entry to include in a ZIP archive.
 */
export interface ZipEntry {
  /** Entry path inside the archive (e.g. `Ventas.csv`). */
  name: string
  /** Raw file content. */
  content: Buffer
}

const crcTable: number[] = (() => {
  const table: number[] = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

/**
 * Computes a CRC-32 checksum (ZIP standard) for a buffer.
 *
 * @param buf - Input bytes.
 * @returns Unsigned 32-bit CRC.
 */
const crc32 = (buf: Buffer): number => {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

const dosDateTime = (date: Date): { time: number; date: number } => {
  const time = ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | ((Math.floor(date.getSeconds() / 2)) & 0x1f)
  const d = (((date.getFullYear() - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0x0f) << 5) | (date.getDate() & 0x1f)
  return { time, date: d }
}

/**
 * Builds a ZIP archive in memory with no external dependencies.
 *
 * Each entry is DEFLATE-compressed (ZIP method 8). Produces a standards
 * compliant archive with local file headers and a central directory, readable
 * by any OS/unzip tool and by spreadsheet apps.
 *
 * @param entries - Files to include.
 * @returns The complete ZIP as a Buffer.
 */
export const createZip = (entries: ZipEntry[]): Buffer => {
  const localParts: Buffer[] = []
  const centralParts: Buffer[] = []
  let offset = 0
  const now = new Date()
  const { time, date } = dosDateTime(now)

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8')
    const crc = crc32(entry.content)
    const compressed = deflateRawSync(entry.content)
    const useDeflate = compressed.length < entry.content.length
    const method = useDeflate ? 8 : 0
    const data = useDeflate ? compressed : entry.content

    // Local file header
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4) // version needed
    local.writeUInt16LE(0x0800, 6) // flags: UTF-8 names
    local.writeUInt16LE(method, 8)
    local.writeUInt16LE(time, 10)
    local.writeUInt16LE(date, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(entry.content.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    local.writeUInt16LE(0, 28)

    localParts.push(local, nameBuf, data)

    // Central directory header
    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4) // version made by
    central.writeUInt16LE(20, 6) // version needed
    central.writeUInt16LE(0x0800, 8) // flags
    central.writeUInt16LE(method, 10)
    central.writeUInt16LE(time, 12)
    central.writeUInt16LE(date, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(entry.content.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt16LE(0, 30) // extra len
    central.writeUInt16LE(0, 32) // comment len
    central.writeUInt16LE(0, 34) // disk number
    central.writeUInt16LE(0, 36) // internal attrs
    central.writeUInt32LE(0, 38) // external attrs
    central.writeUInt32LE(offset, 42)

    centralParts.push(central, nameBuf)
    offset += local.length + nameBuf.length + data.length
  }

  const centralDir = Buffer.concat(centralParts)
  const localData = Buffer.concat(localParts)

  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(centralDir.length, 12)
  end.writeUInt32LE(localData.length, 16)
  end.writeUInt16LE(0, 20)

  return Buffer.concat([localData, centralDir, end])
}
