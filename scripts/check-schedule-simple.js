// scripts/check-schedule-simple.js
// Verificación simple del horario de ejecución

function checkSchedule() {
  console.log('🕐 Verificando horario de ejecución del workflow...\n');
  
  // Configuración actual
  console.log('📅 Configuración actual:');
  console.log('   Cron: 0 19 * * *');
  console.log('   UTC: 19:00 (7:00 PM)');
  console.log('   Argentina: 16:00 (4:00 PM)');
  console.log('   Zona horaria: America/Argentina/Buenos_Aires\n');
  
  // Calcular próximas ejecuciones
  const now = new Date();
  const argentinaOffset = -3; // UTC-3
  const argentinaTime = new Date(now.getTime() + (argentinaOffset * 60 * 60 * 1000));
  
  console.log('🕐 Hora actual en Argentina:', argentinaTime.toLocaleString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }));
  
  // Calcular próxima ejecución (16:00 ART)
  const targetHour = 16;
  const currentHour = argentinaTime.getHours();
  const currentMinute = argentinaTime.getMinutes();
  
  let hoursUntilNext = targetHour - currentHour;
  let minutesUntilNext = 0 - currentMinute;
  
  if (hoursUntilNext < 0) {
    // Ya pasó la hora de hoy, calcular para mañana
    hoursUntilNext = 24 + hoursUntilNext;
  }
  
  if (minutesUntilNext < 0) {
    hoursUntilNext -= 1;
    minutesUntilNext = 60 + minutesUntilNext;
  }
  
  console.log(`⏰ Próxima ejecución en ${hoursUntilNext} horas y ${minutesUntilNext} minutos`);
  
  // Mostrar próximas fechas
  console.log('\n📋 Próximas ejecuciones:');
  for (let i = 0; i < 5; i++) {
    const nextDate = new Date(argentinaTime);
    nextDate.setDate(nextDate.getDate() + i);
    nextDate.setHours(targetHour, 0, 0, 0);
    
    // Si ya pasó la hora de hoy, empezar desde mañana
    if (i === 0 && currentHour >= targetHour) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    
    console.log(`   ${i + 1}. ${nextDate.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}`);
  }
  
  console.log('\n✅ El workflow se ejecutará diariamente a las 16:00 (4:00 PM) hora argentina');
  console.log('🌍 Esto corresponde a las 19:00 (7:00 PM) UTC');
  
  console.log('\n📝 Información adicional:');
  console.log('   • El workflow se ejecuta automáticamente todos los días');
  console.log('   • También se puede ejecutar manualmente desde GitHub Actions');
  console.log('   • Genera 4 artículos nuevos cada día');
  console.log('   • Actualiza el sitemap automáticamente');
  console.log('   • Hace commit y push de los cambios');
  
  console.log('\n🌍 Información de zona horaria:');
  console.log('   Argentina: UTC-3 (horario estándar)');
  console.log('   Argentina: UTC-3 (horario de verano)');
  console.log('   GitHub Actions se ejecuta en UTC');
  console.log('   Conversión: ART = UTC - 3 horas');
}

checkSchedule(); 