import request from 'supertest'
import server from '../../server'

describe('Debug Test', () => {
    it('should test basic server response', async () => {
        const response = await request(server).get('/api/products')
        console.log('Response status:', response.status)
        console.log('Response body:', response.body)
        console.log('Response headers:', response.headers)
        
        // Solo verificar que no sea 500
        expect(response.status).not.toBe(500)
    })
}) 