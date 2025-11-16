# Developer Timesheet Application

Aplicación elegante para gestionar hojas de trabajo de desarrolladores de software. Construida con Next.js y Supabase.

## Características

- **Panel de Administración**: Gestión completa de desarrolladores y registros de tiempo
- **Vista de Información**: Dashboard con estadísticas, gráficos y tablas
- **Diseño Elegante**: Interfaz moderna con tema oscuro y efectos visuales
- **API REST**: Backend completo con API Routes de Next.js
- **Base de Datos en la Nube**: Supabase como backend de datos

## Tecnologías

- **Framework**: Next.js 14 (React)
- **Lenguaje**: TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Estilos**: CSS3 con variables CSS y tema oscuro
- **Diseño**: Interfaz responsive con animaciones

## Instalación

### 1. Configurar Supabase

1. Crear una cuenta en [Supabase](https://supabase.com)
2. Crear un nuevo proyecto
3. Ir a SQL Editor y ejecutar el contenido de `supabase-schema.sql`
4. Obtener las credenciales del proyecto (Settings > API)

### 2. Configurar Variables de Entorno

1. Copiar el archivo de ejemplo:
```bash
cp .env.local.example .env.local
```

2. Editar `.env.local` con tus credenciales de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

### 5. Abrir en el Navegador

- Vista principal: http://localhost:3000/
- Panel de administración: http://localhost:3000/admin

## Producción

Para construir la aplicación para producción:

```bash
npm run build
npm start
```

## Estructura del Proyecto

```
curriculum_online/
├── pages/                      # Páginas de Next.js
│   ├── _app.tsx               # Componente App global
│   ├── _document.tsx          # Documento HTML personalizado
│   ├── index.tsx              # Vista principal
│   ├── admin.tsx              # Panel de administración
│   └── api/                   # API Routes
│       ├── developers/
│       │   ├── index.ts       # GET, POST developers
│       │   └── [id].ts        # GET, PUT, DELETE developer
│       ├── timesheets/
│       │   ├── index.ts       # GET, POST timesheets
│       │   └── [id].ts        # GET, PUT, DELETE timesheet
│       └── statistics/
│           └── index.ts       # GET statistics
├── lib/
│   └── supabase.ts            # Cliente de Supabase
├── types/
│   └── database.ts            # Tipos TypeScript
├── styles/
│   └── globals.css            # Estilos globales
├── public/                    # Archivos estáticos
├── package.json               # Dependencias npm
├── tsconfig.json              # Configuración TypeScript
├── next.config.js             # Configuración Next.js
├── supabase-schema.sql        # Esquema de base de datos
└── .env.local.example         # Ejemplo de variables de entorno
```

## Funcionalidades

### Panel de Administración (`/admin`)
- Crear, editar y eliminar desarrolladores
- Registrar horas de trabajo por proyecto
- Categorizar tareas por tipo (Desarrollo, Testing, etc.)
- Seguimiento de estado de tareas (Completado, En Progreso, Bloqueado)

### Vista de Información (`/`)
- Estadísticas generales (desarrolladores, horas totales, registros)
- Tarjetas de desarrolladores con métricas individuales
- Tabla de registros con filtros por desarrollador
- Gráficos de distribución de horas por tipo y proyecto

## API Endpoints

### Desarrolladores
- `GET /api/developers` - Listar todos los desarrolladores
- `POST /api/developers` - Crear nuevo desarrollador
- `GET /api/developers/:id` - Obtener desarrollador específico
- `PUT /api/developers/:id` - Actualizar desarrollador
- `DELETE /api/developers/:id` - Eliminar desarrollador

### Timesheets
- `GET /api/timesheets` - Listar todos los registros
- `GET /api/timesheets?developer_id=X` - Filtrar por desarrollador
- `POST /api/timesheets` - Crear nuevo registro
- `GET /api/timesheets/:id` - Obtener registro específico
- `PUT /api/timesheets/:id` - Actualizar registro
- `DELETE /api/timesheets/:id` - Eliminar registro

### Estadísticas
- `GET /api/statistics` - Obtener estadísticas generales

## Modelos de Datos

### Developer
- `id`: number (auto-generado)
- `name`: string (requerido)
- `email`: string (único, requerido)
- `position`: string (requerido)
- `department`: string (requerido)
- `avatar_url`: string (opcional)
- `created_at`: timestamp

### Timesheet
- `id`: number (auto-generado)
- `developer_id`: number (referencia a Developer)
- `date`: date (requerido)
- `project_name`: string (requerido)
- `task_description`: text (requerido)
- `hours_worked`: number (requerido)
- `task_type`: string (Development, Testing, Meeting, etc.)
- `status`: string (Completed, In Progress, Blocked)
- `notes`: text (opcional)
- `created_at`: timestamp

## Despliegue

Esta aplicación está lista para desplegarse en:
- **Vercel** (recomendado para Next.js)
- **Netlify**
- Cualquier plataforma que soporte Node.js

Las variables de entorno deben configurarse en la plataforma de despliegue.

## Licencia

MIT License
