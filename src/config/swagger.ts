import swaggerJSDoc from 'swagger-jsdoc'
import { SwaggerUiOptions } from 'swagger-ui-express'

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API for products',
            version: '1.0.0',
            description: 'API Docs for products'
        }
    },
    apis: ['./src/router.ts']
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
    `,
    customSiteTitle: 'REST API Documentation - Product Management Software',
    customfavIcon: '/public/favicon.png',
}

export default swaggerSpec
export { swaggerUiOptions }
