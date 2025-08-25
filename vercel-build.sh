#!/bin/bash

# Script de construcción para Vercel
echo "🚀 Iniciando construcción de AXYRA..."

# Crear directorio de salida
mkdir -p .vercel/output

# Copiar frontend
echo "📁 Copiando archivos del frontend..."
cp -r frontend/* .vercel/output/

# Copiar backend
echo "🐍 Copiando archivos del backend..."
cp -r backend .vercel/output/

# Copiar archivos de configuración
echo "⚙️ Copiando archivos de configuración..."
cp vercel.json .vercel/output/
cp requirements.txt .vercel/output/

# Crear archivo de configuración para Vercel
echo "🔧 Creando configuración de Vercel..."
cat > .vercel/output/vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    },
    {
      "src": "backend/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/index.html"
    },
    {
      "src": "/modulos/(.*)",
      "dest": "/modulos/$1"
    },
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/backend/(.*)",
      "dest": "/backend/$1"
    },
    {
      "src": "/api/(.*)",
      "dest": "/backend/main.py"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))",
      "dest": "/$1"
    },
    {
      "src": "/(.*\\.html)",
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "functions": {
    "backend/main.py": {
      "runtime": "python3.9",
      "maxDuration": 30
    }
  },
  "env": {
    "PYTHONPATH": "backend"
  },
  "cleanUrls": true,
  "trailingSlash": false
}
EOF

echo "✅ Construcción completada exitosamente!"
echo "📁 Archivos generados en: .vercel/output/"
