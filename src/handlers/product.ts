import { Request, Response } from 'express'
import Product from '../models/Product.model'

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    const products = await Product.findAll({
        order: [
            ['price', 'DESC']
        ]
    })
    res.json({ data: products })
    return
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        res.status(404).json({
            error: 'Producto No Encontrado'
        })
        return
    }

    res.json({ data: product })
    return
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const product = await Product.create(req.body)
    res.status(201).json({ data: product })
    return
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
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
    return
}

export const updateAvailability = async (req: Request, res: Response): Promise<void> => {
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
    return
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
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
    return
}