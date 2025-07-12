import request from 'supertest'
import server from '../../server'
import jwt from 'jsonwebtoken'
import { setupTestDatabase, cleanupTestDatabase } from '../../utils/testSetup'

let adminToken: string

beforeAll(async () => {
    const setup = await setupTestDatabase()
    adminToken = setup.adminToken
})

afterAll(async () => {
    await cleanupTestDatabase()
})

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const response = await request(server)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Monitor Curvo',
                price: 0
            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Monitor Curvo',
                price: "Hola"
            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it('should create a new product', async () => {
        const response = await request(server)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name : "Mouse - Testing",
                price: 50
            })
    
        expect(response.status).toEqual(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('AUTH /api/products', () => {
    it('should return 401 if no token is provided', async () => {
        const response = await request(server)
            .post('/api/products')
            .send({ name: 'Test', price: 10 })
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
    })

    it('should return 403 if token is valid pero el usuario no existe', async () => {
        // Token con userId inexistente
        const fakeToken = jwt.sign({ userId: 9999 }, process.env.JWT_SECRET || 'tu_secreto_jwt', { expiresIn: '1h' })
        const response = await request(server)
            .post('/api/products')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Test', price: 10 })
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
    })

    it('should return 403 if token es de un usuario sin permisos (user)', async () => {
        // Crear usuario sin permisos
        const userToken = jwt.sign({ userId: 2 }, process.env.JWT_SECRET || 'tu_secreto_jwt', { expiresIn: '1h' })
        // Insertar usuario tipo user
        await require('../../models/User.model').User.create({
            id: 2,
            email: 'user@demo.com',
            password: 'password123',
            name: 'User Demo',
            role: 'user'
        })
        const response = await request(server)
            .post('/api/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Test', price: 10 })
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
    })
})

describe('GET /api/products', () => {
    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })
    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto No Encontrado')
    })

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    it('should check a valid ID in the URL', async () => {
        const response = await request(server)
                            .put('/api/products/not-valid-url')
                            .set('Authorization', `Bearer ${adminToken}`)
                            .send({
                                name: "Monitor Curvo",
                                availability: true,
                                price : 300,
                            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('should display validation error messages when updating a product', async() => {
        const response = await request(server)
            .put('/api/products/1')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should validate that the price is greater than 0', async() => {
        const response = await request(server)
                                .put('/api/products/1')
                                .set('Authorization', `Bearer ${adminToken}`)
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price : 0
                                })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should return a 404 response for a non-existent product', async() => {
        const productId = 2000
        const response = await request(server)
                                .put(`/api/products/${productId}`)
                                .set('Authorization', `Bearer ${adminToken}`)
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price : 300
                                })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto No Encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should update an existing product with valid data', async() => {
        const response = await request(server)
                                .put(`/api/products/1`)
                                .set('Authorization', `Bearer ${adminToken}`)
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price : 300
                                })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    }) 
    

})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server)
            .patch(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto No Encontrado')
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request(server)
            .patch('/api/products/1')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const response = await request(server)
            .delete('/api/products/not-valid')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server)
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto No Encontrado')
        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const response = await request(server)
            .delete('/api/products/1')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto Eliminado")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})
