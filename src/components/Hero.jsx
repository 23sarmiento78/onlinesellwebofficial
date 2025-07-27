import React, { useRef, useEffect } from 'react';

export default function Hero({
  title,
  subtitle,
  ctas = [],
  stats = []
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Asegurarse de que el video se reproduzca correctamente
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-background">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            top: 0,
            left: 0
          }}
        >
          <source src="/5377684-uhd_3840_2160_25fps.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
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
              <div className="hero-stat-item" key={i}>
                <span className="hero-stat-number">{stat.number}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 