const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    console.log('🧪 Función de prueba ejecutándose...');
    
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      cwd: process.cwd(),
      dirname: __dirname,
      functions: {}
    };
    
    // Probar diferentes rutas para el directorio blog
    const possiblePaths = [
      path.join(__dirname, '../public/blog'),
      path.join(__dirname, '../../public/blog'),
      path.join(process.cwd(), 'public/blog'),
      './public/blog'
    ];
    
    testResults.possiblePaths = possiblePaths;
    testResults.pathTests = {};
    
    for (const testPath of possiblePaths) {
      try {
        const exists = fs.existsSync(testPath);
        const isDirectory = exists ? fs.statSync(testPath).isDirectory() : false;
        let files = [];
        
        if (exists && isDirectory) {
          files = fs.readdirSync(testPath);
        }
        
        testResults.pathTests[testPath] = {
          exists,
          isDirectory,
          files: files.filter(f => f.endsWith('.html')),
          totalFiles: files.length
        };
      } catch (error) {
        testResults.pathTests[testPath] = {
          error: error.message
        };
      }
    }
    
    // Probar lectura de archivos
    const workingPath = possiblePaths.find(path => 
      testResults.pathTests[path] && 
      testResults.pathTests[path].exists && 
      testResults.pathTests[path].isDirectory
    );
    
    if (workingPath) {
      testResults.workingPath = workingPath;
      testResults.fileTests = {};
      
      const htmlFiles = testResults.pathTests[workingPath].files.slice(0, 3); // Solo probar 3 archivos
      
      for (const file of htmlFiles) {
        try {
          const filePath = path.join(workingPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const fileSize = content.length;
          const hasTitle = content.includes('<title>');
          const hasMain = content.includes('<main>');
          
          testResults.fileTests[file] = {
            size: fileSize,
            hasTitle,
            hasMain,
            firstLine: content.split('\n')[0].substring(0, 100)
          };
        } catch (error) {
          testResults.fileTests[file] = {
            error: error.message
          };
        }
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(testResults, null, 2)
    };
    
  } catch (error) {
    console.error('❌ Error en función de prueba:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Error en función de prueba',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 