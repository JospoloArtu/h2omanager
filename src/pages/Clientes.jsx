import { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { clientesService } from "../services/dataService";
import "../styles/Clientes.css";

const Clientes = () => {
  // Estados principales
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit' | 'view'
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Estados de paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos"); // 'todos' | 'activo' | 'inactivo'
  const [filterTipo, setFilterTipo] = useState("todos"); // 'todos' | 'residencial' | 'comercial'

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    direccion: "",
    email: "",
    tipo: "residencial",
    estado: "activo",
    saldo: 0,
    notas: "",
  });

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Función para obtener clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getAll();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      toast.error("Error al cargar los clientes");
      // Datos mock para desarrollo
      setClientes(getMockClientes());
    } finally {
      setLoading(false);
    }
  };

  // Función para generar color de avatar basado en el nombre
  const getAvatarColor = (nombre) => {
    const colors = [
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#f97316', // orange
      '#14b8a6', // teal
      '#ec4899', // pink
    ]
    const index = nombre.charCodeAt(0) % colors.length
    return colors[index]
  }

  // Función para obtener iniciales del nombre
  const getInitials = (nombre) => {
    const words = nombre.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return nombre.substring(0, 2).toUpperCase()
  }

  // Datos mock temporales
  const getMockClientes = () => [
    { id: 1, nombre: 'Juan Pérez', cedula: '101202345', telefono: '0412-1234567', direccion: 'Av. principal #123.', email: 'juan.perez@gmail.com', tipo: 'residencial', estado: 'activo', saldo: 15.00, fechaRegistro: '2024-01-15' },
    { id: 2, nombre: 'María García', cedula: '201554100', telefono: '0424-9876543', direccion: 'Calle 10 #45', email: 'MariaG@gmail.com', tipo: 'comercial', estado: 'moroso', saldo: -120.50, fechaRegistro: '2024-01-20' },
    { id: 3, nombre: 'Carlos López', cedula: '105889023', telefono: '0212-5551234', direccion: 'Zona Industrial #78', email: 'Carloslopez@gmail.com', tipo: 'residencial', estado: 'activo', saldo: 0.00, fechaRegistro: '2024-02-01' },
    { id: 4, nombre: 'Ana Victoria', cedula: '402111088', telefono: '0414-7778889', direccion: 'Centro Metropolitano Javier', email: 'Anita@gmail.com', tipo: 'comercial', estado: 'activo', saldo: 45.00, fechaRegistro: '2024-01-10' },
    { id: 5, nombre: 'Carlos Rodriguez', cedula: '101505099', telefono: '0212-9993333', direccion: 'Calle 8va, San Francisco', email: 'crodriguez@gmail.com', tipo: 'residencial', estado: 'inactivo', saldo: 22.00, fechaRegistro: '2024-02-10' },
  ];

  // Filtrar clientes
  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado =
      filterEstado === "todos" || cliente.estado === filterEstado;
    const matchesTipo = filterTipo === "todos" || cliente.tipo === filterTipo;

    return matchesSearch && matchesEstado && matchesTipo;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = filteredClientes.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

  // Handlers del modal
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      nombre: "",
      cedula: "",
      telefono: "",
      direccion: "",
      email: "",
      tipo: "residencial",
      estado: "activo",
      saldo: 0,
      notas: "",
    });
    setShowModal(true);
  };

  const openEditModal = (cliente) => {
    setModalMode('edit')
    setSelectedCliente(cliente)
    setFormData({
      nombre: cliente.nombre,
      cedula: cliente.cedula,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      email: cliente.email,
      tipo: cliente.tipo,
      estado: cliente.estado,
      saldo: cliente.saldo || 0,
      notas: cliente.notas || ''
    })
    setShowModal(true)
  };

  const openViewModal = (cliente) => {
    setModalMode("view");
    setSelectedCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      cedula: cliente.cedula,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      email: cliente.email,
      tipo: cliente.tipo,
      estado: cliente.estado,
      saldo: cliente.saldo || 0,
      notas: cliente.notas || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
  };

  // Handler del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'cedula') {
      finalValue = value.replace(/\D/g, '').slice(0, 9);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    if (!formData.telefono.trim()) {
      toast.error("El teléfono es requerido");
      return;
    }

    try {
      if (modalMode === "create") {
        await clientesService.create(formData);
        toast.success("Cliente creado exitosamente");
      } else if (modalMode === "edit") {
        await clientesService.update(selectedCliente.id, formData);
        toast.success("Cliente actualizado exitosamente");
      }

      closeModal();
      fetchClientes();
    } catch (error) {
      console.warn("API no disponible, procesando en modo offline:", error.message);
      
      // Simulación para desarrollo (Mock)
      if (modalMode === "create") {
        const newCliente = {
          id: Date.now(), // ID temporal
          ...formData,
          fechaRegistro: new Date().toISOString().split("T")[0],
        };
        setClientes([newCliente, ...clientes]);
        toast.success("Cliente creado (Modo Offline)");
      } else {
        setClientes(
          clientes.map((c) =>
            c.id === selectedCliente.id ? { ...c, ...formData } : c,
          ),
        );
        toast.success("Cliente actualizado (Modo Offline)");
      }
      closeModal();
    }
  };

  // Eliminar cliente
  const handleDelete = async (cliente) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar al cliente "${cliente.nombre}"?`,
      )
    ) {
      return;
    }

    try {
      await clientesService.delete(cliente.id);
      toast.success("Cliente eliminado exitosamente");
      fetchClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      toast.error("Error al eliminar el cliente");

      // Simulación para desarrollo
      setClientes(clientes.filter((c) => c.id !== cliente.id));
      toast.success("Cliente eliminado exitosamente (mock)");
    }
  };

  return (
    <div className="clientes-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Gestión de Clientes</h1>
          <p className="subtitle">Administra tu cartera de clientes</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <FiPlus /> Agregar Cliente
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="filters-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los tipos</option>
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="5">5 por página</option>
            <option value="10">10 por página</option>
            <option value="25">25 por página</option>
            <option value="50">50 por página</option>
          </select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-label">Total Clientes</span>
          <span className="stat-value">{filteredClientes.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Activos</span>
          <span className="stat-value">
            {filteredClientes.filter((c) => c.estado === "activo").length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Residenciales</span>
          <span className="stat-value">
            {filteredClientes.filter((c) => c.tipo === "residencial").length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Comerciales</span>
          <span className="stat-value">
            {filteredClientes.filter((c) => c.tipo === "comercial").length}
          </span>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">Cargando clientes...</div>
        ) : currentClientes.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron clientes</p>
          </div>
        ) : (
          <table className="clientes-table">
            <thead>
              <tr>
                <th>CLIENTE</th>
                <th>CÉDULA</th>
                <th>DIRECCIÓN</th>
                <th>TIPO</th>
                <th>SALDO ($)</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {currentClientes.map((cliente) => (
                <tr 
                  key={cliente.id}
                  onClick={() => openViewModal(cliente)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="cliente-cell">
                      <div 
                        className="cliente-avatar"
                        style={{ backgroundColor: getAvatarColor(cliente.nombre) }}
                      >
                        {getInitials(cliente.nombre)}
                      </div>
                      <div className="cliente-info">
                        <div className="cliente-name">{cliente.nombre}</div>
                        <div className="cliente-email">{cliente.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="cedula-cell">{cliente.cedula}</td>
                  <td className="direccion-cell">{cliente.direccion}</td>
                  <td>
                    <span className={`badge badge-${cliente.tipo}`}>
                      {cliente.tipo === 'residencial' ? 'Residencial' : 'Comercial'}
                    </span>
                  </td>
                  <td>
                    <span className={`saldo ${cliente.saldo < 0 ? 'negativo' : 'positivo'}`}>
                      ${Math.abs(cliente.saldo).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-estado badge-${cliente.estado}`}>
                      {cliente.estado === 'activo' ? 'Activo' : cliente.estado === 'moroso' ? 'Moroso' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Mostrando 1 a {Math.min(itemsPerPage, filteredClientes.length)} de {filteredClientes.length} resultados
          </div>
          
          <div className="pagination-controls">
            <button
              className="pagination-btn pagination-arrow"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNumber
              if (totalPages <= 7) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 6 + i
              } else {
                pageNumber = currentPage - 3 + i
              }
              
              return (
                <button
                  key={pageNumber}
                  className={`pagination-btn pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            })}
            
            {totalPages > 7 && (
              <>
                <span className="pagination-ellipsis">...</span>
                <button
                  className="pagination-btn pagination-number"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              className="pagination-btn pagination-arrow"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === "create" && "Nuevo Cliente"}
                {modalMode === "edit" && "Editar Cliente"}
                {modalMode === "view" && "Detalles del Cliente"}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cedula">Cédula</label>
                    <input
                      type="text"
                      id="cedula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      placeholder="Ej: 20123456"
                      maxLength="9"
                      disabled={modalMode === "view"}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono *</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="0412-1234567"
                      disabled={modalMode === "view"}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="cliente@ejemplo.com"
                      disabled={modalMode === "view"}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="direccion">Dirección</label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Av. Principal #123, Caracas"
                      disabled={modalMode === "view"}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tipo">Tipo de Cliente</label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                    >
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="notas">Notas</label>
                    <textarea
                      id="notas"
                      name="notas"
                      value={formData.notas}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Información adicional..."
                      disabled={modalMode === "view"}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  {modalMode === "view" ? "Cerrar" : "Cancelar"}
                </button>
                {modalMode !== "view" && (
                  <button type="submit" className="btn-primary">
                    {modalMode === "create"
                      ? "Crear Cliente"
                      : "Guardar Cambios"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
