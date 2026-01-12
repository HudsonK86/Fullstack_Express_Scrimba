# JWT Authentication Implementation Guide

## 🎓 Step-by-Step Guide (Senior Dev → Intern)

Hey! I've implemented JWT authentication for our Spiral Sounds app. Let me walk you through what we built and why each piece matters.

---

## 📋 What We Built

### 1. **Database Setup** ✅
- Created `users` table with `email`, `password`, `name`, and `created_at` fields
- Password is stored as a **hashed** value (never plain text!)

### 2. **Backend Authentication** ✅
- **Register endpoint**: Creates new users
- **Login endpoint**: Authenticates existing users
- **Profile endpoint**: Gets current user info (protected route)

### 3. **JWT Middleware** ✅
- Protects routes that require authentication
- Verifies JWT tokens on each request

### 4. **Frontend Integration** ✅
- Login/Register modal
- Token storage in localStorage
- Automatic token inclusion in API requests

---

## 🔐 How JWT Works (The Big Picture)

```
1. User registers/logs in
   ↓
2. Server validates credentials
   ↓
3. Server creates JWT token (signed with secret)
   ↓
4. Token sent to client
   ↓
5. Client stores token (localStorage)
   ↓
6. Client sends token with every request (in Authorization header)
   ↓
7. Server verifies token on protected routes
   ↓
8. If valid → allow access, if invalid → deny access
```

---

## 📁 File Structure

```
Fullstack_Express_Scrimba/
├── controllers/
│   └── authController.js      # Register, login, getProfile functions
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── routes/
│   └── auth.js                # Auth routes (POST /register, POST /login, GET /profile)
├── db/
│   └── db.js                  # Database connection
├── createTable.js             # Creates users table
└── server.js                  # Express server with auth routes
```

---

## 🚀 Setup Instructions

### Step 1: Update Database
Run this to create the users table:
```bash
node createTable.js
```

### Step 2: Set JWT Secret
Add this to your `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**⚠️ Important**: 
- Use a long, random string in production
- Never commit `.env` to git (it's already in `.gitignore`)
- Generate a secure secret: `openssl rand -base64 32`

### Step 3: Restart Server
```bash
npm start
```

---

## 📚 Understanding Each Component

### 1. **authController.js** - The Business Logic

#### `register()` Function
```javascript
// What it does:
1. Validates input (email, password required)
2. Checks if user already exists
3. Hashes password with bcrypt (10 rounds)
4. Saves user to database
5. Generates JWT token
6. Returns token to client
```

**Key Concepts:**
- **bcrypt.hash()**: Converts plain password → hashed password
  - Why? If database is hacked, passwords are unreadable
  - 10 rounds = good balance of security vs speed
  
- **jwt.sign()**: Creates the token
  - Payload: `{ userId, email }` (data stored in token)
  - Secret: `process.env.JWT_SECRET` (used to sign/verify)
  - Expires: `7d` (token valid for 7 days)

#### `login()` Function
```javascript
// What it does:
1. Finds user by email
2. Compares password with hashed password in DB
3. If match → generate JWT token
4. Return token to client
```

**Key Concepts:**
- **bcrypt.compare()**: Safely compares plain password with hash
  - Returns `true` if passwords match
  - Returns `false` if they don't

### 2. **authMiddleware.js** - The Gatekeeper

```javascript
// What it does:
1. Extracts token from Authorization header
2. Verifies token signature and expiration
3. If valid → attach user info to req.user
4. If invalid → return 401 Unauthorized
```

**How to use:**
```javascript
// Protect a route:
router.get('/protected', authenticateToken, (req, res) => {
  // req.user is available here!
  res.json({ message: 'You are authenticated!', user: req.user })
})
```

### 3. **Frontend (index.js)** - The Client Side

#### Token Storage
```javascript
localStorage.setItem('token', token)  // Save token
localStorage.getItem('token')          // Get token
localStorage.removeItem('token')       // Remove token (logout)
```

#### Making Authenticated Requests
```javascript
// Automatically adds Authorization header:
fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🧪 Testing the Implementation

### Test 1: Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### Test 2: Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 3: Get Profile (Protected Route)
```bash
# Replace YOUR_TOKEN with the token from register/login
curl http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 4: Try Without Token (Should Fail)
```bash
curl http://localhost:8000/api/auth/profile
# Expected: 401 Unauthorized
```

---

## 🔒 Security Best Practices

### ✅ What We Did Right:
1. **Password Hashing**: Passwords are hashed with bcrypt
2. **JWT Expiration**: Tokens expire after 7 days
3. **Environment Variables**: JWT_SECRET stored in `.env`
4. **Input Validation**: Check for required fields
5. **Error Handling**: Don't leak sensitive info in errors

### ⚠️ For Production, Consider:
1. **HTTPS Only**: Always use HTTPS in production
2. **Stronger JWT Secret**: Use a long, random string
3. **Rate Limiting**: Prevent brute force attacks
4. **Password Requirements**: Enforce strong passwords
5. **Token Refresh**: Implement refresh tokens for better security
6. **CORS Configuration**: Restrict allowed origins

---

## 🐛 Common Issues & Solutions

### Issue 1: "JWT_SECRET is not defined"
**Solution**: Make sure `.env` file exists and has `JWT_SECRET=your-secret`

### Issue 2: "Token expired"
**Solution**: User needs to login again. Token expired after 7 days.

### Issue 3: "Invalid token"
**Solution**: 
- Check if token is being sent correctly
- Verify JWT_SECRET matches between server restarts
- Make sure token format is: `Bearer <token>`

### Issue 4: "User already exists"
**Solution**: Email must be unique. Use a different email or login instead.

---

## 📖 Key Terms Explained

| Term | Explanation |
|------|-------------|
| **JWT** | JSON Web Token - A secure way to transmit information |
| **Token** | A string that proves you're authenticated |
| **Payload** | Data stored inside the JWT (userId, email, etc.) |
| **Secret** | Private key used to sign/verify tokens |
| **Middleware** | Code that runs between request and response |
| **Hash** | One-way encryption (can't reverse it) |
| **bcrypt** | Library for hashing passwords securely |

---

## 🎯 Next Steps (Optional Enhancements)

1. **Password Reset**: Add "forgot password" functionality
2. **Email Verification**: Send verification email on registration
3. **Refresh Tokens**: Implement token refresh mechanism
4. **Role-Based Access**: Add user roles (admin, customer, etc.)
5. **Session Management**: Track active sessions
6. **2FA**: Two-factor authentication

---

## 💡 Questions to Test Your Understanding

1. Why do we hash passwords instead of storing them plain text?
2. What happens if someone steals a JWT token?
3. Why do tokens expire?
4. What's the difference between `jwt.sign()` and `jwt.verify()`?
5. Why do we use middleware instead of checking auth in each route?

---

## 📞 Need Help?

If you're stuck:
1. Check the console for error messages
2. Verify `.env` file has JWT_SECRET
3. Make sure database table was created
4. Check that server is running
5. Verify token is being sent in requests

**Remember**: Authentication is complex, but you've got this! 🚀
