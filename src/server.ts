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

// Configuración de CORS mejorada para Swagger UI
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como los tests y Swagger UI)
        if (!origin) {
            callback(null, true)
            return
        }
        
        // En desarrollo, permitir cualquier origen
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            callback(null, true)
            return
        }
        
        // Orígenes permitidos
        const allowedOrigins = [
            'http://localhost:4000',
            'http://localhost:3000',
            'http://127.0.0.1:4000',
            'http://127.0.0.1:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean) // Remover valores undefined
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            console.log(`Origen bloqueado por CORS: ${origin}`)
            callback(new Error('Error de CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
    ],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    maxAge: 86400 // Cache preflight por 24 horas
}

server.use(cors(corsOptions))

// Middleware para manejar preflight requests
server.options('*', cors(corsOptions))

// Middleware para Swagger UI - permitir requests desde navegador
server.use((req: Request, res: Response, next) => {
    // Log de requests para debugging
    if (req.path.startsWith('/api/')) {
        console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`)
    }
    
    // Asegurar que Content-Type esté presente para requests JSON
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (!req.headers['content-type']) {
            req.headers['content-type'] = 'application/json'
        }
    }
    
    next()
})

// Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

// Endpoint para servir la especificación de Swagger en JSON
server.get('/docs/swagger.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(swaggerSpec)
})

// Rutas de autenticación
server.use('/api/auth', authRouter)

// Rutas de productos
server.use('/api/products', router)

server.use('/public', express.static('public'));

// Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOptions))

export default server