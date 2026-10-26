import hash from 'object-hash';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { leerNotas, guardarNotas, registrarLog, NOTAS_PATH, DATA_DIR } from './almacen.js';
import { getTimeStamp, getLongTime, getShortDate } from 'fechas-bitacora-jonathan';

/**
 * Agrega una nueva nota.
 * @param {string} texto - Texto de la nota.
 * @param {string} etiqueta - Etiqueta opcional.
 */
export const agregarNota = (texto, etiqueta = 'general') => {
    if (!texto || texto.trim() === '') {
        console.error('Error: El texto de la nota no puede estar vacío.');
        return;
    }

    const notas = leerNotas();
    if (notas === null) return;

    const id = hash(texto).substring(0, 8);
    const notaDuplicada = notas.find(n => n.id === id);

    if (notaDuplicada) {
        const msg = `Ya existe una nota igual (id ${id}). No se guardó.`;
        console.log(msg);
        registrarLog('agregar', msg);
        return;
    }

    const nuevaNota = {
        id,
        texto,
        etiqueta,
        fecha: getTimeStamp()
    };

    notas.push(nuevaNota);
    guardarNotas(notas);

    const msg = `Nota guardada [${id}] (${etiqueta}) — ${getLongTime('es-ES', nuevaNota.fecha)}`;
    console.log(msg);
    registrarLog('agregar', msg);
};

/**
 * Lista las últimas N notas.
 * @param {number} n - Cantidad de notas a mostrar.
 */
export const listarNotas = (n = 5) => {
    let cantidad = parseInt(n);
    if (isNaN(cantidad) || cantidad <= 0) {
        console.log('Aviso: N no es válido, se mostrarán las últimas 5 notas.');
        cantidad = 5;
    }

    const notas = leerNotas();
    if (notas === null) return;

    if (notas.length === 0) {
        console.log('No hay notas registradas.');
        return;
    }

    const ultimas = notas.slice(-cantidad).reverse();
    ultimas.forEach(nota => {
        console.log(`[${nota.id}] (${nota.etiqueta}) ${getShortDate('es-ES', nota.fecha)} — ${nota.texto}`);
    });

    registrarLog('listar', `Se listaron ${ultimas.length} notas.`);
};

/**
 * Busca notas por una palabra clave.
 * @param {string} palabra - Palabra a buscar.
 */
export const buscarNotas = (palabra) => {
    if (!palabra) {
        console.error('Error: Debe proporcionar una palabra para buscar.');
        return;
    }

    const notas = leerNotas();
    if (notas === null) return;

    const resultados = notas.filter(n => n.texto.toLowerCase().includes(palabra.toLowerCase()));

    if (resultados.length === 0) {
        console.log(`No se encontraron notas con la palabra: "${palabra}"`);
    } else {
        resultados.forEach(nota => {
            console.log(`[${nota.id}] (${nota.etiqueta}) ${getShortDate('es-ES', nota.fecha)} — ${nota.texto}`);
        });
    }

    registrarLog('buscar', `Búsqueda de "${palabra}" devolvió ${resultados.length} resultados.`);
};

/**
 * Borra una nota por su ID.
 * @param {string} id - ID de la nota a borrar.
 */
export const borrarNota = (id) => {
    if (!id) {
        console.error('Error: Debe proporcionar un ID para borrar.');
        return;
    }

    const notas = leerNotas();
    if (notas === null) return;

    const indice = notas.findIndex(n => n.id === id);

    if (indice === -1) {
        const msg = `Error: No se encontró ninguna nota con el ID ${id}.`;
        console.error(msg);
        registrarLog('borrar', msg);
        return;
    }

    notas.splice(indice, 1);
    guardarNotas(notas);

    const msg = `Nota con ID ${id} eliminada correctamente.`;
    console.log(msg);
    registrarLog('borrar', msg);
};

/**
 * Crea un respaldo de las notas en la carpeta respaldos/.
 */
export const respaldarNotas = () => {
    const RESPALDOS_DIR = path.join(DATA_DIR, '..', 'respaldos');
    
    if (!fs.existsSync(RESPALDOS_DIR)) {
        fs.mkdirSync(RESPALDOS_DIR, { recursive: true });
    }

    const timestamp = getTimeStamp();
    const nombreRespaldo = `notas_${timestamp}.json`;
    const rutaRespaldo = path.join(RESPALDOS_DIR, nombreRespaldo);

    try {
        fs.copyFileSync(NOTAS_PATH, rutaRespaldo);
        const msg = `Respaldo creado con éxito: ${nombreRespaldo}`;
        console.log(msg);
        registrarLog('respaldar', msg);
    } catch (error) {
        const msg = `Error al crear el respaldo: ${error.message}`;
        console.error(msg);
        registrarLog('respaldar', msg);
    }
};

/**
 * Exporta las notas a un archivo de texto y lo mueve a la carpeta destino.
 * @param {string} rutaDestino - Ruta absoluta donde mover el archivo.
 */
export const exportarNotas = (rutaDestino) => {
    const notas = leerNotas();
    if (notas === null) return;

    const SALIDA_DIR = path.join(DATA_DIR, '..', 'salida');
    if (!fs.existsSync(SALIDA_DIR)) {
        fs.mkdirSync(SALIDA_DIR, { recursive: true });
    }

    const archivoExportacion = 'exportacion.txt';
    const rutaTemporal = path.join(SALIDA_DIR, archivoExportacion);

    // Generar contenido legible
    let contenido = 'BITÁCORA DE ESTUDIOS\n';
    contenido += '====================\n\n';
    notas.forEach(nota => {
        contenido += `[${nota.id}] (${nota.etiqueta}) ${getShortDate('es-ES', nota.fecha)}\n`;
        contenido += `${nota.texto}\n`;
        contenido += '--------------------\n';
    });

    fs.writeFileSync(rutaTemporal, contenido);

    // Determinar destino final
    let destinoFinal = rutaDestino || os.homedir();
    
    if (!path.isAbsolute(destinoFinal)) {
        const msg = `Error: La ruta "${destinoFinal}" no es absoluta.`;
        console.error(msg);
        registrarLog('exportar', msg);
        return;
    }

    if (!fs.existsSync(destinoFinal)) {
        const msg = `Error: La carpeta destino "${destinoFinal}" no existe.`;
        console.error(msg);
        registrarLog('exportar', msg);
        return;
    }

    const rutaFinal = path.join(destinoFinal, archivoExportacion);

    try {
        // Intentar mover (renameSync)
        fs.renameSync(rutaTemporal, rutaFinal);
        const msg = `Notas exportadas y movidas a: ${rutaFinal}`;
        console.log(msg);
        registrarLog('exportar', msg);
    } catch (error) {
        if (error.code === 'EXDEV') {
            // Si falla por discos distintos, copiar y borrar
            fs.copyFileSync(rutaTemporal, rutaFinal);
            fs.unlinkSync(rutaTemporal);
            const msg = `Notas exportadas (vía copia) a: ${rutaFinal}`;
            console.log(msg);
            registrarLog('exportar', msg);
        } else {
            const msg = `Error al exportar: ${error.message}`;
            console.error(msg);
            registrarLog('exportar', msg);
        }
    }
};

/**
 * Muestra la ayuda del programa.
 */
export const mostrarAyuda = () => {
    console.log(`
Uso: npm start -- <comando> [argumentos]

Comandos disponibles:
  agregar "<texto>" [etiqueta]  Guarda una nota. Etiqueta por defecto: 'general'.
  listar [N]                   Muestra las últimas N notas (por defecto 5).
  buscar <palabra>             Muestra notas que contienen la palabra.
  borrar <id>                  Elimina la nota con ese ID.
  respaldar                    Crea una copia de seguridad de las notas.
  exportar [ruta]              Exporta las notas a un archivo legible.
  ayuda                        Muestra este mensaje de ayuda.
    `);
    registrarLog('ayuda', 'Se mostró la ayuda.');
};
