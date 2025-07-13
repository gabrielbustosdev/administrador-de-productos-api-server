# 🛍️ API de Administración de Productos

Una API REST completa desarrollada en **Node.js** con **TypeScript** para la gestión de productos. Esta aplicación demuestra habilidades en desarrollo backend, bases de datos, testing y documentación de APIs.

## ✨ Características

- **🔧 Stack Tecnológico Moderno**: Node.js, TypeScript, Express.js
- **🗄️ Base de Datos**: PostgreSQL con Sequelize ORM
- **📚 Documentación Automática**: Swagger/OpenAPI integrado con documentación profesional
- **🧪 Testing Completo**: Jest con supertest para testing de endpoints
- **🛡️ Validación de Datos**: Express-validator para validación robusta
- **🔒 Seguridad**: CORS configurado, validación de entrada, Autenticación JWT
- **📊 Logging**: Morgan para logging de requests
- **🎨 UI Personalizada**: Documentación con logo y favicon personalizados

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **TypeScript** - Tipado estático para mayor robustez
- **Express.js** - Framework web para Node.js
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional

### Testing & Desarrollo
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs HTTP
- **Nodemon** - Auto-reload en desarrollo
- **ts-node** - Ejecución directa de TypeScript

### Documentación & Herramientas
- **Swagger/OpenAPI** - Documentación automática de API
- **Morgan** - Logging de requests HTTP
- **Express-validator** - Validación de datos de entrada
- **CORS** - Configuración de políticas de origen cruzado

## 📋 Endpoints Disponibles

### 🔐 Autenticación
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario | Público |
| `POST` | `/api/auth/login` | Iniciar sesión | Público |
| `GET` | `/api/auth/profile` | Obtener perfil del usuario | JWT |

### 🛍️ Productos
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Obtener todos los productos | Público |
| `GET` | `/api/products/:id` | Obtener producto por ID | Público |
| `POST` | `/api/products` | Crear nuevo producto | Admin |
| `PUT` | `/api/products/:id` | Actualizar producto completo | Admin |
| `PATCH` | `/api/products/:id` | Cambiar disponibilidad del producto | Admin |
| `DELETE` | `/api/products/:id` | Eliminar producto | Admin |

## 🗄️ Modelo de Datos

### Producto
```typescript
interface Product {
  id: number;           // ID auto-generado
  name: string;         // Nombre del producto (máx. 100 caracteres)
  price: number;        // Precio del producto (mínimo 0)
  availability: boolean; // Disponibilidad (default: true)
  createdAt: Date;      // Fecha de creación
  updatedAt: Date;      // Fecha de última actualización
}
```

### Usuario
```typescript
interface User {
  id: number;           // ID auto-generado
  email: string;        // Email único del usuario
  name: string;         // Nombre completo (2-50 caracteres)
  role: 'admin' | 'user'; // Rol del usuario
  createdAt: Date;      // Fecha de creación
  updatedAt: Date;      // Fecha de última actualización
}
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/gabrielbustosdev/administrador-de-productos-api-server.git
cd administrador-de-productos-api-server
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
```

### 4. Crear usuario administrador (opcional)
```bash
npm run create-admin
```

### 5. Ejecutar el proyecto

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm run build
npm start
```

## 🧪 Testing

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests con coverage
```bash
npm run test:coverage
```

## 📚 Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de la API en:

```
http://localhost:4000/docs
```

### 🌐 Usar la Documentación desde el Navegador

La documentación de Swagger está **completamente configurada** para funcionar desde el navegador. Puedes:

#### ✅ **Hacer Consultas Directas**
- **Probar endpoints**: Usa el botón "Try it out" en cada endpoint
- **Enviar requests**: Completa los parámetros y ejecuta las consultas
- **Ver responses**: Obtén respuestas reales de la API
- **Autenticación**: Configura tokens JWT para endpoints protegidos

#### ✅ **Configuración Automática**
- **CORS habilitado**: Requests desde navegador permitidos
- **Headers automáticos**: Content-Type y Authorization configurados
- **Logs de debugging**: Console logs para monitorear requests
- **Persistencia de tokens**: Los tokens se mantienen entre sesiones

#### ✅ **Características de la Documentación**

- **📖 Documentación Completa**: Todos los endpoints con descripciones detalladas
- **🔐 Autenticación JWT**: Configuración automática de tokens
- **📝 Esquemas de Datos**: Modelos completos con validaciones
- **✅ Ejemplos de Uso**: Requests y responses de ejemplo
- **🎨 Interfaz Personalizada**: Logo y favicon del proyecto
- **🔍 Filtros y Búsqueda**: Navegación mejorada
- **📱 Responsive**: Compatible con dispositivos móviles

### Cómo Usar la Documentación

1. **Acceder a la documentación**: Ve a `http://localhost:4000/docs`
2. **Autenticarse**: Usa el botón "Authorize" para configurar tu token JWT
3. **Explorar endpoints**: Navega por las diferentes secciones (Auth, Products)
4. **Probar endpoints**: Usa la interfaz interactiva para hacer requests
5. **Ver esquemas**: Consulta los modelos de datos en la sección "Schemas"

### Ejemplo de Uso con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"password123","name":"Juan Pérez"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"password123"}'

# Crear producto (requiere token de admin)
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{"name":"Laptop Dell XPS 13","price":1299.99}'
```

### 🔧 Configuración Técnica

La API está configurada con:

- **CORS habilitado** para `localhost:4000`, `localhost:3000`, y otros orígenes de desarrollo
- **Headers automáticos** para requests JSON
- **Preflight requests** manejados correctamente
- **Logs de debugging** para monitorear requests desde navegador
- **Persistencia de autorización** en Swagger UI

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecutar en modo desarrollo con nodemon |
| `npm run build` | Compilar TypeScript a JavaScript |
| `npm test` | Ejecutar tests con Jest |
| `npm run test:coverage` | Ejecutar tests con reporte de cobertura |
| `npm run clear` | Limpiar datos de prueba |
| `npm run create-admin` | Crear usuario administrador inicial |

## 🏗️ Arquitectura del Proyecto

```
src/
├── config/           # Configuraciones (DB, Swagger)
├── handlers/         # Controladores de endpoints
├── middleware/       # Middleware personalizado
├── models/          # Modelos de Sequelize
├── router/          # Definición de rutas
├── __tests__/       # Tests del servidor
└── index.ts         # Punto de entrada
```

## 🎯 Funcionalidades Destacadas

### ✅ Validación Robusta
- Validación de tipos de datos
- Validación de rangos (precio > 0)
- Mensajes de error personalizados
- Middleware de manejo de errores

### ✅ Testing Completo
- Tests unitarios para cada endpoint
- Validación de responses HTTP
- Testing de casos de error
- Cobertura de código

### ✅ Documentación Profesional
- Swagger UI integrado con configuración avanzada
- Documentación de esquemas completos
- Ejemplos de uso detallados
- Interfaz personalizada y responsive
- Filtros y búsqueda mejorados
- **Consultas desde navegador habilitadas**

### ✅ Seguridad
- CORS configurado
- Validación de entrada
- Autenticación JWT
- Roles de usuario (admin/user)
- Manejo de errores
- Logging de requests

## 🔐 Autenticación JWT

La API incluye un sistema completo de autenticación con JWT:

### Roles de Usuario
- **Admin**: Puede realizar todas las operaciones CRUD en productos
- **User**: Solo puede leer productos (GET)

### Flujo de Autenticación
1. **Registro**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Usar Token**: Incluir en header `Authorization: Bearer <token>`

### Ejemplo de Token JWT
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "email": "admin@ejemplo.com",
    "name": "Administrador",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token requerido |
| 403 | Forbidden - Permisos insuficientes |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Recurso ya existe |
| 500 | Internal Server Error - Error del servidor |

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- 📧 Email: gabrielbustosdev@gmail.com
- 📖 Documentación: http://localhost:4000/docs
- 🐛 Issues: [GitHub Issues](https://github.com/gabrielbustosdev/administrador-de-productos-api-server/issues) 
