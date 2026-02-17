import api from './api'

// Servicio de Clientes
const clientesService = {
  // Obtener todos los clientes
  getAll: async () => {
    return api.get('/clientes')
  },

  // Obtener cliente por ID
  getById: async (id) => {
    return api.get(`/clientes/${id}`)
  },

  // Crear nuevo cliente
  create: async (clienteData) => {
    return api.post('/clientes', clienteData)
  },

  // Actualizar cliente
  update: async (id, clienteData) => {
    return api.put(`/clientes/${id}`, clienteData)
  },

  // Eliminar cliente
  delete: async (id) => {
    return api.delete(`/clientes/${id}`)
  },

  // Buscar clientes
  search: async (query) => {
    return api.get(`/clientes/search?q=${encodeURIComponent(query)}`)
  },
}

// Servicio de Botellones
const botoellonesService = {
  // Obtener inventario
  getInventario: async () => {
    return api.get('/botellones')
  },

  // Obtener botellón por ID
  getById: async (id) => {
    return api.get(`/botellones/${id}`)
  },

  // Registrar botellones
  registrar: async (cantidad, tipo) => {
    return api.post('/botellones', { cantidad, tipo })
  },

  // Actualizar stock
  updateStock: async (id, cantidad) => {
    return api.put(`/botellones/${id}`, { cantidad })
  },

  // Obtener estadísticas
  getEstadisticas: async () => {
    return api.get('/botellones/estadisticas')
  },
}

// Servicio de Entregas
const entregasService = {
  // Obtener todas las entregas
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/entregas${queryParams ? `?${queryParams}` : ''}`)
  },

  // Obtener entrega por ID
  getById: async (id) => {
    return api.get(`/entregas/${id}`)
  },

  // Crear nueva entrega
  create: async (entregaData) => {
    return api.post('/entregas', entregaData)
  },

  // Actualizar estado de entrega
  updateEstado: async (id, estado) => {
    return api.put(`/entregas/${id}/estado`, { estado })
  },

  // Obtener entregas del día
  getEntregasHoy: async () => {
    return api.get('/entregas/hoy')
  },

  // Obtener entregas pendientes
  getPendientes: async () => {
    return api.get('/entregas/pendientes')
  },
}

// Servicio de Rutas
const rutasService = {
  // Obtener todas las rutas
  getAll: async () => {
    return api.get('/rutas')
  },

  // Obtener ruta por ID
  getById: async (id) => {
    return api.get(`/rutas/${id}`)
  },

  // Crear nueva ruta
  create: async (rutaData) => {
    return api.post('/rutas', rutaData)
  },

  // Actualizar ruta
  update: async (id, rutaData) => {
    return api.put(`/rutas/${id}`, rutaData)
  },

  // Eliminar ruta
  delete: async (id) => {
    return api.delete(`/rutas/${id}`)
  },
}

// Servicio de Ventas
const ventasService = {
  // Obtener todas las ventas
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/ventas${queryParams ? `?${queryParams}` : ''}`)
  },

  // Obtener venta por ID
  getById: async (id) => {
    return api.get(`/ventas/${id}`)
  },

  // Crear nueva venta
  create: async (ventaData) => {
    return api.post('/ventas', ventaData)
  },

  // Actualizar venta
  update: async (id, ventaData) => {
    return api.put(`/ventas/${id}`, ventaData)
  },

  // Eliminar venta
  delete: async (id) => {
    return api.delete(`/ventas/${id}`)
  },

  // Obtener ventas del día
  getVentasHoy: async () => {
    return api.get('/ventas/hoy')
  },

  // Obtener ventas por cliente
  getByCliente: async (clienteId) => {
    return api.get(`/ventas/cliente/${clienteId}`)
  },

  // Obtener ventas por rango de fechas
  getByRangoFechas: async (fechaInicio, fechaFin) => {
    return api.get(`/ventas/rango?inicio=${fechaInicio}&fin=${fechaFin}`)
  },

  // Obtener estadísticas de ventas
  getEstadisticas: async (periodo = 'mes') => {
    return api.get(`/ventas/estadisticas?periodo=${periodo}`)
  },
}

// Servicio del Dashboard
const dashboardService = {
  // Obtener estadísticas del dashboard
  getStats: async () => {
    return api.get('/dashboard/stats')
  },

  // Obtener entregas recientes
  getEntregasRecientes: async (limit = 5) => {
    return api.get(`/dashboard/entregas-recientes?limit=${limit}`)
  },
}

export {
  clientesService,
  botoellonesService,
  entregasService,
  rutasService,
  ventasService,
  dashboardService,
}
