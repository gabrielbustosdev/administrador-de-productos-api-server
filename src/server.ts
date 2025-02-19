import express from "express";
import colors from "colors";
import router from "./router";
import db from "./config/db";

// Conectar a la base de datos
async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.bgBlue.bold('Conexión a la base de datos establecida correctamente'));
    } catch (error) {
        console.error(colors.bgRed.bold('Error al conectar a la base de datos:'), error);
    }
}
connectDB();

const server = express();


server.use('/api/products', router);

export default server;
