// ========================================
// OPTIMIZADOR DE PERFORMANCE AXYRA
// ========================================

class AxyraPerformanceOptimizer {
  constructor() {
    this.lazyModules = new Map();
    this.cache = new Map();
    this.performanceMetrics = {};
    this.optimizationRules = new Map();
    this.init();
  }

  async init() {
    console.log('⚡ Inicializando Optimizador de Performance...');

    try {
      // Configurar métricas de performance
      this.setupPerformanceMonitoring();

      // Configurar lazy loading
      this.setupLazyLoading();

      // Configurar cache inteligente
      this.setupIntelligentCache();

      // Configurar optimización de recursos
      this.setupResourceOptimization();

      // Configurar reglas de optimización
      this.setupOptimizationRules();

      console.log('✅ Optimizador de Performance inicializado');
    } catch (error) {
      console.error('❌ Error inicializando optimizador de performance:', error);
    }
  }

  // ========================================
  // MONITOREO DE PERFORMANCE
  // ========================================

  setupPerformanceMonitoring() {
    try {
      // Monitorear métricas de performance web
      this.observePerformanceMetrics();

      // Monitorear tiempo de carga de módulos
      this.observeModuleLoadTimes();

      // Monitorear uso de memoria
      this.observeMemoryUsage();

      // Monitorear rendimiento de la interfaz
      this.observeUIPerformance();

      console.log('✅ Monitoreo de performance configurado');
    } catch (error) {
      console.error('❌ Error configurando monitoreo de performance:', error);
    }
  }

  observePerformanceMetrics() {
    try {
      // Observar métricas de navegación
      if ('PerformanceObserver' in window) {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordPerformanceMetric('navigation', entry);
          }
        });

        navigationObserver.observe({ entryTypes: ['navigation'] });

        // Observar métricas de recursos
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordPerformanceMetric('resource', entry);
          }
        });

        resourceObserver.observe({ entryTypes: ['resource'] });

        // Observar métricas de paint
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordPerformanceMetric('paint', entry);
          }
        });

        paintObserver.observe({ entryTypes: ['paint'] });
      }
    } catch (error) {
      console.warn('⚠️ PerformanceObserver no disponible:', error);
    }
  }

  recordPerformanceMetric(type, entry) {
    try {
      if (!this.performanceMetrics[type]) {
        this.performanceMetrics[type] = [];
      }

      const metric = {
        name: entry.name,
        duration: entry.duration,
        startTime: entry.startTime,
        timestamp: Date.now(),
      };

      this.performanceMetrics[type].push(metric);

      // Mantener solo las últimas 100 métricas por tipo
      if (this.performanceMetrics[type].length > 100) {
        this.performanceMetrics[type] = this.performanceMetrics[type].slice(-100);
      }

      // Analizar métricas para optimizaciones automáticas
      this.analyzePerformanceMetrics(type, metric);
    } catch (error) {
      console.warn('⚠️ Error registrando métrica de performance:', error);
    }
  }

  analyzePerformanceMetrics(type, metric) {
    try {
      // Detectar problemas de performance
      if (type === 'resource' && metric.duration > 3000) {
        console.warn('⚠️ Recurso lento detectado:', metric.name, `${metric.duration}ms`);
        this.suggestOptimization('slow_resource', metric);
      }

      if (type === 'paint' && metric.duration > 100) {
        console.warn('⚠️ Paint lento detectado:', metric.name, `${metric.duration}ms`);
        this.suggestOptimization('slow_paint', metric);
      }

      // Detectar patrones de degradación
      this.detectPerformanceDegradation(type, metric);
    } catch (error) {
      console.warn('⚠️ Error analizando métricas de performance:', error);
    }
  }

  detectPerformanceDegradation(type, metric) {
    try {
      const recentMetrics = this.performanceMetrics[type].slice(-10);
      if (recentMetrics.length < 10) return;

      const avgDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length;
      const currentDuration = metric.duration;

      // Si el rendimiento actual es 50% peor que el promedio, alertar
      if (currentDuration > avgDuration * 1.5) {
        console.warn('🚨 Degradación de performance detectada:', {
          type,
          current: currentDuration,
          average: avgDuration,
          degradation: `${((currentDuration / avgDuration - 1) * 100).toFixed(1)}%`,
        });

        this.suggestOptimization('performance_degradation', {
          type,
          current: currentDuration,
          average: avgDuration,
        });
      }
    } catch (error) {
      console.warn('⚠️ Error detectando degradación de performance:', error);
    }
  }

  // ========================================
  // LAZY LOADING INTELIGENTE
  // ========================================

  setupLazyLoading() {
    try {
      // Configurar Intersection Observer para lazy loading
      this.setupIntersectionObserver();

      // Configurar lazy loading de módulos
      this.setupModuleLazyLoading();

      // Configurar lazy loading de imágenes
      this.setupImageLazyLoading();

      console.log('✅ Sistema de lazy loading configurado');
    } catch (error) {
      console.error('❌ Error configurando lazy loading:', error);
    }
  }

  setupIntersectionObserver() {
    try {
      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.loadLazyContent(entry.target);
              }
            });
          },
          {
            rootMargin: '50px',
            threshold: 0.1,
          }
        );

        // Observar elementos con atributo data-lazy
        document.querySelectorAll('[data-lazy]').forEach((element) => {
          this.intersectionObserver.observe(element);
        });
      }
    } catch (error) {
      console.warn('⚠️ IntersectionObserver no disponible:', error);
    }
  }

  setupModuleLazyLoading() {
    try {
      // Registrar módulos para lazy loading
      this.registerLazyModule('empleados', '/modulos/empleados/empleados.js');
      this.registerLazyModule('horas', '/modulos/horas/horas.js');
      this.registerLazyModule('nomina', '/modulos/nomina/nomina.js');
      this.registerLazyModule('inventario', '/modulos/inventario/inventario.js');
      this.registerLazyModule('cuadre_caja', '/modulos/cuadre_caja/cuadre_caja.js');

      console.log('✅ Módulos registrados para lazy loading');
    } catch (error) {
      console.error('❌ Error configurando lazy loading de módulos:', error);
    }
  }

  registerLazyModule(name, path) {
    this.lazyModules.set(name, {
      path,
      loaded: false,
      loading: false,
      promise: null,
    });
  }

  async loadLazyModule(moduleName) {
    try {
      const module = this.lazyModules.get(moduleName);
      if (!module) {
        throw new Error(`Módulo ${moduleName} no registrado`);
      }

      if (module.loaded) {
        return module.exports;
      }

      if (module.loading) {
        return module.promise;
      }

      console.log(`📦 Cargando módulo: ${moduleName}`);

      module.loading = true;
      module.promise = this.dynamicImport(module.path);

      const exports = await module.promise;
      module.loaded = true;
      module.exports = exports;
      module.loading = false;

      console.log(`✅ Módulo cargado: ${moduleName}`);
      return exports;
    } catch (error) {
      console.error(`❌ Error cargando módulo ${moduleName}:`, error);
      throw error;
    }
  }

  async dynamicImport(path) {
    try {
      // Simular import dinámico para desarrollo
      if (path.includes('empleados')) {
        return { default: window.EmpleadosManager || {} };
      } else if (path.includes('horas')) {
        return { default: window.HorasManager || {} };
      } else if (path.includes('nomina')) {
        return { default: window.NominaManager || {} };
      }

      // En producción, usar import() real
      // return await import(path);

      return { default: {} };
    } catch (error) {
      console.error('❌ Error en import dinámico:', error);
      throw error;
    }
  }

  // ========================================
  // CACHE INTELIGENTE
  // ========================================

  setupIntelligentCache() {
    try {
      // Configurar cache de datos
      this.setupDataCache();

      // Configurar cache de recursos
      this.setupResourceCache();

      // Configurar cache de consultas
      this.setupQueryCache();

      // Configurar limpieza automática de cache
      this.setupCacheCleanup();

      console.log('✅ Sistema de cache inteligente configurado');
    } catch (error) {
      console.error('❌ Error configurando cache inteligente:', error);
    }
  }

  setupDataCache() {
    try {
      // Cache de empleados
      this.setupCacheForData('empleados', 5 * 60 * 1000); // 5 minutos

      // Cache de horas
      this.setupCacheForData('horas', 2 * 60 * 1000); // 2 minutos

      // Cache de nóminas
      this.setupCacheForData('nominas', 10 * 60 * 1000); // 10 minutos

      // Cache de configuración
      this.setupCacheForData('configuracion', 60 * 60 * 1000); // 1 hora
    } catch (error) {
      console.error('❌ Error configurando cache de datos:', error);
    }
  }

  setupCacheForData(key, ttl) {
    try {
      const cacheKey = `axyra_cache_${key}`;
      const cacheData = localStorage.getItem(cacheKey);

      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        if (Date.now() - parsed.timestamp < ttl) {
          this.cache.set(key, parsed.data);
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.warn('⚠️ Error configurando cache para:', key, error);
    }
  }

  getCachedData(key) {
    try {
      return this.cache.get(key);
    } catch (error) {
      console.warn('⚠️ Error obteniendo datos del cache:', error);
      return null;
    }
  }

  setCachedData(key, data, ttl = 5 * 60 * 1000) {
    try {
      this.cache.set(key, data);

      // Guardar en localStorage con timestamp
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      localStorage.setItem(`axyra_cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('⚠️ Error guardando datos en cache:', error);
    }
  }

  // ========================================
  // OPTIMIZACIÓN DE RECURSOS
  // ========================================

  setupResourceOptimization() {
    try {
      // Optimizar carga de imágenes
      this.optimizeImageLoading();

      // Optimizar carga de CSS
      this.optimizeCSSLoading();

      // Optimizar carga de JavaScript
      this.optimizeJavaScriptLoading();

      // Optimizar fuentes
      this.optimizeFontLoading();

      console.log('✅ Optimización de recursos configurada');
    } catch (error) {
      console.error('❌ Error configurando optimización de recursos:', error);
    }
  }

  optimizeImageLoading() {
    try {
      // Convertir imágenes a WebP si es posible
      this.convertImagesToWebP();

      // Implementar lazy loading de imágenes
      this.implementImageLazyLoading();

      // Optimizar imágenes existentes
      this.optimizeExistingImages();
    } catch (error) {
      console.warn('⚠️ Error optimizando carga de imágenes:', error);
    }
  }

  convertImagesToWebP() {
    try {
      // Verificar soporte de WebP
      if (!this.supportsWebP()) return;

      // Convertir imágenes PNG/JPG a WebP
      const images = document.querySelectorAll('img[src$=".png"], img[src$=".jpg"], img[src$=".jpeg"]');
      images.forEach((img) => {
        const webpSrc = img.src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        img.src = webpSrc;
      });
    } catch (error) {
      console.warn('⚠️ Error convirtiendo imágenes a WebP:', error);
    }
  }

  supportsWebP() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (error) {
      return false;
    }
  }

  implementImageLazyLoading() {
    try {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach((img) => {
        if (this.intersectionObserver) {
          this.intersectionObserver.observe(img);
        }
      });
    } catch (error) {
      console.warn('⚠️ Error implementando lazy loading de imágenes:', error);
    }
  }

  loadLazyContent(element) {
    try {
      const lazyType = element.dataset.lazy;

      switch (lazyType) {
        case 'image':
          this.loadLazyImage(element);
          break;
        case 'module':
          this.loadLazyModule(element.dataset.module);
          break;
        case 'data':
          this.loadLazyData(element);
          break;
        default:
          console.log('⚠️ Tipo de lazy loading no reconocido:', lazyType);
      }

      // Remover del observer
      if (this.intersectionObserver) {
        this.intersectionObserver.unobserve(element);
      }
    } catch (error) {
      console.error('❌ Error cargando contenido lazy:', error);
    }
  }

  loadLazyImage(imgElement) {
    try {
      const src = imgElement.dataset.src;
      if (src) {
        imgElement.src = src;
        imgElement.removeAttribute('data-src');
        imgElement.classList.add('lazy-loaded');
      }
    } catch (error) {
      console.error('❌ Error cargando imagen lazy:', error);
    }
  }

  // ========================================
  // REGLAS DE OPTIMIZACIÓN
  // ========================================

  setupOptimizationRules() {
    try {
      // Regla para optimizar tablas grandes
      this.optimizationRules.set('large_table', {
        threshold: 100,
        action: 'implement_virtualization',
        priority: 'high',
      });

      // Regla para optimizar gráficos
      this.optimizationRules.set('chart_rendering', {
        threshold: 1000,
        action: 'implement_canvas_rendering',
        priority: 'medium',
      });

      // Regla para optimizar búsquedas
      this.optimizationRules.set('search_performance', {
        threshold: 500,
        action: 'implement_search_index',
        priority: 'high',
      });

      console.log('✅ Reglas de optimización configuradas');
    } catch (error) {
      console.error('❌ Error configurando reglas de optimización:', error);
    }
  }

  suggestOptimization(type, data) {
    try {
      const rule = this.optimizationRules.get(type);
      if (!rule) return;

      console.log(`💡 Sugerencia de optimización: ${rule.action}`, {
        type,
        data,
        priority: rule.priority,
      });

      // Aplicar optimización automáticamente si es de alta prioridad
      if (rule.priority === 'high') {
        this.applyOptimization(rule.action, data);
      }
    } catch (error) {
      console.warn('⚠️ Error sugiriendo optimización:', error);
    }
  }

  applyOptimization(action, data) {
    try {
      console.log(`🔧 Aplicando optimización: ${action}`);

      switch (action) {
        case 'implement_virtualization':
          this.implementTableVirtualization(data);
          break;
        case 'implement_canvas_rendering':
          this.implementCanvasRendering(data);
          break;
        case 'implement_search_index':
          this.implementSearchIndex(data);
          break;
        default:
          console.log('⚠️ Acción de optimización no reconocida:', action);
      }
    } catch (error) {
      console.error('❌ Error aplicando optimización:', error);
    }
  }

  implementTableVirtualization(data) {
    try {
      // Implementar virtualización para tablas grandes
      const tables = document.querySelectorAll('table');
      tables.forEach((table) => {
        if (table.rows.length > 100) {
          this.addTableVirtualization(table);
        }
      });
    } catch (error) {
      console.error('❌ Error implementando virtualización de tabla:', error);
    }
  }

  addTableVirtualization(table) {
    try {
      // Agregar clase para virtualización
      table.classList.add('axyra-virtualized-table');

      // Implementar scroll virtual
      const tbody = table.querySelector('tbody');
      if (tbody) {
        this.setupVirtualScroll(tbody);
      }
    } catch (error) {
      console.error('❌ Error agregando virtualización a tabla:', error);
    }
  }

  setupVirtualScroll(tbody) {
    try {
      const rowHeight = 40; // Altura estimada de fila
      const visibleRows = Math.ceil(tbody.clientHeight / rowHeight);

      // Mostrar solo filas visibles
      const rows = Array.from(tbody.children);
      rows.forEach((row, index) => {
        if (index < visibleRows) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    } catch (error) {
      console.error('❌ Error configurando scroll virtual:', error);
    }
  }

  // ========================================
  // MÉTODOS PÚBLICOS
  // ========================================

  getPerformanceReport() {
    try {
      const report = {
        timestamp: Date.now(),
        metrics: this.performanceMetrics,
        cacheStats: this.getCacheStats(),
        suggestions: this.getOptimizationSuggestions(),
      };

      return report;
    } catch (error) {
      console.error('❌ Error generando reporte de performance:', error);
      return null;
    }
  }

  getCacheStats() {
    try {
      const stats = {
        totalEntries: this.cache.size,
        memoryUsage: this.estimateMemoryUsage(),
        hitRate: this.calculateCacheHitRate(),
      };

      return stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de cache:', error);
      return {};
    }
  }

  estimateMemoryUsage() {
    try {
      let totalSize = 0;
      this.cache.forEach((value, key) => {
        totalSize += JSON.stringify(value).length;
      });

      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  calculateCacheHitRate() {
    try {
      // Implementar cálculo de tasa de aciertos del cache
      return 0.85; // Placeholder
    } catch (error) {
      return 0;
    }
  }

  getOptimizationSuggestions() {
    try {
      const suggestions = [];

      // Analizar métricas para generar sugerencias
      Object.entries(this.performanceMetrics).forEach(([type, metrics]) => {
        if (metrics.length > 0) {
          const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;

          if (avgDuration > 1000) {
            suggestions.push({
              type: 'performance',
              action: `Optimizar ${type}`,
              priority: 'high',
              estimatedImprovement: '30-50%',
            });
          }
        }
      });

      return suggestions;
    } catch (error) {
      console.error('❌ Error obteniendo sugerencias de optimización:', error);
      return [];
    }
  }

  // Función global para lazy loading
  static async loadModule(moduleName) {
    if (window.axyraPerformanceOptimizer) {
      return await window.axyraPerformanceOptimizer.loadLazyModule(moduleName);
    }
    return null;
  }
}

// Inicializar optimizador de performance
document.addEventListener('DOMContentLoaded', () => {
  window.axyraPerformanceOptimizer = new AxyraPerformanceOptimizer();
});

// Exportar para uso global
window.AxyraPerformanceOptimizer = AxyraPerformanceOptimizer;
