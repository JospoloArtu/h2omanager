import { useState } from 'react'
import { FiUser, FiShoppingCart, FiDollarSign, FiCheck, FiSearch, FiPlus, FiMinus, FiTrash2, FiArrowRight, FiArrowLeft, FiPrinter } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useConfig } from '../context/ConfigContext'
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
  const [notas, setNotas] = useState('')

  // Estado para cliente no registrado
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    cedula: ''
  })

  // Estado de búsqueda de cliente
  const [searchCliente, setSearchCliente] = useState('')

  // Clientes mock
  const clientesMock = [
    { id: 1, nombre: 'Juan Pérez', cedula: '101-2023-456', telefono: '0412-1234567' },
    { id: 2, nombre: 'María García', cedula: '201-5541-001', telefono: '0424-9876543' },
    { id: 3, nombre: 'Carlos López', cedula: '105-8890-234', telefono: '0212-5551234' },
  ]

  // Productos disponibles - Botellones por litros
  const productosMock = [
    { id: 1, nombre: 'Botellón 15 Litros', litros: 15, precio: 4.50, stock: 50 },
    { id: 2, nombre: 'Botellón 20 Litros', litros: 20, precio: 6.00, stock: 75 },
    { id: 3, nombre: 'Dispensador Premium', litros: 0, precio: 25.00, stock: 10 },
    { id: 4, nombre: 'Soporte para Botellón', litros: 0, precio: 8.00, stock: 20 },
  ]

  // Filtrar clientes
  const clientesFiltrados = clientesMock.filter(c =>
    c.nombre.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.cedula.includes(searchCliente) ||
    c.telefono.includes(searchCliente)
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
    if (currentStep === 2 && items.length === 0) {
      toast.error('Agrega al menos un item')
      return false
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
  const confirmarVenta = () => {
    toast.success('Venta registrada exitosamente')
    setCurrentStep(4)
  }

  // Imprimir factura
  const imprimirFactura = () => {
    const fechaActual = new Date().toLocaleString('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const clienteInfo = tipoCliente === 'registrado' && selectedCliente 
      ? `${selectedCliente.nombre}\nCédula: ${selectedCliente.cedula}\nDirección: ${selectedCliente.direccion}`
      : `${nuevoCliente.nombre}\nCédula: ${nuevoCliente.cedula}`

    const totalUSD = calcularTotal()
    const totalBs = convertToLocal(totalUSD)

    const factura = `
═══════════════════════════════════════════
           H2O MANAGER - FACTURA
═══════════════════════════════════════════

Fecha: ${fechaActual}
Método de Pago: ${metodoPago}

───────────────────────────────────────────
CLIENTE:
───────────────────────────────────────────
${clienteInfo}

───────────────────────────────────────────
PRODUCTOS:
───────────────────────────────────────────
${items.map(item => {
  const subtotalUSD = item.precio * item.cantidad
  const subtotalBs = convertToLocal(subtotalUSD)
  return `${item.nombre}\n  Cantidad: ${item.cantidad}\n  Precio Unit: $${item.precio.toFixed(2)} (Bs. ${convertToLocal(item.precio).toFixed(2)})\n  Subtotal: $${subtotalUSD.toFixed(2)} (Bs. ${subtotalBs.toFixed(2)})`
}).join('\n\n')}

───────────────────────────────────────────
TOTAL:
───────────────────────────────────────────
  USD: $${totalUSD.toFixed(2)}
  Bs:  ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Tasa de Cambio: Bs. ${currencyConfig.tasaCambio}
${notas ? `\nNotas: ${notas}` : ''}

═══════════════════════════════════════════
        ¡Gracias por su compra!
═══════════════════════════════════════════
    `

    // Crear ventana de impresión
    const ventanaImpresion = window.open('', '', 'width=800,height=600')
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Factura - H2O Manager</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            pre {
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.5;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <pre>${factura}</pre>
          <script>
            window.onload = () => {
              window.print()
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
                    {clientesFiltrados.map((cliente) => (
                      <div
                        key={cliente.id}
                        className={`cliente-card ${selectedCliente?.id === cliente.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCliente(cliente)}
                      >
                        <div className="cliente-avatar-large">
                          {cliente.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
                    ))}
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
                        placeholder="Ej: 101-2023-456"
                        value={nuevoCliente.cedula}
                        onChange={(e) => setNuevoCliente({...nuevoCliente, cedula: e.target.value})}
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
                    {productosMock.map((producto) => {
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
                        <FiDollarSign />
                        <span>Transferencia</span>
                      </div>
                    </label>
                    <label className={`metodo-pago-card ${metodoPago === 'tarjeta' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="tarjeta"
                        checked={metodoPago === 'tarjeta'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="metodo-info">
                        <FiDollarSign />
                        <span>Tarjeta</span>
                      </div>
                    </label>
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
                      <span className="value">{metodoPago.charAt(0).toUpperCase() + metodoPago.slice(1)}</span>
                    </div>
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
              <button className="btn-primary" onClick={confirmarVenta}>
                Confirmar Venta <FiCheck />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Ventas
