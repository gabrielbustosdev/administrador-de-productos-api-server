import { User } from '../models/User.model';
import db from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
    try {
        // Conectar a la base de datos
        await db.authenticate();
        await db.sync();

        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ where: { role: 'admin' } });
        
        if (existingAdmin) {
            console.log('Ya existe un usuario administrador');
            process.exit(0);
        }

        // Crear usuario administrador
        const adminUser = await User.create({
            email: 'admin@ejemplo.com',
            password: 'admin123',
            name: 'Administrador',
            role: 'admin'
        });

        console.log('Usuario administrador creado exitosamente:');
        console.log(`Email: ${adminUser.email}`);
        console.log(`Nombre: ${adminUser.name}`);
        console.log(`Rol: ${adminUser.role}`);
        console.log('\nCredenciales de acceso:');
        console.log('Email: admin@ejemplo.com');
        console.log('Contraseña: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error al crear usuario administrador:', error);
        process.exit(1);
    }
}

createAdminUser(); 