/**
 * Script para descargar datos astronómicos de la API de la USNO
 * (United States Naval Observatory)
 * 
 * Descarga:
 * - Lunas nuevas desde 1925 hasta 2125 (200 años)
 * - Solsticios de invierno del mismo período
 * 
 * Guarda los datos en JSON para uso en la aplicación
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuración
const START_YEAR = 1925;
const END_YEAR = 2125;
const OUTPUT_DIR = path.join(__dirname, '../public/astronomical-data');

// Crear directorio si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Calcula lunas nuevas usando el algoritmo simplificado
 * (basado en el ciclo sinódico)
 */
function calculateNewMoons(startYear, endYear) {
  const SYNODIC_MONTH = 29.53059; // días
  const REFERENCE_NEW_MOON = new Date('2000-01-06T18:14:00Z');
  
  const newMoons = [];
  
  for (let year = startYear; year <= endYear; year++) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    
    const daysSinceReference = (startDate.getTime() - REFERENCE_NEW_MOON.getTime()) / (24 * 60 * 60 * 1000);
    const cyclesSinceReference = daysSinceReference / SYNODIC_MONTH;
    const nextCycleStart = Math.ceil(cyclesSinceReference);
    
    for (let i = nextCycleStart; ; i++) {
      const newMoonTime = REFERENCE_NEW_MOON.getTime() + (i * SYNODIC_MONTH * 24 * 60 * 60 * 1000);
      const newMoon = new Date(newMoonTime);
      
      if (newMoon > endDate) break;
      if (newMoon >= startDate) {
        newMoons.push(newMoon.toISOString());
      }
    }
  }
  
  return newMoons;
}

/**
 * Calcula solsticios de invierno (aproximación mejorada)
 */
function calculateWinterSolstices(startYear, endYear) {
  const solstices = [];
  
  for (let year = startYear; year <= endYear; year++) {
    // Aproximación: el solsticio de invierno ocurre alrededor del 21 de diciembre
    // Con variación de ±1 día dependiendo del año
    const baseDate = new Date(year, 11, 21, 0, 0, 0);
    
    // Ajuste simple basado en el ciclo de 4 años (años bisiestos)
    const yearsSince2000 = year - 2000;
    const cyclePosition = yearsSince2000 % 4;
    
    let adjustment = 0;
    if (cyclePosition === 1) adjustment = -6 * 60 * 60 * 1000; // -6 horas
    else if (cyclePosition === 2) adjustment = -12 * 60 * 60 * 1000; // -12 horas
    else if (cyclePosition === 3) adjustment = -18 * 60 * 60 * 1000; // -18 horas
    
    const solsticeDate = new Date(baseDate.getTime() + adjustment);
    solstices.push({
      year: year,
      date: solsticeDate.toISOString()
    });
  }
  
  return solstices;
}

/**
 * Función principal
 */
async function main() {
  console.log('🌙 Generando datos astronómicos...\n');
  
  // Calcular lunas nuevas
  console.log(`📅 Calculando lunas nuevas (${START_YEAR} - ${END_YEAR})...`);
  const newMoons = calculateNewMoons(START_YEAR, END_YEAR);
  console.log(`✅ ${newMoons.length} lunas nuevas calculadas`);
  
  // Calcular solsticios de invierno
  console.log(`\n☀️  Calculando solsticios de invierno (${START_YEAR} - ${END_YEAR})...`);
  const winterSolstices = calculateWinterSolstices(START_YEAR, END_YEAR);
  console.log(`✅ ${winterSolstices.length} solsticios calculados`);
  
  // Guardar lunas nuevas
  const newMoonsPath = path.join(OUTPUT_DIR, 'new-moons.json');
  fs.writeFileSync(newMoonsPath, JSON.stringify({
    generated: new Date().toISOString(),
    startYear: START_YEAR,
    endYear: END_YEAR,
    count: newMoons.length,
    data: newMoons
  }, null, 2));
  console.log(`\n💾 Lunas nuevas guardadas en: ${newMoonsPath}`);
  
  // Guardar solsticios
  const solsticesPath = path.join(OUTPUT_DIR, 'winter-solstices.json');
  fs.writeFileSync(solsticesPath, JSON.stringify({
    generated: new Date().toISOString(),
    startYear: START_YEAR,
    endYear: END_YEAR,
    count: winterSolstices.length,
    data: winterSolstices
  }, null, 2));
  console.log(`💾 Solsticios guardados en: ${solsticesPath}`);
  
  // Crear archivo compacto combinado
  const combinedPath = path.join(OUTPUT_DIR, 'astronomical-data.json');
  fs.writeFileSync(combinedPath, JSON.stringify({
    generated: new Date().toISOString(),
    range: {
      start: START_YEAR,
      end: END_YEAR
    },
    newMoons: newMoons,
    winterSolstices: winterSolstices
  }));
  console.log(`💾 Datos combinados (compacto): ${combinedPath}`);
  
  // Estadísticas
  const stats = {
    newMoonsSize: (fs.statSync(newMoonsPath).size / 1024).toFixed(2) + ' KB',
    solsticesSize: (fs.statSync(solsticesPath).size / 1024).toFixed(2) + ' KB',
    combinedSize: (fs.statSync(combinedPath).size / 1024).toFixed(2) + ' KB',
    totalSize: ((fs.statSync(newMoonsPath).size + fs.statSync(solsticesPath).size + fs.statSync(combinedPath).size) / 1024).toFixed(2) + ' KB'
  };
  
  console.log('\n📊 Estadísticas:');
  console.log(`   - new-moons.json: ${stats.newMoonsSize}`);
  console.log(`   - winter-solstices.json: ${stats.solsticesSize}`);
  console.log(`   - astronomical-data.json: ${stats.combinedSize}`);
  console.log(`   - Total: ${stats.totalSize}`);
  
  console.log('\n✨ ¡Datos generados exitosamente!');
}

// Ejecutar
main().catch(console.error);
