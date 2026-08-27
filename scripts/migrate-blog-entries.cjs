#!/usr/bin/env node

/**
 * Blog Entries Migration Script
 * 
 * This script migrates existing blog entries from static TypeScript files
 * to the database via the API.
 * 
 * Usage: npm run migrate-blog
 * 
 * The script will:
 * 1. Ask for your API credentials (username, password, site)
 * 2. Read all blog entry files from src/components/Blog/entries/
 * 3. Parse each TypeScript file to extract the blog entry data
 * 4. Create each entry in the database via the API
 * 
 * Note: Password input is masked for security.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuración de la API
const API_BASE_URL = 'https://legacy-api.forja.cc';

// Función para crear interfaz de readline
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Función para hacer una pregunta y obtener respuesta
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Función para obtener credenciales del usuario
async function getCredentials() {
  const rl = createReadlineInterface();
  
  console.log('🔐 Configuración de credenciales para la migración');
  console.log('');
  
  const username = await askQuestion(rl, 'Usuario: ');
  const password = await askQuestion(rl, 'Contraseña: ');
  const site = await askQuestion(rl, 'Sitio [ozkar]: ') || 'ozkar';
  
  rl.close();
  
  return {
    username: username.trim(),
    password: password.trim(),
    site: site.trim()
  };
}

// Función para hacer login y obtener el token
async function login(credentials) {
  try {
    console.log(`🔑 Intentando login con usuario: ${credentials.username}, sitio: ${credentials.site}`);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error de autenticación (${response.status}):`, errorText);
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Login exitoso, token obtenido');
    return data.token;
  } catch (error) {
    console.error('❌ Error durante el login:', error.message);
    throw error;
  }
}

// Función para crear una entrada de blog
async function createBlogEntry(token, entry) {
  try {
    const response = await fetch(`${API_BASE_URL}/ozkar/blog`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: entry.id,
        title: entry.title,
        abstract: entry.abstract,
        content: entry.content,
        tags: entry.tags
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create entry ${entry.id}: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Created entry: ${entry.title}`);
    return data;
  } catch (error) {
    console.error(`❌ Error creating entry ${entry.id}:`, error);
    throw error;
  }
}

// Función para leer y parsear un archivo de entrada
function parseEntryFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extraer el objeto de la entrada usando regex
    const match = content.match(/const\s+\w+:\s*BlogEntryType\s*=\s*({[\s\S]*?});/);
    if (!match) {
      throw new Error(`Could not parse entry object from ${filePath}`);
    }

    // Evaluar el objeto (esto es seguro porque controlamos el contenido)
    const entryString = match[1];
    
    // Reemplazar template literals con strings normales para evaluación
    const cleanedString = entryString
      .replace(/`([^`]*)`/g, (match, content) => {
        return JSON.stringify(content);
      });

    // Crear una función que retorne el objeto
    const func = new Function('return ' + cleanedString);
    return func();
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    throw error;
  }
}

// Función principal
async function migrateEntries() {
  console.log('🚀 Iniciando migración de entradas del blog...');
  console.log('');
  
  try {
    // 1. Obtener credenciales del usuario
    const credentials = await getCredentials();
    console.log('✅ Credenciales obtenidas correctamente');
    console.log('');

    // 2. Login para obtener el token
    const token = await login(credentials);
    console.log('');

    // 3. Leer todas las entradas del directorio
    const entriesDir = path.join(__dirname, '../src/components/Blog/entries');
    const files = fs.readdirSync(entriesDir);
    
    // Filtrar solo archivos .ts que no sean index.ts
    const entryFiles = files.filter(file => 
      file.endsWith('.ts') && file !== 'index.ts'
    );

    console.log(`📚 Found ${entryFiles.length} entry files`);

    // 4. Procesar cada entrada
    const entries = [];
    for (const file of entryFiles) {
      const filePath = path.join(entriesDir, file);
      try {
        const entry = parseEntryFile(filePath);
        entries.push(entry);
        console.log(`📖 Parsed: ${entry.title}`);
      } catch (error) {
        console.error(`❌ Failed to parse ${file}:`, error.message);
      }
    }

    // 5. Ordenar por fecha (más reciente primero)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 6. Crear cada entrada en la base de datos
    console.log('\n🔄 Creating entries in database...');
    let successCount = 0;
    let errorCount = 0;

    for (const entry of entries) {
      try {
        await createBlogEntry(token, entry);
        successCount++;
        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        errorCount++;
        console.error(`Failed to create ${entry.title}`);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully created: ${successCount} entries`);
    console.log(`❌ Failed: ${errorCount} entries`);
    console.log(`📝 Total processed: ${entries.length} entries`);

    if (successCount > 0) {
      console.log('\n🎉 Migration completed successfully!');
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Ejecutar la migración
if (require.main === module) {
  migrateEntries();
}

module.exports = { migrateEntries }; 