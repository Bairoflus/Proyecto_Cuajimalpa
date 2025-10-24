# Manual de Usuario - Sistema de Emergencias Prehospitalarias Cuajimalpa

## Tabla de Contenidos

1. Introducción al Sistema
2. Acceso al Sistema
3. Interfaz Principal y Navegación
4. Roles y Permisos de Usuario
5. Gestión de Reportes
6. Gestión de Personal (Solo Administradores)
7. Panel de Control y Estadísticas
8. Mis Reportes (Vista Personal)
9. Reportes de Turno (Jefes)
10. Funciones Avanzadas

---

## 1. Introducción al Sistema

### Qué es el Sistema de Emergencias Prehospitalarias Cuajimalpa

El Sistema de Emergencias Prehospitalarias Cuajimalpa es una plataforma web integral diseñada para la gestión, seguimiento y análisis de servicios de emergencias médicas prehospitalarias y urbanas en la delegación Cuajimalpa.

### Propósito del Sistema

- Centralizar el registro de emergencias médicas y urbanas
- Facilitar el seguimiento de tiempos de respuesta y atención
- Generar estadísticas para mejora continua del servicio
- Coordinar recursos humanos y materiales
- Mantener auditoría completa de todas las operaciones
- Apoyar la toma de decisiones basada en datos


### Beneficios del Sistema

- Registro rápido y eficiente de incidentes
- Trazabilidad completa del servicio
- Reducción de errores en documentación
- Análisis en tiempo real
- Mejora en coordinación de equipos
- Generación automática de reportes

---

## 2. Acceso al Sistema

### Requisitos para Acceder

- Navegador web
- Conexión a internet o red local
- Credenciales de acceso proporcionadas por el administrador

### Proceso de Inicio de Sesión

1. Realizar el deploy respectivo según el manual de instalación
 
2. Abrir el navegador web

3. Ingresar la URL del sistema:
   - Desarrollo: http://localhost:5173

4. En la pantalla de inicio de sesión, ingresar:
   - Usuario: Su nombre de usuario asignado
   - Contraseña: Su contraseña personal

5. Hacer clic en el botón "Iniciar Sesión"

6. Si las credenciales son correctas, será redirigido al panel principal

### Credenciales de Prueba (Solo Ambiente de Desarrollo)

Para ambiente de pruebas, puede usar:

| Usuario | Rol | Contraseña |
|---------|-----|-----------|
| admin | Administrador | admin123 |
| jefe1 | Jefe de Turno | jefe123 |
| paramedico1 | Paramédico | paramedico123 |
| operador1 | Operador | operador123 |

IMPORTANTE: En producción, deberá cambiar estas contraseñas por seguridad.

### Recuperación de Contraseña

Actualmente, para recuperar o cambiar su contraseña:
- Contactar al administrador del sistema


### Cerrar Sesión

1. Hacer clic en su nombre de usuario en la esquina superior derecha
2. Seleccionar "Cerrar Sesión" del menú desplegable
3. Será redirigido a la pantalla de inicio de sesión

IMPORTANTE: Siempre cierre sesión al terminar, especialmente en computadoras compartidas.

---

## 3. Interfaz Principal y Navegación

### Elementos de la Interfaz

La interfaz principal consta de:

1. Barra Superior:
   - Logo del sistema (izquierda)
   - Nombre de usuario y menú de perfil (derecha)

2. Menú Lateral (Izquierda):
   - Panel de Control (solo Admin)
   - Gestión de Personal (solo Admin)
   - Todos los reportes (solo Admin)
   - Reportes de Turno (solo Jefes)
   - Personal del Turno (solo Jefes)
   - Mis Reportes (Operador/Paramédico)
   

3. Área de Contenido Principal:
   - Muestra el contenido según la sección seleccionada


### Navegación entre Secciones

Para navegar entre secciones:

1. Hacer clic en el icono de menú (tres líneas horizontales) si el menú está colapsado

2. Seleccionar la sección deseada del menú lateral:
   - Panel de Control: Estadísticas y métricas generales
   - Reportes: Lista completa de reportes (según permisos)
   - Mis Reportes: Solo reportes creados por usted
   - Reportes de Turno: Reportes del turno asignado (solo Jefes)
   - Gestión de Personal: Administración de usuarios (solo Admin)

3. El área principal mostrará el contenido correspondiente

### Funciones Comunes

Botones de Acción:
- Crear: Botón con ícono "+" para agregar nuevo reporte
- Eliminar: Botón de eliminar para reportes y personal (Solo admin)
- Filtrar: Filtrar por diferentes características los reportes y/o personal (como Admin y Jefe)
- Exportar: Ícono de descarga para exportar datos (cuando disponible)
- Actualizar: Ícono dedicado a actualizar datos de reportes ya generados.

---

## 4. Roles y Permisos de Usuario

### Tipos de Roles en el Sistema

El sistema maneja tres roles principales:

#### 1. Administrador (ADMIN)

Permisos completos:
- Ver todos los reportes del sistema
- Crear, editar y eliminar cualquier reporte
- Gestionar usuarios (crear, editar, eliminar)
- Acceder a todas las estadísticas
- Ver logs de auditoría
- Administrar configuración del sistema

Responsabilidades:
- Supervisión general del sistema
- Gestión de usuarios y permisos
- Mantenimiento de datos

#### 2. Jefe de Turno (JEFE)

Permisos por turno:
- Ver reportes de su turno asignado
- Ver personal de su turno
- Aprobar reportes de su turno
- Agregar observaciones a reportes
- Ver estadísticas de su turno

Responsabilidades:
- Supervisión de reportes del turno
- Validación de información registrada
- Coordinación del personal del turno
- Revisión de calidad de reportes

#### 3. Paramédico / Operador

Permisos personales:
- Ver sus propios reportes
- Crear nuevos reportes
- Editar reportes propios que no han sido aprobados
- Seleccionar personal disponible para servicios
- Ver estadísticas personales básicas

Responsabilidades:
- Registro de emergencias atendidas
- Documentación de tratamientos aplicados
- Actualización de datos de pacientes
- Registro de tiempos de atención



### Turnos del Sistema

El sistema opera con 6 turnos diferentes:

| Turno | Descripción | Horario | Días |
|-------|-------------|---------|------|
| 1 | Primer turno | 08:00-15:00 | Lunes a Viernes |
| 2 | Segundo turno | 15:00-21:00 | Lunes a Viernes |
| 3 | Tercer turno | 21:00-08:00 | Lunes, Miércoles, Viernes |
| 4 | Cuarto turno | 21:00-08:00 | Martes, Jueves, Domingo |
| 5 | Quinto turno | 08:00-20:00 | Sábado, Domingo, Festivos |
| 6 | Sexto turno | 20:00-08:00 | Sábado, Domingo, Festivos |

---

## 5. Gestión de Reportes

### Vista de Lista de Reportes

Al acceder a "Reportes", verá una lista con las siguientes columnas:

- Folio: Identificador único del reporte (ej: CUAJ-2025-000001)
- Tipo: Prehospitalaria, Urbana, Privada, Falsa Alarma
- Gravedad: Alta, Media, Baja
- Fecha/Hora Llamada: Cuándo se recibió la emergencia
- Ubicación: Dirección del incidente
- Ambulancia: Unidad asignada
- Paramédico: Personal asignado
- Kilómetros: Distancia recorrida
- Aprobado: Estado de aprobación

### Filtrar Reportes

Para filtrar la lista de reportes:

1. Buscar los controles de filtro en la parte superior de la lista

2. Filtros disponibles:

   a. Por Tipo de Reporte:
      - Todos
      - Prehospitalaria
      - Urbana
      - Privada
      - Falsa Alarma
      - Otro

   b. Por Gravedad:
      - Todos
      - Alta
      - Media
      - Baja

   c. Por Fecha:
      - Rango de fechas personalizado

   d. Por Turno:
      - Seleccionar turno específico

3. Los filtros se aplican automáticamente al seleccionarlos

4. Para limpiar filtros, seleccionar "Todos" en cada filtro

### Crear un Nuevo Reporte

#### Paso 1: Iniciar Creación

1. En la sección "Reportes" o "Mis Reportes"
2. Hacer clic en el botón "Crear" (ícono +)
3. Se abrirá el formulario de nuevo reporte

#### Paso 2: Sección I - Cronometría

Campos obligatorios marcados con asterisco:

- Fecha y Hora de Llamada: Cuando se recibió la emergencia
- Fecha y Hora de Arribo: Cuando se llegó al lugar
- Fecha y Hora de Cierre: Cuando terminó el servicio

Campos opcionales:
- Hora de Traslado
- Hora de Salida
- Hora de Hospital
- Salida de Hospital

#### Paso 3: Información Básica del Reporte

- Folio: Se genera automáticamente (CUAJ-YYYY-NNNNNN)
- Tipo de Reporte: Seleccionar del menú desplegable
  - Prehospitalaria
  - Urbana
  - Privada
  - Falsa Alarma
  - Otro

- Nivel de Gravedad:
  - Alta: Situación crítica, riesgo de vida
  - Media: Requiere atención pero no es crítica
  - Baja: Situación menor, sin riesgo inmediato

#### Paso 4: Ubicación del Servicio

- Calle: Dirección principal
- Entre calles: Referencias entre qué calles
- Colonia: Nombre de la colonia
- Delegación: Normalmente Cuajimalpa
- Lugar de Ocurrencia: Descripción del lugar (ej: domicilio particular, vía pública)

#### Paso 5: Recursos Asignados

- Ambulancia: Seleccionar unidad asignada
- Paramédico: Seleccionar del personal disponible
- Entidad: Institución responsable (opcional)

#### Paso 6: Datos del Paciente (Solo Emergencias Prehospitalarias)

- Nombre completo del paciente
- Edad
- Sexo: Masculino / Femenino
- Teléfono de contacto
- Domicilio del paciente

#### Paso 7: Evaluación Clínica (Solo Emergencias Prehospitalarias)

- Diagnóstico: Descripción del diagnóstico prehospitalario
- Nivel de Conciencia:
  - Alerta: Paciente consciente y orientado
  - Verbal: Responde a estímulos verbales
  - Dolor: Solo responde a estímulos dolorosos
  - Inconsciente: No responde

- Signos Vitales:
  - TA (Tensión Arterial): ej. 120/80
  - FC (Frecuencia Cardíaca): pulsaciones por minuto
  - FR (Frecuencia Respiratoria): respiraciones por minuto
  - Temperatura: grados centígrados
  - SpO2: saturación de oxígeno en porcentaje

#### Paso 8: Tratamiento Aplicado (Solo Emergencias Prehospitalarias)

- Vía Aérea:
  - Permeable
  - Cánula orofaríngea
  - Cánula nasofaríngea
  - Intubación endotraqueal
  - Mascarilla laríngea

- Control Cervical:
  - Collar cervical
  - Tabla espinal
  - Inmovilización manual

- Medicamentos Administrados:
  - Nombre del medicamento
  - Dosis administrada
  - Vía de administración
  - Hora de administración

- Vías Venosas:
  - Tipo de catéter
  - Sitio de punción
  - Soluciones administradas

#### Paso 9: Información de Traslado

- Hospital de destino: Nombre del hospital
- Hora de salida del hospital
- Kilómetros recorridos
- Tiempo de atención en minutos
- Tiempo de traslado en minutos

#### Paso 10: Información Adicional

- Observaciones del Jefe: Campo para que el jefe agregue comentarios
- Requiere revisión: Marcar si el caso necesita revisión especial

#### Paso 11: Guardar el Reporte

1. Revisar todos los campos completados
2. Hacer clic en "Guardar"
3. El sistema validará la información
4. Si hay errores, se mostrarán en rojo
5. Corregir errores y volver a guardar
6. Al guardar exitosamente, se mostrará mensaje de confirmación
7. El reporte aparecerá en la lista con estado "Pendiente de aprobación"

### Editar un Reporte Existente

#### Quién Puede Editar

- Administradores: Cualquier reporte
- Jefes: Reportes de su turno
- Paramédicos/Operadores: Solo reportes propios y no aprobados

#### Proceso de Edición

1. Localizar el reporte en la lista
2. Hacer clic en el ícono de edición
3. Se abrirá el formulario con los datos actuales
4. Modificar los campos necesarios
5. Hacer clic en "Guardar"
6. Confirmar los cambios

IMPORTANTE: Los reportes aprobados solo pueden ser editados por Jefes y Administradores.

### Ver Detalles de un Reporte

1. En la lista de reportes, hacer clic en cualquier fila
2. Se abrirá la vista detallada del reporte
3. Muestra toda la información organizada por secciones
4. Desde aquí puede:
   - Editar (si tiene permisos)
   - Eliminar (si tiene permisos)
   - Aprobar (si es Jefe o Admin)
   - Imprimir (cuando disponible)

### Aprobar un Reporte (Solo Jefes y Administradores)

1. Abrir el reporte en vista detallada
2. Revisar cuidadosamente toda la información
3. Agregar observaciones si es necesario
4. Hacer clic en el botón "Aprobar"
5. Confirmar la aprobación
6. El reporte quedará marcado como "Aprobado"
7. El creador ya no podrá editarlo

### Eliminar un Reporte (Solo Administradores)

ADVERTENCIA: Esta acción no se puede deshacer.

1. Localizar el reporte en la lista
2. Hacer clic en el ícono de eliminar (basura)
3. Aparecerá mensaje de confirmación
4. Confirmar que desea eliminar
5. El reporte será eliminado permanentemente

Recomendación: En lugar de eliminar, considere marcar como "Falsa Alarma" o agregar observaciones.

### Buscar Reportes

Para buscar un reporte específico:

1. Usar el campo de búsqueda en la parte superior
2. Puede buscar por:
   - Folio
   - Nombre del paciente
   - Ubicación
   - Ambulancia
   - Nombre del paramédico

3. Los resultados se filtrarán automáticamente



## 6. Gestión de Personal (Solo Administradores)

### Acceso a Gestión de Personal

1. Iniciar sesión como Administrador
2. En el menú lateral, hacer clic en "Gestión de Personal"
3. Se mostrará la lista completa de usuarios del sistema

### Vista de Lista de Personal

Columnas mostradas:

- ID del usuario
- Nombre de Usuario: Username para iniciar sesión
- Nombre Completo: Nombre real del usuario
- Rol: Admin, Jefe, Paramédico, Operador
- Turno: Turno asignado (1-6)
- Fecha de Creación: Cuando se creó la cuenta
- Acciones: Editar, Eliminar, Cambiar Contraseña

### Filtrar Personal

Filtros disponibles:

1. Por Rol:
   - Todos
   - Administrador
   - Jefe
   - Paramédico
   - Operador

2. Por Turno:
   - Todos
   - Turno 1
   - Turno 2
   - Turno 3
   - Turno 4
   - Turno 5
   - Turno 6

### Crear Nuevo Usuario

1. Hacer clic en el botón "Crear" (ícono +)

2. Completar el formulario:
   - Nombre de Usuario: Sin espacios, único en el sistema
   - Nombre Completo: Nombre real del usuario
   - Contraseña: Mínimo 6 caracteres
   - Confirmar Contraseña: Debe coincidir
   - Rol: Seleccionar del menú desplegable
   - Turno: Seleccionar turno asignado

3. Hacer clic en "Guardar"

4. El usuario podrá iniciar sesión inmediatamente


### Editar Usuario Existente

1. Localizar el usuario en la lista
2. Hacer clic en el ícono de edición
3. Modificar los campos necesarios:
   - Nombre Completo
   - Rol
   - Turno

4. Hacer clic en "Guardar"


### Eliminar Usuario

ADVERTENCIA: Eliminar un usuario no elimina los reportes que creó.

1. Localizar el usuario en la lista
2. Hacer clic en el ícono de eliminar
3. Confirmar la eliminación
4. El usuario ya no podrá acceder al sistema
5. Sus reportes anteriores permanecerán en el sistema

Consideraciones:
- Solo eliminar usuarios que definitivamente ya no trabajarán en el sistema
- Considerar desactivar en lugar de eliminar (funcionalidad futura)
- Revisar que no haya reportes pendientes del usuario

### Buscar Personal

Usar el campo de búsqueda para encontrar usuarios por:
- Nombre de usuario
- Nombre completo
- Rol
- Turno

---

## 7. Panel de Control y Estadísticas

### Acceso al Panel de Control

1. Hacer clic en "Panel de Control" en el menú lateral
2. Se cargará el dashboard con estadísticas

NOTA: Las estadísticas mostradas dependen de su rol:
- Admin: Estadísticas completas del sistema
- Jefe: Estadísticas de su turno
- Paramédico/Operador: Estadísticas personales limitadas

### Métricas Principales

#### Tarjetas de Resumen

En la parte superior se muestran tarjetas con:

1. Total de Reportes:
   - Número total de reportes en el sistema
   - Reportes del día actual

2. Kilometraje Total:
   - Suma de todos los kilómetros recorridos
   - Útil para gestión de combustible y mantenimiento

3. Tiempo Promedio de Respuesta:
   - Tiempo desde la llamada hasta el arribo
   - Indicador clave de eficiencia

4. Tiempo Promedio de Atención:
   - Duración promedio de cada servicio
   - Desde arribo hasta cierre

### Gráficas de Distribución

#### Distribución por Tipo de Emergencia

Gráfica circular que muestra:
- Porcentaje de emergencias prehospitalarias
- Porcentaje de emergencias urbanas
- Porcentaje de servicios privados
- Porcentaje de falsas alarmas

Utilidad: Identificar los tipos de servicio más frecuentes.

#### Distribución por Gravedad

Gráfica de barras que muestra:
- Cantidad de emergencias de gravedad alta
- Cantidad de emergencias de gravedad media
- Cantidad de emergencias de gravedad baja

Utilidad: Evaluar la criticidad de los servicios atendidos.

### Análisis Temporal

#### Reportes por Hora

Gráfica de línea que muestra:
- Distribución de emergencias a lo largo del día
- Horas pico de mayor actividad
- Horas valle de menor actividad

Utilidad:
- Planificar distribución de personal
- Identificar patrones temporales
- Optimizar turnos

### Estadísticas por Recursos

#### Estadísticas por Ambulancia

Tabla que muestra para cada ambulancia:
- Número de servicios realizados
- Kilómetros totales recorridos
- Tiempo promedio de atención
- Porcentaje de uso

Utilidad:
- Programar mantenimiento preventivo
- Distribuir carga de trabajo
- Identificar vehículos más utilizados

#### Estadísticas por Paramédico

Tabla que muestra para cada paramédico:
- Número de servicios atendidos
- Tiempo promedio de atención
- Porcentaje de casos aprobados
- Calificación de desempeño (si aplica)

Utilidad:
- Evaluar desempeño individual
- Identificar necesidades de capacitación
- Reconocer personal destacado

### Análisis Geográfico

#### Zonas de Mayor Actividad

Tabla o gráfica que muestra:
- Colonias con más emergencias
- Delegaciones con más servicios
- Mapa de calor (si disponible)

Utilidad:
- Posicionar estratégicamente ambulancias
- Identificar zonas de alto riesgo
- Planificar rutas de respuesta

### Análisis Prehospitalario

#### Hospitales Destino

Gráfica que muestra:
- Hospitales más utilizados para traslado
- Número de pacientes trasladados a cada uno
- Tiempo promedio de traslado por hospital

#### Estadísticas de Traslado

- Porcentaje de casos que requirieron traslado
- Porcentaje de casos atendidos en sitio
- Porcentaje de pacientes que rechazaron traslado

### Indicadores de Calidad

#### Casos Aprobados vs Pendientes

- Porcentaje de reportes aprobados
- Porcentaje pendiente de revisión
- Tiempo promedio de aprobación

#### Casos que Requieren Revisión

- Número de casos marcados para revisión
- Motivos de revisión más frecuentes
- Estado de seguimiento

### Exportar Estadísticas

Para exportar estadísticas (cuando disponible):

1. Hacer clic en el botón "Exportar"
2. Seleccionar rango de fechas
3. Confirmar exportación
4. El archivo se descargará automáticamente

### Actualizar Estadísticas

- Las estadísticas se actualizan automáticamente cada 5 minutos
- Para actualizar manualmente, hacer clic en el botón de actualizar
- La fecha de última actualización se muestra en la parte inferior

---

## 8. Mis Reportes (Vista Personal)

### Acceso a Mis Reportes

1. Hacer clic en "Mis Reportes" en el menú lateral
2. Se mostrarán únicamente los reportes creados por usted

### Diferencias con Vista de Reportes General

- Solo muestra reportes propios
- No requiere filtrar por usuario
- Incluye reportes pendientes de aprobación
- Muestra estado de aprobación de cada reporte

### Crear Reporte desde Mis Reportes

Mismo proceso descrito en la sección 5 "Gestión de Reportes".

El reporte se creará automáticamente con:
- Su nombre como creador
- Su turno asignado
- Fecha y hora actual de creación

### Editar Reportes Propios

Puede editar sus reportes si:
- No han sido aprobados por un Jefe
- Estan marcados como pendientes

No puede editar:
- Reportes ya aprobados
- Reportes de otros usuarios

### Ver Estado de Aprobación

Cada reporte muestra su estado:

- Pendiente: Fondo amarillo, esperando aprobación
- Aprobado: Fondo verde, validado por Jefe
- Requiere Revisión: Fondo rojo, necesita corrección

### Observaciones del Jefe

Si un Jefe agregó observaciones a su reporte:

1. El campo "Observaciones del Jefe" estará visible
2. Leer las observaciones cuidadosamente
3. Realizar correcciones si es necesario
4. Notificar al Jefe cuando esté corregido

### Estadísticas Personales

En esta vista puede ver:
- Total de reportes creados
- Reportes aprobados vs pendientes
- Promedio de tiempo de atención
- Tipos de emergencia más atendidos

---

## 9. Reportes de Turno (Solo Jefes)

### Acceso a Reportes de Turno

Disponible solo para usuarios con rol de Jefe.

1. Hacer clic en "Reportes de Turno" en el menú lateral
2. Se mostrarán reportes del turno asignado al Jefe

### Qué Reportes se Muestran

- Todos los reportes creados durante su turno
- Reportes de todo el personal de su turno
- Incluye pendientes y aprobados

### Revisión de Reportes

Como Jefe, su responsabilidad es:

1. Revisar cada reporte cuidadosamente
2. Verificar información completa y correcta
3. Validar tiempos registrados
4. Confirmar recursos asignados
5. Verificar datos del paciente
6. Validar diagnóstico y tratamiento

### Agregar Observaciones

Para agregar comentarios a un reporte:

1. Abrir el reporte en modo edición
2. Ubicar el campo "Observaciones del Jefe"
3. Escribir comentarios relevantes:
   - Correcciones necesarias
   - Aclaraciones requeridas
   - Felicitaciones por buen trabajo
   - Recomendaciones

4. Guardar el reporte

### Aprobar Reportes

Cuando un reporte está correcto:

1. Verificar que toda la información esté completa
2. Hacer clic en "Aprobar"
3. Confirmar aprobación
4. El reporte quedará bloqueado para el creador
5. Solo Admin o Jefe podrán editarlo posteriormente

### Marcar para Revisión

Si un reporte tiene problemas serios:

1. Editar el reporte
2. Marcar checkbox "Requiere Revisión"
3. Agregar observaciones detallando qué corregir
4. Guardar
5. Notificar al creador del reporte

### Estadísticas del Turno

Ver métricas específicas de su turno:

- Total de servicios del turno
- Personal activo en el turno
- Ambulancias en servicio
- Tiempos promedio del turno
- Tipos de emergencia del turno

### Coordinación del Personal

Desde esta vista puede:

- Ver qué personal está asignado a su turno
- Revisar reportes de cada miembro
- Identificar carga de trabajo por persona
- Detectar necesidades de apoyo

---

## 10. Funciones Avanzadas

### Búsqueda Avanzada de Reportes

Para búsquedas más específicas:

1. Usar múltiples filtros simultáneamente:
   - Tipo + Gravedad + Rango de fechas
   - Turno + Ambulancia + Paramédico

2. Ordenar resultados por diferentes columnas

3. Exportar resultados filtrados

### Atajos de Teclado (Si Disponibles)

- Ctrl + N: Nuevo reporte
- Ctrl + S: Guardar
- Ctrl + F: Buscar
- Esc: Cancelar acción

### Modo de Impresión

Para imprimir un reporte:

1. Abrir reporte en vista detallada
2. Hacer clic en "Imprimir" o Ctrl + P
3. El navegador mostrará vista previa
4. Ajustar configuración de impresión
5. Imprimir o guardar como PDF

### Trabajo sin Conexión (Si Disponible)

El sistema puede tener capacidad offline:

- Los datos se guardan temporalmente en el navegador
- Se sincronizan cuando se recupera conexión
- Ícono especial indica modo offline
- Mensaje de advertencia al intentar guardar sin conexión

### Notificaciones del Sistema

El sistema puede mostrar notificaciones para:

- Nuevos reportes asignados
- Reportes pendientes de aprobación
- Reportes que requieren revisión
- Cambios en turnos
- Mensajes del administrador

### Personalización de Vista

Algunas opciones de personalización:

- Cambiar número de filas por página
- Ocultar/mostrar columnas
- Guardar filtros favoritos
- Establecer vista predeterminada

### Auditoría de Acciones (Solo Administradores)

Los administradores pueden ver:

1. Log de auditoría completo
2. Acciones por usuario
3. Reportes creados, editados, eliminados
4. Cambios en usuarios
5. Inicios de sesión
6. Intentos fallidos de acceso

Para acceder:
- En menú de reportes, buscar "Auditoría"
- Filtrar por tipo de acción
- Filtrar por usuario
- Filtrar por rango de fechas

---


Fin del Manual de Usuario
