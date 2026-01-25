import jwt from 'jsonwebtoken'

/**
 * JWT Authentication Middleware
 * 
 * What is middleware?
 * - Functions that run between the request and response
 * - Can modify the request, check authentication, etc.
 * 
 * How this works:
 * 1. Extract token from Authorization header
 * 2. Verify token is valid (not expired, correct signature)
 * 3. If valid, attach user info to req.user
 * 4. If invalid, return 401 Unauthorized
 */
export function authenticateToken(req, res, next) {
  // Step 1: Get token from Authorization header
  // Format: "Bearer <token>"
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Get part after "Bearer "

  // If no token provided, deny access
  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    })
  }

  // Validate JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined')
    return res.status(500).json({ 
      error: 'Server configuration error' 
    })
  }

  try {
    // Step 2: Verify the token
    // jwt.verify() checks:
    // - Is the signature valid? (was it signed with our JWT_SECRET?)
    // - Is it expired?
    // - Is the format correct?
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Step 3: Attach user info to request object
    // Now any route handler can access req.user
    req.user = decoded

    // Step 4: Call next() to continue to the next middleware/route handler
    next()

  } catch (err) {
    // Token is invalid or expired
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired. Please login again.' 
      })
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token' 
      })
    }

    // For any other errors (e.g., malformed token, server error)
    console.error('Token verification error:', err.name, err.message)
    return res.status(401).json({ 
      error: 'Authentication failed' 
    })
  }
}
