// Google Analytics 4 (GA4) Configuration
// ✅ CONFIGURADO CON CREDENCIALES REALES

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// 🔍 GA4 ID: ID de medición real
gtag('config', 'G-5ZCGMRFV8Z');

// 📊 Eventos personalizados
gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href
});
