import React from 'react';

const StyleTest = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '2rem auto' }}>
      <h2 style={{ 
        color: 'var(--primary)',
        fontSize: '2rem',
        marginBottom: '1rem'
      }}>
        Prueba de Estilos CSS
      </h2>
      
      <div className="card" style={{
        background: 'var(--bg-secondary)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem'
      }}>
        <h3 style={{ color: 'var(--accent-color)' }}>Tarjeta de Prueba</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Este texto debería aparecer con el color secundario definido en las variables CSS.
        </p>
      </div>

      <button className="btn" style={{
        background: 'var(--accent-gradient)',
        color: 'var(--text-primary)',
        padding: '0.7em 2em',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'var(--transition-base)'
      }}>
        Botón de Prueba
      </button>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-muted)'
      }}>
        <p><strong>Variables de prueba:</strong></p>
        <ul>
          <li>Color primario: var(--primary)</li>
          <li>Fondo secundario: var(--bg-secondary)</li>
          <li>Texto secundario: var(--text-secondary)</li>
          <li>Accent color: var(--accent-color)</li>
        </ul>
      </div>
    </div>
  );
};

export default StyleTest;
