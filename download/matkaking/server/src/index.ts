import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { config } from './config/env.js'
import apiRouter from './routes/api.js'
import { setupSocketIO } from './socket/chat.js'

const app = express()

// Middleware
app.use(cors({
  origin: config.corsOrigin.split(','),
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging in development
if (config.isDev) {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// API Routes
app.use('/api', apiRouter)

// Serve static files from client build in production
if (!config.isDev) {
  app.use(express.static('../client/dist'))
  app.get('*', (_req, res) => {
    res.sendFile('index.html', { root: '../client/dist' })
  })
}

// Create HTTP server
const httpServer = createServer(app)

// Setup Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigin.split(','),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

setupSocketIO(io)

// Start server
httpServer.listen(config.port, () => {
  console.log(`🚀 MatkaKing API Server running on port ${config.port}`)
  console.log(`📡 Environment: ${config.nodeEnv}`)
  console.log(`🔗 CORS Origin: ${config.corsOrigin}`)
  console.log(`💬 Socket.IO enabled`)
})

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down server...')
  httpServer.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

export { app, io }
