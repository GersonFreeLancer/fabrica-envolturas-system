#!/bin/bash

# Script de despliegue para Railway
echo "🚀 Iniciando despliegue en Railway..."

# Verificar que estemos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que railway.json existe
if [ ! -f "railway.json" ]; then
    echo "❌ Error: No se encontró railway.json"
    exit 1
fi

# Verificar que Dockerfile existe
if [ ! -f "Dockerfile" ]; then
    echo "❌ Error: No se encontró Dockerfile"
    exit 1
fi

echo "✅ Archivos de configuración encontrados"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir la aplicación
echo "🔨 Construyendo la aplicación..."
npm run build

echo "✅ Build completado"

echo "🎉 ¡Proyecto listo para desplegar en Railway!"
echo ""
echo "📋 Pasos siguientes:"
echo "1. Ve a https://railway.app"
echo "2. Crea un nuevo proyecto"
echo "3. Conecta tu repositorio de GitHub"
echo "4. Agrega un servicio de PostgreSQL"
echo "5. Configura las variables de entorno"
echo "6. ¡Despliega!"
echo ""
echo "📖 Consulta RAILWAY_DEPLOYMENT.md para instrucciones detalladas" 