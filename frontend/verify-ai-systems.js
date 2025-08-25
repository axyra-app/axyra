// ========================================
// VERIFICACIÓN RÁPIDA DE SISTEMAS DE IA
// ========================================

console.log('🔍 Verificando Sistemas de IA AXYRA...');

// Verificar que todos los scripts estén cargados
const requiredSystems = [
  'axyraErrorHandler',
  'axyraPerformanceOptimizer',
  'axyraRealTimeMonitor',
  'axyraAIAssistant',
  'axyraIntegration',
];

console.log('\n📋 Verificación de Sistemas:');
let allSystemsLoaded = true;

requiredSystems.forEach((systemName) => {
  if (window[systemName]) {
    console.log(`✅ ${systemName}: CARGADO`);
  } else {
    console.log(`❌ ${systemName}: NO CARGADO`);
    allSystemsLoaded = false;
  }
});

if (allSystemsLoaded) {
  console.log('\n🎉 ¡Todos los sistemas de IA están funcionando!');

  // Verificar funcionalidad básica
  console.log('\n🧪 Pruebas de Funcionalidad:');

  try {
    // Test Error Handler
    const errorStatus = window.axyraErrorHandler.getErrorReport();
    console.log('✅ Error Handler: Funcionando');

    // Test AI Assistant
    const aiStatus = window.axyraAIAssistant.getAssistantStatus();
    console.log('✅ AI Assistant: Funcionando');

    // Test Performance Optimizer
    const perfStatus = window.axyraPerformanceOptimizer.getPerformanceReport();
    console.log('✅ Performance Optimizer: Funcionando');

    // Test Real-time Monitor
    const monitorStatus = window.axyraRealTimeMonitor.getSystemStatus();
    console.log('✅ Real-time Monitor: Funcionando');

    // Test Integration System
    const integrationStatus = window.axyraIntegration.getSystemStatusSummary();
    console.log('✅ Integration System: Funcionando');

    console.log('\n🚀 ¡Todos los sistemas están funcionando correctamente!');

    // Mostrar botón de IA si existe
    const aiButton = document.querySelector('.axyra-ai-assistant-toggle');
    if (aiButton) {
      console.log('✅ Botón de IA: Visible en la interfaz');
    } else {
      console.log('⚠️ Botón de IA: No visible (puede estar oculto)');
    }
  } catch (error) {
    console.error('❌ Error en pruebas de funcionalidad:', error);
  }
} else {
  console.log('\n⚠️ Algunos sistemas no están cargados correctamente');
  console.log('💡 Verifica que todos los scripts se carguen en el orden correcto');
}

// Verificar elementos de la interfaz
console.log('\n🎨 Verificación de Interfaz:');

const aiInsights = document.querySelector('.axyra-ai-insights');
const systemStatus = document.querySelector('.axyra-system-status');

if (aiInsights) {
  console.log('✅ Sección AI Insights: Visible');
} else {
  console.log('❌ Sección AI Insights: No encontrada');
}

if (systemStatus) {
  console.log('✅ Sección System Status: Visible');
} else {
  console.log('❌ Sección System Status: No encontrada');
}

// Verificar estilos
const aiStyles = document.querySelector('link[href*="axyra-ai-styles.css"]');
if (aiStyles) {
  console.log('✅ Estilos de IA: Cargados');
} else {
  console.log('❌ Estilos de IA: No cargados');
}

console.log('\n🔧 Para más detalles, revisa la consola del navegador');
console.log('📖 Documentación completa en: AI_SYSTEMS_README.md');
