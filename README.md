# Developer Timesheet Application

Aplicación elegante para gestionar hojas de trabajo de desarrolladores de software.

## Características

- **Panel de Administración**: Gestión completa de desarrolladores y registros de tiempo
- **Vista de Información**: Dashboard con estadísticas, gráficos y tablas
- **Diseño Elegante**: Interfaz moderna con tema oscuro y efectos visuales
- **API REST**: Backend completo para operaciones CRUD

## Tecnologías

- **Backend**: Flask (Python)
- **Base de Datos**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Diseño**: Tema oscuro con gradientes y animaciones

## Instalación

1. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Ejecutar la aplicación:
```bash
python app.py
```

4. Abrir en el navegador:
- Vista principal: http://localhost:5000/
- Panel de administración: http://localhost:5000/admin

## Estructura del Proyecto

```
curriculum_online/
├── app.py                 # Aplicación Flask principal
├── requirements.txt       # Dependencias Python
├── templates/
│   ├── index.html        # Vista principal
│   └── admin.html        # Panel de administración
└── static/
    ├── css/
    │   └── style.css     # Estilos elegantes
    └── js/
        ├── main.js       # Lógica vista principal
        └── admin.js      # Lógica panel admin
```

## Funcionalidades

### Panel de Administración
- Crear, editar y eliminar desarrolladores
- Registrar horas de trabajo por proyecto
- Categorizar tareas por tipo (Desarrollo, Testing, etc.)
- Seguimiento de estado de tareas

### Vista de Información
- Estadísticas generales (desarrolladores, horas totales, registros)
- Tarjetas de desarrolladores con métricas individuales
- Tabla de registros con filtros
- Gráficos de distribución de horas por tipo y proyecto

## API Endpoints

### Desarrolladores
- `GET /api/developers` - Listar todos
- `POST /api/developers` - Crear nuevo
- `GET /api/developers/:id` - Obtener uno
- `PUT /api/developers/:id` - Actualizar
- `DELETE /api/developers/:id` - Eliminar

### Timesheets
- `GET /api/timesheets` - Listar todos
- `POST /api/timesheets` - Crear nuevo
- `GET /api/timesheets/:id` - Obtener uno
- `PUT /api/timesheets/:id` - Actualizar
- `DELETE /api/timesheets/:id` - Eliminar

### Estadísticas
- `GET /api/statistics` - Obtener estadísticas generales

## Licencia

MIT License
