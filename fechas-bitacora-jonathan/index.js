/**
 * Módulo de utilidad para el manejo de fechas (CommonJS).
 */

/**
 * Obtiene la marca de tiempo actual.
 * @returns {number} Timestamp actual.
 */
function getTimeStamp() {
    return Date.now();
}

/**
 * Obtiene una representación larga de la fecha.
 * @param {string} locale - Localización (por defecto 'es-ES').
 * @param {number} timestamp - Marca de tiempo a formatear.
 * @returns {string} Fecha formateada.
 */
function getLongTime(locale = 'es-ES', timestamp = Date.now()) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    return new Intl.DateTimeFormat(locale, options).format(new Date(timestamp));
}

/**
 * Obtiene una representación corta de la fecha.
 * @param {string} locale - Localización (por defecto 'es-ES').
 * @param {number} timestamp - Marca de tiempo a formatear.
 * @returns {string} Fecha formateada (DD/MM/YYYY).
 */
function getShortDate(locale = 'es-ES', timestamp = Date.now()) {
    return new Intl.DateTimeFormat(locale).format(new Date(timestamp));
}

module.exports = {
    getTimeStamp,
    getLongTime,
    getShortDate
};
