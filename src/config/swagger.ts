import swaggerJSDoc from 'swagger-jsdoc'
import { SwaggerUiOptions } from 'swagger-ui-express'

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Administración de Productos',
            version: '1.0.0',
            description: 'API REST completa para la gestión de productos con sistema de autenticación JWT',
            contact: {
                name: 'Soporte API',
                email: 'soporte@api.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Servidor de desarrollo'
            },
            {
                url: 'https://api.tudominio.com',
                description: 'Servidor de producción'
            }
        ],
        tags: [
            {
                name: 'Auth',
                description: 'Endpoints de autenticación y gestión de usuarios'
            },
            {
                name: 'Products',
                description: 'Endpoints para la gestión de productos'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtenido al hacer login'
                }
            }
        }
    },
    apis: [
        './src/router.ts',
        './src/router/auth.ts'
    ]
}
const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions: SwaggerUiOptions = {
    customCss:
        `
    .topbar-wrapper .link {
        content: url(/public/logo.svg);
        height: 40px;
        width: 60px;
        margin-right: auto;
        display: inline-block;
    }
    .swagger-ui .topbar {
        background-color: #fffffe;
    }
    .swagger-ui .try-out__btn {
        background-color: #4990e2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
    }
    .swagger-ui .try-out__btn:hover {
        background-color: #357abd;
    }
    .swagger-ui .execute-wrapper {
        margin-top: 10px;
    }
    `,
    customSiteTitle: 'API de Administración de Productos - Documentación',
    customfavIcon: '/public/favicon.png',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        deepLinking: true,
        tryItOutEnabled: true,
        requestInterceptor: (request: any) => {
            // Asegurar que las requests tengan los headers correctos
            request.headers = request.headers || {}
            request.headers['Content-Type'] = 'application/json'
            
            // Log para debugging
            console.log('Swagger Request:', request.method, request.url)
            
            return request
        },
        responseInterceptor: (response: any) => {
            // Log de responses para debugging
            console.log('Swagger Response:', response.status, response.url)
            return response
        }
    },
    explorer: true
}

export default swaggerSpec
export { swaggerUiOptions }
