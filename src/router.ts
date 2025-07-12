import { Router } from 'express'
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product'
import { handleInputErrors } from './middleware/index'
import { authenticateToken, requireAdmin, requireUser } from './middleware/auth'

const router = Router()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *          id:
 *            type: integer
 *            description: The auto-generated ID of the product
 *            example: 1
 *          name:
 *            type: string
 *            description: The name of the product
 *            example: "Product 1"   
 *          price:
 *            type: number
 *            description: The price of the product
 *            example: 100
 *          availability:
 *            type: boolean
 *            description: The availability of the product
 *            example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Return a list of products
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: 
 *       - Products
 *     description: Return a product based on its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve 
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad Request - Invalid ID provided
 */
router.get('/:id',
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: 
 *       - Products
 *     description: Returns a new record in the database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Product 1"
 *                 description: The name of the product
 *               price:
 *                 type: number
 *                 example: 100
 *                 description: The price of the product
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request - Invalid request body
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Invalid token or insufficient permissions
 */
router.post('/',
    authenticateToken,
    requireAdmin,
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: 
 *       - Products
 *     description: Update a product based on its unique ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Product 1"
 *                 description: The name of the product
 *               price:
 *                 type: number
 *                 example: 100
 *                 description: The price of the product
 *               availability:
 *                 type: boolean
 *                 example: true
 *                 description: The availability of the product
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request - Invalid ID or invalid input data
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Invalid token or insufficient permissions
 *       404:
 *         description: Product not found
 */
router.put('/:id',
    authenticateToken,
    requireAdmin,
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
    updateProduct
)

/**
 * @swagger 
 * /api/products/{id}:
 *   patch:
 *     summary: Update the availability of a product by ID
 *     tags: 
 *       - Products
 *     description: Update the availability of a product based on its unique ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to update
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request - Invalid ID 
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Invalid token or insufficient permissions
 *       404:
 *         description: Product not found
 */
router.patch('/:id',
    authenticateToken,
    requireAdmin,
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: 
 *       - Products
 *     description: Delete a product based on its unique ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               value: "Producto Eliminado"
 *       400:
 *         description: Bad Request - Invalid ID
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Invalid token or insufficient permissions
 *       404:   
 *         description: Product not found
 */
router.delete('/:id',
    authenticateToken,
    requireAdmin,
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct
)

export default router