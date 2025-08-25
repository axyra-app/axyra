// Sistema de Gestión de Personal AXYRA - Versión Limpia
// Sin notificaciones molestas, con datos únicos por usuario

class GestionPersonalManager {
  constructor() {
    this.empleados = [];
    this.departamentos = [];
    this.horas = [];
    this.nominas = [];
    this.usuarioActual = this.obtenerUsuarioActual();
    this.init();
  }

  async init() {
    try {
      await this.cargarDatos();
      this.configurarEventos();
      this.actualizarEstadisticas();
      this.renderizarEmpleados();
      this.renderizarHoras();
      this.renderizarNominas();
    } catch (error) {
      console.error('Error en inicialización:', error);
    }
  }

  obtenerUsuarioActual() {
    // Obtener usuario del localStorage o crear uno temporal
    const usuario = localStorage.getItem('axyra_usuario_actual');
    if (usuario) {
      return JSON.parse(usuario);
    }
    
    // Crear usuario temporal único
    const usuarioTemp = {
      id: 'usuario_' + Date.now(),
      nombre: 'Usuario',
      email: 'usuario@axyra.com',
      timestamp: Date.now()
    };
    
    localStorage.setItem('axyra_usuario_actual', JSON.stringify(usuarioTemp));
    return usuarioTemp;
  }

  async cargarDatos() {
    try {
      // Cargar datos específicos del usuario actual
      const empleados = localStorage.getItem(`empleados_${this.usuarioActual.id}`);
      const departamentos = localStorage.getItem(`departamentos_${this.usuarioActual.id}`);
      const horas = localStorage.getItem(`horas_${this.usuarioActual.id}`);
      const nominas = localStorage.getItem(`nominas_${this.usuarioActual.id}`);

      this.empleados = empleados ? JSON.parse(empleados) : [];
      this.departamentos = departamentos ? JSON.parse(departamentos) : [];
      this.horas = horas ? JSON.parse(horas) : [];
      this.nominas = nominas ? JSON.parse(nominas) : [];

      // Llenar selectores
      this.llenarSelectorEmpleados();
      this.llenarSelectorDepartamentos();
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }

  guardarDatos() {
    try {
      localStorage.setItem(`empleados_${this.usuarioActual.id}`, JSON.stringify(this.empleados));
      localStorage.setItem(`departamentos_${this.usuarioActual.id}`, JSON.stringify(this.departamentos));
      localStorage.setItem(`horas_${this.usuarioActual.id}`, JSON.stringify(this.horas));
      localStorage.setItem(`nominas_${this.usuarioActual.id}`, JSON.stringify(this.nominas));
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  }

  configurarEventos() {
    // Configurar eventos de modales
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
      }
    });

    // Configurar formateo de campos numéricos
    this.configurarFormateoNumerico();
  }

  configurarFormateoNumerico() {
    const camposSalario = [
      'salarioFijoEmpleado',
      'bonificacionesEmpleado',
      'salarioReferenciaEmpleado'
    ];
    
    camposSalario.forEach(id => {
      const campo = document.getElementById(id);
      if (campo) {
        campo.addEventListener('input', (e) => this.formatearSalario(e.target));
        campo.addEventListener('blur', (e) => this.formatearSalario(e.target));
        campo.addEventListener('focus', (e) => {
          e.target.value = e.target.value.replace(/[^\d]/g, '');
        });
      }
    });
  }

  formatearSalario(input) {
    let valor = input.value.replace(/[^\d]/g, '');
    if (valor.length > 0) {
      valor = parseInt(valor).toLocaleString('es-CO');
    }
    input.value = valor;
  }

  limpiarFormatoSalario(input) {
    return input.value.replace(/[^\d]/g, '');
  }

  llenarSelectorEmpleados() {
    const selectores = ['empleadoHoras', 'empleadoReporte', 'reporteEmpleadoSelect'];
    selectores.forEach(id => {
      const selector = document.getElementById(id);
      if (selector) {
        selector.innerHTML = '<option value="">Seleccione empleado</option>';
        this.empleados.forEach(emp => {
          const option = document.createElement('option');
          option.value = emp.id;
          option.textContent = emp.nombre;
          selector.appendChild(option);
        });
      }
    });
  }

  llenarSelectorDepartamentos() {
    const selectores = ['departamentoEmpleado', 'departamentoReporte', 'reporteDepartamentoSelect'];
    selectores.forEach(id => {
      const selector = document.getElementById(id);
      if (selector) {
        selector.innerHTML = '<option value="">Seleccione departamento</option>';
        this.departamentos.forEach(dep => {
          const option = document.createElement('option');
          option.value = dep.nombre;
          option.textContent = dep.nombre;
          selector.appendChild(option);
        });
      }
    });
  }

  cambiarTab(tabName) {
    // Ocultar todas las pestañas
    const tabContents = document.querySelectorAll('.tab-content');
    const tabs = document.querySelectorAll('.gestion-personal-tab');
    
    tabContents.forEach(content => content.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Mostrar pestaña seleccionada
    const selectedTab = document.getElementById(`tab-${tabName}`);
    const selectedTabButton = document.querySelector(`[onclick="cambiarTab('${tabName}')"]`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedTabButton) selectedTabButton.classList.add('active');
    
    // Actualizar datos de la pestaña
    this.actualizarDatosPestana(tabName);
  }

  actualizarDatosPestana(tabName) {
    switch (tabName) {
      case 'empleados':
        this.renderizarEmpleados();
        break;
      case 'horas':
        this.renderizarHoras();
        break;
      case 'nomina':
        this.renderizarNominas();
        break;
      case 'reportes':
        this.renderizarReportes();
        break;
    }
  }

  renderizarEmpleados() {
    const container = document.getElementById('listaEmpleados');
    if (!container) return;

    if (this.empleados.length === 0) {
      container.innerHTML = `
        <div class="no-data">
          <i class="fas fa-users"></i>
          <p>No hay empleados registrados. Agrega el primero para comenzar.</p>
        </div>
      `;
      return;
    }

    const html = `
      <table class="gestion-personal-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Cargo</th>
            <th>Departamento</th>
            <th>Salario Base</th>
            <th>Tipo Contrato</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${this.empleados.map(emp => `
            <tr>
              <td>${emp.nombre}</td>
              <td>${emp.cedula}</td>
              <td>${emp.cargo}</td>
              <td>${emp.departamento}</td>
              <td>${this.formatearMoneda(emp.salarioBase)}</td>
              <td>${emp.tipoContrato}</td>
              <td><span class="estado-${emp.estado}">${emp.estado}</span></td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="editarEmpleado('${emp.id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarEmpleado('${emp.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = html;
  }

  renderizarHoras() {
    const container = document.getElementById('listaHoras');
    if (!container) return;

    if (this.horas.length === 0) {
      container.innerHTML = `
        <div class="no-data">
          <i class="fas fa-clock"></i>
          <p>No hay horas registradas. Registra las primeras horas para comenzar.</p>
        </div>
      `;
      return;
    }

    const html = `
      <table class="gestion-personal-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Empleado</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Total Horas</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${this.horas.map(hora => `
            <tr>
              <td>${new Date(hora.fecha).toLocaleDateString('es-CO')}</td>
              <td>${this.obtenerNombreEmpleado(hora.empleadoId)}</td>
              <td>${hora.horaEntrada}</td>
              <td>${hora.horaSalida}</td>
              <td>${this.calcularTotalHoras(hora.horaEntrada, hora.horaSalida)}</td>
              <td>${hora.observaciones || '-'}</td>
              <td>
                <button class="btn btn-sm btn-danger" onclick="eliminarHora('${hora.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = html;
  }

  renderizarNominas() {
    const container = document.getElementById('listaNominas');
    if (!container) return;

    if (this.nominas.length === 0) {
      container.innerHTML = `
        <div class="no-data">
          <i class="fas fa-file-invoice-dollar"></i>
          <p>No hay nóminas generadas. Genera la primera nómina para comenzar.</p>
        </div>
      `;
      return;
    }

    const html = `
      <table class="gestion-personal-table">
        <thead>
          <tr>
            <th>Período</th>
            <th>Empleado</th>
            <th>Total Horas</th>
            <th>Salario Base</th>
            <th>Total a Pagar</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${this.nominas.map(nomina => `
            <tr>
              <td>${nomina.periodo}</td>
              <td>${this.obtenerNombreEmpleado(nomina.empleadoId)}</td>
              <td>${nomina.totalHoras}</td>
              <td>${this.formatearMoneda(nomina.salarioBase)}</td>
              <td>${this.formatearMoneda(nomina.totalPagar)}</td>
              <td><span class="estado-${nomina.estado}">${nomina.estado}</span></td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="verNomina('${nomina.id}')">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="descargarNomina('${nomina.id}')">
                  <i class="fas fa-download"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = html;
  }

  renderizarReportes() {
    const container = document.getElementById('reportesContenido');
    if (!container) return;

    container.innerHTML = `
      <div class="reportes-grid">
        <div class="reporte-card">
          <h3><i class="fas fa-chart-line"></i> Resumen General</h3>
          <div class="reporte-stats">
            <div class="stat-item">
              <span class="stat-label">Total Empleados:</span>
              <span class="stat-value">${this.empleados.length}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Horas Mes:</span>
              <span class="stat-value">${this.calcularTotalHorasMes()}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Promedio Salario:</span>
              <span class="stat-value">${this.calcularPromedioSalario()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderizarListaDepartamentos() {
    const container = document.getElementById('listaDepartamentos');
    const mensajeNoData = document.getElementById('mensajeNoDepartamentos');
    
    if (!container) return;

    if (this.departamentos.length === 0) {
      if (mensajeNoData) mensajeNoData.style.display = 'block';
      container.innerHTML = '';
      return;
    }

    if (mensajeNoData) mensajeNoData.style.display = 'none';

    const html = this.departamentos.map(departamento => `
      <div class="departamento-item">
        <div class="departamento-header">
          <div class="departamento-color" style="background-color: ${departamento.color}"></div>
          <div class="departamento-nombre">${departamento.nombre}</div>
        </div>
        <div class="departamento-descripcion">${departamento.descripcion || 'Sin descripción'}</div>
        <div class="departamento-actions">
          <button class="btn btn-small btn-danger" onclick="eliminarDepartamento('${departamento.id}')">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  async agregarEmpleado(empleado) {
    try {
      // Validar cédula única
      const cedulaExistente = this.empleados.find(emp => emp.cedula === empleado.cedula);
      if (cedulaExistente) {
        throw new Error('Ya existe un empleado con esta cédula');
      }

      this.empleados.push(empleado);
      this.guardarDatos();
      this.llenarSelectorEmpleados();
      this.actualizarEstadisticas();
      
      return true;
    } catch (error) {
      console.error('Error agregando empleado:', error);
      throw error;
    }
  }

  async agregarDepartamento(departamento) {
    try {
      // Validar nombre único
      const nombreExistente = this.departamentos.find(dep => dep.nombre === departamento.nombre);
      if (nombreExistente) {
        throw new Error('Ya existe un departamento con este nombre');
      }

      this.departamentos.push(departamento);
      this.guardarDatos();
      this.llenarSelectorDepartamentos();
      this.actualizarEstadisticas();
      
      return true;
    } catch (error) {
      console.error('Error agregando departamento:', error);
      throw error;
    }
  }

  async eliminarDepartamento(departamentoId) {
    try {
      const departamento = this.departamentos.find(dep => dep.id === departamentoId);
      if (!departamento) {
        throw new Error('Departamento no encontrado');
      }

      const empleadosEnDepartamento = this.empleados.filter(emp => emp.departamento === departamento.nombre);

      if (empleadosEnDepartamento.length > 0) {
        throw new Error(
          `No se puede eliminar el departamento "${departamento.nombre}" porque tiene ${empleadosEnDepartamento.length} empleado(s) asignado(s)`
        );
      }

      this.departamentos = this.departamentos.filter(dep => dep.id !== departamentoId);
      this.guardarDatos();
      this.renderizarListaDepartamentos();
      this.actualizarEstadisticas();

      return true;
    } catch (error) {
      console.error('Error eliminando departamento:', error);
      throw error;
    }
  }

  async agregarHora(hora) {
    try {
      this.horas.push(hora);
      this.guardarDatos();
      this.actualizarEstadisticas();
      return true;
    } catch (error) {
      console.error('Error agregando hora:', error);
      throw error;
    }
  }

  async generarNomina(nomina) {
    try {
      this.nominas.push(nomina);
      this.guardarDatos();
      this.actualizarEstadisticas();
      return true;
    } catch (error) {
      console.error('Error generando nómina:', error);
      throw error;
    }
  }

  actualizarEstadisticas() {
    const totalEmpleados = this.empleados.length;
    const totalDepartamentos = this.departamentos.length;
    const horasMes = this.calcularTotalHorasMes();
    const totalPagos = this.calcularTotalPagos();
    const nominasGeneradas = this.nominas.length;
    const promedioHoras = this.calcularPromedioHoras();

    // Actualizar elementos del DOM
    const elementos = {
      totalEmpleados: totalEmpleados.toString(),
      totalDepartamentos: totalDepartamentos.toString(),
      horasMes: horasMes.toFixed(1),
      totalPagos: this.formatearMoneda(totalPagos),
      nominasGeneradas: nominasGeneradas.toString(),
      promedioHoras: promedioHoras.toFixed(1)
    };

    Object.entries(elementos).forEach(([id, valor]) => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.textContent = valor;
    });
  }

  calcularTotalHorasMes() {
    const mesActual = new Date().getMonth();
    const anioActual = new Date().getFullYear();
    
    return this.horas
      .filter(hora => {
        const fechaHora = new Date(hora.fecha);
        return fechaHora.getMonth() === mesActual && fechaHora.getFullYear() === anioActual;
      })
      .reduce((total, hora) => {
        return total + this.calcularTotalHoras(hora.horaEntrada, hora.horaSalida);
      }, 0);
  }

  calcularTotalPagos() {
    return this.empleados.reduce((total, emp) => {
      if (emp.tipoSalario === 'fijo') {
        return total + (emp.salarioFijo || 0) + (emp.bonificaciones || 0);
      } else if (emp.tipoSalario === 'por_horas') {
        return total + (emp.salarioReferencia || 0);
      }
      return total;
    }, 0);
  }

  calcularPromedioHoras() {
    if (this.empleados.length === 0) return 0;
    return this.calcularTotalHorasMes() / this.empleados.length;
  }

  calcularTotalHoras(horaEntrada, horaSalida) {
    const entrada = new Date(`2000-01-01 ${horaEntrada}`);
    const salida = new Date(`2000-01-01 ${horaSalida}`);
    
    if (salida < entrada) {
      salida.setDate(salida.getDate() + 1);
    }
    
    const diferencia = salida - entrada;
    return diferencia / (1000 * 60 * 60); // Convertir a horas
  }

  obtenerNombreEmpleado(empleadoId) {
    const empleado = this.empleados.find(emp => emp.id === empleadoId);
    return empleado ? empleado.nombre : 'Empleado no encontrado';
  }

  formatearMoneda(valor) {
    if (typeof valor !== 'number' || isNaN(valor)) {
      return '$0';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }
}

// ===== FUNCIONES GLOBALES =====

let gestionPersonal;

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  gestionPersonal = new GestionPersonalManager();
});

// Función para cambiar tipo de salario
function cambiarTipoSalario() {
  const tipoSalario = document.getElementById('tipoSalarioEmpleado').value;
  const camposFijo = document.getElementById('camposSalarioFijo');
  const camposHoras = document.getElementById('camposSalarioHoras');
  
  if (camposFijo) camposFijo.style.display = 'none';
  if (camposHoras) camposHoras.style.display = 'none';
  
  if (tipoSalario === 'fijo') {
    if (camposFijo) camposFijo.style.display = 'grid';
  } else if (tipoSalario === 'por_horas') {
    if (camposHoras) camposHoras.style.display = 'grid';
  }
}

// Función para cambiar pestañas
function cambiarTab(tabName) {
  if (gestionPersonal) {
    gestionPersonal.cambiarTab(tabName);
  }
}

// ===== FUNCIONES DE MODALES =====

// Modal de Empleado
function mostrarModalEmpleado() {
  const modal = document.getElementById('modalEmpleado');
  if (modal) {
    document.getElementById('formEmpleado').reset();
    modal.style.display = 'block';
  }
}

function cerrarModalEmpleado() {
  const modal = document.getElementById('modalEmpleado');
  if (modal) modal.style.display = 'none';
}

// Modal de Departamento
function mostrarModalDepartamento() {
  const modal = document.getElementById('modalDepartamento');
  if (modal) {
    gestionPersonal.renderizarListaDepartamentos();
    
    // Configurar color picker
    const colorInput = document.getElementById('colorDepartamento');
    const colorPreview = document.getElementById('colorPreview');
    
    if (colorInput && colorPreview) {
      colorPreview.style.backgroundColor = colorInput.value;
      
      colorInput.addEventListener('input', (e) => {
        colorPreview.style.backgroundColor = e.target.value;
      });
      
      colorPreview.addEventListener('click', () => {
        colorInput.click();
      });
    }
    
    modal.style.display = 'block';
  }
}

function cerrarModalDepartamento() {
  const modal = document.getElementById('modalDepartamento');
  if (modal) modal.style.display = 'none';
}

// Modal de Exportar Empleados
function mostrarModalExportarEmpleados() {
  const modal = document.getElementById('modalExportarEmpleados');
  if (modal) modal.style.display = 'block';
}

function cerrarModalExportarEmpleados() {
  const modal = document.getElementById('modalExportarEmpleados');
  if (modal) modal.style.display = 'none';
}

// Modal de Registro de Horas
function mostrarModalRegistroHoras() {
  const modal = document.getElementById('modalRegistroHoras');
  if (modal) {
    document.getElementById('formHoras').reset();
    modal.style.display = 'block';
  }
}

function cerrarModalRegistroHoras() {
  const modal = document.getElementById('modalRegistroHoras');
  if (modal) modal.style.display = 'none';
}

// Modal de Cálculo de Horas
function mostrarModalCalculoHoras() {
  const modal = document.getElementById('modalCalculoHoras');
  if (modal) {
    const resumenHoras = document.getElementById('resumenHoras');
    if (resumenHoras) {
      resumenHoras.innerHTML = `
        <div class="resumen-item">
          <span class="label">Total Empleados:</span>
          <span class="value">${gestionPersonal.empleados.length}</span>
        </div>
        <div class="resumen-item">
          <span class="label">Horas del Mes:</span>
          <span class="value">${gestionPersonal.calcularTotalHorasMes().toFixed(1)}</span>
        </div>
        <div class="resumen-item">
          <span class="label">Promedio por Empleado:</span>
          <span class="value">${gestionPersonal.calcularPromedioHoras().toFixed(1)}</span>
        </div>
      `;
    }
    modal.style.display = 'block';
  }
}

function cerrarModalCalculoHoras() {
  const modal = document.getElementById('modalCalculoHoras');
  if (modal) modal.style.display = 'none';
}

// Modal de Exportar Excel
function mostrarModalExportarExcel() {
  const modal = document.getElementById('modalExportarExcel');
  if (modal) modal.style.display = 'block';
}

function cerrarModalExportarExcel() {
  const modal = document.getElementById('modalExportarExcel');
  if (modal) modal.style.display = 'none';
}

// Modal de Reporte de Horas
function mostrarModalReporteHoras() {
  const modal = document.getElementById('modalReporteHoras');
  if (modal) modal.style.display = 'block';
}

function cerrarModalReporteHoras() {
  const modal = document.getElementById('modalReporteHoras');
  if (modal) modal.style.display = 'none';
}

// Modal de Generar Nómina
function mostrarModalGenerarNomina() {
  const modal = document.getElementById('modalGenerarNomina');
  if (modal) modal.style.display = 'block';
}

function cerrarModalGenerarNomina() {
  const modal = document.getElementById('modalGenerarNomina');
  if (modal) modal.style.display = 'none';
}

// Modal de Reporte General
function mostrarModalReporteGeneral() {
  const modal = document.getElementById('modalReporteGeneral');
  if (modal) modal.style.display = 'block';
}

function cerrarModalReporteGeneral() {
  const modal = document.getElementById('modalReporteGeneral');
  if (modal) modal.style.display = 'none';
}

// Modal de Reporte por Empleado
function mostrarModalReporteEmpleado() {
  const modal = document.getElementById('modalReporteEmpleado');
  if (modal) modal.style.display = 'block';
}

function cerrarModalReporteEmpleado() {
  const modal = document.getElementById('modalReporteEmpleado');
  if (modal) modal.style.display = 'none';
}

// Modal de Reporte por Departamento
function mostrarModalReporteDepartamento() {
  const modal = document.getElementById('modalReporteDepartamento');
  if (modal) modal.style.display = 'block';
}

function cerrarModalReporteDepartamento() {
  const modal = document.getElementById('modalReporteDepartamento');
  if (modal) modal.style.display = 'none';
}

// ===== FUNCIONES DE PROCESAMIENTO =====

// Guardar Empleado
async function guardarEmpleado() {
  try {
    const form = document.getElementById('formEmpleado');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const tipoSalario = document.getElementById('tipoSalarioEmpleado').value;
    
    // Validar campos específicos según el tipo de salario
    if (tipoSalario === 'fijo') {
      const salarioFijo = gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioFijoEmpleado'));
      if (!salarioFijo || parseFloat(salarioFijo) <= 0) {
        alert('Por favor ingrese un salario fijo válido');
        return;
      }
    } else if (tipoSalario === 'por_horas') {
      const salarioReferencia = gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioReferenciaEmpleado'));
      if (!salarioReferencia || parseFloat(salarioReferencia) <= 0) {
        alert('Por favor ingrese un salario de referencia válido');
        return;
      }
    }

    const empleado = {
      id: Date.now().toString(),
      nombre: document.getElementById('nombreEmpleado').value,
      cedula: document.getElementById('cedulaEmpleado').value,
      cargo: document.getElementById('cargoEmpleado').value,
      departamento: document.getElementById('departamentoEmpleado').value,
      tipoContrato: document.getElementById('tipoContratoEmpleado').value,
      fechaContratacion: document.getElementById('fechaContratacionEmpleado').value,
      estado: document.getElementById('estadoEmpleado').value,
      tipoSalario: tipoSalario,
    };

    // Agregar campos específicos según el tipo de salario
    if (tipoSalario === 'fijo') {
      empleado.salarioFijo = parseFloat(gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioFijoEmpleado')));
      empleado.bonificaciones = parseFloat(gestionPersonal.limpiarFormatoSalario(document.getElementById('bonificacionesEmpleado'))) || 0;
      empleado.salarioTotal = empleado.salarioFijo + empleado.bonificaciones;
      empleado.salarioBase = empleado.salarioTotal;
    } else if (tipoSalario === 'por_horas') {
      empleado.salarioReferencia = parseFloat(gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioReferenciaEmpleado')));
      empleado.salarioBase = empleado.salarioReferencia;
    }

    await gestionPersonal.agregarEmpleado(empleado);
    alert('Empleado agregado correctamente');
    cerrarModalEmpleado();
  } catch (error) {
    console.error('Error al guardar empleado:', error);
    alert('Error al guardar empleado: ' + error.message);
  }
}

// Guardar Departamento
async function guardarDepartamento() {
  try {
    const form = document.getElementById('formDepartamento');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const departamento = {
      id: Date.now().toString(),
      nombre: document.getElementById('nombreDepartamento').value,
      color: document.getElementById('colorDepartamento').value,
      descripcion: document.getElementById('descripcionDepartamento').value
    };

    await gestionPersonal.agregarDepartamento(departamento);
    alert('Departamento agregado correctamente');
    document.getElementById('formDepartamento').reset();
    gestionPersonal.renderizarListaDepartamentos();
  } catch (error) {
    console.error('Error al guardar departamento:', error);
    alert('Error al guardar departamento: ' + error.message);
  }
}

// Eliminar Departamento
async function eliminarDepartamento(departamentoId) {
  try {
    if (confirm('¿Está seguro de que desea eliminar este departamento? Esta acción no se puede deshacer.')) {
      await gestionPersonal.eliminarDepartamento(departamentoId);
      alert('Departamento eliminado correctamente');
    }
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    alert('Error al eliminar departamento: ' + error.message);
  }
}

// Guardar Horas
async function guardarHoras() {
  try {
    const form = document.getElementById('formHoras');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const hora = {
      id: Date.now().toString(),
      empleadoId: document.getElementById('empleadoHoras').value,
      fecha: document.getElementById('fechaHoras').value,
      horaEntrada: document.getElementById('horaEntrada').value,
      horaSalida: document.getElementById('horaSalida').value,
      observaciones: document.getElementById('observacionesHoras').value
    };

    await gestionPersonal.agregarHora(hora);
    alert('Horas registradas correctamente');
    cerrarModalRegistroHoras();
  } catch (error) {
    console.error('Error al guardar horas:', error);
    alert('Error al guardar horas: ' + error.message);
  }
}

// Procesar Exportación
function procesarExportacion() {
  const periodo = document.getElementById('periodoExport').value;
  alert(`Exportando datos para el período: ${periodo}`);
  cerrarModalExportarExcel();
}

// Generar Reporte de Horas
function generarReporteHoras() {
  const empleado = document.getElementById('empleadoReporte').value;
  const departamento = document.getElementById('departamentoReporte').value;
  const fechaInicio = document.getElementById('fechaInicioReporte').value;
  const fechaFin = document.getElementById('fechaFinReporte').value;
  
  alert(`Generando reporte de horas para: Empleado: ${empleado || 'Todos'}, Departamento: ${departamento || 'Todos'}, Período: ${fechaInicio} - ${fechaFin}`);
  cerrarModalReporteHoras();
}

// Procesar Generación de Nómina
function procesarGeneracionNomina() {
  const periodo = document.getElementById('periodoNomina').value;
  const fechaCorte = document.getElementById('fechaCorteNomina').value;
  
  alert(`Generando nómina para el período: ${periodo}, Fecha de corte: ${fechaCorte}`);
  cerrarModalGenerarNomina();
}

// Generar Reporte General
function generarReporteGeneral() {
  const periodo = document.getElementById('reporteGeneralPeriodo').value;
  const graficos = document.getElementById('reporteGraficos').checked;
  const comparativas = document.getElementById('reporteComparativas').checked;
  const proyecciones = document.getElementById('reporteProyecciones').checked;
  
  alert(`Generando reporte general para ${periodo} con: Gráficos: ${graficos}, Comparativas: ${comparativas}, Proyecciones: ${proyecciones}`);
  cerrarModalReporteGeneral();
}

// Generar Reporte por Empleado
function generarReporteEmpleado() {
  const empleadoId = document.getElementById('reporteEmpleadoSelect').value;
  const periodo = document.getElementById('reporteEmpleadoPeriodo').value;
  
  if (!empleadoId) {
    alert('Por favor seleccione un empleado');
    return;
  }
  
  const empleado = gestionPersonal.empleados.find(emp => emp.id === empleadoId);
  alert(`Generando reporte para ${empleado.nombre} (${periodo})`);
  cerrarModalReporteEmpleado();
}

// Generar Reporte por Departamento
function generarReporteDepartamento() {
  const departamento = document.getElementById('reporteDepartamentoSelect').value;
  const periodo = document.getElementById('reporteDepartamentoPeriodo').value;
  
  alert(`Generando reporte de departamento ${departamento || 'todos'} (${periodo})`);
  cerrarModalReporteDepartamento();
}

// Procesar Exportación de Empleados
function procesarExportacionEmpleados() {
  const formato = document.querySelector('input[name="formatoExport"]:checked').value;
  alert(`Exportando empleados en formato: ${formato}`);
  cerrarModalExportarEmpleados();
}

// Cargar Datos de Ejemplo
function cargarDatosEjemplo() {
  if (typeof cargarDatosEjemplo === 'function') {
    cargarDatosEjemplo();
    alert('Datos de ejemplo cargados correctamente');
    location.reload();
  } else {
    alert('Función de datos de ejemplo no disponible');
  }
}

// Sistema de Notificaciones Silencioso
function mostrarNotificacion(mensaje, tipo = 'info') {
  const container = document.getElementById('notificacionesContainer');
  const notificacion = document.getElementById('notificacion');
  const texto = document.getElementById('notificacionTexto');
  
  if (container && notificacion && texto) {
    texto.textContent = mensaje;
    notificacion.className = `notificacion notificacion-${tipo}`;
    container.style.display = 'block';
    
    setTimeout(() => {
      container.style.display = 'none';
    }, 3000);
  }
}

function cerrarNotificacion() {
  const container = document.getElementById('notificacionesContainer');
  if (container) container.style.display = 'none';
}
