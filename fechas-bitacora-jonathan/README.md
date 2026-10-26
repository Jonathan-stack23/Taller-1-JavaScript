# fechas-bitacora-jonathan

Módulo de utilidad para formateo de fechas en español, diseñado para el proyecto bitacora-cli.

## Instalación

```bash
npm install fechas-bitacora-jonathan
```

## Uso

```javascript
const { getTimeStamp, getLongTime, getShortDate } = require('fechas-bitacora-jonathan');

console.log(getTimeStamp());
console.log(getLongTime());
console.log(getShortDate());
```

## Funciones

- `getTimeStamp()`: Devuelve la marca de tiempo actual (number).
- `getLongTime(locale, timestamp)`: Devuelve la fecha en formato largo.
- `getShortDate(locale, timestamp)`: Devuelve la fecha en formato corto (DD/MM/YYYY).
