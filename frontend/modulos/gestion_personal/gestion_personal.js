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
      timestamp: Date.now(),
    };

    localStorage.setItem('axyra_usuario_actual', JSON.stringify(usuarioTemp));
    return usuarioTemp;
  }

  async cargarDatos() {
    try {
      // Intentar cargar desde Firebase primero
      if (typeof firebase !== 'undefined' && firebase.firestore && this.usuarioActual) {
        try {
          console.log('🔥 Cargando datos desde Firebase...');

          // Cargar empleados
          const empleadosSnapshot = await firebase
            .firestore()
            .collection('empleados')
            .where('userId', '==', this.usuarioActual.uid || this.usuarioActual.id)
            .get();

          this.empleados = empleadosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Cargar departamentos
          const departamentosSnapshot = await firebase
            .firestore()
            .collection('departamentos')
            .where('userId', '==', this.usuarioActual.uid || this.usuarioActual.id)
            .get();

          this.departamentos = departamentosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Cargar horas
          const horasSnapshot = await firebase
            .firestore()
            .collection('horas')
            .where('userId', '==', this.usuarioActual.uid || this.usuarioActual.id)
            .get();

          this.horas = horasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Cargar nóminas
          const nominasSnapshot = await firebase
            .firestore()
            .collection('nominas')
            .where('userId', '==', this.usuarioActual.uid || this.usuarioActual.id)
            .get();

          this.nominas = nominasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log('✅ Datos cargados desde Firebase:', {
            empleados: this.empleados.length,
            departamentos: this.departamentos.length,
            horas: this.horas.length,
            nominas: this.nominas.length,
          });

          // Guardar en localStorage como respaldo
          this.guardarDatos();
          return;
        } catch (firebaseError) {
          console.warn('⚠️ Error cargando desde Firebase, usando localStorage:', firebaseError);
        }
      }

      // Fallback a localStorage
      console.log('💾 Cargando datos desde localStorage...');
      const empleadosGuardados = localStorage.getItem(`empleados_${this.usuarioActual.id}`);
      const departamentosGuardados = localStorage.getItem(`departamentos_${this.usuarioActual.id}`);
      const horasGuardadas = localStorage.getItem(`horas_${this.usuarioActual.id}`);
      const nominasGuardadas = localStorage.getItem(`nominas_${this.usuarioActual.id}`);

      if (empleadosGuardados) this.empleados = JSON.parse(empleadosGuardados);
      if (departamentosGuardados) this.departamentos = JSON.parse(departamentosGuardados);
      if (horasGuardadas) this.horas = JSON.parse(horasGuardadas);
      if (nominasGuardadas) this.nominas = JSON.parse(nominasGuardadas);

      console.log('✅ Datos cargados desde localStorage:', {
        empleados: this.empleados.length,
        departamentos: this.departamentos.length,
        horas: this.horas.length,
        nominas: this.nominas.length,
      });

      this.llenarSelectorEmpleados();
      this.llenarSelectorDepartamentos();
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    }
  }

  async guardarDatos() {
    try {
      // Guardar en localStorage como respaldo
      localStorage.setItem(`empleados_${this.usuarioActual.id}`, JSON.stringify(this.empleados));
      localStorage.setItem(`departamentos_${this.usuarioActual.id}`, JSON.stringify(this.departamentos));
      localStorage.setItem(`horas_${this.usuarioActual.id}`, JSON.stringify(this.horas));
      localStorage.setItem(`nominas_${this.usuarioActual.id}`, JSON.stringify(this.nominas));

      // Intentar guardar en Firebase si está disponible
      if (typeof firebase !== 'undefined' && firebase.firestore && this.usuarioActual) {
        try {
          console.log('🔥 Guardando datos en Firebase...');

          // Guardar empleados
          const empleadosRef = firebase.firestore().collection('empleados');
          for (const empleado of this.empleados) {
            await empleadosRef.doc(empleado.id).set({
              ...empleado,
              userId: this.usuarioActual.uid || this.usuarioActual.id,
              fechaActualizacion: new Date().toISOString(),
            });
          }

          // Guardar departamentos
          const departamentosRef = firebase.firestore().collection('departamentos');
          for (const departamento of this.departamentos) {
            await departamentosRef.doc(departamento.id).set({
              ...departamento,
              userId: this.usuarioActual.uid || this.usuarioActual.id,
              fechaActualizacion: new Date().toISOString(),
            });
          }

          // Guardar horas
          const horasRef = firebase.firestore().collection('horas');
          for (const hora of this.horas) {
            await horasRef.doc(hora.id).set({
              ...hora,
              userId: this.usuarioActual.uid || this.usuarioActual.id,
              fechaActualizacion: new Date().toISOString(),
            });
          }

          // Guardar nóminas
          const nominasRef = firebase.firestore().collection('nominas');
          for (const nomina of this.nominas) {
            await nominasRef.doc(nomina.id).set({
              ...nomina,
              userId: this.usuarioActual.uid || this.usuarioActual.id,
              fechaActualizacion: new Date().toISOString(),
            });
          }

          console.log('✅ Datos guardados en Firebase correctamente');
        } catch (firebaseError) {
          console.warn('⚠️ Error guardando en Firebase, usando solo localStorage:', firebaseError);
        }
      } else {
        console.log('ℹ️ Firebase no disponible, usando solo localStorage');
      }
    } catch (error) {
      console.error('❌ Error guardando datos:', error);
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
    const camposSalario = ['salarioFijoEmpleado', 'bonificacionesEmpleado', 'salarioReferenciaEmpleado'];

    camposSalario.forEach((id) => {
      const campo = document.getElementById(id);
      if (campo) {
        // Formatear al escribir
        campo.addEventListener('input', (e) => {
          let valor = e.target.value.replace(/[^\d]/g, '');
          if (valor.length > 0) {
            const numero = parseInt(valor);
            if (!isNaN(numero)) {
              e.target.value = numero.toLocaleString('es-CO');
            }
          }
        });

        // Limpiar formato al enfocar
        campo.addEventListener('focus', (e) => {
          e.target.value = e.target.value.replace(/[^\d]/g, '');
        });

        // Formatear al perder el foco
        campo.addEventListener('blur', (e) => {
          let valor = e.target.value.replace(/[^\d]/g, '');
          if (valor.length > 0) {
            const numero = parseInt(valor);
            if (!isNaN(numero)) {
              e.target.value = numero.toLocaleString('es-CO');
            }
          }
        });
      }
    });
  }

  formatearSalario(input) {
    let valor = input.value.replace(/[^\d]/g, '');

    if (valor.length > 0) {
      // Convertir a número y formatear con separadores de miles
      const numero = parseInt(valor);
      if (!isNaN(numero)) {
        valor = numero.toLocaleString('es-CO');
      }
    }

    input.value = valor;
  }

  limpiarFormatoSalario(input) {
    // Remover todos los caracteres no numéricos excepto el punto decimal
    let valor = input.value.replace(/[^\d.,]/g, '');

    // Si hay múltiples puntos o comas, mantener solo el último
    const partes = valor.split(/[.,]/);
    if (partes.length > 2) {
      // Si hay más de 2 partes, es porque hay múltiples separadores
      // Tomar solo la primera parte (antes del primer separador)
      valor = partes[0];
    }

    // Convertir a número y validar
    const numero = parseFloat(valor.replace(/[^\d]/g, ''));

    // Si no es un número válido, retornar 0
    if (isNaN(numero)) {
      return '0';
    }

    return numero.toString();
  }

  llenarSelectorEmpleados() {
    const selectores = ['empleadoHoras', 'empleadoReporte', 'reporteEmpleadoSelect'];
    selectores.forEach((id) => {
      const selector = document.getElementById(id);
      if (selector) {
        selector.innerHTML = '<option value="">Seleccione empleado</option>';
        this.empleados.forEach((emp) => {
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
    selectores.forEach((id) => {
      const selector = document.getElementById(id);
      if (selector) {
        selector.innerHTML = '<option value="">Seleccione departamento</option>';
        this.departamentos.forEach((dep) => {
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

    tabContents.forEach((content) => content.classList.remove('active'));
    tabs.forEach((tab) => tab.classList.remove('active'));

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
          ${this.empleados
            .map(
              (emp) => `
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
          `
            )
            .join('')}
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
          ${this.horas
            .map(
              (hora) => `
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
          `
            )
            .join('')}
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
          ${this.nominas
            .map(
              (nomina) => `
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
          `
            )
            .join('')}
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

    const html = this.departamentos
      .map(
        (departamento) => `
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
    `
      )
      .join('');

    container.innerHTML = html;
  }

  async agregarEmpleado(empleado) {
    try {
      // Validar cédula única
      const cedulaExistente = this.empleados.find((emp) => emp.cedula === empleado.cedula);
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
      const nombreExistente = this.departamentos.find((dep) => dep.nombre === departamento.nombre);
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
      const departamento = this.departamentos.find((dep) => dep.id === departamentoId);
      if (!departamento) {
        throw new Error('Departamento no encontrado');
      }

      const empleadosEnDepartamento = this.empleados.filter((emp) => emp.departamento === departamento.nombre);

      if (empleadosEnDepartamento.length > 0) {
        throw new Error(
          `No se puede eliminar el departamento "${departamento.nombre}" porque tiene ${empleadosEnDepartamento.length} empleado(s) asignado(s)`
        );
      }

      this.departamentos = this.departamentos.filter((dep) => dep.id !== departamentoId);
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
      promedioHoras: promedioHoras.toFixed(1),
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
      .filter((hora) => {
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
    const empleado = this.empleados.find((emp) => emp.id === empleadoId);
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
      maximumFractionDigits: 0,
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

  // Ocultar todos los campos primero
  if (camposFijo) camposFijo.style.display = 'none';
  if (camposHoras) camposHoras.style.display = 'none';

  // Remover required de todos los campos de salario
  const salarioFijo = document.getElementById('salarioFijoEmpleado');
  const bonificaciones = document.getElementById('bonificacionesEmpleado');
  const salarioReferencia = document.getElementById('salarioReferenciaEmpleado');

  if (salarioFijo) salarioFijo.removeAttribute('required');
  if (bonificaciones) bonificaciones.removeAttribute('required');
  if (salarioReferencia) salarioReferencia.removeAttribute('required');

  // Mostrar y configurar campos según el tipo seleccionado
  if (tipoSalario === 'fijo') {
    if (camposFijo) camposFijo.style.display = 'grid';
    if (salarioFijo) salarioFijo.setAttribute('required', 'required');
  } else if (tipoSalario === 'por_horas') {
    if (camposHoras) camposHoras.style.display = 'grid';
    if (salarioReferencia) salarioReferencia.setAttribute('required', 'required');
  }

  console.log('💰 Tipo de salario cambiado a:', tipoSalario);
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
    
    // Inicializar tipo de salario por defecto
    const tipoSalarioSelect = document.getElementById('tipoSalarioEmpleado');
    if (tipoSalarioSelect) {
      tipoSalarioSelect.value = 'fijo';
      cambiarTipoSalario(); // Aplicar la lógica de mostrar/ocultar campos
    }
    
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
    console.log('🔍 Iniciando guardado de empleado...');

    const form = document.getElementById('formEmpleado');
    if (!form.checkValidity()) {
      console.log('❌ Formulario no válido');
      form.reportValidity();
      return;
    }

    const tipoSalario = document.getElementById('tipoSalarioEmpleado').value;
    console.log('💰 Tipo de salario seleccionado:', tipoSalario);

    // Validar campos específicos según el tipo de salario
    if (tipoSalario === 'fijo') {
      const salarioFijo = gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioFijoEmpleado'));
      console.log('💵 Salario fijo limpio:', salarioFijo);
      if (!salarioFijo || parseFloat(salarioFijo) <= 0) {
        mostrarNotificacion('Por favor ingrese un salario fijo válido', 'warning', 'Atención');
        return;
      }
    } else if (tipoSalario === 'por_horas') {
      const salarioReferencia = gestionPersonal.limpiarFormatoSalario(
        document.getElementById('salarioReferenciaEmpleado')
      );
      console.log('⏰ Salario referencia limpio:', salarioReferencia);
      if (!salarioReferencia || parseFloat(salarioReferencia) <= 0) {
        mostrarNotificacion('Por favor ingrese un salario de referencia válido', 'warning', 'Atención');
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

    console.log('👤 Datos básicos del empleado:', empleado);

    // Agregar campos específicos según el tipo de salario
    if (tipoSalario === 'fijo') {
      empleado.salarioFijo = parseFloat(
        gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioFijoEmpleado'))
      );
      empleado.bonificaciones =
        parseFloat(gestionPersonal.limpiarFormatoSalario(document.getElementById('bonificacionesEmpleado'))) || 0;
      empleado.salarioTotal = empleado.salarioFijo + empleado.bonificaciones;
      empleado.salarioBase = empleado.salarioTotal;
      console.log('💵 Salario fijo configurado:', empleado.salarioFijo);
    } else if (tipoSalario === 'por_horas') {
      empleado.salarioReferencia = parseFloat(
        gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioReferenciaEmpleado'))
      );
      empleado.salarioBase = empleado.salarioReferencia;
      console.log('⏰ Salario referencia configurado:', empleado.salarioReferencia);
    }

    console.log('✅ Empleado a guardar:', empleado);

    await gestionPersonal.agregarEmpleado(empleado);
    mostrarNotificacion('Empleado agregado correctamente', 'success', 'Éxito');
    cerrarModalEmpleado();
  } catch (error) {
    console.error('❌ Error al guardar empleado:', error);
    mostrarNotificacion('Error al guardar empleado: ' + error.message, 'error', 'Error');
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
      descripcion: document.getElementById('descripcionDepartamento').value,
    };

    await gestionPersonal.agregarDepartamento(departamento);
    mostrarNotificacion('Departamento agregado correctamente', 'success', 'Éxito');
    document.getElementById('formDepartamento').reset();
    gestionPersonal.renderizarListaDepartamentos();
  } catch (error) {
    console.error('Error al guardar departamento:', error);
    mostrarNotificacion('Error al guardar departamento: ' + error.message, 'error', 'Error');
  }
}

// Eliminar Departamento
async function eliminarDepartamento(departamentoId) {
  try {
    if (confirm('¿Está seguro de que desea eliminar este departamento? Esta acción no se puede deshacer.')) {
      await gestionPersonal.eliminarDepartamento(departamentoId);
      mostrarNotificacion('Departamento eliminado correctamente', 'success', 'Éxito');
    }
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    mostrarNotificacion('Error al eliminar departamento: ' + error.message, 'error', 'Error');
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
      observaciones: document.getElementById('observacionesHoras').value,
    };

    await gestionPersonal.agregarHora(hora);
    mostrarNotificacion('Horas registradas correctamente', 'success', 'Éxito');
    cerrarModalRegistroHoras();
  } catch (error) {
    console.error('Error al guardar horas:', error);
    mostrarNotificacion('Error al guardar horas: ' + error.message, 'error', 'Error');
  }
}

// Procesar Exportación
function procesarExportacion() {
  const periodo = document.getElementById('periodoExport').value;
  mostrarNotificacion(`Exportando datos para el período: ${periodo}`, 'info', 'Exportación');
  cerrarModalExportarExcel();
}

// Generar Reporte de Horas
function generarReporteHoras() {
  const empleado = document.getElementById('empleadoReporte').value;
  const departamento = document.getElementById('departamentoReporte').value;
  const fechaInicio = document.getElementById('fechaInicioReporte').value;
  const fechaFin = document.getElementById('fechaFinReporte').value;

  mostrarNotificacion(
    `Generando reporte de horas para: Empleado: ${empleado || 'Todos'}, Departamento: ${
      departamento || 'Todos'
    }, Período: ${fechaInicio} - ${fechaFin}`,
    'info',
    'Generación de Reporte'
  );
  cerrarModalReporteHoras();
}

// Procesar Generación de Nómina
function procesarGeneracionNomina() {
  const periodo = document.getElementById('periodoNomina').value;
  const fechaCorte = document.getElementById('fechaCorteNomina').value;

  mostrarNotificacion(
    `Generando nómina para el período: ${periodo}, Fecha de corte: ${fechaCorte}`,
    'info',
    'Generación de Nómina'
  );
  cerrarModalGenerarNomina();
}

// Generar Reporte General
function generarReporteGeneral() {
  const periodo = document.getElementById('reporteGeneralPeriodo').value;
  const graficos = document.getElementById('reporteGraficos').checked;
  const comparativas = document.getElementById('reporteComparativas').checked;
  const proyecciones = document.getElementById('reporteProyecciones').checked;

  mostrarNotificacion(
    `Generando reporte general para ${periodo} con: Gráficos: ${graficos}, Comparativas: ${comparativas}, Proyecciones: ${proyecciones}`,
    'info',
    'Generación de Reporte General'
  );
  cerrarModalReporteGeneral();
}

// Generar Reporte por Empleado
function generarReporteEmpleado() {
  const empleadoId = document.getElementById('reporteEmpleadoSelect').value;
  const periodo = document.getElementById('reporteEmpleadoPeriodo').value;

  if (!empleadoId) {
    mostrarNotificacion('Por favor seleccione un empleado', 'warning', 'Atención');
    return;
  }

  const empleado = gestionPersonal.empleados.find((emp) => emp.id === empleadoId);
  mostrarNotificacion(`Generando reporte para ${empleado.nombre} (${periodo})`, 'info', 'Generación de Reporte');
  cerrarModalReporteEmpleado();
}

// Generar Reporte por Departamento
function generarReporteDepartamento() {
  const departamento = document.getElementById('reporteDepartamentoSelect').value;
  const periodo = document.getElementById('reporteDepartamentoPeriodo').value;

  mostrarNotificacion(
    `Generando reporte de departamento ${departamento || 'todos'} (${periodo})`,
    'info',
    'Generación de Reporte'
  );
  cerrarModalReporteDepartamento();
}

// Procesar Exportación de Empleados
function procesarExportacionEmpleados() {
  const formato = document.querySelector('input[name="formatoExport"]:checked').value;
  mostrarNotificacion(`Exportando empleados en formato: ${formato}`, 'info', 'Exportación de Empleados');
  cerrarModalExportarEmpleados();
}

// Cargar Datos de Ejemplo
function cargarDatosEjemplo() {
  if (typeof cargarDatosEjemplo === 'function') {
    cargarDatosEjemplo();
    mostrarNotificacion('Datos de ejemplo cargados correctamente', 'success', 'Éxito');
    location.reload();
  } else {
    mostrarNotificacion('Función de datos de ejemplo no disponible', 'warning', 'Atención');
  }
}

// Sistema de Notificaciones Profesionales
function mostrarNotificacion(mensaje, tipo = 'info', titulo = 'AXYRA') {
  const notificacion = document.getElementById('notificacion');
  const tituloElement = document.getElementById('notificacionTitulo');
  const mensajeElement = document.getElementById('notificacionMensaje');
  const iconoElement = document.getElementById('notificacionIcono');

  if (notificacion && tituloElement && mensajeElement && iconoElement) {
    // Configurar contenido
    tituloElement.textContent = titulo;
    mensajeElement.textContent = mensaje;

    // Configurar tipo y icono
    notificacion.className = `notificacion notificacion-${tipo}`;

    // Configurar icono según el tipo
    const iconos = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };

    iconoElement.className = `fas ${iconos[tipo] || iconos.info}`;

    // Mostrar notificación
    notificacion.classList.add('mostrar');

    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
      cerrarNotificacion();
    }, 5000);
  }
}

function cerrarNotificacion() {
  const notificacion = document.getElementById('notificacion');
  if (notificacion) {
    notificacion.classList.remove('mostrar');
  }
}

// ===== SISTEMA DE CALENDARIO COLOMBIANO Y CÁLCULO DE HORAS =====

// Días festivos de Colombia (2024-2025)
const DIAS_FESTIVOS_COLOMBIA = {
  '2024': [
    '2024-01-01', // Año Nuevo
    '2024-01-08', // Día de los Reyes Magos
    '2024-03-24', // Domingo de Ramos
    '2024-03-28', // Jueves Santo
    '2024-03-29', // Viernes Santo
    '2024-03-31', // Domingo de Resurrección
    '2024-05-01', // Día del Trabajo
    '2024-05-13', // Día de la Ascensión
    '2024-06-03', // Corpus Christi
    '2024-06-10', // Sagrado Corazón de Jesús
    '2024-06-24', // San Pedro y San Pablo
    '2024-07-01', // Día de la Independencia
    '2024-07-20', // Día de la Independencia
    '2024-08-07', // Batalla de Boyacá
    '2024-08-19', // Asunción de la Virgen
    '2024-10-14', // Día de la Raza
    '2024-11-04', // Todos los Santos
    '2024-11-11', // Independencia de Cartagena
    '2024-12-08', // Día de la Inmaculada Concepción
    '2024-12-25'  // Navidad
  ],
  '2025': [
    '2025-01-01', // Año Nuevo
    '2025-01-06', // Día de los Reyes Magos
    '2025-04-13', // Domingo de Ramos
    '2025-04-17', // Jueves Santo
    '2025-04-18', // Viernes Santo
    '2025-04-20', // Domingo de Resurrección
    '2025-05-01', // Día del Trabajo
    '2025-06-02', // Corpus Christi
    '2025-06-09', // Sagrado Corazón de Jesús
    '2025-06-23', // San Pedro y San Pablo
    '2025-06-30', // Día de la Independencia
    '2025-07-20', // Día de la Independencia
    '2025-08-07', // Batalla de Boyacá
    '2025-08-18', // Asunción de la Virgen
    '2025-10-13', // Día de la Raza
    '2025-11-03', // Todos los Santos
    '2025-11-10', // Independencia de Cartagena
    '2025-12-08', // Día de la Inmaculada Concepción
    '2025-12-25'  // Navidad
  ]
};

// Función para verificar si una fecha es festiva
function esDiaFestivo(fecha) {
  const año = fecha.getFullYear().toString();
  const fechaStr = fecha.toISOString().split('T')[0];
  
  if (DIAS_FESTIVOS_COLOMBIA[año]) {
    return DIAS_FESTIVOS_COLOMBIA[año].includes(fechaStr);
  }
  
  return false;
}

// Función para verificar si una fecha es domingo
function esDomingo(fecha) {
  return fecha.getDay() === 0;
}

// Función para calcular horas trabajadas
function calcularHorasTrabajadas(horaEntrada, horaSalida, fecha) {
  try {
    // Convertir strings de hora a objetos Date
    const [horaEnt, minEnt] = horaEntrada.split(':').map(Number);
    const [horaSal, minSal] = horaSalida.split(':').map(Number);
    
    // Crear objetos Date para la fecha específica
    const entrada = new Date(fecha);
    entrada.setHours(horaEnt, minEnt, 0, 0);
    
    const salida = new Date(fecha);
    salida.setHours(horaSal, minSal, 0, 0);
    
    // Si la salida es antes que la entrada, asumir que es del día siguiente
    if (salida < entrada) {
      salida.setDate(salida.getDate() + 1);
    }
    
    // Calcular diferencia en milisegundos y convertir a horas
    const diferenciaMs = salida - entrada;
    const horasTrabajadas = diferenciaMs / (1000 * 60 * 60);
    
    // Verificar si es día festivo o domingo
    const esFestivo = esDiaFestivo(new Date(fecha));
    const esDomingo = esDomingo(new Date(fecha));
    
    return {
      horasTotal: horasTrabajadas,
      horasOrdinarias: esFestivo || esDomingo ? 0 : Math.min(horasTrabajadas, 8),
      horasExtras: esFestivo || esDomingo ? 0 : Math.max(0, horasTrabajadas - 8),
      horasNocturnas: calcularHorasNocturnas(entrada, salida),
      horasDominicales: esDomingo ? horasTrabajadas : 0,
      horasFestivas: esFestivo ? horasTrabajadas : 0,
      esDiaFestivo: esFestivo,
      esDomingo: esDomingo
    };
  } catch (error) {
    console.error('❌ Error calculando horas:', error);
    return null;
  }
}

// Función para calcular horas nocturnas (10 PM - 6 AM)
function calcularHorasNocturnas(entrada, salida) {
  const horaInicioNocturna = 22; // 10 PM
  const horaFinNocturna = 6;     // 6 AM
  
  let horasNocturnas = 0;
  const fechaActual = new Date(entrada);
  
  while (fechaActual < salida) {
    const hora = fechaActual.getHours();
    
    // Verificar si es hora nocturna
    if (hora >= horaInicioNocturna || hora < horaFinNocturna) {
      horasNocturnas += 1/60; // Incrementar por minuto
    }
    
    fechaActual.setMinutes(fechaActual.getMinutes() + 1);
  }
  
  return Math.round(horasNocturnas * 100) / 100; // Redondear a 2 decimales
}

// Función para calcular salario por horas según ley colombiana
function calcularSalarioPorHoras(horasCalculadas, salarioBaseMensual) {
  try {
    const salarioHoraOrdinaria = salarioBaseMensual / 240; // 240 horas mensuales estándar
    
    // Recargos según ley colombiana
    const recargoExtras = 1.25;        // 25% extra por horas extras
    const recargoNocturnas = 1.35;     // 35% extra por horas nocturnas
    const recargoDominicales = 1.75;   // 75% extra por horas dominicales
    const recargoFestivas = 1.75;      // 75% extra por horas festivas
    
    const calculo = {
      horasOrdinarias: {
        cantidad: horasCalculadas.horasOrdinarias,
        valorHora: salarioHoraOrdinaria,
        subtotal: horasCalculadas.horasOrdinarias * salarioHoraOrdinaria
      },
      horasExtras: {
        cantidad: horasCalculadas.horasExtras,
        valorHora: salarioHoraOrdinaria * recargoExtras,
        subtotal: horasCalculadas.horasExtras * salarioHoraOrdinaria * recargoExtras
      },
      horasNocturnas: {
        cantidad: horasCalculadas.horasNocturnas,
        valorHora: salarioHoraOrdinaria * recargoNocturnas,
        subtotal: horasCalculadas.horasNocturnas * salarioHoraOrdinaria * recargoNocturnas
      },
      horasDominicales: {
        cantidad: horasCalculadas.horasDominicales,
        valorHora: salarioHoraOrdinaria * recargoDominicales,
        subtotal: horasCalculadas.horasDominicales * salarioHoraOrdinaria * recargoDominicales
      },
      horasFestivas: {
        cantidad: horasCalculadas.horasFestivas,
        valorHora: salarioHoraOrdinaria * recargoFestivas,
        subtotal: horasCalculadas.horasFestivas * salarioHoraOrdinaria * recargoFestivas
      }
    };
    
    // Calcular totales
    calculo.totalHoras = Object.values(calculo).reduce((sum, tipo) => sum + tipo.cantidad, 0);
    calculo.totalSalario = Object.values(calculo).reduce((sum, tipo) => sum + tipo.subtotal, 0);
    
    return calculo;
  } catch (error) {
    console.error('❌ Error calculando salario por horas:', error);
    return null;
  }
}

// Función para mostrar resumen de horas con calendario colombiano
function mostrarResumenHorasColombiano(empleadoId, fechaInicio, fechaFin) {
  try {
    const empleado = gestionPersonal.empleados.find(emp => emp.id === empleadoId);
    if (!empleado) {
      mostrarNotificacion('❌ Empleado no encontrado', 'error');
      return;
    }
    
    // Filtrar horas del período
    const horasPeriodo = gestionPersonal.horas.filter(hora => 
      hora.empleadoId === empleadoId &&
      new Date(hora.fecha) >= new Date(fechaInicio) &&
      new Date(hora.fecha) <= new Date(fechaFin)
    );
    
    if (horasPeriodo.length === 0) {
      mostrarNotificacion('ℹ️ No hay horas registradas para este período', 'info');
      return;
    }
    
    // Calcular resumen
    let resumen = {
      totalDias: 0,
      totalHoras: 0,
      horasOrdinarias: 0,
      horasExtras: 0,
      horasNocturnas: 0,
      horasDominicales: 0,
      horasFestivas: 0,
      diasLaborales: 0,
      diasFestivos: 0,
      domingos: 0
    };
    
    horasPeriodo.forEach(hora => {
      const fecha = new Date(hora.fecha);
      const calculo = calcularHorasTrabajadas(hora.horaEntrada, hora.horaSalida, fecha);
      
      if (calculo) {
        resumen.totalDias++;
        resumen.totalHoras += calculo.horasTotal;
        resumen.horasOrdinarias += calculo.horasOrdinarias;
        resumen.horasExtras += calculo.horasExtras;
        resumen.horasNocturnas += calculo.horasNocturnas;
        resumen.horasDominicales += calculo.horasDominicales;
        resumen.horasFestivas += calculo.horasFestivas;
        
        if (calculo.esDiaFestivo) resumen.diasFestivos++;
        if (calculo.esDomingo) resumen.domingos++;
        if (!calculo.esDiaFestivo && !calculo.esDomingo) resumen.diasLaborales++;
      }
    });
    
    // Calcular salario si es por horas
    let calculoSalario = null;
    if (empleado.tipoSalario === 'por_horas' && empleado.salarioReferencia) {
      calculoSalario = calcularSalarioPorHoras(resumen, empleado.salarioReferencia);
    }
    
    // Mostrar resumen en el modal
    mostrarResumenHorasEnModal(resumen, calculoSalario, empleado);
    
  } catch (error) {
    console.error('❌ Error mostrando resumen de horas:', error);
    mostrarNotificacion('❌ Error mostrando resumen de horas', 'error');
  }
}

// Función para mostrar resumen en modal
function mostrarResumenHorasEnModal(resumen, calculoSalario, empleado) {
  const modal = document.getElementById('modalCalculoHoras');
  if (!modal) return;
  
  const resumenContainer = document.getElementById('resumenHoras');
  if (!resumenContainer) return;
  
  let html = `
    <div class="resumen-horas-detallado">
      <h5><i class="fas fa-user"></i> ${empleado.nombre}</h5>
      <div class="resumen-grid">
        <div class="resumen-item">
          <span class="resumen-label">Total Días:</span>
          <span class="resumen-valor">${resumen.totalDias}</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Total Horas:</span>
          <span class="resumen-valor">${resumen.totalHoras.toFixed(2)}h</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Horas Ordinarias:</span>
          <span class="resumen-valor">${resumen.horasOrdinarias.toFixed(2)}h</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Horas Extras:</span>
          <span class="resumen-valor">${resumen.horasExtras.toFixed(2)}h</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Horas Nocturnas:</span>
          <span class="resumen-valor">${resumen.horasNocturnas.toFixed(2)}h</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Horas Dominicales:</span>
          <span class="resumen-valor">${resumen.horasDominicales.toFixed(2)}h</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Horas Festivas:</span>
          <span class="resumen-valor">${resumen.horasFestivas.toFixed(2)}h</span>
        </div>
      </div>
      
      <div class="resumen-calendario">
        <h6><i class="fas fa-calendar-alt"></i> Resumen del Período</h6>
        <div class="calendario-stats">
          <span class="calendario-stat">
            <i class="fas fa-briefcase"></i> Días Laborales: ${resumen.diasLaborales}
          </span>
          <span class="calendario-stat">
            <i class="fas fa-star"></i> Días Festivos: ${resumen.diasFestivos}
          </span>
          <span class="calendario-stat">
            <i class="fas fa-church"></i> Domingos: ${resumen.domingos}
          </span>
        </div>
      </div>
  `;
  
  if (calculoSalario) {
    html += `
      <div class="resumen-salario">
        <h6><i class="fas fa-dollar-sign"></i> Cálculo de Salario</h6>
        <div class="salario-breakdown">
          <div class="salario-item">
            <span>Salario Base:</span>
            <span>$${empleado.salarioReferencia.toLocaleString('es-CO')}</span>
          </div>
          <div class="salario-item">
            <span>Total Horas Ordinarias:</span>
            <span>$${calculoSalario.horasOrdinarias.subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div class="salario-item">
            <span>Total Horas Extras:</span>
            <span>$${calculoSalario.horasExtras.subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div class="salario-item total">
            <span><strong>Total Salario:</strong></span>
            <span><strong>$${calculoSalario.totalSalario.toLocaleString('es-CO')}</strong></span>
          </div>
        </div>
      </div>
    `;
  }
  
  html += '</div>';
  
  resumenContainer.innerHTML = html;
  modal.style.display = 'block';
}

// Hacer funciones globales
window.cambiarTipoSalario = cambiarTipoSalario;
window.cambiarTab = cambiarTab;
window.mostrarModalEmpleado = mostrarModalEmpleado;
window.cerrarModalEmpleado = cerrarModalEmpleado;
window.mostrarModalDepartamento = mostrarModalDepartamento;
window.cerrarModalDepartamento = cerrarModalDepartamento;
window.mostrarModalExportarEmpleados = mostrarModalExportarEmpleados;
window.cerrarModalExportarEmpleados = cerrarModalExportarEmpleados;
window.mostrarModalRegistroHoras = mostrarModalRegistroHoras;
window.cerrarModalRegistroHoras = cerrarModalRegistroHoras;
window.mostrarModalCalculoHoras = mostrarModalCalculoHoras;
window.cerrarModalCalculoHoras = cerrarModalCalculoHoras;
window.mostrarModalExportarExcel = mostrarModalExportarExcel;
window.cerrarModalExportarExcel = cerrarModalExportarExcel;
window.mostrarModalReporteHoras = mostrarModalReporteHoras;
window.cerrarModalReporteHoras = cerrarModalReporteHoras;
window.mostrarModalGenerarNomina = mostrarModalGenerarNomina;
window.cerrarModalGenerarNomina = cerrarModalGenerarNomina;
window.mostrarModalReporteGeneral = mostrarModalReporteGeneral;
window.cerrarModalReporteGeneral = cerrarModalReporteGeneral;
window.mostrarModalReporteEmpleado = mostrarModalReporteEmpleado;
window.cerrarModalReporteEmpleado = cerrarModalReporteEmpleado;
window.mostrarModalReporteDepartamento = mostrarModalReporteDepartamento;
window.cerrarModalReporteDepartamento = cerrarModalReporteDepartamento;
window.guardarEmpleado = guardarEmpleado;
window.guardarDepartamento = guardarDepartamento;
window.eliminarDepartamento = eliminarDepartamento;
window.guardarHoras = guardarHoras;
window.procesarExportacion = procesarExportacion;
window.generarReporteHoras = generarReporteHoras;
window.procesarGeneracionNomina = procesarGeneracionNomina;
window.generarReporteGeneral = generarReporteGeneral;
window.generarReporteEmpleado = generarReporteEmpleado;
window.generarReporteDepartamento = generarReporteDepartamento;
window.procesarExportacionEmpleados = procesarExportacionEmpleados;
window.mostrarResumenHorasColombiano = mostrarResumenHorasColombiano;
