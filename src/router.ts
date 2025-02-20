import { Router } from 'express'
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product'
import { handleInputErrors } from './middleware/index'

const router = Router()

// Routing
router.get('/', getProducts)

router.get('/:id',
    // Validación
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    // Handler
    getProductById
)

router.post('/', 
    // Validación
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    handleInputErrors,
    // Handler
    createProduct
)

router.put('/:id', 
    // Validación
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    // Handler
    updateProduct
)

router.patch('/:id', 
    // Validación
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    // Handler
    updateAvailability
)

router.delete('/:id', 
    // Validación
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    // Handler
    deleteProduct
)

export default router