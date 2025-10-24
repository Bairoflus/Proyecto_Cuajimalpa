# Sistema de Emergencias Prehospitalarias Cuajimalpa

## Propósito

Plataforma web integral diseñada para la gestión, seguimiento y análisis de servicios de emergencias médicas prehospitalarias y urbanas en la delegación Cuajimalpa. El sistema permite centralizar el registro de emergencias, facilitar el seguimiento de tiempos de respuesta, generar estadísticas y coordinar recursos humanos y materiales.

## Tecnologías Utilizadas

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB

**Frontend:**
- React + React Admin
- TypeScript

## Instalación Rápida

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd Proyecto_Cuajimalpa

# Instalar backend
cd web/backend
npm install
npm run build

# Instalar frontend
cd ../frontend
npm install
npm run build
```

## Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (v6.0 o superior)
- Navegador web moderno

## Documentación

Para instrucciones detalladas de instalación, configuración y uso del sistema, consulta los siguientes manuales:

- **[Manual de Instalación](./MANUAL_INSTALACION.md)** - Guía completa de instalación y configuración del sistema
- **[Manual de Usuario](./MANUAL_USUARIO.md)** - Instrucciones de uso para todos los roles (Administradores, Jefes y Operadores)

## Estructura del Proyecto

```
Proyecto_Cuajimalpa/
├── web/
│   ├── backend/      # API REST del sistema
│   └── frontend/     # Aplicación frontend
├── MANUAL_INSTALACION.md
└── MANUAL_USUARIO.md
```

## Licencia

Este proyecto es de uso interno para la delegación Cuajimalpa.
