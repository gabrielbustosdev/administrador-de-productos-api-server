import { Router } from 'express';
import { register, login, getProfile, registerValidation, loginValidation } from '../handlers/auth';
import { handleInputErrors } from '../middleware/index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - name
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único auto-generado del usuario
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           description: Email único del usuario
 *           example: "usuario@ejemplo.com"
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *           example: "Juan Pérez"
 *           minLength: 2
 *           maxLength: 50
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: Rol del usuario en el sistema
 *           example: "user"
 *           default: "user"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la cuenta
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: "2024-01-15T10:30:00.000Z"
 *     AuthResponse:
 *       type: object
 *       required:
 *         - message
 *         - user
 *         - token
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo de la operación
 *           example: "Usuario registrado exitosamente"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: Token JWT para autenticación
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNTQ5NzIwMCwiZXhwIjoxNzA1NTgzNjAwfQ.example"
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email único del usuario
 *           example: "nuevo@ejemplo.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario (mínimo 6 caracteres)
 *           example: "password123"
 *           minLength: 6
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *           example: "María García"
 *           minLength: 2
 *           maxLength: 50
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: Rol del usuario (opcional, por defecto 'user')
 *           example: "user"
 *           default: "user"
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: "usuario@ejemplo.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "password123"
 *     ProfileResponse:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error descriptivo
 *           example: "Credenciales inválidas"
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
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     description: Crea una nueva cuenta de usuario en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Datos de entrada inválidos o email ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email ya está registrado
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
router.post('/register', registerValidation, handleInputErrors, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     description: Autentica al usuario y retorna un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Credenciales inválidas
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
router.post('/login', loginValidation, handleInputErrors, login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags: [Auth]
 *     description: Obtiene la información del perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Token de autenticación requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Token inválido o expirado
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
router.get('/profile', authenticateToken, getProfile);

export default router; 