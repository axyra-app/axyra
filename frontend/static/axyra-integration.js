// ========================================
// INTEGRACIÓN PRINCIPAL AXYRA - VERSIÓN CORREGIDA
// ========================================

class AxyraIntegration {
  constructor() {
    this.systems = new Map();
    this.initializationStatus = new Map();
    this.systemDependencies = new Map();
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Integración Principal AXYRA...');

    try {
      // Configurar dependencias entre sistemas (sin dependencias circulares)
      this.setupSystemDependencies();

      // Inicializar sistemas en orden correcto
      await this.initializeSystemsSequentially();

      // Configurar comunicación entre sistemas
      this.setupInterSystemCommunication();

      // Configurar monitoreo de salud del sistema
      this.setupSystemHealthMonitoring();

      console.log('✅ Integración Principal AXYRA inicializada completamente');
    } catch (error) {
      console.error('❌ Error en integración principal:', error);
    }
  }

  // ========================================
  // CONFIGURACIÓN DE DEPENDENCIAS (CORREGIDA)
  // ========================================

  setupSystemDependencies() {
    try {
      // Sistema base (sin dependencias)
      this.systemDependencies.set('error_handler', []);
      this.systemDependencies.set('performance_optimizer', []);

      // Sistemas que dependen del manejador de errores
      this.systemDependencies.set('real_time_monitor', ['error_handler']);
      this.systemDependencies.set('notification_system', ['error_handler']);

      // Sistemas que dependen del monitor en tiempo real
      this.systemDependencies.set('audit_system', ['real_time_monitor']);

      // AI Assistant sin dependencias críticas
      this.systemDependencies.set('ai_assistant', []);

      console.log('✅ Dependencias entre sistemas configuradas (sin circulares)');
    } catch (error) {
      console.error('❌ Error configurando dependencias:', error);
    }
  }

  // ========================================
  // INICIALIZACIÓN SECUENCIAL (CORREGIDA)
  // ========================================

  async initializeSystemsSequentially() {
    try {
      const initializationOrder = this.calculateInitializationOrder();

      console.log('📋 Orden de inicialización:', initializationOrder);

      for (const systemName of initializationOrder) {
        console.log(`🔄 Inicializando sistema: ${systemName}`);

        try {
          await this.initializeSystem(systemName);
          this.initializationStatus.set(systemName, 'success');
          console.log(`✅ Sistema ${systemName} inicializado exitosamente`);
        } catch (error) {
          console.error(`❌ Error inicializando sistema ${systemName}:`, error);
          this.initializationStatus.set(systemName, 'error');

          // Intentar recuperación automática
          await this.attemptSystemRecovery(systemName);
        }
      }

      console.log('✅ Todos los sistemas han sido inicializados');
    } catch (error) {
      console.error('❌ Error en inicialización secuencial:', error);
    }
  }

  calculateInitializationOrder() {
    try {
      const order = [];
      const visited = new Set();
      const temp = new Set();

      const visit = (systemName) => {
        if (temp.has(systemName)) {
          console.warn(`⚠️ Dependencia circular detectada en: ${systemName}, saltando...`);
          return;
        }

        if (visited.has(systemName)) {
          return;
        }

        temp.add(systemName);

        const dependencies = this.systemDependencies.get(systemName) || [];
        for (const dependency of dependencies) {
          visit(dependency);
        }

        temp.delete(systemName);
        visited.add(systemName);
        order.push(systemName);
      };

      for (const systemName of this.systemDependencies.keys()) {
        if (!visited.has(systemName)) {
          visit(systemName);
        }
      }

      return order;
    } catch (error) {
      console.error('❌ Error calculando orden de inicialización:', error);
      // Retornar orden por defecto si falla
      return [
        'error_handler',
        'performance_optimizer',
        'real_time_monitor',
        'notification_system',
        'audit_system',
        'ai_assistant',
      ];
    }
  }

  async initializeSystem(systemName) {
    try {
      switch (systemName) {
        case 'error_handler':
          return await this.initializeErrorHandler();
        case 'performance_optimizer':
          return await this.initializePerformanceOptimizer();
        case 'real_time_monitor':
          return await this.initializeRealTimeMonitor();
        case 'notification_system':
          return await this.initializeNotificationSystem();
        case 'audit_system':
          return await this.initializeAuditSystem();
        case 'ai_assistant':
          return await this.initializeAIAssistant();
        default:
          console.warn(`⚠️ Sistema no reconocido: ${systemName}`);
          return null;
      }
    } catch (error) {
      console.error(`❌ Error inicializando sistema ${systemName}:`, error);
      throw error;
    }
  }

  async initializeErrorHandler() {
    try {
      // Verificar si ya existe
      if (window.axyraErrorHandler) {
        console.log('ℹ️ Manejador de errores ya inicializado');
        return window.axyraErrorHandler;
      }

      // Cargar script si no está disponible
      await this.loadScript('/static/error-handler.js');

      // Esperar a que se inicialice
      await this.waitForSystem('axyraErrorHandler');

      this.systems.set('error_handler', window.axyraErrorHandler);
      return window.axyraErrorHandler;
    } catch (error) {
      console.error('❌ Error inicializando manejador de errores:', error);
      throw error;
    }
  }

  async initializePerformanceOptimizer() {
    try {
      // Verificar si ya existe
      if (window.axyraPerformanceOptimizer) {
        console.log('ℹ️ Optimizador de performance ya inicializado');
        return window.axyraPerformanceOptimizer;
      }

      // Cargar script si no está disponible
      await this.loadScript('/static/performance-optimizer.js');

      // Esperar a que se inicialice
      await this.waitForSystem('axyraPerformanceOptimizer');

      this.systems.set('performance_optimizer', window.axyraPerformanceOptimizer);
      return window.axyraPerformanceOptimizer;
    } catch (error) {
      console.error('❌ Error inicializando optimizador de performance:', error);
      throw error;
    }
  }

  async initializeRealTimeMonitor() {
    try {
      // Verificar si ya existe
      if (window.axyraRealTimeMonitor) {
        console.log('ℹ️ Monitor en tiempo real ya inicializado');
        return window.axyraRealTimeMonitor;
      }

      // Cargar script si no está disponible
      await this.loadScript('/static/real-time-monitor.js');

      // Esperar a que se inicialice
      await this.waitForSystem('axyraRealTimeMonitor');

      this.systems.set('real_time_monitor', window.axyraRealTimeMonitor);
      return window.axyraRealTimeMonitor;
    } catch (error) {
      console.error('❌ Error inicializando monitor en tiempo real:', error);
      throw error;
    }
  }

  async initializeNotificationSystem() {
    try {
      // Verificar si ya existe
      if (window.axyraNotificationSystem) {
        console.log('ℹ️ Sistema de notificaciones ya inicializado');
        return window.axyraNotificationSystem;
      }

      // Cargar script si no está disponible
      await this.loadScript('/static/notifications-system.js');

      // Esperar a que se inicialice
      await this.waitForSystem('axyraNotificationSystem');

      this.systems.set('notification_system', window.axyraNotificationSystem);
      return window.axyraNotificationSystem;
    } catch (error) {
      console.error('❌ Error inicializando sistema de notificaciones:', error);
      throw error;
    }
  }

  async initializeAuditSystem() {
    try {
      // Verificar si ya existe
      if (window.axyraAuditSystemUnified) {
        console.log('ℹ️ Sistema de auditoría ya inicializado');
        return window.axyraAuditSystemUnified;
      }

      // Cargar script si no está disponible
      await this.loadScript('/static/audit-system-unified.js');

      // Esperar a que se inicialice
      await this.waitForSystem('axyraAuditSystemUnified');

      this.systems.set('audit_system', window.axyraAuditSystemUnified);
      return window.axyraAuditSystemUnified;
    } catch (error) {
      console.error('❌ Error inicializando sistema de auditoría:', error);
      throw error;
    }
  }

  async initializeAIAssistant() {
    try {
      // Verificar si ya existe
      if (window.axyraAIAssistant) {
        console.log('ℹ️ Asistente de IA ya inicializado');
        return window.axyraAIAssistant;
      }

      // Cargar script si no está disponible
      await this.loadScript('/static/ai-assistant.js');

      // Esperar a que se inicialice
      await this.waitForSystem('axyraAIAssistant');

      this.systems.set('ai_assistant', window.axyraAIAssistant);
      return window.axyraAIAssistant;
    } catch (error) {
      console.error('❌ Error inicializando asistente de IA:', error);
      throw error;
    }
  }

  // ========================================
  // UTILIDADES DE CARGA (MEJORADAS)
  // ========================================

  async loadScript(src) {
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
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('❌ Error cargando script:', error);
      throw error;
    }
  }

  async waitForSystem(systemName, timeout = 10000) {
    try {
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        if (window[systemName]) {
          return window[systemName];
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      throw new Error(`Timeout esperando sistema: ${systemName}`);
    } catch (error) {
      console.error(`❌ Error esperando sistema ${systemName}:`, error);
      throw error;
    }
  }

  // ========================================
  // RECUPERACIÓN AUTOMÁTICA (MEJORADA)
  // ========================================

  async attemptSystemRecovery(systemName) {
    try {
      console.log(`🔄 Intentando recuperación del sistema: ${systemName}`);

      // Esperar un poco antes de reintentar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reintentar inicialización
      await this.initializeSystem(systemName);
      this.initializationStatus.set(systemName, 'recovered');

      console.log(`✅ Sistema ${systemName} recuperado exitosamente`);
    } catch (error) {
      console.error(`❌ No se pudo recuperar el sistema ${systemName}:`, error);
      this.initializationStatus.set(systemName, 'failed');
    }
  }

  // ========================================
  // COMUNICACIÓN ENTRE SISTEMAS (SIMPLIFICADA)
  // ========================================

  setupInterSystemCommunication() {
    try {
      // Configurar eventos globales básicos
      this.setupGlobalEvents();

      console.log('✅ Comunicación entre sistemas configurada');
    } catch (error) {
      console.error('❌ Error configurando comunicación entre sistemas:', error);
    }
  }

  setupGlobalEvents() {
    try {
      // Evento de cambio de estado del sistema
      window.addEventListener('axyra-system-status-change', (event) => {
        this.handleSystemStatusChange(event.detail);
      });

      // Evento de error del sistema
      window.addEventListener('axyra-system-error', (event) => {
        this.handleSystemError(event.detail);
      });

      console.log('✅ Eventos globales configurados');
    } catch (error) {
      console.error('❌ Error configurando eventos globales:', error);
    }
  }

  // ========================================
  // MONITOREO DE SALUD DEL SISTEMA (SIMPLIFICADO)
  // ========================================

  setupSystemHealthMonitoring() {
    try {
      // Monitorear salud de sistemas cada 30 segundos
      setInterval(() => {
        this.checkSystemHealth();
      }, 30000);

      console.log('✅ Monitoreo de salud del sistema configurado');
    } catch (error) {
      console.error('❌ Error configurando monitoreo de salud:', error);
    }
  }

  checkSystemHealth() {
    try {
      const healthReport = {
        timestamp: Date.now(),
        systems: {},
        overall: 'healthy',
      };

      let unhealthyCount = 0;

      for (const [systemName, system] of this.systems) {
        try {
          let status = 'unknown';

          if (system.getHealthStatus) {
            status = system.getHealthStatus();
          } else if (system.getStatus) {
            const systemStatus = system.getStatus();
            status = systemStatus.status || 'unknown';
          }

          healthReport.systems[systemName] = status;

          if (status === 'error' || status === 'failed') {
            unhealthyCount++;
          }
        } catch (error) {
          healthReport.systems[systemName] = 'error';
          unhealthyCount++;
        }
      }

      // Determinar estado general
      if (unhealthyCount > 0) {
        healthReport.overall = unhealthyCount > this.systems.size / 2 ? 'critical' : 'warning';
      }

      // Guardar reporte de salud
      localStorage.setItem('axyra_health_report', JSON.stringify(healthReport));

      // Emitir evento de salud
      window.dispatchEvent(
        new CustomEvent('axyra-health-check', {
          detail: healthReport,
        })
      );

      console.log('📊 Reporte de salud del sistema:', healthReport);
    } catch (error) {
      console.error('❌ Error verificando salud del sistema:', error);
    }
  }

  // ========================================
  // MANEJADORES DE EVENTOS (SIMPLIFICADOS)
  // ========================================

  handleSystemStatusChange(detail) {
    try {
      console.log('📊 Cambio de estado del sistema:', detail);
    } catch (error) {
      console.error('❌ Error manejando cambio de estado:', error);
    }
  }

  handleSystemError(detail) {
    try {
      console.error('🚨 Error del sistema:', detail);
    } catch (error) {
      console.error('❌ Error manejando error del sistema:', error);
    }
  }

  // ========================================
  // MÉTODOS PÚBLICOS (SIMPLIFICADOS)
  // ========================================

  getSystemStatus() {
    try {
      return {
        totalSystems: this.systems.size,
        initializationStatus: Object.fromEntries(this.initializationStatus),
        systemHealth: this.getSystemStatusSummary(),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('❌ Error obteniendo estado del sistema:', error);
      return null;
    }
  }

  getSystemStatusSummary() {
    try {
      const summary = {
        total: this.systems.size,
        healthy: 0,
        warning: 0,
        error: 0,
        systems: {},
      };

      for (const [systemName, system] of this.systems) {
        try {
          let status = 'unknown';

          if (system.getStatus) {
            const systemStatus = system.getStatus();
            status = systemStatus.status || 'unknown';
          } else if (system.getSystemStatus) {
            const systemStatus = system.getSystemStatus();
            status = systemStatus.status || 'unknown';
          }

          summary.systems[systemName] = status;

          switch (status) {
            case 'healthy':
            case 'success':
            case 'active':
              summary.healthy++;
              break;
            case 'warning':
            case 'recovered':
              summary.warning++;
              break;
            case 'error':
            case 'failed':
            case 'critical':
              summary.error++;
              break;
            default:
              summary.warning++;
          }
        } catch (error) {
          summary.systems[systemName] = 'error';
          summary.error++;
        }
      }

      return summary;
    } catch (error) {
      console.error('❌ Error obteniendo resumen de estado:', error);
      return { total: 0, healthy: 0, warning: 0, error: 0, systems: {} };
    }
  }

  getSystem(systemName) {
    try {
      return this.systems.get(systemName);
    } catch (error) {
      console.error('❌ Error obteniendo sistema:', error);
      return null;
    }
  }

  restartSystem(systemName) {
    try {
      console.log(`🔄 Reiniciando sistema: ${systemName}`);

      // Remover sistema actual
      this.systems.delete(systemName);
      this.initializationStatus.delete(systemName);

      // Reinicializar
      return this.initializeSystem(systemName);
    } catch (error) {
      console.error(`❌ Error reiniciando sistema ${systemName}:`, error);
      throw error;
    }
  }

  // Función global para acceder a la integración
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
