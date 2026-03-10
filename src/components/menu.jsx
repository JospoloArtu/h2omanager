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
    FiClock,
    FiTool,
    FiChevronLeft,
    FiChevronRight,
    FiMenu
} from 'react-icons/fi'
import { TbBottle } from 'react-icons/tb'
import '../assets/css/menu.css'
import Logo from '../../public/Logo.webp'

const MENU_GERENTE = [
    { id: 'dashboard',   icon: FiHome,        label: 'Dashboard'   },
    { id: 'clientes',    icon: FiUsers,       label: 'Clientes'    },
    { id: 'botellones',  icon: FiPackage,     label: 'Botellones'  },
    { id: 'entregas',    icon: FiTruck,       label: 'Entregas'    },
    { id: 'ventas',      icon: FiShoppingCart,label: 'Ventas'      },
    { id: 'empleados',   icon: FiUserCheck,   label: 'Empleados'   },
    { id: 'historial',   icon: FiClock,       label: 'Historial'   },
    { id: 'inventario',  icon: FiPackage,     label: 'Inventario'  },
    { id: 'proveedores', icon: FiUserCheck,   label: 'Proveedores' },
    { id: 'servicios',   icon: FiTool,        label: 'Servicios'   },
    { id: 'rutas',       icon: FiMap,         label: 'Rutas'       },
    { id: 'reportes',    icon: FiBarChart2,   label: 'Reportes'    },
]

const MENU_EMPLEADO = [
    { id: 'dashboard',  icon: FiHome,         label: 'Dashboard'  },
    { id: 'clientes',   icon: FiUsers,        label: 'Clientes'   },
    { id: 'botellones', icon: FiPackage,      label: 'Botellones' },
    { id: 'entregas',   icon: FiTruck,        label: 'Entregas'   },
    { id: 'ventas',     icon: FiShoppingCart, label: 'Ventas'     },
    { id: 'historial',  icon: FiClock,        label: 'Historial'  },
    { id: 'inventario', icon: FiPackage,      label: 'Inventario' },
]

const MENU_BY_ROLE = {
    1: MENU_GERENTE,
    2: MENU_EMPLEADO,
}

export default function Sidebar({ isOpen, onToggle, currentPage, setCurrentPage, role }) {
    // Si no hay rol o es desconocido → gerente por defecto
    const menuItems = MENU_BY_ROLE[role] ?? MENU_GERENTE

    const isConfigPage = currentPage === 'configuracion' || currentPage?.startsWith('config-')

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>

            {/* Brand */}
            <div className="sidebar-brand">
                <button
                    className="sidebar-toggle"
                    onClick={onToggle}
                    aria-label={isOpen ? "Colapsar menú" : "Expandir menú"}
                >
                    {isOpen ? <FiChevronLeft /> : <FiMenu />}
                </button>
            </div>

            {/* Role badge */}
            {isOpen && (
                <div className="role-badge">
                    <span className={`role-pill role-${role === 2 ? 'empleado' : 'gerente'}`}>
                        {role === 2 ? 'Empleado' : 'Gerente'}
                    </span>
                </div>
            )}

            {isOpen && <p className="nav-section-label">Menú principal</p>}

            {/* Menu */}
            <ul className="menu-list">
                {menuItems.map(({ id, icon: Icon, label }) => (
                    <li
                        key={id}
                        className={`menu-item ${currentPage === id ? 'active' : ''}`}
                        onClick={() => setCurrentPage(id)}
                        title={!isOpen ? label : ''}
                    >
                        <span className="menu-icon-wrap">
                            <Icon className="menu-icon" />
                        </span>
                        {isOpen && <span className="menu-label">{label}</span>}
                        {isOpen && currentPage === id && <span className="active-dot" />}
                    </li>
                ))}
            </ul>

            {/* Footer — Configuración (solo gerente) */}
            {(role === 1 || !role) && (
                <div className="sidebar-footer">
                    <div
                        className={`menu-item ${isConfigPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage('configuracion')}
                        title={!isOpen ? 'Configuración' : ''}
                    >
                        <span className="menu-icon-wrap">
                            <FiSettings className="menu-icon" />
                        </span>
                        {isOpen && <span className="menu-label">Configuración</span>}
                    </div>
                </div>
            )}

        </aside>
    )
}