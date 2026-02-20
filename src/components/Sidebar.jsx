import { 
  FiHome, 
  FiUsers, 
  FiPackage, 
  FiTruck, 
  FiMap, 
  FiBarChart2, 
  FiSettings,
  FiShoppingCart,
  FiUserCheck,
  FiTool
} from 'react-icons/fi'
import '../styles/Sidebar.css'

function Sidebar({ isOpen, currentPage, setCurrentPage }) {
  // Items del menú
  const menuItems = [
    { id: 'dashboard', icon: FiHome, label: 'Dashboard' },
    { id: 'clientes', icon: FiUsers, label: 'Clientes' },
    { id: 'botellones', icon: FiPackage, label: 'Botellones' },
    { id: 'entregas', icon: FiTruck, label: 'Entregas' },
    { id: 'ventas', icon: FiShoppingCart, label: 'Ventas' },
    { id: 'inventario', icon: FiPackage, label: 'Inventario' },
    { id: 'proveedores', icon: FiUserCheck, label: 'Proveedores' },
    { id: 'servicios', icon: FiTool, label: 'Servicios' },
    { id: 'rutas', icon: FiMap, label: 'Rutas' },
    { id: 'reportes', icon: FiBarChart2, label: 'Reportes' },
  ]

  // Verificar si estamos en configuración
  const isConfigPage = currentPage === 'configuracion' || currentPage.startsWith('config-')

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="menu-list">
        {menuItems.map(item => {
          const IconComponent = item.icon
          return (
            <li 
              key={item.id}
              className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
              title={!isOpen ? item.label : ''}
            >
              <IconComponent className="menu-icon" />
              <span className="menu-label">{item.label}</span>
            </li>
          )
        })}
      </ul>

      {/* Configuración como item único */}
      <div className="sidebar-footer">
        <div 
          className={`menu-item ${isConfigPage ? 'active' : ''}`}
          onClick={() => setCurrentPage('configuracion')}
          title={!isOpen ? 'Configuración' : ''}
        >
          <FiSettings className="menu-icon" />
          <span className="menu-label">Configuración</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
