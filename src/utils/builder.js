import { Builder } from '@builder.io/sdk';

// Configuración de Builder.io
Builder.init('e413bf72af054b07925671fff35fae24');

// Configuración para desarrollo
if (process.env.NODE_ENV === 'development') {
  Builder.init('e413bf72af054b07925671fff35fae24');
}

// Configuración para producción
if (process.env.NODE_ENV === 'production') {
  Builder.init('e413bf72af054b07925671fff35fae24');
}

// Configuración de modelos
export const BUILDER_MODELS = {
  page: 'page',
  header: 'header',
  footer: 'footer',
  hero: 'hero',
  content: 'content',
  navigation: 'navigation'
};

// Función para obtener contenido de Builder.io
export async function getBuilderContent(model, options = {}) {
  try {
    const content = await Builder.get(model, {
      userAttributes: {
        urlPath: window.location.pathname
      },
      ...options
    });
    return content;
  } catch (error) {
    console.error('Error obteniendo contenido de Builder.io:', error);
    return null;
  }
}

// Función para obtener múltiples contenidos
export async function getBuilderContents(model, options = {}) {
  try {
    const contents = await Builder.getAll(model, {
      userAttributes: {
        urlPath: window.location.pathname
      },
      ...options
    });
    return contents;
  } catch (error) {
    console.error('Error obteniendo contenidos de Builder.io:', error);
    return [];
  }
}

// Función para verificar si estamos en modo de edición
export function isEditing() {
  return Builder.isEditing || Builder.isPreviewing;
}

// Función para registrar componentes
export function registerComponent(component, options = {}) {
  Builder.registerComponent(component, options);
}

export default Builder; 