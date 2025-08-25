import crypto from 'crypto'
import os from 'os'

/**
 * System-level device information (server-side)
 */
export interface DeviceInfo {
  cpuModel: string
  platform: NodeJS.Platform
  cpuArchitecture: string
  totalMemory: number // in GB
  freeMemory: number // in GB
  hostname: string
  release: string
  uptime: number
  userInfo: os.UserInfo<string>
  networkInterfaces: NodeJS.Dict<os.NetworkInterfaceInfo[]>
}

/**
 * Browser/device information extracted from User-Agent
 */
export interface BrowserInfo {
  name: string
  short_name: string
  version: string
  family: string
  platform: string
  device: 'Mobile' | 'Tablet' | 'Desktop'
  os: string
  model: string
}

/**
 * Extended device/browser info with fingerprint & bot detection
 */
export interface ExtendedBrowserInfo extends BrowserInfo {
  ip?: string
  deviceId: string
  isBot: boolean
}

/**
 * Get system/server device info (backend machine)
 */
export function getDeviceInfo(): DeviceInfo {
  return {
    cpuModel: os.cpus()[0]?.model || 'Unknown',
    platform: os.platform(),
    cpuArchitecture: os.arch(),
    totalMemory: +(os.totalmem() / (1024 ** 3)).toFixed(2),
    freeMemory: +(os.freemem() / (1024 ** 3)).toFixed(2),
    hostname: os.hostname(),
    release: os.release(),
    uptime: os.uptime(),
    userInfo: os.userInfo(),
    networkInterfaces: os.networkInterfaces()
  }
}

/**
 * Parse User-Agent string to extract client device/browser info
 */
export function parseExtendedUserAgent(userAgent: string, ip?: string): ExtendedBrowserInfo {
  const deviceInfo = getDeviceInfo()

  const browser = detectBrowser(userAgent)
  const os = normalizeOS(detectOperatingSystem(userAgent))
  const model = detectDeviceModel(userAgent)

  const deviceId = generateDeviceId(userAgent, ip ?? '', deviceInfo)

  return {
    name: browser.name,
    short_name: deviceInfo.cpuModel,
    version: browser.version || deviceInfo.release,
    family: browser.family,
    platform: deviceInfo.platform || 'Unknown',
    device: detectDeviceType(userAgent),
    os,
    model,
    ip,
    deviceId,
    isBot: isBot(userAgent)
  }
}

/**
 * Detect client device type
 */
function detectDeviceType(userAgent: string): 'Mobile' | 'Tablet' | 'Desktop' {
  if (/Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent)) return 'Mobile'
  if (/Tablet/i.test(userAgent)) return 'Tablet'
  return 'Desktop'
}

const DEVICE_MODEL_PATTERNS: Record<string, RegExp> = {
  iPhone: /iPhone/i,
  iPad: /iPad/i,
  SamsungGalaxy: /Samsung Galaxy/i,
  Pixel: /Pixel/i,
  Huawei: /Huawei/i,
  Xiaomi: /Mi|Redmi|Xiaomi/i,
  OnePlus: /OnePlus/i
}

/**
 * Detect device model from User-Agent
 */
function detectDeviceModel(userAgent: string): string {
  for (const [model, pattern] of Object.entries(DEVICE_MODEL_PATTERNS)) {
    if (pattern.test(userAgent)) return model
  }
  return 'Unknown'
}

const BROWSER_PATTERNS: Record<string, RegExp> = {
  Chrome: /Chrome\/([0-9.]+)/,
  Firefox: /Firefox\/([0-9.]+)/,
  Safari: /Version\/([0-9.]+).*Safari/,
  Edge: /Edg\/([0-9.]+)/,
  IE: /MSIE ([0-9.]+)/,
  Opera: /OPR\/([0-9.]+)/,
  Brave: /Brave\/([0-9.]+)/,
  Vivaldi: /Vivaldi\/([0-9.]+)/,
  SamsungBrowser: /SamsungBrowser\/([0-9.]+)/
}

/**
 * Detect browser info from User-Agent
 */
function detectBrowser(userAgent: string): { name: string; version: string; family: string } {
  for (const [name, pattern] of Object.entries(BROWSER_PATTERNS)) {
    const match = userAgent.match(pattern)
    if (match) return { name, version: match[1], family: name }
  }
  return { name: 'Unknown', version: 'Unknown', family: 'Unknown' }
}

const OS_PATTERNS: Record<string, RegExp> = {
  Windows: /Windows/i,
  MacOS: /Macintosh|Mac OS X/i,
  Linux: /Linux/i,
  Android: /Android/i,
  iOS: /iPhone|iPad|iPod/i
}

/**
 * Detect operating system from User-Agent
 */
function detectOperatingSystem(userAgent: string): string {
  for (const [os, pattern] of Object.entries(OS_PATTERNS)) {
    if (pattern.test(userAgent)) return os
  }
  return 'Unknown'
}

/**
 * Normalize OS names for consistency
 */
function normalizeOS(os: string): string {
  const map: Record<string, string> = {
    'Macintosh': 'MacOS',
    'Mac OS X': 'MacOS'
  }
  return map[os] || os
}

/**
 * Detect if User-Agent belongs to a bot/crawler
 */
function isBot(userAgent: string): boolean {
  return /bot|crawl|spider|slurp|bing|yandex/i.test(userAgent)
}

/**
 * Generate a unique fingerprint for the device
 */
function generateDeviceId(userAgent: string, ip: string, deviceInfo: DeviceInfo): string {
  const raw = `${userAgent}-${ip}-${deviceInfo.cpuModel}-${deviceInfo.platform}-${deviceInfo.hostname}`
  return crypto.createHash('sha256').update(raw).digest('hex')
}
