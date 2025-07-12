import { Router } from 'express'
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product'
import { handleInputErrors } from './middleware/index'
import { authenticateToken, requireAdmin } from './middleware/auth'

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *          id:
 *            type: integer
 *            description: ID único auto-generado del producto
 *            example: 1
 *          name:
 *            type: string
 *            description: Nombre del producto
 *            example: "Laptop Dell XPS 13"
 *            maxLength: 100
 *          price:
 *            type: number
 *            format: float
 *            description: Precio del producto en la moneda local
 *            example: 1299.99
 *            minimum: 0
 *          availability:
 *            type: boolean
 *            description: Estado de disponibilidad del producto
 *            example: true
 *            default: true
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: Fecha de creación del producto
 *            example: "2024-01-15T10:30:00.000Z"
 *          updatedAt:
 *            type: string
 *            format: date-time
 *            description: Fecha de última actualización del producto
 *            example: "2024-01-15T10:30:00.000Z"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error descriptivo
 *           example: "Producto no encontrado"
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: Campo que causó el error
 *               message:
 *                 type: string
 *                 description: Mensaje de error de validación
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     description: Retorna una lista paginada de todos los productos disponibles
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de productos por página
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrar por disponibilidad
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   description: Total de productos
 *                 page:
 *                   type: integer
 *                   description: Página actual
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     description: Retorna un producto específico basado en su ID único
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID único del producto a obtener
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID inválido proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     summary: Crear nuevo producto
 *     tags: [Products]
 *     description: Crea un nuevo producto en la base de datos. Requiere autenticación de administrador.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: "iPhone 15 Pro"
 *                 maxLength: 100
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Precio del producto
 *                 example: 999.99
 *                 minimum: 0
 *               availability:
 *                 type: boolean
 *                 description: Disponibilidad del producto (opcional, por defecto true)
 *                 example: true
 *                 default: true
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permisos insuficientes - Se requiere rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/',
    authenticateToken,
    requireAdmin,
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('availability')
        .optional()
        .isBoolean().withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto completo
 *     tags: [Products]
 *     description: Actualiza todos los campos de un producto específico. Requiere autenticación de administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a actualizar
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - availability
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del producto
 *                 example: "iPhone 15 Pro Max"
 *                 maxLength: 100
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Nuevo precio del producto
 *                 example: 1199.99
 *                 minimum: 0
 *               availability:
 *                 type: boolean
 *                 description: Nueva disponibilidad del producto
 *                 example: true
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID inválido o datos de entrada incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permisos insuficientes - Se requiere rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id',
    authenticateToken,
    requireAdmin,
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
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
 *     summary: Cambiar disponibilidad del producto
 *     tags: [Products]
 *     description: Actualiza únicamente el estado de disponibilidad de un producto. Requiere autenticación de administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a actualizar
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID inválido proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permisos insuficientes - Se requiere rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     summary: Eliminar producto
 *     tags: [Products]
 *     description: Elimina permanentemente un producto de la base de datos. Requiere autenticación de administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto Eliminado"
 *       400:
 *         description: ID inválido proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permisos insuficientes - Se requiere rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id',
    authenticateToken,
    requireAdmin,
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct
)

export default router