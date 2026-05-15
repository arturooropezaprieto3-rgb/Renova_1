#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║        RENOVA - Solar Landing Page           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js no está instalado."
    echo ""
    echo "Instalar Node.js desde: https://nodejs.org/"
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "[INFO] Instalando dependencias..."
    npm install
fi

echo "[INFO] Iniciando servidor..."
echo ""
echo "   Local:     http://localhost:3000"
echo "   Red:       http://192.168.x.x:3000"
echo ""
echo "   Presiona Ctrl+C para detener"
echo ""

node server.js