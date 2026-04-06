// src/app.js
import express    from 'express'
import cors       from 'cors'
import authRoutes from './routes/authRoutes.js'

const app = express()

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'FinTrack API' }))

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: 'Route tidak ditemukan' }))

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _, res, __) => {
  console.error(err)
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' })
})

export default app