// server.js
import 'dotenv/config'
import app from './App.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 FinTrack API running on http://localhost:${PORT}`)
})