# Instructivo: cómo agregar contenido al sitio

Esta guía es para cualquier persona del equipo editorial que necesite subir un
**número nuevo**, una **convocatoria**, una **entrada de blog**, un **término de
la enciclopedia**, una **cápsula/podcast** o una **noticia/evento** al sitio de
Actuel Marx/Intervenciones — **sin necesidad de saber programar, usar Git ni
conocer Markdown a fondo.**

No vas a tocar código. Vas a copiar un archivo de ejemplo, cambiar algunos
datos y guardar. Eso es todo.

---

## 1. Lo mínimo que necesitas saber

- El sitio se edita subiendo/editando archivos en **GitHub**, que es donde vive
  el código. Vas a usar la versión de GitHub en el navegador, **no** hace falta
  instalar nada en tu computador.
- Cada "número anterior", "convocatoria", "entrada de blog", etc. es **un
  archivo de texto** con extensión `.mdx`. Ese archivo tiene dos partes:
  1. Un bloque arriba, entre líneas `---`, llamado **frontmatter**, con los
     datos del contenido (título, fecha, resumen, etc.). Es como llenar un
     formulario.
  2. El **cuerpo** del texto, debajo del segundo `---`, escrito en
     **Markdown** (un texto simple con algunos símbolos para dar formato,
     ver la sección 3).
- Cuando guardas un cambio en GitHub, el sitio se **publica solo** en unos
  minutos (hay un robot que reconstruye y sube la página automáticamente).
  No necesitas avisarle a nadie ni ejecutar nada.

---

## 2. Cómo editar un archivo en GitHub (paso a paso)

1. Entra al repositorio del sitio en GitHub (pide el enlace a quien te dio
   este instructivo si no lo tienes).
2. Inicia sesión con tu cuenta de GitHub.
3. Navega por las carpetas hasta llegar a la sección que quieres editar (más
   abajo indicamos la carpeta exacta para cada tipo de contenido).
4. Para **crear un archivo nuevo copiando uno de ejemplo**:
   - Abre el archivo de ejemplo (busca uno que termine en `-ejemplo.mdx`
     dentro de la carpeta que te interesa).
   - Copia todo su contenido (con el botón de copiar o seleccionando todo el
     texto).
   - Vuelve a la carpeta, usa el botón **"Add file" → "Create new file"**.
   - Ponle un nombre nuevo al archivo (ver sección 4: "Cómo nombrar el
     archivo").
   - Pega el contenido copiado y edítalo con tus datos.
5. Para **editar un archivo que ya existe**, ábrelo y haz clic en el ícono de
   lápiz (✏️) arriba a la derecha.
6. Cuando termines, bajà hasta el final de la página. Ahí vas a ver un botón
   verde que dice **"Commit changes..."** (o "Propose changes"). Haz clic,
   escribe una frase corta describiendo qué hiciste (por ejemplo:
   *"Agrega número 36"*) y confirma.
7. Listo. El sitio se actualiza solo en unos minutos.

> 💡 Si GitHub te ofrece crear una "nueva rama" (*branch*) o un *pull
> request* en vez de guardar directo, puedes aceptarlo igual — alguien del
> equipo técnico solo tiene que aprobar el cambio (o pídele que te habilite
> el permiso para guardar directo en `main`).

---

## 3. Markdown básico (lo único que necesitas)

El cuerpo del archivo (todo lo que va **después** del segundo `---`) se
escribe así:

```markdown
Este es un párrafo normal.

Este es otro párrafo, separado del anterior por una línea en blanco.

**Este texto queda en negrita** y *este queda en cursiva*.

Puedes armar un enlace [así](https://www.ejemplo.cl).

- Esto es
- una lista
- con viñetas

## Este es un subtítulo
```

Con eso alcanza para el 95% de los casos. No necesitas nada más.

---

## 4. Cómo nombrar el archivo

Usa solo minúsculas, sin tildes, sin espacios ni símbolos raros — separa las
palabras con guiones medios (`-`) y termina siempre en `.mdx`. Ejemplos:

- `numero-36.mdx`
- `convocatoria-dossier-genero-2026.mdx`
- `nueva-columna-sobre-inflacion.mdx`

---

## 5. Qué carpeta usar según lo que quieras subir

Todo el contenido vive dentro de `src/content/`. Cada tipo de contenido
tiene su propia carpeta y su propio archivo de ejemplo para copiar.

### 📖 Número anterior de la revista

- Carpeta: `src/content/numeros/`
- Archivo de ejemplo: `numero-34.mdx`
- Datos a completar en el frontmatter:
  - `title`: por ejemplo `"N°36"`
  - `number`: el número de la edición, sin comillas, por ejemplo `36`
  - `pubDate`: fecha de publicación, formato `AAAA-MM-DD` (ej: `2026-06-01`)
  - `summary`: resumen o tabla de contenidos, en una frase
  - `cover` *(opcional)*: la ruta de la imagen de portada, ver sección 6
  - `purchaseUrl` *(opcional)*: enlace de venta, si existe

### 📢 Convocatoria

- Carpeta: `src/content/convocatorias/`
- Archivo de ejemplo: `convocatoria-ejemplo.mdx`
- Datos a completar:
  - `title`, `pubDate`, `summary` (igual que arriba)
  - `deadline` *(opcional)*: fecha límite, formato `AAAA-MM-DD`
  - `status`: `abierta` o `cerrada`

### ✍️ Blog (columnas de opinión / cuadernos temáticos / separatas)

- Carpetas (una por sub-sección):
  - `src/content/blog/columnas-de-opinion/`
  - `src/content/blog/cuadernos-tematicos/`
  - `src/content/blog/separatas/`
- Usa el ejemplo de la carpeta que corresponda (`columna-ejemplo.mdx`,
  `cuaderno-ejemplo.mdx` o `separata-ejemplo.mdx`).
- Datos a completar:
  - `title`, `pubDate`, `summary`
  - `author` *(opcional)*: nombre de quien escribe
  - `section`: **debe decir exactamente** `columnas-de-opinion`,
    `cuadernos-tematicos` o `separatas` según en qué carpeta lo pusiste (no
    lo cambies aunque muevas el archivo)
  - `tags` *(opcional)*: lista de palabras clave, por ejemplo
    `["columna", "género"]`

### 📚 Enciclopedia

- Carpeta: `src/content/enciclopedia/`
- Archivo de ejemplo: `termino-ejemplo.mdx`
- Datos a completar: `title` (el término), `summary` (definición breve),
  `pubDate` y `tags` son opcionales.

### 🎙️ Cápsulas / Podcast

- Carpeta: `src/content/capsulas/`
- Archivo de ejemplo: `capsula-ejemplo.mdx`
- Datos a completar:
  - `title`, `pubDate`, `summary`
  - `videoUrl` *(opcional)*: para incrustar un video de YouTube, usa el
    enlace en formato "embed", por ejemplo
    `https://www.youtube.com/embed/XXXXXXXXXXX` (lo consigues en YouTube
    con "Compartir" → "Insertar")
  - `audioUrl` *(opcional)*: enlace directo a un archivo de audio
  - `duration` *(opcional)*: por ejemplo `"12:34"`

### 📰 Noticias y eventos

- Carpeta: `src/content/noticias/`
- Archivo de ejemplo: `noticia-ejemplo.mdx`
- Datos a completar:
  - `title`, `pubDate`, `summary`
  - `eventDate` *(opcional)*: si es un evento con fecha propia
  - `location` *(opcional)*: lugar del evento

---

## 6. Cómo subir una portada nueva a la galería de "Números Anteriores"

Las portadas se optimizan automáticamente (se comprimen y se generan varios
tamaños), por eso viven en una carpeta distinta a las demás imágenes y se
registran en un archivo de lista.

1. Ve a la carpeta `src/assets/portadas/`.
2. Usa **"Add file" → "Upload files"** y arrastra tu imagen.
3. Nómbrala igual que los archivos de contenido: minúsculas, sin tildes ni
   espacios, con guiones medios. Ejemplo: `actuel-marx-36.webp`.
4. Abre el archivo `src/content/portadas.json` y agrega un bloque nuevo a la
   lista (cópialo de otro que ya exista y edítalo), por ejemplo:
   ```json
   {
       "id": "36",
       "number": 36,
       "title": "Título de la edición",
       "cover": "../assets/portadas/actuel-marx-36.webp"
   }
   ```
   - No olvides la coma (`,`) después del bloque anterior si agregas el
     tuyo al final de la lista.
   - `cover` debe decir exactamente `../assets/portadas/` seguido del
     nombre del archivo que subiste en el paso 2.

Para cualquier otra imagen que **no** sea una portada (por ejemplo, el
logo), sube el archivo a la carpeta `public/img/` y referéncialo con
`/img/` + el nombre del archivo.

---

## 7. ¿Cómo sé si funcionó?

Después de guardar el cambio en GitHub, espera unos minutos y visita
<https://ramosmerino.github.io/landing-actuel-marx/> para revisar que tu
contenido aparezca. Si algo no se ve como esperabas, revisa que:

- Las fechas tengan el formato `AAAA-MM-DD`.
- Los textos con comillas, dos puntos o símbolos especiales estén entre
  comillas (`"así"`).
- El archivo termine en `.mdx` y esté en la carpeta correcta.

Si algo falla y no logras arreglarlo, avisa al equipo técnico con el nombre
del archivo que creaste o editaste.

---

## 8. Para quien quiera profundizar (opcional)

Nadie necesita leer esto para trabajar, pero si te interesa entender mejor
las herramientas detrás del sitio:

- **Markdown** (el formato del texto): [Guía básica de Markdown en
  GitHub](https://docs.github.com/es/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
  y [Markdown Guide](https://www.markdownguide.org/basic-syntax/) (en inglés).
- **Editar archivos en GitHub**: [Guía oficial de
  GitHub](https://docs.github.com/es/repositories/working-with-files/managing-files/editing-files).
- **Git** (el sistema que guarda el historial de cambios): [Git Handbook de
  GitHub](https://docs.github.com/es/get-started/using-git/about-git) (en inglés).
- **Astro** (el motor con el que está construido el sitio) y sus
  "colecciones de contenido" (la forma en la que se organizan los archivos
  que edita esta guía): [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) (en inglés).
