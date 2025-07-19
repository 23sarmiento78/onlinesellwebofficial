// scripts/check-schedule.js
// Verifica y muestra información sobre el horario de ejecución del workflow

const cron = require('cron-parser');

function checkSchedule() {
  console.log('🕐 Verificando horario de ejecución del workflow...\n');
  
  // Configuración actual
  const cronExpression = '0 19 * * *'; // 19:00 UTC = 16:00 ART
  const timezone = 'America/Argentina/Buenos_Aires';
  
  console.log('📅 Configuración actual:');
  console.log(`   Cron: ${cronExpression}`);
  console.log(`   UTC: 19:00 (7:00 PM)`);
  console.log(`   Argentina: 16:00 (4:00 PM)`);
  console.log(`   Zona horaria: ${timezone}\n`);
  
  try {
    // Parsear la expresión cron
    const parser = cron.parseExpression(cronExpression);
    
    console.log('📋 Próximas ejecuciones:');
    for (let i = 0; i < 5; i++) {
      const next = parser.next();
      const date = new Date(next.toDate());
      
      // Convertir a hora argentina
      const argentinaTime = new Date(date.toLocaleString("en-US", {timeZone: timezone}));
      
      console.log(`   ${i + 1}. ${argentinaTime.toLocaleString('es-AR', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
      })}`);
    }
    
    console.log('\n✅ El workflow se ejecutará diariamente a las 16:00 (4:00 PM) hora argentina');
    console.log('🌍 Esto corresponde a las 19:00 (7:00 PM) UTC');
    
  } catch (error) {
    console.error('❌ Error al parsear la expresión cron:', error.message);
  }
  
  console.log('\n📝 Información adicional:');
  console.log('   • El workflow se ejecuta automáticamente todos los días');
  console.log('   • También se puede ejecutar manualmente desde GitHub Actions');
  console.log('   • Genera 4 artículos nuevos cada día');
  console.log('   • Actualiza el sitemap automáticamente');
  console.log('   • Hace commit y push de los cambios');
  
  // Verificar si es hora de ejecución
  const now = new Date();
  const argentinaNow = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
  const currentHour = argentinaNow.getHours();
  const currentMinute = argentinaNow.getMinutes();
  
  console.log('\n🕐 Hora actual en Argentina:', argentinaNow.toLocaleString('es-AR', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }));
  
  if (currentHour === 16 && currentMinute === 0) {
    console.log('🎯 ¡Es hora de ejecutar el workflow!');
  } else {
    const hoursUntilNext = 16 - currentHour;
    const minutesUntilNext = 0 - currentMinute;
    
    if (hoursUntilNext < 0) {
      // Ya pasó la hora de hoy, calcular para mañana
      const hoursUntilTomorrow = 24 + hoursUntilNext;
      console.log(`⏰ Próxima ejecución en ${hoursUntilTomorrow} horas y ${Math.abs(minutesUntilNext)} minutos`);
    } else {
      console.log(`⏰ Próxima ejecución en ${hoursUntilNext} horas y ${Math.abs(minutesUntilNext)} minutos`);
    }
  }
}

// Función para verificar la zona horaria
function checkTimezone() {
  console.log('\n🌍 Información de zona horaria:');
  console.log('   Argentina: UTC-3 (horario estándar)');
  console.log('   Argentina: UTC-3 (horario de verano)');
  console.log('   GitHub Actions se ejecuta en UTC');
  console.log('   Conversión: ART = UTC - 3 horas');
}

checkSchedule();
checkTimezone(); 