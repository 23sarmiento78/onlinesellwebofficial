import { Builder } from '@builder.io/sdk';

// Registrar componentes personalizados
Builder.registerComponent(
  {
    name: 'Hero',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Título del Hero' },
      { name: 'subtitle', type: 'string', defaultValue: 'Subtítulo del hero' },
      { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'] },
      { name: 'ctaText', type: 'string', defaultValue: 'Comenzar' },
      { name: 'ctaLink', type: 'string', defaultValue: '#' }
    ]
  },
  {
    name: 'Text Content',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Título de la sección' },
      { name: 'content', type: 'richText', defaultValue: '<p>Contenido de la sección...</p>' }
    ]
  },
  {
    name: 'Services',
    inputs: [
      {
        name: 'services',
        type: 'list',
        subFields: [
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'icon', type: 'string', defaultValue: 'fas fa-cog' }
        ]
      }
    ]
  },
  {
    name: 'Contact',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Contáctanos' },
      { name: 'phone', type: 'string', defaultValue: '+54 3541 237972' },
      { name: 'email', type: 'string', defaultValue: '23sarmiento@gmail.com' },
      { name: 'address', type: 'string', defaultValue: 'Villa Carlos Paz, Córdoba' },
      { name: 'showWhatsApp', type: 'boolean', defaultValue: true }
    ]
  }
); 