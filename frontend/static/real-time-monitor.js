// ========================================
// SISTEMA DE MONITOREO EN TIEMPO REAL AXYRA
// ========================================

class AxyraRealTimeMonitor {
  constructor() {
    this.connections = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.dataSyncInterval = null;
    this.offlineQueue = [];
    this.init();
  }

  async init() {
    console.log('🔄 Inicializando Sistema de Monitoreo en Tiempo Real...');

    try {
      // Configurar WebSocket
      this.setupWebSocket();

      // Configurar notificaciones push
      this.setupPushNotifications();

      // Configurar sincronización automática
      this.setupAutoSync();

      // Configurar monitoreo de conectividad
      this.setupConnectivityMonitoring();

      console.log('✅ Sistema de Monitoreo en Tiempo Real inicializado');
    } catch (error) {
      console.error('❌ Error inicializando monitoreo en tiempo real:', error);
    }
  }

  // ========================================
  // CONFIGURACIÓN DE WEBSOCKET
  // ========================================

  setupWebSocket() {
    try {
      // Intentar conectar a WebSocket (simulado para desarrollo)
      this.simulateWebSocketConnection();

      // En producción, usar WebSocket real
      // this.connectWebSocket();
    } catch (error) {
      console.warn('⚠️ WebSocket no disponible, usando modo offline:', error);
    }
  }

  simulateWebSocketConnection() {
    // Simular conexión WebSocket para desarrollo
    console.log('🔌 Simulando conexión WebSocket...');

    setTimeout(() => {
      this.isConnected = true;
      this.onConnectionEstablished();

      // Simular mensajes en tiempo real
      this.startSimulatedMessages();
    }, 1000);
  }

  connectWebSocket() {
    try {
      const wsUrl = this.getWebSocketUrl();
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔌 WebSocket conectado');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnectionEstablished();
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        this.handleWebSocketMessage(event.data);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket desconectado');
        this.isConnected = false;
        this.onConnectionLost();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ Error en WebSocket:', error);
      };
    } catch (error) {
      console.error('❌ Error conectando WebSocket:', error);
    }
  }

  getWebSocketUrl() {
    // Obtener URL del WebSocket según el entorno
    if (window.location.hostname === 'localhost') {
      return 'ws://localhost:8080/ws';
    } else {
      return `wss://${window.location.hostname}/ws`;
    }
  }

  // ========================================
  // MANEJO DE MENSAJES WEBSOCKET
  // ========================================

  handleWebSocketMessage(data) {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'data_update':
          this.handleDataUpdate(message.data);
          break;
        case 'notification':
          this.handleRealTimeNotification(message.data);
          break;
        case 'system_alert':
          this.handleSystemAlert(message.data);
          break;
        case 'user_activity':
          this.handleUserActivity(message.data);
          break;
        default:
          console.log('📨 Mensaje WebSocket no reconocido:', message);
      }
    } catch (error) {
      console.error('❌ Error procesando mensaje WebSocket:', error);
    }
  }

  handleDataUpdate(data) {
    console.log('🔄 Actualización de datos en tiempo real:', data);

    // Actualizar datos locales
    this.updateLocalData(data);

    // Notificar a otros componentes
    this.notifyDataUpdate(data);
  }

  handleRealTimeNotification(data) {
    console.log('🔔 Notificación en tiempo real:', data);

    // Mostrar notificación
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showNotification(data.message, data.type);
    }

    // Enviar notificación push si está habilitada
    this.sendPushNotification(data);
  }

  handleSystemAlert(data) {
    console.log('🚨 Alerta del sistema:', data);

    // Mostrar alerta visual
    this.showSystemAlert(data);

    // Registrar en sistema de auditoría
    if (window.axyraAuditSystemUnified) {
      window.axyraAuditSystemUnified.logSecurityEvent('system_alert', data);
    }
  }

  handleUserActivity(data) {
    console.log('👤 Actividad de usuario:', data);

    // Actualizar indicadores de actividad
    this.updateActivityIndicators(data);

    // Registrar en auditoría
    if (window.axyraAuditSystemUnified) {
      window.axyraAuditSystemUnified.logUserAction('user_activity', data);
    }
  }

  // ========================================
  // NOTIFICACIONES PUSH
  // ========================================

  setupPushNotifications() {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        this.registerServiceWorker();
        this.requestNotificationPermission();
      } else {
        console.log('ℹ️ Notificaciones push no soportadas');
      }
    } catch (error) {
      console.error('❌ Error configurando notificaciones push:', error);
    }
  }

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registrado:', registration);

      // Solicitar permisos de notificación
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✅ Permisos de notificación otorgados');
        this.subscribeToPushNotifications(registration);
      }
    } catch (error) {
      console.error('❌ Error registrando Service Worker:', error);
    }
  }

  async subscribeToPushNotifications(registration) {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey()),
      });

      console.log('✅ Suscrito a notificaciones push:', subscription);

      // Guardar suscripción
      localStorage.setItem('axyra_push_subscription', JSON.stringify(subscription));
    } catch (error) {
      console.error('❌ Error suscribiendo a notificaciones push:', error);
    }
  }

  sendPushNotification(data) {
    try {
      if (Notification.permission === 'granted') {
        const notification = new Notification(data.title || 'AXYRA', {
          body: data.message,
          icon: '/static/logo.png',
          badge: '/static/logo.png',
          tag: data.tag || 'axyra-notification',
          data: data,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    } catch (error) {
      console.error('❌ Error enviando notificación push:', error);
    }
  }

  // ========================================
  // SINCRONIZACIÓN AUTOMÁTICA
  // ========================================

  setupAutoSync() {
    try {
      // Sincronizar datos cada 30 segundos si hay conexión
      this.dataSyncInterval = setInterval(() => {
        if (this.isConnected) {
          this.syncCriticalData();
        }
      }, 30000);

      // Sincronizar datos pendientes cuando se restaura la conexión
      this.syncPendingData();

      console.log('✅ Sincronización automática configurada');
    } catch (error) {
      console.error('❌ Error configurando sincronización automática:', error);
    }
  }

  async syncCriticalData() {
    try {
      console.log('🔄 Sincronizando datos críticos...');

      // Sincronizar empleados
      if (window.firebaseSyncManager) {
        await window.firebaseSyncManager.syncEmpleados();
      }

      // Sincronizar horas
      if (window.firebaseSyncManager) {
        await window.firebaseSyncManager.syncHoras();
      }

      // Sincronizar nóminas
      if (window.firebaseSyncManager) {
        await window.firebaseSyncManager.syncNominas();
      }

      console.log('✅ Datos críticos sincronizados');
    } catch (error) {
      console.error('❌ Error sincronizando datos críticos:', error);
    }
  }

  async syncPendingData() {
    try {
      const pendingData = localStorage.getItem('axyra_pending_sync');
      if (pendingData) {
        const pending = JSON.parse(pendingData);

        if (pending.length > 0) {
          console.log(`🔄 Sincronizando ${pending.length} elementos pendientes...`);

          for (const item of pending) {
            await this.processPendingItem(item);
          }

          // Limpiar cola de sincronización
          localStorage.removeItem('axyra_pending_sync');
          console.log('✅ Datos pendientes sincronizados');
        }
      }
    } catch (error) {
      console.error('❌ Error sincronizando datos pendientes:', error);
    }
  }

  async processPendingItem(item) {
    try {
      switch (item.type) {
        case 'empleado':
          if (window.firebaseSyncManager) {
            await window.firebaseSyncManager.saveEmpleadoToFirebase(item.data);
          }
          break;
        case 'hora':
          if (window.firebaseSyncManager) {
            await window.firebaseSyncManager.saveHorasToFirebase(item.data);
          }
          break;
        case 'nomina':
          if (window.firebaseSyncManager) {
            await window.firebaseSyncManager.saveNominaToFirebase(item.data);
          }
          break;
      }
    } catch (error) {
      console.error('❌ Error procesando elemento pendiente:', error);
    }
  }

  // ========================================
  // MONITOREO DE CONECTIVIDAD
  // ========================================

  setupConnectivityMonitoring() {
    try {
      // Escuchar cambios de conectividad
      window.addEventListener('online', () => this.onOnline());
      window.addEventListener('offline', () => this.onOffline());

      // Monitorear latencia de red
      this.startLatencyMonitoring();

      console.log('✅ Monitoreo de conectividad configurado');
    } catch (error) {
      console.error('❌ Error configurando monitoreo de conectividad:', error);
    }
  }

  onOnline() {
    console.log('🌐 Conexión restaurada');
    this.isConnected = true;

    // Reconectar WebSocket
    if (this.ws && this.ws.readyState === WebSocket.CLOSED) {
      this.connectWebSocket();
    }

    // Sincronizar datos pendientes
    this.syncPendingData();

    // Notificar al usuario
    this.showConnectionStatus('Conexión restaurada', 'success');
  }

  onOffline() {
    console.log('📡 Conexión perdida');
    this.isConnected = false;

    // Cambiar a modo offline
    this.enableOfflineMode();

    // Notificar al usuario
    this.showConnectionStatus('Modo offline activado', 'warning');
  }

  enableOfflineMode() {
    // Activar funcionalidades offline
    this.cacheCriticalData();
    this.enableOfflineFeatures();

    // Mostrar indicador de modo offline
    this.showOfflineIndicator();
  }

  // ========================================
  // FUNCIONES AUXILIARES
  // ========================================

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.ws) {
        this.ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
      }
    }, 30000);
  }

  startLatencyMonitoring() {
    setInterval(() => {
      if (this.isConnected) {
        this.measureLatency();
      }
    }, 60000);
  }

  async measureLatency() {
    try {
      const start = performance.now();

      // Enviar ping al servidor
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: start }));
      }

      // En producción, medir latencia real
      const latency = performance.now() - start;

      // Guardar métricas de latencia
      this.saveLatencyMetrics(latency);
    } catch (error) {
      console.warn('⚠️ Error midiendo latencia:', error);
    }
  }

  saveLatencyMetrics(latency) {
    try {
      const metrics = JSON.parse(localStorage.getItem('axyra_latency_metrics') || '[]');
      metrics.push({
        timestamp: Date.now(),
        latency: latency,
      });

      // Mantener solo las últimas 100 mediciones
      if (metrics.length > 100) {
        metrics.splice(0, metrics.length - 100);
      }

      localStorage.setItem('axyra_latency_metrics', JSON.stringify(metrics));
    } catch (error) {
      console.warn('⚠️ Error guardando métricas de latencia:', error);
    }
  }

  // ========================================
  // SIMULACIÓN PARA DESARROLLO
  // ========================================

  startSimulatedMessages() {
    // Simular mensajes en tiempo real para desarrollo
    setInterval(() => {
      if (this.isConnected) {
        this.simulateRealTimeUpdate();
      }
    }, 10000);
  }

  simulateRealTimeUpdate() {
    const updates = [
      {
        type: 'data_update',
        data: {
          module: 'empleados',
          action: 'update',
          timestamp: new Date().toISOString(),
        },
      },
      {
        type: 'notification',
        data: {
          message: 'Nuevo empleado registrado en tiempo real',
          type: 'info',
          timestamp: new Date().toISOString(),
        },
      },
    ];

    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
    this.handleWebSocketMessage(JSON.stringify(randomUpdate));
  }

  // ========================================
  // UTILIDADES
  // ========================================

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  getVapidPublicKey() {
    // Clave pública VAPID para notificaciones push
    return 'BEl62iUYgUivxIkv69yViEuiBIa1HI0lKb6y8t8W2XVgX4YmcpVJ8RL-RctaT4jEOruw6XbQ1gMBmoSZSL2xJFD1Y';
  }

  // ========================================
  // MÉTODOS PÚBLICOS
  // ========================================

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      lastHeartbeat: this.lastHeartbeat,
      latency: this.getAverageLatency(),
    };
  }

  getAverageLatency() {
    try {
      const metrics = JSON.parse(localStorage.getItem('axyra_latency_metrics') || '[]');
      if (metrics.length === 0) return 0;

      const sum = metrics.reduce((total, metric) => total + metric.latency, 0);
      return Math.round(sum / metrics.length);
    } catch (error) {
      return 0;
    }
  }

  showConnectionStatus(message, type) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showNotification(message, type);
    }
  }

  showOfflineIndicator() {
    // Crear indicador visual de modo offline
    const indicator = document.createElement('div');
    indicator.id = 'axyra-offline-indicator';
    indicator.innerHTML = `
      <div class="axyra-offline-banner">
        <i class="fas fa-wifi-slash"></i>
        <span>Modo Offline - Los cambios se guardarán localmente</span>
      </div>
    `;

    document.body.appendChild(indicator);
  }

  cacheCriticalData() {
    // Cachear datos críticos para uso offline
    const criticalData = {
      empleados: localStorage.getItem('axyra_empleados'),
      horas: localStorage.getItem('axyra_horas'),
      nominas: localStorage.getItem('axyra_nominas'),
      timestamp: Date.now(),
    };

    localStorage.setItem('axyra_offline_cache', JSON.stringify(criticalData));
  }

  enableOfflineFeatures() {
    // Habilitar funcionalidades que funcionan offline
    document.body.classList.add('axyra-offline-mode');
  }
}

// Inicializar sistema de monitoreo en tiempo real
document.addEventListener('DOMContentLoaded', () => {
  window.axyraRealTimeMonitor = new AxyraRealTimeMonitor();
});

// Exportar para uso global
window.AxyraRealTimeMonitor = AxyraRealTimeMonitor;
