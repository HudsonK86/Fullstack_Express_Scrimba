import { getDBConnection } from '../db/db.js'

const startTime = Date.now()

export async function getHealth(req, res) {
  try {
    // Check database connectivity
    const db = await getDBConnection()
    await db.get('SELECT 1')
    await db.close()

    // Calculate uptime
    const uptimeMs = Date.now() - startTime
    const uptimeSeconds = Math.floor(uptimeMs / 1000)

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptimeSeconds,
        formatted: formatUptime(uptimeSeconds)
      },
      database: {
        status: 'connected'
      }
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        error: error.message
      }
    })
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  parts.push(`${secs}s`)

  return parts.join(' ')
}
