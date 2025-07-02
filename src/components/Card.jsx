import React from 'react';

export default function Card({
  image,
  icon,
  title,
  description,
  price,
  cta,
  children
}) {
  return (
    <div className="servicio-card card h-100">
      {image && <img src={image} alt={title} />}
      <div className="card-body">
        {icon && <h4><i className={icon}></i> {title}</h4>}
        {!icon && <h3>{title}</h3>}
        <p>{description}</p>
        {children}
        {price && <strong>{price}</strong>}
        {cta && (
          <a href={cta.href} className={cta.className} target={cta.target || undefined} rel={cta.target ? 'noopener' : undefined}>
            {cta.icon && <i className={cta.icon}></i>}
            {cta.text}
          </a>
        )}
      </div>
    </div>
  );
} 