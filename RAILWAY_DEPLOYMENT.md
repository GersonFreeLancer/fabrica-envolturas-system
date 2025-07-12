# 🚀 Guía de Despliegue en Railway

## Pasos para desplegar tu Sistema de Gestión de Fábrica en Railway

### 1. Preparación del Proyecto

Tu proyecto ya está configurado correctamente con:
- ✅ `railway.json` configurado
- ✅ `Dockerfile` optimizado
- ✅ `.dockerignore` creado
- ✅ Scripts de build y start en `package.json`

### 2. Crear cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta o inicia sesión
3. Conecta tu repositorio de GitHub

### 3. Configurar el Proyecto en Railway

1. **Crear nuevo proyecto:**
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Selecciona tu repositorio

2. **Configurar variables de entorno:**
   - Ve a la pestaña "Variables"
   - Agrega las siguientes variables:

```env
# Configuración de Base de Datos PostgreSQL
DB_HOST=tu-host-de-railway
DB_DATABASE=tu-database-name
DB_USER=tu-username
DB_PASSWORD=tu-password
DB_PORT=5432

# Configuración de JWT
JWT_SECRET=tu_super_secret_jwt_key_aqui

# Configuración del Servidor
PORT=3001
NODE_ENV=production

# Configuración de CORS (actualizar con tu dominio de Railway)
CORS_ORIGIN=https://tu-app.railway.app

# Configuración de API (actualizar con tu dominio de Railway)
VITE_API_BASE_URL=https://tu-app.railway.app/api
```

### 4. Configurar Base de Datos PostgreSQL

1. **Agregar servicio de PostgreSQL:**
   - En tu proyecto de Railway, haz clic en "New Service"
   - Selecciona "Database" → "PostgreSQL"
   - Railway generará automáticamente las variables de entorno de la base de datos

2. **Migraciones automáticas:**
   - Las migraciones se ejecutarán automáticamente al iniciar la aplicación
   - El script `scripts/init-database.sql` creará todas las tablas necesarias
   - Se insertarán datos de prueba automáticamente

3. **Verificar migraciones:**
   - Ve a la pestaña "Deployments"
   - Encuentra tu último deployment
   - Haz clic en "View Logs" para ver el progreso de las migraciones
   - Busca mensajes como "✅ Migraciones completadas"

### 5. Desplegar la Aplicación

1. **Trigger deployment:**
   - Railway detectará automáticamente los cambios en tu repositorio
   - O puedes hacer clic en "Deploy Now" para forzar un nuevo deployment

2. **Verificar el deployment:**
   - Ve a la pestaña "Deployments"
   - Espera a que el build termine
   - Verifica que el health check pase en `/api/health`

### 6. Configurar Dominio Personalizado (Opcional)

1. Ve a la pestaña "Settings"
2. En "Domains", agrega tu dominio personalizado
3. Actualiza las variables `CORS_ORIGIN` y `VITE_API_BASE_URL` con tu dominio

### 7. Verificar la Aplicación

1. **Health Check:**
   - Visita `https://tu-app.railway.app/api/health`
   - Deberías ver: `{"message":"Servidor funcionando correctamente",...}`

2. **Frontend:**
   - Visita `https://tu-app.railway.app`
   - Debería cargar tu aplicación React

### 8. Scripts de Base de Datos

**Scripts disponibles:**

1. **Migraciones:**
   ```bash
   npm run migrate          # Ejecutar migraciones
   npm run migrate:dev      # Migraciones en desarrollo
   npm run migrate:prod     # Migraciones en producción
   npm run db:init          # Inicializar base de datos
   ```

2. **Verificación:**
   ```bash
   npm run db:check         # Verificar estado de la BD
   npm run db:check:prod    # Verificar en producción
   ```

3. **Datos de prueba:**
   - Usuario jefe: `jefe@fabrica.com` / `123456`
   - Usuarios operarios: `extrusion@fabrica.com`, `corte@fabrica.com`, etc.
   - Clientes y pedidos de ejemplo incluidos

### 9. Troubleshooting

**Problemas comunes:**

1. **Error de conexión a base de datos:**
   - Verifica que las variables de entorno de la base de datos estén correctas
   - Asegúrate de que el servicio de PostgreSQL esté activo
   - Ejecuta `npm run db:check` para diagnosticar

2. **Error de migraciones:**
   - Revisa los logs en Railway para ver errores específicos
   - Verifica que las variables de entorno estén configuradas
   - Las migraciones se ejecutan automáticamente en producción

3. **Error de build:**
   - Revisa los logs en Railway
   - Verifica que todas las dependencias estén en `package.json`

4. **Error de CORS:**
   - Actualiza `CORS_ORIGIN` con tu dominio de Railway
   - Verifica que el frontend esté haciendo requests al backend correcto

5. **Error de JWT:**
   - Asegúrate de que `JWT_SECRET` esté configurado
   - Usa una clave secreta fuerte y única

### 10. Monitoreo

- **Logs:** Ve a la pestaña "Deployments" → "View Logs"
- **Métricas:** Railway proporciona métricas básicas de uso
- **Health Checks:** Railway verificará automáticamente `/api/health`
- **Base de datos:** Usa `npm run db:check:prod` para verificar el estado

### 11. Actualizaciones

Para actualizar tu aplicación:
1. Haz push a tu repositorio de GitHub
2. Railway detectará automáticamente los cambios
3. Se ejecutará un nuevo deployment automáticamente

---

¡Tu aplicación debería estar funcionando correctamente en Railway! 🎉 