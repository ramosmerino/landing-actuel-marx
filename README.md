# Landing Actuel Marx Internvenciones

Sitio web de Actuel Marx Internvenciones, una revista dedicada a la reflexión política y filosófica.

> ✍️ **¿Necesitas subir un número, una convocatoria o una entrada de blog y no
> sabes programar?** Sigue la guía paso a paso en [INSTRUCTIVO.md](./INSTRUCTIVO.md) — no requiere saber Git, Astro ni Markdown.

## 📖 Descripción

Este sitio web presenta el catálogo de publicaciones de Actuel Marx Internvenciones. El sitio cuenta con un diseño único que refleja la identidad visual de la revista.

### ✨ Características

- 📱 Completamente responsivo (escritorio, tablet y móvil)
- 🔍 SEO optimizado con meta tags y OpenGraph
- 🌐 Soporte para múltiples idiomas (español principal)
- 📖 Sistema de blog integrado para artículos y publicaciones
- ⚡ Alto rendimiento con Astro

## 🚀 Instalación

### Prerrequisitos

- Node.js 22+ o superior
- pnpm (recomendado) o npm

### Pasos de instalación

1. **Clonar el repositorio**

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo**

   ```bash
   pnpm dev
   ```

4. **Abrir en el navegador**
   Visita [http://localhost:4321](http://localhost:4321) para ver el sitio en desarrollo.

## 🛠️ Uso y Desarrollo

### Comandos disponibles

| Comando            | Acción                                               |
| :----------------- | :--------------------------------------------------- |
| `pnpm install`     | Instala las dependencias del proyecto                |
| `pnpm dev`         | Inicia el servidor de desarrollo en `localhost:4321` |
| `pnpm build`       | Construye el sitio para producción en `./dist/`      |
| `pnpm preview`     | Previsualiza la versión de producción localmente     |
| `pnpm astro check` | Verifica tipos y errores en el código                |
| `pnpm astro sync`  | Sincroniza tipos de colecciones de contenido         |

### Estructura del proyecto

```
├── public/                # Archivos estáticos (imágenes, fuentes, favicon)
│   └── img/               # Imágenes del sitio web
├── src/
│   ├── components/        # Componentes Astro reutilizables
│   │   ├── BaseHead.astro # Configuración del head y meta tags
│   │   ├── Footer.astro   # Pie de página con animación
│   │   ├── Menu.astro     # Navegación lateral con diseño geométrico
│   │   └── FormattedDate.astro # Formateo de fechas
│   ├── layouts/           # Layouts para páginas
│   │   └── BlogPost.astro # Layout para artículos del blog
│   ├── pages/             # Páginas del sitio web
│   │   ├── index.astro    # Página principal
│   │   ├── catalogo/      # Página de catálogo de libros
│   │   ├── contacto/      # Página de información de contacto
│   │   ├── distribucion/  # Página de puntos de distribución
│   │   ├── proyecto/      # Página del proyecto editorial
│   │   └── blog/          # Sección de blog
│   ├── styles/            # Estilos globales
│   └── content/           # Colecciones de contenido Markdown
│       └── blog/          # Artículos del blog
├── astro.config.mjs       # Configuración de Astro
├── package.json           # Dependencias y scripts
└── tsconfig.json          # Configuración de TypeScript
```

### Desarrollo

1. **Modificar contenido**: Edita los archivos `.astro` en `src/pages/`
2. **Agregar componentes**: Crea nuevos componentes en `src/components/`
3. **Contenido del blog**: Agrega archivos Markdown en `src/content/blog/`

### Páginas disponibles

- **/** - Página principal
- **/numero-actual** - Número actual de la revista
- **/contactanos** - Información de contacto
- **/normas-de-publicacion** - Normas de publicación
- **/numeros-anteriores** - Números anteriores

## 🎨 Personalización

### Colores de marca

TBD

### Tipografía

TBD

## 📦 Despliegue

### Construir para producción

```bash
pnpm build
```

Los archivos generados se encontrarán en el directorio `dist/`.

### Desplegar en plataformas

El sitio está optimizado para desplegarse en:

- **Netlify**: Simplemente conecta el repositorio
- **Vercel**: Importa el proyecto desde Git
- **GitHub Pages**: Usa la acción de GitHub Pages

## 🤝 Contribución

Este proyecto es mantenido por la revista Actuel Marx Internvenciones. Para contribuciones:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
