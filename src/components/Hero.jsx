import React from 'react';

export default function Hero({
  title,
  subtitle,
  backgroundImage = '/logos-he-imagenes/fondo-hero.jpg',
  ctas = [],
  stats = []
}) {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src={backgroundImage} alt="Fondo hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <div className="hero-cta">
          {ctas.map((cta, i) => (
            <a
              key={i}
              href={cta.href}
              className={cta.className}
              target={cta.target || undefined}
              rel={cta.target ? 'noopener' : undefined}
            >
              {cta.icon && <i className={cta.icon}></i>}
              {cta.text}
            </a>
          ))}
        </div>
        {stats.length > 0 && (
          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div className="stat-item" key={i}>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 