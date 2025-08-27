// Sistema Unificado de Autenticación AXYRA - VERSIÓN CORREGIDA
// Reemplaza todos los sistemas de auth duplicados

class AxyraUnifiedAuthSystem {
  constructor() {
    this.isInitialized = false;
    this.authMethods = [];
    this.currentUser = null;
    this.authState = 'checking'; // checking, authenticated, unauthenticated, error
    this.config = {
      autoRedirect: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutos
      debug: false,
    };
    this.init();
  }

  // Inicialización simple sin conflictos
  async init() {
    if (this.isInitialized) return;

    try {
      console.log('🔐 Inicializando Sistema Unificado de Auth AXYRA...');

      // Verificar métodos disponibles sin interferir
      this.checkAuthMethods();

      // Configurar listeners básicos
      this.setupBasicListeners();

      // Verificar estado de autenticación
      await this.checkAuthStatus();

      this.isInitialized = true;
      console.log('✅ Sistema Unificado de Auth AXYRA inicializado');
    } catch (error) {
      console.warn('⚠️ Error inicializando sistema unificado de auth:', error);
      this.authState = 'error';
    }
  }

  // Verificar métodos disponibles sin interferir
  checkAuthMethods() {
    this.authMethods = [];

    // Verificar Firebase
    if (typeof firebase !== 'undefined' && firebase.auth) {
      this.authMethods.push('firebase');
      console.log('✅ Firebase Auth disponible');
    }

    // Verificar localStorage
    if (localStorage.getItem('axyra_isolated_user') || localStorage.getItem('axyra_user')) {
      this.authMethods.push('localStorage');
      console.log('✅ LocalStorage Auth disponible');
    }

    // Verificar sistema aislado
    if (window.axyraAuthManager) {
      this.authMethods.push('isolated');
      console.log('✅ Sistema Aislado disponible');
    }

    console.log('🔍 Métodos de auth disponibles:', this.authMethods);
  }

  // Configurar listeners básicos
  setupBasicListeners() {
    // Solo configurar si no hay conflictos
    if (!window.axyraAuthManager) {
      window.addEventListener('storage', (e) => {
        if (e.key === 'axyra_isolated_user' || e.key === 'axyra_user') {
          this.handleStorageChange(e);
        }
      });
    }

    // Listener para cambios de conectividad
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  // Manejar cambios en storage
  handleStorageChange(event) {
    try {
      if (event.newValue) {
        const userData = JSON.parse(event.newValue);
        if (userData && (userData.isAuthenticated || userData.uid)) {
          this.currentUser = userData;
          this.authState = 'authenticated';
          this.updateUI();
        }
      } else {
        this.currentUser = null;
        this.authState = 'unauthenticated';
        this.updateUI();
      }
    } catch (error) {
      console.warn('⚠️ Error procesando cambio en storage:', error);
    }
  }

  // Manejar cambios de conectividad
  handleOnline() {
    console.log('🌐 Conexión restaurada, verificando auth...');
    this.checkAuthStatus();
  }

  handleOffline() {
    console.log('📡 Conexión perdida, usando auth local...');
    // Mantener usuario autenticado localmente
  }

  // Verificar estado de autenticación
  async checkAuthStatus() {
    try {
      console.log('🔍 Verificando estado de autenticación...');

      // Intentar Firebase primero si está disponible
      if (this.authMethods.includes('firebase')) {
        try {
          const user = firebase.auth().currentUser;
          if (user) {
            await this.handleFirebaseUser(user);
            return;
          }
        } catch (error) {
          console.warn('⚠️ Error verificando Firebase auth:', error);
        }
      }

      // Intentar localStorage
      if (this.authMethods.includes('localStorage')) {
        const userData = this.loadUserFromStorage();
        if (userData) {
          this.currentUser = userData;
          this.authState = 'authenticated';
          this.updateUI();
          return;
        }
      }

      // Usuario no autenticado
      this.authState = 'unauthenticated';
      this.currentUser = null;
      this.updateUI();

      console.log('ℹ️ Usuario no autenticado');
    } catch (error) {
      console.error('❌ Error verificando estado de autenticación:', error);
      this.authState = 'error';
    }
  }

  // Manejar usuario de Firebase
  async handleFirebaseUser(user) {
    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        username: user.email.split('@')[0],
        photoURL: user.photoURL || null,
        provider: 'firebase',
        hasPassword: true,
        emailVerified: user.emailVerified,
        id: user.uid,
        isAuthenticated: true,
      };

      // Guardar en localStorage
      this.saveUserToStorage(userData);

      this.currentUser = userData;
      this.authState = 'authenticated';
      this.updateUI();

      console.log('✅ Usuario autenticado con Firebase:', userData.email);
    } catch (error) {
      console.error('❌ Error procesando usuario de Firebase:', error);
      throw error;
    }
  }

  // Cargar usuario desde storage
  loadUserFromStorage() {
    try {
      // Intentar diferentes claves
      const keys = ['axyra_isolated_user', 'axyra_user', 'axyra_firebase_user'];

      for (const key of keys) {
        const userData = localStorage.getItem(key);
        if (userData) {
          const user = JSON.parse(userData);
          if (user && (user.uid || user.id)) {
            return user;
          }
        }
      }

      return null;
    } catch (error) {
      console.warn('⚠️ Error cargando usuario de storage:', error);
      return null;
    }
  }

  // Guardar usuario en storage
  saveUserToStorage(userData) {
    try {
      // Guardar en múltiples claves para compatibilidad
      localStorage.setItem('axyra_isolated_user', JSON.stringify(userData));
      localStorage.setItem('axyra_user', JSON.stringify(userData));
      localStorage.setItem('axyra_firebase_user', JSON.stringify(userData));

      console.log('✅ Usuario guardado en storage');
    } catch (error) {
      console.error('❌ Error guardando usuario en storage:', error);
    }
  }

  // Actualizar interfaz de usuario
  updateUI() {
    try {
      // Actualizar elementos del header
      const userEmailElements = document.querySelectorAll('[id="userEmail"], .axyra-user-email');
      userEmailElements.forEach((element) => {
        if (this.currentUser) {
          element.textContent = this.currentUser.email || this.currentUser.username || 'Usuario';
        } else {
          element.textContent = 'Usuario';
        }
      });

      // Actualizar badge de rol
      const roleBadgeElements = document.querySelectorAll('[id="roleBadge"], .axyra-role-badge');
      roleBadgeElements.forEach((element) => {
        if (this.currentUser) {
          const roleText = element.querySelector('.axyra-role-badge-text');
          if (roleText) {
            roleText.textContent = this.currentUser.role || 'Empleado';
          }
        }
      });

      // Mostrar/ocultar elementos según autenticación
      const authElements = document.querySelectorAll('[data-auth-required]');
      authElements.forEach((element) => {
        if (this.authState === 'authenticated') {
          element.style.display = '';
        } else {
          element.style.display = 'none';
        }
      });

      // Emitir evento de cambio de auth
      window.dispatchEvent(
        new CustomEvent('axyra-auth-change', {
          detail: {
            user: this.currentUser,
            state: this.authState,
          },
        })
      );

      console.log('✅ UI actualizada para estado de auth:', this.authState);
    } catch (error) {
      console.error('❌ Error actualizando UI:', error);
    }
  }

  // Métodos públicos
  isAuthenticated() {
    return this.authState === 'authenticated' && this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAuthState() {
    return this.authState;
  }

  async login(email, password) {
    try {
      if (this.authMethods.includes('firebase')) {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        await this.handleFirebaseUser(userCredential.user);
        return { success: true, user: this.currentUser };
      } else {
        // Login local (simulado)
        const userData = {
          uid: 'local_' + Date.now(),
          email: email,
          username: email.split('@')[0],
          isAuthenticated: true,
        };

        this.saveUserToStorage(userData);
        this.currentUser = userData;
        this.authState = 'authenticated';
        this.updateUI();

        return { success: true, user: this.currentUser };
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      if (this.authMethods.includes('firebase')) {
        await firebase.auth().signOut();
      }

      // Limpiar storage
      localStorage.removeItem('axyra_isolated_user');
      localStorage.removeItem('axyra_user');
      localStorage.removeItem('axyra_firebase_user');

      this.currentUser = null;
      this.authState = 'unauthenticated';
      this.updateUI();

      // Redirigir a login
      if (this.config.autoRedirect) {
        window.location.href = '/login.html';
      }

      console.log('✅ Usuario deslogueado');
      return { success: true };
    } catch (error) {
      console.error('❌ Error en logout:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar permisos
  hasPermission(permission) {
    try {
      if (!this.isAuthenticated()) return false;

      // Verificar permisos del usuario
      if (this.currentUser.permissions) {
        return this.currentUser.permissions.includes(permission);
      }

      // Permisos por defecto según rol
      const rolePermissions = {
        admin: ['*'],
        gerente: ['dashboard:read', 'empleados:read', 'empleados:write', 'nomina:read', 'nomina:write'],
        supervisor: ['dashboard:read', 'empleados:read', 'horas:read', 'horas:write'],
        empleado: ['dashboard:read', 'horas:read'],
      };

      const userRole = this.currentUser.role || 'empleado';
      const permissions = rolePermissions[userRole] || rolePermissions['empleado'];

      return permissions.includes('*') || permissions.includes(permission);
    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
      return false;
    }
  }

  // Forzar verificación de autenticación
  async forceAuthCheck() {
    return await this.checkAuthStatus();
  }

  // Configurar timeout de sesión
  setupSessionTimeout() {
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
    }

    this.sessionTimeoutTimer = setTimeout(() => {
      console.log('⏰ Timeout de sesión alcanzado');
      this.logout();
    }, this.config.sessionTimeout);
  }

  // Resetear timeout de sesión
  resetSessionTimeout() {
    this.setupSessionTimeout();
  }
}

// Inicializar sistema de auth unificado
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.axyraUnifiedAuth = new AxyraUnifiedAuthSystem();
    console.log('✅ Sistema de auth unificado inicializado');
  } catch (error) {
    console.error('❌ Error inicializando sistema de auth unificado:', error);
  }
});

// Exportar para uso global
window.AxyraUnifiedAuthSystem = AxyraUnifiedAuthSystem;

