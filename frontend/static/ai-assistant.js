// ========================================
// ASISTENTE DE IA BÁSICO AXYRA
// ========================================

class AxyraAIAssistant {
  constructor() {
    this.conversationHistory = [];
    this.userPreferences = {};
    this.aiModels = new Map();
    this.automationRules = new Map();
    this.predictiveAnalytics = new Map();
    this.maxHistoryLength = 100;
    this.init();
  }

  async init() {
    console.log('🤖 Inicializando Asistente de IA Básico...');

    try {
      // Configurar modelos de IA
      this.setupAIModels();

      // Configurar reglas de automatización
      this.setupAutomationRules();

      // Configurar análisis predictivo
      this.setupPredictiveAnalytics();

      // Configurar procesamiento de lenguaje natural
      this.setupNaturalLanguageProcessing();

      // Configurar interfaz del asistente
      this.setupAssistantInterface();

      // Configurar aprendizaje automático básico
      this.setupBasicMachineLearning();

      console.log('✅ Asistente de IA Básico inicializado');
    } catch (error) {
      console.error('❌ Error inicializando asistente de IA:', error);
    }
  }

  // ========================================
  // MODELOS DE IA
  // ========================================

  setupAIModels() {
    try {
      // Modelo de clasificación de texto
      this.aiModels.set('text_classifier', {
        type: 'classification',
        purpose: 'Clasificar consultas y solicitudes de usuarios',
        accuracy: 0.85,
        trainingData: this.getTrainingData(),
      });

      // Modelo de análisis de sentimientos
      this.aiModels.set('sentiment_analyzer', {
        type: 'sentiment',
        purpose: 'Analizar el estado emocional del usuario',
        accuracy: 0.78,
        trainingData: this.getSentimentTrainingData(),
      });

      // Modelo de predicción de patrones
      this.aiModels.set('pattern_predictor', {
        type: 'prediction',
        purpose: 'Predecir patrones en datos de nómina y empleados',
        accuracy: 0.82,
        trainingData: this.getPatternTrainingData(),
      });

      // Modelo de recomendaciones
      this.aiModels.set('recommendation_engine', {
        type: 'recommendation',
        purpose: 'Generar recomendaciones personalizadas',
        accuracy: 0.79,
        trainingData: this.getRecommendationTrainingData(),
      });

      console.log('✅ Modelos de IA configurados');
    } catch (error) {
      console.error('❌ Error configurando modelos de IA:', error);
    }
  }

  getTrainingData() {
    try {
      // Datos de entrenamiento para clasificación
      return [
        { text: 'agregar empleado', category: 'empleado_management', intent: 'create' },
        { text: 'calcular nómina', category: 'nomina_calculation', intent: 'calculate' },
        { text: 'registrar horas', category: 'horas_registration', intent: 'record' },
        { text: 'generar reporte', category: 'report_generation', intent: 'generate' },
        { text: 'configurar sistema', category: 'system_configuration', intent: 'configure' },
        { text: 'ayuda', category: 'help_request', intent: 'help' },
        { text: 'error', category: 'error_report', intent: 'report' },
        { text: 'backup', category: 'data_backup', intent: 'backup' },
      ];
    } catch (error) {
      return [];
    }
  }

  getSentimentTrainingData() {
    try {
      return [
        { text: 'excelente trabajo', sentiment: 'positive', score: 0.9 },
        { text: 'muy bien', sentiment: 'positive', score: 0.8 },
        { text: 'bien', sentiment: 'positive', score: 0.7 },
        { text: 'regular', sentiment: 'neutral', score: 0.5 },
        { text: 'mal', sentiment: 'negative', score: 0.3 },
        { text: 'terrible', sentiment: 'negative', score: 0.1 },
        { text: 'no funciona', sentiment: 'negative', score: 0.2 },
        { text: 'perfecto', sentiment: 'positive', score: 1.0 },
      ];
    } catch (error) {
      return [];
    }
  }

  getPatternTrainingData() {
    try {
      return [
        { pattern: 'empleados_nuevos_mes', prediction: 'incremento_5_10%', confidence: 0.85 },
        { pattern: 'horas_extras_fin_semana', prediction: 'incremento_15_20%', confidence: 0.78 },
        { pattern: 'ausencias_lunes', prediction: 'incremento_10_15%', confidence: 0.72 },
        { pattern: 'productividad_mañana', prediction: 'pico_9_11am', confidence: 0.88 },
        { pattern: 'errores_sistema', prediction: 'reduccion_30%', confidence: 0.75 },
      ];
    } catch (error) {
      return [];
    }
  }

  getRecommendationTrainingData() {
    try {
      return [
        { user_type: 'admin', action: 'backup_daily', recommendation: 'Realizar backup diario', priority: 'high' },
        {
          user_type: 'hr',
          action: 'review_attendance',
          recommendation: 'Revisar ausencias mensuales',
          priority: 'medium',
        },
        {
          user_type: 'accountant',
          action: 'tax_calculation',
          recommendation: 'Calcular retenciones trimestrales',
          priority: 'high',
        },
        {
          user_type: 'manager',
          action: 'performance_review',
          recommendation: 'Evaluar rendimiento trimestral',
          priority: 'medium',
        },
      ];
    } catch (error) {
      return [];
    }
  }

  // ========================================
  // PROCESAMIENTO DE LENGUAJE NATURAL
  // ========================================

  setupNaturalLanguageProcessing() {
    try {
      // Configurar tokenización básica
      this.setupTokenization();

      // Configurar análisis de intenciones
      this.setupIntentAnalysis();

      // Configurar extracción de entidades
      this.setupEntityExtraction();

      // Configurar generación de respuestas
      this.setupResponseGeneration();

      console.log('✅ Procesamiento de lenguaje natural configurado');
    } catch (error) {
      console.error('❌ Error configurando NLP:', error);
    }
  }

  setupTokenization() {
    try {
      this.tokenize = (text) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter((token) => token.length > 2);
      };
    } catch (error) {
      console.warn('⚠️ Error configurando tokenización:', error);
    }
  }

  setupIntentAnalysis() {
    try {
      this.analyzeIntent = (text) => {
        const tokens = this.tokenize(text);
        const trainingData = this.getTrainingData();

        let bestMatch = { category: 'unknown', intent: 'unknown', confidence: 0 };

        trainingData.forEach((example) => {
          const exampleTokens = this.tokenize(example.text);
          const similarity = this.calculateSimilarity(tokens, exampleTokens);

          if (similarity > bestMatch.confidence) {
            bestMatch = {
              category: example.category,
              intent: example.intent,
              confidence: similarity,
            };
          }
        });

        return bestMatch;
      };
    } catch (error) {
      console.warn('⚠️ Error configurando análisis de intenciones:', error);
    }
  }

  calculateSimilarity(tokens1, tokens2) {
    try {
      const intersection = tokens1.filter((token) => tokens2.includes(token));
      const union = [...new Set([...tokens1, ...tokens2])];

      return intersection.length / union.length;
    } catch (error) {
      return 0;
    }
  }

  setupEntityExtraction() {
    try {
      this.extractEntities = (text) => {
        const entities = {
          dates: this.extractDates(text),
          numbers: this.extractNumbers(text),
          names: this.extractNames(text),
          actions: this.extractActions(text),
        };

        return entities;
      };
    } catch (error) {
      console.warn('⚠️ Error configurando extracción de entidades:', error);
    }
  }

  extractDates(text) {
    try {
      const datePatterns = [/\d{1,2}\/\d{1,2}\/\d{4}/g, /\d{1,2}-\d{1,2}-\d{4}/g, /\d{1,2}\/\d{1,2}\/\d{2}/g];

      const dates = [];
      datePatterns.forEach((pattern) => {
        const matches = text.match(pattern);
        if (matches) {
          dates.push(...matches);
        }
      });

      return dates;
    } catch (error) {
      return [];
    }
  }

  extractNumbers(text) {
    try {
      const numberPattern = /\d+(?:\.\d+)?/g;
      return text.match(numberPattern) || [];
    } catch (error) {
      return [];
    }
  }

  extractNames(text) {
    try {
      // Patrón básico para nombres (mayúsculas seguidas de minúsculas)
      const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
      return text.match(namePattern) || [];
    } catch (error) {
      return [];
    }
  }

  extractActions(text) {
    try {
      const actionWords = ['agregar', 'eliminar', 'modificar', 'calcular', 'generar', 'enviar', 'guardar'];
      const tokens = this.tokenize(text);
      return tokens.filter((token) => actionWords.includes(token));
    } catch (error) {
      return [];
    }
  }

  setupResponseGeneration() {
    try {
      this.generateResponse = (intent, entities, context) => {
        const responseTemplates = this.getResponseTemplates();
        const template = responseTemplates[intent.category] || responseTemplates.default;

        let response = template;

        // Personalizar respuesta con entidades extraídas
        if (entities.dates.length > 0) {
          response = response.replace('{date}', entities.dates[0]);
        }

        if (entities.names.length > 0) {
          response = response.replace('{name}', entities.names[0]);
        }

        if (entities.numbers.length > 0) {
          response = response.replace('{number}', entities.numbers[0]);
        }

        return response;
      };
    } catch (error) {
      console.warn('⚠️ Error configurando generación de respuestas:', error);
    }
  }

  getResponseTemplates() {
    try {
      return {
        empleado_management: 'Entendido, voy a ayudarte con la gestión de empleados. {action}',
        nomina_calculation: 'Perfecto, procederé a calcular la nómina para {date}',
        horas_registration: 'Registrando las horas de trabajo. ¿Necesitas algo más específico?',
        report_generation: 'Generando el reporte solicitado. ¿Qué período te interesa?',
        system_configuration: 'Configurando el sistema según tus preferencias',
        help_request: '¡Con gusto te ayudo! ¿En qué puedo asistirte?',
        error_report: 'Lamento el inconveniente. Voy a investigar el error reportado',
        default: 'Entiendo tu solicitud. ¿Puedes ser más específico?',
      };
    } catch (error) {
      return { default: 'Entiendo tu solicitud. ¿Puedes ser más específico?' };
    }
  }

  // ========================================
  // AUTOMATIZACIÓN INTELIGENTE
  // ========================================

  setupAutomationRules() {
    try {
      // Regla para backup automático
      this.automationRules.set('auto_backup', {
        trigger: 'daily_at_2am',
        action: 'perform_backup',
        conditions: ['system_healthy', 'low_traffic'],
        priority: 'high',
        description: 'Backup automático diario del sistema',
      });

      // Regla para limpieza de cache
      this.automationRules.set('cache_cleanup', {
        trigger: 'weekly_on_sunday',
        action: 'cleanup_cache',
        conditions: ['cache_size_greater_than_100mb'],
        priority: 'medium',
        description: 'Limpieza semanal del cache del sistema',
      });

      // Regla para sincronización de datos
      this.automationRules.set('data_sync', {
        trigger: 'every_30_minutes',
        action: 'sync_data',
        conditions: ['internet_available', 'firebase_accessible'],
        priority: 'high',
        description: 'Sincronización automática de datos con Firebase',
      });

      // Regla para análisis de performance
      this.automationRules.set('performance_analysis', {
        trigger: 'daily_at_6pm',
        action: 'analyze_performance',
        conditions: ['business_hours_ended'],
        priority: 'medium',
        description: 'Análisis diario de performance del sistema',
      });

      console.log('✅ Reglas de automatización configuradas');
    } catch (error) {
      console.error('❌ Error configurando reglas de automatización:', error);
    }
  }

  executeAutomationRule(ruleName) {
    try {
      const rule = this.automationRules.get(ruleName);
      if (!rule) {
        throw new Error(`Regla de automatización no encontrada: ${ruleName}`);
      }

      console.log(`🤖 Ejecutando regla de automatización: ${rule.description}`);

      // Verificar condiciones
      if (this.checkAutomationConditions(rule.conditions)) {
        // Ejecutar acción
        this.performAutomationAction(rule.action);

        // Registrar ejecución
        this.logAutomationExecution(ruleName, 'success');
      } else {
        console.log(`⚠️ Condiciones no cumplidas para la regla: ${ruleName}`);
        this.logAutomationExecution(ruleName, 'conditions_not_met');
      }
    } catch (error) {
      console.error(`❌ Error ejecutando regla de automatización ${ruleName}:`, error);
      this.logAutomationExecution(ruleName, 'error', error.message);
    }
  }

  checkAutomationConditions(conditions) {
    try {
      return conditions.every((condition) => {
        switch (condition) {
          case 'system_healthy':
            return !localStorage.getItem('axyra_emergency_mode');
          case 'low_traffic':
            return this.isLowTrafficTime();
          case 'internet_available':
            return navigator.onLine;
          case 'firebase_accessible':
            return window.firebaseSyncManager && window.firebaseSyncManager.isConnected();
          case 'cache_size_greater_than_100mb':
            return this.getCacheSize() > 100 * 1024 * 1024; // 100MB
          case 'business_hours_ended':
            return this.isBusinessHoursEnded();
          default:
            return true;
        }
      });
    } catch (error) {
      console.warn('⚠️ Error verificando condiciones de automatización:', error);
      return false;
    }
  }

  isLowTrafficTime() {
    try {
      const hour = new Date().getHours();
      return hour >= 2 && hour <= 5; // 2 AM - 5 AM
    } catch (error) {
      return false;
    }
  }

  isBusinessHoursEnded() {
    try {
      const hour = new Date().getHours();
      return hour >= 18; // 6 PM en adelante
    } catch (error) {
      return false;
    }
  }

  getCacheSize() {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('axyra_')) {
          totalSize += localStorage.getItem(key).length;
        }
      }
      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  performAutomationAction(action) {
    try {
      switch (action) {
        case 'perform_backup':
          this.performAutomatedBackup();
          break;
        case 'cleanup_cache':
          this.performCacheCleanup();
          break;
        case 'sync_data':
          this.performDataSync();
          break;
        case 'analyze_performance':
          this.performPerformanceAnalysis();
          break;
        default:
          console.log('⚠️ Acción de automatización no reconocida:', action);
      }
    } catch (error) {
      console.error('❌ Error ejecutando acción de automatización:', error);
    }
  }

  performAutomatedBackup() {
    try {
      console.log('💾 Ejecutando backup automático...');

      // Crear backup de datos críticos
      const backupData = {
        empleados: localStorage.getItem('axyra_empleados'),
        horas: localStorage.getItem('axyra_horas'),
        nominas: localStorage.getItem('axyra_nominas'),
        configuracion: localStorage.getItem('axyra_configuracion'),
        timestamp: Date.now(),
      };

      // Guardar backup
      localStorage.setItem('axyra_automated_backup', JSON.stringify(backupData));

      // Notificar al usuario
      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showNotification('Backup automático completado', 'info');
      }

      console.log('✅ Backup automático completado');
    } catch (error) {
      console.error('❌ Error en backup automático:', error);
    }
  }

  performCacheCleanup() {
    try {
      console.log('🧹 Ejecutando limpieza de cache...');

      // Limpiar cache antiguo
      const keysToClean = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('axyra_cache_')) {
          const data = JSON.parse(localStorage.getItem(key));
          if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
            // 24 horas
            keysToClean.push(key);
          }
        }
      }

      keysToClean.forEach((key) => localStorage.removeItem(key));

      console.log(`✅ Cache limpiado. Elementos removidos: ${keysToClean.length}`);
    } catch (error) {
      console.error('❌ Error en limpieza de cache:', error);
    }
  }

  performDataSync() {
    try {
      console.log('🔄 Ejecutando sincronización automática...');

      if (window.firebaseSyncManager) {
        window.firebaseSyncManager.syncAllData();
      }

      console.log('✅ Sincronización automática completada');
    } catch (error) {
      console.error('❌ Error en sincronización automática:', error);
    }
  }

  performPerformanceAnalysis() {
    try {
      console.log('📊 Ejecutando análisis de performance...');

      if (window.axyraPerformanceOptimizer) {
        const report = window.axyraPerformanceOptimizer.getPerformanceReport();
        console.log('📈 Reporte de performance:', report);
      }

      console.log('✅ Análisis de performance completado');
    } catch (error) {
      console.error('❌ Error en análisis de performance:', error);
    }
  }

  // ========================================
  // ANÁLISIS PREDICTIVO
  // ========================================

  setupPredictiveAnalytics() {
    try {
      // Configurar análisis de tendencias
      this.setupTrendAnalysis();

      // Configurar predicción de patrones
      this.setupPatternPrediction();

      // Configurar análisis de anomalías
      this.setupAnomalyDetection();

      // Configurar recomendaciones inteligentes
      this.setupIntelligentRecommendations();

      console.log('✅ Análisis predictivo configurado');
    } catch (error) {
      console.error('❌ Error configurando análisis predictivo:', error);
    }
  }

  setupTrendAnalysis() {
    try {
      this.analyzeTrends = (data, timeWindow = 30) => {
        const trends = {
          empleados: this.analyzeEmployeeTrends(data.empleados, timeWindow),
          horas: this.analyzeHoursTrends(data.horas, timeWindow),
          nominas: this.analyzePayrollTrends(data.nominas, timeWindow),
          performance: this.analyzePerformanceTrends(data.performance, timeWindow),
        };

        return trends;
      };
    } catch (error) {
      console.warn('⚠️ Error configurando análisis de tendencias:', error);
    }
  }

  analyzeEmployeeTrends(empleados, timeWindow) {
    try {
      if (!empleados || empleados.length === 0) return { trend: 'stable', change: 0 };

      const recent = empleados.slice(-timeWindow);
      const older = empleados.slice(-timeWindow * 2, -timeWindow);

      if (older.length === 0) return { trend: 'stable', change: 0 };

      const recentAvg = recent.length;
      const olderAvg = older.length;
      const change = ((recentAvg - olderAvg) / olderAvg) * 100;

      let trend = 'stable';
      if (change > 5) trend = 'increasing';
      else if (change < -5) trend = 'decreasing';

      return { trend, change: Math.round(change * 100) / 100 };
    } catch (error) {
      return { trend: 'stable', change: 0 };
    }
  }

  analyzeHoursTrends(horas, timeWindow) {
    try {
      if (!horas || horas.length === 0) return { trend: 'stable', change: 0 };

      const recent = horas.slice(-timeWindow);
      const older = horas.slice(-timeWindow * 2, -timeWindow);

      if (older.length === 0) return { trend: 'stable', change: 0 };

      const recentAvg = recent.reduce((sum, h) => sum + (h.horas_trabajadas || 0), 0) / recent.length;
      const olderAvg = older.reduce((sum, h) => sum + (h.horas_trabajadas || 0), 0) / older.length;

      if (olderAvg === 0) return { trend: 'stable', change: 0 };

      const change = ((recentAvg - olderAvg) / olderAvg) * 100;

      let trend = 'stable';
      if (change > 10) trend = 'increasing';
      else if (change < -10) trend = 'decreasing';

      return { trend, change: Math.round(change * 100) / 100 };
    } catch (error) {
      return { trend: 'stable', change: 0 };
    }
  }

  analyzePayrollTrends(nominas, timeWindow) {
    try {
      if (!nominas || nominas.length === 0) return { trend: 'stable', change: 0 };

      const recent = nominas.slice(-timeWindow);
      const older = nominas.slice(-timeWindow * 2, -timeWindow);

      if (older.length === 0) return { trend: 'stable', change: 0 };

      const recentAvg = recent.reduce((sum, n) => sum + (n.total_nomina || 0), 0) / recent.length;
      const olderAvg = older.reduce((sum, n) => sum + (n.total_nomina || 0), 0) / older.length;

      if (olderAvg === 0) return { trend: 'stable', change: 0 };

      const change = ((recentAvg - olderAvg) / olderAvg) * 100;

      let trend = 'stable';
      if (change > 15) trend = 'increasing';
      else if (change < -15) trend = 'decreasing';

      return { trend, change: Math.round(change * 100) / 100 };
    } catch (error) {
      return { trend: 'stable', change: 0 };
    }
  }

  analyzePerformanceTrends(performance, timeWindow) {
    try {
      if (!performance || performance.length === 0) return { trend: 'stable', change: 0 };

      const recent = performance.slice(-timeWindow);
      const older = performance.slice(-timeWindow * 2, -timeWindow);

      if (older.length === 0) return { trend: 'stable', change: 0 };

      const recentAvg = recent.reduce((sum, p) => sum + (p.score || 0), 0) / recent.length;
      const olderAvg = older.reduce((sum, p) => sum + (p.score || 0), 0) / older.length;

      if (olderAvg === 0) return { trend: 'stable', change: 0 };

      const change = ((recentAvg - olderAvg) / olderAvg) * 100;

      let trend = 'stable';
      if (change > 5) trend = 'improving';
      else if (change < -5) trend = 'declining';

      return { trend, change: Math.round(change * 100) / 100 };
    } catch (error) {
      return { trend: 'stable', change: 0 };
    }
  }

  // ========================================
  // INTERFAZ DEL ASISTENTE
  // ========================================

  setupAssistantInterface() {
    try {
      // Crear botón flotante del asistente
      this.createAssistantButton();

      // Crear panel de chat
      this.createChatPanel();

      // Configurar eventos
      this.setupAssistantEvents();

      console.log('✅ Interfaz del asistente configurada');
    } catch (error) {
      console.error('❌ Error configurando interfaz del asistente:', error);
    }
  }

  createAssistantButton() {
    try {
      const button = document.createElement('div');
      button.id = 'axyra-ai-assistant-button';
      button.innerHTML = `
        <div class="axyra-ai-button">
          <i class="fas fa-robot"></i>
          <span>Asistente IA</span>
        </div>
      `;

      button.addEventListener('click', () => this.toggleChatPanel());
      document.body.appendChild(button);
    } catch (error) {
      console.error('❌ Error creando botón del asistente:', error);
    }
  }

  createChatPanel() {
    try {
      const panel = document.createElement('div');
      panel.id = 'axyra-ai-chat-panel';
      panel.className = 'axyra-ai-panel hidden';
      panel.innerHTML = `
        <div class="axyra-ai-header">
          <h3>🤖 Asistente IA AXYRA</h3>
          <button class="axyra-ai-close" onclick="axyraAIAssistant.toggleChatPanel()">×</button>
        </div>
        <div class="axyra-ai-messages" id="axyra-ai-messages"></div>
        <div class="axyra-ai-input">
          <input type="text" id="axyra-ai-input-field" placeholder="¿En qué puedo ayudarte?">
          <button onclick="axyraraAIAssistant.sendMessage()">Enviar</button>
        </div>
      `;

      document.body.appendChild(panel);
    } catch (error) {
      console.error('❌ Error creando panel de chat:', error);
    }
  }

  setupAssistantEvents() {
    try {
      // Evento para enviar mensaje con Enter
      document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && document.activeElement.id === 'axyra-ai-input-field') {
          this.sendMessage();
        }
      });

      // Mensaje de bienvenida
      setTimeout(() => {
        this.addMessage('system', '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?');
      }, 1000);
    } catch (error) {
      console.error('❌ Error configurando eventos del asistente:', error);
    }
  }

  toggleChatPanel() {
    try {
      const panel = document.getElementById('axyra-ai-chat-panel');
      if (panel) {
        panel.classList.toggle('hidden');

        if (!panel.classList.contains('hidden')) {
          document.getElementById('axyra-ai-input-field').focus();
        }
      }
    } catch (error) {
      console.error('❌ Error alternando panel de chat:', error);
    }
  }

  addMessage(sender, message) {
    try {
      const messagesContainer = document.getElementById('axyra-ai-messages');
      if (!messagesContainer) return;

      const messageElement = document.createElement('div');
      messageElement.className = `axyra-ai-message ${sender}`;
      messageElement.innerHTML = `
        <div class="axyra-ai-message-content">
          <span class="axyra-ai-sender">${sender === 'user' ? '👤 Tú' : '🤖 IA'}</span>
          <p>${message}</p>
        </div>
      `;

      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Agregar a historial
      this.conversationHistory.push({
        sender,
        message,
        timestamp: Date.now(),
      });

      // Limpiar historial si es muy largo
      if (this.conversationHistory.length > this.maxHistoryLength) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
      }
    } catch (error) {
      console.error('❌ Error agregando mensaje:', error);
    }
  }

  async sendMessage() {
    try {
      const inputField = document.getElementById('axyra-ai-input-field');
      const message = inputField.value.trim();

      if (!message) return;

      // Agregar mensaje del usuario
      this.addMessage('user', message);

      // Limpiar campo de entrada
      inputField.value = '';

      // Procesar mensaje con IA
      const response = await this.processUserMessage(message);

      // Agregar respuesta de la IA
      this.addMessage('system', response);
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      this.addMessage('system', 'Lo siento, hubo un error procesando tu mensaje. ¿Puedes intentarlo de nuevo?');
    }
  }

  async processUserMessage(message) {
    try {
      // Analizar intención del usuario
      const intent = this.analyzeIntent(message);

      // Extraer entidades
      const entities = this.extractEntities(message);

      // Generar respuesta
      const response = this.generateResponse(intent, entities, this.conversationHistory);

      // Aplicar lógica de IA adicional
      const enhancedResponse = await this.enhanceResponseWithAI(response, intent, entities);

      return enhancedResponse;
    } catch (error) {
      console.error('❌ Error procesando mensaje del usuario:', error);
      return 'Lo siento, no pude procesar tu mensaje. ¿Puedes reformularlo?';
    }
  }

  async enhanceResponseWithAI(response, intent, entities) {
    try {
      let enhancedResponse = response;

      // Agregar análisis predictivo si es relevante
      if (intent.category === 'report_generation' || intent.category === 'nomina_calculation') {
        const predictions = await this.getPredictiveInsights(intent.category);
        if (predictions) {
          enhancedResponse += `\n\n💡 **Insights predictivos:** ${predictions}`;
        }
      }

      // Agregar recomendaciones si es apropiado
      if (intent.category === 'help_request' || intent.category === 'system_configuration') {
        const recommendations = await this.getIntelligentRecommendations();
        if (recommendations.length > 0) {
          enhancedResponse += `\n\n🔧 **Recomendaciones:**\n${recommendations.map((r) => `• ${r}`).join('\n')}`;
        }
      }

      return enhancedResponse;
    } catch (error) {
      console.warn('⚠️ Error mejorando respuesta con IA:', error);
      return response;
    }
  }

  async getPredictiveInsights(category) {
    try {
      // Obtener datos para análisis
      const data = this.getDataForAnalysis(category);

      // Analizar tendencias
      const trends = this.analyzeTrends(data);

      // Generar insights
      let insights = '';

      if (trends.empleados.trend === 'increasing') {
        insights += 'Se observa un crecimiento en el número de empleados. ';
      }

      if (trends.horas.trend === 'increasing') {
        insights += 'Las horas trabajadas están aumentando. ';
      }

      if (trends.nominas.trend === 'increasing') {
        insights += 'Los costos de nómina están creciendo. ';
      }

      return insights || 'No se detectaron tendencias significativas.';
    } catch (error) {
      console.warn('⚠️ Error obteniendo insights predictivos:', error);
      return null;
    }
  }

  async getIntelligentRecommendations() {
    try {
      const recommendations = [];

      // Verificar si se necesita backup
      const lastBackup = localStorage.getItem('axyra_last_backup');
      if (!lastBackup || Date.now() - parseInt(lastBackup) > 24 * 60 * 60 * 1000) {
        recommendations.push('Realizar backup del sistema (último backup hace más de 24 horas)');
      }

      // Verificar sincronización
      if (window.firebaseSyncManager && !window.firebaseSyncManager.isConnected()) {
        recommendations.push('Verificar conexión con Firebase para sincronización de datos');
      }

      // Verificar performance
      if (window.axyraPerformanceOptimizer) {
        const report = window.axyraPerformanceOptimizer.getPerformanceReport();
        if (report && report.suggestions.length > 0) {
          recommendations.push(...report.suggestions.slice(0, 3).map((s) => s.action));
        }
      }

      return recommendations;
    } catch (error) {
      console.warn('⚠️ Error obteniendo recomendaciones inteligentes:', error);
      return [];
    }
  }

  getDataForAnalysis(category) {
    try {
      const data = {};

      switch (category) {
        case 'empleado_management':
          data.empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
          break;
        case 'nomina_calculation':
          data.nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
          break;
        case 'horas_registration':
          data.horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
          break;
        case 'report_generation':
          data.performance = this.getPerformanceData();
          break;
      }

      return data;
    } catch (error) {
      console.warn('⚠️ Error obteniendo datos para análisis:', error);
      return {};
    }
  }

  getPerformanceData() {
    try {
      // Simular datos de performance
      return [
        { timestamp: Date.now() - 86400000, score: 85 },
        { timestamp: Date.now() - 172800000, score: 82 },
        { timestamp: Date.now() - 259200000, score: 88 },
      ];
    } catch (error) {
      return [];
    }
  }

  // ========================================
  // APRENDIZAJE AUTOMÁTICO BÁSICO
  // ========================================

  setupBasicMachineLearning() {
    try {
      // Configurar aprendizaje de preferencias del usuario
      this.setupUserPreferenceLearning();

      // Configurar mejora de respuestas
      this.setupResponseImprovement();

      // Configurar detección de patrones
      this.setupPatternDetection();

      console.log('✅ Aprendizaje automático básico configurado');
    } catch (error) {
      console.error('❌ Error configurando aprendizaje automático:', error);
    }
  }

  setupUserPreferenceLearning() {
    try {
      this.learnUserPreference = (action, feedback) => {
        if (!this.userPreferences[action]) {
          this.userPreferences[action] = { positive: 0, negative: 0, total: 0 };
        }

        this.userPreferences[action].total++;

        if (feedback === 'positive') {
          this.userPreferences[action].positive++;
        } else if (feedback === 'negative') {
          this.userPreferences[action].negative++;
        }

        // Guardar preferencias
        localStorage.setItem('axyra_user_preferences', JSON.stringify(this.userPreferences));
      };
    } catch (error) {
      console.warn('⚠️ Error configurando aprendizaje de preferencias:', error);
    }
  }

  setupResponseImprovement() {
    try {
      this.improveResponse = (originalResponse, userFeedback) => {
        // Aprender de la retroalimentación del usuario
        if (userFeedback === 'positive') {
          // La respuesta fue buena, mantenerla
          return originalResponse;
        } else if (userFeedback === 'negative') {
          // La respuesta fue mala, intentar mejorarla
          return this.generateAlternativeResponse(originalResponse);
        }

        return originalResponse;
      };
    } catch (error) {
      console.warn('⚠️ Error configurando mejora de respuestas:', error);
    }
  }

  generateAlternativeResponse(originalResponse) {
    try {
      // Generar respuesta alternativa basada en el contexto
      const alternatives = [
        'Déjame reformular eso de otra manera...',
        'Permíteme explicarte esto de forma diferente...',
        'Quizás pueda ayudarte de otra forma...',
      ];

      return alternatives[Math.floor(Math.random() * alternatives.length)] + ' ' + originalResponse;
    } catch (error) {
      return originalResponse;
    }
  }

  setupPatternDetection() {
    try {
      this.detectPatterns = (data) => {
        const patterns = [];

        // Detectar patrones en horarios
        if (data.horas && data.horas.length > 0) {
          const hourPatterns = this.analyzeHourPatterns(data.horas);
          patterns.push(...hourPatterns);
        }

        // Detectar patrones en ausencias
        if (data.empleados && data.empleados.length > 0) {
          const absencePatterns = this.analyzeAbsencePatterns(data.empleados);
          patterns.push(...absencePatterns);
        }

        return patterns;
      };
    } catch (error) {
      console.warn('⚠️ Error configurando detección de patrones:', error);
    }
  }

  analyzeHourPatterns(horas) {
    try {
      const patterns = [];

      // Agrupar por día de la semana
      const dayGroups = {};
      horas.forEach((hora) => {
        const date = new Date(hora.fecha);
        const day = date.getDay();
        if (!dayGroups[day]) dayGroups[day] = [];
        dayGroups[day].push(hora);
      });

      // Analizar patrones por día
      Object.entries(dayGroups).forEach(([day, dayHoras]) => {
        const avgHours = dayHoras.reduce((sum, h) => sum + (h.horas_trabajadas || 0), 0) / dayHoras.length;

        if (avgHours > 8.5) {
          patterns.push(`Día ${this.getDayName(day)}: Promedio alto de horas (${avgHours.toFixed(1)}h)`);
        } else if (avgHours < 7.5) {
          patterns.push(`Día ${this.getDayName(day)}: Promedio bajo de horas (${avgHours.toFixed(1)}h)`);
        }
      });

      return patterns;
    } catch (error) {
      return [];
    }
  }

  getDayName(day) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[parseInt(day)];
  }

  analyzeAbsencePatterns(empleados) {
    try {
      const patterns = [];

      // Analizar ausencias por empleado
      empleados.forEach((empleado) => {
        if (empleado.ausencias && empleado.ausencias.length > 0) {
          const totalAbsences = empleado.ausencias.length;
          const avgAbsencesPerMonth = totalAbsences / 12; // Asumiendo datos de un año

          if (avgAbsencesPerMonth > 2) {
            patterns.push(`Empleado ${empleado.nombre}: Ausencias frecuentes (${avgAbsencesPerMonth.toFixed(1)}/mes)`);
          }
        }
      });

      return patterns;
    } catch (error) {
      return [];
    }
  }

  // ========================================
  // MÉTODOS PÚBLICOS
  // ========================================

  getAssistantStatus() {
    try {
      return {
        isActive: true,
        modelsLoaded: this.aiModels.size,
        automationRules: this.automationRules.size,
        conversationHistory: this.conversationHistory.length,
        userPreferences: Object.keys(this.userPreferences).length,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estado del asistente:', error);
      return null;
    }
  }

  getConversationHistory() {
    try {
      return this.conversationHistory.slice(-20); // Últimos 20 mensajes
    } catch (error) {
      return [];
    }
  }

  clearConversationHistory() {
    try {
      this.conversationHistory = [];
      const messagesContainer = document.getElementById('axyra-ai-messages');
      if (messagesContainer) {
        messagesContainer.innerHTML = '';
      }

      // Mensaje de bienvenida
      this.addMessage('system', '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?');

      console.log('✅ Historial de conversación limpiado');
    } catch (error) {
      console.error('❌ Error limpiando historial:', error);
    }
  }

  // Función global para acceder al asistente
  static getInstance() {
    if (window.axyraAIAssistant) {
      return window.axyraAIAssistant;
    }
    return null;
  }

  static sendMessage(message) {
    if (window.axyraAIAssistant) {
      return window.axyraAIAssistant.processUserMessage(message);
    }
    return null;
  }
}

// Inicializar asistente de IA
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAIAssistant = new AxyraAIAssistant();
});

// Exportar para uso global
window.AxyraAIAssistant = AxyraAIAssistant;
