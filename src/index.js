#!/usr/bin/env node
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
