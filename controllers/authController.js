import { getDBConnection } from '../db/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * Register a new user
 * 
 * Steps:
 * 1. Check if user already exists (by email)
 * 2. Hash the password (NEVER store plain text passwords!)
 * 3. Save user to database
 * 4. Generate JWT token
 * 5. Return token to client
 */
export async function register(req, res) {
  try {
    const { email, password, name } = req.body

    // Validation: Check if required fields are provided
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      })
    }

    // Validation: Check password length (security best practice)
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      })
    }

    const db = await getDBConnection()

    // Step 1: Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingUser) {
      await db.close()
      return res.status(409).json({ 
        error: 'User with this email already exists' 
      })
    }

    // Step 2: Hash the password
    // bcrypt.hash() takes the password and a "salt rounds" number
    // Higher rounds = more secure but slower (10 is a good balance)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Step 3: Save user to database
    const result = await db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name || null]
    )

    // Step 4: Generate JWT token
    // JWT contains: user id, email (payload)
    // Signed with JWT_SECRET (keeps it secure)
    // Expires in 7 days
    const token = jwt.sign(
      { 
        userId: result.lastID, 
        email: email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    await db.close()

    // Step 5: Return token to client
    res.status(201).json({
      message: 'User registered successfully',
      token, // Client will store this and send it with future requests
      user: {
        id: result.lastID,
        email,
        name: name || null
      }
    })

  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ 
      error: 'Failed to register user', 
      details: err.message 
    })
  }
}

/**
 * Login an existing user
 * 
 * Steps:
 * 1. Find user by email
 * 2. Check if password matches (compare with hashed password)
 * 3. Generate JWT token
 * 4. Return token to client
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      })
    }

    const db = await getDBConnection()

    // Step 1: Find user by email
    const user = await db.get(
      'SELECT id, email, password, name FROM users WHERE email = ?',
      [email]
    )

    if (!user) {
      await db.close()
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      })
    }

    // Step 2: Compare password with hashed password in database
    // bcrypt.compare() handles the comparison securely
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      await db.close()
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      })
    }

    // Step 3: Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    await db.close()

    // Step 4: Return token to client
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ 
      error: 'Failed to login', 
      details: err.message 
    })
  }
}

/**
 * Get current user profile (protected route)
 * This endpoint requires authentication (JWT token)
 */
export async function getProfile(req, res) {
  try {
    // req.user is set by the auth middleware (we'll create this next)
    const db = await getDBConnection()
    
    const user = await db.get(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [req.user.userId]
    )

    await db.close()

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })

  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ 
      error: 'Failed to get profile', 
      details: err.message 
    })
  }
}
