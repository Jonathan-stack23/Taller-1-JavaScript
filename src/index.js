#!/usr/bin/env node
/**
 * Punto de entrada de la CLI "bitácora".
 *
 * Este archivo solo traduce lo que el usuario escribe en la terminal a
 * llamadas de la capa de lógica (notas.js); no contiene reglas de negocio.
 * Así, si mañana se cambia la interfaz (por ejemplo a una web), la lógica
 * de las notas se reutiliza sin tocar este archivo.
 */
import { 
    agregarNota, 
    listarNotas, 
    buscarNotas, 
    borrarNota, 
    respaldarNotas, 
    exportarNotas, 
    mostrarAyuda 
} from './notas.js';

// process.argv[0] es el ejecutable de node
// process.argv[1] es el script que se está ejecutando
// process.argv[2] es el comando
const [,, comando, ...args] = process.argv;

// El switch funciona como "tabla de comandos": cada caso corresponde a
// una operación de la bitácora y el default muestra la ayuda.
switch (comando) {
    case 'agregar':
        agregarNota(args[0], args[1]);
        break;
    case 'listar':
        listarNotas(args[0]);
        break;
    case 'buscar':
        buscarNotas(args[0]);
        break;
    case 'borrar':
        borrarNota(args[0]);
        break;
    case 'respaldar':
        respaldarNotas();
        break;
    case 'exportar':
        exportarNotas(args[0]);
        break;
    case 'ayuda':
    default:
        mostrarAyuda();
        break;
}
