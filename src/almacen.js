import fs from 'node:fs';
import path from 'node:path';
import { getLongTime } from 'fechas-bitacora-jonathan';

const __dirname = import.meta.dirname;
const DATA_DIR = path.join(__dirname, '..', 'data');
const NOTAS_PATH = path.join(DATA_DIR, 'notas.json');
const LOG_PATH = path.join(DATA_DIR, 'bitacora.log');

/**
 * Asegura que la carpeta de datos exista.
 */
const asegurarCarpetaData = () => {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
};

/**
 * Lee las notas desde el archivo JSON.
 * @returns {Array} Arreglo de notas.
 */
export const leerNotas = () => {
    asegurarCarpetaData();
    
    if (!fs.existsSync(NOTAS_PATH)) {
        fs.writeFileSync(NOTAS_PATH, JSON.stringify([], null, 2));
        return [];
    }

    try {
        const contenido = fs.readFileSync(NOTAS_PATH, 'utf-8');
        return JSON.parse(contenido);
    } catch (error) {
        console.error(`Error: El archivo de notas (${NOTAS_PATH}) está dañado.`);
        console.error('Se recomienda revisar el archivo manualmente o restaurar un respaldo.');
        return null; // Retornar null para indicar error de lectura
    }
};

/**
 * Guarda las notas en el archivo JSON.
 * @param {Array} notas - Arreglo de notas a guardar.
 */
export const guardarNotas = (notas) => {
    asegurarCarpetaData();
    fs.writeFileSync(NOTAS_PATH, JSON.stringify(notas, null, 2));
};

/**
 * Registra una acción en la bitácora de logs.
 * @param {string} comando - Comando ejecutado.
 * @param {string} resultado - Resultado de la acción.
 */
export const registrarLog = (comando, resultado) => {
    asegurarCarpetaData();
    const fecha = getLongTime();
    const linea = `${fecha} | ${comando} | ${resultado}\n`;
    fs.appendFileSync(LOG_PATH, linea);
};

export { DATA_DIR, NOTAS_PATH, LOG_PATH };
