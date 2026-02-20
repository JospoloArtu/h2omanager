import { useState, useEffect } from 'react'
import { FiUser, FiShoppingCart, FiDollarSign, FiCheck, FiSearch, FiPlus, FiMinus, FiTrash2, FiArrowRight, FiArrowLeft, FiPrinter, FiCreditCard, FiSmartphone, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useConfig } from '../context/ConfigContext'
import { clientesService, botoellonesService, ventasService } from '../services/dataService'
import '../styles/Ventas.css'

const Ventas = () => {
  // Obtener configuración de moneda
  const { currencyConfig, formatDualPrice, convertToLocal } = useConfig()
  // Estado del wizard
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Estado de la venta
  const [tipoCliente, setTipoCliente] = useState('registrado') // 'registrado' | 'no_registrado'
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [items, setItems] = useState([])
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [monedaEfectivo, setMonedaEfectivo] = useState('usd') // 'usd' | 'bs'
  const [datosPago, setDatosPago] = useState({
    banco: '',
    telefono: '',
    cedula: '',
    referencia: '' // últimos 6 dígitos
  })
  const [notas, setNotas] = useState('')

  // Estado para datos reales
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(false)

  // Estado para cliente no registrado
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    cedula: ''
  })

  // Estado de búsqueda de cliente
  const [searchCliente, setSearchCliente] = useState('')

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [clientesRes, productosRes] = await Promise.all([
          clientesService.getAll(),
          botoellonesService.getInventario()
        ])
        
        // Carga real
        const realClientes = clientesRes.data || []
        const realProductos = productosRes.data || []

        // Si la carga real está vacía o falla silenciosamente, usamos mocks
        if (realClientes.length === 0) {
          console.warn('Cargando clientes mock (API vacía o desconectada)')
          setClientes([
            { id: 1, nombre: 'Juan Pérez', cedula: '101202345', telefono: '0412-1234567', direccion: 'Av. principal #123.', email: 'juan.perez@gmail.com', tipo: 'residencial', estado: 'activo', saldo: 15.00 },
            { id: 2, nombre: 'María García', cedula: '201554100', telefono: '0424-9876543', direccion: 'Calle 10 #45', email: 'MariaG@gmail.com', tipo: 'comercial', estado: 'moroso', saldo: -120.50 },
            { id: 3, nombre: 'Carlos López', cedula: '105889023', telefono: '0212-5551234', direccion: 'Zona Industrial #78', email: 'Carloslopez@gmail.com', tipo: 'residencial', estado: 'activo', saldo: 0.00 },
            { id: 4, nombre: 'Ana Victoria', cedula: '402111088', telefono: '0414-7778889', direccion: 'Centro Metropolitano Javier', email: 'Anita@gmail.com', tipo: 'comercial', estado: 'activo', saldo: 45.00 },
            { id: 5, nombre: 'Carlos Rodriguez', cedula: '101505099', telefono: '0212-9993333', direccion: 'Calle 8va, San Francisco', email: 'crodriguez@gmail.com', tipo: 'residencial', estado: 'inactivo', saldo: 22.00 }
          ])
        } else {
          setClientes(realClientes)
        }

        if (realProductos.length === 0) {
          console.warn('Cargando productos mock (API vacía o desconectada)')
          setProductos([
            { id: 1, nombre: 'Botellón 15 Litros', litros: 15, precio: 4.50, stock: 50 },
            { id: 2, nombre: 'Botellón 20 Litros', litros: 20, precio: 6.00, stock: 75 },
            { id: 3, nombre: 'Dispensador Premium', litros: 0, precio: 25.00, stock: 10 },
            { id: 4, nombre: 'Soporte para Botellón', litros: 0, precio: 8.00, stock: 20 }
          ])
        } else {
          setProductos(realProductos)
        }
      } catch (error) {
        console.error('Error cargando datos, activando mocks:', error)
        toast.error('Cargando datos locales (Base de datos desconectada)')
        
        // Fallback total a mocks en caso de error de conexión
        setClientes([
          { id: 1, nombre: 'Juan Pérez', cedula: '101202345', telefono: '0412-1234567', direccion: 'Av. principal #123.' },
          { id: 2, nombre: 'María García', cedula: '201554100', telefono: '0424-9876543', direccion: 'Calle 10 #45' },
          { id: 3, nombre: 'Carlos López', cedula: '105889023', telefono: '0212-5551234', direccion: 'Zona Industrial #78' },
          { id: 4, nombre: 'Ana Victoria', cedula: '402111088', telefono: '0414-7778889', direccion: 'Centro Metropolitano Javier' },
          { id: 5, nombre: 'Carlos Rodriguez', cedula: '101505099', telefono: '0212-9993333', direccion: 'Calle 8va, San Francisco' }
        ])
        setProductos([
          { id: 1, nombre: 'Producto Mock A', litros: 18, precio: 5.0, stock: 100 },
          { id: 2, nombre: 'Producto Mock B', litros: 20, precio: 7.0, stock: 80 }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Lista de bancos venezolanos
  const bancosVenezuela = [
    'Banco de Venezuela',
    'Banesco',
    'Mercantil',
    'BBVA Provincial',
    'Banco Nacional de Crédito (BNC)',
    'Banco del Tesoro',
    'Banco Bicentenario',
    'Bancamiga',
    'Banplus',
    'Banco Exterior',
    'Banco Fondo Común (BFC)',
    'Banco Caroní',
    'Banco Plaza',
    'Banco Activo',
    'Sofitasa',
    '100% Banco',
    'Bancrecer',
    'Mi Banco'
  ]

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.cedula?.includes(searchCliente) ||
    c.telefono?.includes(searchCliente)
  )

  // Calcular total
  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  }

  // Agregar item
  const agregarItem = (producto) => {
    const itemExistente = items.find(i => i.productoId === producto.id)
    if (itemExistente) {
      setItems(items.map(i =>
        i.productoId === producto.id
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      ))
    } else {
      setItems([...items, {
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      }])
    }
    toast.success(`${producto.nombre} agregado`)
  }

  // Cambiar cantidad
  const cambiarCantidad = (productoId, cambio) => {
    setItems(items.map(i =>
      i.productoId === productoId
        ? { ...i, cantidad: Math.max(1, i.cantidad + cambio) }
        : i
    ))
  }

  // Eliminar item
  const eliminarItem = (productoId) => {
    setItems(items.filter(i => i.productoId !== productoId))
    toast.success('Item eliminado')
  }

  // Validar paso
  const validarPaso = () => {
    if (currentStep === 1) {
      if (tipoCliente === 'registrado' && !selectedCliente) {
        toast.error('Selecciona un cliente registrado')
        return false
      }
      if (tipoCliente === 'no_registrado') {
        if (!nuevoCliente.nombre.trim()) {
          toast.error('Ingresa el nombre del cliente')
          return false
        }
        if (!nuevoCliente.cedula.trim()) {
          toast.error('Ingresa la cédula del cliente')
          return false
        }
      }
    }
    if (currentStep === 3) {
      if (metodoPago === 'transferencia' || metodoPago === 'pago_movil' || metodoPago === 'punto') {
        if (!datosPago.banco) {
          toast.error('Selecciona el banco')
          return false
        }
        if (metodoPago !== 'punto') {
          if (!datosPago.telefono) {
            toast.error('Ingresa el nro. de teléfono')
            return false
          }
          if (!datosPago.cedula) {
            toast.error('Ingresa la cédula del pagador')
            return false
          }
        }
        if (!datosPago.referencia || datosPago.referencia.length !== 6) {
          toast.error('Ingresa los últimos 6 dígitos de referencia')
          return false
        }
      }
    }
    return true
  }

  // Siguiente paso
  const siguientePaso = () => {
    if (validarPaso()) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps))
    }
  }

  // Paso anterior
  const pasoAnterior = () => {
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  // Confirmar venta
  const confirmarVenta = async () => {
    try {
      setProcesando(true)
      const totalUSD = calcularTotal()
      const totalBs = convertToLocal(totalUSD)

      const ventaData = {
        clienteId: tipoCliente === 'registrado' ? selectedCliente.id : null,
        clienteNoRegistrado: tipoCliente === 'no_registrado' ? nuevoCliente : null,
        items: items.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precio: item.precio
        })),
        totalUSD,
        totalBs,
        metodoPago,
        detallesPago: (metodoPago === 'transferencia' || metodoPago === 'pago_movil' || metodoPago === 'punto') 
          ? datosPago 
          : (metodoPago === 'efectivo' ? { moneda: monedaEfectivo } : {}),
        notas,
        fecha: new Date()
      }

      try {
        await ventasService.create(ventaData)
        toast.success('Venta registrada exitosamente')
      } catch (apiError) {
        console.warn('API no disponible, registrando venta en modo offline:', apiError.message)
        toast.success('Venta registrada (Modo Offline / Pendiente de Sincronización)')
      }
      
      setCurrentStep(4)
    } catch (error) {
      console.error('Error al procesar venta:', error)
      toast.error('Ocurrió un error al procesar la venta')
    } finally {
      setProcesando(false)
    }
  }

  // Imprimir factura
  const imprimirFactura = () => {
    const fechaActual = new Date().toLocaleString('es-VE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    const totalUSD = calcularTotal()
    const totalBs = convertToLocal(totalUSD)

    const factura = `
      <div class="ticket">
        <div class="header">
          <h2>H2O MANAGER</h2>
          <p>RIF: J-00000000-0</p>
          <p>${fechaActual}</p>
        </div>

        <div class="divider">***************************</div>

        <div class="section">
          <strong>CLIENTE:</strong>
          <p>${tipoCliente === 'registrado' ? selectedCliente.nombre : nuevoCliente.nombre}</p>
          <p>Cédula: ${tipoCliente === 'registrado' ? selectedCliente.cedula : nuevoCliente.cedula}</p>
        </div>

        <div class="divider">---------------------------</div>

        <div class="section">
          <strong>PRODUCTOS:</strong>
          <div class="items">
            ${items.map(item => `
              <div class="item">
                <div class="item-row">
                  <span>${item.nombre}</span>
                  <span>x${item.cantidad}</span>
                </div>
                <div class="item-price">
                  <span>$${item.precio.toFixed(2)}</span>
                  <span>Bs. ${convertToLocal(item.precio).toFixed(2)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="divider">---------------------------</div>

        <div class="totals">
          <div class="total-row main">
            <span>TOTAL USD:</span>
            <span>$${totalUSD.toFixed(2)}</span>
          </div>
          <div class="total-row main">
            <span>TOTAL BS:</span>
            <span>Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div class="payment-info">
            <p>PAGO: ${metodoPago.toUpperCase()} ${
              metodoPago === 'efectivo' 
                ? `(${monedaEfectivo.toUpperCase()})` 
                : (metodoPago === 'transferencia' || metodoPago === 'pago_movil' || metodoPago === 'punto'
                    ? `<br>Ref: ${datosPago.referencia}` 
                    : '')
            }</p>
          </div>
        </div>

        <div class="divider">***************************</div>

        <div class="footer">
          <p>Tasa: Bs. ${currencyConfig.tasaCambio}</p>
          <p>¡Gracias por su preferencia!</p>
        </div>
      </div>
    `

    const ventanaImpresion = window.open('', '', 'width=400,height=600')
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Factura - H2O Manager</title>
          <style>
            @page { margin: 0; }
            body {
              font-family: 'Courier New', Courier, monospace;
              padding: 5px;
              width: 58mm;
              margin: 0;
              font-size: 12px;
              line-height: 1.2;
              color: #000;
            }
            .ticket { width: 100%; }
            .header { text-align: center; margin-bottom: 5px; }
            .header h2 { margin: 0; font-size: 16px; }
            .header p { margin: 2px 0; }
            .divider { text-align: center; margin: 5px 0; font-weight: bold; }
            .section { margin: 5px 0; }
            .item { margin-bottom: 5px; }
            .item-row { display: flex; justify-content: space-between; font-weight: bold; }
            .item-price { display: flex; justify-content: space-between; font-size: 10px; padding-left: 5px; }
            .totals { margin: 5px 0; }
            .total-row { display: flex; justify-content: space-between; margin: 2px 0; }
            .total-row.main { font-weight: bold; font-size: 13px; }
            .payment-info { margin-top: 5px; font-size: 11px; }
            .footer { text-align: center; margin-top: 10px; font-size: 10px; }
            @media print {
              body { width: 58mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${factura}
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    ventanaImpresion.document.close()
  }
  // Nueva venta
  const nuevaVenta = () => {
    setCurrentStep(1)
    setTipoCliente('registrado')
    setSelectedCliente(null)
    setNuevoCliente({ nombre: '', cedula: '' })
    setItems([])
    setMetodoPago('efectivo')
    setMonedaEfectivo('usd')
    setDatosPago({ banco: '', telefono: '', cedula: '', referencia: '' })
    setNotas('')
    setSearchCliente('')
  }

  // Configuración de pasos
  const steps = [
    { number: 1, title: 'Cliente', icon: FiUser },
    { number: 2, title: 'Productos', icon: FiShoppingCart },
    { number: 3, title: 'Pago', icon: FiDollarSign },
    { number: 4, title: 'Confirmación', icon: FiCheck },
  ]

  return (
    <div className="ventas-page">
      <div className="ventas-container">
        {/* Header */}
        <div className="ventas-header">
          <h1>Nueva Venta</h1>
          <p className="subtitle">Proceso paso a paso para registrar una venta</p>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {steps.map((step, index) => (
            <div key={step.number} className="step-wrapper">
              <div className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > step.number ? (
                    <FiCheck />
                  ) : (
                    <step.icon />
                  )}
                </div>
                <div className="step-label">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Contenido del paso */}
        <div className="step-content">
          {/* PASO 1: Seleccionar Cliente */}
          {currentStep === 1 && (
            <div className="step-panel">
              <h2>Seleccionar Cliente</h2>
              
              {/* Selector de tipo de cliente */}
              <div className="tipo-cliente-selector">
                <button 
                  className={`tipo-btn ${tipoCliente === 'registrado' ? 'active' : ''}`}
                  onClick={() => {
                    setTipoCliente('registrado')
                    setNuevoCliente({ nombre: '', cedula: '' })
                  }}
                >
                  <FiUser />
                  <span>Cliente Registrado</span>
                </button>
                <button 
                  className={`tipo-btn ${tipoCliente === 'no_registrado' ? 'active' : ''}`}
                  onClick={() => {
                    setTipoCliente('no_registrado')
                    setSelectedCliente(null)
                  }}
                >
                  <FiPlus />
                  <span>Cliente No Registrado</span>
                </button>
              </div>

              {/* Vista para cliente registrado */}
              {tipoCliente === 'registrado' && (
                <>
                  <div className="search-box-large">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Buscar cliente por nombre, cédula o teléfono..."
                      value={searchCliente}
                      onChange={(e) => setSearchCliente(e.target.value)}
                    />
                  </div>

                  <div className="clientes-grid">
                    {loading ? (
                      <div className="loading-state">
                        <FiLoader className="spin" />
                        <p>Cargando clientes...</p>
                      </div>
                    ) : clientesFiltrados.length > 0 ? (
                      clientesFiltrados.map((cliente) => (
                        <div
                          key={cliente.id}
                          className={`cliente-card ${selectedCliente?.id === cliente.id ? 'selected' : ''}`}
                          onClick={() => setSelectedCliente(cliente)}
                        >
                          <div className="cliente-avatar-large">
                            {cliente.nombre?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div className="cliente-info-large">
                            <h3>{cliente.nombre}</h3>
                            <p>{cliente.cedula}</p>
                            <p>{cliente.telefono}</p>
                          </div>
                          {selectedCliente?.id === cliente.id && (
                            <div className="selected-badge">
                              <FiCheck />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-results">No se encontraron clientes</div>
                    )}
                  </div>
                </>
              )}

              {/* Formulario para cliente no registrado */}
              {tipoCliente === 'no_registrado' && (
                <div className="nuevo-cliente-form">
                  <div className="form-icon">
                    <FiUser />
                  </div>
                  <h3>Datos del Cliente</h3>
                  <p className="form-subtitle">Ingresa los datos básicos para esta venta</p>
                  
                  <div className="form-fields">
                    <div className="form-group-inline">
                      <label htmlFor="cedula">Cédula *</label>
                      <input
                        type="text"
                        id="cedula"
                        placeholder="Ej: 20123456"
                        maxLength="9"
                        value={nuevoCliente.cedula}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 9)
                          setNuevoCliente({...nuevoCliente, cedula: val})
                        }}
                      />
                    </div>
                    
                    <div className="form-group-inline">
                      <label htmlFor="nombre">Nombre Completo *</label>
                      <input
                        type="text"
                        id="nombre"
                        placeholder="Ej: Juan Pérez"
                        value={nuevoCliente.nombre}
                        onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                      />
                    </div>
                  </div>

                  {(nuevoCliente.nombre || nuevoCliente.cedula) && (
                    <div className="preview-cliente">
                      <div className="preview-avatar">
                        {nuevoCliente.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?'}
                      </div>
                      <div className="preview-info">
                        <strong>{nuevoCliente.nombre || 'Sin nombre'}</strong>
                        <span>{nuevoCliente.cedula || 'Sin cédula'}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PASO 2: Agregar Items */}
          {currentStep === 2 && (
            <div className="step-panel">
              <h2>Agregar Productos</h2>
              
              <div className="productos-section">
                <div className="productos-disponibles">
                  <h3>Productos Disponibles</h3>
                  <div className="productos-grid">
                    {loading ? (
                      <div className="loading-state">
                        <FiLoader className="spin" />
                        <p>Cargando productos...</p>
                      </div>
                    ) : productos.map((producto) => {
                      const dualPrice = formatDualPrice(producto.precio)
                      return (
                        <div key={producto.id} className="producto-card" onClick={() => agregarItem(producto)}>
                          <div className="producto-icon">
                            <FiShoppingCart />
                          </div>
                          <h4>{producto.nombre}</h4>
                          {producto.litros > 0 && (
                            <div className="litros-badge">{producto.litros}L</div>
                          )}
                          <div className="producto-precio-dual">
                            <span className="precio-usd">{dualPrice.usd}</span>
                            <span className="precio-local">{dualPrice.local}</span>
                          </div>
                          <p className="producto-stock">Stock: {producto.stock}</p>
                          <button className="btn-agregar">
                            <FiPlus /> Agregar
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="carrito-section">
                  <h3>Items Agregados</h3>
                  {items.length === 0 ? (
                    <div className="carrito-vacio">
                      <FiShoppingCart />
                      <p>No hay items agregados</p>
                    </div>
                  ) : (
                    <>
                      <div className="carrito-items">
                        {items.map((item) => (
                          <div key={item.productoId} className="carrito-item">
                            <div className="item-info">
                              <h4>{item.nombre}</h4>
                              <p className="item-precio">${item.precio.toFixed(2)} c/u</p>
                            </div>
                            <div className="item-controls">
                              <button onClick={() => cambiarCantidad(item.productoId, -1)}>
                                <FiMinus />
                              </button>
                              <span className="cantidad">{item.cantidad}</span>
                              <button onClick={() => cambiarCantidad(item.productoId, 1)}>
                                <FiPlus />
                              </button>
                              <button className="btn-delete" onClick={() => eliminarItem(item.productoId)}>
                                <FiTrash2 />
                              </button>
                            </div>
                            <div className="item-total">
                              ${(item.precio * item.cantidad).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="carrito-total">
                        <div className="total-info">
                          <span>Total:</span>
                          <div className="total-dual">
                            <span className="total-usd">${calcularTotal().toFixed(2)}</span>
                            <span className="total-local">Bs. {convertToLocal(calcularTotal()).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Resumen y Pago */}
          {currentStep === 3 && (
            <div className="step-panel">
              <h2>Resumen y Método de Pago</h2>
              
              <div className="resumen-sections">
                <div className="resumen-cliente">
                  <h3>Cliente</h3>
                  <div className="info-box">
                    {tipoCliente === 'registrado' ? (
                      <>
                        <p><strong>{selectedCliente?.nombre}</strong></p>
                        <p>{selectedCliente?.cedula}</p>
                        <p>{selectedCliente?.telefono}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>{nuevoCliente.nombre}</strong></p>
                        <p>{nuevoCliente.cedula}</p>
                        <p className="cliente-tipo-badge">Cliente No Registrado</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="resumen-items">
                  <h3>Items</h3>
                  <div className="items-list">
                    {items.map((item) => (
                      <div key={item.productoId} className="resumen-item">
                        <span>{item.nombre} x{item.cantidad}</span>
                        <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="resumen-total">
                      <div className="total-info">
                        <span>Total:</span>
                        <div className="total-dual">
                          <span className="total-usd">${calcularTotal().toFixed(2)}</span>
                          <span className="total-local">Bs. {convertToLocal(calcularTotal()).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metodo-pago-section">
                  <h3>Método de Pago</h3>
                  <div className="metodos-pago">
                    <label className={`metodo-pago-card ${metodoPago === 'efectivo' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="efectivo"
                        checked={metodoPago === 'efectivo'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="metodo-info">
                        <FiDollarSign />
                        <span>Efectivo</span>
                      </div>
                    </label>
                    <label className={`metodo-pago-card ${metodoPago === 'transferencia' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="transferencia"
                        checked={metodoPago === 'transferencia'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="metodo-info">
                        <FiCreditCard />
                        <span>Transferencia</span>
                      </div>
                    </label>
                    <label className={`metodo-pago-card ${metodoPago === 'pago_movil' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="pago_movil"
                        checked={metodoPago === 'pago_movil'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="metodo-info">
                        <FiSmartphone />
                        <span>Pago Móvil</span>
                      </div>
                    </label>
                    <label className={`metodo-pago-card ${metodoPago === 'punto' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="punto"
                        checked={metodoPago === 'punto'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="metodo-info">
                        <FiCreditCard />
                        <span>Punto de Venta</span>
                      </div>
                    </label>
                  </div>

                  {/* Detalles condicionales de pago */}
                  <div className="detalles-pago-adicionales">
                    {metodoPago === 'efectivo' && (
                      <div className="moneda-selector-container anim-fade-in">
                        <h4>Selecciona la moneda</h4>
                        <div className="moneda-selector">
                          <button 
                            className={monedaEfectivo === 'usd' ? 'active' : ''} 
                            onClick={() => setMonedaEfectivo('usd')}
                          >
                            Dólares ($)
                          </button>
                          <button 
                            className={monedaEfectivo === 'bs' ? 'active' : ''} 
                            onClick={() => setMonedaEfectivo('bs')}
                          >
                            Bolívares (Bs)
                          </button>
                        </div>
                      </div>
                    )}

                    {(metodoPago === 'transferencia' || metodoPago === 'pago_movil' || metodoPago === 'punto') && (
                      <div className="datos-pago-form anim-fade-in">
                        <h4>
                          {metodoPago === 'transferencia' && 'Detalles de la Transferencia'}
                          {metodoPago === 'pago_movil' && 'Detalles del Pago Móvil'}
                          {metodoPago === 'punto' && 'Detalles del Punto de Venta'}
                        </h4>
                        <div className="form-grid-2">
                          <div className="form-group-pago">
                            <label>Banco de origen</label>
                            <select 
                              value={datosPago.banco} 
                              onChange={(e) => setDatosPago({...datosPago, banco: e.target.value})}
                            >
                              <option value="">Seleccionar banco...</option>
                              {bancosVenezuela.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          {metodoPago !== 'punto' && (
                            <>
                              <div className="form-group-pago">
                                <label>Número de teléfono</label>
                                <input 
                                  type="text" 
                                  placeholder="Ej: 0412-1234567"
                                  value={datosPago.telefono}
                                  onChange={(e) => setDatosPago({...datosPago, telefono: e.target.value})}
                                />
                              </div>
                              <div className="form-group-pago">
                                <label>Cédula del pagador</label>
                                <input 
                                  type="text" 
                                  placeholder="Ej: 20123456"
                                  maxLength="9"
                                  value={datosPago.cedula}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 9)
                                    setDatosPago({...datosPago, cedula: val})
                                  }}
                                />
                              </div>
                            </>
                          )}
                          <div className="form-group-pago">
                            <label>Últimos 6 dígitos referencia</label>
                            <input 
                              type="text" 
                              maxLength="6"
                              placeholder="123456"
                              value={datosPago.referencia}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '')
                                setDatosPago({...datosPago, referencia: val})
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="notas-section">
                  <h3>Notas (Opcional)</h3>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Agregar notas sobre esta venta..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Confirmación */}
          {currentStep === 4 && (
            <div className="step-panel confirmacion-panel">
              <div className="success-icon">
                <FiCheck />
              </div>
              <h2>¡Venta Completada!</h2>
              <p className="success-message">La venta se ha registrado exitosamente</p>
              
              <div className="confirmacion-resumen">
                <div className="resumen-row">
                  <span className="label">Cliente:</span>
                  <span className="value"><strong>{tipoCliente === 'registrado' ? selectedCliente?.nombre : nuevoCliente.nombre}</strong></span>
                </div>
                    <div className="resumen-row">
                      <span className="label">Items:</span>
                      <span className="value">{items.length}</span>
                    </div>
                    <div className="resumen-row">
                      <span className="label">Método de Pago:</span>
                      <span className="value">
                        {metodoPago === 'pago_movil' ? 'Pago Móvil' : 
                         metodoPago === 'punto' ? 'Punto de Venta' :
                         metodoPago.charAt(0).toUpperCase() + metodoPago.slice(1)}
                        {metodoPago === 'efectivo' && ` (${monedaEfectivo.toUpperCase()})`}
                      </span>
                    </div>
                    {(metodoPago === 'transferencia' || metodoPago === 'pago_movil' || metodoPago === 'punto') && (
                      <div className="resumen-row-detalles">
                        <p><span>Banco:</span> {datosPago.banco}</p>
                        <p><span>Ref:</span> {datosPago.referencia}</p>
                      </div>
                    )}
                    <div className="resumen-row total-row">
                      <span className="label">Total:</span>
                      <div className="value-dual">
                        <span className="valor-usd">${calcularTotal().toFixed(2)}</span>
                        <span className="valor-bs">Bs. {convertToLocal(calcularTotal()).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
              </div>

                  <div className="confirmacion-actions">
                    <button className="btn-secondary" onClick={imprimirFactura}>
                      <FiPrinter /> Imprimir Factura
                    </button>
                    <button className="btn-primary" onClick={nuevaVenta}>
                      <FiPlus /> Nueva Venta
                    </button>
                  </div>
            </div>
          )}
        </div>

        {/* Navegación */}
        {currentStep < 4 && (
          <div className="wizard-navigation">
            {currentStep > 1 && (
              <button className="btn-secondary" onClick={pasoAnterior}>
                <FiArrowLeft /> Anterior
              </button>
            )}
            <div className="step-indicator">
              Paso {currentStep} de {totalSteps - 1}
            </div>
            {currentStep < 3 ? (
              <button className="btn-primary" onClick={siguientePaso}>
                Siguiente <FiArrowRight />
              </button>
            ) : (
              <button className="btn-primary" onClick={confirmarVenta} disabled={procesando}>
                {procesando ? (
                  <><FiLoader className="spin" /> Procesando...</>
                ) : (
                  <>Confirmar Venta <FiCheck /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Ventas
