# Configuración de Autenticación JWT

## Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_base_datos

# Configuración del servidor
PORT=4000

# URL del frontend para CORS
FRONTEND_URL=http://localhost:3000

# Clave secreta para JWT (¡CAMBIA ESTA CLAVE EN PRODUCCIÓN!)
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
```

## Endpoints de Autenticación

### 1. Registrar Usuario
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario",
  "role": "user" // opcional, por defecto es "user"
}
```

### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### 3. Obtener Perfil
```
GET /api/auth/profile
Authorization: Bearer <token>
```

## Endpoints Protegidos

Los siguientes endpoints requieren autenticación con token JWT:

### Productos (Solo Admin)
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `PATCH /api/products/:id` - Actualizar disponibilidad
- `DELETE /api/products/:id` - Eliminar producto

### Productos (Públicos)
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID

## Uso del Token

1. Después de hacer login o registro, recibirás un token JWT
2. Incluye el token en el header `Authorization` de las peticiones:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Roles de Usuario

- **admin**: Puede realizar todas las operaciones CRUD en productos
- **user**: Solo puede leer productos (GET)

## Ejemplo de Uso

```bash
# 1. Registrar un usuario admin
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "password": "admin123",
    "name": "Administrador",
    "role": "admin"
  }'

# 2. Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "password": "admin123"
  }'

# 3. Crear un producto (usando el token recibido)
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Producto Ejemplo",
    "price": 100
  }'
``` 