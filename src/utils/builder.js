import { Builder, builder } from '@builder.io/sdk';
import { builder as builderReact } from '@builder.io/react';

// Configuración de Builder.io para la nueva versión
builderReact.init('e413bf72af054b07925671fff35fae24');

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
    const content = await builderReact.get(model, {
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
    const contents = await builderReact.getAll(model, {
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
  return builderReact.isEditing || builderReact.isPreviewing;
}

// Función para registrar componentes
export function registerComponent(component, options = {}) {
  builderReact.registerComponent(component, options);
}

export default builderReact; 