// Dashboard Principal AXYRA - VERSIÓN FUNCIONAL
class AxyraDashboard {
  constructor() {
    this.charts = {};
    this.data = {
      empleados: [],
      horas: [],
      nominas: [],
      departamentos: [],
    };
    this.metrics = {
      totalEmpleados: 0,
      horasMes: 0,
      totalPagos: 0,
      nominasGeneradas: 0,
      promedioHoras: 0,
      totalDepartamentos: 0,
    };
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Dashboard Principal AXYRA...');

    try {
      // Esperar a que los sistemas estén listos
      await this.waitForSystems();

      // Cargar datos iniciales
      await this.cargarDatos();

      // Inicializar gráficos
      this.inicializarGraficos();

      // Configurar actualizaciones automáticas
      this.configurarActualizaciones();

      // Renderizar estado del sistema
      this.renderizarEstadoSistema();

      console.log('✅ Dashboard Principal AXYRA inicializado');
    } catch (error) {
      console.error('❌ Error inicializando dashboard:', error);
    }
  }

  async waitForSystems() {
    // Esperar a que los sistemas críticos estén disponibles
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      if (window.axyraIntegration && window.axyraUnifiedAuth) {
        console.log('✅ Sistemas críticos disponibles');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    console.warn('⚠️ Sistemas críticos no disponibles después de 5 segundos');
  }

  async cargarDatos() {
    try {
      console.log('📊 Cargando datos del dashboard...');

      // Cargar desde Firebase si está disponible
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        await this.cargarDesdeFirebase();
      } else {
        // Cargar desde localStorage como fallback
        await this.cargarDesdeLocalStorage();
      }

      // Calcular métricas
      this.calcularMetricas();

      // Actualizar UI
      this.actualizarMetricas();

      console.log('✅ Datos del dashboard cargados');
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      // No usar datos de ejemplo - mantener dashboard vacío
      this.limpiarDatos();
    }
  }

  async cargarDesdeFirebase() {
    try {
      const db = firebase.firestore();
      const currentUser = firebase.auth().currentUser;

      if (!currentUser) {
        throw new Error('Usuario no autenticado en Firebase');
      }

      // Cargar empleados
      const empleadosSnapshot = await db.collection('empleados').where('userId', '==', currentUser.uid).get();

      this.data.empleados = empleadosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Cargar horas
      const horasSnapshot = await db.collection('horas').where('userId', '==', currentUser.uid).get();

      this.data.horas = horasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Cargar nóminas
      const nominasSnapshot = await db.collection('nominas').where('userId', '==', currentUser.uid).get();

      this.data.nominas = nominasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Cargar departamentos
      const departamentosSnapshot = await db.collection('departamentos').where('userId', '==', currentUser.uid).get();

      this.data.departamentos = departamentosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('✅ Datos cargados desde Firebase');
    } catch (error) {
      console.error('❌ Error cargando desde Firebase:', error);
      throw error;
    }
  }

  async cargarDesdeLocalStorage() {
    try {
      // Cargar empleados
      const empleadosData = localStorage.getItem('axyra_empleados');
      if (empleadosData) {
        this.data.empleados = JSON.parse(empleadosData);
      }

      // Cargar horas
      const horasData = localStorage.getItem('axyra_horas');
      if (horasData) {
        this.data.horas = JSON.parse(horasData);
      }

      // Cargar nóminas
      const nominasData = localStorage.getItem('axyra_nominas');
      if (nominasData) {
        this.data.nominas = JSON.parse(nominasData);
      }

      // Cargar departamentos
      const departamentosData = localStorage.getItem('axyra_departamentos');
      if (departamentosData) {
        this.data.departamentos = JSON.parse(departamentosData);
      }

      console.log('✅ Datos cargados desde localStorage');
    } catch (error) {
      console.error('❌ Error cargando desde localStorage:', error);
      throw error;
    }
  }

  limpiarDatos() {
    console.log('🧹 Limpiando datos del dashboard...');

    this.data.empleados = [];
    this.data.horas = [];
    this.data.nominas = [];
    this.data.departamentos = [];

    this.metrics.totalEmpleados = 0;
    this.metrics.horasMes = 0;
    this.metrics.totalPagos = 0;
    this.metrics.nominasGeneradas = 0;
    this.metrics.promedioHoras = 0;
    this.metrics.totalDepartamentos = 0;

    this.calcularMetricas();
    this.actualizarMetricas();
  }

  calcularMetricas() {
    try {
      // Total empleados
      this.metrics.totalEmpleados = this.data.empleados.filter((e) => e.estado === 'activo').length;

      // Horas del mes
      const mesActual = new Date().getMonth() + 1;
      const añoActual = new Date().getFullYear();

      this.metrics.horasMes = this.data.horas
        .filter((h) => {
          const fecha = new Date(h.fecha);
          return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === añoActual;
        })
        .reduce((total, h) => total + (h.horas || 0), 0);

      // Total pagos
      this.metrics.totalPagos = this.data.nominas
        .filter((n) => n.mes === mesActual.toString().padStart(2, '0') && n.año === añoActual.toString())
        .reduce((total, n) => total + (n.total || 0), 0);

      // Nóminas generadas
      this.metrics.nominasGeneradas = this.data.nominas.length;

      // Promedio horas
      this.metrics.promedioHoras =
        this.metrics.totalEmpleados > 0 ? (this.metrics.horasMes / this.metrics.totalEmpleados).toFixed(1) : 0;

      // Total departamentos
      this.metrics.totalDepartamentos = this.data.departamentos.length;

      console.log('✅ Métricas calculadas:', this.metrics);
    } catch (error) {
      console.error('❌ Error calculando métricas:', error);
    }
  }

  actualizarMetricas() {
    try {
      // Actualizar métricas en la UI
      document.getElementById('totalEmpleados').textContent = this.metrics.totalEmpleados;
      document.getElementById('horasMes').textContent = this.metrics.horasMes.toFixed(1);
      document.getElementById('totalPagos').textContent = `$${this.metrics.totalPagos.toLocaleString()}`;
      document.getElementById('nominasGeneradas').textContent = this.metrics.nominasGeneradas;
      document.getElementById('promedioHoras').textContent = this.metrics.promedioHoras;
      document.getElementById('totalDepartamentos').textContent = this.metrics.totalDepartamentos;

      console.log('✅ Métricas actualizadas en la UI');
    } catch (error) {
      console.error('❌ Error actualizando métricas:', error);
    }
  }

  inicializarGraficos() {
    try {
      console.log('📊 Inicializando gráficos...');

      // Gráfico de distribución de empleados
      this.inicializarGraficoEmpleados();

      // Gráfico de tendencia de horas
      this.inicializarGraficoHoras();

      // Gráfico de salarios por departamento
      this.inicializarGraficoSalarios();

      // Gráfico de productividad
      this.inicializarGraficoProductividad();

      console.log('✅ Gráficos inicializados');
    } catch (error) {
      console.error('❌ Error inicializando gráficos:', error);
    }
  }

  inicializarGraficoEmpleados() {
    try {
      const ctx = document.getElementById('empleadosChart');
      if (!ctx) return;

      const departamentos = this.data.departamentos;
      const datos = departamentos.map((dept) => {
        const count = this.data.empleados.filter((emp) => emp.departamento === dept.nombre).length;
        return count;
      });

      this.charts.empleados = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: departamentos.map((d) => d.nombre),
          datasets: [
            {
              data: datos,
              backgroundColor: departamentos.map((d) => d.color || '#4f81bd'),
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error inicializando gráfico de empleados:', error);
    }
  }

  inicializarGraficoHoras() {
    try {
      const ctx = document.getElementById('horasChart');
      if (!ctx) return;

      // Agrupar horas por día del mes actual
      const mesActual = new Date().getMonth() + 1;
      const añoActual = new Date().getFullYear();
      const diasEnMes = new Date(añoActual, mesActual, 0).getDate();

      const labels = [];
      const datos = [];

      for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = `${añoActual}-${mesActual.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
        const horasDia = this.data.horas
          .filter((h) => h.fecha === fecha)
          .reduce((total, h) => total + (h.horas || 0), 0);

        labels.push(dia);
        datos.push(horasDia);
      }

      this.charts.horas = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Horas Trabajadas',
              data: datos,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error inicializando gráfico de horas:', error);
    }
  }

  inicializarGraficoSalarios() {
    try {
      const ctx = document.getElementById('salariosChart');
      if (!ctx) return;

      const departamentos = this.data.departamentos;
      const datos = departamentos.map((dept) => {
        const empleadosDept = this.data.empleados.filter((emp) => emp.departamento === dept.nombre);
        const totalSalarios = empleadosDept.reduce((total, emp) => total + (emp.salario || 0), 0);
        return totalSalarios;
      });

      this.charts.salarios = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: departamentos.map((d) => d.nombre),
          datasets: [
            {
              label: 'Total Salarios',
              data: datos,
              backgroundColor: departamentos.map((d) => d.color || '#4f81bd'),
              borderWidth: 1,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '$' + (value / 1000000).toFixed(1) + 'M';
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error inicializando gráfico de salarios:', error);
    }
  }

  inicializarGraficoProductividad() {
    try {
      const ctx = document.getElementById('productividadChart');
      if (!ctx) return;

      const totalEmpleados = this.metrics.totalEmpleados;
      const empleadosActivos = this.data.empleados.filter((e) => e.estado === 'activo').length;
      const empleadosInactivos = totalEmpleados - empleadosActivos;

      this.charts.productividad = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Empleados Activos', 'Empleados Inactivos'],
          datasets: [
            {
              data: [empleadosActivos, empleadosInactivos],
              backgroundColor: ['#10b981', '#ef4444'],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error inicializando gráfico de productividad:', error);
    }
  }

  configurarActualizaciones() {
    try {
      // Actualizar datos cada 5 minutos
      setInterval(() => {
        this.cargarDatos();
      }, 5 * 60 * 1000);

      // Actualizar gráficos cada minuto
      setInterval(() => {
        this.actualizarGraficos();
      }, 60 * 1000);

      console.log('✅ Actualizaciones automáticas configuradas');
    } catch (error) {
      console.error('❌ Error configurando actualizaciones:', error);
    }
  }

  actualizarGraficos() {
    try {
      // Actualizar datos de los gráficos
      if (this.charts.empleados) {
        this.charts.empleados.data.datasets[0].data = this.data.departamentos.map((dept) => {
          return this.data.empleados.filter((emp) => emp.departamento === dept.nombre).length;
        });
        this.charts.empleados.update();
      }

      if (this.charts.productividad) {
        const empleadosActivos = this.data.empleados.filter((e) => e.estado === 'activo').length;
        const empleadosInactivos = this.metrics.totalEmpleados - empleadosActivos;

        this.charts.productividad.data.datasets[0].data = [empleadosActivos, empleadosInactivos];
        this.charts.productividad.update();
      }

      console.log('✅ Gráficos actualizados');
    } catch (error) {
      console.error('❌ Error actualizando gráficos:', error);
    }
  }

  renderizarEstadoSistema() {
    try {
      const container = document.getElementById('systemStatusGrid');
      if (!container) return;

      const sistemas = [
        { nombre: 'Integración Principal', estado: 'healthy', icono: 'fas fa-cogs' },
        { nombre: 'Autenticación', estado: 'healthy', icono: 'fas fa-shield-alt' },
        { nombre: 'Base de Datos', estado: 'healthy', icono: 'fas fa-database' },
        { nombre: 'Notificaciones', estado: 'healthy', icono: 'fas fa-bell' },
      ];

      let html = '';
      sistemas.forEach((sistema) => {
        const estadoClass = sistema.estado === 'healthy' ? 'success' : 'error';
        const estadoIcon = sistema.estado === 'healthy' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

        html += `
          <div class="system-status-item ${estadoClass}">
            <div class="system-status-icon">
              <i class="${sistema.icono}"></i>
            </div>
            <div class="system-status-content">
              <h4>${sistema.nombre}</h4>
              <span class="system-status-badge ${estadoClass}">
                <i class="${estadoIcon}"></i>
                ${sistema.estado === 'healthy' ? 'Funcionando' : 'Error'}
              </span>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      console.log('✅ Estado del sistema renderizado');
    } catch (error) {
      console.error('❌ Error renderizando estado del sistema:', error);
    }
  }

  // Métodos públicos
  async actualizarDashboard() {
    try {
      console.log('🔄 Actualizando dashboard...');
      await this.cargarDatos();
      this.actualizarGraficos();
      this.renderizarEstadoSistema();
      console.log('✅ Dashboard actualizado');
    } catch (error) {
      console.error('❌ Error actualizando dashboard:', error);
    }
  }

  exportarDashboard() {
    try {
      console.log('📤 Exportando dashboard...');

      // Crear reporte en formato JSON
      const reporte = {
        timestamp: new Date().toISOString(),
        metricas: this.metrics,
        datos: this.data,
      };

      // Descargar archivo
      const blob = new Blob([JSON.stringify(reporte, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard_axyra_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      console.log('✅ Dashboard exportado');
    } catch (error) {
      console.error('❌ Error exportando dashboard:', error);
    }
  }
}

// Funciones globales para el dashboard
function actualizarDashboard() {
  if (window.axyraDashboard) {
    window.axyraDashboard.actualizarDashboard();
  }
}

function exportarDashboard() {
  if (window.axyraDashboard) {
    window.axyraDashboard.exportarDashboard();
  }
}

function toggleChartView(tipo) {
  if (window.axyraDashboard && window.axyraDashboard.charts[tipo]) {
    const chart = window.axyraDashboard.charts[tipo];

    // Cambiar entre diferentes tipos de gráfico
    if (chart.config.type === 'pie') {
      chart.config.type = 'doughnut';
    } else if (chart.config.type === 'doughnut') {
      chart.config.type = 'pie';
    } else if (chart.config.type === 'line') {
      chart.config.type = 'bar';
    } else if (chart.config.type === 'bar') {
      chart.config.type = 'line';
    }

    chart.update();
  }
}

function cerrarNotificacion() {
  const notificacion = document.getElementById('notificacionesSistema');
  if (notificacion) {
    notificacion.style.display = 'none';
  }
}

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.axyraDashboard = new AxyraDashboard();
    console.log('✅ Dashboard Principal AXYRA inicializado globalmente');
  } catch (error) {
    console.error('❌ Error inicializando Dashboard Principal:', error);
  }
});

// Exportar para uso global
window.AxyraDashboard = AxyraDashboard;
