import { useState, useEffect } from 'react'
import { FiPackage, FiSearch, FiLoader, FiShoppingCart } from 'react-icons/fi'
import { useConfig } from '../context/ConfigContext'
import { botoellonesService } from '../services/dataService'
import '../styles/Inventario.css'

const Inventario = () => {
  const { formatDualPrice } = useConfig()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        setLoading(true)
        const res = await botoellonesService.getInventario()
        const data = res.data || []
        
        if (data.length === 0) {
          // Mock fallback
          setProductos([
            { id: 1, nombre: 'Botellón 15 Litros', precio: 4.5, stock: 45, categoria: 'Agua' },
            { id: 2, nombre: 'Botellón 20 Litros', precio: 6.0, stock: 120, categoria: 'Agua' },
            { id: 3, nombre: 'Dispensador Premium', precio: 25.0, stock: 12, categoria: 'Accesorios' },
            { id: 4, nombre: 'Soporte Metálico', precio: 12.0, stock: 25, categoria: 'Accesorios' },
            { id: 5, nombre: 'Bomba Eléctrica', precio: 15.0, stock: 18, categoria: 'Accesorios' }
          ])
        } else {
          setProductos(data)
        }
      } catch (error) {
        console.error('Error al cargar inventario:', error)
        // Mock en caso de error
        setProductos([
          { id: 1, nombre: 'Producto Mock 1', precio: 5.0, stock: 10, categoria: 'General' },
          { id: 2, nombre: 'Producto Mock 2', precio: 10.0, stock: 5, categoria: 'General' }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchInventario()
  }, [])

  const filteredProducts = productos.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.categoria && p.categoria.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="inventario-page">
      <div className="inventario-header">
        <div>
          <h1>Inventario de Ventas</h1>
          <p className="subtitle">Gestión y visualización de productos disponibles</p>
        </div>
        <div className="search-box">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <FiLoader className="spin" />
          <p>Cargando inventario...</p>
        </div>
      ) : (
        <div className="inventario-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => {
              const prices = formatDualPrice(p.precio)
              return (
                <div key={p.id} className="inventario-card">
                  <div className="card-icon">
                    <FiPackage />
                  </div>
                  <div className="card-body">
                    <span className="categoria">{p.categoria || 'Producto'}</span>
                    <h3>{p.nombre}</h3>
                    <div className="prices">
                      <span className="price-usd">{prices.usd}</span>
                      <span className="price-local">{prices.local}</span>
                    </div>
                    <div className="stock-info">
                      <div className="stock-label">Disponibilidad</div>
                      <div className={`stock-value ${p.stock < 10 ? 'low' : ''}`}>
                        {p.stock} unidades
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="no-results">
              <FiPackage />
              <p>No se encontraron productos que coincidan con la búsqueda</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Inventario
