import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

// Extender la interfaz Request para incluir el usuario
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                error: 'Token de acceso requerido'
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt') as any;
        
        // Buscar el usuario en la base de datos
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            res.status(401).json({
                error: 'Usuario no encontrado'
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({
            error: 'Token inválido'
        });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                error: 'Autenticación requerida'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Acceso denegado. Permisos insuficientes'
            });
            return;
        }

        next();
    };
};

export const requireAdmin = requireRole(['admin']);
export const requireUser = requireRole(['admin', 'user']); 