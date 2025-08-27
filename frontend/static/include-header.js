// INCLUIR HEADER COMPARTIDO AXYRA - VERSIÓN MEJORADA Y SEGURA
// Este script incluye automáticamente el header compartido en cualquier página
// NO MODIFICA NINGÚN CÓDIGO EXISTENTE - SOLO AGREGA FUNCIONALIDAD

class AxyraHeaderIncluder {
  constructor() {
    this.isInitialized = false;
    this.headerInserted = false;
    this.scriptLoaded = false;
    this.init();
  }

  async init() {
    try {
      // Verificar que no se haya inicializado antes
      if (this.isInitialized) {
        console.log('⚠️ Header ya inicializado, saltando...');
        return;
      }

      this.isInitialized = true;
      console.log('🚀 Inicializando header compartido AXYRA...');

      // Esperar a que el DOM esté completamente cargado
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupHeader());
      } else {
        this.setupHeader();
      }
    } catch (error) {
      console.error('❌ Error en inicialización del header:', error);
    }
  }

  async setupHeader() {
    try {
      // Verificar si ya existe un header
      if (document.querySelector('.axyra-header')) {
        console.log('✅ Header ya existe en la página, saltando inserción...');
        return;
      }

      // Determinar la ruta correcta según la ubicación de la página
      const paths = this.determinePaths();

      // Cargar header y script
      await this.includeHeader(paths.headerPath);
      await this.includeScript(paths.scriptPath);

      console.log('✅ Header compartido AXYRA configurado correctamente');
    } catch (error) {
      console.error('❌ Error configurando header:', error);
      this.createFallbackHeader();
    }
  }

  determinePaths() {
    // Determinar la ruta actual y calcular las rutas relativas correctas
    const currentPath = window.location.pathname;
    let headerPath, scriptPath;

    if (currentPath.includes('/modulos/')) {
      // Estamos en un módulo (2 niveles de profundidad)
      headerPath = '../../static/shared-header.html';
      scriptPath = '../../static/shared-header.js';
    } else if (currentPath.includes('/admin/')) {
      // Estamos en admin (1 nivel de profundidad)
      headerPath = '../static/shared-header.html';
      scriptPath = '../static/shared-header.js';
    } else {
      // Estamos en la raíz
      headerPath = 'static/shared-header.html';
      scriptPath = 'static/shared-header.js';
    }

    console.log('📍 Rutas calculadas:', { headerPath, scriptPath, currentPath });
    return { headerPath, scriptPath };
  }

  async includeHeader(headerPath) {
    try {
      console.log('📥 Cargando header desde:', headerPath);
      const response = await fetch(headerPath);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const headerHTML = await response.text();
      console.log('✅ Header HTML cargado correctamente, longitud:', headerHTML.length);

      // Insertar el header solo si no existe
      if (!document.querySelector('.axyra-header')) {
        const body = document.body;
        if (body) {
          body.insertAdjacentHTML('afterbegin', headerHTML);
          this.headerInserted = true;
          console.log('✅ Header insertado en el body');
        } else {
          console.error('❌ Body no encontrado');
        }
      } else {
        console.log('ℹ️ Header ya existe, saltando inserción');
      }
    } catch (error) {
      console.error('❌ Error cargando header:', error);
      throw error;
    }
  }

  async includeScript(scriptPath) {
    try {
      console.log('📥 Cargando script desde:', scriptPath);

      // Verificar si el script ya está cargado
      const existingScript = document.querySelector(`script[src*="${scriptPath.split('/').pop()}"]`);
      if (existingScript) {
        console.log('ℹ️ Script ya cargado, saltando...');
        this.scriptLoaded = true;
        return;
      }

      const script = document.createElement('script');
      script.src = scriptPath;
      script.type = 'text/javascript';

      // Crear promesa para esperar la carga del script
      const scriptPromise = new Promise((resolve, reject) => {
        script.onload = () => {
          console.log('✅ Script del header cargado correctamente');
          this.scriptLoaded = true;
          resolve();
        };
        script.onerror = () => {
          console.error('❌ Error cargando script del header');
          reject(new Error('Error cargando script del header'));
        };
      });

      // Insertar script en el head
      const head = document.head || document.getElementsByTagName('head')[0];
      if (head) {
        head.appendChild(script);
        console.log('✅ Script del header insertado en el head');
      } else {
        throw new Error('Head no encontrado');
      }

      // Esperar a que se cargue
      await scriptPromise;
    } catch (error) {
      console.error('❌ Error cargando script del header:', error);
      throw error;
    }
  }

  createFallbackHeader() {
    try {
      console.log('🔄 Creando header de respaldo...');

      const fallbackHeader = `
        <header class="axyra-header axyra-header-fallback">
          <div class="axyra-header-content">
            <div class="axyra-logo-title">
              <div class="axyra-logo-fallback">
                <i class="fas fa-building" style="font-size: 32px; color: #4299e1;"></i>
              </div>
              <div class="axyra-title-section">
                <h1 class="axyra-title">AXYRA</h1>
                <span class="axyra-subtitle">Sistema de Gestión</span>
              </div>
            </div>
            <nav class="axyra-nav">
              <a href="../../index.html" class="axyra-nav-link">
                <i class="fas fa-home"></i>
                <span>Inicio</span>
              </a>
              <a href="../dashboard/dashboard.html" class="axyra-nav-link">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </nav>
            <div class="axyra-user-section">
              <span class="axyra-user-email">Usuario</span>
              <button class="axyra-logout-btn" onclick="window.location.href='../../login.html'">
                <i class="fas fa-sign-out-alt"></i>
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </header>
      `;

      const body = document.body;
      if (body) {
        body.insertAdjacentHTML('afterbegin', fallbackHeader);
        console.log('✅ Header de respaldo creado');
      }
    } catch (error) {
      console.error('❌ Error creando header de respaldo:', error);
    }
  }

  // Método público para verificar estado
  getStatus() {
    return {
      initialized: this.isInitialized,
      headerInserted: this.headerInserted,
      scriptLoaded: this.scriptLoaded,
    };
  }
}

// Inicializar automáticamente
const headerIncluder = new AxyraHeaderIncluder();

// Exportar para uso global
window.AxyraHeaderIncluder = AxyraHeaderIncluder;
window.axyraHeaderIncluder = headerIncluder;
