# Backend - Sistema de Reportes Cuajimalpa

Backend para el sistema de gestión de reportes de emergencia de Cuajimalpa, desarrollado con Express.js, TypeScript y MongoDB.

## 🚀 Instalación

### Prerrequisitos

- Node.js v16 o superior
- MongoDB v4.4 o superior
- npm o yarn

### Pasos de instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. Iniciar MongoDB:
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

4. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

## 📦 Scripts disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con auto-reload
- `npm run build` - Compila el proyecto TypeScript a JavaScript
- `npm start` - Inicia el servidor en producción
- `npm run seed` - Pobla la base de datos con datos iniciales (próximamente)

## 🔐 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (solo admin)
- `GET /api/auth/profile` - Obtener perfil del usuario
- `GET /api/auth/verify` - Verificar token

### Reportes

- `GET /api/reports` - Listar reportes (con filtros y paginación)
- `GET /api/reports/:id` - Obtener un reporte específico
- `POST /api/reports` - Crear nuevo reporte
- `PUT /api/reports/:id` - Actualizar reporte
- `DELETE /api/reports/:id` - Eliminar reporte (solo jefe/admin)
- `PATCH /api/reports/:id/approve` - Aprobar reporte (solo jefe/admin)

## 👥 Roles de Usuario

- **admin**: Acceso completo al sistema
- **jefe**: Gestiona reportes de su turno
- **paramedico**: Crea y gestiona sus propios reportes
- **operador**: Crea y gestiona sus propios reportes

## 🔑 Variables de Entorno

```
PORT=5000                                      # Puerto del servidor
MONGODB_URI=mongodb://localhost:27017/cuajimalpa  # URI de MongoDB
JWT_SECRET=tu_secreto_aqui                     # Secreto para JWT
NODE_ENV=development                           # Ambiente (development/production)
FRONTEND_URL=http://localhost:5173             # URL del frontend
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (BD, etc.)
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Middleware personalizado
│   ├── models/          # Helpers de colecciones MongoDB
│   ├── routes/          # Definición de rutas
│   ├── scripts/         # Scripts de utilidad (seed, etc.)
│   ├── types/           # Tipos de TypeScript
│   └── index.ts         # Punto de entrada
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración de TypeScript
└── README.md           # Este archivo
```

## 🔧 Tecnologías

- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **MongoClient** - Driver nativo de MongoDB
- **JWT** - Autenticación
- **Argon2** - Encriptación de contraseñas (más seguro que bcrypt)
- **CORS** - Control de acceso

## 📝 Notas de Desarrollo

- El servidor se recarga automáticamente con `nodemon` en modo desarrollo
- Los errores se registran en la consola con detalles en desarrollo
- Las contraseñas se encriptan con Argon2 (ganador de Password Hashing Competition) antes de guardarse
- Los tokens JWT expiran en 24 horas

## 🛡️ Seguridad

- Todas las contraseñas se encriptan con Argon2
- Autenticación mediante JWT
- Control de acceso basado en roles
- Validación de datos en cada endpoint
- Variables sensibles en archivos .env (no versionados)

## 📞 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

