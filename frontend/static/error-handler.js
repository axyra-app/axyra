// ========================================
// MANEJADOR CENTRALIZADO DE ERRORES AXYRA
// ========================================

class AxyraErrorHandler {
  constructor() {
    this.errors = [];
    this.errorCounts = new Map();
    this.recoveryStrategies = new Map();
    this.maxErrors = 100;
    this.errorThreshold = 10; // Errores antes de activar modo de emergencia
    this.init();
  }

  async init() {
    console.log('🚨 Inicializando Manejador Centralizado de Errores...');

    try {
      // Configurar captura global de errores
      this.setupGlobalErrorCapture();

      // Configurar captura de errores de promesas
      this.setupPromiseErrorCapture();

      // Configurar captura de errores de recursos
      this.setupResourceErrorCapture();

      // Configurar estrategias de recuperación
      this.setupRecoveryStrategies();

      // Configurar modo de emergencia
      this.setupEmergencyMode();

      // Configurar logging de errores
      this.setupErrorLogging();

      console.log('✅ Manejador de Errores inicializado');
    } catch (error) {
      console.error('❌ Error inicializando manejador de errores:', error);
    }
  }

  // ========================================
  // CAPTURA GLOBAL DE ERRORES
  // ========================================

  setupGlobalErrorCapture() {
    try {
      // Capturar errores de JavaScript
      window.addEventListener('error', (event) => {
        this.handleError({
          type: 'javascript_error',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
          timestamp: Date.now(),
          stack: event.error?.stack,
        });
      });

      // Capturar errores de recursos
      window.addEventListener(
        'error',
        (event) => {
          if (event.target !== window) {
            this.handleError({
              type: 'resource_error',
              message: `Error cargando recurso: ${event.target.src || event.target.href}`,
              filename: event.target.src || event.target.href,
              timestamp: Date.now(),
            });
          }
        },
        true
      );

      // Capturar errores de consola
      this.interceptConsoleErrors();

      console.log('✅ Captura global de errores configurada');
    } catch (error) {
      console.error('❌ Error configurando captura global:', error);
    }
  }

  setupPromiseErrorCapture() {
    try {
      // Capturar errores de promesas no manejadas
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError({
          type: 'promise_error',
          message: event.reason?.message || 'Promesa rechazada no manejada',
          reason: event.reason,
          timestamp: Date.now(),
          stack: event.reason?.stack,
        });

        // Prevenir el comportamiento por defecto
        event.preventDefault();
      });

      console.log('✅ Captura de errores de promesas configurada');
    } catch (error) {
      console.error('❌ Error configurando captura de promesas:', error);
    }
  }

  setupResourceErrorCapture() {
    try {
      // Interceptar errores de carga de recursos
      const originalFetch = window.fetch;
      if (originalFetch) {
        window.fetch = async (...args) => {
          try {
            const response = await originalFetch(...args);
            if (!response.ok) {
              this.handleError({
                type: 'fetch_error',
                message: `Error en fetch: ${response.status} ${response.statusText}`,
                url: args[0],
                status: response.status,
                timestamp: Date.now(),
              });
            }
            return response;
          } catch (error) {
            this.handleError({
              type: 'fetch_error',
              message: `Error en fetch: ${error.message}`,
              url: args[0],
              timestamp: Date.now(),
              stack: error.stack,
            });
            throw error;
          }
        };
      }

      console.log('✅ Captura de errores de recursos configurada');
    } catch (error) {
      console.error('❌ Error configurando captura de recursos:', error);
    }
  }

  interceptConsoleErrors() {
    try {
      const originalError = console.error;
      const originalWarn = console.warn;

      console.error = (...args) => {
        this.handleError({
          type: 'console_error',
          message: args.join(' '),
          timestamp: Date.now(),
          args: args,
        });
        originalError.apply(console, args);
      };

      console.warn = (...args) => {
        this.handleError({
          type: 'console_warning',
          message: args.join(' '),
          timestamp: Date.now(),
          args: args,
        });
        originalWarn.apply(console, args);
      };

      console.log('✅ Interceptación de consola configurada');
    } catch (error) {
      console.error('❌ Error interceptando consola:', error);
    }
  }

  // ========================================
  // MANEJO DE ERRORES
  // ========================================

  handleError(errorData) {
    try {
      // Enriquecer datos del error
      const enrichedError = this.enrichErrorData(errorData);

      // Agregar a la lista de errores
      this.addError(enrichedError);

      // Contar errores por tipo
      this.countError(enrichedError.type);

      // Verificar si se debe activar modo de emergencia
      this.checkEmergencyMode();

      // Aplicar estrategia de recuperación
      this.applyRecoveryStrategy(enrichedError);

      // Notificar al usuario si es crítico
      this.notifyUserIfCritical(enrichedError);

      // Log del error
      this.logError(enrichedError);

      console.log('🚨 Error manejado:', enrichedError.type, enrichedError.message);
    } catch (error) {
      console.error('❌ Error en el manejador de errores:', error);
    }
  }

  enrichErrorData(errorData) {
    try {
      const enriched = {
        ...errorData,
        id: this.generateErrorId(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        userId: this.getCurrentUserId(),
        severity: this.calculateErrorSeverity(errorData),
        context: this.getErrorContext(),
      };

      return enriched;
    } catch (error) {
      console.warn('⚠️ Error enriqueciendo datos del error:', error);
      return errorData;
    }
  }

  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId() {
    try {
      return localStorage.getItem('axyra_session_id') || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  getCurrentUserId() {
    try {
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user.username || 'unknown';
      }
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  calculateErrorSeverity(errorData) {
    try {
      let severity = 'low';

      // Errores críticos
      if (errorData.type === 'javascript_error' && errorData.message.includes('Cannot read property')) {
        severity = 'critical';
      } else if (errorData.type === 'resource_error' && errorData.filename?.includes('critical')) {
        severity = 'high';
      } else if (errorData.type === 'promise_error' && errorData.message.includes('Network')) {
        severity = 'high';
      }

      return severity;
    } catch (error) {
      return 'medium';
    }
  }

  getErrorContext() {
    try {
      return {
        currentPage: window.location.pathname,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        memory: this.getMemoryInfo(),
        performance: this.getPerformanceInfo(),
      };
    } catch (error) {
      return {};
    }
  }

  getMemoryInfo() {
    try {
      if ('memory' in performance) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  getPerformanceInfo() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // ========================================
  // GESTIÓN DE ERRORES
  // ========================================

  addError(error) {
    try {
      this.errors.unshift(error);

      // Limitar número de errores
      if (this.errors.length > this.maxErrors) {
        this.errors = this.errors.slice(0, this.maxErrors);
      }

      // Guardar en localStorage
      this.saveErrorsToStorage();
    } catch (error) {
      console.warn('⚠️ Error agregando error a la lista:', error);
    }
  }

  countError(type) {
    try {
      const currentCount = this.errorCounts.get(type) || 0;
      this.errorCounts.set(type, currentCount + 1);
    } catch (error) {
      console.warn('⚠️ Error contando error:', error);
    }
  }

  checkEmergencyMode() {
    try {
      const totalErrors = this.errors.length;
      const criticalErrors = this.errors.filter((e) => e.severity === 'critical').length;

      if (totalErrors > this.errorThreshold || criticalErrors > 5) {
        this.activateEmergencyMode();
      }
    } catch (error) {
      console.warn('⚠️ Error verificando modo de emergencia:', error);
    }
  }

  activateEmergencyMode() {
    try {
      console.warn('🚨 ACTIVANDO MODO DE EMERGENCIA');

      // Mostrar banner de emergencia
      this.showEmergencyBanner();

      // Deshabilitar funcionalidades no críticas
      this.disableNonCriticalFeatures();

      // Activar logging detallado
      this.enableDetailedLogging();

      // Notificar a administradores
      this.notifyAdministrators();

      // Guardar estado de emergencia
      localStorage.setItem('axyra_emergency_mode', 'true');
    } catch (error) {
      console.error('❌ Error activando modo de emergencia:', error);
    }
  }

  showEmergencyBanner() {
    try {
      // Remover banner existente
      const existingBanner = document.getElementById('axyra-emergency-banner');
      if (existingBanner) {
        existingBanner.remove();
      }

      // Crear banner de emergencia
      const banner = document.createElement('div');
      banner.id = 'axyra-emergency-banner';
      banner.innerHTML = `
        <div class="axyra-emergency-content">
          <i class="fas fa-exclamation-triangle"></i>
          <span>MODO DE EMERGENCIA ACTIVADO - Se han detectado múltiples errores</span>
          <button onclick="axyraErrorHandler.deactivateEmergencyMode()">Desactivar</button>
        </div>
      `;

      document.body.appendChild(banner);
    } catch (error) {
      console.error('❌ Error mostrando banner de emergencia:', error);
    }
  }

  deactivateEmergencyMode() {
    try {
      console.log('✅ Desactivando modo de emergencia');

      // Remover banner
      const banner = document.getElementById('axyra-emergency-banner');
      if (banner) {
        banner.remove();
      }

      // Habilitar funcionalidades
      this.enableAllFeatures();

      // Limpiar estado
      localStorage.removeItem('axyra_emergency_mode');

      // Limpiar contadores de errores
      this.errorCounts.clear();

      // Mostrar notificación
      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showNotification('Modo de emergencia desactivado', 'success');
      }
    } catch (error) {
      console.error('❌ Error desactivando modo de emergencia:', error);
    }
  }

  // ========================================
  // ESTRATEGIAS DE RECUPERACIÓN
  // ========================================

  setupRecoveryStrategies() {
    try {
      // Estrategia para errores de JavaScript
      this.recoveryStrategies.set('javascript_error', {
        action: 'reload_page',
        priority: 'high',
        description: 'Recargar página para recuperar funcionalidad',
      });

      // Estrategia para errores de recursos
      this.recoveryStrategies.set('resource_error', {
        action: 'retry_load',
        priority: 'medium',
        description: 'Reintentar carga del recurso',
      });

      // Estrategia para errores de promesas
      this.recoveryStrategies.set('promise_error', {
        action: 'show_fallback',
        priority: 'medium',
        description: 'Mostrar interfaz alternativa',
      });

      // Estrategia para errores de fetch
      this.recoveryStrategies.set('fetch_error', {
        action: 'use_cache',
        priority: 'low',
        description: 'Usar datos en cache',
      });

      console.log('✅ Estrategias de recuperación configuradas');
    } catch (error) {
      console.error('❌ Error configurando estrategias de recuperación:', error);
    }
  }

  applyRecoveryStrategy(error) {
    try {
      const strategy = this.recoveryStrategies.get(error.type);
      if (!strategy) return;

      console.log(`🔧 Aplicando estrategia de recuperación: ${strategy.action}`);

      switch (strategy.action) {
        case 'reload_page':
          this.reloadPage();
          break;
        case 'retry_load':
          this.retryResourceLoad(error);
          break;
        case 'show_fallback':
          this.showFallbackInterface(error);
          break;
        case 'use_cache':
          this.useCachedData(error);
          break;
        default:
          console.log('⚠️ Estrategia de recuperación no reconocida:', strategy.action);
      }
    } catch (error) {
      console.error('❌ Error aplicando estrategia de recuperación:', error);
    }
  }

  reloadPage() {
    try {
      // Solo recargar si no estamos en modo de emergencia
      if (!localStorage.getItem('axyra_emergency_mode')) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error recargando página:', error);
    }
  }

  retryResourceLoad(error) {
    try {
      if (error.filename) {
        // Reintentar carga del recurso
        const element = document.querySelector(`[src="${error.filename}"], [href="${error.filename}"]`);
        if (element) {
          element.src = element.src + '?retry=' + Date.now();
        }
      }
    } catch (error) {
      console.error('❌ Error reintentando carga de recurso:', error);
    }
  }

  showFallbackInterface(error) {
    try {
      // Mostrar interfaz alternativa
      const fallbackContainer = document.createElement('div');
      fallbackContainer.className = 'axyra-fallback-interface';
      fallbackContainer.innerHTML = `
        <div class="axyra-fallback-content">
          <h3>Interfaz Alternativa</h3>
          <p>Se ha activado la interfaz de respaldo debido a un error.</p>
          <button onclick="axyraErrorHandler.retryMainInterface()">Reintentar Interfaz Principal</button>
        </div>
      `;

      document.body.appendChild(fallbackContainer);
    } catch (error) {
      console.error('❌ Error mostrando interfaz alternativa:', error);
    }
  }

  useCachedData(error) {
    try {
      // Usar datos en cache si están disponibles
      if (window.axyraPerformanceOptimizer) {
        const cachedData = window.axyraPerformanceOptimizer.getCachedData('empleados');
        if (cachedData) {
          console.log('📦 Usando datos en cache');
          // Aplicar datos en cache
        }
      }
    } catch (error) {
      console.error('❌ Error usando datos en cache:', error);
    }
  }

  // ========================================
  // NOTIFICACIONES Y LOGGING
  // ========================================

  notifyUserIfCritical(error) {
    try {
      if (error.severity === 'critical') {
        if (window.axyraNotificationSystem) {
          window.axyraNotificationSystem.showErrorNotification(`Error crítico detectado: ${error.message}`, 10000);
        }
      }
    } catch (error) {
      console.warn('⚠️ Error notificando usuario:', error);
    }
  }

  logError(error) {
    try {
      // Log en consola
      console.group(`🚨 Error: ${error.type}`);
      console.error('Mensaje:', error.message);
      console.error('Severidad:', error.severity);
      console.error('Timestamp:', new Date(error.timestamp).toISOString());
      console.error('Contexto:', error.context);
      if (error.stack) {
        console.error('Stack:', error.stack);
      }
      console.groupEnd();

      // Log en sistema de auditoría
      if (window.axyraAuditSystemUnified) {
        window.axyraAuditSystemUnified.logSystemEvent('error', error);
      }

      // Log en localStorage para análisis posterior
      this.saveErrorToStorage(error);
    } catch (error) {
      console.warn('⚠️ Error en logging:', error);
    }
  }

  saveErrorToStorage(error) {
    try {
      const errorLog = JSON.parse(localStorage.getItem('axyra_error_log') || '[]');
      errorLog.push(error);

      // Mantener solo los últimos 50 errores
      if (errorLog.length > 50) {
        errorLog.splice(0, errorLog.length - 50);
      }

      localStorage.setItem('axyra_error_log', JSON.stringify(errorLog));
    } catch (error) {
      console.warn('⚠️ Error guardando error en storage:', error);
    }
  }

  saveErrorsToStorage() {
    try {
      localStorage.setItem('axyra_errors', JSON.stringify(this.errors));
    } catch (error) {
      console.warn('⚠️ Error guardando errores en storage:', error);
    }
  }

  // ========================================
  // MÉTODOS PÚBLICOS
  // ========================================

  getErrorReport() {
    try {
      return {
        totalErrors: this.errors.length,
        errorsByType: this.getErrorsByType(),
        errorsBySeverity: this.getErrorsBySeverity(),
        recentErrors: this.errors.slice(0, 10),
        errorCounts: Object.fromEntries(this.errorCounts),
        emergencyMode: !!localStorage.getItem('axyra_emergency_mode'),
      };
    } catch (error) {
      console.error('❌ Error generando reporte de errores:', error);
      return null;
    }
  }

  getErrorsByType() {
    try {
      const grouped = {};
      this.errors.forEach((error) => {
        if (!grouped[error.type]) {
          grouped[error.type] = [];
        }
        grouped[error.type].push(error);
      });
      return grouped;
    } catch (error) {
      return {};
    }
  }

  getErrorsBySeverity() {
    try {
      const grouped = {};
      this.errors.forEach((error) => {
        if (!grouped[error.severity]) {
          grouped[error.severity] = [];
        }
        grouped[error.severity].push(error);
      });
      return grouped;
    } catch (error) {
      return {};
    }
  }

  clearErrors() {
    try {
      this.errors = [];
      this.errorCounts.clear();
      localStorage.removeItem('axyra_errors');
      localStorage.removeItem('axyra_error_log');

      console.log('✅ Errores limpiados');
    } catch (error) {
      console.error('❌ Error limpiando errores:', error);
    }
  }

  // Función global para manejo de errores
  static handleError(errorData) {
    if (window.axyraErrorHandler) {
      window.axyraErrorHandler.handleError(errorData);
    }
  }

  static getReport() {
    if (window.axyraErrorHandler) {
      return window.axyraErrorHandler.getErrorReport();
    }
    return null;
  }
}

// Inicializar manejador de errores
document.addEventListener('DOMContentLoaded', () => {
  window.axyraErrorHandler = new AxyraErrorHandler();
});

// Exportar para uso global
window.AxyraErrorHandler = AxyraErrorHandler;
