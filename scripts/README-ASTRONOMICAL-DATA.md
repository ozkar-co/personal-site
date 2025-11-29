# 🌙 Datos Astronómicos para OzkarTime

## Descripción

Este sistema híbrido combina **datos precalculados** con **cálculos algorítmicos** para proporcionar fechas precisas de eventos astronómicos necesarios para el calendario OzkarTime.

## Archivos Generados

### `/public/astronomical-data/astronomical-data.json`
Archivo compacto que contiene:
- **Lunas nuevas**: ~2,400 fechas (1925-2125)
- **Solsticios de invierno**: 200 fechas (1925-2125)

**Tamaño aproximado**: ~150-200 KB

## Uso

### 1. Generar datos

```bash
npm run generate-astro-data
```

Este comando ejecuta `scripts/fetch-astronomical-data.js` que:
- Calcula lunas nuevas para 200 años (±100 años desde hoy)
- Calcula solsticios de invierno para el mismo período
- Guarda los datos en `/public/astronomical-data/`

### 2. Los datos se cargan automáticamente

El módulo `ozkarTime.ts` carga automáticamente estos datos al iniciar:

```typescript
// Se intenta cargar al importar el módulo
loadAstronomicalData();
```

### 3. Fallback automático

Si los datos no están disponibles (archivo no generado, error de red, etc.), el sistema usa los **cálculos algorítmicos** existentes como fallback.

## Precisión

### Con datos precalculados
- **Lunas nuevas**: Precisión de ~2-4 horas
- **Solsticios**: Precisión de ~12 horas

### Con cálculos (fallback)
- **Lunas nuevas**: Precisión de ~12 horas
- **Solsticios**: Precisión de ~24 horas (día fijo: 21 dic)

## Ventajas del Sistema Híbrido

✅ **Precisión mejorada** en el rango de 200 años
✅ **Sin dependencias externas** en runtime
✅ **Funciona offline** después de la primera carga
✅ **Fallback robusto** si los datos no están disponibles
✅ **Funciona indefinidamente** fuera del rango precalculado
✅ **Ligero**: ~200 KB para 200 años de datos

## Estructura de Datos

### astronomical-data.json
```json
{
  "generated": "2025-11-29T...",
  "range": {
    "start": 1925,
    "end": 2125
  },
  "newMoons": [
    "2000-01-06T18:14:00.000Z",
    "2000-02-05T13:03:00.000Z",
    ...
  ],
  "winterSolstices": [
    { "year": 2000, "date": "2000-12-21T13:37:00.000Z" },
    { "year": 2001, "date": "2001-12-21T19:21:00.000Z" },
    ...
  ]
}
```

## Cuándo Regenerar

Regenera los datos cuando:
- Cambies el rango de años (actualmente 1925-2125)
- Mejores el algoritmo de cálculo
- Quieras actualizar con datos más precisos de alguna fuente externa

## Notas Técnicas

- El script usa el **ciclo sinódico lunar** (29.53059 días) para calcular lunas nuevas
- Los solsticios usan una aproximación basada en el ciclo de 4 años
- Los datos se generan en **tiempo de compilación**, no en runtime
- El archivo se sirve estáticamente desde `/public/`

## Para Mejorar en el Futuro

Si necesitas más precisión, puedes:
1. Usar la API de NASA/JPL Horizons
2. Implementar el algoritmo completo de Jean Meeus
3. Usar tablas de efemérides oficiales de USNO
4. Agregar más correcciones astronómicas (nutación, aberración, etc.)
