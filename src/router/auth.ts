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
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *           example: 1
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: "John Doe"
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: The role of the user
 *           example: "user"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login exitoso"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "John Doe"
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad Request - Invalid input data
 */
router.post('/register', registerValidation, handleInputErrors, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Bad Request - Invalid input data
 */
router.post('/login', loginValidation, handleInputErrors, login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     description: Get the profile of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Invalid token
 */
router.get('/profile', authenticateToken, getProfile);

export default router; 