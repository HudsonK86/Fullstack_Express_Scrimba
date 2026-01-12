import 'dotenv/config'
import express from 'express'
import { productsRouter } from './routes/products.js'
import { authRouter } from './routes/auth.js'

const app = express()
const PORT = process.env.PORT || 8000

// Middleware to parse JSON request bodies
// This allows us to read req.body in our controllers
app.use(express.json())
 
app.use(express.static('public'))

// API Routes
app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter)
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
}) 