import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import Product from '../models/Product.model';

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL!, {
    models: [User, Product], // Registro explícito y profesional
    logging: false,
    modelMatch: (filename, member) => {
        return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    }
});

export default db;
