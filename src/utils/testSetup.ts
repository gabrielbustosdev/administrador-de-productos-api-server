import { User } from '../models/User.model';
import db from '../config/db';
import jwt from 'jsonwebtoken';

export const setupTestDatabase = async () => {
    try {
        // Conectar a la base de datos y limpiar todo
        await db.authenticate();
        await db.sync({ force: true }); // Esto recreará las tablas

        // Crear un usuario admin real (deja que el hook de encriptación actúe)
        const admin = await User.create({
            email: 'admin@demo.com',
            password: 'password123',
            name: 'Admin Demo',
            role: 'admin'
        });

        // Crear un token válido para ese usuario
        const adminToken = jwt.sign(
            { userId: admin.id },
            process.env.JWT_SECRET || 'tu_secreto_jwt',
            { expiresIn: '1h' }
        );

        return { admin, adminToken };
    } catch (error) {
        console.error('Error setting up test database:', error);
        throw error;
    }
};

export const cleanupTestDatabase = async () => {
    try {
        await db.close();
        console.log('Test database cleanup completed');
    } catch (error) {
        console.error('Error cleaning up test database:', error);
    }
}; 