#!/usr/bin/env node

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Verificando configuración de Gemini...');

if (!GEMINI_API_KEY || GEMINI_API_KEY === '___PRIVATE_KEY___') {
  console.error('❌ GEMINI_API_KEY no está configurada correctamente.');
  console.log('\n📝 Para configurar la clave API:');
  console.log('1. Visita: https://aistudio.google.com/app/apikey');
  console.log('2. Crea una nueva clave API de Gemini');
  console.log('3. Configura la variable de entorno:');
  console.log('   export GEMINI_API_KEY="tu_clave_aqui"');
  process.exit(1);
}

try {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  console.log('✅ Conexión con Gemini establecida correctamente');
  console.log('🧪 Realizando prueba básica...');
  
  const result = await model.generateContent('Responde con "Conexión exitosa" si puedes leer esto.');
  const response = result.response.text();
  
  console.log('📝 Respuesta de Gemini:', response);
  console.log('✅ Prueba completada exitosamente');
  
} catch (error) {
  console.error('❌ Error conectando con Gemini:', error.message);
  process.exit(1);
}
