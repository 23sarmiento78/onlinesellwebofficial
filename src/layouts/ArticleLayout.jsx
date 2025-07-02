import React from 'react';
import BaseLayout from './BaseLayout';

export default function ArticleLayout({
  title,
  description = '',
  image,
  ogUrl,
  twitterUrl,
  seo_metadata = {},
  date,
  author,
  tags = [],
  children
}) {
  // Definir valores SEO, usando los campos del CMS si existen, de lo contrario, los valores predeterminados
  const finalMetaTitle = seo_metadata.metaTitle || title;
  const finalMetaDescription = seo_metadata.metaDescription || description;
  const finalOgTitle = seo_metadata.ogTitle || title;
  const finalOgDescription = seo_metadata.ogDescription || description;
  const finalOgImage = seo_metadata.ogImage || image;
  const finalTwitterTitle = seo_metadata.twitterTitle || title;
  const finalTwitterDescription = seo_metadata.twitterDescription || description;
  const finalTwitterImage = seo_metadata.twitterImage || image;

  // Obtener la URL actual si es necesario para compartir
  const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <BaseLayout
      title={finalMetaTitle}
      description={finalMetaDescription}
      ogTitle={finalOgTitle}
      ogDescription={finalOgDescription}
      ogImage={finalOgImage}
      ogUrl={ogUrl}
      twitterTitle={finalTwitterTitle}
      twitterDescription={finalTwitterDescription}
      twitterImage={finalTwitterImage}
      twitterUrl={twitterUrl}
    >
      <main className="article-main container" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 0' }}>
        {image && (
          <div className="article-image-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src={image} alt={title} className="article-image" style={{ maxWidth: '100%', borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }} loading="lazy" />
          </div>
        )}
        <h1 className="article-title" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-color, #222)' }}>{finalMetaTitle}</h1>
        <div className="article-meta" style={{ color: '#888', fontSize: '1rem', marginBottom: '1.5rem' }}>
          {date && <span><i className="far fa-calendar-alt"></i> {date}</span>}
          {author && <span style={{ marginLeft: '1.5rem' }}><i className="fas fa-user"></i> {author}</span>}
          {tags.length > 0 && (
            <span style={{ marginLeft: '1.5rem' }}><i className="fas fa-tags"></i> {tags.join(', ')}</span>
          )}
        </div>
        <div className="article-content markdown-body" style={{ lineHeight: 1.7, fontSize: '1.15rem', color: '#222' }}>
          {children}
        </div>
        <hr style={{ margin: '2.5rem 0', border: 0, borderTop: '1px solid #eee' }} />
        <div className="article-footer" style={{ textAlign: 'center', color: '#888', fontSize: '0.95rem' }}>
          <p>¿Te gustó este artículo? ¡Compártelo!</p>
          <div className="social-share">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener" aria-label="Compartir en Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(finalMetaTitle)}`} target="_blank" rel="noopener" aria-label="Compartir en Twitter"><i className="fab fa-twitter"></i></a>
            <a href={`https://wa.me/?text=${encodeURIComponent(finalMetaTitle)}%20${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener" aria-label="Compartir en WhatsApp"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </main>
    </BaseLayout>
  );
} 