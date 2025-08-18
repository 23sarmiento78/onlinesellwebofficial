// Script para ejecutar el workflow localmente
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Cargar variables de entorno
dotenv.config();

// Verificar que la API key esté configurada
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY no está configurada en el archivo .env');
  process.exit(1);
}

console.log('✅ Variables de entorno cargadas correctamente');
console.log('🔑 Longitud de la API Key:', process.env.GEMINI_API_KEY ? 'Configurada' : 'No configurada');

// Ejecutar los pasos del workflow
async function runWorkflow() {
  try {
    console.log('\n🚀 Iniciando flujo de trabajo...');
    
    // 1. Generar artículos educativos
    console.log('\n📝 Generando artículos educativos...');
    await executeCommand('node', ['scripts/generate-educational-articles-adsense.js', '--count=1']);
    
    // 2. Optimizar artículos
    console.log('\n⚙️ Optimizando artículos...');
    await executeCommand('node', ['scripts/optimize-articles-adsense.js']);
    
    console.log('\n✅ Flujo de trabajo completado exitosamente');
  } catch (error) {
    console.error('❌ Error en el flujo de trabajo:', error);
    process.exit(1);
  }
}

// Función auxiliar para ejecutar comandos
function executeCommand(command, args) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, args, { stdio: 'inherit', shell: true });
    
    cmd.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`El comando falló con el código ${code}`));
      }
    });
  });
}

// Ejecutar el flujo de trabajo
runWorkflow();
