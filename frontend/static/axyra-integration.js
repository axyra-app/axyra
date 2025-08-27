// ========================================
// INTEGRACIÓN PRINCIPAL AXYRA - VERSIÓN SIMPLIFICADA
// ========================================

class AxyraIntegration {
  constructor() {
    this.systems = new Map();
    this.initializationStatus = new Map();
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Integración Principal AXYRA...');

    try {
      // Inicializar solo sistemas esenciales
      await this.initializeEssentialSystems();

      // Configurar monitoreo básico
      this.setupBasicMonitoring();

      console.log('✅ Integración Principal AXYRA inicializada completamente');
    } catch (error) {
      console.error('❌ Error en integración principal:', error);
    }
  }

  async initializeEssentialSystems() {
    try {
      // Solo inicializar sistemas que realmente existen
      const essentialSystems = [
        { name: 'notification_system', script: '/static/notifications-system.js' },
        { name: 'auth_system', script: '/static/unified-auth-system.js' },
      ];

      for (const system of essentialSystems) {
        try {
          console.log(`🔄 Inicializando sistema esencial: ${system.name}`);

          // Verificar si el sistema ya está disponible
          if (this.isSystemAvailable(system.name)) {
            console.log(`✅ Sistema ${system.name} ya disponible`);
            this.initializationStatus.set(system.name, 'available');
            continue;
          }

          // Cargar script si es necesario
          await this.loadScriptSafely(system.script);

          // Marcar como inicializado
          this.initializationStatus.set(system.name, 'loaded');
          console.log(`✅ Sistema ${system.name} cargado`);
        } catch (error) {
          console.warn(`⚠️ Error cargando sistema ${system.name}:`, error);
          this.initializationStatus.set(system.name, 'error');
        }
      }
    } catch (error) {
      console.error('❌ Error inicializando sistemas esenciales:', error);
    }
  }

  isSystemAvailable(systemName) {
    const systemMap = {
      notification_system: 'axyraNotificationSystem',
      auth_system: 'axyraUnifiedAuth',
      error_handler: 'axyraErrorHandler',
      performance_optimizer: 'axyraPerformanceOptimizer',
      real_time_monitor: 'axyraRealTimeMonitor',
      audit_system: 'axyraAuditSystemUnified',
      ai_assistant: 'axyraAIAssistant',
    };

    const globalName = systemMap[systemName];
    return globalName ? window[globalName] !== undefined : false;
  }

  async loadScriptSafely(src) {
    try {
      return new Promise((resolve, reject) => {
        // Verificar si el script ya está cargado
        const existingScript = document.querySelector(`script[src*="${src.split('/').pop()}"]`);
        if (existingScript) {
          console.log(`ℹ️ Script ya cargado: ${src}`);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';

        script.onload = () => {
          console.log(`✅ Script cargado: ${src}`);
          resolve();
        };

        script.onerror = () => {
          console.warn(`⚠️ Error cargando script: ${src}`);
          resolve(); // No fallar, solo continuar
        };

        // Insertar script
        const head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
          head.appendChild(script);
        } else {
          console.warn('⚠️ Head no encontrado, saltando script');
          resolve();
        }
      });
    } catch (error) {
      console.warn(`⚠️ Error en loadScriptSafely: ${error.message}`);
      // No fallar, solo continuar
    }
  }

  setupBasicMonitoring() {
    try {
      // Monitoreo básico cada minuto
      setInterval(() => {
        this.checkBasicHealth();
      }, 60000);

      console.log('✅ Monitoreo básico configurado');
    } catch (error) {
      console.error('❌ Error configurando monitoreo:', error);
    }
  }

  checkBasicHealth() {
    try {
      const healthReport = {
        timestamp: Date.now(),
        systems: {},
        overall: 'healthy',
      };

      // Verificar sistemas disponibles
      for (const [systemName, status] of this.initializationStatus) {
        healthReport.systems[systemName] = status;
      }

      // Guardar reporte básico
      localStorage.setItem('axyra_basic_health', JSON.stringify(healthReport));

      console.log('📊 Reporte de salud básico:', healthReport);
    } catch (error) {
      console.error('❌ Error verificando salud básica:', error);
    }
  }

  // Métodos públicos simplificados
  getSystemStatus() {
    try {
      return {
        totalSystems: this.initializationStatus.size,
        initializationStatus: Object.fromEntries(this.initializationStatus),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('❌ Error obteniendo estado del sistema:', error);
      return null;
    }
  }

  getSystem(systemName) {
    try {
      const systemMap = {
        notification_system: 'axyraNotificationSystem',
        auth_system: 'axyraUnifiedAuth',
        error_handler: 'axyraErrorHandler',
        performance_optimizer: 'axyraPerformanceOptimizer',
        real_time_monitor: 'axyraRealTimeMonitor',
        audit_system: 'axyraAuditSystemUnified',
        ai_assistant: 'axyraAIAssistant',
      };

      const globalName = systemMap[systemName];
      return globalName ? window[globalName] : null;
    } catch (error) {
      console.error('❌ Error obteniendo sistema:', error);
      return null;
    }
  }

  // Métodos estáticos
  static getInstance() {
    if (window.axyraIntegration) {
      return window.axyraIntegration;
    }
    return null;
  }

  static getSystem(systemName) {
    if (window.axyraIntegration) {
      return window.axyraIntegration.getSystem(systemName);
    }
    return null;
  }

  static getStatus() {
    if (window.axyraIntegration) {
      return window.axyraIntegration.getSystemStatus();
    }
    return null;
  }
}

// Inicializar integración principal
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.axyraIntegration = new AxyraIntegration();
    console.log('✅ AxyraIntegration inicializado globalmente');
  } catch (error) {
    console.error('❌ Error inicializando AxyraIntegration:', error);
  }
});

// Exportar para uso global
window.AxyraIntegration = AxyraIntegration;
