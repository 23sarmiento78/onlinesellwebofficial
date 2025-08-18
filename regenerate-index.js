// Script temporal para regenerar el índice de artículos
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

try {
  console.log('Regenerando índice de artículos...');
  const { stdout, stderr } = await execAsync('node scripts/build-blog-index.js');
  
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  
  console.log('✅ Índice regenerado exitosamente');
} catch (error) {
  console.error('❌ Error al regenerar índice:', error.message);
}
