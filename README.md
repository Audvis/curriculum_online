# Portfolio Profesional con Next.js y Three.js

Un portfolio moderno y futurista para desarrolladores de software, construido con Next.js 15, TypeScript, Tailwind CSS y animaciones 3D con Three.js.

## 🚀 Características

### 🎨 Diseño Futurista Minimalista
- Interfaz elegante con gradientes de colores púrpura y rosa
- Efectos glassmorphism y animaciones suaves
- Diseño responsive optimizado para todos los dispositivos
- Scrollbar personalizada y efectos de hover interactivos

### 🌐 Animaciones 3D con Three.js
- Campo de partículas interactivo que responde al movimiento del mouse
- Geometrías flotantes animadas (icosaedros, torus knot, cristales)
- Fondos 3D dinámicos con rotación automática
- Efectos de iluminación y materiales metalizados

### 📱 Panel de Administración Completo
- Gestión completa de información personal
- CRUD para experiencia laboral, educación, proyectos y habilidades
- Interfaz intuitiva con formularios validados
- Vista previa en tiempo real del portfolio

### 🛠️ Stack Tecnológico
- **Frontend**: Next.js 15 con App Router
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4 con shadcn/ui
- **Base de Datos**: Prisma ORM con SQLite
- **Animaciones**: Three.js, React Three Fiber, Framer Motion
- **Estado**: Zustand y TanStack Query

## 📋 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # Endpoints de la API
│   └── page.tsx           # Página principal del portfolio
├── components/
│   ├── admin/             # Componentes del admin
│   ├── three/             # Componentes 3D
│   └── ui/                # Componentes shadcn/ui
├── lib/
│   └── db.ts              # Cliente de Prisma
└── hooks/                 # Hooks personalizados
```

## 🚀 Comenzando

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd portfolio-nextjs-threejs
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la base de datos:
```bash
npm run db:push
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Uso

### Configuración Inicial

1. **Accede al Panel de Administración**:
   - Navega a `http://localhost:3000/admin`
   - Aquí podrás configurar toda tu información profesional

2. **Completa tu Información Personal**:
   - Nombre completo, título profesional, biografía
   - Información de contacto (email, teléfono, ubicación)
   - Redes sociales (GitHub, LinkedIn, website)

3. **Agrega tu Experiencia Laboral**:
   - Empresas donde has trabajado
   - Posiciones y fechas de empleo
   - Descripciones y tecnologías utilizadas

4. **Registra tu Educación**:
   - Instituciones académicas
   - Títulos y grados obtenidos
   - Fechas de estudio

5. **Muestra tus Proyectos**:
   - Proyectos destacados y personales
   - Descripciones y tecnologías
   - Enlaces a demos y repositorios

6. **Lista tus Habilidades**:
   - Competencias técnicas por categorías
   - Niveles de dominio (Principiante a Experto)

### Personalización

#### Colores y Tema
Los colores principales están definidos en las variables CSS:
- **Púrpura principal**: `#8b5cf6`
- **Rosa secundario**: `#ec4899`
- **Cian acento**: `#06b6d4`

#### Animaciones 3D
Personaliza las animaciones en `src/components/three/`:
- `ParticleField.tsx`: Control de partículas
- `FloatingGeometry.tsx`: Geometrías animadas
- `AnimatedBackground.tsx`: Composición del fondo

#### Estilos CSS
Clases personalizadas en `globals.css`:
- `.glass-morphism`: Efecto cristal
- `.text-gradient`: Texto con gradiente
- `.hover-lift`: Efecto de elevación al hover

## 🔧 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción
npm run lint         # Verifica calidad del código
npm run db:push      # Sincroniza schema con la BD
npm run db:studio    # Abre Prisma Studio
```

## 📊 Base de Datos

El proyecto utiliza **SQLite** con **Prisma ORM**. El esquema incluye:

- **PersonalInfo**: Información personal y de contacto
- **Experience**: Experiencia laboral
- **Education**: Formación académica
- **Project**: Proyectos destacados
- **Skill**: Habilidades técnicas

## 🎨 Componentes 3D

### ParticleField
Campo de partículas interactivo con:
- 1000+ partículas animadas
- Respuesta al movimiento del mouse
- Efectos de brillo aditivos

### FloatingGeometry
Geometrías 3D animadas:
- Icosaedros rotantes
- Torus knots complejos
- Cristales pulsantes

### AnimatedBackground
Composición completa del fondo 3D con:
- Múltiples variantes (particles, geometric, mixed)
- Controles de órbita automáticos
- Iluminación ambiental y puntual

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Three.js](https://threejs.org/) - Biblioteca 3D
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Prisma](https://www.prisma.io/) - ORM
- [Framer Motion](https://www.framer.com/motion/) - Animaciones

---

**Creado con ❤️ para desarrolladores que buscan destacar en el mundo tech**