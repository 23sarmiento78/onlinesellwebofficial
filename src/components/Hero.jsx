import React, { useRef, useEffect, useState } from 'react'

export default function Hero({
  title,
  subtitle,
  badge,
  backgroundVideo,
  backgroundImage,
  ctas = [],
  stats = [],
  variant = 'default', // 'default', 'minimal', 'fullscreen', 'left-aligned'
  showScrollIndicator = true,
  showFloatingElements = true,
  showParticles = false,
  animated = true
}) {
  const videoRef = useRef(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current && backgroundVideo) {
      const video = videoRef.current
      
      const handleLoadedData = () => {
        setIsVideoLoaded(true)
        video.play().catch(error => {
          console.log("Autoplay prevented:", error)
        })
      }

      const handleError = () => {
        console.log("Video failed to load")
        setIsVideoLoaded(false)
      }

      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('error', handleError)
      }
    }
  }, [backgroundVideo])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  const heroClasses = [
    'hero',
    variant,
    animated ? 'animated' : ''
  ].filter(Boolean).join(' ')

  const renderFloatingElements = () => {
    if (!showFloatingElements) return null
    
    return (
      <div className="hero-floating-elements">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>
    )
  }

  const renderParticles = () => {
    if (!showParticles) return null
    
    const particles = Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`
        }}
      />
    ))
    
    return <div className="hero-particles">{particles}</div>
  }

  const renderContent = () => {
    if (variant === 'left-aligned') {
      return (
        <div className="hero-content">
          <div className="hero-text">
            {badge && (
              <div className="hero-badge">
                {badge.icon && <i className={badge.icon}></i>}
                {badge.text}
              </div>
            )}
            
            <h1 className="hero-title">
              {typeof title === 'string' ? title : title}
            </h1>
            
            {subtitle && (
              <p className="hero-subtitle">{subtitle}</p>
            )}
            
            {ctas.length > 0 && (
              <div className="hero-cta">
                {ctas.map((cta, index) => (
                  <a
                    key={index}
                    href={cta.href}
                    className={cta.className || 'cta-button primary'}
                    target={cta.target}
                    rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                  >
                    {cta.icon && <i className={cta.icon}></i>}
                    {cta.text}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {stats.length > 0 && (
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <span className="hero-stat-number">{stat.number}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="hero-content">
        {badge && (
          <div className="hero-badge">
            {badge.icon && <i className={badge.icon}></i>}
            {badge.text}
          </div>
        )}
        
        <h1 className="hero-title">
          {typeof title === 'string' ? title : title}
        </h1>
        
        {subtitle && (
          <p className="hero-subtitle">{subtitle}</p>
        )}
        
        {ctas.length > 0 && (
          <div className="hero-cta">
            {ctas.map((cta, index) => (
              <a
                key={index}
                href={cta.href}
                className={cta.className || 'cta-button primary'}
                target={cta.target}
                rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
              >
                {cta.icon && <i className={cta.icon}></i>}
                {cta.text}
              </a>
            ))}
          </div>
        )}
        
        {stats.length > 0 && (
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat">
                <span className="hero-stat-number">{stat.number}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className={heroClasses}>
      {/* Background Video */}
      {backgroundVideo && (
        <div className="hero-video-background">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster={backgroundImage}
          >
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Background Image */}
      {backgroundImage && !backgroundVideo && (
        <div
          className="hero-image-background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Overlay */}
      <div className={`hero-overlay ${animated ? 'animated' : ''}`} />

      {/* Floating Elements */}
      {renderFloatingElements()}

      {/* Particles */}
      {renderParticles()}

      {/* Content */}
      {renderContent()}

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <button
          className="hero-scroll-indicator"
          onClick={scrollToContent}
          aria-label="Scroll to content"
        >
          <i className="fas fa-chevron-down"></i>
        </button>
      )}
    </section>
  )
}
