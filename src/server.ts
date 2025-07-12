import express, { Request, Response } from 'express'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import router from './router'
import authRouter from './router/auth'
import db from './config/db'

// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        //console.log( colors.blue( 'Conexión exitosa a la BD'))
    } catch (error) {
        // console.log(error)
        console.log(colors.red.bold('Hubo un error al conectar a la BD'))
    }
}
connectDB()

// Instancia de express
const server = express()

// Permitir conexiones externas
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como los tests)
        if (!origin) {
            callback(null, true)
            return
        }
        
        // En desarrollo, permitir cualquier origen
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            callback(null, true)
            return
        }
        
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    },
    credentials: true
}
server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

// Rutas de autenticación
server.use('/api/auth', authRouter)

// Rutas de productos
server.use('/api/products', router)

server.use('/public', express.static('public'));

// Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOptions))

export default server