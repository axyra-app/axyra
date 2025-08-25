// ========================================
// DEBUG ESPECÍFICO DE SISTEMAS DE IA
// ========================================

console.log('🔍 DEBUG: Verificando inicialización de Sistemas de IA...');

// Función para verificar estado detallado
function debugAISystems() {
  console.log('\n🔍 DEBUG DETALLADO DE SISTEMAS DE IA');
  console.log('=====================================');

  // 1. Verificar si los scripts están cargados
  console.log('\n📜 VERIFICACIÓN DE SCRIPTS:');
  const scripts = [
    'error-handler.js',
    'performance-optimizer.js',
    'real-time-monitor.js',
    'ai-assistant.js',
    'axyra-integration.js',
  ];

  scripts.forEach((script) => {
    const scriptElement = document.querySelector(`script[src*="${script}"]`);
    if (scriptElement) {
      console.log(`✅ ${script}: Cargado en DOM`);
    } else {
      console.log(`❌ ${script}: NO encontrado en DOM`);
    }
  });

  // 2. Verificar objetos globales
  console.log('\n🌐 VERIFICACIÓN DE OBJETOS GLOBALES:');
  const globalObjects = [
    'axyraErrorHandler',
    'axyraPerformanceOptimizer',
    'axyraRealTimeMonitor',
    'axyraAIAssistant',
    'axyraIntegration',
  ];

  globalObjects.forEach((objName) => {
    if (window[objName]) {
      console.log(`✅ ${objName}: Disponible en window`);
      console.log(`   Tipo: ${typeof window[objName]}`);
      console.log(`   Constructor: ${window[objName].constructor.name}`);
    } else {
      console.log(`❌ ${objName}: NO disponible en window`);
    }
  });

  // 3. Verificar elementos de la interfaz
  console.log('\n🎨 VERIFICACIÓN DE INTERFAZ:');
  const uiElements = ['.axyra-ai-insights', '.axyra-system-status', '.axyra-ai-assistant-toggle'];

  uiElements.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`✅ ${selector}: Encontrado en DOM`);
      console.log(`   Visible: ${element.offsetParent !== null}`);
      console.log(`   Estilos: ${window.getComputedStyle(element).display}`);
    } else {
      console.log(`❌ ${selector}: NO encontrado en DOM`);
    }
  });

  // 4. Verificar estilos CSS
  console.log('\n🎨 VERIFICACIÓN DE ESTILOS:');
  const cssLinks = document.querySelectorAll('link[href*="axyra-ai-styles.css"]');
  if (cssLinks.length > 0) {
    console.log(`✅ Estilos de IA: ${cssLinks.length} enlaces encontrados`);
    cssLinks.forEach((link, index) => {
      console.log(`   Enlace ${index + 1}: ${link.href}`);
    });
  } else {
    console.log('❌ Estilos de IA: NO encontrados');
  }

  // 5. Verificar llamadas de inicialización
  console.log('\n🚀 VERIFICACIÓN DE INICIALIZACIÓN:');
  console.log('Buscando método initializeAISystems en dashboard...');

  // Buscar en el objeto dashboard
  if (window.axyraDashboard) {
    console.log('✅ Objeto axyraDashboard encontrado');
    if (typeof window.axyraDashboard.initializeAISystems === 'function') {
      console.log('✅ Método initializeAISystems disponible');
    } else {
      console.log('❌ Método initializeAISystems NO disponible');
    }
  } else {
    console.log('❌ Objeto axyraDashboard NO encontrado');
  }

  // 6. Verificar errores en consola
  console.log('\n🚨 VERIFICACIÓN DE ERRORES:');
  console.log('Revisa la consola para errores relacionados con:');
  console.log('- Carga de scripts de IA');
  console.log('- Inicialización de sistemas');
  console.log('- Errores de JavaScript');

  // 7. Intentar inicialización manual
  console.log('\n🔧 INTENTO DE INICIALIZACIÓN MANUAL:');
  try {
    if (window.axyraIntegration) {
      console.log('✅ axyraIntegration disponible, verificando estado...');
      const status = window.axyraIntegration.getSystemStatusSummary();
      console.log('Estado del sistema:', status);
    } else {
      console.log('❌ axyraIntegration NO disponible');
    }
  } catch (error) {
    console.error('❌ Error en verificación manual:', error);
  }
}

// Ejecutar debug después de que la página se cargue
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', debugAISystems);
} else {
  debugAISystems();
}

// También ejecutar después de un delay para asegurar que todo esté cargado
setTimeout(debugAISystems, 2000);

console.log('🔍 Script de debug cargado. Ejecutando verificación...');
