import { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

// Generar token JWT
const generateToken = (userId: number): string => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'tu_secreto_jwt',
        { expiresIn: '24h' }
    );
};

// Registrar nuevo usuario
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, role = 'user' } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({
                error: 'El email ya está registrado'
            });
            return;
        }

        // Crear nuevo usuario
        const user = await User.create({
            email,
            password,
            name,
            role
        });

        // Generar token
        const token = generateToken(user.id);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Login de usuario
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({
                error: 'Credenciales inválidas'
            });
            return;
        }

        // Verificar contraseña
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            res.status(401).json({
                error: 'Credenciales inválidas'
            });
            return;
        }

        // Generar token
        const token = generateToken(user.id);

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener perfil del usuario actual
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Validaciones para registro
export const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Email no válido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('role')
        .optional()
        .isIn(['admin', 'user'])
        .withMessage('Rol no válido')
];

// Validaciones para login
export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Email no válido')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
]; 