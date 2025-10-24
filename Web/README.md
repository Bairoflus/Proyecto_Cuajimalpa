# Manual de Instalación - Sistema de Emergencias Prehospitalarias Cuajimalpa

## Tabla de Contenidos

1. Instalación del Backend
2. Instalación del Frontend
3. Inicialización de la Base de Datos
4. Ejecución del Sistema
5. Verificación de la Instalacion

---


## 1. Instalación del Backend

### Paso 1: Obtener el Código Fuente

```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto_Cuajimalpa
```

### Paso 2: Navegar a la Carpeta del Backend
```bash
cd web/backend
```

### Paso 3: Instalar Dependencias de Node.js
```bash
npm install
```

### Paso 4: Configurar Variables de Entorno

1. Crear archivo .env en la carpeta backend:
```bash
# Windows 
copy .env.example .env

# macOS/Linux
cp .env.example .env
```


### Paso 5: Compilar el Código TypeScript
```bash
npm run build
```

---

## 2. Instalación del Frontend

### Paso 1: Navegar a la Carpeta del Frontend

Desde la raíz del proyecto:
```bash
cd web/frontend
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

## 3. Inicialización de la Base de Datos

### Paso 1: Verificar que MongoDB esta Corriendo

#### Windows
Abrir "Servicios" y verificar que "MongoDB Server" este en ejecución.

#### macOS
```bash
brew services list
```
Debe aparecer mongodb-community como "started"

#### Linux
```bash
sudo systemctl status mongod
```

### Paso 2: Poblar Base de Datos con Datos Iniciales

Desde la carpeta backend:

1. Crear usuarios de prueba:
```bash
npm run seed:users
```

Esto creara los siguientes usuarios:

| Usuario | Rol | Turno | Contraseña |
|---------|-----|-------|-----------|
| admin | Admin | 1 | admin123 |
| jefe1 | Jefe | 1 | jefe123 |
| jefe2 | Jefe | 2 | jefe123 |
| operador1 | Operador | 1 | operador123 |
| operador2 | Operador | 2 | operador123 |
| paramedico1 | Paramedico | 1 | paramedico123 |
| paramedico2 | Paramedico | 2 | paramedico123 |


---

## 4. Ejecución del Sistema

### Modo Desarrollo

#### Terminal 1 - Iniciar Backend

1. Abrir una terminal/command prompt
2. Navegar a la carpeta backend:
```bash
cd web/backend
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

Debería ver un mensaje similar a:
```
Server running on port 5002
MongoDB connected successfully
```

#### Terminal 2 - Iniciar Frontend

1. Abrir OTRA terminal/command prompt
2. Navegar a la carpeta frontend:
```bash
cd web/frontend
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

Debería ver un mensaje similar a:
```
VITE v6.2.6  ready in 1234 ms

Local:   http://localhost:5173/
Network: use --host to expose
```

### Acceder al Sistema

1. Abrir navegador web
2. Navegar a: http://localhost:5173
3. Usar credenciales de prueba:
   - Usuario: admin
   - Contrasena: admin123

---

## 5. Verificación de la Instalacion

### Verificación del Backend

1. Verificar que el servidor responde:
   - Abrir navegador
   - Ir a: http://localhost:5002/api/health
   - Debería mostrar: {"status":"ok"}

### Verificación del Frontend

1. Verificar que la página de login carga correctamente
2. Intentar iniciar sesión con credenciales de prueba
3. Verificar que el dashboard se muestra correctamente
4. Verificar navegación entre secciones:
   - Panel de Control
   - Todos los Reportes
   - Gestión del Personal

### Verificacion de Conexión Backend-Frontend

1. Iniciar sesión en el sistema
2. Crear un nuevo reporte de prueba
3. Verificar que aparece en la lista de reportes
4. Editar el reporte
5. Eliminar el reporte (si tiene permisos)

### Verificación de Base de Datos

1. Los datos deben persistir al cerrar y abrir el navegador
2. Los cambios deben reflejarse inmediatamente
3. Verificar que los filtros funcionan correctamente

---

### Logs para Diagnóstico

Backend logs:
- Se muestran en la terminal donde se ejecuta npm run dev
- Buscar mensajes de ERROR o WARNING

Frontend logs:
- Abrir DevTools del navegador (F12)
- Ir a la pestana Console
- Buscar errores en rojo

---

Fin del Manual de Instalacion
