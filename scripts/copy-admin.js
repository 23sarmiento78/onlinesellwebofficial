const fs = require('fs');
const path = require('path');

// Función para copiar archivos
function copyFile(source, destination) {
    try {
        // Crear el directorio de destino si no existe
        const destDir = path.dirname(destination);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Copiar el archivo
        fs.copyFileSync(source, destination);
        console.log(`✅ Copiado: ${source} → ${destination}`);
    } catch (error) {
        console.error(`❌ Error copiando ${source}:`, error);
    }
}

// Función para copiar directorios
function copyDirectory(source, destination) {
    try {
        // Crear el directorio de destino si no existe
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
        
        // Leer el directorio fuente
        const files = fs.readdirSync(source);
        
        files.forEach(file => {
            const sourcePath = path.join(source, file);
            const destPath = path.join(destination, file);
            
            const stat = fs.statSync(sourcePath);
            
            if (stat.isDirectory()) {
                copyDirectory(sourcePath, destPath);
            } else {
                copyFile(sourcePath, destPath);
            }
        });
        
        console.log(`✅ Copiado directorio: ${source} → ${destination}`);
    } catch (error) {
        console.error(`❌ Error copiando directorio ${source}:`, error);
    }
}

// Archivos y directorios a copiar
const filesToCopy = [
    { source: 'public/admin.html', destination: 'dist/admin.html' },
    { source: 'public/linkedin-callback.html', destination: 'dist/linkedin-callback.html' }
];

const directoriesToCopy = [
    { source: 'public/data', destination: 'dist/data' },
    { source: 'public/js', destination: 'dist/js' },
    { source: 'public/css', destination: 'dist/css' },
    { source: 'public/logos-he-imagenes', destination: 'dist/logos-he-imagenes' },
    { source: 'public/uploads', destination: 'dist/uploads' }
];

console.log('🚀 Iniciando copia de archivos para el build...');

// Copiar archivos
filesToCopy.forEach(({ source, destination }) => {
    if (fs.existsSync(source)) {
        copyFile(source, destination);
    } else {
        console.warn(`⚠️ Archivo no encontrado: ${source}`);
    }
});

// Copiar directorios
directoriesToCopy.forEach(({ source, destination }) => {
    if (fs.existsSync(source)) {
        copyDirectory(source, destination);
    } else {
        console.warn(`⚠️ Directorio no encontrado: ${source}`);
    }
});

console.log('✅ Copia de archivos completada');