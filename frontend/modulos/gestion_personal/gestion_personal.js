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
    try {
      let valor = input.value || input;
      if (typeof valor === 'string') {
        // Remover todos los caracteres no numéricos excepto el punto decimal
        valor = valor.replace(/[^\d.]/g, '');
        
        // Permitir solo un punto decimal
        const partes = valor.split('.');
        if (partes.length > 2) {
          valor = partes[0] + '.' + partes.slice(1).join('');
        }
        
        // Convertir a número y validar
        const numero = parseFloat(valor);
        if (isNaN(numero)) {
          input.value = '';
          return;
        }
        
        // Permitir cualquier número válido (sin restricción de longitud)
        if (numero >= 0) {
          // Mantener el valor original sin formateo automático
          input.value = numero.toString();
          
          // Remover borde rojo si existe
          input.style.borderColor = '';
          input.classList.remove('error');
        } else {
          input.value = '';
        }
        
        console.log('💰 Salario formateado:', { original: valor, procesado: numero });
      }
    } catch (error) {
      console.error('❌ Error en formatearSalario:', error);
      input.value = '';
    }
  }

  limpiarFormatoSalario(input) {
    try {
      // Obtener el valor del input
      let valor = input.value || input;

      // Si es un string, procesarlo; si es un elemento DOM, obtener su valor
      if (typeof valor === 'string') {
        // Remover todos los caracteres no numéricos excepto el punto decimal
        valor = valor.replace(/[^\d.,]/g, '');

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

        console.log('💰 Salario procesado:', { original: input.value || input, procesado: numero });
        return numero.toString();
      } else {
        // Si es un elemento DOM, procesar su valor
        return this.limpiarFormatoSalario(valor.value);
      }
    } catch (error) {
      console.error('❌ Error en limpiarFormatoSalario:', error);
      return '0';
    }
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
              <span class="stat-value">${this.calcularTotalHorasMes().toFixed(1)}</span>
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
    if (!container) return;

    if (this.departamentos.length === 0) {
      container.innerHTML = `
        <div class="no-data">
          <i class="fas fa-building"></i>
          <p>No hay departamentos creados. Crea el primero para comenzar.</p>
          <button class="btn btn-primary" onclick="mostrarModalDepartamento()">
            <i class="fas fa-plus"></i> Crear Primer Departamento
          </button>
        </div>
      `;
      return;
    }

    let html = '<div class="departamentos-grid">';

    this.departamentos.forEach((departamento) => {
      html += `
        <div class="departamento-item" data-id="${departamento.id}">
          <div class="departamento-header">
            <div class="departamento-color" style="background-color: ${departamento.color}">
              <i class="fas fa-building"></i>
            </div>
            <div class="departamento-info">
              <h4 class="departamento-nombre">${departamento.nombre}</h4>
              <p class="departamento-descripcion">${departamento.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
          
          <div class="departamento-actions">
            <button class="btn btn-sm btn-primary" onclick="editarDepartamento('${departamento.id}')">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarDepartamento('${departamento.id}')">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;

    console.log('✅ Lista de departamentos renderizada:', this.departamentos.length);
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
      const departamento = gestionPersonal.departamentos.find((dep) => dep.id === departamentoId);
      if (!departamento) {
        mostrarNotificacion('❌ Departamento no encontrado', 'error');
        return;
      }

      // Verificar si el departamento tiene empleados
      const empleadosEnDepartamento = gestionPersonal.empleados.filter(
        (emp) => emp.departamento === departamento.nombre
      );

      // Mostrar modal de confirmación profesional
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-container modal-confirmacion">
          <div class="modal-header">
            <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación de Departamento</h3>
          </div>
          <div class="modal-body">
            <div class="departamento-eliminacion-info">
              <div class="departamento-color-preview" style="background-color: ${departamento.color}">
                <i class="fas fa-building"></i>
              </div>
              <div class="departamento-datos-eliminacion">
                <h4>${departamento.nombre}</h4>
                <p><strong>Descripción:</strong> ${departamento.descripcion || 'Sin descripción'}</p>
                <p><strong>Color:</strong> <span class="color-preview" style="background-color: ${
                  departamento.color
                }"></span> ${departamento.color}</p>
              </div>
            </div>
            
            <div class="advertencias-eliminacion">
              <div class="advertencia-item ${
                empleadosEnDepartamento.length > 0 ? 'advertencia-critica' : 'advertencia-info'
              }">
                <i class="fas ${empleadosEnDepartamento.length > 0 ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                <span>Empleados en el departamento: ${empleadosEnDepartamento.length}</span>
              </div>
            </div>
            
            ${
              empleadosEnDepartamento.length > 0
                ? `
              <div class="advertencia-critica-mensaje">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Advertencia Crítica:</strong> Este departamento tiene ${
                  empleadosEnDepartamento.length
                } empleado(s) asignado(s).
                <br><br>
                <strong>Empleados afectados:</strong>
                <ul class="empleados-afectados">
                  ${empleadosEnDepartamento.map((emp) => `<li>• ${emp.nombre} (${emp.cargo})</li>`).join('')}
                </ul>
                <br>
                <strong>Acción:</strong> Los empleados serán movidos a "Sin Departamento" y deberás reasignarlos manualmente.
              </div>
            `
                : ''
            }
            
            <p class="advertencia-final">⚠️ Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" onclick="confirmarEliminarDepartamento('${departamentoId}'); this.closest('.modal-overlay').remove();">
              <i class="fas fa-trash"></i> Eliminar Departamento
            </button>
            <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
              <i class="fas fa-times"></i> Cancelar
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      console.log('🗑️ Modal de confirmación para eliminar departamento mostrado');
    } catch (error) {
      console.error('❌ Error mostrando modal de confirmación para eliminar departamento:', error);
      mostrarNotificacion('❌ Error eliminando departamento', 'error');
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
    // Calcular total de pagos basado en las nóminas generadas (netos)
    if (this.nominas.length === 0) {
      return 0;
    }

    // Sumar todos los netos de las nóminas
    const totalNeto = this.nominas.reduce((total, nomina) => {
      // Si la nómina tiene un campo neto, usarlo; si no, calcularlo
      if (nomina.neto && typeof nomina.neto === 'number') {
        return total + nomina.neto;
      } else if (nomina.salarioNeto && typeof nomina.salarioNeto === 'number') {
        return total + nomina.salarioNeto;
      } else if (nomina.totalNeto && typeof nomina.totalNeto === 'number') {
        return total + nomina.totalNeto;
      } else {
        // Si no hay campo neto, calcular basado en el salario del empleado
        const empleado = this.empleados.find((emp) => emp.id === nomina.empleadoId);
        if (empleado) {
          if (empleado.tipoSalario === 'fijo') {
            return total + (empleado.salarioFijo || 0) + (empleado.bonificaciones || 0);
          } else if (empleado.tipoSalario === 'por_horas') {
            // Para empleados por horas, calcular basado en horas trabajadas
            const horasEmpleado = this.horas.filter((h) => h.empleadoId === empleado.id);
            const totalHoras = horasEmpleado.reduce((sum, h) => {
              return sum + this.calcularTotalHoras(h.horaEntrada, h.horaSalida);
            }, 0);
            const salarioPorHora = (empleado.salarioReferencia || 0) / 240; // 240 horas mensuales
            return total + totalHoras * salarioPorHora;
          }
        }
        return total;
      }
    }, 0);

    console.log('💰 Total de pagos calculado:', {
      nominas: this.nominas.length,
      totalNeto: totalNeto,
      nominasDetalle: this.nominas.map((n) => ({
        id: n.id,
        empleadoId: n.empleadoId,
        neto: n.neto || n.salarioNeto || n.totalNeto || 'No definido',
      })),
    });

    return totalNeto;
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

  renderizarListaEmpleados() {
    const contenedor = document.getElementById('listaEmpleados');
    if (!contenedor) {
      console.warn('⚠️ Contenedor de lista de empleados no encontrado');
      return;
    }

    if (this.empleados.length === 0) {
      contenedor.innerHTML = `
        <div class="no-data">
          <i class="fas fa-users"></i>
          <p>No hay empleados registrados. Agrega el primero para comenzar.</p>
        </div>
      `;
      return;
    }

    let html = '<div class="empleados-grid">';

    this.empleados.forEach((empleado) => {
      const departamento = this.departamentos.find((dep) => dep.id === empleado.departamento);
      const nombreDepartamento = departamento ? departamento.nombre : 'Sin departamento';

      html += `
        <div class="empleado-card" data-id="${empleado.id}">
          <div class="empleado-header">
            <div class="empleado-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="empleado-info">
              <h4 class="empleado-nombre">${empleado.nombre}</h4>
              <p class="empleado-cargo">${empleado.cargo}</p>
              <span class="empleado-cedula">C.C. ${empleado.cedula}</span>
            </div>
            <div class="empleado-estado ${empleado.estado === 'activo' ? 'activo' : 'inactivo'}">
              <i class="fas fa-circle"></i>
              ${empleado.estado === 'activo' ? 'Activo' : 'Inactivo'}
            </div>
          </div>
          
          <div class="empleado-details">
            <div class="empleado-departamento">
              <i class="fas fa-building"></i>
              <span>${nombreDepartamento}</span>
            </div>
            <div class="empleado-salario">
              <i class="fas fa-dollar-sign"></i>
              <span>
                ${
                  empleado.tipoSalario === 'fijo'
                    ? `$${(empleado.salarioFijo || 0).toLocaleString('es-CO')} COP`
                    : `$${(empleado.salarioReferencia || 0).toLocaleString('es-CO')} COP por hora`
                }
              </span>
            </div>
            <div class="empleado-fecha">
              <i class="fas fa-calendar"></i>
              <span>Contratado: ${new Date(empleado.fechaContratacion).toLocaleDateString('es-CO')}</span>
            </div>
          </div>
          
          <div class="empleado-actions">
            <button class="btn btn-sm btn-primary" onclick="editarEmpleado('${empleado.id}')">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-info" onclick="verEmpleado('${empleado.id}')">
              <i class="fas fa-eye"></i> Ver
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarEmpleado('${empleado.id}')">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    contenedor.innerHTML = html;

    console.log('✅ Lista de empleados renderizada:', this.empleados.length);
  }

  renderizarListaHoras() {
    const contenedor = document.getElementById('listaHoras');
    if (!contenedor) {
      console.warn('⚠️ Contenedor de lista de horas no encontrado');
      return;
    }

    if (this.horas.length === 0) {
      contenedor.innerHTML = `
        <div class="no-data">
          <i class="fas fa-clock"></i>
          <p>No hay horas registradas. Registra las primeras horas para comenzar.</p>
        </div>
      `;
      return;
    }

    let html = '<div class="horas-grid">';

    this.horas.forEach((hora) => {
      const empleado = this.empleados.find((emp) => emp.id === hora.empleadoId);
      const nombreEmpleado = empleado ? empleado.nombre : 'Empleado no encontrado';
      const departamento = empleado ? empleado.departamento : 'Sin departamento';

      const totalHoras = this.calcularTotalHoras(hora.horaEntrada, hora.horaSalida);

      html += `
        <div class="hora-card" data-id="${hora.id}">
          <div class="hora-header">
            <div class="hora-avatar">
              <i class="fas fa-clock"></i>
            </div>
            <div class="hora-info">
              <h4 class="hora-empleado">${nombreEmpleado}</h4>
              <p class="hora-departamento">${departamento}</p>
              <span class="hora-fecha">${new Date(hora.fecha).toLocaleDateString('es-CO')}</span>
            </div>
            <div class="hora-total">
              <span class="hora-valor">${totalHoras.toFixed(2)}h</span>
            </div>
          </div>
          
          <div class="hora-details">
            <div class="hora-horarios">
              <div class="hora-entrada">
                <i class="fas fa-sign-in-alt"></i>
                <span>Entrada: ${hora.horaEntrada}</span>
              </div>
              <div class="hora-salida">
                <i class="fas fa-sign-out-alt"></i>
                <span>Salida: ${hora.horaSalida}</span>
              </div>
            </div>
            ${
              hora.observaciones
                ? `
              <div class="hora-observaciones">
                <i class="fas fa-comment"></i>
                <span>${hora.observaciones}</span>
              </div>
            `
                : ''
            }
          </div>
          
          <div class="hora-actions">
            <button class="btn btn-sm btn-primary" onclick="editarHora('${hora.id}')">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarHora('${hora.id}')">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    contenedor.innerHTML = html;

    console.log('✅ Lista de horas renderizada:', this.horas.length);
  }

  calcularPromedioSalario() {
    if (this.empleados.length === 0) return '$0';
    
    const totalSalarios = this.empleados.reduce((total, empleado) => {
      let salario = 0;
      
      if (empleado.tipoSalario === 'fijo') {
        salario = (empleado.salarioFijo || 0) + (empleado.bonificaciones || 0);
      } else if (empleado.tipoSalario === 'por_horas') {
        salario = empleado.salarioReferencia || 0;
      }
      
      return total + salario;
    }, 0);
    
    const promedio = totalSalarios / this.empleados.length;
    return this.formatearMoneda(promedio);
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
    if (!form) {
      console.error('❌ Formulario no encontrado');
      return;
    }

    // Validar formulario manualmente
    const camposRequeridos = [
      'nombreEmpleado',
      'cedulaEmpleado',
      'cargoEmpleado',
      'departamentoEmpleado',
      'tipoSalarioEmpleado',
      'tipoContratoEmpleado',
      'fechaContratacionEmpleado',
      'estadoEmpleado'
    ];

    let formularioValido = true;
    const errores = [];

    camposRequeridos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (!campo) {
        console.error(`❌ Campo no encontrado: ${campoId}`);
        return;
      }

      if (!campo.value.trim()) {
        formularioValido = false;
        errores.push(`Campo ${campoId} está vacío`);
        campo.style.borderColor = '#e74c3c';
        campo.classList.add('error');
      } else {
        campo.style.borderColor = '';
        campo.classList.remove('error');
      }
    });

    // Validar campos específicos según el tipo de salario
    const tipoSalario = document.getElementById('tipoSalarioEmpleado').value;
    console.log('💰 Tipo de salario seleccionado:', tipoSalario);

    if (tipoSalario === 'fijo') {
      const salarioFijo = document.getElementById('salarioFijoEmpleado');
      if (!salarioFijo || !salarioFijo.value.trim()) {
        formularioValido = false;
        errores.push('Salario fijo es requerido');
        if (salarioFijo) {
          salarioFijo.style.borderColor = '#e74c3c';
          salarioFijo.classList.add('error');
        }
      }
    } else if (tipoSalario === 'por_horas') {
      const salarioReferencia = document.getElementById('salarioReferenciaEmpleado');
      if (!salarioReferencia || !salarioReferencia.value.trim()) {
        formularioValido = false;
        errores.push('Salario de referencia es requerido');
        if (salarioReferencia) {
          salarioReferencia.style.borderColor = '#e74c3c';
          salarioReferencia.classList.add('error');
        }
      }
    }

    if (!formularioValido) {
      console.error('❌ Formulario no válido:', errores);
      mostrarNotificacion(`❌ Por favor completa los campos requeridos: ${errores.join(', ')}`, 'error');
      return;
    }

    // Crear objeto empleado
    const empleado = {
      id: Date.now().toString(),
      nombre: document.getElementById('nombreEmpleado').value.trim(),
      cedula: document.getElementById('cedulaEmpleado').value.trim(),
      cargo: document.getElementById('cargoEmpleado').value.trim(),
      departamento: document.getElementById('departamentoEmpleado').value.trim(),
      tipoSalario: tipoSalario,
      tipoContrato: document.getElementById('tipoContratoEmpleado').value.trim(),
      fechaContratacion: document.getElementById('fechaContratacionEmpleado').value,
      estado: document.getElementById('estadoEmpleado').value.trim(),
      fechaCreacion: new Date().toISOString()
    };

    // Agregar campos específicos según el tipo de salario
    if (tipoSalario === 'fijo') {
      empleado.salarioFijo = parseFloat(gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioFijoEmpleado')));
      empleado.bonificaciones = parseFloat(gestionPersonal.limpiarFormatoSalario(document.getElementById('bonificacionesEmpleado'))) || 0;
    } else if (tipoSalario === 'por_horas') {
      empleado.salarioReferencia = parseFloat(gestionPersonal.limpiarFormatoSalario(document.getElementById('salarioReferenciaEmpleado')));
    }

    console.log('👤 Empleado a guardar:', empleado);

    // Guardar empleado
    await gestionPersonal.agregarEmpleado(empleado);
    
    // Mostrar notificación de éxito
    mostrarNotificacion(`✅ Empleado ${empleado.nombre} guardado correctamente`, 'success', 'Empleado Guardado');
    
    // Cerrar modal
    cerrarModalEmpleado();
    
    // Actualizar interfaz
    gestionPersonal.renderizarListaEmpleados();
    gestionPersonal.actualizarEstadisticas();
    
    console.log('✅ Empleado guardado exitosamente');
  } catch (error) {
    console.error('❌ Error guardando empleado:', error);
    mostrarNotificacion(`❌ Error guardando empleado: ${error.message}`, 'error', 'Error');
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
    const departamento = gestionPersonal.departamentos.find((dep) => dep.id === departamentoId);
    if (!departamento) {
      mostrarNotificacion('❌ Departamento no encontrado', 'error');
      return;
    }

    // Verificar si el departamento tiene empleados
    const empleadosEnDepartamento = gestionPersonal.empleados.filter((emp) => emp.departamento === departamento.nombre);

    // Mostrar modal de confirmación profesional
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container modal-confirmacion">
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación de Departamento</h3>
        </div>
        <div class="modal-body">
          <div class="departamento-eliminacion-info">
            <div class="departamento-color-preview" style="background-color: ${departamento.color}">
              <i class="fas fa-building"></i>
            </div>
            <div class="departamento-datos-eliminacion">
              <h4>${departamento.nombre}</h4>
              <p><strong>Descripción:</strong> ${departamento.descripcion || 'Sin descripción'}</p>
              <p><strong>Color:</strong> <span class="color-preview" style="background-color: ${
                departamento.color
              }"></span> ${departamento.color}</p>
            </div>
          </div>
          
          <div class="advertencias-eliminacion">
            <div class="advertencia-item ${
              empleadosEnDepartamento.length > 0 ? 'advertencia-critica' : 'advertencia-info'
            }">
              <i class="fas ${empleadosEnDepartamento.length > 0 ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
              <span>Empleados en el departamento: ${empleadosEnDepartamento.length}</span>
            </div>
          </div>
          
            ${
              empleadosEnDepartamento.length > 0
                ? `
              <div class="advertencia-critica-mensaje">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Advertencia Crítica:</strong> Este departamento tiene ${
                  empleadosEnDepartamento.length
                } empleado(s) asignado(s).
                <br><br>
                <strong>Empleados afectados:</strong>
                <ul class="empleados-afectados">
                  ${empleadosEnDepartamento.map((emp) => `<li>• ${emp.nombre} (${emp.cargo})</li>`).join('')}
                </ul>
                <br>
                <strong>Acción:</strong> Los empleados serán movidos a "Sin Departamento" y deberás reasignarlos manualmente.
              </div>
            `
                : ''
            }
          
          <p class="advertencia-final">⚠️ Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" onclick="confirmarEliminarDepartamento('${departamentoId}'); this.closest('.modal-overlay').remove();">
            <i class="fas fa-trash"></i> Eliminar Departamento
          </button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    console.log('🗑️ Modal de confirmación para eliminar departamento mostrado');
  } catch (error) {
    console.error('❌ Error mostrando modal de confirmación para eliminar departamento:', error);
    mostrarNotificacion('❌ Error eliminando departamento', 'error');
  }
}

// Función para confirmar eliminación de departamento
function confirmarEliminarDepartamento(departamentoId) {
  try {
    const departamento = gestionPersonal.departamentos.find((dep) => dep.id === departamentoId);
    if (!departamento) {
      mostrarNotificacion('❌ Departamento no encontrado', 'error');
      return;
    }

    // Mover empleados a "Sin Departamento"
    gestionPersonal.empleados.forEach((emp) => {
      if (emp.departamento === departamento.nombre) {
        emp.departamento = 'Sin Departamento';
      }
    });

    // Eliminar departamento del sistema
    gestionPersonal.departamentos = gestionPersonal.departamentos.filter((dep) => dep.id !== departamentoId);

    // Guardar datos
    gestionPersonal.guardarDatos();

    // Actualizar interfaz
    gestionPersonal.renderizarListaDepartamentos();
    gestionPersonal.renderizarListaEmpleados();
    gestionPersonal.actualizarEstadisticas();

    mostrarNotificacion(
      `✅ Departamento ${departamento.nombre} eliminado correctamente`,
      'success',
      'Departamento Eliminado'
    );

    console.log('✅ Departamento eliminado:', departamento.nombre);
  } catch (error) {
    console.error('❌ Error confirmando eliminación de departamento:', error);
    mostrarNotificacion('❌ Error eliminando departamento', 'error');
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
  try {
    const periodo = document.getElementById('periodoExport').value;
    const incluirHorasOrdinarias = document.getElementById('horasOrdinarias').checked;
    const incluirHorasExtras = document.getElementById('horasExtras').checked;
    const incluirHorasNocturnas = document.getElementById('horasNocturnas').checked;
    const incluirHorasDominicales = document.getElementById('horasDominicales').checked;

    // Validar que al menos un tipo de hora esté seleccionado
    if (!incluirHorasOrdinarias && !incluirHorasExtras && !incluirHorasNocturnas && !incluirHorasDominicales) {
      mostrarNotificacion('❌ Selecciona al menos un tipo de hora para exportar', 'warning');
      return;
    }

    // Filtrar horas según el período seleccionado
    let horasFiltradas = gestionPersonal.horas;

    if (periodo === 'mes_actual') {
      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const añoActual = ahora.getFullYear();

      horasFiltradas = gestionPersonal.horas.filter((hora) => {
        const fechaHora = new Date(hora.fecha);
        return fechaHora.getMonth() === mesActual && fechaHora.getFullYear() === añoActual;
      });
    } else if (periodo === 'mes_anterior') {
      const ahora = new Date();
      const mesAnterior = ahora.getMonth() === 0 ? 11 : ahora.getMonth() - 1;
      const añoAnterior = ahora.getMonth() === 0 ? ahora.getFullYear() - 1 : ahora.getFullYear();

      horasFiltradas = gestionPersonal.horas.filter((hora) => {
        const fechaHora = new Date(hora.fecha);
        return fechaHora.getMonth() === mesAnterior && fechaHora.getFullYear() === añoAnterior;
      });
    }

    console.log('📊 Horas filtradas para exportación:', {
      total: gestionPersonal.horas.length,
      filtradas: horasFiltradas.length,
      periodo: periodo,
    });

    if (horasFiltradas.length === 0) {
      mostrarNotificacion('❌ No hay horas para exportar en el período seleccionado', 'warning');
      return;
    }

    // Crear y descargar el archivo Excel
    generarExcelHoras(horasFiltradas, periodo);

    mostrarNotificacion(
      `✅ Exportando ${horasFiltradas.length} horas para el período: ${periodo}`,
      'success',
      'Exportación Exitosa'
    );
    cerrarModalExportarExcel();
  } catch (error) {
    console.error('❌ Error en exportación:', error);
    mostrarNotificacion('❌ Error al exportar horas', 'error');
  }
}

// Función para generar Excel con todas las horas
function generarExcelHoras(horas, periodo) {
  try {
    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);

    // Crear encabezados
    const headers = [
      'Fecha',
      'Empleado',
      'Departamento',
      'Hora Entrada',
      'Hora Salida',
      'Total Horas',
      'Horas Ordinarias',
      'Horas Extras',
      'Horas Nocturnas',
      'Horas Dominicales',
      'Observaciones',
    ];

    // Agregar encabezados
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

    // Agregar datos de horas
    const datosHoras = horas.map((hora) => {
      const empleado = gestionPersonal.empleados.find((emp) => emp.id === hora.empleadoId);
      const totalHoras = gestionPersonal.calcularTotalHoras(hora.horaEntrada, hora.horaSalida);

      return [
        new Date(hora.fecha).toLocaleDateString('es-CO'),
        empleado ? empleado.nombre : 'Empleado no encontrado',
        empleado ? empleado.departamento : 'Sin departamento',
        hora.horaEntrada,
        hora.horaSalida,
        totalHoras.toFixed(2),
        totalHoras > 8 ? 8 : totalHoras, // Horas ordinarias (máximo 8)
        totalHoras > 8 ? totalHoras - 8 : 0, // Horas extras
        0, // Horas nocturnas (se calcularían según horario)
        0, // Horas dominicales (se calcularían según fecha)
        hora.observaciones || '',
      ];
    });

    // Agregar datos al worksheet
    XLSX.utils.sheet_add_aoa(ws, datosHoras, { origin: 'A2' });

    // Aplicar estilos
    aplicarEstilosExcelHoras(ws, horas.length);

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, `Horas_${periodo}`);

    // Generar nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Horas_${periodo}_${fecha}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, nombreArchivo);

    console.log('📊 Excel generado exitosamente:', nombreArchivo);
  } catch (error) {
    console.error('❌ Error generando Excel:', error);
    mostrarNotificacion('❌ Error generando archivo Excel', 'error');
  }
}

// Función para aplicar estilos al Excel de horas
function aplicarEstilosExcelHoras(ws, totalHoras) {
  try {
    // Definir rangos
    const range = XLSX.utils.decode_range(ws['!ref']);

    // Aplicar estilos a encabezados
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;

      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '2E86AB' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };
    }

    // Aplicar estilos a datos
    for (let row = 1; row <= totalHoras; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) continue;

        ws[cellAddress].s = {
          font: { color: { rgb: '2C3E50' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: 'BDC3C7' } },
            bottom: { style: 'thin', color: { rgb: 'BDC3C7' } },
            left: { style: 'thin', color: { rgb: 'BDC3C7' } },
            right: { style: 'thin', color: { rgb: 'BDC3C7' } },
          },
        };
      }
    }

    // Ajustar ancho de columnas
    const columnWidths = [12, 20, 15, 12, 12, 12, 15, 15, 15, 15, 25];
    ws['!cols'] = columnWidths.map((width) => ({ width }));

    console.log('🎨 Estilos aplicados al Excel de horas');
  } catch (error) {
    console.error('❌ Error aplicando estilos al Excel:', error);
  }
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
  try {
    const periodo = document.getElementById('reporteGeneralPeriodo').value;
    const graficos = document.getElementById('reporteGraficos').checked;
    const comparativas = document.getElementById('reporteComparativas').checked;
    const proyecciones = document.getElementById('reporteProyecciones').checked;

    // Crear modal de reporte con gráficos
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container modal-reporte-grande">
        <div class="modal-header">
          <h3><i class="fas fa-chart-line"></i> Reporte General - ${periodo}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="reporte-contenido">
            ${
              graficos
                ? `
              <div class="grafico-seccion">
                <h4><i class="fas fa-chart-bar"></i> Distribución de Empleados por Departamento</h4>
                <div class="grafico-container">
                  <canvas id="graficoDepartamentos" width="400" height="200"></canvas>
                </div>
              </div>
              
              <div class="grafico-seccion">
                <h4><i class="fas fa-chart-pie"></i> Distribución de Salarios</h4>
                <div class="grafico-container">
                  <canvas id="graficoSalarios" width="400" height="200"></canvas>
                </div>
              </div>
              
              <div class="grafico-seccion">
                <h4><i class="fas fa-chart-line"></i> Horas Trabajadas por Mes</h4>
                <div class="grafico-container">
                  <canvas id="graficoHoras" width="400" height="200"></canvas>
                </div>
              </div>
            `
                : ''
            }
            
            ${
              comparativas
                ? `
              <div class="comparativas-seccion">
                <h4><i class="fas fa-balance-scale"></i> Comparativas</h4>
                <div class="comparativas-grid">
                  <div class="comparativa-item">
                    <h5>Empleados por Tipo de Contrato</h5>
                    <div id="comparativaContratos"></div>
                  </div>
                  <div class="comparativa-item">
                    <h5>Salarios por Departamento</h5>
                    <div id="comparativaSalarios"></div>
                  </div>
                </div>
              </div>
            `
                : ''
            }
            
            ${
              proyecciones
                ? `
              <div class="proyecciones-seccion">
                <h4><i class="fas fa-rocket"></i> Proyecciones</h4>
                <div class="proyecciones-grid">
                  <div class="proyeccion-item">
                    <h5>Proyección de Costos Laborales</h5>
                    <div id="proyeccionCostos"></div>
                  </div>
                  <div class="proyeccion-item">
                    <h5>Proyección de Horas</h5>
                    <div id="proyeccionHoras"></div>
                  </div>
                </div>
              </div>
            `
                : ''
            }
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="exportarReporteGeneral()">
            <i class="fas fa-download"></i> Exportar Reporte
          </button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i> Cerrar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Generar gráficos después de que el modal esté visible
    setTimeout(() => {
      if (graficos) {
        generarGraficoDepartamentos();
        generarGraficoSalarios();
        generarGraficoHoras();
      }

      if (comparativas) {
        generarComparativas();
      }

      if (proyecciones) {
        generarProyecciones();
      }
    }, 100);

    mostrarNotificacion(`✅ Reporte general generado para ${periodo}`, 'success', 'Reporte Generado');

    console.log('📊 Reporte general generado:', { periodo, graficos, comparativas, proyecciones });
  } catch (error) {
    console.error('❌ Error generando reporte general:', error);
    mostrarNotificacion('❌ Error generando reporte general', 'error');
  }
}

// Generar gráfico de departamentos
function generarGraficoDepartamentos() {
  try {
    const ctx = document.getElementById('graficoDepartamentos');
    if (!ctx) return;

    // Agrupar empleados por departamento
    const empleadosPorDepartamento = {};
    gestionPersonal.empleados.forEach((empleado) => {
      const dept = empleado.departamento || 'Sin Departamento';
      empleadosPorDepartamento[dept] = (empleadosPorDepartamento[dept] || 0) + 1;
    });

    const labels = Object.keys(empleadosPorDepartamento);
    const data = Object.values(empleadosPorDepartamento);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#3498db',
              '#e74c3c',
              '#f39c12',
              '#2ecc71',
              '#9b59b6',
              '#1abc9c',
              '#e67e22',
              '#34495e',
              '#95a5a6',
              '#16a085',
            ],
            borderWidth: 2,
            borderColor: '#fff',
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
          title: {
            display: true,
            text: 'Distribución de Empleados por Departamento',
          },
        },
      },
    });

    console.log('📊 Gráfico de departamentos generado');
  } catch (error) {
    console.error('❌ Error generando gráfico de departamentos:', error);
  }
}

// Generar gráfico de salarios
function generarGraficoSalarios() {
  try {
    const ctx = document.getElementById('graficoSalarios');
    if (!ctx) return;

    // Calcular rangos de salarios
    const rangos = {
      'Menos de $1M': 0,
      '$1M - $2M': 0,
      '$2M - $3M': 0,
      '$3M - $4M': 0,
      'Más de $4M': 0,
    };

    gestionPersonal.empleados.forEach((empleado) => {
      let salario = 0;
      if (empleado.tipoSalario === 'fijo') {
        salario = (empleado.salarioFijo || 0) + (empleado.bonificaciones || 0);
      } else if (empleado.tipoSalario === 'por_horas') {
        salario = (empleado.salarioReferencia || 0) * 240; // 240 horas mensuales
      }

      if (salario < 1000000) rangos['Menos de $1M']++;
      else if (salario < 2000000) rangos['$1M - $2M']++;
      else if (salario < 3000000) rangos['$2M - $3M']++;
      else if (salario < 4000000) rangos['$3M - $4M']++;
      else rangos['Más de $4M']++;
    });

    const labels = Object.keys(rangos);
    const data = Object.values(rangos);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de Empleados',
            data: data,
            backgroundColor: '#3498db',
            borderColor: '#2980b9',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Distribución de Salarios',
          },
        },
      },
    });

    console.log('📊 Gráfico de salarios generado');
  } catch (error) {
    console.error('❌ Error generando gráfico de salarios:', error);
  }
}

// Generar gráfico de horas
function generarGraficoHoras() {
  try {
    const ctx = document.getElementById('graficoHoras');
    if (!ctx) return;

    // Calcular horas por mes (últimos 6 meses)
    const meses = [];
    const horasPorMes = [];

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      const mes = fecha.toLocaleDateString('es-CO', { month: 'short', year: '2-digit' });
      meses.push(mes);

      // Calcular horas del mes
      const horasMes = gestionPersonal.calcularTotalHorasMes(fecha);
      horasPorMes.push(horasMes);
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Horas Trabajadas',
            data: horasPorMes,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Horas',
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Horas Trabajadas por Mes',
          },
        },
      },
    });

    console.log('📊 Gráfico de horas generado');
  } catch (error) {
    console.error('❌ Error generando gráfico de horas:', error);
  }
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
  try {
    const departamento = document.getElementById('reporteDepartamentoSelect').value;
    const periodo = document.getElementById('reporteDepartamentoPeriodo').value;

    // Crear modal de reporte por departamento
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container modal-reporte-grande">
        <div class="modal-header">
          <h3><i class="fas fa-building"></i> Reporte por Departamento - ${departamento || 'Todos'}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="reporte-contenido">
            <div class="grafico-seccion">
              <h4><i class="fas fa-users"></i> Empleados por Departamento</h4>
              <div class="grafico-container">
                <canvas id="graficoEmpleadosDept" width="400" height="200"></canvas>
              </div>
            </div>
            
            <div class="grafico-seccion">
              <h4><i class="fas fa-dollar-sign"></i> Salarios por Departamento</h4>
              <div class="grafico-container">
                <canvas id="graficoSalariosDept" width="400" height="200"></canvas>
              </div>
            </div>
            
            <div class="grafico-seccion">
              <h4><i class="fas fa-clock"></i> Horas Trabajadas por Departamento</h4>
              <div class="grafico-container">
                <canvas id="graficoHorasDept" width="400" height="200"></canvas>
              </div>
            </div>
            
            <div class="resumen-seccion">
              <h4><i class="fas fa-chart-pie"></i> Resumen del Departamento</h4>
              <div id="resumenDepartamento" class="resumen-grid"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="exportarReporteDepartamento()">
            <i class="fas fa-download"></i> Exportar Reporte
          </button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i> Cerrar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Generar gráficos después de que el modal esté visible
    setTimeout(() => {
      generarGraficoEmpleadosDepartamento(departamento);
      generarGraficoSalariosDepartamento(departamento);
      generarGraficoHorasDepartamento(departamento);
      generarResumenDepartamento(departamento);
    }, 100);

    mostrarNotificacion(
      `✅ Reporte de departamento ${departamento || 'todos'} generado`,
      'success',
      'Reporte Generado'
    );

    console.log('📊 Reporte por departamento generado:', { departamento, periodo });
  } catch (error) {
    console.error('❌ Error generando reporte por departamento:', error);
    mostrarNotificacion('❌ Error generando reporte por departamento', 'error');
  }
}

// Generar gráfico de empleados por departamento
function generarGraficoEmpleadosDepartamento(departamentoFiltro) {
  try {
    const ctx = document.getElementById('graficoEmpleadosDept');
    if (!ctx) return;

    // Filtrar empleados por departamento si se especifica
    let empleados = gestionPersonal.empleados;
    if (departamentoFiltro) {
      empleados = empleados.filter((emp) => emp.departamento === departamentoFiltro);
    }

    // Agrupar por departamento
    const empleadosPorDept = {};
    empleados.forEach((emp) => {
      const dept = emp.departamento || 'Sin Departamento';
      empleadosPorDept[dept] = (empleadosPorDept[dept] || 0) + 1;
    });

    const labels = Object.keys(empleadosPorDept);
    const data = Object.values(empleadosPorDept);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de Empleados',
            data: data,
            backgroundColor: '#2ecc71',
            borderColor: '#27ae60',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Empleados por Departamento',
          },
        },
      },
    });

    console.log('📊 Gráfico de empleados por departamento generado');
  } catch (error) {
    console.error('❌ Error generando gráfico de empleados por departamento:', error);
  }
}

// Generar gráfico de salarios por departamento
function generarGraficoSalariosDepartamento(departamentoFiltro) {
  try {
    const ctx = document.getElementById('graficoSalariosDept');
    if (!ctx) return;

    // Filtrar empleados por departamento si se especifica
    let empleados = gestionPersonal.empleados;
    if (departamentoFiltro) {
      empleados = empleados.filter((emp) => emp.departamento === departamentoFiltro);
    }

    // Calcular salarios por departamento
    const salariosPorDept = {};
    empleados.forEach((emp) => {
      const dept = emp.departamento || 'Sin Departamento';
      let salario = 0;

      if (emp.tipoSalario === 'fijo') {
        salario = (emp.salarioFijo || 0) + (emp.bonificaciones || 0);
      } else if (emp.tipoSalario === 'por_horas') {
        salario = (emp.salarioReferencia || 0) * 240; // 240 horas mensuales
      }

      if (!salariosPorDept[dept]) {
        salariosPorDept[dept] = { total: 0, empleados: 0 };
      }

      salariosPorDept[dept].total += salario;
      salariosPorDept[dept].empleados++;
    });

    // Calcular promedio por departamento
    const labels = Object.keys(salariosPorDept);
    const data = labels.map((dept) => {
      const info = salariosPorDept[dept];
      return info.empleados > 0 ? info.total / info.empleados : 0;
    });

    new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Salario Promedio (COP)',
            data: data,
            backgroundColor: '#9b59b6',
            borderColor: '#8e44ad',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Salario Promedio (COP)',
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Salarios Promedio por Departamento',
          },
        },
      },
    });

    console.log('📊 Gráfico de salarios por departamento generado');
  } catch (error) {
    console.error('❌ Error generando gráfico de salarios por departamento:', error);
  }
}

// Generar gráfico de horas por departamento
function generarGraficoHorasDepartamento(departamentoFiltro) {
  try {
    const ctx = document.getElementById('graficoHorasDept');
    if (!ctx) return;

    // Filtrar empleados por departamento si se especifica
    let empleados = gestionPersonal.empleados;
    if (departamentoFiltro) {
      empleados = empleados.filter((emp) => emp.departamento === departamentoFiltro);
    }

    // Calcular horas por departamento
    const horasPorDept = {};
    empleados.forEach((emp) => {
      const dept = emp.departamento || 'Sin Departamento';
      if (!horasPorDept[dept]) {
        horasPorDept[dept] = 0;
      }

      // Buscar horas del empleado en el mes actual
      const horasEmpleado = gestionPersonal.horas.filter(
        (h) => h.empleadoId === emp.id && new Date(h.fecha).getMonth() === new Date().getMonth()
      );

      const totalHoras = horasEmpleado.reduce((sum, h) => {
        return sum + gestionPersonal.calcularTotalHoras(h.horaEntrada, h.horaSalida);
      }, 0);

      horasPorDept[dept] += totalHoras;
    });

    const labels = Object.keys(horasPorDept);
    const data = Object.values(horasPorDept);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#e67e22',
              '#f39c12',
              '#f1c40f',
              '#2ecc71',
              '#1abc9c',
              '#3498db',
              '#9b59b6',
              '#e74c3c',
              '#34495e',
              '#95a5a6',
            ],
            borderWidth: 2,
            borderColor: '#fff',
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
          title: {
            display: true,
            text: 'Horas Trabajadas por Departamento',
          },
        },
      },
    });

    console.log('📊 Gráfico de horas por departamento generado');
  } catch (error) {
    console.error('❌ Error generando gráfico de horas por departamento:', error);
  }
}

// Generar resumen del departamento
function generarResumenDepartamento(departamentoFiltro) {
  try {
    const container = document.getElementById('resumenDepartamento');
    if (!container) return;

    // Filtrar empleados por departamento si se especifica
    let empleados = gestionPersonal.empleados;
    if (departamentoFiltro) {
      empleados = empleados.filter((emp) => emp.departamento === departamentoFiltro);
    }

    // Calcular estadísticas
    const totalEmpleados = empleados.length;
    const empleadosActivos = empleados.filter((emp) => emp.estado === 'activo').length;
    const totalSalarios = empleados.reduce((sum, emp) => {
      let salario = 0;
      if (emp.tipoSalario === 'fijo') {
        salario = (emp.salarioFijo || 0) + (emp.bonificaciones || 0);
      } else if (emp.tipoSalario === 'por_horas') {
        salario = (emp.salarioReferencia || 0) * 240;
      }
      return sum + salario;
    }, 0);

    const totalHoras = empleados.reduce((sum, emp) => {
      const horasEmpleado = gestionPersonal.horas.filter(
        (h) => h.empleadoId === emp.id && new Date(h.fecha).getMonth() === new Date().getMonth()
      );

      return (
        sum +
        horasEmpleado.reduce((sumH, h) => {
          return sumH + gestionPersonal.calcularTotalHoras(h.horaEntrada, h.horaSalida);
        }, 0)
      );
    }, 0);

    const html = `
      <div class="resumen-item">
        <span class="resumen-label">Total Empleados:</span>
        <span class="resumen-valor">${totalEmpleados}</span>
      </div>
      <div class="resumen-item">
        <span class="resumen-label">Empleados Activos:</span>
        <span class="resumen-valor">${empleadosActivos}</span>
      </div>
      <div class="resumen-item">
        <span class="resumen-label">Total Salarios:</span>
        <span class="resumen-valor">$${totalSalarios.toLocaleString('es-CO')} COP</span>
      </div>
      <div class="resumen-item">
        <span class="resumen-label">Total Horas (Mes):</span>
        <span class="resumen-valor">${totalHoras.toFixed(1)}h</span>
      </div>
      <div class="resumen-item">
        <span class="resumen-label">Promedio Salario:</span>
        <span class="resumen-valor">$${
          totalEmpleados > 0 ? (totalSalarios / totalEmpleados).toLocaleString('es-CO') : 0
        } COP</span>
      </div>
      <div class="resumen-item">
        <span class="resumen-label">Promedio Horas:</span>
        <span class="resumen-valor">${totalEmpleados > 0 ? (totalHoras / totalEmpleados).toFixed(1) : 0}h</span>
      </div>
    `;

    container.innerHTML = html;
    console.log('📊 Resumen del departamento generado');
  } catch (error) {
    console.error('❌ Error generando resumen del departamento:', error);
  }
}

// Procesar Exportación de Empleados
function procesarExportacionEmpleados() {
  const formato = document.querySelector('input[name="formatoExport"]:checked').value;
  mostrarNotificacion(`Exportando empleados en formato: ${formato}`, 'info', 'Exportación de Empleados');
  cerrarModalExportarEmpleados();
}

// Cargar Datos de Ejemplo
function cargarDatosEjemplo() {
  try {
    // Datos de ejemplo para departamentos
    const departamentosEjemplo = [
      {
        id: 'dept_001',
        nombre: 'Administración',
        descripcion: 'Departamento de administración y gestión general',
        color: '#3498db',
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: 'dept_002',
        nombre: 'Ventas',
        descripcion: 'Departamento de ventas y atención al cliente',
        color: '#e74c3c',
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: 'dept_003',
        nombre: 'Operaciones',
        descripcion: 'Departamento de operaciones y logística',
        color: '#f39c12',
        fechaCreacion: new Date().toISOString(),
      },
    ];

    // Datos de ejemplo para empleados
    const empleadosEjemplo = [
      {
        id: 'emp_001',
        nombre: 'Ana María González',
        cedula: '12345678',
        cargo: 'Gerente Administrativa',
        departamento: 'dept_001',
        tipoSalario: 'fijo',
        salarioFijo: 2500000,
        bonificaciones: 200000,
        tipoContrato: 'indefinido',
        fechaContratacion: '2024-01-15',
        estado: 'activo',
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: 'emp_002',
        nombre: 'Carlos Rodríguez',
        cedula: '87654321',
        cargo: 'Vendedor Senior',
        departamento: 'dept_002',
        tipoSalario: 'fijo',
        salarioFijo: 1800000,
        bonificaciones: 150000,
        tipoContrato: 'indefinido',
        fechaContratacion: '2024-02-01',
        estado: 'activo',
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: 'emp_003',
        nombre: 'María López',
        cedula: '11223344',
        cargo: 'Operadora',
        departamento: 'dept_003',
        tipoSalario: 'por_horas',
        salarioReferencia: 8000,
        tipoContrato: 'término fijo',
        fechaContratacion: '2024-03-01',
        estado: 'activo',
        fechaCreacion: new Date().toISOString(),
      },
    ];

    // Datos de ejemplo para horas
    const horasEjemplo = [
      {
        id: 'hora_001',
        empleadoId: 'emp_001',
        fecha: '2024-08-25',
        horaEntrada: '08:00',
        horaSalida: '17:00',
        observaciones: 'Jornada completa',
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: 'hora_002',
        empleadoId: 'emp_002',
        fecha: '2024-08-25',
        horaEntrada: '09:00',
        horaSalida: '18:00',
        observaciones: 'Jornada completa',
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: 'hora_003',
        empleadoId: 'emp_003',
        fecha: '2024-08-25',
        horaEntrada: '07:00',
        horaSalida: '15:00',
        observaciones: 'Jornada de 8 horas',
        fechaCreacion: new Date().toISOString(),
      },
    ];

    // Datos de ejemplo para nóminas
    const nominasEjemplo = [
      {
        id: 'nom_001',
        empleadoId: 'emp_001',
        periodo: 'agosto_2024',
        fechaGeneracion: '2024-08-25',
        salarioBase: 2500000,
        bonificaciones: 200000,
        deducciones: 150000,
        neto: 2550000,
        estado: 'generada',
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: 'nom_002',
        empleadoId: 'emp_002',
        periodo: 'agosto_2024',
        fechaGeneracion: '2024-08-25',
        salarioBase: 1800000,
        bonificaciones: 150000,
        deducciones: 120000,
        neto: 1830000,
        estado: 'generada',
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: 'nom_003',
        empleadoId: 'emp_003',
        periodo: 'agosto_2024',
        fechaGeneracion: '2024-08-25',
        horasTrabajadas: 8,
        salarioPorHora: 8000,
        totalBruto: 64000,
        deducciones: 5000,
        neto: 59000,
        estado: 'generada',
        fechaCreacion: new Date().toISOString(),
      },
    ];

    // Cargar datos en el sistema
    gestionPersonal.departamentos = departamentosEjemplo;
    gestionPersonal.empleados = empleadosEjemplo;
    gestionPersonal.horas = horasEjemplo;
    gestionPersonal.nominas = nominasEjemplo;

    // Guardar en localStorage
    gestionPersonal.guardarDatos();

    // Actualizar interfaz
    gestionPersonal.renderizarListaEmpleados();
    gestionPersonal.renderizarListaDepartamentos();
    gestionPersonal.actualizarEstadisticas();

    mostrarNotificacion('✅ Datos de ejemplo cargados correctamente', 'success', 'Datos Cargados');

    console.log('📊 Datos de ejemplo cargados:', {
      departamentos: departamentosEjemplo.length,
      empleados: empleadosEjemplo.length,
      horas: horasEjemplo.length,
      nominas: nominasEjemplo.length,
    });
  } catch (error) {
    console.error('❌ Error cargando datos de ejemplo:', error);
    mostrarNotificacion('❌ Error cargando datos de ejemplo', 'error');
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
  2024: [
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
    '2024-12-25', // Navidad
  ],
  2025: [
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
    '2025-12-25', // Navidad
  ],
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
      esDomingo: esDomingo,
    };
  } catch (error) {
    console.error('❌ Error calculando horas:', error);
    return null;
  }
}

// Función para calcular horas nocturnas (10 PM - 6 AM)
function calcularHorasNocturnas(entrada, salida) {
  const horaInicioNocturna = 22; // 10 PM
  const horaFinNocturna = 6; // 6 AM

  let horasNocturnas = 0;
  const fechaActual = new Date(entrada);

  while (fechaActual < salida) {
    const hora = fechaActual.getHours();

    // Verificar si es hora nocturna
    if (hora >= horaInicioNocturna || hora < horaFinNocturna) {
      horasNocturnas += 1 / 60; // Incrementar por minuto
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
    const recargoExtras = 1.25; // 25% extra por horas extras
    const recargoNocturnas = 1.35; // 35% extra por horas nocturnas
    const recargoDominicales = 1.75; // 75% extra por horas dominicales
    const recargoFestivas = 1.75; // 75% extra por horas festivas

    const calculo = {
      horasOrdinarias: {
        cantidad: horasCalculadas.horasOrdinarias,
        valorHora: salarioHoraOrdinaria,
        subtotal: horasCalculadas.horasOrdinarias * salarioHoraOrdinaria,
      },
      horasExtras: {
        cantidad: horasCalculadas.horasExtras,
        valorHora: salarioHoraOrdinaria * recargoExtras,
        subtotal: horasCalculadas.horasExtras * salarioHoraOrdinaria * recargoExtras,
      },
      horasNocturnas: {
        cantidad: horasCalculadas.horasNocturnas,
        valorHora: salarioHoraOrdinaria * recargoNocturnas,
        subtotal: horasCalculadas.horasNocturnas * salarioHoraOrdinaria * recargoNocturnas,
      },
      horasDominicales: {
        cantidad: horasCalculadas.horasDominicales,
        valorHora: salarioHoraOrdinaria * recargoDominicales,
        subtotal: horasCalculadas.horasDominicales * salarioHoraOrdinaria * recargoDominicales,
      },
      horasFestivas: {
        cantidad: horasCalculadas.horasFestivas,
        valorHora: salarioHoraOrdinaria * recargoFestivas,
        subtotal: horasCalculadas.horasFestivas * salarioHoraOrdinaria * recargoFestivas,
      },
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
    const empleado = gestionPersonal.empleados.find((emp) => emp.id === empleadoId);
    if (!empleado) {
      mostrarNotificacion('❌ Empleado no encontrado', 'error');
      return;
    }

    // Filtrar horas del período
    const horasPeriodo = gestionPersonal.horas.filter(
      (hora) =>
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
      domingos: 0,
    };

    horasPeriodo.forEach((hora) => {
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

// Función para editar empleado
function editarEmpleado(empleadoId) {
  try {
    const empleado = gestionPersonal.empleados.find((emp) => emp.id === empleadoId);
    if (!empleado) {
      mostrarNotificacion('❌ Empleado no encontrado', 'error');
      return;
    }

    // Llenar el formulario con los datos del empleado
    document.getElementById('nombreEmpleado').value = empleado.nombre || '';
    document.getElementById('cedulaEmpleado').value = empleado.cedula || '';
    document.getElementById('cargoEmpleado').value = empleado.cargo || '';
    document.getElementById('departamentoEmpleado').value = empleado.departamento || '';
    document.getElementById('tipoSalarioEmpleado').value = empleado.tipoSalario || 'fijo';
    document.getElementById('tipoContratoEmpleado').value = empleado.tipoContrato || '';
    document.getElementById('fechaContratacionEmpleado').value = empleado.fechaContratacion || '';
    document.getElementById('estadoEmpleado').value = empleado.estado || 'activo';

    // Configurar campos de salario según el tipo
    if (empleado.tipoSalario === 'fijo') {
      document.getElementById('salarioFijoEmpleado').value = empleado.salarioFijo || '';
      document.getElementById('bonificacionesEmpleado').value = empleado.bonificaciones || '';
    } else if (empleado.tipoSalario === 'por_horas') {
      document.getElementById('salarioReferenciaEmpleado').value = empleado.salarioReferencia || '';
    }

    // Aplicar cambios de visualización
    cambiarTipoSalario();

    // Cambiar texto del botón
    const btnGuardar = document.getElementById('btnGuardarEmpleado');
    btnGuardar.textContent = 'Actualizar Empleado';
    btnGuardar.onclick = () => actualizarEmpleado(empleadoId);

    // Mostrar modal
    mostrarModalEmpleado();

    console.log('✏️ Editando empleado:', empleado.nombre);
  } catch (error) {
    console.error('❌ Error editando empleado:', error);
    mostrarNotificacion('❌ Error editando empleado', 'error');
  }
}

// Función para ver empleado
function verEmpleado(empleadoId) {
  try {
    const empleado = gestionPersonal.empleados.find((emp) => emp.id === empleadoId);
    if (!empleado) {
      mostrarNotificacion('❌ Empleado no encontrado', 'error');
      return;
    }

    const departamento = gestionPersonal.departamentos.find((dep) => dep.id === empleado.departamento);
    const nombreDepartamento = departamento ? departamento.nombre : 'Sin departamento';

    // Crear modal de visualización
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3><i class="fas fa-user"></i> Información del Empleado</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="empleado-info-detallada">
            <div class="info-section">
              <h4>Información Personal</h4>
              <div class="info-row">
                <span class="info-label">Nombre:</span>
                <span class="info-value">${empleado.nombre}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Cédula:</span>
                <span class="info-value">${empleado.cedula}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Cargo:</span>
                <span class="info-value">${empleado.cargo}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Departamento:</span>
                <span class="info-value">${nombreDepartamento}</span>
              </div>
            </div>
            
            <div class="info-section">
              <h4>Información Laboral</h4>
              <div class="info-row">
                <span class="info-label">Tipo de Salario:</span>
                <span class="info-value">${empleado.tipoSalario === 'fijo' ? 'Salario Fijo' : 'Por Horas'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tipo de Contrato:</span>
                <span class="info-value">${empleado.tipoContrato}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fecha de Contratación:</span>
                <span class="info-value">${new Date(empleado.fechaContratacion).toLocaleDateString('es-CO')}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estado:</span>
                <span class="info-value ${empleado.estado === 'activo' ? 'activo' : 'inactivo'}">${
      empleado.estado
    }</span>
              </div>
            </div>
            
            <div class="info-section">
              <h4>Información Salarial</h4>
              ${
                empleado.tipoSalario === 'fijo'
                  ? `
                <div class="info-row">
                  <span class="info-label">Salario Base:</span>
                  <span class="info-value">$${(empleado.salarioFijo || 0).toLocaleString('es-CO')} COP</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Bonificaciones:</span>
                  <span class="info-value">$${(empleado.bonificaciones || 0).toLocaleString('es-CO')} COP</span>
                </div>
              `
                  : `
                <div class="info-row">
                  <span class="info-label">Salario por Hora:</span>
                  <span class="info-value">$${(empleado.salarioReferencia || 0).toLocaleString('es-CO')} COP</span>
                </div>
              `
              }
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="editarEmpleado('${
            empleado.id
          }'); this.closest('.modal-overlay').remove();">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i> Cerrar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    console.log('👁️ Visualizando empleado:', empleado.nombre);
  } catch (error) {
    console.error('❌ Error visualizando empleado:', error);
    mostrarNotificacion('❌ Error visualizando empleado', 'error');
  }
}

// Función para eliminar empleado
function eliminarEmpleado(empleadoId) {
  try {
    const empleado = gestionPersonal.empleados.find((emp) => emp.id === empleadoId);
    if (!empleado) {
      mostrarNotificacion('❌ Empleado no encontrado', 'error');
      return;
    }

    // Verificar si el empleado tiene horas registradas
    const horasEmpleado = gestionPersonal.horas.filter((h) => h.empleadoId === empleadoId);
    const nominasEmpleado = gestionPersonal.nominas.filter((n) => n.empleadoId === empleadoId);

    // Mostrar modal de confirmación profesional
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container modal-confirmacion">
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación de Empleado</h3>
        </div>
        <div class="modal-body">
          <div class="empleado-eliminacion-info">
            <div class="empleado-avatar-grande">
              <i class="fas fa-user"></i>
            </div>
            <div class="empleado-datos-eliminacion">
              <h4>${empleado.nombre}</h4>
              <p><strong>Cédula:</strong> ${empleado.cedula}</p>
              <p><strong>Cargo:</strong> ${empleado.cargo}</p>
              <p><strong>Departamento:</strong> ${empleado.departamento}</p>
            </div>
          </div>
          
          <div class="advertencias-eliminacion">
            <div class="advertencia-item ${horasEmpleado.length > 0 ? 'advertencia-critica' : 'advertencia-info'}">
              <i class="fas ${horasEmpleado.length > 0 ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
              <span>Horas registradas: ${horasEmpleado.length}</span>
            </div>
            <div class="advertencia-item ${nominasEmpleado.length > 0 ? 'advertencia-critica' : 'advertencia-info'}">
              <i class="fas ${nominasEmpleado.length > 0 ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
              <span>Nóminas generadas: ${nominasEmpleado.length}</span>
            </div>
          </div>
          
            ${
              horasEmpleado.length > 0 || nominasEmpleado.length > 0
                ? `
              <div class="advertencia-critica-mensaje">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Advertencia:</strong> Este empleado tiene datos asociados. 
                La eliminación también eliminará todas las horas y nóminas relacionadas.
              </div>
            `
                : ''
            }
          
          <p class="advertencia-final">⚠️ Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" onclick="confirmarEliminarEmpleado('${empleadoId}'); this.closest('.modal-overlay').remove();">
            <i class="fas fa-trash"></i> Eliminar Empleado
          </button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    console.log('🗑️ Modal de confirmación para eliminar empleado mostrado');
  } catch (error) {
    console.error('❌ Error mostrando modal de confirmación para eliminar empleado:', error);
    mostrarNotificacion('❌ Error eliminando empleado', 'error');
  }
}

// Función para confirmar eliminación de empleado
function confirmarEliminarEmpleado(empleadoId) {
  try {
    const empleado = gestionPersonal.empleados.find((emp) => emp.id === empleadoId);
    if (!empleado) {
      mostrarNotificacion('❌ Empleado no encontrado', 'error');
      return;
    }

    // Eliminar empleado del sistema
    gestionPersonal.empleados = gestionPersonal.empleados.filter((emp) => emp.id !== empleadoId);

    // Eliminar horas asociadas
    gestionPersonal.horas = gestionPersonal.horas.filter((h) => h.empleadoId !== empleadoId);

    // Eliminar nóminas asociadas
    gestionPersonal.nominas = gestionPersonal.nominas.filter((n) => n.empleadoId !== empleadoId);

    // Guardar datos
    gestionPersonal.guardarDatos();

    // Actualizar interfaz
    gestionPersonal.renderizarListaEmpleados();
    gestionPersonal.actualizarEstadisticas();

    mostrarNotificacion(`✅ Empleado ${empleado.nombre} eliminado correctamente`, 'success', 'Empleado Eliminado');

    console.log('✅ Empleado eliminado:', empleado.nombre);
  } catch (error) {
    console.error('❌ Error confirmando eliminación de empleado:', error);
    mostrarNotificacion('❌ Error eliminando empleado', 'error');
  }
}

// Función para actualizar empleado
function actualizarEmpleado(empleadoId) {
  try {
    // Obtener datos del formulario
    const empleado = {
      id: empleadoId,
      nombre: document.getElementById('nombreEmpleado').value,
      cedula: document.getElementById('cedulaEmpleado').value,
      cargo: document.getElementById('cargoEmpleado').value,
      departamento: document.getElementById('departamentoEmpleado').value,
      tipoSalario: document.getElementById('tipoSalarioEmpleado').value,
      tipoContrato: document.getElementById('tipoContratoEmpleado').value,
      fechaContratacion: document.getElementById('fechaContratacionEmpleado').value,
      estado: document.getElementById('estadoEmpleado').value,
    };

    // Agregar campos de salario según el tipo
    if (empleado.tipoSalario === 'fijo') {
      empleado.salarioFijo = parseFloat(document.getElementById('salarioFijoEmpleado').value) || 0;
      empleado.bonificaciones = parseFloat(document.getElementById('bonificacionesEmpleado').value) || 0;
      empleado.salarioReferencia = 0;
    } else if (empleado.tipoSalario === 'por_horas') {
      empleado.salarioReferencia = parseFloat(document.getElementById('salarioReferenciaEmpleado').value) || 0;
      empleado.salarioFijo = 0;
      empleado.bonificaciones = 0;
    }

    // Validar datos
    if (!empleado.nombre || !empleado.cedula || !empleado.cargo || !empleado.departamento) {
      mostrarNotificacion('❌ Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    // Actualizar empleado
    gestionPersonal.actualizarEmpleado(empleadoId, empleado);
    mostrarNotificacion(`✅ Empleado ${empleado.nombre} actualizado correctamente`, 'success');

    // Cerrar modal y actualizar interfaz
    cerrarModalEmpleado();
    gestionPersonal.renderizarListaEmpleados();
    gestionPersonal.actualizarEstadisticas();

    console.log('✅ Empleado actualizado:', empleado.nombre);
  } catch (error) {
    console.error('❌ Error actualizando empleado:', error);
    mostrarNotificacion('❌ Error actualizando empleado', 'error');
  }
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
window.editarEmpleado = editarEmpleado;
window.verEmpleado = verEmpleado;
window.eliminarEmpleado = eliminarEmpleado;
window.actualizarEmpleado = actualizarEmpleado;
window.mostrarNotificacion = mostrarNotificacion;
window.cerrarNotificacion = cerrarNotificacion;
window.cargarDatosEjemplo = cargarDatosEjemplo;
window.generarNomina = generarNomina;
window.mostrarModalConfiguracionNomina = mostrarModalConfiguracionNomina;
window.guardarConfiguracionNomina = guardarConfiguracionNomina;
window.cargarConfiguracionNomina = cargarConfiguracionNomina;
window.generarGraficoDepartamentos = generarGraficoDepartamentos;
window.generarGraficoSalarios = generarGraficoSalarios;
window.generarGraficoHoras = generarGraficoHoras;
window.generarGraficoEmpleadosDepartamento = generarGraficoEmpleadosDepartamento;
window.generarGraficoSalariosDepartamento = generarGraficoSalariosDepartamento;
window.generarGraficoHorasDepartamento = generarGraficoHorasDepartamento;
window.generarResumenDepartamento = generarResumenDepartamento;
window.eliminarHora = eliminarHora;
window.confirmarEliminarHora = confirmarEliminarHora;
window.confirmarEliminarEmpleado = confirmarEliminarEmpleado;
window.confirmarEliminarDepartamento = confirmarEliminarDepartamento;
window.editarHora = editarHora;
window.actualizarHora = actualizarHora;
window.editarDepartamento = editarDepartamento;
window.actualizarDepartamento = actualizarDepartamento;
window.generarExcelHoras = generarExcelHoras;
window.aplicarEstilosExcelHoras = aplicarEstilosExcelHoras;

// Modal de Configuración de Nómina
function mostrarModalConfiguracionNomina() {
  try {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container modal-configuracion-nomina">
        <div class="modal-header">
          <h3><i class="fas fa-cog"></i> Configuración de Nómina</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="configuracion-nomina-form">
            <div class="configuracion-grupo">
              <h5><i class="fas fa-percentage"></i> Deducciones</h5>
              <div class="configuracion-campo">
                <span class="configuracion-label">Salud (%):</span>
                <input type="number" class="configuracion-input" id="deduccionSalud" value="4" min="0" max="20" step="0.1">
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Pensión (%):</span>
                <input type="number" class="configuracion-input" id="deduccionPension" value="4" min="0" max="20" step="0.1">
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Riesgos Laborales (%):</span>
                <input type="number" class="configuracion-input" id="deduccionRiesgos" value="0.522" min="0" max="10" step="0.001">
              </div>
            </div>
            
            <div class="configuracion-grupo">
              <h5><i class="fas fa-clock"></i> Horas de Trabajo</h5>
              <div class="configuracion-campo">
                <span class="configuracion-label">Horas por día:</span>
                <input type="number" class="configuracion-input" id="horasPorDia" value="8" min="1" max="24">
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Días por mes:</span>
                <input type="number" class="configuracion-input" id="diasPorMes" value="22" min="1" max="31">
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Horas mensuales estándar:</span>
                <input type="number" class="configuracion-input" id="horasMensuales" value="240" min="1" max="744">
              </div>
            </div>
            
            <div class="configuracion-grupo">
              <h5><i class="fas fa-calculator"></i> Recargos</h5>
              <div class="configuracion-campo">
                <span class="configuracion-label">Horas extras (%):</span>
                <input type="number" class="configuracion-input" id="recargoExtras" value="25" min="0" max="100" step="1">
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Horas nocturnas (%):</span>
                <input type="number" class="configuracion-input" id="recargoNocturnas" value="35" min="0" max="100" step="1">
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Horas dominicales (%):</span>
                <input type="number" class="configuracion-input" id="recargoDominicales" value="75" min="0" max="100" step="1">
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Horas festivas (%):</span>
                <input type="number" class="configuracion-input" id="recargoFestivas" value="75" min="0" max="100" step="1">
              </div>
            </div>
            
            <div class="configuracion-grupo">
              <h5><i class="fas fa-toggle-on"></i> Opciones</h5>
              <div class="configuracion-campo">
                <span class="configuracion-label">Calcular automáticamente:</span>
                <label class="configuracion-toggle">
                  <input type="checkbox" id="calculoAutomatico" checked>
                  <span class="configuracion-slider"></span>
                </label>
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Incluir bonificaciones:</span>
                <label class="configuracion-toggle">
                  <input type="checkbox" id="incluirBonificaciones" checked>
                  <span class="configuracion-slider"></span>
                </label>
              </div>
              <div class="configuracion-campo">
                <span class="configuracion-label">Redondear a 2 decimales:</span>
                <label class="configuracion-toggle">
                  <input type="checkbox" id="redondearDecimales" checked>
                  <span class="configuracion-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="guardarConfiguracionNomina()">
            <i class="fas fa-save"></i> Guardar Configuración
          </button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i> Cerrar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Cargar configuración actual
    cargarConfiguracionNomina();

    console.log('⚙️ Modal de configuración de nómina mostrado');
  } catch (error) {
    console.error('❌ Error mostrando modal de configuración de nómina:', error);
    mostrarNotificacion('❌ Error mostrando configuración de nómina', 'error');
  }
}

// Guardar configuración de nómina
function guardarConfiguracionNomina() {
  try {
    const configuracion = {
      deducciones: {
        salud: parseFloat(document.getElementById('deduccionSalud').value) || 4,
        pension: parseFloat(document.getElementById('deduccionPension').value) || 4,
        riesgos: parseFloat(document.getElementById('deduccionRiesgos').value) || 0.522,
      },
      horas: {
        porDia: parseInt(document.getElementById('horasPorDia').value) || 8,
        porMes: parseInt(document.getElementById('diasPorMes').value) || 22,
        mensuales: parseInt(document.getElementById('horasMensuales').value) || 240,
      },
      recargos: {
        extras: parseFloat(document.getElementById('recargoExtras').value) || 25,
        nocturnas: parseFloat(document.getElementById('recargoNocturnas').value) || 35,
        dominicales: parseFloat(document.getElementById('recargoDominicales').value) || 75,
        festivas: parseFloat(document.getElementById('recargoFestivas').value) || 75,
      },
      opciones: {
        calculoAutomatico: document.getElementById('calculoAutomatico').checked,
        incluirBonificaciones: document.getElementById('incluirBonificaciones').checked,
        redondearDecimales: document.getElementById('redondearDecimales').checked,
      },
    };

    // Guardar en localStorage
    localStorage.setItem('configuracionNomina', JSON.stringify(configuracion));

    // Actualizar configuración global
    if (gestionPersonal) {
      gestionPersonal.configuracionNomina = configuracion;
    }

    mostrarNotificacion('✅ Configuración de nómina guardada correctamente', 'success', 'Configuración Guardada');

    // Cerrar modal
    document.querySelector('.modal-overlay').remove();

    console.log('💾 Configuración de nómina guardada:', configuracion);
  } catch (error) {
    console.error('❌ Error guardando configuración de nómina:', error);
    mostrarNotificacion('❌ Error guardando configuración de nómina', 'error');
  }
}

// Cargar configuración de nómina
function cargarConfiguracionNomina() {
  try {
    const configuracion = JSON.parse(localStorage.getItem('configuracionNomina')) || {
      deducciones: { salud: 4, pension: 4, riesgos: 0.522 },
      horas: { porDia: 8, porMes: 22, mensuales: 240 },
      recargos: { extras: 25, nocturnas: 35, dominicales: 75, festivas: 75 },
      opciones: { calculoAutomatico: true, incluirBonificaciones: true, redondearDecimales: true },
    };

    // Aplicar valores a los campos
    document.getElementById('deduccionSalud').value = configuracion.deducciones.salud;
    document.getElementById('deduccionPension').value = configuracion.deducciones.pension;
    document.getElementById('deduccionRiesgos').value = configuracion.deducciones.riesgos;
    document.getElementById('horasPorDia').value = configuracion.horas.porDia;
    document.getElementById('diasPorMes').value = configuracion.horas.porMes;
    document.getElementById('horasMensuales').value = configuracion.horas.mensuales;
    document.getElementById('recargoExtras').value = configuracion.recargos.extras;
    document.getElementById('recargoNocturnas').value = configuracion.recargos.nocturnas;
    document.getElementById('recargoDominicales').value = configuracion.recargos.dominicales;
    document.getElementById('recargoFestivas').value = configuracion.recargos.festivas;
    document.getElementById('calculoAutomatico').checked = configuracion.opciones.calculoAutomatico;
    document.getElementById('incluirBonificaciones').checked = configuracion.opciones.incluirBonificaciones;
    document.getElementById('redondearDecimales').checked = configuracion.opciones.redondearDecimales;

    console.log('📥 Configuración de nómina cargada:', configuracion);
  } catch (error) {
    console.error('❌ Error cargando configuración de nómina:', error);
  }
}

// Generar comparativas
function generarComparativas() {
  try {
    // Comparativa de empleados por tipo de contrato
    const comparativaContratos = document.getElementById('comparativaContratos');
    if (comparativaContratos) {
      const contratos = {};
      gestionPersonal.empleados.forEach((emp) => {
        const tipo = emp.tipoContrato || 'No especificado';
        contratos[tipo] = (contratos[tipo] || 0) + 1;
      });

      let html = '<div class="comparativa-lista">';
      Object.entries(contratos).forEach(([tipo, cantidad]) => {
        const porcentaje = ((cantidad / gestionPersonal.empleados.length) * 100).toFixed(1);
        html += `
          <div class="comparativa-item-detalle">
            <span class="comparativa-tipo">${tipo}</span>
            <div class="comparativa-barra">
              <div class="comparativa-progreso" style="width: ${porcentaje}%"></div>
            </div>
            <span class="comparativa-valor">${cantidad} (${porcentaje}%)</span>
          </div>
        `;
      });
      html += '</div>';
      comparativaContratos.innerHTML = html;
    }

    // Comparativa de salarios por departamento
    const comparativaSalarios = document.getElementById('comparativaSalarios');
    if (comparativaSalarios) {
      const salariosPorDept = {};
      gestionPersonal.empleados.forEach((emp) => {
        const dept = emp.departamento || 'Sin Departamento';
        let salario = 0;

        if (emp.tipoSalario === 'fijo') {
          salario = (emp.salarioFijo || 0) + (emp.bonificaciones || 0);
        } else if (emp.tipoSalario === 'por_horas') {
          salario = (emp.salarioReferencia || 0) * 240;
        }

        if (!salariosPorDept[dept]) {
          salariosPorDept[dept] = { total: 0, empleados: 0 };
        }

        salariosPorDept[dept].total += salario;
        salariosPorDept[dept].empleados++;
      });

      let html = '<div class="comparativa-lista">';
      Object.entries(salariosPorDept).forEach(([dept, info]) => {
        const promedio = info.empleados > 0 ? info.total / info.empleados : 0;
        html += `
          <div class="comparativa-item-detalle">
            <span class="comparativa-tipo">${dept}</span>
            <div class="comparativa-barra">
              <div class="comparativa-progreso" style="width: ${Math.min((promedio / 5000000) * 100, 100)}%"></div>
            </div>
            <span class="comparativa-valor">$${promedio.toLocaleString('es-CO')} COP</span>
          </div>
        `;
      });
      html += '</div>';
      comparativaSalarios.innerHTML = html;
    }

    console.log('📊 Comparativas generadas');
  } catch (error) {
    console.error('❌ Error generando comparativas:', error);
  }
}

// Generar proyecciones
function generarProyecciones() {
  try {
    // Proyección de costos laborales
    const proyeccionCostos = document.getElementById('proyeccionCostos');
    if (proyeccionCostos) {
      const mesActual = new Date().getMonth();
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      // Calcular tendencia de los últimos 3 meses
      const costosMensuales = [];
      for (let i = 2; i >= 0; i--) {
        const mes = (mesActual - i + 12) % 12;
        const costosMes = gestionPersonal.empleados.reduce((sum, emp) => {
          let salario = 0;
          if (emp.tipoSalario === 'fijo') {
            salario = (emp.salarioFijo || 0) + (emp.bonificaciones || 0);
          } else if (emp.tipoSalario === 'por_horas') {
            salario = (emp.salarioReferencia || 0) * 240;
          }
          return sum + salario;
        }, 0);
        costosMensuales.push(costosMes);
      }

      // Calcular proyección (promedio simple)
      const promedioCostos = costosMensuales.reduce((sum, costo) => sum + costo, 0) / costosMensuales.length;
      const proyeccion3Meses = promedioCostos * 3;

      let html = `
        <div class="proyeccion-item-detalle">
          <h6>Costos de los Últimos 3 Meses</h6>
          <div class="proyeccion-meses">
            ${costosMensuales
              .map(
                (costo, i) => `
              <div class="proyeccion-mes">
                <span class="proyeccion-mes-nombre">${meses[(mesActual - 2 + i + 12) % 12]}</span>
                <span class="proyeccion-mes-valor">$${costo.toLocaleString('es-CO')}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="proyeccion-item-detalle">
          <h6>Proyección a 3 Meses</h6>
          <div class="proyeccion-valor-grande">
            $${proyeccion3Meses.toLocaleString('es-CO')} COP
          </div>
          <div class="proyeccion-tendencia">
            <i class="fas fa-arrow-up"></i> Promedio mensual: $${promedioCostos.toLocaleString('es-CO')} COP
          </div>
        </div>
      `;
      proyeccionCostos.innerHTML = html;
    }

    // Proyección de horas
    const proyeccionHoras = document.getElementById('proyeccionHoras');
    if (proyeccionHoras) {
      const mesActual = new Date().getMonth();
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      // Calcular tendencia de las últimas 3 meses
      const horasMensuales = [];
      for (let i = 2; i >= 0; i--) {
        const mes = (mesActual - i + 12) % 12;
        const horasMes = gestionPersonal.calcularTotalHorasMes(new Date(2024, mes, 1));
        horasMensuales.push(horasMes);
      }

      // Calcular proyección
      const promedioHoras = horasMensuales.reduce((sum, horas) => sum + horas, 0) / horasMensuales.length;
      const proyeccion3Meses = promedioHoras * 3;

      let html = `
        <div class="proyeccion-item-detalle">
          <h6>Horas de los Últimos 3 Meses</h6>
          <div class="proyeccion-meses">
            ${horasMensuales
              .map(
                (horas, i) => `
              <div class="proyeccion-mes">
                <span class="proyeccion-mes-nombre">${meses[(mesActual - 2 + i + 12) % 12]}</span>
                <span class="proyeccion-mes-valor">${horas.toFixed(1)}h</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="proyeccion-item-detalle">
          <h6>Proyección a 3 Meses</h6>
          <div class="proyeccion-valor-grande">
            ${proyeccion3Meses.toFixed(1)} horas
          </div>
          <div class="proyeccion-tendencia">
            <i class="fas fa-arrow-up"></i> Promedio mensual: ${promedioHoras.toFixed(1)} horas
          </div>
        </div>
      `;
      proyeccionHoras.innerHTML = html;
    }

    console.log('📊 Proyecciones generadas');
  } catch (error) {
    console.error('❌ Error generando proyecciones:', error);
  }
}

// Función para eliminar hora
function eliminarHora(horaId) {
  try {
    const hora = gestionPersonal.horas.find((h) => h.id === horaId);
    if (!hora) {
      mostrarNotificacion('❌ Hora no encontrada', 'error');
      return;
    }

    // Mostrar modal de confirmación
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container modal-confirmacion">
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
        </div>
        <div class="modal-body">
          <p>¿Está seguro de que desea eliminar el registro de horas?</p>
          <div class="hora-detalle">
            <strong>Fecha:</strong> ${new Date(hora.fecha).toLocaleDateString('es-CO')}<br>
            <strong>Hora Entrada:</strong> ${hora.horaEntrada}<br>
            <strong>Hora Salida:</strong> ${hora.horaSalida}<br>
            <strong>Observaciones:</strong> ${hora.observaciones || 'Sin observaciones'}
          </div>
          <p class="advertencia">⚠️ Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" onclick="confirmarEliminarHora('${horaId}'); this.closest('.modal-overlay').remove();">
            <i class="fas fa-trash"></i> Eliminar
          </button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    console.log('🗑️ Modal de confirmación para eliminar hora mostrado');
  } catch (error) {
    console.error('❌ Error mostrando modal de confirmación para eliminar hora:', error);
    mostrarNotificacion('❌ Error eliminando hora', 'error');
  }
}

// Función para confirmar eliminación de hora
function confirmarEliminarHora(horaId) {
  try {
    // Eliminar hora del sistema
    gestionPersonal.horas = gestionPersonal.horas.filter((h) => h.id !== horaId);

    // Guardar datos
    gestionPersonal.guardarDatos();

    // Actualizar interfaz
    gestionPersonal.renderizarListaHoras();
    gestionPersonal.actualizarEstadisticas();

    mostrarNotificacion('✅ Hora eliminada correctamente', 'success', 'Hora Eliminada');

    console.log('✅ Hora eliminada:', horaId);
  } catch (error) {
    console.error('❌ Error confirmando eliminación de hora:', error);
    mostrarNotificacion('❌ Error eliminando hora', 'error');
  }
}

// Función para editar hora
function editarHora(horaId) {
  try {
    const hora = gestionPersonal.horas.find((h) => h.id === horaId);
    if (!hora) {
      mostrarNotificacion('❌ Hora no encontrada', 'error');
      return;
    }

    // Llenar el formulario con los datos de la hora
    document.getElementById('empleadoHoras').value = hora.empleadoId || '';
    document.getElementById('fechaHoras').value = hora.fecha || '';
    document.getElementById('horaEntrada').value = hora.horaEntrada || '';
    document.getElementById('horaSalida').value = hora.horaSalida || '';
    document.getElementById('observacionesHoras').value = hora.observaciones || '';

    // Cambiar texto del botón
    const btnGuardar = document.getElementById('btnGuardarHoras');
    btnGuardar.textContent = 'Actualizar Horas';
    btnGuardar.onclick = () => actualizarHora(horaId);

    // Mostrar modal
    mostrarModalRegistroHoras();

    console.log('✏️ Editando hora:', horaId);
  } catch (error) {
    console.error('❌ Error editando hora:', error);
    mostrarNotificacion('❌ Error editando hora', 'error');
  }
}

// Función para actualizar hora
function actualizarHora(horaId) {
  try {
    // Obtener datos del formulario
    const hora = {
      id: horaId,
      empleadoId: document.getElementById('empleadoHoras').value,
      fecha: document.getElementById('fechaHoras').value,
      horaEntrada: document.getElementById('horaEntrada').value,
      horaSalida: document.getElementById('horaSalida').value,
      observaciones: document.getElementById('observacionesHoras').value,
      fechaActualizacion: new Date().toISOString(),
    };

    // Validar datos
    if (!hora.empleadoId || !hora.fecha || !hora.horaEntrada || !hora.horaSalida) {
      mostrarNotificacion('❌ Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    // Actualizar hora en el sistema
    const index = gestionPersonal.horas.findIndex((h) => h.id === horaId);
    if (index !== -1) {
      gestionPersonal.horas[index] = { ...gestionPersonal.horas[index], ...hora };
    }

    // Guardar datos
    gestionPersonal.guardarDatos();

    // Actualizar interfaz
    gestionPersonal.renderizarListaHoras();
    gestionPersonal.actualizarEstadisticas();

    mostrarNotificacion('✅ Hora actualizada correctamente', 'success', 'Hora Actualizada');

    // Cerrar modal
    cerrarModalRegistroHoras();

    console.log('✅ Hora actualizada:', horaId);
  } catch (error) {
    console.error('❌ Error actualizando hora:', error);
    mostrarNotificacion('❌ Error actualizando hora', 'error');
  }
}

// Función para editar departamento
function editarDepartamento(departamentoId) {
  try {
    const departamento = gestionPersonal.departamentos.find((dep) => dep.id === departamentoId);
    if (!departamento) {
      mostrarNotificacion('❌ Departamento no encontrado', 'error');
      return;
    }

    // Llenar el formulario con los datos del departamento
    document.getElementById('nombreDepartamento').value = departamento.nombre || '';
    document.getElementById('descripcionDepartamento').value = departamento.descripcion || '';

    // Cambiar texto del botón
    const btnGuardar = document.getElementById('btnGuardarDepartamento');
    btnGuardar.textContent = 'Actualizar Departamento';
    btnGuardar.onclick = () => actualizarDepartamento(departamentoId);

    // Mostrar modal
    mostrarModalDepartamento();

    console.log('✏️ Editando departamento:', departamentoId);
  } catch (error) {
    console.error('❌ Error editando departamento:', error);
    mostrarNotificacion('❌ Error editando departamento', 'error');
  }
}

// Función para actualizar departamento
function actualizarDepartamento(departamentoId) {
  try {
    // Obtener datos del formulario
    const departamento = {
      id: departamentoId,
      nombre: document.getElementById('nombreDepartamento').value.trim(),
      descripcion: document.getElementById('descripcionDepartamento').value.trim(),
      color: document.getElementById('colorDepartamento').value || '#3498db',
      fechaActualizacion: new Date().toISOString(),
    };

    // Validar datos
    if (!departamento.nombre) {
      mostrarNotificacion('❌ Por favor ingresa el nombre del departamento', 'error');
      return;
    }

    // Verificar si el nombre ya existe (excluyendo el departamento actual)
    const nombreExistente = gestionPersonal.departamentos.find(
      (dep) => dep.nombre === departamento.nombre && dep.id !== departamentoId
    );
    if (nombreExistente) {
      mostrarNotificacion('❌ Ya existe un departamento con este nombre', 'error');
      return;
    }

    // Actualizar departamento en el sistema
    const index = gestionPersonal.departamentos.findIndex((dep) => dep.id === departamentoId);
    if (index !== -1) {
      gestionPersonal.departamentos[index] = { ...gestionPersonal.departamentos[index], ...departamento };
    }

    // Guardar datos
    gestionPersonal.guardarDatos();

    // Actualizar interfaz
    gestionPersonal.renderizarListaDepartamentos();
    gestionPersonal.llenarSelectorDepartamentos();
    gestionPersonal.actualizarEstadisticas();

    mostrarNotificacion('✅ Departamento actualizado correctamente', 'success', 'Departamento Actualizado');

    // Cerrar modal
    cerrarModalDepartamento();

    console.log('✅ Departamento actualizado:', departamentoId);
  } catch (error) {
    console.error('❌ Error actualizando departamento:', error);
    mostrarNotificacion('❌ Error actualizando departamento', 'error');
  }
}
