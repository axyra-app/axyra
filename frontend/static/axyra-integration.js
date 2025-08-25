// ========================================
// INTEGRACIÓN PRINCIPAL AXYRA - FASE 1 + FASE 2
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
      // Configurar dependencias entre sistemas
      this.setupSystemDependencies();

      // Inicializar sistemas en orden correcto
      await this.initializeSystemsSequentially();

      // Configurar comunicación entre sistemas
      this.setupInterSystemCommunication();

      // Configurar monitoreo de salud del sistema
      this.setupSystemHealthMonitoring();

      // Configurar dashboard de estado
      this.setupStatusDashboard();

      console.log('✅ Integración Principal AXYRA inicializada completamente');
    } catch (error) {
      console.error('❌ Error en integración principal:', error);
    }
  }

  // ========================================
  // CONFIGURACIÓN DE DEPENDENCIAS
  // ========================================

  setupSystemDependencies() {
    try {
      // Sistema base (sin dependencias)
      this.systemDependencies.set('error_handler', []);
      this.systemDependencies.set('performance_optimizer', []);

      // Sistemas que dependen del manejador de errores
      this.systemDependencies.set('real_time_monitor', ['error_handler']);
      this.systemDependencies.set('ai_assistant', ['error_handler', 'performance_optimizer']);

      // Sistemas que dependen del monitor en tiempo real
      this.systemDependencies.set('notification_system', ['real_time_monitor']);
      this.systemDependencies.set('audit_system', ['real_time_monitor']);

      console.log('✅ Dependencias entre sistemas configuradas');
    } catch (error) {
      console.error('❌ Error configurando dependencias:', error);
    }
  }

  // ========================================
  // INICIALIZACIÓN SECUENCIAL
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
          throw new Error(`Dependencia circular detectada: ${systemName}`);
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
      return [];
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
        case 'ai_assistant':
          return await this.initializeAIAssistant();
        case 'notification_system':
          return await this.initializeNotificationSystem();
        case 'audit_system':
          return await this.initializeAuditSystem();
        default:
          throw new Error(`Sistema no reconocido: ${systemName}`);
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

  // ========================================
  // UTILIDADES DE CARGA
  // ========================================

  async loadScript(src) {
    try {
      return new Promise((resolve, reject) => {
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
  // RECUPERACIÓN AUTOMÁTICA
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
  // COMUNICACIÓN ENTRE SISTEMAS
  // ========================================

  setupInterSystemCommunication() {
    try {
      // Configurar eventos globales
      this.setupGlobalEvents();

      // Configurar mensajería entre sistemas
      this.setupSystemMessaging();

      // Configurar sincronización de datos
      this.setupDataSynchronization();

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

      // Evento de notificación del sistema
      window.addEventListener('axyra-system-notification', (event) => {
        this.handleSystemNotification(event.detail);
      });

      console.log('✅ Eventos globales configurados');
    } catch (error) {
      console.error('❌ Error configurando eventos globales:', error);
    }
  }

  setupSystemMessaging() {
    try {
      // Sistema de mensajería centralizado
      window.axyraMessageBus = {
        send: (target, message) => this.sendSystemMessage(target, message),
        broadcast: (message) => this.broadcastSystemMessage(message),
        subscribe: (topic, callback) => this.subscribeToSystemTopic(topic, callback),
      };

      console.log('✅ Sistema de mensajería configurado');
    } catch (error) {
      console.error('❌ Error configurando sistema de mensajería:', error);
    }
  }

  sendSystemMessage(target, message) {
    try {
      const system = this.systems.get(target);
      if (system && system.handleMessage) {
        return system.handleMessage(message);
      }

      console.warn(`⚠️ Sistema ${target} no tiene método handleMessage`);
      return null;
    } catch (error) {
      console.error(`❌ Error enviando mensaje a ${target}:`, error);
      return null;
    }
  }

  broadcastSystemMessage(message) {
    try {
      const results = [];

      for (const [systemName, system] of this.systems) {
        if (system.handleMessage) {
          try {
            const result = system.handleMessage(message);
            results.push({ system: systemName, result, success: true });
          } catch (error) {
            results.push({ system: systemName, error: error.message, success: false });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('❌ Error en broadcast de mensaje:', error);
      return [];
    }
  }

  subscribeToSystemTopic(topic, callback) {
    try {
      if (!this.messageSubscribers) {
        this.messageSubscribers = new Map();
      }

      if (!this.messageSubscribers.has(topic)) {
        this.messageSubscribers.set(topic, []);
      }

      this.messageSubscribers.get(topic).push(callback);

      return () => {
        // Retornar función de unsubscribe
        const subscribers = this.messageSubscribers.get(topic);
        const index = subscribers.indexOf(callback);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      };
    } catch (error) {
      console.error('❌ Error suscribiendo a tópico:', error);
      return () => {};
    }
  }

  setupDataSynchronization() {
    try {
      // Sincronizar datos entre sistemas
      setInterval(() => {
        this.synchronizeSystemData();
      }, 30000); // Cada 30 segundos

      console.log('✅ Sincronización de datos configurada');
    } catch (error) {
      console.error('❌ Error configurando sincronización de datos:', error);
    }
  }

  synchronizeSystemData() {
    try {
      // Sincronizar estado de sistemas
      const systemStatus = {};

      for (const [systemName, system] of this.systems) {
        try {
          if (system.getStatus) {
            systemStatus[systemName] = system.getStatus();
          } else if (system.getSystemStatus) {
            systemStatus[systemName] = system.getSystemStatus();
          } else {
            systemStatus[systemName] = { status: 'unknown' };
          }
        } catch (error) {
          systemStatus[systemName] = { status: 'error', error: error.message };
        }
      }

      // Guardar estado en localStorage
      localStorage.setItem('axyra_system_status', JSON.stringify(systemStatus));

      // Emitir evento de sincronización
      window.dispatchEvent(
        new CustomEvent('axyra-system-sync', {
          detail: { systemStatus, timestamp: Date.now() },
        })
      );
    } catch (error) {
      console.error('❌ Error sincronizando datos del sistema:', error);
    }
  }

  // ========================================
  // MONITOREO DE SALUD DEL SISTEMA
  // ========================================

  setupSystemHealthMonitoring() {
    try {
      // Monitorear salud de sistemas cada 10 segundos
      setInterval(() => {
        this.checkSystemHealth();
      }, 10000);

      // Monitorear uso de memoria
      setInterval(() => {
        this.monitorMemoryUsage();
      }, 30000);

      // Monitorear performance
      setInterval(() => {
        this.monitorPerformance();
      }, 60000);

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

      // Tomar acciones si es necesario
      this.handleHealthIssues(healthReport);
    } catch (error) {
      console.error('❌ Error verificando salud del sistema:', error);
    }
  }

  handleHealthIssues(healthReport) {
    try {
      if (healthReport.overall === 'critical') {
        console.warn('🚨 Estado crítico del sistema detectado');

        // Activar modo de emergencia
        if (window.axyraErrorHandler) {
          window.axyraErrorHandler.activateEmergencyMode();
        }

        // Notificar al usuario
        if (window.axyraNotificationSystem) {
          window.axyraNotificationSystem.showErrorNotification(
            'Estado crítico del sistema detectado. Se ha activado el modo de emergencia.',
            15000
          );
        }
      } else if (healthReport.overall === 'warning') {
        console.warn('⚠️ Estado de advertencia del sistema detectado');

        // Notificar al usuario
        if (window.axyraNotificationSystem) {
          window.axyraNotificationSystem.showWarningNotification(
            'Se han detectado problemas menores en el sistema.',
            10000
          );
        }
      }
    } catch (error) {
      console.error('❌ Error manejando problemas de salud:', error);
    }
  }

  monitorMemoryUsage() {
    try {
      if ('memory' in performance) {
        const memoryInfo = performance.memory;
        const usagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;

        if (usagePercent > 80) {
          console.warn('⚠️ Uso de memoria alto:', usagePercent.toFixed(1) + '%');

          // Limpiar cache si es posible
          if (window.axyraPerformanceOptimizer) {
            window.axyraPerformanceOptimizer.clearOldCache();
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ No se pudo monitorear uso de memoria:', error);
    }
  }

  monitorPerformance() {
    try {
      // Obtener métricas de performance
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

        if (loadTime > 5000) {
          console.warn('⚠️ Tiempo de carga lento:', loadTime.toFixed(0) + 'ms');

          // Sugerir optimizaciones
          if (window.axyraPerformanceOptimizer) {
            window.axyraPerformanceOptimizer.suggestOptimization('slow_load', { loadTime });
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ No se pudo monitorear performance:', error);
    }
  }

  // ========================================
  // DASHBOARD DE ESTADO
  // ========================================

  setupStatusDashboard() {
    try {
      // Crear dashboard flotante
      this.createStatusDashboard();

      // Configurar actualizaciones automáticas
      setInterval(() => {
        this.updateStatusDashboard();
      }, 5000);

      console.log('✅ Dashboard de estado configurado');
    } catch (error) {
      console.error('❌ Error configurando dashboard de estado:', error);
    }
  }

  createStatusDashboard() {
    try {
      const dashboard = document.createElement('div');
      dashboard.id = 'axyra-status-dashboard';
      dashboard.className = 'axyra-status-indicator';
      dashboard.innerHTML = `
        <div class="axyra-status-header">
          <i class="fas fa-chart-line"></i>
          <span>Estado del Sistema</span>
        </div>
        <div class="axyra-status-content" id="axyra-status-content">
          <div class="axyra-loading-text">
            <span class="axyra-loading"></span>
            Cargando estado...
          </div>
        </div>
      `;

      document.body.appendChild(dashboard);

      // Actualizar contenido inicial
      this.updateStatusDashboard();
    } catch (error) {
      console.error('❌ Error creando dashboard de estado:', error);
    }
  }

  updateStatusDashboard() {
    try {
      const content = document.getElementById('axyra-status-content');
      if (!content) return;

      const status = this.getSystemStatusSummary();
      content.innerHTML = this.generateStatusHTML(status);
    } catch (error) {
      console.error('❌ Error actualizando dashboard de estado:', error);
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

  generateStatusHTML(summary) {
    try {
      let html = '';

      // Estado general
      const overallStatus = summary.error > 0 ? 'error' : summary.warning > 0 ? 'warning' : 'success';
      const statusIcon = summary.error > 0 ? '🔴' : summary.warning > 0 ? '🟡' : '🟢';

      html += `
        <div class="axyra-status-item">
          <span class="axyra-status-label">Estado General</span>
          <span class="axyra-status-value ${overallStatus}">${statusIcon} ${summary.healthy}/${summary.total}</span>
        </div>
      `;

      // Sistemas individuales
      for (const [systemName, status] of Object.entries(summary.systems)) {
        const statusClass =
          status === 'error' || status === 'failed'
            ? 'error'
            : status === 'warning' || status === 'recovered'
            ? 'warning'
            : 'success';

        html += `
          <div class="axyra-status-item">
            <span class="axyra-status-label">${systemName.replace('_', ' ')}</span>
            <span class="axyra-status-value ${statusClass}">${status}</span>
          </div>
        `;
      }

      return html;
    } catch (error) {
      console.error('❌ Error generando HTML de estado:', error);
      return '<div class="axyra-status-item">Error generando estado</div>';
    }
  }

  // ========================================
  // MANEJADORES DE EVENTOS
  // ========================================

  handleSystemStatusChange(detail) {
    try {
      console.log('📊 Cambio de estado del sistema:', detail);

      // Actualizar dashboard
      this.updateStatusDashboard();

      // Notificar si es crítico
      if (detail.status === 'error' || detail.status === 'critical') {
        if (window.axyraNotificationSystem) {
          window.axyraNotificationSystem.showErrorNotification(
            `Sistema ${detail.system} en estado crítico: ${detail.message}`,
            10000
          );
        }
      }
    } catch (error) {
      console.error('❌ Error manejando cambio de estado:', error);
    }
  }

  handleSystemError(detail) {
    try {
      console.error('🚨 Error del sistema:', detail);

      // Registrar en sistema de auditoría
      if (window.axyraAuditSystemUnified) {
        window.axyraAuditSystemUnified.logSystemEvent('system_error', detail);
      }

      // Notificar al usuario
      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showErrorNotification(
          `Error en sistema ${detail.system}: ${detail.message}`,
          8000
        );
      }
    } catch (error) {
      console.error('❌ Error manejando error del sistema:', error);
    }
  }

  handleSystemNotification(detail) {
    try {
      console.log('📢 Notificación del sistema:', detail);

      // Reenviar al sistema de notificaciones
      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showNotification(detail.message, detail.type || 'info', detail.duration || 5000);
      }
    } catch (error) {
      console.error('❌ Error manejando notificación del sistema:', error);
    }
  }

  // ========================================
  // MÉTODOS PÚBLICOS
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
  window.axyraIntegration = new AxyraIntegration();
});

// Exportar para uso global
window.AxyraIntegration = AxyraIntegration;
