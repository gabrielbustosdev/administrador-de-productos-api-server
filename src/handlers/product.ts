import { Request, Response } from 'express'
import Product from '../models/Product.model'

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.findAll({
            order: [
                ['id', 'DESC']
            ]
        })
        res.json({ data: products })
    } catch (error) {
        console.error('Error al obtener productos:', error)
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: 'Producto No Encontrado'
            })
            return
        }

        res.json({ data: product })
    } catch (error) {
        console.error('Error al obtener producto por ID:', error)
        res.status(500).json({
            error: 'Error interno del servidor'
        })
    }
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({ data: product })
    } catch (error) {
        console.error('Error al crear producto:', error)
        res.status(500).json({
            error: 'Error interno del servidor'
        })
    }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: 'Producto No Encontrado'
            })
            return
        }

        // Actualizar
        await product.update(req.body)
        await product.save()
        res.json({ data: product })
    } catch (error) {
        console.error('Error al actualizar producto:', error)
        res.status(500).json({
            error: 'Error interno del servidor'
        })
    }
}

export const updateAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: 'Producto No Encontrado'
            })
            return
        }

        // Actualizar
        product.availability = !product.dataValues.availability
        await product.save()
        res.json({ data: product })
    } catch (error) {
        console.error('Error al actualizar disponibilidad:', error)
        res.status(500).json({
            error: 'Error interno del servidor'
        })
    }
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: 'Producto No Encontrado'
            })
            return
        }

        await product.destroy()
        res.json({ data: 'Producto Eliminado' })
    } catch (error) {
        console.error('Error al eliminar producto:', error)
        res.status(500).json({
            error: 'Error interno del servidor'
        })
    }
}