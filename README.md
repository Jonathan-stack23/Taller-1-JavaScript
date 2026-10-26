# bitacora-cli

Una aplicación de consola para llevar un registro de lo que aprendes cada día, construida con Node.js como parte del Taller 1.

## Instalación

1. Clona el repositorio.
2. Navega a la carpeta del proyecto.
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. (Opcional) Si el paquete de fechas no está en npm, vinculalo localmente:
   ```bash
   cd ../fechas-bitacora-jonathan
   npm link
   cd ../bitacora-cli
   npm link fechas-bitacora-jonathan
   ```

## Comandos Disponibles

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `agregar "<texto>" [etiqueta]` | Guarda una nota con una etiqueta opcional. | `npm start -- agregar "Aprendí fs" nodejs` |
| `listar [N]` | Muestra las últimas N notas (por defecto 5). | `npm start -- listar 3` |
| `buscar <palabra>` | Busca notas que contengan la palabra. | `npm start -- buscar fs` |
| `borrar <id>` | Elimina la nota con el ID especificado. | `npm start -- borrar 3f9a1c2e` |
| `respaldar` | Crea una copia de seguridad en la carpeta `respaldos/`. | `npm start -- respaldar` |
| `exportar [ruta]` | Exporta las notas a un archivo TXT en la ruta especificada. | `npm start -- exportar C:\Users\usuario\Desktop` |
| `ayuda` | Muestra la ayuda del programa. | `npm start -- ayuda` |

## Reflexiones del Taller

### 1. ¿Por qué elegiste CommonJS o ES Modules? ¿Qué cambió en tu package.json y en la forma de importar?
Elegí **ES Modules** (`"type": "module"`) porque es el estándar moderno de JavaScript en Node.js, lo que permite una mejor compatibilidad con herramientas actuales y un sistema de módulos más limpio. En el `package.json` se añadió la propiedad `"type": "module"`, y en el código se utiliza `import` en lugar de `require()`, además de requerir extensiones de archivo (como `.js`) para importaciones locales.

### 2. fs, object-hash y fechas (tu paquete) se importan distinto del módulo local notas.js. ¿Cuál es la diferencia y cómo decide Node dónde buscar cada uno?
Native modules (`fs`) y paquetes de `node_modules` (`object-hash`, `fechas-bitacora-jonathan`) se importan por nombre, y Node los busca primero en su núcleo y luego en la carpeta `node_modules`. Los módulos locales (`notas.js`) se importan usando rutas relativas (ej. `./notas.js`), indicándole a Node que busque en el sistema de archivos relativo al archivo actual.

### 3. ¿Por qué data/notas.json se resuelve distinto si ejecutas el programa desde otra carpeta?
Porque las rutas relativas se resuelven a partir del **Current Working Directory** (CWD), que es la carpeta desde donde se ejecuta el comando. Para solucionar esto, usamos `import.meta.dirname` (o `__dirname` en CJS) para construir rutas absolutas basadas en la ubicación física del script, asegurando que siempre encuentre la carpeta `data/` sin importar desde dónde se ejecute.

### 4. ¿Por qué node_modules/ no se sube a Git y cómo recupera otra persona las dependencias?
`node_modules/` no se sube porque es muy pesado y contiene binarios específicos del sistema operativo. En su lugar, se sube el `package.json` (y el `package-lock.json`), permitiendo que cualquier persona recupere las dependencias exactas ejecutando `npm install`.

### 5. ¿Qué diferencia viste al importar tu paquete CommonJS desde tu proyecto?
Al ser un proyecto ES Modules, Node.js permite importar paquetes CommonJS sin problemas usando la sintaxis `import`. La principal diferencia es que el paquete CJS usa `module.exports` para exportar sus funciones, pero desde ESM las recibimos de forma transparente como si fueran exportaciones nombradas o por defecto, gracias a la interoperabilidad nativa de Node.js.
