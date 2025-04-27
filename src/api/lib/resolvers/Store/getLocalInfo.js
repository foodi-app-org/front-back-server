import os from 'os'

function getLocalIp () {
  const interfaces = os.networkInterfaces()
  for (const iface of Object.values(interfaces)) {
    if (!iface) continue
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address
      }
    }
  }
  return 'localhost'
}

const getLocalBackendIp = () => {
  const localIp = getLocalIp()
  const localBackendIp = localIp
  return localBackendIp
}

export default {
  TYPES: {
  },
  QUERIES: {
    getLocalBackendIp
  },
  MUTATIONS: {
  }
}
