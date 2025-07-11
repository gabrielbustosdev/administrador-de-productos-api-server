# 🛍️ API de Administración de Productos

Una API REST completa desarrollada en **Node.js** con **TypeScript** para la gestión de productos. Esta aplicación demuestra habilidades en desarrollo backend, bases de datos, testing y documentación de APIs.

## ✨ Características

- **🔧 Stack Tecnológico Moderno**: Node.js, TypeScript, Express.js
- **🗄️ Base de Datos**: PostgreSQL con Sequelize ORM
- **📚 Documentación Automática**: Swagger/OpenAPI integrado
- **🧪 Testing Completo**: Jest con supertest para testing de endpoints
- **🛡️ Validación de Datos**: Express-validator para validación robusta
- **🔒 Seguridad**: CORS configurado, validación de entrada
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

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/products` | Obtener todos los productos |
| `GET` | `/api/products/:id` | Obtener producto por ID |
| `POST` | `/api/products` | Crear nuevo producto |
| `PUT` | `/api/products/:id` | Actualizar producto completo |
| `PATCH` | `/api/products/:id` | Cambiar disponibilidad del producto |
| `DELETE` | `/api/products/:id` | Eliminar producto |

## 🗄️ Modelo de Datos

```typescript
interface Product {
  id: number;           // ID auto-generado
  name: string;         // Nombre del producto (máx. 100 caracteres)
  price: number;        // Precio del producto
  availability: boolean; // Disponibilidad (default: true)
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
```

### 4. Ejecutar el proyecto

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

La documentación incluye:
- Todos los endpoints disponibles
- Esquemas de datos
- Ejemplos de requests y responses
- Interfaz personalizada con logo del proyecto

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecutar en modo desarrollo con nodemon |
| `npm run build` | Compilar TypeScript a JavaScript |
| `npm test` | Ejecutar tests con Jest |
| `npm run test:coverage` | Ejecutar tests con reporte de cobertura |
| `npm run clear` | Limpiar datos de prueba |

## 🏗️ Arquitectura del Proyecto

```
src/
├── config/           # Configuraciones (DB, Swagger)
├── handlers/         # Controladores de endpoints
├── middleware/       # Middleware personalizado
├── models/          # Modelos de Sequelize
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

### ✅ Documentación Automática
- Swagger UI integrado
- Documentación de esquemas
- Ejemplos de uso
- Interfaz personalizada

### ✅ Seguridad
- CORS configurado
- Validación de entrada
- Manejo de errores
- Logging de requests


## 👨‍💻 Autor

**Gabriel Bustos**
- GitHub: [@gabrielbustosdev](https://github.com/gabrielbustosdev)
- LinkedIn: [Gabriel Bustos](https://www.linkedin.com/in/gabrielbustosdev)

---

⭐ Si este proyecto te resulta útil, ¡no olvides darle una estrella! 