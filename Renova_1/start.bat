@echo off
title Renova - Servidor de Desarrollo
color 0A

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║        RENOVA - Solar Landing Page           ║
echo  ╚══════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo.
    echo Instalar Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm dependencies are installed
if not exist "node_modules" (
    echo [INFO] Instalando dependencias...
    npm install
)

echo [INFO] Iniciando servidor...
echo.
echo    Local:     http://localhost:3000
echo    Red:       http://192.168.x.x:3000
echo.
echo    Presiona Ctrl+C para detener
echo.

node server.js

pause