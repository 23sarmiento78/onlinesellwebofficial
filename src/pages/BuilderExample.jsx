import React from 'react';
import BaseLayout from '../layouts/BaseLayout';

export default function BuilderExample() {
  return (
    <BaseLayout
      title="Builder Example | Desarrollo Web Villa Carlos Paz | hgaruna"
      description="Ejemplo de builder para desarrollo web en Villa Carlos Paz, Córdoba."
    >
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1>Builder Example</h1>
            <p>Esta es una página de ejemplo para el builder.</p>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
} 