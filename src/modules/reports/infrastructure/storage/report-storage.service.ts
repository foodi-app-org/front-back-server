import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/**
 * Base directory where generated report files are stored. Mirrors the rest of
 * the app (`PATH_EXTERNAL_OS`, default `app_data` under the user home) and is
 * served to the client by the frontend `/api/files/[filename]` proxy.
 */
const BASE_DIR = path.join(os.homedir(), process.env.PATH_EXTERNAL_OS || 'app_data')

/**
 * Local filesystem storage for report files. Only file names are persisted in
 * the DB; physical paths never leave the backend.
 */
export class ReportStorageService {
  /**
   * Ensures the base directory exists.
   */
  private ensureDir(): void {
    if (!fs.existsSync(BASE_DIR)) {
      fs.mkdirSync(BASE_DIR, { recursive: true })
    }
  }

  /**
   * Rejects path traversal and returns the absolute, sandboxed file path.
   *
   * @param fileName - Candidate file name (no directories allowed).
   * @returns Absolute path inside the base directory.
   * @throws When the name escapes the base directory.
   */
  resolveSafe(fileName: string): string {
    const resolved = path.resolve(BASE_DIR, fileName)
    if (path.dirname(resolved) !== path.resolve(BASE_DIR)) {
      throw new Error('Invalid file name')
    }
    return resolved
  }

  /**
   * Writes a report file to local storage.
   *
   * @param fileName - Target file name.
   * @param content - File bytes.
   * @returns The written file name and its size in bytes.
   */
  async write(fileName: string, content: Buffer): Promise<{ fileName: string; size: number }> {
    this.ensureDir()
    const target = this.resolveSafe(fileName)
    await fs.promises.writeFile(target, content)
    return { fileName, size: content.length }
  }

  /**
   * Checks whether a report file still exists on disk.
   *
   * @param fileName - File name to check.
   * @returns `true` when the file is present.
   */
  exists(fileName: string): boolean {
    try {
      return fs.existsSync(this.resolveSafe(fileName))
    } catch {
      return false
    }
  }

  /**
   * Deletes a report file if present (best-effort).
   *
   * @param fileName - File name to remove.
   */
  async remove(fileName: string): Promise<void> {
    try {
      const target = this.resolveSafe(fileName)
      if (fs.existsSync(target)) {
        await fs.promises.unlink(target)
      }
    } catch {
      // best-effort cleanup
    }
  }
}
