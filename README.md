# Spiral Sounds

An online classic vinyl store built with Express.js and SQLite. This project was created as part of learning fullstack Express development from Scrimba.

## 🎵 Features

- Browse a collection of classic vinyl records
- Filter products by genre
- Search products by title, artist, or genre
- Responsive design with a modern UI
- RESTful API for product management

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Package Manager**: npm

## 📁 Project Structure

```
Fullstack_Express_Scrimba/
├── controllers/          # Request handlers
│   └── productsControllers.js
├── db/                   # Database connection
│   └── db.js
├── routes/               # API routes
│   └── products.js
├── public/               # Frontend files
│   ├── images/          # Product images
│   ├── index.html
│   ├── index.css
│   └── index.js
├── createTable.js        # Database table creation script
├── seedTable.js          # Database seeding script
├── data.js               # Sample product data
├── server.js             # Express server entry point
└── database.db           # SQLite database file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Create the database table:
```bash
node createTable.js
```

4. Seed the database with sample data:
```bash
node seedTable.js
```

5. Start the server:
```bash
npm start
```

6. Open your browser and navigate to:
```
http://localhost:8000
```

## 📡 API Endpoints

### Get All Products
```
GET /api/products
```

Query Parameters:
- `genre` - Filter by genre (e.g., `/api/products?genre=rock`)
- `search` - Search in title, artist, or genre (e.g., `/api/products?search=beatles`)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Album Title",
    "artist": "Artist Name",
    "price": 29.99,
    "image": "vinyl1.png",
    "year": 1970,
    "genre": "Rock",
    "stock": 10
  }
]
```

### Get All Genres
```
GET /api/products/genres
```

**Response:**
```json
["Rock", "Pop", "Jazz", "Classical"]
```

## 🎓 Learning Context

This project was built while learning fullstack Express.js development from Scrimba. It demonstrates:

- Setting up an Express server
- Creating RESTful API routes
- Working with SQLite databases
- Building a frontend that consumes API endpoints
- Implementing search and filter functionality
- Structuring a fullstack application with MVC-like patterns

## 📝 Scripts

- `npm start` - Start the Express server on port 8000

## 🗄️ Database Schema

The `products` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| title | TEXT | Album title |
| artist | TEXT | Artist name |
| price | REAL | Product price |
| image | TEXT | Image filename |
| year | INTEGER | Release year |
| genre | TEXT | Music genre |
| stock | INTEGER | Available stock |

## 🎨 Frontend Features

- Responsive navigation menu
- Real-time search functionality
- Genre-based filtering
- Product cards displaying album information
- Modern, clean UI design

## 📄 License

ISC

## 👤 Author

Tom Chant

---

Built with ❤️ while learning from Scrimba

