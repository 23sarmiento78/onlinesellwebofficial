import React, { useState, useEffect } from 'react';
import { builder, BuilderComponent } from '@builder.io/sdk';
import { getBuilderContent, isEditing } from '../utils/builder';

export default function BuilderPage({ model = 'page', fallback = null }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const builderContent = await getBuilderContent(model);
        setContent(builderContent);
      } catch (error) {
        console.error('Error cargando contenido de Builder.io:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [model]);

  if (loading) {
    return (
      <div className="builder-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!content && !isEditing()) {
    return fallback || (
      <div className="builder-no-content">
        <div className="container">
          <div className="text-center py-5">
            <h2>Contenido no encontrado</h2>
            <p>No se encontró contenido para esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-page">
      <BuilderComponent
        model={model}
        content={content}
        options={{ includeRefs: true }}
      />
    </div>
  );
} 