# Sistema de Gestión de Fábrica de Envolturas

Sistema completo para la gestión de producción de envolturas con control de calidad, seguimiento de pedidos y gestión de fichas técnicas.

## 🚀 Despliegue Rápido

### Opción 1: Railway (Recomendado)

1. **Fork este repositorio** en tu cuenta de GitHub
2. **Ve a [Railway](https://railway.app)** y conéctate con GitHub
3. **Selecciona este repositorio** para desplegar
4. **Agrega una base de datos PostgreSQL** en Railway
5. **Configura las variables de entorno:**
   ```
   NODE_ENV=production
   JWT_SECRET=tu_jwt_secret_super_seguro
   DB_HOST=tu_db_host
   DB_DATABASE=fabrica_envolturas
   DB_USER=tu_db_user
   DB_PASSWORD=tu_db_password
   DB_PORT=5432
   CORS_ORIGIN=https://tu-app.railway.app
   ```
6. **¡Listo!** Tu app estará disponible en `https://tu-app.railway.app`

### Opción 2: Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# O solo la aplicación
docker build -t fabrica-app .
docker run -p 3001:3001 fabrica-app
```

### Opción 3: Despliegue Manual

```bash
# Instalar dependencias
npm install

# Construir frontend
npm run build

# Ejecutar en producción
NODE_ENV=production npm start
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 📋 Características

- ✅ **Autenticación JWT** con roles y permisos
- ✅ **Gestión de Pedidos** con estados y seguimiento
- ✅ **Fichas Técnicas** con flujo de producción
- ✅ **Control de Calidad** integrado
- ✅ **Dashboard** con estadísticas en tiempo real
- ✅ **Informes** y reportes de producción
- ✅ **Gestión de Clientes** y usuarios
- ✅ **Interfaz Responsiva** con Tailwind CSS

## 🔧 Tecnologías

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL
- **Autenticación:** JWT, bcrypt
- **Base de Datos:** PostgreSQL con migraciones
- **Deployment:** Docker, Railway, Heroku

## 📊 Estructura del Proyecto

```
project-web/
├── src/                    # Frontend React
│   ├── components/         # Componentes de UI
│   ├── contexts/          # Contextos de React
│   ├── services/          # Servicios de API
│   └── types/             # Tipos TypeScript
├── server/                # Backend Node.js
│   ├── routes/            # Rutas de API
│   ├── middleware/        # Middleware de autenticación
│   └── config/            # Configuración de BD
├── supabase/              # Migraciones de BD
└── dist/                  # Build de producción
```

## 🔐 Variables de Entorno

Crea un archivo `.env` basado en `env.example`:

```env
DB_HOST=localhost
DB_DATABASE=fabrica_envolturas
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
CORS_ORIGIN=https://tu-dominio.com
VITE_API_BASE_URL=https://tu-api-dominio.com/api
```

## 📱 Usuarios de Prueba

```
Email: jefe@fabrica.com
Password: 123456
Rol: jefe_produccion

Email: extrusion@fabrica.com
Password: 123456
Rol: operario_extrusion

Email: calidad@fabrica.com
Password: 123456
Rol: control_calidad
```

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Ejecutar frontend y backend
npm run client           # Solo frontend
npm run server           # Solo backend

# Producción
npm run build            # Construir frontend
npm run start            # Ejecutar en producción
npm run build:server     # Build + start servidor

# Docker
docker-compose up        # Ejecutar con base de datos
docker build -t app .    # Construir imagen
```

## 📞 Soporte

Para soporte técnico o preguntas sobre el despliegue, contacta al equipo de desarrollo. 