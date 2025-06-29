// Script para verificar enlaces del footer
console.log('🔍 Verificando enlaces del footer...');

document.addEventListener('DOMContentLoaded', () => {
  // Buscar todos los enlaces del footer
  const footerLinks = document.querySelectorAll('.footer-links a');
  
  console.log(`📋 Encontrados ${footerLinks.length} enlaces en el footer:`);
  
  footerLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    console.log(`${index + 1}. "${text}" -> ${href}`);
    
    // Verificar específicamente el enlace de políticas de privacidad
    if (href && href.includes('politicas-privacidad')) {
      console.log('✅ Enlace de políticas de privacidad encontrado!');
      
      // Verificar si el enlace es visible
      const styles = window.getComputedStyle(link);
      if (styles.display === 'none' || styles.visibility === 'hidden') {
        console.log('⚠️ El enlace está oculto por CSS');
      } else {
        console.log('✅ El enlace es visible');
      }
    }
  });
  
  // Verificar si el footer completo está presente
  const footer = document.querySelector('.site-footer');
  if (footer) {
    console.log('✅ Footer encontrado');
    
    // Verificar si el footer es visible
    const footerStyles = window.getComputedStyle(footer);
    if (footerStyles.display === 'none') {
      console.log('⚠️ El footer está oculto');
    } else {
      console.log('✅ El footer es visible');
    }
  } else {
    console.log('❌ Footer no encontrado');
  }
  
  // Verificar la sección de navegación del footer
  const footerNav = document.querySelector('.footer-links');
  if (footerNav) {
    console.log('✅ Sección de navegación del footer encontrada');
    
    const navStyles = window.getComputedStyle(footerNav);
    if (navStyles.display === 'none') {
      console.log('⚠️ La navegación del footer está oculta');
    } else {
      console.log('✅ La navegación del footer es visible');
    }
  } else {
    console.log('❌ Sección de navegación del footer no encontrada');
  }
});

// Función para probar el enlace de políticas de privacidad
function testPrivacyLink() {
  const privacyLink = document.querySelector('a[href*="politicas-privacidad"]');
  if (privacyLink) {
    console.log('🔗 Probando enlace de políticas de privacidad...');
    privacyLink.click();
  } else {
    console.log('❌ Enlace de políticas de privacidad no encontrado');
  }
}

// Exponer la función para testing manual
window.testPrivacyLink = testPrivacyLink; 