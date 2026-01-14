// ===== Menu Toggle =====
const toggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('.header-menu')

toggle.addEventListener('click', () => {
  menu.classList.toggle('open')
})

// ===== Login Modal =====
const loginLink = document.getElementById('login-link')
const loginModal = document.getElementById('login-modal')
const closeLoginBtn = document.getElementById('close-login')
const loginForm = document.getElementById('login-form')

// Open login modal
loginLink.addEventListener('click', (e) => {
  e.preventDefault()
  loginModal.classList.add('active')
  // Focus on email input when modal opens
  setTimeout(() => {
    document.getElementById('email').focus()
  }, 100)
})

// Close login modal
closeLoginBtn.addEventListener('click', () => {
  loginModal.classList.remove('active')
})

// Close modal when clicking outside
loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove('active')
  }
})

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && loginModal.classList.contains('active')) {
    loginModal.classList.remove('active')
  }
})

// ===== Authentication Functions =====

/**
 * Store JWT token in localStorage
 * localStorage persists even after browser closes
 */
function setToken(token) {
  localStorage.setItem('token', token)
}

/**
 * Get JWT token from localStorage
 */
function getToken() {
  return localStorage.getItem('token')
}

/**
 * Remove token (logout)
 */
function removeToken() {
  localStorage.removeItem('token')
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
  return !!getToken()
}

/**
 * Make authenticated API request
 * Automatically adds Authorization header with JWT token
 */
async function authenticatedFetch(url, options = {}) {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  // Add JWT token to Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return fetch(url, {
    ...options,
    headers
  })
}

/**
 * Login user with email and password
 */
async function loginUser(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      // Login failed
      throw new Error(data.error || 'Login failed')
    }

    // Login successful - store token
    setToken(data.token)
    
    // Update UI to show user is logged in
    updateLoginUI(data.user)
    
    return data

  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Register new user
 */
async function registerUser(email, password, name) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    // Registration successful - store token
    setToken(data.token)
    
    // Update UI
    updateLoginUI(data.user)
    
    return data

  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

/**
 * Logout user
 */
function logoutUser() {
  removeToken()
  updateLoginUI(null)
}

/**
 * Update UI based on login state
 */
function updateLoginUI(user) {
  const loginLink = document.getElementById('login-link')
  
  if (user) {
    // User is logged in
    loginLink.textContent = user.name || user.email
    loginLink.href = '#'
    loginLink.onclick = (e) => {
      e.preventDefault()
      logoutUser()
      alert('Logged out successfully!')
    }
  } else {
    // User is not logged in
    loginLink.textContent = 'Login'
    loginLink.href = '#'
    loginLink.onclick = (e) => {
      e.preventDefault()
      loginModal.classList.add('active')
    }
  }
}

// ===== Toggle between Login and Register =====
let isRegisterMode = false

const toggleAuthMode = document.getElementById('toggle-auth-mode')
const toggleText = document.getElementById('toggle-text')
const submitBtn = document.getElementById('submit-btn')
const nameGroup = document.getElementById('name-group')
const loginOptions = document.getElementById('login-options')
const modalHeader = document.querySelector('.modal-header')
const modalTitle = modalHeader.querySelector('h2')
const modalSubtitle = modalHeader.querySelector('p')

toggleAuthMode.addEventListener('click', (e) => {
  e.preventDefault()
  isRegisterMode = !isRegisterMode
  
  if (isRegisterMode) {
    // Switch to Register mode
    modalTitle.textContent = 'Create Account'
    modalSubtitle.textContent = 'Sign up to start shopping'
    submitBtn.textContent = 'Sign Up'
    toggleText.textContent = 'Already have an account?'
    toggleAuthMode.textContent = 'Sign in'
    nameGroup.style.display = 'block'
    loginOptions.style.display = 'none'
    document.getElementById('name').required = false
  } else {
    // Switch to Login mode
    modalTitle.textContent = 'Welcome to Spiral Sounds'
    modalSubtitle.textContent = 'Sign in to your account'
    submitBtn.textContent = 'Sign In'
    toggleText.textContent = "Don't have an account?"
    toggleAuthMode.textContent = 'Sign up'
    nameGroup.style.display = 'none'
    loginOptions.style.display = 'flex'
    document.getElementById('name').required = false
  }
})

// Handle login/register form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const name = document.getElementById('name').value
  const rememberMe = document.getElementById('remember-me').checked
  
  const originalText = submitBtn.textContent
  
  try {
    // Show loading state
    submitBtn.textContent = isRegisterMode ? 'Creating account...' : 'Signing in...'
    submitBtn.disabled = true
    
    let result
    if (isRegisterMode) {
      // Register new user
      result = await registerUser(email, password, name)
      alert(`Welcome to Spiral Sounds, ${result.user.name || result.user.email}!`)
    } else {
      // Login existing user
      result = await loginUser(email, password)
      alert(`Welcome back, ${result.user.name || result.user.email}!`)
    }
    
    // Success! Clear form and close modal
    loginForm.reset()
    loginModal.classList.remove('active')
    isRegisterMode = false // Reset to login mode
    
    // Reset UI to login mode
    modalTitle.textContent = 'Welcome to Spiral Sounds'
    modalSubtitle.textContent = 'Sign in to your account'
    submitBtn.textContent = 'Sign In'
    toggleText.textContent = "Don't have an account?"
    toggleAuthMode.textContent = 'Sign up'
    nameGroup.style.display = 'none'
    loginOptions.style.display = 'flex'
    
  } catch (error) {
    // Show error to user
    alert(`${isRegisterMode ? 'Registration' : 'Login'} failed: ${error.message}`)
  } finally {
    // Reset button
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
})

// Check if user is already logged in on page load
if (isLoggedIn()) {
  // Try to get user profile to verify token is still valid
  authenticatedFetch('/api/auth/profile')
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        updateLoginUI(data.user)
      }
    })
    .catch(() => {
      // Token is invalid, remove it
      removeToken()
    })
}

// ===== Product Fetching =====

async function getProducts(filters = {}) {
  const queryParams = new URLSearchParams(filters)
  const res = await fetch(`/api/products?${queryParams}`)
  return await res.json()
}

// ===== Product Rendering =====

function renderProducts(products) {
  const albumsContainer = document.getElementById('products-container')
  const productCountEl = document.getElementById('product-count')
  
  // Update product count
  if (productCountEl) {
    if (products.length === 0) {
      productCountEl.textContent = 'No products found'
      productCountEl.style.opacity = '0.7'
    } else {
      productCountEl.textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'} found`
      productCountEl.style.opacity = '1'
    }
  }
  
  if (products.length === 0) {
    albumsContainer.innerHTML = `
      <div class="no-products-message">
        <p>No products match your search criteria.</p>
        <p>Try adjusting your filters or search terms.</p>
      </div>
    `
    return
  }
  
  const cards = products.map((album) => {
    return `
      <div class="product-card">
        <img src="./images/${album.image}" alt="${album.title}">
        <h2>${album.title}</h2>
        <h3>${album.artist}</h3>
        <p>$${album.price}</p>
        <button class="add-btn">Add to Cart</button>
        <p class="genre-label">${album.genre}</p>
      </div>
    `
  }).join('')

  albumsContainer.innerHTML = cards
}

// ===== Initial Load =====

/**
 * Fetches and displays all products on initial page load.
 */
async function init() {
  populateGenreSelect()
  const products = await getProducts()
  renderProducts(products)
}

init()

// ===== Genre Dropdown =====

/**
 * Populates the genre dropdown with available genres from the API.
 */
async function populateGenreSelect() {
  const res = await fetch('/api/products/genres')
  const genres = await res.json() // expects an array of genres as strings: ['rock', 'pop', ...]
  const select = document.getElementById('genre-select')

  genres.forEach(genre => {
    const option = document.createElement('option')
    option.value = genre
    option.textContent = genre
    select.appendChild(option)
  })
}

// ===== Filter Handling =====

/**
 * Fetches and renders products based on the current search input.
 */
async function applySearchFilter() {
  const search = document.getElementById('search-input').value.trim()
  const filters = {}
  if (search) filters.search = search

  const products = await getProducts(filters)
  renderProducts(products)
}

// ===== Search Clear Button =====
const searchInput = document.getElementById('search-input')
const searchClear = document.getElementById('search-clear')

// Show/hide clear button based on input value
function toggleClearButton() {
  if (searchInput.value.trim()) {
    searchClear.style.display = 'block'
  } else {
    searchClear.style.display = 'none'
  }
}

// Clear search input
searchClear.addEventListener('click', () => {
  searchInput.value = ''
  searchClear.style.display = 'none'
  applySearchFilter()
  searchInput.focus()
})

// ===== Event Listeners =====

searchInput.addEventListener('input', (e) => {
  e.preventDefault()
  toggleClearButton()
  applySearchFilter()
})

// prevent 'enter' from submitting
searchInput.addEventListener('submit', (e) => {
  e.preventDefault()
})

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  applySearchFilter() // your function to run the search
})

document.getElementById('genre-select').addEventListener('change', async (e) => {
  const genre = e.target.value
  const products = await getProducts(genre ? { genre } : {})
  renderProducts(products)
})

// ===== Keyboard Shortcuts =====
// Press "/" to focus search input (when not typing in an input)
document.addEventListener('keydown', (e) => {
  // Only trigger if not already typing in an input/textarea
  if (e.key === '/' && 
      document.activeElement.tagName !== 'INPUT' && 
      document.activeElement.tagName !== 'TEXTAREA' &&
      !loginModal.classList.contains('active')) {
    e.preventDefault()
    const searchInput = document.getElementById('search-input')
    if (searchInput) {
      searchInput.focus()
    }
  }
})
