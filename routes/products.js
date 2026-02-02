import express from 'express'
import { getGenres, getProductById, getProducts } from '../controllers/productsControllers.js'

export const productsRouter = express.Router()

productsRouter.get('/genres', getGenres)
productsRouter.get('/:id', getProductById)
productsRouter.get('/', getProducts)