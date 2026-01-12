import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function createTable() {

      const db = await open({
            filename: path.join('database.db'),
            driver: sqlite3.Database
      })

      await db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                  id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  title TEXT NOT NULL, 
                  artist TEXT NOT NULL,
                  price REAL NOT NULL,
                  image TEXT NOT NULL,
                  year INTEGER,
                  genre TEXT,
                  stock INTEGER 
            )
      
      `)

      // Create users table for authentication
      await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  email TEXT NOT NULL UNIQUE,
                  password TEXT NOT NULL,
                  name TEXT,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
      `)

      await db.close()
      console.log('table created')
}

createTable()